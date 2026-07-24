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
  Globe,
  UserPlus,
  Sparkles,
  TrendingUp,
  Activity,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  Circle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Agentix" },
      { name: "description", content: "Manage all your AI operations from one intelligent workspace." },
      { property: "og:title", content: "Dashboard — Agentix" },
      { property: "og:description", content: "Manage all your AI operations from one intelligent workspace." },
    ],
  }),
  component: DashboardPage,
});

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, active: true },
  { key: "agents", label: "AI Agents", icon: Bot },
  { key: "conversations", label: "Conversations", icon: MessageSquare },
  { key: "leads", label: "Leads", icon: Users },
  { key: "demos", label: "Demo Requests", icon: CalendarCheck },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "billing", label: "Billing", icon: CreditCard },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "support", label: "Support", icon: LifeBuoy },
];

const stats = [
  { label: "Active AI Agents", value: "12", growth: "+3 this week", icon: Bot, tone: "from-cyan-500/20 to-blue-500/10" },
  { label: "Conversations", value: "8,429", growth: "+12.4%", icon: MessageSquare, tone: "from-emerald-500/20 to-cyan-500/10" },
  { label: "Generated Leads", value: "1,284", growth: "+8.2%", icon: Users, tone: "from-blue-500/20 to-indigo-500/10" },
  { label: "Automations Running", value: "47", growth: "+5 new", icon: Zap, tone: "from-cyan-400/20 to-emerald-500/10" },
];

const quickActions = [
  { label: "Create AI Agent", desc: "Deploy a new agent in minutes", icon: Plus },
  { label: "Upload Knowledge Base", desc: "Feed docs, PDFs, or URLs", icon: Upload },
  { label: "Connect Website", desc: "Embed the widget on your site", icon: Globe },
  { label: "Invite Team Member", desc: "Collaborate with your team", icon: UserPlus },
];

const activity = [
  { title: "Support Agent handled 42 chats", time: "2 min ago", meta: "AI Chatbot · Tier 1 support", icon: MessageSquare, dot: "bg-cyan-400" },
  { title: "New lead captured — Neuralift LLC", time: "18 min ago", meta: "Lead Generation · Enterprise", icon: Users, dot: "bg-emerald-400" },
  { title: "Voice agent completed 12 outbound calls", time: "1 hr ago", meta: "Voice AI · Sales campaign", icon: Activity, dot: "bg-blue-400" },
  { title: "Automation 'CRM sync' completed", time: "3 hr ago", meta: "Workflow · 214 records updated", icon: Zap, dot: "bg-cyan-400" },
  { title: "Demo booked — Vertex Group", time: "Yesterday", meta: "Demo Request · Follow-up scheduled", icon: CalendarCheck, dot: "bg-emerald-400" },
];

const systems = [
  { name: "OpenAI", status: "Operational" },
  { name: "Supabase", status: "Operational" },
  { name: "Website", status: "Operational" },
  { name: "Automation", status: "Operational" },
];

