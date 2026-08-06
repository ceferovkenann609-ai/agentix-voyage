import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { bestEffort, unwrapList, unwrapRequired } from "./errors";

export type WorkflowStatus = Database["public"]["Enums"]["workflow_status"];
export type WorkflowRunRow = Database["public"]["Tables"]["workflow_runs"]["Row"];
export type WorkflowStepRow = Database["public"]["Tables"]["workflow_run_steps"]["Row"];

export type WorkflowRunWithSteps = WorkflowRunRow & { steps: WorkflowStepRow[] };

export async function createRun(input: {
  userId: string;
  companyId?: string | null;
  workflowKey: string;
  triggerSource?: string | null;
  payload?: Record<string, unknown>;
}): Promise<WorkflowRunRow | null> {
  return bestEffort("workflows.createRun", async () =>
    unwrapRequired<WorkflowRunRow>(
      await supabase
        .from("workflow_runs")
        .insert({
          user_id: input.userId,
          company_id: input.companyId ?? null,
          workflow_key: input.workflowKey,
          trigger_source: input.triggerSource ?? null,
          status: "running",
          input: (input.payload ?? {}) as never,
        })
        .select("*")
        .single(),
      "workflows.createRun",
    ),
  );
}

export async function recordStep(input: {
  runId: string;
  stepKey: string;
  label?: string | null;
  orderIndex: number;
  status: WorkflowStatus;
  output?: Record<string, unknown>;
  error?: string | null;
  startedAt?: string | null;
  finishedAt?: string | null;
}): Promise<void> {
  await bestEffort("workflows.recordStep", async () => {
    const { error } = await supabase.from("workflow_run_steps").insert({
      run_id: input.runId,
      step_key: input.stepKey,
      label: input.label ?? null,
      order_index: input.orderIndex,
      status: input.status,
      output: (input.output ?? {}) as never,
      error: input.error ?? null,
      started_at: input.startedAt ?? null,
      finished_at: input.finishedAt ?? null,
    });
    if (error) throw error;
    return true;
  });
}

export async function finishRun(input: {
  runId: string;
  status: WorkflowStatus;
  output?: Record<string, unknown>;
  error?: string | null;
}): Promise<void> {
  await bestEffort("workflows.finishRun", async () => {
    const { error } = await supabase
      .from("workflow_runs")
      .update({
        status: input.status,
        output: (input.output ?? {}) as never,
        error: input.error ?? null,
        finished_at: new Date().toISOString(),
      })
      .eq("id", input.runId);
    if (error) throw error;
    return true;
  });
}

export async function fetchRuns(opts: {
  companyId?: string | null;
  limit?: number;
}): Promise<WorkflowRunRow[]> {
  let query = supabase
    .from("workflow_runs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(opts.limit ?? 20);
  if (opts.companyId) query = query.eq("company_id", opts.companyId);
  return unwrapList(await query, "workflows.fetchRuns");
}

export async function fetchRunSteps(runId: string): Promise<WorkflowStepRow[]> {
  return unwrapList(
    await supabase
      .from("workflow_run_steps")
      .select("*")
      .eq("run_id", runId)
      .order("order_index", { ascending: true }),
    "workflows.fetchRunSteps",
  );
}
