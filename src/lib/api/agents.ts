import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { unwrap, unwrapList, unwrapRequired } from "./errors";

export type AgentKind = Database["public"]["Enums"]["ai_agent_kind"];
export type AgentStatus = Database["public"]["Enums"]["ai_agent_status"];
export type AgentRow = Database["public"]["Tables"]["ai_agents"]["Row"];

export type CreateAgentInput = {
  companyId: string;
  userId: string;
  name: string;
  kind: AgentKind;
  description?: string | null;
  language?: string;
  model?: string | null;
  systemPrompt?: string | null;
  channels?: string[];
  config?: Record<string, unknown>;
};

export async function fetchAgents(companyId: string): Promise<AgentRow[]> {
  return unwrapList(
    await supabase
      .from("ai_agents")
      .select("*")
      .eq("company_id", companyId)
      .eq("archived", false)
      .order("created_at", { ascending: false }),
    "agents.fetchAgents",
  );
}

export async function fetchAgent(agentId: string): Promise<AgentRow | null> {
  return unwrap(
    await supabase.from("ai_agents").select("*").eq("id", agentId).maybeSingle(),
    "agents.fetchAgent",
  );
}

export async function createAgent(input: CreateAgentInput): Promise<AgentRow> {
  return unwrapRequired<AgentRow>(
    await supabase
      .from("ai_agents")
      .insert({
        company_id: input.companyId,
        created_by: input.userId,
        name: input.name,
        kind: input.kind,
        status: "draft",
        description: input.description ?? null,
        language: input.language ?? "az",
        model: input.model ?? null,
        system_prompt: input.systemPrompt ?? null,
        channels: input.channels ?? [],
        config: (input.config ?? {}) as never,
      })
      .select("*")
      .single(),
    "agents.createAgent",
  );
}

export type AgentPatch = Partial<
  Pick<
    AgentRow,
    | "name"
    | "kind"
    | "status"
    | "description"
    | "language"
    | "model"
    | "system_prompt"
    | "channels"
    | "archived"
  >
> & { config?: Record<string, unknown> };

export async function updateAgent(agentId: string, patch: AgentPatch): Promise<void> {
  const { config, ...rest } = patch;
  const { error } = await supabase
    .from("ai_agents")
    .update({ ...rest, ...(config ? { config: config as never } : {}) })
    .eq("id", agentId);
  if (error) unwrap({ data: null, error }, "agents.updateAgent");
}

export async function archiveAgent(agentId: string): Promise<void> {
  await updateAgent(agentId, { archived: true, status: "paused" });
}

export async function deleteAgent(agentId: string): Promise<void> {
  const { error } = await supabase.from("ai_agents").delete().eq("id", agentId);
  if (error) unwrap({ data: null, error }, "agents.deleteAgent");
}
