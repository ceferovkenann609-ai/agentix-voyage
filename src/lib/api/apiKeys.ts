import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { unwrap, unwrapList, unwrapRequired } from "./errors";

export type ApiKeyRow = Database["public"]["Tables"]["api_keys"]["Row"];

/** Only the prefix + a SHA-256 hash are persisted; the raw key is shown once. */
async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomSecret(length = 40): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export async function fetchApiKeys(companyId: string): Promise<ApiKeyRow[]> {
  return unwrapList(
    await supabase
      .from("api_keys")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false }),
    "apiKeys.fetch",
  );
}

export type CreatedApiKey = { record: ApiKeyRow; secret: string };

export async function createApiKey(input: {
  companyId: string;
  userId: string;
  name: string;
}): Promise<CreatedApiKey> {
  const secret = `agx_live_${randomSecret()}`;
  const record = unwrapRequired<ApiKeyRow>(
    await supabase
      .from("api_keys")
      .insert({
        company_id: input.companyId,
        created_by: input.userId,
        name: input.name,
        key_prefix: secret.slice(0, 16),
        key_hash: await sha256Hex(secret),
      })
      .select("*")
      .single(),
    "apiKeys.create",
  );
  return { record, secret };
}

export async function revokeApiKey(id: string): Promise<void> {
  const { error } = await supabase
    .from("api_keys")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id);
  if (error) unwrap({ data: null, error }, "apiKeys.revoke");
}

export async function deleteApiKey(id: string): Promise<void> {
  const { error } = await supabase.from("api_keys").delete().eq("id", id);
  if (error) unwrap({ data: null, error }, "apiKeys.delete");
}
