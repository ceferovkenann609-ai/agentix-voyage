import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, MessageSquare, Bot, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({
    meta: [
      { title: "History — Agentix" },
      { name: "description", content: "Your Agentix booking, contact and chat history." },
      { property: "og:title", content: "History — Agentix" },
      { property: "og:description", content: "Your Agentix booking, contact and chat history." },
    ],
  }),
  component: HistoryPage,
});

type Tab = "demos" | "contacts" | "chats";

function HistoryPage() {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const isAz = i18n.resolvedLanguage !== "en";
  const [tab, setTab] = useState<Tab>("demos");
  const [loading, setLoading] = useState(true);
  const [demos, setDemos] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const [d, c, ch] = await Promise.all([
        supabase.from("demo_bookings").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("contact_submissions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("ai_chat_messages").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(100),
      ]);
      setDemos(d.data ?? []);
      setContacts(c.data ?? []);
      setChats(ch.data ?? []);
      setLoading(false);
    })();
  }, [user]);

  const tabs: { id: Tab; label: string; count: number; icon: any }[] = [
    { id: "demos", label: isAz ? "Demo sifarişləri" : "Demo bookings", count: demos.length, icon: Calendar },
    { id: "contacts", label: isAz ? "Əlaqə sorğuları" : "Contact requests", count: contacts.length, icon: MessageSquare },
    { id: "chats", label: isAz ? "AI söhbətləri" : "AI chats", count: chats.length, icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-[#07090C] text-white pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <p className="uppercase tracking-[6px] text-cyan-400 font-semibold text-sm">
          {isAz ? "TARİXÇƏ" : "HISTORY"}
        </p>
        <h1 className="mt-3 text-4xl font-bold">
          {isAz ? "Fəaliyyət tarixçəniz" : "Your activity"}
        </h1>

        <div className="mt-8 flex gap-2 p-1 rounded-xl bg-white/5 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 min-w-max inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                tab === t.id ? "bg-brand-gradient text-white" : "text-muted-foreground hover:text-white"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label} <span className="opacity-70">({t.count})</span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-cyan-400" /></div>
          ) : tab === "demos" ? (
            <List
              items={demos}
              empty={isAz ? "Hələ demo sifarişiniz yoxdur." : "No demo bookings yet."}
              render={(d) => (
                <div>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{d.service ?? (isAz ? "Ümumi demo" : "General demo")}</div>
                    <div className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleString()}</div>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">{d.company ?? d.email}</div>
                  {d.message && <p className="mt-2 text-sm">{d.message}</p>}
                </div>
              )}
            />
          ) : tab === "contacts" ? (
            <List
              items={contacts}
              empty={isAz ? "Hələ əlaqə sorğunuz yoxdur." : "No contact requests yet."}
              render={(c) => (
                <div>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{c.subject ?? (isAz ? "Əlaqə sorğusu" : "Contact request")}</div>
                    <div className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</div>
                  </div>
                  <p className="mt-2 text-sm">{c.message}</p>
                </div>
              )}
            />
          ) : (
            <List
              items={chats}
              empty={isAz ? "Hələ AI söhbətiniz yoxdur." : "No AI chats yet."}
              render={(c) => (
                <div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="uppercase font-semibold">{c.sender === "ai" ? "Agentix AI" : (isAz ? "Siz" : "You")}</span>
                    <span>·</span>
                    <span>{new Date(c.created_at).toLocaleString()}</span>
                  </div>
                  <p className="mt-1 text-sm">{c.message}</p>
                </div>
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function List<T extends { id: string }>({
  items, empty, render,
}: { items: T[]; empty: string; render: (i: T) => React.ReactNode }) {
  if (items.length === 0) {
    return <div className="glass rounded-2xl p-12 text-center text-muted-foreground">{empty}</div>;
  }
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="glass rounded-2xl p-5">
          {render(item)}
        </li>
      ))}
    </ul>
  );
}
