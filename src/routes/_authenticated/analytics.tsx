import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { eachDayOfInterval, format, startOfDay, subDays } from "date-fns";
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
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  Target,
  Activity,
  FileText,
  ShieldCheck,
  Cpu,
  Award,
  Crown,
  Inbox,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { useAgentixMetrics } from "@/lib/metrics";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Agentix" },
      { name: "description", content: "Track AI performance, business growth and customer engagement in real time." },
      { property: "og:title", content: "Analytics — Agentix" },
      { property: "og:description", content: "Track AI performance, business growth and customer engagement in real time." },
    ],
  }),
  component: AnalyticsPage,
});

const navItems = [
  { key: "dashboard", label: "İdarəetmə Paneli", icon: LayoutDashboard, to: "/dashboard" as const },
  { key: "agents", label: "AI Agentləri", icon: Bot, to: "/ai-agents" as const },
  { key: "conversations", label: "Söhbətlər", icon: MessageSquare, to: "/conversations" as const },
  { key: "leads", label: "Müştəri Namizədləri", icon: Users, to: "/crm" as const },
  { key: "demos", label: "Demo Sorğuları", icon: CalendarCheck, to: "/demo-requests" as const },
  { key: "analytics", label: "Analitika", icon: BarChart3, to: "/analytics" as const, active: true },
  { key: "billing", label: "Ödənişlər", icon: CreditCard, to: "/billing" as const },
  { key: "settings", label: "Tənzimləmələr", icon: Settings, to: "/settings" as const },
  { key: "support", label: "Dəstək", icon: LifeBuoy, to: "/support" as const },
];

const chartTooltip = {
  contentStyle: {
    background: "rgba(11,15,20,0.95)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    color: "#fff",
    fontSize: 12,
    boxShadow: "0 10px 40px -10px rgba(0,0,0,0.6)",
  },
  labelStyle: { color: "rgba(255,255,255,0.6)", fontSize: 11 },
};

const RANGE_DAYS: Record<"7d" | "30d" | "90d", number> = { "7d": 7, "30d": 30, "90d": 90 };

type RangeSeriesPoint = { d: string; leads: number; chats: number; demos: number; revenue: number };
type HourPoint = { h: string; usage: number };

async function fetchTimestamps(table: "crm_leads" | "ai_chat_messages" | "demo_bookings", since: string, extraSelect = "created_at") {
  const { data, error } = await supabase.from(table).select(extraSelect).gte("created_at", since);
  if (error) throw error;
  return data ?? [];
}

function useAnalyticsSeries(userId: string | undefined, range: "7d" | "30d" | "90d") {
  return useQuery({
    queryKey: ["agentix-analytics-series", userId, range],
    enabled: !!userId,
    staleTime: 30_000,
    queryFn: async (): Promise<{ series: RangeSeriesPoint[]; hourly: HourPoint[] }> => {
      const days = RANGE_DAYS[range];
      const since = startOfDay(subDays(new Date(), days - 1)).toISOString();

      const [leadsRows, chatRows, demoRows] = await Promise.all([
        fetchTimestamps("crm_leads", since, "created_at,value,status"),
        fetchTimestamps("ai_chat_messages", since),
        fetchTimestamps("demo_bookings", since),
      ]);

      const dayKeys = eachDayOfInterval({ start: subDays(new Date(), days - 1), end: new Date() }).map((d) => ({
        key: format(d, "yyyy-MM-dd"),
        label: format(d, days > 30 ? "MMM d" : "EEE d"),
      }));

      const series: RangeSeriesPoint[] = dayKeys.map(({ key, label }) => ({
        d: label,
        leads: 0,
        chats: 0,
        demos: 0,
        revenue: 0,
      }));
      const indexByKey = new Map(dayKeys.map((k, i) => [k.key, i]));

      for (const row of leadsRows as any[]) {
        const key = format(new Date(row.created_at), "yyyy-MM-dd");
        const idx = indexByKey.get(key);
        if (idx === undefined) continue;
        series[idx].leads += 1;
        if (row.status === "won") series[idx].revenue += Number(row.value ?? 0);
      }
      for (const row of chatRows as any[]) {
        const key = format(new Date(row.created_at), "yyyy-MM-dd");
        const idx = indexByKey.get(key);
        if (idx === undefined) continue;
        series[idx].chats += 1;
      }
      for (const row of demoRows as any[]) {
        const key = format(new Date(row.created_at), "yyyy-MM-dd");
        const idx = indexByKey.get(key);
        if (idx === undefined) continue;
        series[idx].demos += 1;
      }

      const hourly: HourPoint[] = Array.from({ length: 24 }, (_, h) => ({ h: h.toString().padStart(2, "0"), usage: 0 }));
      for (const row of chatRows as any[]) {
        const hour = new Date(row.created_at).getHours();
        hourly[hour].usage += 1;
      }

      return { series, hourly };
    },
  });
}

