import type { AppRole } from "@/lib/api/companies";

/**
 * Role Based Access Control.
 * Permissions are declarative so every page can gate UI without touching auth
 * logic, and server-side RLS mirrors the same rules in Postgres policies.
 */
export const PERMISSIONS = [
  "company.view",
  "company.edit",
  "members.view",
  "members.manage",
  "leads.view",
  "leads.create",
  "leads.edit",
  "leads.delete",
  "agents.view",
  "agents.create",
  "agents.edit",
  "agents.delete",
  "workflows.view",
  "workflows.run",
  "conversations.view",
  "analytics.view",
  "billing.view",
  "billing.manage",
  "settings.view",
  "settings.manage",
  "files.view",
  "files.upload",
  "files.delete",
  "demos.view",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const EMPLOYEE: Permission[] = [
  "company.view",
  "members.view",
  "leads.view",
  "leads.create",
  "agents.view",
  "workflows.view",
  "conversations.view",
  "settings.view",
  "files.view",
  "files.upload",
  "demos.view",
];

const MANAGER: Permission[] = [
  ...EMPLOYEE,
  "leads.edit",
  "agents.create",
  "agents.edit",
  "workflows.run",
  "analytics.view",
  "files.delete",
];

const ADMIN: Permission[] = [
  ...MANAGER,
  "company.edit",
  "members.manage",
  "leads.delete",
  "agents.delete",
  "billing.view",
  "settings.manage",
];

const OWNER: Permission[] = [...ADMIN, "billing.manage"];

export const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
  owner: OWNER,
  admin: ADMIN,
  manager: MANAGER,
  employee: EMPLOYEE,
};

export const ROLE_RANK: Record<AppRole, number> = {
  owner: 4,
  admin: 3,
  manager: 2,
  employee: 1,
};

export function can(role: AppRole | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function canAny(role: AppRole | null | undefined, permissions: Permission[]): boolean {
  return permissions.some((p) => can(role, p));
}

export function atLeast(role: AppRole | null | undefined, minimum: AppRole): boolean {
  if (!role) return false;
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}
