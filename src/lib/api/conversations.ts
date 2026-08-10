import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { unwrapList } from "./errors";

export type ChatMessageRow = Database["public"]["Tables"]["ai_chat_messages"]["Row"];

export type ThreadMessage = {
  id: string;
  from: "user" | "ai" | "agent";
  text: string;
  createdAt: Date;
};

export type Conversation = {
  id: string;
  title: string;
  preview: string;
  locale: string;
  messageCount: number;
  firstContact: Date;
  lastActivity: Date;
  messages: ThreadMessage[];
};

/**
 * Groups the signed-in user's real ai_chat_messages rows into conversations by
 * session. No synthetic sessions are ever produced.
 */
export async function fetchConversations(userId: string): Promise<Conversation[]> {
  const rows = unwrapList(
    await supabase
      .from("ai_chat_messages")
      .select("id, session_id, sender, message, locale, created_at, user_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: true }),
    "conversations.fetch",
  ) as Pick<
    ChatMessageRow,
    "id" | "session_id" | "sender" | "message" | "locale" | "created_at" | "user_id"
  >[];

  const bySession = new Map<string, typeof rows>();
  for (const row of rows) {
    const list = bySession.get(row.session_id) ?? [];
    list.push(row);
    bySession.set(row.session_id, list);
  }

  const conversations: Conversation[] = [];
  for (const [sessionId, sessionRows] of bySession.entries()) {
    const first = sessionRows[0]!;
    const last = sessionRows[sessionRows.length - 1]!;
    const firstUserMsg = sessionRows.find((r) => r.sender === "user");
    conversations.push({
      id: sessionId,
      title: firstUserMsg?.message?.slice(0, 60) || "Naməlum söhbət",
      preview: last.message?.slice(0, 120) ?? "",
      locale: sessionRows.find((r) => r.locale)?.locale ?? "—",
      messageCount: sessionRows.length,
      firstContact: new Date(first.created_at),
      lastActivity: new Date(last.created_at),
      messages: sessionRows.map((r) => ({
        id: r.id,
        from: r.sender === "user" ? "user" : r.sender === "agent" ? "agent" : "ai",
        text: r.message,
        createdAt: new Date(r.created_at),
      })),
    });
  }

  conversations.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
  return conversations;
}

/** Persists an operator reply into the same real conversation thread. */
export async function sendOperatorReply(input: {
  sessionId: string;
  userId: string;
  message: string;
  locale?: string | null;
}): Promise<void> {
  const { error } = await supabase.from("ai_chat_messages").insert({
    session_id: input.sessionId,
    user_id: input.userId,
    sender: "agent",
    message: input.message,
    locale: input.locale ?? null,
  });
  if (error) throw error;
}
