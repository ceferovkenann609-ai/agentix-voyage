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
  Sparkles,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Zap,
  DollarSign,
  Clock,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  ShieldCheck,
  Cpu,
  Award,
  Crown,
  Headphones,
  ShoppingBag,
  CalendarClock,
  Globe,
  Phone,
  Instagram,
  Mail,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";

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

const kpis = [
  { label: "Total Conversations", value: "48,392", delta: "+14.8%", up: true, icon: MessageSquare, tone: "from-cyan-500/20 to-blue-500/10" },
  { label: "Active AI Agents", value: "12", delta: "+3", up: true, icon: Bot, tone: "from-blue-500/20 to-indigo-500/10" },
  { label: "Generated Leads", value: "3,284", delta: "+22.4%", up: true, icon: Users, tone: "from-emerald-500/20 to-cyan-500/10" },
  { label: "Conversion Rate", value: "18.6%", delta: "+2.1pt", up: true, icon: Target, tone: "from-cyan-400/20 to-emerald-500/10" },
  { label: "Monthly Revenue", value: "$184,920", delta: "+11.2%", up: true, icon: DollarSign, tone: "from-emerald-500/20 to-blue-500/10" },
  { label: "Avg Response Time", value: "1.1s", delta: "-0.3s", up: true, icon: Clock, tone: "from-cyan-500/20 to-blue-500/10" },
];

const conversationsSeries = [
  { d: "Mon", conv: 4200, leads: 480 },
  { d: "Tue", conv: 5100, leads: 612 },
  { d: "Wed", conv: 4780, leads: 540 },
  { d: "Thu", conv: 6320, leads: 720 },
  { d: "Fri", conv: 7180, leads: 902 },
  { d: "Sat", conv: 5980, leads: 810 },
  { d: "Sun", conv: 6890, leads: 940 },
];

const revenueSeries = [
  { m: "Jan", rev: 82000 },
  { m: "Feb", rev: 96500 },
  { m: "Mar", rev: 108200 },
  { m: "Apr", rev: 121400 },
  { m: "May", rev: 138600 },
  { m: "Jun", rev: 152300 },
  { m: "Jul", rev: 168900 },
  { m: "Aug", rev: 184920 },
];

const aiUsageSeries = [
  { h: "00", usage: 22 },
  { h: "04", usage: 14 },
  { h: "08", usage: 58 },
  { h: "12", usage: 92 },
  { h: "16", usage: 78 },
  { h: "20", usage: 46 },
];

const topAgents = [
  { name: "Customer Support AI", score: 96, conv: 12482, icon: Headphones },
  { name: "Sales Assistant", score: 92, conv: 5204, icon: ShoppingBag },
  { name: "Appointment Booking AI", score: 98, conv: 3910, icon: CalendarClock },
  { name: "Lead Qualifier", score: 89, conv: 4820, icon: Target },
  { name: "WhatsApp Concierge", score: 94, conv: 6180, icon: MessageSquare },
];

const channelDistribution = [
  { name: "WhatsApp", value: 38, color: "#22d3ee" },
  { name: "Web Chat", value: 27, color: "#60a5fa" },
  { name: "Voice", value: 14, color: "#34d399" },
  { name: "Instagram", value: 12, color: "#a78bfa" },
  { name: "Email", value: 9, color: "#f472b6" },
];

const recentReports = [
  { title: "Weekly Performance Summary", date: "Today · 09:12", size: "1.2 MB" },
  { title: "Lead Conversion Analysis", date: "Yesterday", size: "820 KB" },
  { title: "Channel ROI Report — Q3", date: "2 days ago", size: "2.4 MB" },
  { title: "AI Accuracy Audit", date: "5 days ago", size: "640 KB" },
];

const systemHealth = [
  { label: "AI Uptime", value: "99.98%", tone: "text-emerald-300" },
  { label: "API Latency", value: "184ms", tone: "text-cyan-300" },
  { label: "Error Rate", value: "0.04%", tone: "text-emerald-300" },
  { label: "Queue Depth", value: "12", tone: "text-cyan-300" },
];

const performanceRanking = [
  { name: "Customer Support AI", role: "Support", score: 96, trend: "+2.1%", conv: "12,482", up: true },
  { name: "Appointment Booking AI", role: "Scheduling", score: 98, trend: "+3.4%", conv: "3,910", up: true },
  { name: "WhatsApp Concierge", role: "Omnichannel", score: 94, trend: "+1.8%", conv: "6,180", up: true },
  { name: "Sales Assistant", role: "Sales", score: 92, trend: "+0.9%", conv: "5,204", up: true },
  { name: "Lead Qualifier", role: "Lead Gen", score: 89, trend: "-0.4%", conv: "4,820", up: false },
];

