import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { unwrap, unwrapList } from "./errors";

export type SubscriptionRow = Database["public"]["Tables"]["billing_subscriptions"]["Row"];
export type InvoiceRow = Database["public"]["Tables"]["billing_invoices"]["Row"];

/**
 * Reads the company's subscription. Returns null when no payment provider has
 * created one yet — the UI must render an honest "no active plan" state.
 */
export async function fetchSubscription(companyId: string): Promise<SubscriptionRow | null> {
  return unwrap(
    await supabase
      .from("billing_subscriptions")
      .select("*")
      .eq("company_id", companyId)
      .maybeSingle(),
    "billing.fetchSubscription",
  );
}

export async function fetchInvoices(companyId: string, limit = 12): Promise<InvoiceRow[]> {
  return unwrapList(
    await supabase
      .from("billing_invoices")
      .select("*")
      .eq("company_id", companyId)
      .order("issued_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(limit),
    "billing.fetchInvoices",
  );
}

/** Paid invoices only — used for the payment history table. */
export async function fetchPayments(companyId: string, limit = 12): Promise<InvoiceRow[]> {
  return unwrapList(
    await supabase
      .from("billing_invoices")
      .select("*")
      .eq("company_id", companyId)
      .eq("status", "paid")
      .order("paid_at", { ascending: false, nullsFirst: false })
      .limit(limit),
    "billing.fetchPayments",
  );
}

export type BillingUsage = {
  agents: number;
  chatMessages: number;
  leads: number;
  storageBytes: number;
  files: number;
};

/** Every number below is a live COUNT/SUM against real rows — never estimated. */
export async function fetchUsage(companyId: string): Promise<BillingUsage> {
  const [agents, chats, leads, files] = await Promise.all([
    supabase
      .from("ai_agents")
      .select("id", { count: "exact", head: true })
      .eq("company_id", companyId)
      .eq("archived", false),
    supabase.from("ai_chat_messages").select("id", { count: "exact", head: true }),
    supabase
      .from("crm_leads")
      .select("id", { count: "exact", head: true })
      .eq("archived", false),
    supabase.from("file_objects").select("size_bytes").eq("company_id", companyId),
  ]);

  for (const result of [agents, chats, leads, files]) {
    if (result.error) unwrap({ data: null, error: result.error }, "billing.fetchUsage");
  }

  const fileRows = (files.data ?? []) as { size_bytes: number | null }[];

  return {
    agents: agents.count ?? 0,
    chatMessages: chats.count ?? 0,
    leads: leads.count ?? 0,
    files: fileRows.length,
    storageBytes: fileRows.reduce((sum, row) => sum + Number(row.size_bytes ?? 0), 0),
  };
}

export function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** i;
  return `${value >= 10 || i === 0 ? Math.round(value) : value.toFixed(1)} ${units[i]}`;
}

export function formatInvoiceAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("az-AZ", { style: "currency", currency }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}
