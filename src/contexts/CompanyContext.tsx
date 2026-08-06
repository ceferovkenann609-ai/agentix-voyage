import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { queryKeys } from "@/lib/api/keys";
import { fetchMyMemberships, type AppRole, type CompanyRow, type Membership } from "@/lib/api/companies";
import { can, canAny, atLeast, type Permission } from "@/lib/platform/permissions";

const ACTIVE_KEY = "agentix.activeCompanyId";

type CompanyContextValue = {
  loading: boolean;
  error: unknown;
  memberships: Membership[];
  company: CompanyRow | null;
  companyId: string | null;
  role: AppRole | null;
  setActiveCompany: (companyId: string) => void;
  can: (permission: Permission) => boolean;
  canAny: (permissions: Permission[]) => boolean;
  atLeast: (role: AppRole) => boolean;
  refresh: () => void;
};

const CompanyContext = createContext<CompanyContextValue>({
  loading: true,
  error: null,
  memberships: [],
  company: null,
  companyId: null,
  role: null,
  setActiveCompany: () => {},
  can: () => false,
  canAny: () => false,
  atLeast: () => false,
  refresh: () => {},
});

function readStoredCompanyId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_KEY);
}

export function CompanyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const membershipsQuery = useQuery({
    queryKey: queryKeys.companies.mine(user?.id),
    enabled: !!user?.id,
    staleTime: 60_000,
    queryFn: fetchMyMemberships,
  });

  const memberships = membershipsQuery.data ?? [];

  const active = useMemo(() => {
    if (!memberships.length) return null;
    const storedId = readStoredCompanyId();
    return memberships.find((m) => m.company.id === storedId) ?? memberships[0]!;
  }, [memberships]);

  const value = useMemo<CompanyContextValue>(() => {
    const role = active?.role ?? null;
    return {
      loading: !!user?.id && membershipsQuery.isPending,
      error: membershipsQuery.error,
      memberships,
      company: active?.company ?? null,
      companyId: active?.company.id ?? null,
      role,
      setActiveCompany: (companyId: string) => {
        if (typeof window !== "undefined") window.localStorage.setItem(ACTIVE_KEY, companyId);
        void queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      },
      can: (permission) => can(role, permission),
      canAny: (permissions) => canAny(role, permissions),
      atLeast: (minimum) => atLeast(role, minimum),
      refresh: () => {
        void queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      },
    };
  }, [active, memberships, membershipsQuery.isPending, membershipsQuery.error, queryClient, user?.id]);

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany() {
  return useContext(CompanyContext);
}

/** Convenience hook for gating UI on a single permission. */
export function usePermission(permission: Permission): boolean {
  return useCompany().can(permission);
}
