import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { unwrap, unwrapList, unwrapRequired } from "./errors";

export type AppRole = Database["public"]["Enums"]["app_role"];
export type CompanyRow = Database["public"]["Tables"]["companies"]["Row"];
export type CompanyMemberRow = Database["public"]["Tables"]["company_members"]["Row"];

export type Membership = {
  role: AppRole;
  company: CompanyRow;
};

export type CompanyMember = CompanyMemberRow & {
  profile: { full_name: string | null; avatar_url: string | null } | null;
};

export const ROLE_LABEL: Record<AppRole, { az: string; en: string }> = {
  owner: { az: "Sahib", en: "Owner" },
  admin: { az: "Administrator", en: "Admin" },
  manager: { az: "Menecer", en: "Manager" },
  employee: { az: "Əməkdaş", en: "Employee" },
};

/** All companies the signed-in user belongs to, with their role in each. */
export async function fetchMyMemberships(): Promise<Membership[]> {
  const rows = unwrapList(
    await supabase
      .from("company_members")
      .select("role, companies!inner(*)")
      .order("created_at", { ascending: true }),
    "companies.fetchMyMemberships",
  ) as unknown as { role: AppRole; companies: CompanyRow }[];

  return rows
    .filter((row) => !!row.companies)
    .map((row) => ({ role: row.role, company: row.companies }));
}

export async function fetchCompany(companyId: string): Promise<CompanyRow | null> {
  return unwrap(
    await supabase.from("companies").select("*").eq("id", companyId).maybeSingle(),
    "companies.fetchCompany",
  );
}

export type CompanyPatch = Partial<
  Pick<CompanyRow, "name" | "industry" | "website" | "logo_url" | "locale" | "slug">
>;

export async function updateCompany(companyId: string, patch: CompanyPatch): Promise<void> {
  unwrap(
    await supabase.from("companies").update(patch).eq("id", companyId).select("id").maybeSingle(),
    "companies.updateCompany",
  );
}

/** Creates a company and makes the caller its owner. */
export async function createCompany(userId: string, name: string): Promise<CompanyRow> {
  const company = unwrapRequired<CompanyRow>(
    await supabase.from("companies").insert({ name, owner_id: userId }).select("*").single(),
    "companies.createCompany",
  );
  unwrap(
    await supabase
      .from("company_members")
      .insert({ company_id: company.id, user_id: userId, role: "owner" })
      .select("id")
      .single(),
    "companies.createCompany.member",
  );
  return company;
}

export async function fetchCompanyMembers(companyId: string): Promise<CompanyMember[]> {
  const rows = unwrapList(
    await supabase
      .from("company_members")
      .select("*, profiles:profiles!company_members_user_id_fkey(full_name, avatar_url)")
      .eq("company_id", companyId)
      .order("created_at", { ascending: true }),
    "companies.fetchCompanyMembers",
  ) as unknown as (CompanyMemberRow & {
    profiles: { full_name: string | null; avatar_url: string | null } | null;
  })[];

  return rows.map(({ profiles, ...member }) => ({ ...member, profile: profiles ?? null }));
}

export async function updateMemberRole(memberId: string, role: AppRole): Promise<void> {
  unwrap(
    await supabase.from("company_members").update({ role }).eq("id", memberId).select("id").maybeSingle(),
    "companies.updateMemberRole",
  );
}

export async function removeMember(memberId: string): Promise<void> {
  const { error } = await supabase.from("company_members").delete().eq("id", memberId);
  if (error) unwrap({ data: null, error }, "companies.removeMember");
}
