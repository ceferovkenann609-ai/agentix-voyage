import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const LEAD_STATUSES = ["new", "contacted", "qualified", "proposal", "won", "lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "Yeni",
  contacted: "Əlaqə saxlanıldı",
  qualified: "Kvalifikasiya",
  proposal: "Təklif",
  won: "Qazanıldı",
  lost: "İtirildi",
};

export const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-cyan-400/10 text-cyan-300 border-cyan-400/20",
  contacted: "bg-blue-400/10 text-blue-300 border-blue-400/20",
  qualified: "bg-indigo-400/10 text-indigo-300 border-indigo-400/20",
  proposal: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  won: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  lost: "bg-rose-400/10 text-rose-300 border-rose-400/20",
};

export type Lead = {
  id: string;
  user_id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  agent: string | null;
  status: string;
  value: number;
  tags: string[];
  notes: string | null;
  archived: boolean;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
};

export type LeadActivity = {
  id: string;
  lead_id: string;
  title: string;
  created_at: string;
};

export function asStatus(value: string): LeadStatus {
  return (LEAD_STATUSES as readonly string[]).includes(value) ? (value as LeadStatus) : "new";
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("az-AZ", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "indi";
  if (minutes < 60) return `${minutes} dəq öncə`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} saat öncə`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} gün öncə`;
  return new Date(iso).toLocaleDateString("az-AZ");
}

/** Surfaces the real Postgres/PostgREST message instead of a generic string. */
export function describeError(error: unknown, scope: string): string {
  const anyErr = error as { message?: string; details?: string; hint?: string; code?: string } | null;
  const parts = [anyErr?.message, anyErr?.details, anyErr?.hint].filter(Boolean);
  const text = parts.length ? parts.join(" — ") : String(error);
  const label = anyErr?.code ? `[${anyErr.code}] ` : "";
  console.error(`[${scope}]`, error);
  return `${label}${text}`;
}

export function useLeads(userId: string | undefined) {
  return useQuery({
    queryKey: ["crm-leads", userId],
    enabled: !!userId,
    queryFn: async (): Promise<Lead[]> => {
      const { data, error } = await supabase
        .from("crm_leads")
        .select("*")
        .eq("archived", false)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Lead[];
    },
  });
}

export function useLeadActivities(leadId: string | undefined) {
  return useQuery({
    queryKey: ["crm-lead-activities", leadId],
    enabled: !!leadId,
    queryFn: async (): Promise<LeadActivity[]> => {
      const { data, error } = await supabase
        .from("crm_lead_activities")
        .select("id,lead_id,title,created_at")
        .eq("lead_id", leadId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as LeadActivity[];
    },
  });
}

export function useRecentActivities(userId: string | undefined) {
  return useQuery({
    queryKey: ["crm-recent-activities", userId],
    enabled: !!userId,
    queryFn: async (): Promise<LeadActivity[]> => {
      const { data, error } = await supabase
        .from("crm_lead_activities")
        .select("id,lead_id,title,created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return (data ?? []) as LeadActivity[];
    },
  });
}

export type LeadInput = {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  agent?: string;
  status?: LeadStatus;
  value?: number;
  notes?: string;
};

export function useCreateLead(userId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: LeadInput) => {
      if (!userId) throw new Error("Sessiya tapılmadı — yenidən daxil olun.");
      const { data, error } = await supabase
        .from("crm_leads")
        .insert({
          user_id: userId,
          name: input.name,
          company: input.company || null,
          email: input.email || null,
          phone: input.phone || null,
          agent: input.agent || null,
          status: input.status ?? "new",
          value: input.value ?? 0,
          notes: input.notes || null,
        })
        .select("id")
        .single();
      if (error) throw error;
      const { error: activityError } = await supabase.from("crm_lead_activities").insert({
        lead_id: data.id,
        user_id: userId,
        title: "Namizəd yaradıldı",
      });
      if (activityError) throw activityError;
      return data.id;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["crm-leads"] });
      void qc.invalidateQueries({ queryKey: ["crm-recent-activities"] });
      void qc.invalidateQueries({ queryKey: ["agentix-metrics"] });
    },
  });
}

export function useUpdateLead(userId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      patch,
      activity,
    }: {
      id: string;
      patch: Partial<Pick<Lead, "status" | "notes" | "archived" | "value" | "agent" | "company" | "phone" | "email" | "name">>;
      activity?: string;
    }) => {
      const { error } = await supabase
        .from("crm_leads")
        .update({ ...patch, last_activity_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      if (activity && userId) {
        const { error: activityError } = await supabase
          .from("crm_lead_activities")
          .insert({ lead_id: id, user_id: userId, title: activity });
        if (activityError) throw activityError;
      }
    },
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({ queryKey: ["crm-leads"] });
      void qc.invalidateQueries({ queryKey: ["crm-lead-activities", vars.id] });
      void qc.invalidateQueries({ queryKey: ["crm-recent-activities"] });
      void qc.invalidateQueries({ queryKey: ["agentix-metrics"] });
    },
  });
}
