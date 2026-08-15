import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { unwrapList } from "./errors";

export type ContactSubmissionRow = Database["public"]["Tables"]["contact_submissions"]["Row"];
export type DemoBookingRow = Database["public"]["Tables"]["demo_bookings"]["Row"];

export type SupportRequest = {
  id: string;
  kind: "contact" | "demo";
  subject: string;
  message: string | null;
  createdAt: Date;
};

/**
 * The schema has no dedicated ticket table, so a user's real support history is
 * their own contact submissions and demo bookings. Nothing is synthesised.
 */
export async function fetchSupportRequests(userId: string): Promise<SupportRequest[]> {
  const [contacts, demos] = await Promise.all([
    supabase
      .from("contact_submissions")
      .select("id, subject, message, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("demo_bookings")
      .select("id, service, message, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const contactRows = unwrapList(contacts, "support.contacts") as Pick<
    ContactSubmissionRow,
    "id" | "subject" | "message" | "created_at"
  >[];
  const demoRows = unwrapList(demos, "support.demos") as Pick<
    DemoBookingRow,
    "id" | "service" | "message" | "created_at"
  >[];

  const requests: SupportRequest[] = [
    ...contactRows.map((r) => ({
      id: r.id,
      kind: "contact" as const,
      subject: r.subject?.trim() || "Əlaqə müraciəti",
      message: r.message,
      createdAt: new Date(r.created_at),
    })),
    ...demoRows.map((r) => ({
      id: r.id,
      kind: "demo" as const,
      subject: r.service?.trim() ? `Demo sorğusu — ${r.service}` : "Demo sorğusu",
      message: r.message,
      createdAt: new Date(r.created_at),
    })),
  ];

  requests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return requests;
}

export type SubmitSupportRequestInput = {
  userId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string | null;
  locale?: string | null;
};

/**
 * Creates a real contact submission (used by in-app request flows such as plan
 * upgrades and payment-method requests). It shows up in support history.
 */
export async function submitSupportRequest(input: SubmitSupportRequestInput): Promise<void> {
  const { error } = await supabase.from("contact_submissions").insert({
    user_id: input.userId,
    name: input.name,
    email: input.email,
    subject: input.subject,
    message: input.message,
    company: input.company ?? null,
    locale: input.locale ?? null,
  });
  if (error) throw error;
}
