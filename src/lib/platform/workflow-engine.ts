import { toAppError } from "@/lib/api/errors";
import * as workflowsApi from "@/lib/api/workflows";
import type { WorkflowStatus } from "@/lib/api/workflows";

/**
 * Modular workflow engine.
 *
 * A workflow is an ordered list of steps operating on a shared, typed context.
 * Every run and every step is persisted (`workflow_runs` / `workflow_run_steps`)
 * so automations are observable in production. Future channel automations
 * (WhatsApp, Voice AI, Email) register their own steps here without touching
 * the engine.
 */

export type WorkflowActor = {
  userId: string | null;
  companyId: string | null;
};

export type WorkflowRunContext<TInput, TState extends Record<string, unknown>> = {
  actor: WorkflowActor;
  input: TInput;
  state: TState;
  runId: string | null;
};

export type WorkflowStep<TInput, TState extends Record<string, unknown>> = {
  key: string;
  label: string;
  /** Skip conditionally (e.g. steps that require an authenticated actor). */
  skipIf?: (ctx: WorkflowRunContext<TInput, TState>) => boolean;
  /** A failing optional step marks itself failed but lets the run continue. */
  optional?: boolean;
  run: (ctx: WorkflowRunContext<TInput, TState>) => Promise<Partial<TState> | void>;
};

export type WorkflowDefinition<TInput, TState extends Record<string, unknown>> = {
  key: string;
  label: string;
  description?: string;
  steps: WorkflowStep<TInput, TState>[];
};

export type WorkflowStepResult = {
  key: string;
  label: string;
  status: WorkflowStatus;
  error?: string;
};

export type WorkflowResult<TState> = {
  status: WorkflowStatus;
  runId: string | null;
  state: TState;
  steps: WorkflowStepResult[];
  error?: string;
};

export async function runWorkflow<TInput, TState extends Record<string, unknown>>(
  definition: WorkflowDefinition<TInput, TState>,
  options: {
    actor: WorkflowActor;
    input: TInput;
    initialState: TState;
    triggerSource?: string;
  },
): Promise<WorkflowResult<TState>> {
  const { actor, input, initialState } = options;

  // Runs are only persisted for authenticated actors; guest flows still execute.
  const run = actor.userId
    ? await workflowsApi.createRun({
        userId: actor.userId,
        companyId: actor.companyId,
        workflowKey: definition.key,
        triggerSource: options.triggerSource ?? "app",
        payload: input as unknown as Record<string, unknown>,
      })
    : null;

  const ctx: WorkflowRunContext<TInput, TState> = {
    actor,
    input,
    state: { ...initialState },
    runId: run?.id ?? null,
  };

  const steps: WorkflowStepResult[] = [];
  let index = 0;
  let failure: string | undefined;

  for (const step of definition.steps) {
    index += 1;
    const startedAt = new Date().toISOString();

    if (step.skipIf?.(ctx)) {
      steps.push({ key: step.key, label: step.label, status: "cancelled" });
      if (run) {
        await workflowsApi.recordStep({
          runId: run.id,
          stepKey: step.key,
          label: step.label,
          orderIndex: index,
          status: "cancelled",
          startedAt,
          finishedAt: startedAt,
        });
      }
      continue;
    }

    try {
      const patch = await step.run(ctx);
      if (patch) Object.assign(ctx.state, patch);
      steps.push({ key: step.key, label: step.label, status: "completed" });
      if (run) {
        await workflowsApi.recordStep({
          runId: run.id,
          stepKey: step.key,
          label: step.label,
          orderIndex: index,
          status: "completed",
          output: (patch ?? {}) as Record<string, unknown>,
          startedAt,
          finishedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      const appError = toAppError(error, `workflow:${definition.key}:${step.key}`);
      steps.push({
        key: step.key,
        label: step.label,
        status: "failed",
        error: appError.message,
      });
      if (run) {
        await workflowsApi.recordStep({
          runId: run.id,
          stepKey: step.key,
          label: step.label,
          orderIndex: index,
          status: "failed",
          error: appError.message,
          startedAt,
          finishedAt: new Date().toISOString(),
        });
      }
      if (!step.optional) {
        failure = appError.message;
        break;
      }
    }
  }

  const status: WorkflowStatus = failure ? "failed" : "completed";
  if (run) {
    await workflowsApi.finishRun({
      runId: run.id,
      status,
      output: ctx.state as Record<string, unknown>,
      error: failure ?? null,
    });
  }

  return {
    status,
    runId: run?.id ?? null,
    state: ctx.state,
    steps,
    ...(failure ? { error: failure } : {}),
  };
}
