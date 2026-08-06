/**
 * Single source of truth for React Query cache keys.
 * Every hook in the data layer must build its key from here so invalidation
 * stays consistent as the platform grows.
 */
export const queryKeys = {
  companies: {
    all: ["companies"] as const,
    mine: (userId?: string) => ["companies", "mine", userId ?? "anon"] as const,
    detail: (companyId?: string) => ["companies", "detail", companyId ?? "none"] as const,
    members: (companyId?: string) => ["companies", "members", companyId ?? "none"] as const,
  },
  activities: {
    all: ["activities"] as const,
    list: (companyId?: string, limit?: number) =>
      ["activities", "list", companyId ?? "none", limit ?? 20] as const,
    entity: (entityType: string, entityId?: string) =>
      ["activities", "entity", entityType, entityId ?? "none"] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: (userId?: string, status?: string) =>
      ["notifications", "list", userId ?? "anon", status ?? "all"] as const,
    unreadCount: (userId?: string) => ["notifications", "unread-count", userId ?? "anon"] as const,
  },
  workflows: {
    all: ["workflows"] as const,
    runs: (companyId?: string, limit?: number) =>
      ["workflows", "runs", companyId ?? "none", limit ?? 20] as const,
    run: (runId?: string) => ["workflows", "run", runId ?? "none"] as const,
  },
  agents: {
    all: ["ai-agents"] as const,
    list: (companyId?: string) => ["ai-agents", "list", companyId ?? "none"] as const,
    detail: (agentId?: string) => ["ai-agents", "detail", agentId ?? "none"] as const,
  },
  files: {
    all: ["files"] as const,
    list: (companyId?: string, kind?: string) =>
      ["files", "list", companyId ?? "none", kind ?? "all"] as const,
    entity: (entityType: string, entityId?: string) =>
      ["files", "entity", entityType, entityId ?? "none"] as const,
  },
  leads: {
    all: ["crm-leads"] as const,
    list: (scopeId?: string) => ["crm-leads", scopeId ?? "none"] as const,
  },
  metrics: {
    all: ["agentix-metrics"] as const,
    overview: (scopeId?: string) => ["agentix-metrics", scopeId ?? "none"] as const,
  },
  profile: {
    detail: (userId?: string) => ["profile", userId ?? "anon"] as const,
  },
  submissions: {
    demos: (userId?: string) => ["demo-bookings", userId ?? "anon"] as const,
    contacts: (userId?: string) => ["contact-submissions", userId ?? "anon"] as const,
  },
} as const;