function hasAnyValue(points: { [k: string]: unknown }[], key: string) {
  return points.some((p) => Number(p[key] ?? 0) > 0);
}

function AnalyticsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");

  const name = user?.email?.split("@")[0] || "İstifadəçi";

  const { data: metrics } = useAgentixMetrics(user?.id);
  const { data: analytics, isLoading: seriesLoading } = useAnalyticsSeries(user?.id, range);

  const series = analytics?.series ?? [];
  const hourly = analytics?.hourly ?? [];

  const hasConversations = useMemo(() => hasAnyValue(series, "chats") || hasAnyValue(series, "leads"), [series]);
  const hasRevenue = useMemo(() => hasAnyValue(series, "revenue"), [series]);
  const hasLeadsGrowth = useMemo(() => hasAnyValue(series, "leads"), [series]);
  const hasUsage = useMemo(() => hourly.some((p) => p.usage > 0), [hourly]);

  const kpis = [
    { label: "Ümumi Namizədlər", value: metrics?.leadsTotal ?? 0, icon: Users, tone: "from-emerald-500/20 to-cyan-500/10" },
    { label: "Uyğunlaşdırılmış", value: metrics?.leadsQualified ?? 0, icon: Target, tone: "from-cyan-400/20 to-emerald-500/10" },
    { label: "Qazanılmış Sövdələşmələr", value: metrics?.leadsWon ?? 0, icon: Award, tone: "from-cyan-500/20 to-blue-500/10" },
    { label: "Pipeline Dəyəri", value: `$${(metrics?.pipelineValue ?? 0).toLocaleString()}`, icon: DollarSign, tone: "from-emerald-500/20 to-blue-500/10" },
    { label: "Demo Sorğuları", value: metrics?.demoRequests ?? 0, icon: CalendarCheck, tone: "from-blue-500/20 to-indigo-500/10" },
    { label: "Söhbət Mesajları", value: metrics?.chatMessages ?? 0, icon: MessageSquare, tone: "from-cyan-500/20 to-blue-500/10" },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-[#07090C] text-white pt-20">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute top-1/2 -right-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />
      </div>

      <div className="relative flex">
        {/* Sidebar */}
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
                const isActive = item.active;
                const content = (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-analytics"
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
                const cls = `group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive ? "text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                }`;
                return (
                  <Link key={item.key} to={item.to} onClick={() => setSidebarOpen(false)} className={cls}>
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

        {/* Main column */}
        <div className="flex-1 min-w-0">
          {/* Header */}
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
                  placeholder="Search reports, metrics, agents…"
                  className="h-10 w-full rounded-xl border border-white/8 bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.05] transition"
                />
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  aria-label="Bildirişlər"
                  className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/8 bg-white/[0.03] text-white/70 hover:text-white hover:border-cyan-400/30 transition"
                >
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

          {/* Content */}
          <div className="px-4 sm:px-8 py-8 space-y-8">
            {/* Page header */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 sm:p-8"
            >
              <div className="pointer-events-none absolute -top-32 -right-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px]" />
              <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-blue-600/15 blur-[100px]" />
              <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-[11px] font-medium text-cyan-300">
                    <BarChart3 className="h-3 w-3" />
                    Intelligence Center
                  </div>
                  <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-white via-cyan-100 to-blue-300 bg-clip-text text-transparent">Analytics</span>
                  </h1>
                  <p className="mt-2 text-white/60 max-w-xl">
                    Track AI performance, business growth and customer engagement.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
                    {(["7d", "30d", "90d"] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setRange(r)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                          range === r
                            ? "bg-gradient-to-r from-cyan-400/20 to-blue-500/20 text-cyan-200 border border-cyan-400/30"
                            : "text-white/60 hover:text-white"
                        }`}
                      >
                        {r === "7d" ? "7 days" : r === "30d" ? "30 days" : "90 days"}
                      </button>
                    ))}
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.06] hover:border-white/20 transition">
                    <Calendar className="h-4 w-4" /> Date Range
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-[#07090C] shadow-[0_0_30px_-5px_rgba(34,211,238,0.6)] hover:shadow-[0_0_40px_-5px_rgba(34,211,238,0.8)] transition hover:scale-[1.02] active:scale-[0.98]">
                    <Download className="h-4 w-4" /> Export Report
                  </button>
                </div>
              </div>
            </motion.section>

            {/* KPI cards */}
            <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              {kpis.map((k, i) => {
                const Icon = k.icon;
                return (
                  <motion.div
                    key={k.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className={`relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br ${k.tone} p-5 hover:border-cyan-400/30 transition`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.05] border border-white/10">
                        <Icon className="h-4.5 w-4.5 text-cyan-300" />
                      </div>
                    </div>
                    <div className="mt-4 text-2xl font-bold tracking-tight">{k.value}</div>
                    <div className="mt-0.5 text-[11px] text-white/50">{k.label}</div>
                  </motion.div>
                );
              })}
            </section>

            {/* Charts grid + right panel */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-6">
                {/* Conversations over time */}
                <ChartCard title="Conversations over Time" subtitle="Daily chat messages and new leads" icon={MessageSquare}>
                  {seriesLoading ? (
                    <ChartLoading />
                  ) : !hasConversations ? (
                    <EmptyChart />
                  ) : (
                    <ResponsiveContainer width="100%" height={260}>
                      <AreaChart data={series}>
                        <defs>
                          <linearGradient id="cyanFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.6} />
                            <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="blueFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="d" stroke="rgba(255,255,255,0.35)" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.35)" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip {...chartTooltip} />
                        <Area type="monotone" dataKey="chats" name="Chats" stroke="#22d3ee" strokeWidth={2} fill="url(#cyanFill)" />
                        <Area type="monotone" dataKey="leads" name="Leads" stroke="#60a5fa" strokeWidth={2} fill="url(#blueFill)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Lead Growth */}
                  <ChartCard title="Lead Growth" subtitle="New leads per day" icon={Users}>
                    {seriesLoading ? (
                      <ChartLoading small />
                    ) : !hasLeadsGrowth ? (
                      <EmptyChart small />
                    ) : (
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={series}>
                          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="d" stroke="rgba(255,255,255,0.35)" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="rgba(255,255,255,0.35)" fontSize={11} tickLine={false} axisLine={false} />
                          <Tooltip {...chartTooltip} />
                          <Bar dataKey="leads" radius={[6, 6, 0, 0]}>
                            {series.map((_, i) => (
                              <Cell key={i} fill={i % 2 === 0 ? "#22d3ee" : "#60a5fa"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </ChartCard>

                  {/* Revenue Trend */}
                  <ChartCard title="Revenue Trend" subtitle="Won deal value per day" icon={DollarSign}>
                    {seriesLoading ? (
                      <ChartLoading small />
                    ) : !hasRevenue ? (
                      <EmptyChart small />
                    ) : (
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={series}>
                          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="d" stroke="rgba(255,255,255,0.35)" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="rgba(255,255,255,0.35)" fontSize={11} tickLine={false} axisLine={false} />
                          <Tooltip {...chartTooltip} />
                          <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#34d399" strokeWidth={2.5} dot={{ r: 3, fill: "#34d399" }} activeDot={{ r: 5 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </ChartCard>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* AI Usage */}
                  <ChartCard title="AI Usage" subtitle="Chat messages by hour of day" icon={Cpu}>
                    {seriesLoading ? (
                      <ChartLoading small />
                    ) : !hasUsage ? (
                      <EmptyChart small />
                    ) : (
                      <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={hourly}>
                          <defs>
                            <linearGradient id="usageFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.4} />
                              <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="h" stroke="rgba(255,255,255,0.35)" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="rgba(255,255,255,0.35)" fontSize={11} tickLine={false} axisLine={false} />
                          <Tooltip {...chartTooltip} />
                          <Area type="monotone" dataKey="usage" stroke="#a78bfa" strokeWidth={2} fill="url(#usageFill)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </ChartCard>

                  {/* Channel Distribution */}
                  <ChartCard title="Channel Distribution" subtitle="Share of total conversations" icon={Activity}>
                    <EmptyChart small message="Kanal üzrə məlumat mövcud deyil" />
                  </ChartCard>
                </div>

                {/* Top Performing AI Agents */}
                <ChartCard title="Top Performing AI Agents" subtitle="Ranked by accuracy score" icon={Award}>
                  <EmptyPanel message="Hələ məlumat yoxdur" />
                </ChartCard>
              </div>

              {/* Right panel */}
              <aside className="space-y-6">
                {/* Top Performing Agent */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/[0.08] to-blue-500/[0.04] p-5"
                >
                  <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-cyan-500/20 blur-[70px]" />
                  <div className="relative">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-cyan-300">
                      <Crown className="h-3.5 w-3.5" /> Top Performing Agent
                    </div>
                    <div className="mt-4 flex items-center gap-3 text-white/50 text-sm">
                      <Inbox className="h-5 w-5" />
                      Hələ məlumat yoxdur
                    </div>
                  </div>
                </motion.div>

                {/* Recent Reports */}
                <PanelCard title="Recent Reports" icon={FileText}>
                  <EmptyPanel message="Hesabat mövcud deyil" />
                </PanelCard>

                {/* System Health */}
                <PanelCard title="System Health" icon={ShieldCheck}>
                  <EmptyPanel message="Monitorinq mənbəyi qoşulmayıb" />
                </PanelCard>

                {/* AI Accuracy */}
                <PanelCard title="AI Accuracy" icon={Target}>
                  <EmptyPanel message="Dəqiqlik məlumatı mövcud deyil" />
                </PanelCard>
              </aside>
            </div>

            {/* Bottom sections */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Recent Performance Summary */}
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="xl:col-span-1 rounded-2xl border border-white/8 bg-white/[0.02] p-5"
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <TrendingUp className="h-4 w-4 text-cyan-300" /> Recent Performance Summary
                </div>
                <p className="mt-1 text-xs text-white/50">Cari ümumi göstəricilər.</p>
                <ul className="mt-4 space-y-3">
                  {[
                    { icon: MessageSquare, label: "Söhbət mesajları", value: metrics?.chatMessages ?? 0 },
                    { icon: Users, label: "Ümumi namizədlər", value: metrics?.leadsTotal ?? 0 },
                    { icon: DollarSign, label: "Pipeline dəyəri", value: `$${(metrics?.pipelineValue ?? 0).toLocaleString()}` },
                    { icon: CalendarCheck, label: "Demo sorğuları", value: metrics?.demoRequests ?? 0 },
                  ].map((r) => {
                    const Icon = r.icon;
                    return (
                      <li key={r.label} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.04] border border-white/10">
                          <Icon className="h-4 w-4 text-cyan-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold">{r.label}</div>
                        </div>
                        <div className="text-sm font-bold text-cyan-300">{r.value}</div>
                      </li>
                    );
                  })}
                </ul>
              </motion.section>

              {/* AI Performance Ranking */}
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="xl:col-span-2 rounded-2xl border border-white/8 bg-white/[0.02] p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Award className="h-4 w-4 text-cyan-300" /> AI Performance Ranking
                  </div>
                </div>
                <div className="mt-4">
                  <EmptyPanel message="Hələ məlumat yoxdur" />
                </div>
              </motion.section>
            </div>

            {/* Channel Performance */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-white/8 bg-white/[0.02] p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Activity className="h-4 w-4 text-cyan-300" /> Channel Performance
                </div>
              </div>
              <div className="mt-4">
                <EmptyPanel message="Kanal üzrə məlumat mövcud deyil" />
              </div>
            </motion.section>

            <div className="h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.04] border border-white/10">
            <Icon className="h-4 w-4 text-cyan-300" />
          </div>
          <div>
            <div className="text-sm font-semibold">{title}</div>
            {subtitle && <div className="text-[11px] text-white/50">{subtitle}</div>}
          </div>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </motion.div>
  );
}

function PanelCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-white/8 bg-white/[0.02] p-5"
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4 text-cyan-300" /> {title}
      </div>
      <div className="mt-4">{children}</div>
    </motion.div>
  );
}

function EmptyChart({ small, message = "Hələ məlumat yoxdur" }: { small?: boolean; message?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[0.01] text-white/40 ${
        small ? "h-[220px]" : "h-[260px]"
      }`}
    >
      <Inbox className="h-6 w-6" />
      <span className="text-xs">{message}</span>
    </div>
  );
}

function ChartLoading({ small }: { small?: boolean }) {
  return (
    <div className={`flex items-center justify-center rounded-xl border border-white/5 bg-white/[0.01] text-white/30 text-xs ${small ? "h-[220px]" : "h-[260px]"}`}>
      Yüklənir…
    </div>
  );
}

function EmptyPanel({ message = "Hələ məlumat yoxdur" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[0.01] py-10 text-white/40">
      <Inbox className="h-6 w-6" />
      <span className="text-xs">{message}</span>
    </div>
  );
}
