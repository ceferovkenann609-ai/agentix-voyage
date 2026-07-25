import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarCheck, Loader2, Mail, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_authenticated/demo-requests")({
  head: () => ({
    meta: [
      { title: "Demo Requests — Agentix" },
      { name: "description", content: "Your Agentix demo booking requests." },
    ],
  }),
  component: DemoRequestsPage,
});

function DemoRequestsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("demo_bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setRows(data ?? []);
      setLoading(false);
    })();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#07090C] text-white pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <CalendarCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="uppercase tracking-[6px] text-cyan-400 font-semibold text-xs">DEMO REQUESTS</p>
            <h1 className="text-3xl font-bold">Your demo bookings</h1>
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
            </div>
          ) : rows.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <p className="text-muted-foreground">You have no demo requests yet.</p>
              <Link
                to="/book-demo"
                className="mt-6 inline-flex items-center rounded-xl bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white"
              >
                Book a demo
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {rows.map((r) => (
                <li key={r.id} className="glass rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{r.service ?? "General demo"}</div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {r.company && (
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" /> {r.company}
                      </span>
                    )}
                    {r.email && (
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" /> {r.email}
                      </span>
                    )}
                  </div>
                  {r.message && <p className="mt-3 text-sm">{r.message}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
