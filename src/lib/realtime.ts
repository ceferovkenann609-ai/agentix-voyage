import { useEffect } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type RealtimeTable =
  | "crm_leads"
  | "crm_lead_activities"
  | "demo_bookings"
  | "notifications"
  | "activities"
  | "ai_chat_messages"
  | "ai_agents";

/**
 * Subscribes to postgres changes for one or more tables and invalidates the
 * given query keys when a row changes. RLS applies to realtime too, so a
 * subscriber only receives rows it is allowed to read.
 *
 * The channel is created once per (tables, enabled) pair and torn down on
 * unmount to avoid subscription leaks and reconnect loops.
 */
export function useRealtimeInvalidate(
  tables: RealtimeTable[],
  keys: QueryKey[],
  enabled = true,
) {
  const queryClient = useQueryClient();
  const tableKey = tables.join(",");
  const keySignature = JSON.stringify(keys);

  useEffect(() => {
    if (!enabled || tables.length === 0) return;

    const channel = supabase.channel(`agentix:${tableKey}:${Math.random().toString(36).slice(2)}`);

    for (const table of tables) {
      channel.on("postgres_changes", { event: "*", schema: "public", table }, () => {
        for (const key of JSON.parse(keySignature) as QueryKey[]) {
          void queryClient.invalidateQueries({ queryKey: key });
        }
      });
    }

    channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableKey, keySignature, enabled, queryClient]);
}