const channelPerformance = [
  { name: "WhatsApp", icon: MessageSquare, conv: "18,240", cr: "22.4%", rev: "$68,420", tone: "from-emerald-500/20 to-cyan-500/10" },
  { name: "Web Chat", icon: Globe, conv: "13,120", cr: "19.1%", rev: "$52,180", tone: "from-cyan-500/20 to-blue-500/10" },
  { name: "Voice", icon: Phone, conv: "6,840", cr: "16.8%", rev: "$28,940", tone: "from-blue-500/20 to-indigo-500/10" },
  { name: "Instagram", icon: Instagram, conv: "5,720", cr: "12.3%", rev: "$18,620", tone: "from-cyan-400/20 to-emerald-500/10" },
  { name: "Email", icon: Mail, conv: "4,472", cr: "9.6%", rev: "$16,760", tone: "from-blue-500/20 to-cyan-500/10" },
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

function AnalyticsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");

  const name = user?.email?.split("@")[0] || "İstifadəçi";

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
                const Trend = k.up ? ArrowUpRight : ArrowDownRight;
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
                      <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${k.up ? "bg-emerald-500/10 text-emerald-300 border border-emerald-400/20" : "bg-rose-500/10 text-rose-300 border border-rose-400/20"}`}>
                        <Trend className="h-3 w-3" /> {k.delta}
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
                <ChartCard title="Conversations over Time" subtitle="Weekly volume across all channels" icon={MessageSquare}>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={conversationsSeries}>
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
                      <Area type="monotone" dataKey="conv" stroke="#22d3ee" strokeWidth={2} fill="url(#cyanFill)" />
                      <Area type="monotone" dataKey="leads" stroke="#60a5fa" strokeWidth={2} fill="url(#blueFill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Lead Growth */}
                  <ChartCard title="Lead Growth" subtitle="Qualified leads per day" icon={Users}>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={conversationsSeries}>
                        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="d" stroke="rgba(255,255,255,0.35)" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.35)" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip {...chartTooltip} />
                        <Bar dataKey="leads" radius={[6, 6, 0, 0]}>
                          {conversationsSeries.map((_, i) => (
                            <Cell key={i} fill={i % 2 === 0 ? "#22d3ee" : "#60a5fa"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  {/* Revenue Trend */}
                  <ChartCard title="Revenue Trend" subtitle="Monthly recurring revenue" icon={DollarSign}>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={revenueSeries}>
                        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="m" stroke="rgba(255,255,255,0.35)" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.35)" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip {...chartTooltip} />
                        <Line type="monotone" dataKey="rev" stroke="#34d399" strokeWidth={2.5} dot={{ r: 3, fill: "#34d399" }} activeDot={{ r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* AI Usage */}
                  <ChartCard title="AI Usage" subtitle="Requests per hour (24h)" icon={Cpu}>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={aiUsageSeries}>
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
                  </ChartCard>

                  {/* Channel Distribution */}
                  <ChartCard title="Channel Distribution" subtitle="Share of total conversations" icon={Activity}>
                    <div className="flex items-center gap-4">
                      <ResponsiveContainer width="55%" height={200}>
                        <PieChart>
                          <Pie
                            data={channelDistribution}
                            innerRadius={48}
                            outerRadius={78}
                            paddingAngle={3}
                            dataKey="value"
                            stroke="none"
                          >
                            {channelDistribution.map((c) => (
                              <Cell key={c.name} fill={c.color} />
                            ))}
                          </Pie>
                          <Tooltip {...chartTooltip} />
                        </PieChart>
                      </ResponsiveContainer>
                      <ul className="flex-1 space-y-2">
                        {channelDistribution.map((c) => (
                          <li key={c.name} className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2 text-white/70">
                              <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                              {c.name}
                            </span>
                            <span className="font-semibold text-white">{c.value}%</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ChartCard>
                </div>

                {/* Top Performing AI Agents */}
                <ChartCard title="Top Performing AI Agents" subtitle="Ranked by accuracy score" icon={Award}>
                  <div className="space-y-3">
                    {topAgents.map((a, i) => {
                      const Icon = a.icon;
                      return (
                        <div key={a.name} className="flex items-center gap-4">
                          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.04] border border-white/10">
                            <Icon className="h-4 w-4 text-cyan-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-semibold truncate">{a.name}</span>
                              <span className="text-white/60 text-xs">{a.conv.toLocaleString()} conv.</span>
                            </div>
                            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${a.score}%` }}
                                transition={{ duration: 0.8, delay: 0.1 * i, ease: "easeOut" }}
                                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                              />
                            </div>
                          </div>
                          <div className="w-12 text-right text-sm font-bold text-cyan-300">{a.score}%</div>
                        </div>
                      );
                    })}
                  </div>
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
                    <div className="mt-4 flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                        <CalendarClock className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-base font-bold">Appointment Booking AI</div>
                        <div className="text-[11px] text-white/50">Scheduling · 3,910 conversations</div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <Stat label="Accuracy" value="98%" />
                      <Stat label="CSAT" value="4.9" />
                      <Stat label="Handoff" value="1.2%" />
                    </div>
                  </div>
                </motion.div>

                {/* Recent Reports */}
                <PanelCard title="Recent Reports" icon={FileText}>
                  <ul className="space-y-2">
                    {recentReports.map((r) => (
                      <li key={r.title} className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5 hover:border-cyan-400/20 hover:bg-white/[0.04] transition">
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.04] border border-white/10">
                          <FileText className="h-3.5 w-3.5 text-cyan-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold truncate">{r.title}</div>
                          <div className="text-[10px] text-white/50">{r.date} · {r.size}</div>
                        </div>
                        <Download className="h-3.5 w-3.5 text-white/40 group-hover:text-cyan-300 transition" />
                      </li>
                    ))}
                  </ul>
                </PanelCard>

                {/* System Health */}
                <PanelCard title="System Health" icon={ShieldCheck}>
                  <div className="grid grid-cols-2 gap-2">
                    {systemHealth.map((s) => (
                      <div key={s.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                        <div className="text-[10px] uppercase tracking-wider text-white/40">{s.label}</div>
                        <div className={`mt-1 text-sm font-bold ${s.tone}`}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/5 px-3 py-2 text-[11px] text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    All services operational
                  </div>
                </PanelCard>

                {/* AI Accuracy */}
                <PanelCard title="AI Accuracy" icon={Target}>
                  <div className="flex items-center gap-4">
                    <RingGauge value={94} />
                    <div className="text-xs text-white/60 space-y-1.5">
                      <Row label="Intent match" value="96%" />
                      <Row label="Response quality" value="93%" />
                      <Row label="Handoff correctness" value="92%" />
                    </div>
                  </div>
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
                <p className="mt-1 text-xs text-white/50">Highlights from the last 7 days.</p>
                <ul className="mt-4 space-y-3">
                  {[
                    { icon: MessageSquare, label: "Söhbətlər", value: "+14.8%", desc: "vs previous week" },
                    { icon: Users, label: "Leads captured", value: "+22.4%", desc: "3,284 total" },
                    { icon: DollarSign, label: "Revenue", value: "+11.2%", desc: "$184,920 MRR" },
                    { icon: Zap, label: "Automations", value: "47", desc: "5 new this week" },
                  ].map((r) => {
                    const Icon = r.icon;
                    return (
                      <li key={r.label} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.04] border border-white/10">
                          <Icon className="h-4 w-4 text-cyan-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold">{r.label}</div>
                          <div className="text-[10px] text-white/50">{r.desc}</div>
                        </div>
                        <div className="text-sm font-bold text-emerald-300">{r.value}</div>
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
                  <div className="text-[11px] text-white/40">Sorted by accuracy</div>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[560px] text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-wider text-white/40">
                        <th className="py-2 pr-3 font-medium">#</th>
                        <th className="py-2 pr-3 font-medium">Agent</th>
                        <th className="py-2 pr-3 font-medium">Role</th>
                        <th className="py-2 pr-3 font-medium">Accuracy</th>
                        <th className="py-2 pr-3 font-medium">Trend</th>
                        <th className="py-2 pr-3 font-medium">Conversations</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceRanking.map((r, i) => {
                        const Trend = r.up ? ArrowUpRight : ArrowDownRight;
                        return (
                          <tr key={r.name} className="border-t border-white/5 hover:bg-white/[0.02] transition">
                            <td className="py-3 pr-3 text-xs text-white/50">{i + 1}</td>
                            <td className="py-3 pr-3 font-semibold">{r.name}</td>
                            <td className="py-3 pr-3 text-xs text-white/60">{r.role}</td>
                            <td className="py-3 pr-3">
                              <span className="inline-flex items-center gap-2">
                                <span className="text-cyan-300 font-bold">{r.score}%</span>
                                <span className="h-1.5 w-16 overflow-hidden rounded-full bg-white/5">
                                  <span className="block h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${r.score}%` }} />
                                </span>
                              </span>
                            </td>
                            <td className="py-3 pr-3">
                              <span className={`inline-flex items-center gap-1 text-xs font-semibold ${r.up ? "text-emerald-300" : "text-rose-300"}`}>
                                <Trend className="h-3.5 w-3.5" /> {r.trend}
                              </span>
                            </td>
                            <td className="py-3 pr-3 text-xs text-white/70">{r.conv}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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
                <div className="text-[11px] text-white/40">Last 30 days</div>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {channelPerformance.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <motion.div
                      key={c.name}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className={`relative overflow-hidden rounded-xl border border-white/8 bg-gradient-to-br ${c.tone} p-4 hover:border-cyan-400/30 transition`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.05] border border-white/10">
                          <Icon className="h-4 w-4 text-cyan-300" />
                        </div>
                        <div className="text-sm font-semibold">{c.name}</div>
                      </div>
                      <div className="mt-3 space-y-1.5 text-xs">
                        <Row label="Conversations" value={c.conv} />
                        <Row label="Conv. rate" value={c.cr} />
                        <Row label="Revenue" value={c.rev} />
                      </div>
                    </motion.div>
                  );
                })}
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.03] py-2">
      <div className="text-sm font-bold text-white">{value}</div>
      <div className="text-[10px] text-white/50">{label}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/50">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}

function RingGauge({ value }: { value: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative h-20 w-20 shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="7" fill="none" />
        <motion.circle
          cx="40"
          cy="40"
          r={r}
          stroke="url(#ringGrad)"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ strokeDasharray: c }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-base font-bold text-white">{value}%</div>
          <div className="text-[9px] text-white/50">accuracy</div>
        </div>
      </div>
    </div>
  );
}
