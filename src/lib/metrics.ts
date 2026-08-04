import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AgentixMetrics = {
  leadsTotal: number;
  leadsQualified: number;
  leadsWon: number;
  pipelineValue: number;
  wonValue: number;
  demoRequests: number;
  contactRequests: number;
  chatMessages: number;
  conversionRate: number;
};

const EMPTY: AgentixMetrics = {
  leadsTotal: 0,
  leadsQualified: 0,
  leadsWon: 0,
  pipelineValue: 0,
  wonValue: 0,
  demoRequests: 0,
  contactRequests: 0,
  chatMessages: 0,
  conversionRate: 0,
};

async function count(table: "demo_bookings" | "contact_submissions" | "ai_chat_messages"): Promise<number> {
  const { count: rows, error } = await supabase.from(table).select("id", { count: "exact", head: true });
  if (error) throw error;
  return rows ?? 0;
}

export function useAgentixMetrics(userId: string | undefined) {
  return useQuery({
    queryKey: ["agentix-metrics", userId],
    enabled: !!userId,
    staleTime: 30_000,
    queryFn: async (): Promise<AgentixMetrics> => {
      const [leads, demos, contacts, chats] = await Promise.all([
        supabase.from("crm_leads").select("status,value").eq("archived", false),
        count("demo_bookings"),
        count("contact_submissions"),
        count("ai_chat_messages"),
      ]);
      if (leads.error) throw leads.error;

      const rows = leads.data ?? [];
      const leadsTotal = rows.length;
      const leadsQualified = rows.filter((r) => r.status === "qualified" || r.status === "proposal").length;
      const wonRows = rows.filter((r) => r.status === "won");
      const wonValue = wonRows.reduce((sum, r) => sum + Number(r.value ?? 0), 0);
      const pipelineValue = rows
        .filter((r) => r.status !== "lost")
        .reduce((sum, r) => sum + Number(r.value ?? 0), 0);

      return {
        ...EMPTY,
        leadsTotal,
        leadsQualified,
        leadsWon: wonRows.length,
        pipelineValue,
        wonValue,
        demoRequests: demos,
        contactRequests: contacts,
        chatMessages: chats,
        conversionRate: leadsTotal ? Math.round((wonRows.length / leadsTotal) * 1000) / 10 : 0,
      };
    },
  });
}
