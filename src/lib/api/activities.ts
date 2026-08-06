import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { bestEffort, unwrapList } from "./errors";

export type ActivityPriority = Database["public"]["Enums"]["activity_priority"];
export type ActivityRow = Database["public"]["Tables"]["activities"]["Row"];

/**
 * Canonical activity types. Anything that changes meaningful state in the
 * platform must log one of these, so timelines stay consistent across modules.
 */
export const ACTIVITY_TYPES = {
  leadCreated: "lead.created",
  leadUpdated: "lead.updated",
  leadArchived: "lead.archived",
  demoBooked: "demo.booked",
  contactSubmitted: "contact.submitted",
  newsletterSubscribed: "newsletter.subscribed",
  companyUpdated: "company.updated",
  memberRoleChanged: "member.role_changed",
  agentCreated: "agent.created",
  agentUpdated: "agent.updated",
  agentDeleted: "agent.deleted",
  workflowStarted: "workflow.started",
  workflowFinished: "workflow.finished",
  workflowFailed: "workflow.failed",
  settingsChanged: "settings.changed",
  profileUpdated: "profile.updated",
  fileUploaded: "file.uploaded",
} as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[keyof typeof ACTIVITY_TYPES];

export type LogActivityInput = {
  userId: string | null | undefined;
  companyId?: string | null | undefined;
  type: ActivityType | string;
  title: string;
  description?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  priority?: ActivityPriority;
  metadata?: Record<string, unknown>;
};

/**
 * Writes an activity record. Logging is a side effect: it never throws and
 * never blocks the caller's primary operation.
 */
export async function logActivity(input: LogActivityInput): Promise<void> {
  if (!input.userId) return;
  await bestEffort("activities.logActivity", async () => {
    const { error } = await supabase.from("activities").insert({
      user_id: input.userId as string,
      company_id: input.companyId ?? null,
      type: input.type,
      title: input.title,
      description: input.description ?? null,
      entity_type: input.entityType ?? null,
      entity_id: input.entityId ?? null,
      priority: input.priority ?? "normal",
      metadata: (input.metadata ?? {}) as never,
    });
    if (error) throw error;
    return true;
  });
}

export async function fetchActivities(opts: {
  companyId?: string | null;
  limit?: number;
}): Promise<ActivityRow[]> {
  let query = supabase
    .from("activities")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(opts.limit ?? 20);

  if (opts.companyId) query = query.eq("company_id", opts.companyId);

  return unwrapList(await query, "activities.fetchActivities");
}

export async function fetchEntityActivities(
  entityType: string,
  entityId: string,
): Promise<ActivityRow[]> {
  return unwrapList(
    await supabase
      .from("activities")
      .select("*")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .order("created_at", { ascending: false }),
    "activities.fetchEntityActivities",
  );
}