function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive] = useState("dashboard");

  const name = user?.email?.split("@")[0] || "Operator";

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
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">Workspace</div>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActive(item.key);
                      setSidebarOpen(false);
                    }}
                    className={`group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? "text-white"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-nav"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent border border-cyan-400/30 shadow-[0_0_30px_-5px_rgba(34,211,238,0.4)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className={`relative h-4.5 w-4.5 ${isActive ? "text-cyan-300" : ""}`} />
                    <span className="relative">{item.label}</span>
                    {isActive && (
                      <span className="relative ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-white/5 p-3">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition"
              >
                <LogOut className="h-4.5 w-4.5" />
                Logout
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
                aria-label="Open sidebar"
              >
                <Menu className="h-4.5 w-4.5" />
              </button>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  placeholder="Search agents, conversations, leads…"
                  className="h-10 w-full rounded-xl border border-white/8 bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.05] transition"
                />
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  aria-label="Notifications"
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
          <div className="flex gap-6 px-4 sm:px-8 py-8">
            <div className="flex-1 min-w-0 space-y-8">
              {/* Welcome hero */}
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 sm:p-10"
              >
                <div className="pointer-events-none absolute -top-32 -right-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px]" />
                <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-blue-600/15 blur-[100px]" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-[11px] font-medium text-cyan-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    All systems operational
                  </div>
                  <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
                    Welcome back, <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent capitalize">{name}</span>
                  </h1>
                  <p className="mt-2 text-white/60 max-w-xl">
                    Manage all your AI operations from one intelligent workspace.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-sm font-semibold text-[#07090C] shadow-[0_0_30px_-5px_rgba(34,211,238,0.6)] hover:shadow-[0_0_40px_-5px_rgba(34,211,238,0.8)] transition-all hover:scale-[1.02] active:scale-[0.98]">
                      <Plus className="h-4 w-4" /> Create AI Agent
                    </button>
                    <Link
                      to="/book-demo"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06] hover:border-white/20 transition"
                    >
                      Book Demo <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
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
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${s.tone} transition-opacity`} />
                      <div className="relative">
                        <div className="flex items-center justify-between">
                          <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-cyan-300">
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                            <TrendingUp className="h-3 w-3" /> {s.growth}
                          </span>
                        </div>
                        <div className="mt-5 text-3xl font-bold tracking-tight">{s.value}</div>
                        <div className="mt-1 text-xs text-white/50">{s.label}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </section>

              {/* Quick actions */}
              <section>
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight">Quick actions</h2>
                    <p className="text-xs text-white/50">Jump into the most common tasks</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {quickActions.map((a, i) => {
                    const Icon = a.icon;
                    return (
                      <motion.button
                        key={a.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.04 }}
                        whileHover={{ y: -2 }}
                        className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-5 text-left hover:border-cyan-400/30 transition-all"
                      >
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-400/20 text-cyan-300 group-hover:shadow-[0_0_20px_-2px_rgba(34,211,238,0.5)] transition-shadow">
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <div className="mt-4 font-semibold text-sm">{a.label}</div>
                        <div className="mt-1 text-xs text-white/50">{a.desc}</div>
                        <ArrowUpRight className="absolute top-5 right-5 h-4 w-4 text-white/30 group-hover:text-cyan-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                      </motion.button>
                    );
                  })}
                </div>
              </section>

              {/* Recent activity */}
              <section>
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight">Recent activity</h2>
                    <p className="text-xs text-white/50">Live feed across all your agents</p>
                  </div>
                  <button className="text-xs font-medium text-cyan-300 hover:text-cyan-200">View all</button>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-2">
                  <ol className="relative">
                    {activity.map((a, i) => {
                      const Icon = a.icon;
                      return (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.35, delay: i * 0.05 }}
                          className="relative flex items-start gap-4 rounded-xl p-4 hover:bg-white/[0.03] transition"
                        >
                          <div className="relative mt-0.5">
                            <div className={`h-2.5 w-2.5 rounded-full ${a.dot} shadow-[0_0_10px_currentColor]`} />
                            {i !== activity.length - 1 && (
                              <div className="absolute left-1/2 top-4 -translate-x-1/2 h-10 w-px bg-gradient-to-b from-white/10 to-transparent" />
                            )}
                          </div>
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium truncate">{a.title}</div>
                            <div className="mt-0.5 text-xs text-white/50 truncate">{a.meta}</div>
                          </div>
                          <div className="text-xs text-white/40 shrink-0">{a.time}</div>
                        </motion.li>
                      );
                    })}
                  </ol>
                </div>
              </section>
            </div>

            {/* Right panel */}
            <aside className="hidden xl:block w-80 shrink-0 space-y-6">
              <div className="sticky top-40 space-y-6">
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">System status</h3>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                      <Circle className="h-1.5 w-1.5 fill-current" /> All online
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {systems.map((s) => (
                      <li key={s.name} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                          </span>
                          <span className="text-sm font-medium">{s.name}</span>
                        </div>
                        <span className="text-[11px] text-emerald-300">{s.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent p-5">
                  <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
                  <div className="relative">
                    <CheckCircle2 className="h-5 w-5 text-cyan-300" />
                    <h3 className="mt-3 text-sm font-semibold">Performance is up 24%</h3>
                    <p className="mt-1 text-xs text-white/60">
                      Your agents resolved conversations 2.3× faster this week. Keep the momentum going.
                    </p>
                    <button className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200">
                      View report <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
