import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { bestEffort, unwrap, unwrapList } from "./errors";

export type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];
export type NotificationStatus = Database["public"]["Enums"]["notification_status"];
export type NotificationPriority = Database["public"]["Enums"]["activity_priority"];

export const NOTIFICATION_CATEGORIES = {
  demo: "demo",
  contact: "contact",
  lead: "lead",
  workflow: "workflow",
  agent: "agent",
  system: "system",
  billing: "billing",
} as const;

export type NotificationCategory =
  (typeof NOTIFICATION_CATEGORIES)[keyof typeof NOTIFICATION_CATEGORIES];

export type CreateNotificationInput = {
  userId: string | null | undefined;
  companyId?: string | null | undefined;
  category: NotificationCategory | string;
  title: string;
  body?: string | null;
  priority?: NotificationPriority;
  entityType?: string | null;
  entityId?: string | null;
  link?: string | null;
  metadata?: Record<string, unknown>;
};

/** Fire-and-forget notification creation; never breaks the caller's flow. */
export async function createNotification(input: CreateNotificationInput): Promise<void> {
  if (!input.userId) return;
  await bestEffort("notifications.create", async () => {
    const { error } = await supabase.from("notifications").insert({
      user_id: input.userId as string,
      company_id: input.companyId ?? null,
      category: input.category,
      title: input.title,
      body: input.body ?? null,
      priority: input.priority ?? "normal",
      entity_type: input.entityType ?? null,
      entity_id: input.entityId ?? null,
      link: input.link ?? null,
      metadata: (input.metadata ?? {}) as never,
    });
    if (error) throw error;
    return true;
  });
}

export async function fetchNotifications(opts: {
  status?: NotificationStatus | "all";
  limit?: number;
}): Promise<NotificationRow[]> {
  let query = supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(opts.limit ?? 30);

  if (opts.status && opts.status !== "all") query = query.eq("status", opts.status);

  return unwrapList(await query, "notifications.fetch");
}

export async function fetchUnreadCount(): Promise<number> {
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("status", "unread");
  if (error) unwrap({ data: null, error }, "notifications.unreadCount");
  return count ?? 0;
}

export async function setNotificationStatus(
  id: string,
  status: NotificationStatus,
): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ status, read_at: status === "unread" ? null : new Date().toISOString() })
    .eq("id", id);
  if (error) unwrap({ data: null, error }, "notifications.setStatus");
}

export async function markAllRead(): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ status: "read", read_at: new Date().toISOString() })
    .eq("status", "unread");
  if (error) unwrap({ data: null, error }, "notifications.markAllRead");
}

export async function deleteNotification(id: string): Promise<void> {
  const { error } = await supabase.from("notifications").delete().eq("id", id);
  if (error) unwrap({ data: null, error }, "notifications.delete");
}
