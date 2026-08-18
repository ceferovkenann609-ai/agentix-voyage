import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  Users,
  CalendarCheck,
  BarChart3,
  CreditCard,
  Settings,
  LifeBuoy,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  Sparkles,
  Filter,
  Download,
  Send,
  Paperclip,
  Smile,
  MoreHorizontal,
  MessageCircle,
  Globe,
  Calendar,
  Tag,
  Languages,
  Activity,
  Loader2,
  Hash,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations, useSendOperatorReply, useAgents, useAgentChat } from "@/lib/platform/hooks";
import { downloadCsv, downloadText, timestampSlug } from "@/lib/download";
import { useRealtimeInvalidate } from "@/lib/realtime";
import { queryKeys } from "@/lib/api/keys";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/conversations")({
  head: () => ({
    meta: [
      { title: "Söhbətlər — Agentix" },
      { name: "description", content: "Bütün qoşulmuş kanallar üzrə hər AI qarşılıqlı əlaqəni nəzərdən keçirin." },
      { property: "og:title", content: "Söhbətlər — Agentix" },
      { property: "og:description", content: "Bütün qoşulmuş kanallar üzrə hər AI qarşılıqlı əlaqəni nəzərdən keçirin." },
    ],
  }),
  component: ConversationsPage,
});

const navItems = [
  { key: "dashboard", label: "İdarəetmə Paneli", icon: LayoutDashboard, to: "/dashboard" as const },
  { key: "agents", label: "AI Agentləri", icon: Bot, to: "/ai-agents" as const },
  { key: "conversations", label: "Söhbətlər", icon: MessageSquare, to: "/conversations" as const, active: true },
  { key: "leads", label: "CRM", icon: Users, to: "/crm" as const },
  { key: "demos", label: "Demo Sorğuları", icon: CalendarCheck, to: "/demo-requests" as const },
  { key: "analytics", label: "Analitika", icon: BarChart3, to: "/analytics" as const },
  { key: "billing", label: "Ödənişlər", icon: CreditCard, to: "/billing" as const },
  { key: "settings", label: "Tənzimləmələr", icon: Settings, to: "/settings" as const },
  { key: "support", label: "Dəstək", icon: LifeBuoy, to: "/support" as const },
];

const dateFilters = ["İstənilən vaxt", "Bu gün", "Son 7 gün", "Son 30 gün"] as const;

function relativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "indi";
  if (mins < 60) return `${mins}dq`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}s`;
  const days = Math.floor(hrs / 24);
  return `${days}g`;
}

function ConversationsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [date, setDate] = useState<(typeof dateFilters)[number]>("İstənilən vaxt");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [pendingSession, setPendingSession] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string>("");
  const [aiMode, setAiMode] = useState(true);


  const name = user?.email?.split("@")[0] || "İstifadəçi";

  const { data: rawConversations = [], isLoading, isError, error, refetch } = useConversations();
  const sendReply = useSendOperatorReply();
  const agentsQuery = useAgents();
  const agentChat = useAgentChat();

  /** Only live agents can answer; archived/paused ones are filtered out. */
  const liveAgents = useMemo(
    () => (agentsQuery.data ?? []).filter((a) => !a.archived && a.status !== "paused"),
    [agentsQuery.data],
  );
  const selectedAgent = liveAgents.find((a) => a.id === agentId) ?? liveAgents[0] ?? null;

  useRealtimeInvalidate(
    ["ai_chat_messages", "ai_agents", "notifications"],
    [queryKeys.conversations.all, queryKeys.agents.all, queryKeys.notifications.all],
  );

  /** A freshly started AI session is shown before its first row exists. */
  const conversations = useMemo(() => {
    if (!pendingSession || rawConversations.some((c) => c.id === pendingSession)) return rawConversations;
    const now = new Date();
    return [
      {
        id: pendingSession,
        title: "Yeni AI söhbəti",
        preview: "",
        locale: "az",
        messageCount: 0,
        firstContact: now,
        lastActivity: now,
        messages: [],
      },
      ...rawConversations,
    ];
  }, [rawConversations, pendingSession]);

  const startNewSession = () => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setPendingSession(id);
    setActiveId(id);
    setDraft("");
    if (selectedAgent) {
      setAgentId(selectedAgent.id);
      setAiMode(true);
      toast.success(`Yeni söhbət başladıldı · ${selectedAgent.name}`);
    } else {
      // No live agent yet: the thread still opens, but only operator replies work.
      setAiMode(false);
      toast.message("Aktiv AI agent yoxdur — operator rejimində söhbət açıldı.", {
        description: "AI cavabları üçün AI Agentləri səhifəsində aktiv agent yaradın.",
      });
    }
  };

  const filtered = useMemo(() => {
    const now = Date.now();
    return conversations.filter((c) => {
      if (query) {
        const q = query.toLowerCase();
        if (!c.title.toLowerCase().includes(q) && !c.preview.toLowerCase().includes(q)) return false;
      }
      if (date !== "İstənilən vaxt") {
        const diffDays = (now - c.lastActivity.getTime()) / 86_400_000;
        if (date === "Bu gün" && diffDays > 1) return false;
        if (date === "Son 7 gün" && diffDays > 7) return false;
        if (date === "Son 30 gün" && diffDays > 30) return false;
      }
      return true;
    });
  }, [conversations, query, date]);


  const active = filtered.find((c) => c.id === activeId) ?? filtered[0] ?? null;

  /** Exports the currently filtered, already-loaded conversations as CSV. */
  const exportConversations = () => {
    downloadCsv(
      `agentix-sohbetler-${timestampSlug()}.csv`,
      ["Sessiya", "Başlıq", "Dil", "Mesaj sayı", "İlk əlaqə", "Son fəaliyyət"],
      filtered.map((c) => [
        c.id,
        c.title,
        c.locale,
        c.messageCount,
        c.firstContact.toISOString(),
        c.lastActivity.toISOString(),
      ]),
    );
  };

  /** Exports the open thread as a plain-text transcript. */
  const exportTranscript = () => {
    if (!active) return;
    const header = [
      `Agentix söhbət transkripti`,
      `Sessiya: ${active.id}`,
      `Mesaj sayı: ${active.messageCount}`,
      `İlk əlaqə: ${active.firstContact.toLocaleString("az-AZ")}`,
      "",
    ].join("\n");
    const body = active.messages
      .map(
        (m) =>
          `[${m.createdAt.toLocaleString("az-AZ")}] ${
            m.from === "user" ? "Müştəri" : m.from === "agent" ? "Operator" : "AI"
          }: ${m.text.replace(/\*\*(.+?)\*\*/g, "$1")}`,
      )
      .join("\n");
    downloadText(`agentix-transkript-${active.id.slice(0, 8)}.txt`, `${header}${body}\n`);
  };

  const busy = sendReply.isPending || agentChat.isPending;

  /**
   * Sends the composer text. With "AI cavabı" mode on, the message goes through
   * the real agent execution server function (user turn + AI reply are both
   * persisted). Otherwise it is stored as a manual operator reply.
   */
  const handleSend = async () => {
    const text = draft.trim();
    if (!text || !active || busy) return;
    const locale = active.locale !== "—" ? active.locale : null;
    try {
      if (aiMode) {
        if (!selectedAgent) {
          toast.error("Aktiv AI agent seçilməyib.");
          return;
        }
        setDraft("");
        await agentChat.mutateAsync({
          agentId: selectedAgent.id,
          sessionId: active.id,
          message: text,
          locale,
        });
      } else {
        await sendReply.mutateAsync({ sessionId: active.id, message: text, locale });
        setDraft("");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Mesaj göndərilə bilmədi.");
    }

  };

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-[#07090C] text-white pt-20">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute top-1/2 -right-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />
      </div>

      <div className="relative flex">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            />
          )}
        </AnimatePresence>

        <aside
          className={`fixed lg:sticky top-20 z-40 h-[calc(100vh-5rem)] w-72 shrink-0 border-r border-white/5 bg-[#0B0F14]/80 backdrop-blur-xl transition-transform lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-6 py-6">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                  <Sparkles className="h-4.5 w-4.5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold tracking-tight">Agentix</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">İş Sahəsi</div>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = !!item.active;
                const content = (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-conversations"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent border border-cyan-400/30 shadow-[0_0_30px_-5px_rgba(34,211,238,0.4)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className={`relative h-4.5 w-4.5 ${isActive ? "text-cyan-300" : ""}`} />
                    <span className="relative">{item.label}</span>
                    {isActive && (
                      <span className="relative ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                    )}
                  </>
                );
                const classes = `group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive ? "text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                }`;
                return (
                  <Link key={item.key} to={item.to} className={classes} onClick={() => setSidebarOpen(false)}>
                    {content}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-white/5 p-3">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition"
              >
                <LogOut className="h-4.5 w-4.5" />
                Çıxış
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="sticky top-20 z-20 border-b border-white/5 bg-[#07090C]/80 backdrop-blur-xl">
            <div className="flex items-center gap-3 px-4 sm:px-8 py-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:text-white"
                aria-label="Yan paneli aç"
              >
                <Menu className="h-4.5 w-4.5" />
              </button>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  placeholder="Söhbətləri axtar…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-10 w-full rounded-xl border border-white/8 bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.05] transition"
                />
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/8 bg-white/[0.03] text-white/70 hover:text-white hover:border-cyan-400/30 transition">
                  <Bell className="h-4.5 w-4.5" />
                </button>
                <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] pl-1.5 pr-3 py-1.5">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-xs font-bold uppercase">
                    {name.slice(0, 2)}
                  </div>
                  <div className="hidden sm:block leading-tight">
                    <div className="text-xs font-semibold capitalize">{name}</div>
                    <div className="text-[10px] text-white/50">Admin</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="px-4 sm:px-8 py-8 space-y-6">
            {/* Page header */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
            >
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-[11px] font-medium text-cyan-300">
                  <MessageSquare className="h-3 w-3" /> Gələnlər Qutusu
                </div>
                <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Söhbətlər</h1>
                <p className="mt-1 text-white/60 max-w-xl">
                  Veb saytı AI çatı ilə bütün qarşılıqlı əlaqələrinizi nəzərdən keçirin.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {liveAgents.length > 0 && (
                  <label className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] pl-3 pr-1.5 py-2 text-xs">
                    <Bot className="h-3.5 w-3.5 text-cyan-300" />
                    <select
                      value={selectedAgent?.id ?? ""}
                      onChange={(e) => setAgentId(e.target.value)}
                      className="appearance-none bg-transparent pr-4 py-1 text-white focus:outline-none cursor-pointer"
                    >
                      {liveAgents.map((a) => (
                        <option key={a.id} value={a.id} className="bg-[#0B0F14]">
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <button
                  onClick={startNewSession}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-sm font-semibold text-[#07090C] transition hover:shadow-[0_0_30px_-8px_rgba(34,211,238,0.7)]"
                >
                  <Sparkles className="h-4 w-4" /> Yeni AI söhbəti
                </button>
                <button
                  onClick={exportConversations}
                  disabled={filtered.length === 0}
                  title={filtered.length === 0 ? "İxrac edilə bilən söhbət yoxdur" : "CSV kimi ixrac et"}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.06] hover:border-white/20 disabled:cursor-not-allowed disabled:text-white/40 disabled:hover:bg-white/[0.03]"
                >
                  <Download className="h-4 w-4" /> İxrac et
                </button>
              </div>

            </motion.section>

            {/* Filter bar */}
            <section className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.02] p-3">
              <label className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-white/40">
                <Filter className="h-3 w-3" /> Kanal: Veb saytı çatı
              </label>
              <FilterSelect label="Tarix" value={date} options={dateFilters} onChange={(v) => setDate(v as (typeof dateFilters)[number])} />
              <div className="ml-auto text-xs text-white/50">
                {filtered.length} söhbətdən {filtered.length}
              </div>
            </section>

            {isLoading ? (
              <div className="flex justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
              </div>
            ) : isError ? (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/5 p-12 text-center">
                <p className="text-sm text-rose-200">
                  Söhbətlər yüklənmədi: {error instanceof Error ? error.message : "naməlum xəta"}
                </p>
                <button
                  onClick={() => void refetch()}
                  className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white hover:bg-white/[0.08]"
                >
                  Yenidən yükləyin
                </button>
              </div>
            ) : conversations.length === 0 ? (
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-16 text-center">
                <MessageSquare className="mx-auto h-10 w-10 text-white/20" />
                <p className="mt-4 text-white/60">Hələ məlumat yoxdur</p>
                <button
                  onClick={startNewSession}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-sm font-semibold text-[#07090C]"
                >
                  <Sparkles className="h-4 w-4" /> Yeni AI söhbəti başlat
                </button>
              </div>
            ) : (

              /* 3-column workspace */
              <section className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)] 2xl:grid-cols-[320px_minmax(0,1fr)_320px]">
                {/* Conversation list */}
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
                  <div className="border-b border-white/5 px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-white/40">
                    Bütün Söhbətlər
                  </div>
                  <div className="max-h-[720px] overflow-y-auto divide-y divide-white/5">
                    {filtered.length === 0 && (
                      <div className="p-8 text-center text-sm text-white/50">Filtrlərinizə uyğun söhbət yoxdur.</div>
                    )}
                    {filtered.map((c) => {
                      const isActive = c.id === active?.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => setActiveId(c.id)}
                          className={`relative w-full text-left px-4 py-3.5 transition ${
                            isActive ? "bg-cyan-400/[0.06]" : "hover:bg-white/[0.03]"
                          }`}
                        >
                          {isActive && (
                            <span className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r bg-gradient-to-b from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
                          )}
                          <div className="flex items-start gap-3">
                            <div className="relative shrink-0">
                              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white text-xs font-bold uppercase">
                                <Hash className="h-4 w-4" />
                              </div>
                              <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border border-[#07090C] text-cyan-300 bg-cyan-400/10 border-cyan-400/20">
                                <Globe className="h-2.5 w-2.5" />
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-semibold truncate">{c.title}</div>
                                <div className="ml-auto text-[10px] text-white/40 shrink-0">{relativeTime(c.lastActivity)}</div>
                              </div>
                              <div className="text-[11px] text-white/50 truncate">
                                {c.messageCount} mesaj · {c.locale}
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <p className="text-xs text-white/60 truncate flex-1">{c.preview}</p>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Chat thread */}
                <div className="min-w-0 rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden flex flex-col min-h-[720px]">
                  {active ? (
                    <>
                      <div className="flex items-center justify-between border-b border-white/5 px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white text-xs font-bold uppercase">
                            <Hash className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold truncate max-w-[280px]">{active.title}</div>
                            <div className="text-[11px] text-white/50 flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] text-cyan-300 bg-cyan-400/10 border-cyan-400/20">
                                <Globe className="h-2.5 w-2.5" />
                                Veb saytı çatı
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60 hover:text-white transition">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
                        <AnimatePresence initial={false}>
                          {active.messages.map((m) => (
                            <motion.div
                              key={m.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.25 }}
                              className={`flex min-w-0 ${m.from === "user" ? "justify-start" : "justify-end"}`}
                            >
                              <div className={`min-w-0 max-w-[85%] ${m.from === "user" ? "" : "text-right"}`}>
                                <div
                                  className={`inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed text-left whitespace-pre-wrap break-words ${
                                    m.from === "user"
                                      ? "bg-white/[0.05] border border-white/8 text-white rounded-bl-md"
                                      : "bg-gradient-to-br from-cyan-400/90 to-blue-500/90 text-[#07090C] font-medium rounded-br-md shadow-[0_0_25px_-8px_rgba(34,211,238,0.6)]"
                                  }`}
                                >
                                  {m.text}

                                </div>
                                <div className={`mt-1 flex items-center gap-1 text-[10px] text-white/40 ${m.from === "user" ? "" : "justify-end"}`}>
                                  <span>
                                    {m.createdAt.toLocaleTimeString("az-AZ", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        {agentChat.isPending && (
                          <div className="flex justify-end">
                            <div className="inline-flex items-center gap-2 rounded-2xl bg-white/[0.05] px-4 py-2.5 text-xs text-white/60">
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-300" />
                              {selectedAgent?.name ?? "AI"} cavab yazır…
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-white/5 px-4 py-3">
                        <div className="mb-2 flex items-center gap-2 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setAiMode(true)}
                            className={`rounded-full px-3 py-1 transition ${
                              aiMode
                                ? "bg-cyan-400/15 text-cyan-200 border border-cyan-400/30"
                                : "border border-white/10 text-white/50 hover:text-white"
                            }`}
                          >
                            AI cavabı{selectedAgent ? ` · ${selectedAgent.name}` : ""}
                          </button>
                          <button
                            type="button"
                            onClick={() => setAiMode(false)}
                            className={`rounded-full px-3 py-1 transition ${
                              !aiMode
                                ? "bg-white/10 text-white border border-white/20"
                                : "border border-white/10 text-white/50 hover:text-white"
                            }`}
                          >
                            Operator cavabı
                          </button>
                          {aiMode && !selectedAgent && (
                            <Link to="/ai-agents" className="text-cyan-300 hover:underline">
                              Aktiv agent yaradın
                            </Link>
                          )}
                        </div>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            void handleSend();
                          }}
                          className="flex items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2 focus-within:border-cyan-400/40 transition"
                        >
                          <button type="button" disabled className="grid h-8 w-8 place-items-center rounded-lg text-white/30" aria-label="Əlavə et">
                            <Paperclip className="h-4 w-4" />
                          </button>
                          <input
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            placeholder={aiMode ? "AI agentə mesaj yazın…" : "Cavabınızı yazın…"}
                            maxLength={2000}
                            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                          />
                          <button type="button" disabled className="grid h-8 w-8 place-items-center rounded-lg text-white/30" aria-label="Emoji">
                            <Smile className="h-4 w-4" />
                          </button>
                          <button
                            type="submit"
                            disabled={busy || !draft.trim() || (aiMode && !selectedAgent)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-3 py-1.5 text-xs font-semibold text-[#07090C] transition disabled:opacity-50"
                          >
                            {busy ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Send className="h-3.5 w-3.5" />
                            )}
                            Göndər
                          </button>
                        </form>
                      </div>

                    </>
                  ) : (
                    <div className="flex-1 grid place-items-center text-white/40 text-sm">Söhbət seçilməyib</div>
                  )}
                </div>

                {/* Details panel */}
                <div className="space-y-4 lg:col-span-2 2xl:col-span-1">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-4">Söhbət Təfərrüatları</div>
                    {active ? (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white text-sm font-bold uppercase">
                            <Hash className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold truncate">Sessiya #{active.id.slice(0, 8)}</div>
                            <div className="text-[11px] text-white/50 truncate">{active.messageCount} mesaj</div>
                          </div>
                        </div>

                        <div className="mt-5 space-y-3">
                          <DetailRow icon={Bot} label="Təyin edilmiş agent" value={selectedAgent?.name ?? "Təyin edilməyib"} />
                          <DetailRow
                            icon={Activity}
                            label="Sentiment"
                            value={<span className="text-white/40">Hələ məlumat yoxdur</span>}
                          />
                          <DetailRow icon={Languages} label="Dil" value={active.locale} />
                          <DetailRow icon={Globe} label="Kanal" value="Veb saytı çatı" />
                          <DetailRow icon={Calendar} label="İlk əlaqə" value={active.firstContact.toLocaleString("az-AZ")} />
                          <DetailRow icon={Activity} label="Son fəaliyyət" value={active.lastActivity.toLocaleString("az-AZ")} />
                        </div>

                        <div className="mt-5">
                          <div className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-white/40">
                            <Tag className="h-3 w-3" /> Etiketlər
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/40">
                              Təyin edilməyib
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-white/40">Hələ məlumat yoxdur</p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">Sürətli Əməliyyatlar</div>
                    <div className="space-y-2">
                      <button
                        onClick={exportTranscript}
                        className="flex w-full items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5 text-xs text-white transition hover:bg-white/[0.05] hover:border-cyan-400/30"
                      >
                        <Download className="h-4 w-4 text-cyan-300" />
                        Transkripti ixrac et
                      </button>
                      <Link
                        to="/crm"
                        className="flex w-full items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5 text-xs text-white transition hover:bg-white/[0.05] hover:border-cyan-400/30"
                      >
                        <Users className="h-4 w-4 text-cyan-300" />
                        CRM-də izlə
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] pl-3 pr-1.5 py-1.5 text-xs">
      <span className="text-white/50">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-transparent pr-6 py-1 text-white focus:outline-none cursor-pointer"
        style={{ backgroundImage: "none" }}
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#0B0F14]">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MessageCircle;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2 text-white/50">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="text-right text-white/90 truncate">{value}</div>
    </div>
  );
}
