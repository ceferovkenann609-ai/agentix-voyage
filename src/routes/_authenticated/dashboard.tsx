import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, MessageSquare, Bot, User, ArrowRight, ClipboardList } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Agentix" },
      { name: "description", content: "Your Agentix workspace overview." },
      { property: "og:title", content: "Dashboard — Agentix" },
      { property: "og:description", content: "Your Agentix workspace overview." },
    ],
  }),
  component: DashboardPage,
});

type ChatRow = { id: string; message: string; sender: string; created_at: string };

function DashboardPage() {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const isAz = i18n.resolvedLanguage !== "en";
  const [demoCount, setDemoCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [chats, setChats] = useState<ChatRow[]>([]);
  const [fullName, setFullName] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [demos, contacts, chatsRes, profile] = await Promise.all([
        supabase.from("demo_bookings").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("contact_requests").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase
          .from("chat_messages")
          .select("id,message,sender,created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
      ]);
      setDemoCount(demos.count ?? 0);
      setContactCount(contacts.count ?? 0);
      setChats((chatsRes.data as ChatRow[]) ?? []);
      setFullName(profile.data?.full_name ?? "");
    })();
  }, [user]);

  const name = fullName || user?.email?.split("@")[0] || "";

  const stats = [
    { label: isAz ? "Demo sifarişləri" : "Demo requests", value: demoCount, icon: Calendar, color: "from-cyan-500 to-blue-500" },
    { label: isAz ? "Əlaqə sorğuları" : "Contact requests", value: contactCount, icon: MessageSquare, color: "from-emerald-500 to-cyan-500" },
    { label: isAz ? "AI söhbətləri" : "AI messages", value: chats.length, icon: Bot, color: "from-blue-500 to-cyan-400" },
  ];

  const quickActions = [
    { to: "/book-demo", title: isAz ? "Yeni demo sifariş et" : "Book a new demo", desc: isAz ? "Komandamızla görüş planlayın" : "Schedule a call with our team" },
    { to: "/contact", title: isAz ? "Əlaqə sorğusu göndər" : "Send a contact request", desc: isAz ? "Suallarınızı bizə göndərin" : "Ask us anything about our services" },
    { to: "/services", title: isAz ? "Xidmətləri kəşf et" : "Explore services", desc: isAz ? "AI həllərimizə baxın" : "Browse our AI capabilities" },
  ] as const;

  return (
    <div className="min-h-screen bg-[#07090C] text-white pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <p className="uppercase tracking-[6px] text-cyan-400 font-semibold text-sm">
            {isAz ? "İDARƏ PANELİ" : "DASHBOARD"}
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold">
            {isAz ? `Xoş gəlmisən, ${name} 👋` : `Welcome back, ${name} 👋`}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {isAz ? "Agentix iş sahənizin ümumi mənzərəsi." : "Here's an overview of your Agentix workspace."}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="glass-strong rounded-2xl p-6">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} mb-4`}>
                <s.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-4xl font-bold">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 glass-strong rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{isAz ? "Son AI söhbətləri" : "Recent AI chats"}</h2>
              <Link to="/history" className="text-sm text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1">
                {isAz ? "Hamısına bax" : "View all"} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {chats.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                {isAz ? "Hələ AI söhbətiniz yoxdur." : "No AI chats yet."}
              </p>
            ) : (
              <ul className="space-y-3">
                {chats.map((c) => (
                  <li key={c.id} className="rounded-xl bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <span className="uppercase font-semibold">{c.sender === "ai" ? "Agentix AI" : (isAz ? "Siz" : "You")}</span>
                      <span>·</span>
                      <span>{new Date(c.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm">{c.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="glass-strong rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">{isAz ? "Hesab məlumatları" : "Account"}</h2>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-muted-foreground">{isAz ? "Ad" : "Name"}</div>
                <div className="font-semibold">{fullName || "—"}</div>
              </div>
              <div>
                <div className="text-muted-foreground">{isAz ? "E-poçt" : "Email"}</div>
                <div className="font-semibold break-all">{user?.email}</div>
              </div>
            </div>
            <Link
              to="/profile"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient px-4 py-3 text-sm font-semibold text-white"
            >
              <User className="h-4 w-4" /> {isAz ? "Profili idarə et" : "Manage profile"}
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">{isAz ? "Sürətli əməliyyatlar" : "Quick actions"}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {quickActions.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="group glass rounded-2xl p-6 hover:border-cyan-400/40 transition"
              >
                <div className="flex items-center justify-between">
                  <ClipboardList className="h-6 w-6 text-cyan-400" />
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-cyan-400 group-hover:translate-x-1 transition" />
                </div>
                <div className="mt-4 font-semibold">{a.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{a.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
