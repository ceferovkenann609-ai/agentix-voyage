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
  Download,
  Check,
  CheckCircle2,
  Zap,
  Crown,
  Rocket,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Receipt,
  Wallet,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_authenticated/billing")({
  head: () => ({
    meta: [
      { title: "Billing — Agentix" },
      { name: "description", content: "Manage your plan, credits, invoices and payment methods." },
      { property: "og:title", content: "Billing — Agentix" },
      { property: "og:description", content: "Manage your plan, credits, invoices and payment methods." },
    ],
  }),
  component: BillingPage,
});

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" as const },
  { key: "agents", label: "AI Agents", icon: Bot, to: "/ai-agents" as const },
  { key: "conversations", label: "Conversations", icon: MessageSquare, to: "/conversations" as const },
  { key: "leads", label: "Leads", icon: Users, to: "/crm" as const },
  { key: "demos", label: "Demo Requests", icon: CalendarCheck, to: "/history" as const },
  { key: "analytics", label: "Analytics", icon: BarChart3, to: "/analytics" as const },
  { key: "billing", label: "Billing", icon: CreditCard, to: "/billing" as const, active: true },
  { key: "settings", label: "Settings", icon: Settings, to: "/settings" as const },
  { key: "support", label: "Support", icon: LifeBuoy },
];

const plans = [
  {
    name: "Starter",
    price: 49,
    icon: Zap,
    features: ["3 AI Agents", "5,000 conversations", "Email support", "Basic analytics"],
    tone: "from-white/[0.04] to-white/[0.01]",
  },
  {
    name: "Growth",
    price: 199,
    icon: Rocket,
    current: true,
    features: ["12 AI Agents", "50,000 conversations", "Priority support", "Advanced analytics", "Custom integrations"],
    tone: "from-cyan-500/10 to-blue-500/5",
  },
  {
    name: "Enterprise",
    price: 799,
    icon: Crown,
    features: ["Unlimited agents", "Unlimited conversations", "Dedicated manager", "SLA & SSO", "White-glove onboarding"],
    tone: "from-white/[0.04] to-white/[0.01]",
  },
];

const usageMetrics = [
  { label: "Conversations", used: 32480, total: 50000, unit: "" },
  { label: "AI Agents", used: 8, total: 12, unit: "" },
  { label: "Automations", used: 47, total: 100, unit: "" },
  { label: "Storage", used: 6.2, total: 20, unit: " GB" },
];

const invoices = [
  { id: "INV-2048", date: "Aug 01, 2026", plan: "Growth · Monthly", amount: "$199.00", status: "Paid" },
  { id: "INV-2032", date: "Jul 01, 2026", plan: "Growth · Monthly", amount: "$199.00", status: "Paid" },
  { id: "INV-2011", date: "Jun 01, 2026", plan: "Growth · Monthly", amount: "$199.00", status: "Paid" },
  { id: "INV-1994", date: "May 01, 2026", plan: "Starter · Monthly", amount: "$49.00", status: "Paid" },
  { id: "INV-1968", date: "Apr 01, 2026", plan: "Starter · Monthly", amount: "$49.00", status: "Paid" },
];

const payments = [
  { date: "Aug 01, 2026", method: "Visa •••• 4242", amount: "$199.00", status: "Success" },
  { date: "Jul 01, 2026", method: "Visa •••• 4242", amount: "$199.00", status: "Success" },
  { date: "Jun 15, 2026", method: "Top-up · 5,000 credits", amount: "$40.00", status: "Success" },
  { date: "Jun 01, 2026", method: "Visa •••• 4242", amount: "$199.00", status: "Success" },
  { date: "May 01, 2026", method: "Visa •••• 4242", amount: "$49.00", status: "Success" },
];

const paymentMethods = [
  { brand: "Visa", last4: "4242", exp: "08/28", primary: true },
  { brand: "Mastercard", last4: "8121", exp: "11/27", primary: false },
];

function BillingPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addCardOpen, setAddCardOpen] = useState(false);

  const name = user?.email?.split("@")[0] || "Operator";

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const creditsUsed = 3240;
  const creditsTotal = 5000;
  const creditsPct = (creditsUsed / creditsTotal) * 100;

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
                const isActive = item.active;
                const content = (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-billing"
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
                return item.to ? (
                  <Link key={item.key} to={item.to} onClick={() => setSidebarOpen(false)} className={cls}>
                    {content}
                  </Link>
                ) : (
                  <button key={item.key} onClick={() => setSidebarOpen(false)} className={cls}>
                    {content}
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

        <div className="flex-1 min-w-0">
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
                  placeholder="Search invoices, plans…"
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

          <div className="px-4 sm:px-8 py-8 space-y-8">
            {/* Header */}
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
                    <CreditCard className="h-3 w-3" /> Billing & Subscription
                  </div>
                  <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-white via-cyan-100 to-blue-300 bg-clip-text text-transparent">Billing</span>
                  </h1>
                  <p className="mt-2 text-white/60 max-w-xl">
                    Manage your subscription, usage, credits and invoices.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.06] hover:border-white/20 transition">
                    <Download className="h-4 w-4" /> Download all invoices
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-[#07090C] shadow-[0_0_30px_-5px_rgba(34,211,238,0.6)] hover:shadow-[0_0_40px_-5px_rgba(34,211,238,0.8)] transition hover:scale-[1.02] active:scale-[0.98]">
                    <TrendingUp className="h-4 w-4" /> Upgrade Plan
                  </button>
                </div>
              </div>
            </motion.section>

            {/* Current Plan + Credits */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="xl:col-span-2 relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/[0.08] to-blue-500/[0.04] p-6"
              >
                <div className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-cyan-500/20 blur-[80px]" />
                <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-cyan-300">
                      <Crown className="h-3.5 w-3.5" /> Current Plan
                    </div>
                    <div className="mt-3 flex items-baseline gap-3">
                      <div className="text-3xl font-bold">Growth</div>
                      <div className="text-sm text-white/60">$199 <span className="text-white/40">/month</span></div>
                    </div>
                    <div className="mt-2 text-xs text-white/60">Renews on <span className="text-white">Sep 01, 2026</span></div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["12 Agents", "50k conv./mo", "Priority support", "Advanced analytics"].map((f) => (
                        <span key={f} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/70">
                          <CheckCircle2 className="h-3 w-3 text-cyan-300" /> {f}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 md:items-end">
                    <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-[#07090C] shadow-[0_0_30px_-5px_rgba(34,211,238,0.6)] transition hover:scale-[1.02] active:scale-[0.98]">
                      <ArrowUpRight className="h-4 w-4" /> Change plan
                    </button>
                    <button className="text-xs text-white/50 hover:text-white transition">Cancel subscription</button>
                  </div>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-2xl border border-white/8 bg-white/[0.02] p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Wallet className="h-4 w-4 text-cyan-300" /> Monthly Credits
                  </div>
                  <button className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition">
                    <Plus className="h-3.5 w-3.5" /> Top up
                  </button>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <div className="text-3xl font-bold">{(creditsTotal - creditsUsed).toLocaleString()}</div>
                  <div className="text-xs text-white/50">of {creditsTotal.toLocaleString()} remaining</div>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${creditsPct}%` }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-white/50">
                  <span>{creditsUsed.toLocaleString()} used</span>
                  <span>Resets Sep 01</span>
                </div>
              </motion.section>
            </div>

            {/* Usage grid */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-white/8 bg-white/[0.02] p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <TrendingUp className="h-4 w-4 text-cyan-300" /> Usage this cycle
                </div>
                <div className="text-[11px] text-white/40">Aug 01 — Aug 31</div>
              </div>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {usageMetrics.map((m, i) => {
                  const pct = (m.used / m.total) * 100;
                  return (
                    <div key={m.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                      <div className="flex items-baseline justify-between">
                        <div className="text-xs text-white/50">{m.label}</div>
                        <div className="text-[10px] text-white/40">{Math.round(pct)}%</div>
                      </div>
                      <div className="mt-1.5 text-lg font-bold">
                        {m.used.toLocaleString()}
                        <span className="text-xs text-white/40 font-normal"> / {m.total.toLocaleString()}{m.unit}</span>
                      </div>
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.05 }}
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>

            {/* Upgrade plans */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Upgrade Plan</h2>
                  <p className="text-xs text-white/50 mt-0.5">Scale your AI workforce as you grow.</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                {plans.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <motion.div
                      key={p.name}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className={`relative overflow-hidden rounded-2xl border p-6 bg-gradient-to-br ${p.tone} ${
                        p.current ? "border-cyan-400/40 shadow-[0_0_40px_-10px_rgba(34,211,238,0.4)]" : "border-white/8 hover:border-cyan-400/30"
                      } transition`}
                    >
                      {p.current && (
                        <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-200">
                          Current
                        </span>
                      )}
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.05] border border-white/10">
                        <Icon className="h-4.5 w-4.5 text-cyan-300" />
                      </div>
                      <div className="mt-4 text-lg font-bold">{p.name}</div>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-3xl font-bold">${p.price}</span>
                        <span className="text-xs text-white/50">/month</span>
                      </div>
                      <ul className="mt-4 space-y-2 text-sm text-white/70">
                        {p.features.map((f) => (
                          <li key={f} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-cyan-300 shrink-0 mt-0.5" /> {f}
                          </li>
                        ))}
                      </ul>
                      <button
                        disabled={p.current}
                        className={`mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                          p.current
                            ? "border border-white/10 bg-white/[0.03] text-white/40 cursor-not-allowed"
                            : "bg-gradient-to-r from-cyan-400 to-blue-500 text-[#07090C] shadow-[0_0_30px_-5px_rgba(34,211,238,0.6)] hover:scale-[1.02] active:scale-[0.98]"
                        }`}
                      >
                        {p.current ? "Active" : `Upgrade to ${p.name}`}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            {/* Payment Methods */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-white/8 bg-white/[0.02] p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <CreditCard className="h-4 w-4 text-cyan-300" /> Payment Method
                </div>
                <button
                  onClick={() => setAddCardOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold hover:bg-white/[0.06] hover:border-cyan-400/30 transition"
                >
                  <Plus className="h-3.5 w-3.5" /> Add card
                </button>
              </div>
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((c) => (
                  <div
                    key={c.last4}
                    className={`relative overflow-hidden rounded-2xl border p-5 ${
                      c.primary
                        ? "border-cyan-400/30 bg-gradient-to-br from-cyan-500/[0.08] to-blue-500/[0.04]"
                        : "border-white/8 bg-white/[0.02]"
                    }`}
                  >
                    <div className="pointer-events-none absolute -top-10 -right-6 h-32 w-32 rounded-full bg-cyan-500/10 blur-[60px]" />
                    <div className="relative flex items-center justify-between">
                      <div className="text-xs font-semibold uppercase tracking-wider text-white/60">{c.brand}</div>
                      {c.primary && (
                        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-200">
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="relative mt-6 text-lg font-mono tracking-widest">•••• •••• •••• {c.last4}</div>
                    <div className="relative mt-4 flex items-center justify-between text-xs text-white/50">
                      <span>Expires {c.exp}</span>
                      <div className="flex items-center gap-3">
                        {!c.primary && <button className="text-cyan-300 hover:text-cyan-200 transition">Make primary</button>}
                        <button className="text-white/60 hover:text-white transition">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Invoices */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-white/8 bg-white/[0.02] p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Receipt className="h-4 w-4 text-cyan-300" /> Invoices
                </div>
                <button className="text-xs text-white/50 hover:text-white transition">View all</button>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-white/40">
                      <th className="py-2 pr-3 font-medium">Invoice</th>
                      <th className="py-2 pr-3 font-medium">Date</th>
                      <th className="py-2 pr-3 font-medium">Plan</th>
                      <th className="py-2 pr-3 font-medium">Amount</th>
                      <th className="py-2 pr-3 font-medium">Status</th>
                      <th className="py-2 pr-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="border-t border-white/5 hover:bg-white/[0.02] transition">
                        <td className="py-3 pr-3 font-semibold text-cyan-300">{inv.id}</td>
                        <td className="py-3 pr-3 text-xs text-white/70">{inv.date}</td>
                        <td className="py-3 pr-3 text-xs text-white/70">{inv.plan}</td>
                        <td className="py-3 pr-3 font-semibold">{inv.amount}</td>
                        <td className="py-3 pr-3">
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                            <CheckCircle2 className="h-3 w-3" /> {inv.status}
                          </span>
                        </td>
                        <td className="py-3 pr-3 text-right">
                          <button className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-semibold hover:bg-white/[0.06] hover:border-cyan-400/30 transition">
                            <Download className="h-3 w-3" /> PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.section>

            {/* Payment history */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-white/8 bg-white/[0.02] p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Calendar className="h-4 w-4 text-cyan-300" /> Payment History
                </div>
                <div className="text-[11px] text-white/40">Last 12 months</div>
              </div>
              <ul className="mt-4 divide-y divide-white/5">
                {payments.map((p) => (
                  <li key={p.date + p.method} className="flex items-center gap-4 py-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.04] border border-white/10">
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{p.method}</div>
                      <div className="text-[11px] text-white/50">{p.date}</div>
                    </div>
                    <div className="text-sm font-bold">{p.amount}</div>
                    <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                      {p.status}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.section>

            <div className="h-4" />
          </div>
        </div>
      </div>

      {/* Add card modal */}
      <AnimatePresence>
        {addCardOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setAddCardOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0F14] p-6"
            >
              <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-cyan-500/20 blur-[70px]" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="text-base font-bold">Add payment method</div>
                  <button onClick={() => setAddCardOpen(false)} className="text-white/60 hover:text-white">
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>
                <div className="mt-5 space-y-3">
                  <Field label="Cardholder name" placeholder="Jane Doe" />
                  <Field label="Card number" placeholder="1234 5678 9012 3456" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Expiry" placeholder="MM / YY" />
                    <Field label="CVC" placeholder="•••" />
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setAddCardOpen(false)}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold hover:bg-white/[0.06] transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setAddCardOpen(false)}
                    className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-[#07090C] shadow-[0_0_30px_-5px_rgba(34,211,238,0.6)] hover:scale-[1.02] active:scale-[0.98] transition"
                  >
                    Save card
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
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">{label}</span>
      <input
        placeholder={placeholder}
        className="mt-1.5 h-10 w-full rounded-xl border border-white/8 bg-white/[0.03] px-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.05] transition"
      />
    </label>
  );
}
