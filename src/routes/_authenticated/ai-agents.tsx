import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
  Plus,
  Upload,
  Sparkles,
  Zap,
  Clock,
  Activity,
  ArrowUpRight,
  Circle,
  Globe2,
  Mail,
  MessageCircle,
  Instagram,
  Facebook,
  Database,
  BookOpen,
  CheckCircle2,
  Pencil,
  
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAgentixMetrics } from "@/lib/metrics";
import { useAgents, useAgentMutations } from "@/lib/platform/hooks";
import { useRealtimeInvalidate } from "@/lib/realtime";
import { queryKeys } from "@/lib/api/keys";
import type { AgentKind, AgentRow } from "@/lib/api/agents";
import { toast } from "sonner";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/ai-agents")({
  head: () => ({
    meta: [
      { title: "AI Agentləri — Agentix" },
      { name: "description", content: "AI iş qüvvənizi yaradın, idarə edin və izləyin." },
      { property: "og:title", content: "AI Agentləri — Agentix" },
      { property: "og:description", content: "AI iş qüvvənizi yaradın, idarə edin və izləyin." },
    ],
  }),
  component: AIAgentsPage,
});

const navItems = [
  { key: "dashboard", label: "İdarəetmə Paneli", icon: LayoutDashboard, to: "/dashboard" as const },
  { key: "agents", label: "AI Agentləri", icon: Bot, to: "/ai-agents" as const, active: true },
  { key: "conversations", label: "Söhbətlər", icon: MessageSquare, to: "/conversations" as const },
  { key: "leads", label: "Müştəri Namizədləri", icon: Users, to: "/crm" as const },
  { key: "demos", label: "Demo Sorğuları", icon: CalendarCheck, to: "/demo-requests" as const },
  { key: "analytics", label: "Analitika", icon: BarChart3, to: "/analytics" as const },
  { key: "billing", label: "Ödənişlər", icon: CreditCard, to: "/billing" as const },
  { key: "settings", label: "Tənzimləmələr", icon: Settings, to: "/settings" as const },
  { key: "support", label: "Dəstək", icon: LifeBuoy, to: "/support" as const },
];

const channels = [
  { name: "Website", icon: Globe2 },
  { name: "WhatsApp", icon: MessageCircle },
  { name: "Instagram", icon: Instagram },
  { name: "Messenger", icon: Facebook },
  { name: "Email", icon: Mail },
];

const AGENT_KINDS: { value: AgentKind; label: string }[] = [
  { value: "chat", label: "Çat" },
  { value: "voice", label: "Səsli" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "instagram", label: "Instagram" },
  { value: "email", label: "E-poçt" },
  { value: "document", label: "Sənəd" },
  { value: "scheduling", label: "Görüş planlama" },
];

const LANGUAGES: { value: string; label: string }[] = [
  { value: "az", label: "Azərbaycan dili" },
  { value: "en", label: "English" },
  { value: "tr", label: "Türkçe" },
  { value: "ru", label: "Русский" },
  { value: "ar", label: "العربية" },
];

const MODELS = ["google/gemini-2.5-flash", "google/gemini-2.5-pro", "openai/gpt-5-mini", "openai/gpt-5"];

const STATUS_LABEL: Record<string, string> = {
  draft: "Qaralama",
  training: "Təlimdə",
  active: "Aktiv",
  paused: "Dayandırılıb",
  error: "Xəta",
};

type AgentFormState = {
  name: string;
  kind: AgentKind;
  language: string;
  model: string;
  description: string;
};

const emptyForm: AgentFormState = {
  name: "",
  kind: "chat",
  language: "az",
  model: MODELS[0]!,
  description: "",
};

function AIAgentsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<AgentRow | null>(null);
  const [form, setForm] = useState<AgentFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const { data: metrics } = useAgentixMetrics(user?.id);

  const agentsQuery = useAgents();
  const agents = agentsQuery.data ?? [];
  const { create, update, remove } = useAgentMutations();

  useRealtimeInvalidate(["ai_agents", "ai_chat_messages"], [
    queryKeys.agents.all,
    queryKeys.metrics.all,
  ]);

  const activeAgents = agents.filter((a) => a.status === "active").length;
  const automations = agents.filter((a) => a.kind !== "chat").length;

  const stats = [
    { label: "Aktiv Agentlər", value: String(activeAgents), icon: Bot },
    { label: "Mesajlar", value: String(metrics?.chatMessages ?? 0), icon: MessageSquare },
    { label: "Avtomatlaşdırmalar", value: String(automations), icon: Zap },
    { label: "Ümumi agentlər", value: String(agents.length), icon: Clock },
  ];

  const name = user?.email?.split("@")[0] || "İstifadəçi";

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setCreateOpen(true);
  };

  const openEdit = (agent: AgentRow) => {
    setEditing(agent);
    setForm({
      name: agent.name,
      kind: agent.kind,
      language: agent.language ?? "az",
      model: agent.model ?? MODELS[0]!,
      description: agent.description ?? "",
    });
    setFormError(null);
    setCreateOpen(true);
  };

  const closeModal = () => {
    if (create.isPending || update.isPending) return;
    setCreateOpen(false);
    setEditing(null);
    setFormError(null);
  };

  const submitForm = async () => {
    if (create.isPending || update.isPending) return;
    const trimmed = form.name.trim();
    if (!trimmed) {
      setFormError("Agent adı zəruridir.");
      return;
    }
    setFormError(null);
    try {
      if (editing) {
        await update.mutateAsync({
          id: editing.id,
          patch: {
            name: trimmed,
            kind: form.kind,
            language: form.language,
            model: form.model,
            description: form.description.trim() || null,
          },
        });
        toast.success("Agent yeniləndi");
      } else {
        await create.mutateAsync({
          name: trimmed,
          kind: form.kind,
          language: form.language,
          model: form.model,
          description: form.description.trim() || null,
        });
        toast.success("Agent yaradıldı");
      }
      setCreateOpen(false);
      setEditing(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Əməliyyat alınmadı.";
      setFormError(message);
      toast.error(message);
    }
  };

  const toggleStatus = async (agent: AgentRow) => {
    const next = agent.status === "active" ? "paused" : "active";
    try {
      await update.mutateAsync({ id: agent.id, patch: { status: next } });
      toast.success(next === "active" ? "Agent aktivləşdirildi" : "Agent dayandırıldı");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Status dəyişdirilə bilmədi.");
    }
  };

  const archiveAgentRow = async (agent: AgentRow) => {
    try {
      await remove.mutateAsync(agent.id);
      toast.success("Agent arxivləndi");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Agent arxivlənə bilmədi.");
    }
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
                        layoutId="active-nav-agents"
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
                  placeholder="Agentləri axtar…"
                  className="h-10 w-full rounded-xl border border-white/8 bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.05] transition"
                />
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  aria-label="Bildirişlər"
                  className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/8 bg-white/[0.03] text-white/70 hover:text-white hover:border-cyan-400/30 transition"
                >
                  <Bell className="h-4.5 w-4.5" />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
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

          <div className="flex gap-6 px-4 sm:px-8 py-8">
            <div className="flex-1 min-w-0 space-y-8">
              {/* Page header */}
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
              >
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-[11px] font-medium text-cyan-300">
                    <Bot className="h-3 w-3" /> İş Qüvvəsi
                  </div>
                  <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">AI Agentləri</h1>
                  <p className="mt-1 text-white/60 max-w-xl">
                    Create, manage and monitor your AI workforce.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setCreateOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-sm font-semibold text-[#07090C] shadow-[0_0_30px_-5px_rgba(34,211,238,0.6)] hover:shadow-[0_0_40px_-5px_rgba(34,211,238,0.8)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Plus className="h-4 w-4" /> Agent Yarat
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06] hover:border-white/20 transition">
                    <Upload className="h-4 w-4" /> Agent İdxal Et
                  </button>
                </div>
              </motion.section>

              {/* Stats */}
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      whileHover={{ y: -3 }}
                      className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-5 hover:border-cyan-400/25 transition-all"
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 transition-opacity" />
                      <div className="relative">
                        <div className="flex items-center justify-between">
                          <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-cyan-300">
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                        </div>
                        <div className="mt-5 text-3xl font-bold tracking-tight">{s.value}</div>
                        <div className="mt-1 text-xs text-white/50">{s.label}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </section>

              {/* Agents grid */}
              <section>
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight">Sizin agentləriniz</h2>
                    <p className="text-xs text-white/50">Hər AI işçinin canlı görünüşü</p>
                  </div>
                  <button className="text-xs font-medium text-cyan-300 hover:text-cyan-200">Rolları idarə et</button>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-10 flex flex-col items-center justify-center text-center">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 text-cyan-300 shadow-[0_0_20px_-6px_rgba(34,211,238,0.6)]">
                    <Bot className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold tracking-tight">Hələ AI agent yaradılmayıb</h3>
                  <p className="mt-1.5 max-w-sm text-sm text-white/50">
                    İş qüvvənizi qurmaq üçün ilk AI agentinizi yaradın və müştəri əlaqələrini avtomatlaşdırın.
                  </p>
                  <button
                    onClick={() => setCreateOpen(true)}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-sm font-semibold text-[#07090C] shadow-[0_0_30px_-5px_rgba(34,211,238,0.6)] hover:shadow-[0_0_40px_-5px_rgba(34,211,238,0.8)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Plus className="h-4 w-4" /> Agent Yarat
                  </button>
                </div>
              </section>
            </div>

            {/* Right panel */}
            <aside className="hidden xl:block w-80 shrink-0 space-y-6">
              <div className="sticky top-40 space-y-6">
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Təlim</h3>
                    <Activity className="h-4 w-4 text-cyan-300" />
                  </div>
                  <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                    <p className="text-xs text-white/50">Hələ məlumat yoxdur</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Bilik bazası</h3>
                    <BookOpen className="h-4 w-4 text-cyan-300" />
                  </div>
                  <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                    <p className="text-xs text-white/50">Hələ məlumat yoxdur</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Qoşulmuş kanallar</h3>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/50">
                      <Circle className="h-1.5 w-1.5 fill-current" /> Deaktiv
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {channels.map((c) => {
                      const Icon = c.icon;
                      return (
                        <li key={c.name} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="grid h-7 w-7 place-items-center rounded-lg bg-white/[0.04] border border-white/10 text-white/40">
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-sm font-medium text-white/60">{c.name}</span>
                          </div>
                          <span className="relative flex h-2 w-2">
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-white/20" />
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Create Agent modal */}
      <AnimatePresence>
        {createOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setCreateOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0B0F14]/95 shadow-[0_30px_80px_-20px_rgba(34,211,238,0.35)]"
            >
              <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/20 blur-[100px]" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-600/15 blur-[100px]" />

              <div className="relative flex items-start justify-between px-6 pt-6 sm:px-8 sm:pt-8">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-[11px] font-medium text-cyan-300">
                    <Sparkles className="h-3 w-3" /> Yeni agent
                  </div>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight">AI Agent Yarat</h2>
                  <p className="mt-1 text-sm text-white/60">Configure a new AI employee for your workspace.</p>
                </div>
                <button
                  onClick={() => setCreateOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/60 hover:text-white"
                  aria-label="Bağla"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="relative grid gap-4 px-6 py-6 sm:grid-cols-2 sm:px-8">
                <Field label="Agent Adı" placeholder="məs. Nova Dəstək" />
                <Field label="Rol" placeholder="məs. Müştəri Dəstəyi" />
                <SelectField label="Dil" options={["Azerbaijani", "English", "Turkish", "Russian", "Arabic"]} />
                <SelectField label="Model" options={["Agentix Pro", "Agentix Lite", "GPT-4o", "Claude 3.5 Sonnet"]} />
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">Təsvir</label>
                  <textarea
                    rows={3}
                    placeholder="Bu agentin nə edəcəyini təsvir edin…"
                    className="mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.05] transition"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">Bilik mənbəyi</label>
                  <div className="mt-1.5 grid gap-2 sm:grid-cols-3">
                    {[
                      { label: "Faylları yüklə", icon: Upload },
                      { label: "Sayt URL-i", icon: Globe2 },
                      { label: "Mövcud baza", icon: Database },
                    ].map((k) => {
                      const Icon = k.icon;
                      return (
                        <button
                          key={k.label}
                          type="button"
                          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white/80 hover:border-cyan-400/30 hover:bg-white/[0.05] transition text-left"
                        >
                          <Icon className="h-4 w-4 text-cyan-300" /> {k.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-between gap-3 border-t border-white/8 bg-white/[0.02] px-6 py-4 sm:px-8">
                <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/50">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> Bütün kanallara dərhal tətbiq olunur
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() => setCreateOpen(false)}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/[0.06] transition"
                  >
                    Ləğv et
                  </button>
                  <button
                    onClick={() => setCreateOpen(false)}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-[#07090C] shadow-[0_0_30px_-5px_rgba(34,211,238,0.6)] hover:shadow-[0_0_40px_-5px_rgba(34,211,238,0.8)] transition"
                  >
                    <Sparkles className="h-4 w-4" /> Agent Yarat
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">{label}</label>
      <input
        placeholder={placeholder}
        className="mt-1.5 h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.05] transition"
      />
    </div>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">{label}</label>
      <select className="mt-1.5 h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-white focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.05] transition">
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#0B0F14]">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
