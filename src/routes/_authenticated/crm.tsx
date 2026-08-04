import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
  TrendingUp,
  Target,
  Trophy,
  Percent,
  Filter,
  Calendar,
  Building2,
  Mail,
  Phone,
  MoreHorizontal,
  Circle,
  Activity,
  StickyNote,
  Clock,
  Pencil,
  Archive,
  Tag,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  LEAD_STATUSES,
  STATUS_LABEL,
  STATUS_STYLES,
  asStatus,
  describeError,
  formatMoney,
  formatRelative,
  useCreateLead,
  useLeadActivities,
  useLeads,
  useRecentActivities,
  useUpdateLead,
  type LeadStatus,
} from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/crm")({
  head: () => ({
    meta: [
      { title: "CRM — Agentix" },
      { name: "description", content: "Manage leads, customers and sales pipeline." },
      { property: "og:title", content: "CRM — Agentix" },
      { property: "og:description", content: "Manage leads, customers and sales pipeline." },
    ],
  }),
  component: CRMPage,
});

const navItems = [
  { key: "dashboard", label: "İdarəetmə Paneli", icon: LayoutDashboard, to: "/dashboard" as const },
  { key: "agents", label: "AI Agentləri", icon: Bot, to: "/ai-agents" as const },
  { key: "conversations", label: "Söhbətlər", icon: MessageSquare, to: "/conversations" as const },
  { key: "leads", label: "CRM", icon: Users, to: "/crm" as const, active: true },
  { key: "demos", label: "Demo Sorğuları", icon: CalendarCheck, to: "/demo-requests" as const },
  { key: "analytics", label: "Analitika", icon: BarChart3, to: "/analytics" as const },
  { key: "billing", label: "Ödənişlər", icon: CreditCard, to: "/billing" as const },
  { key: "settings", label: "Tənzimləmələr", icon: Settings, to: "/settings" as const },
  { key: "support", label: "Dəstək", icon: LifeBuoy, to: "/support" as const },
];

const statusOptions: (LeadStatus | "All")[] = ["All", ...LEAD_STATUSES];


function CRMPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<LeadStatus | "All">("All");
  const [company, setCompany] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("Any time");
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", agent: "", value: "" });

  const name = user?.email?.split("@")[0] || "İstifadəçi";

  const leadsQuery = useLeads(user?.id);
  const leads = leadsQuery.data ?? [];
  const selected = leads.find((l) => l.id === selectedId) ?? null;
  const activitiesQuery = useLeadActivities(selectedId ?? undefined);
  const recentQuery = useRecentActivities(user?.id);
  const createLead = useCreateLead(user?.id);
  const updateLead = useUpdateLead(user?.id);

  const companies = useMemo(
    () => ["All", ...Array.from(new Set(leads.map((l) => l.company).filter((c): c is string => !!c)))],
    [leads],
  );

  const statsCards = useMemo(() => {
    const total = leads.length;
    const qualified = leads.filter((l) => l.status === "qualified" || l.status === "proposal").length;
    const wonLeads = leads.filter((l) => l.status === "won");
    const rate = total ? Math.round((wonLeads.length / total) * 1000) / 10 : 0;
    return [
      {
        label: "Ümumi namizədlər",
        value: String(total),
        growth: formatMoney(leads.reduce((s, l) => s + Number(l.value ?? 0), 0)),
        icon: Users,
      },
      {
        label: "Kvalifikasiya olunmuş",
        value: String(qualified),
        growth: `${total ? Math.round((qualified / total) * 100) : 0}%`,
        icon: Target,
      },
      {
        label: "Qazanılmış sövdələşmələr",
        value: String(wonLeads.length),
        growth: formatMoney(wonLeads.reduce((s, l) => s + Number(l.value ?? 0), 0)),
        icon: Trophy,
      },
      { label: "Konversiya nisbəti", value: `${rate}%`, growth: `${wonLeads.length}/${total}`, icon: Percent },
    ];
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const now = Date.now();
    const windows: Record<string, number> = {
      Today: 864e5,
      "This week": 7 * 864e5,
      "This month": 30 * 864e5,
      "This quarter": 90 * 864e5,
    };
    return leads.filter((l) => {
      if (status !== "All" && l.status !== status) return false;
      if (company !== "All" && l.company !== company) return false;
      const span = windows[dateFilter];
      if (span && now - new Date(l.created_at).getTime() > span) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!`${l.name} ${l.company ?? ""} ${l.email ?? ""}`.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [leads, query, status, company, dateFilter]);

  const followUps = useMemo(
    () => leads.filter((l) => l.status === "contacted" || l.status === "proposal").slice(0, 3),
    [leads],
  );
  const recentNotes = useMemo(() => leads.filter((l) => !!l.notes).slice(0, 3), [leads]);

  const handleCreateLead = async () => {
    setFormError(null);
    if (!form.name.trim()) {
      setFormError("Ad və soyad zəruridir.");
      return;
    }
    try {
      await createLead.mutateAsync({
        name: form.name.trim(),
        company: form.company.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        agent: form.agent.trim(),
        value: Number(form.value.replace(/[^\d.]/g, "")) || 0,
      });
      setForm({ name: "", company: "", email: "", phone: "", agent: "", value: "" });
      setNewLeadOpen(false);
    } catch (error) {
      setFormError(describeError(error, "crm:create-lead"));
    }
  };

  const handleStatusChange = async (next: LeadStatus) => {
    if (!selected) return;
    try {
      await updateLead.mutateAsync({
        id: selected.id,
        patch: { status: next },
        activity: `Status dəyişdirildi: ${STATUS_LABEL[next]}`,
      });
    } catch (error) {
      setFormError(describeError(error, "crm:update-status"));
    }
  };

  const handleArchive = async () => {
    if (!selected) return;
    try {
      await updateLead.mutateAsync({
        id: selected.id,
        patch: { archived: true },
        activity: "Namizəd arxivləşdirildi",
      });
      setSelectedId(null);
    } catch (error) {
      setFormError(describeError(error, "crm:archive-lead"));
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
                        layoutId="active-nav-crm"
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
                  placeholder="Search leads, companies, emails…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
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
                    <Users className="h-3 w-3" /> Customer Relationships
                  </div>
                  <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">CRM</h1>
                  <p className="mt-1 text-white/60 max-w-xl">
                    Manage leads, customers and sales pipeline.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setNewLeadOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-sm font-semibold text-[#07090C] shadow-[0_0_30px_-5px_rgba(34,211,238,0.6)] hover:shadow-[0_0_40px_-5px_rgba(34,211,238,0.8)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Plus className="h-4 w-4" /> New Lead
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06] hover:border-white/20 transition">
                    <Upload className="h-4 w-4" /> Import CSV
                  </button>
                </div>
              </motion.section>

              {/* Stats */}
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statsCards.map((s, i) => {
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

              {/* Filter bar */}
              <section className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                <div className="grid gap-3 md:grid-cols-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search leads…"
                      className="h-10 w-full rounded-xl border border-white/8 bg-white/[0.03] pl-10 pr-3 text-sm placeholder:text-white/40 focus:outline-none focus:border-cyan-400/40 transition"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as LeadStatus | "All")}
                      className="h-10 w-full appearance-none rounded-xl border border-white/8 bg-white/[0.03] pl-10 pr-3 text-sm text-white focus:outline-none focus:border-cyan-400/40 transition"
                    >
                      {statusOptions.map((o) => (
                        <option key={o} value={o} className="bg-[#0B0F14]">
                          {o === "All" ? "Bütün statuslar" : STATUS_LABEL[o]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <select
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="h-10 w-full appearance-none rounded-xl border border-white/8 bg-white/[0.03] pl-10 pr-3 text-sm text-white focus:outline-none focus:border-cyan-400/40 transition"
                    >
                      {companies.map((c) => (
                        <option key={c} value={c} className="bg-[#0B0F14]">
                          {c === "All" ? "Bütün şirkətlər" : c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="h-10 w-full appearance-none rounded-xl border border-white/8 bg-white/[0.03] pl-10 pr-3 text-sm text-white focus:outline-none focus:border-cyan-400/40 transition"
                    >
                      {["Any time", "Today", "This week", "This month", "This quarter"].map((d) => (
                        <option key={d} value={d} className="bg-[#0B0F14]">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Leads table */}
              <section className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                  <div>
                    <h2 className="text-sm font-bold tracking-tight">Leads</h2>
                    <p className="text-[11px] text-white/50">{filteredLeads.length} / {leads.length}</p>
                  </div>
                  <button className="text-xs font-medium text-cyan-300 hover:text-cyan-200">Export</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-[0.14em] text-white/40 border-b border-white/5">
                        <th className="px-5 py-3 font-medium">Lead</th>
                        <th className="px-5 py-3 font-medium">Company</th>
                        <th className="px-5 py-3 font-medium hidden md:table-cell">Email</th>
                        <th className="px-5 py-3 font-medium hidden lg:table-cell">Phone</th>
                        <th className="px-5 py-3 font-medium hidden xl:table-cell">Assigned AI</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium hidden md:table-cell">Last activity</th>
                        <th className="px-5 py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence initial={false}>
                        {filteredLeads.map((l, i) => (
                          <motion.tr
                            key={l.id}
                            layout
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25, delay: i * 0.02 }}
                            onClick={() => setSelectedId(l.id)}
                            className="cursor-pointer border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition"
                          >
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/30 to-blue-600/30 border border-cyan-400/20 text-xs font-semibold text-cyan-100">
                                  {l.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                                </div>
                                <div>
                                  <div className="font-medium">{l.name}</div>
                                  <div className="text-[11px] text-white/40">{formatMoney(Number(l.value))}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-white/80">{l.company ?? "—"}</td>
                            <td className="px-5 py-3.5 text-white/60 hidden md:table-cell">{l.email ?? "—"}</td>
                            <td className="px-5 py-3.5 text-white/60 hidden lg:table-cell">{l.phone ?? "—"}</td>
                            <td className="px-5 py-3.5 hidden xl:table-cell">
                              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-white/70">
                                <Bot className="h-3 w-3 text-cyan-300" /> {l.agent ?? "Təyin edilməyib"}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[asStatus(l.status)]}`}>
                                <Circle className="h-1.5 w-1.5 fill-current" /> {STATUS_LABEL[asStatus(l.status)]}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-white/60 hidden md:table-cell">{formatRelative(l.last_activity_at)}</td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedId(l.id);
                                  }}
                                  className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-white/70 hover:text-white hover:border-cyan-400/30 transition"
                                  aria-label="Namizədi aç"
                                >
                                  <ArrowUpRight className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-white/70 hover:text-white hover:border-white/20 transition"
                                  aria-label="Daha çox"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                      {filteredLeads.length === 0 && (
                        <tr>
                          <td colSpan={8} className="px-5 py-12 text-center text-sm text-white/50">
                            No leads match your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Right panel */}
            <aside className="hidden xl:block w-80 shrink-0 space-y-5">
              <motion.section
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-white/8 bg-white/[0.02] p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
                    <Activity className="h-4 w-4 text-cyan-300" /> Recent activity
                  </h3>
                </div>
                <div className="space-y-3">
                  {(recentQuery.data ?? []).map((a) => (
                    <div key={a.id} className="flex items-start gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-cyan-300 shrink-0">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-white/85 truncate">{a.title}</div>
                        <div className="text-[10px] text-white/40">{formatRelative(a.created_at)}</div>
                      </div>
                    </div>
                  ))}
                  {(recentQuery.data ?? []).length === 0 && (
                    <p className="text-xs text-white/40">Hələ aktivlik yoxdur.</p>
                  )}

                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="rounded-2xl border border-white/8 bg-white/[0.02] p-5"
              >
                <h3 className="text-sm font-bold tracking-tight flex items-center gap-2 mb-4">
                  <StickyNote className="h-4 w-4 text-cyan-300" /> Recent notes
                </h3>
                <div className="space-y-3">
                  {recentNotes.map((n) => (
                    <div key={n.id} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                      <div className="flex items-center justify-between text-[10px] text-white/50">
                        <span className="font-medium text-white/70">{n.name}</span>
                        <span>{formatRelative(n.updated_at)}</span>
                      </div>
                      <p className="mt-1 text-xs text-white/80 leading-relaxed">{n.notes}</p>
                    </div>
                  ))}
                  {recentNotes.length === 0 && <p className="text-xs text-white/40">Hələ qeyd yoxdur.</p>}
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="rounded-2xl border border-white/8 bg-white/[0.02] p-5"
              >
                <h3 className="text-sm font-bold tracking-tight flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-cyan-300" /> Upcoming follow-ups
                </h3>
                <div className="space-y-3">
                  {followUps.map((f) => (
                    <div key={f.id} className="flex items-start gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-400/20 text-cyan-300 shrink-0">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium truncate">{f.name}</div>
                        <div className="text-[11px] text-white/60 truncate">{STATUS_LABEL[asStatus(f.status)]} · {f.company ?? "—"}</div>
                        <div className="text-[10px] text-white/40">{formatRelative(f.last_activity_at)}</div>
                      </div>
                    </div>
                  ))}
                  {followUps.length === 0 && <p className="text-xs text-white/40">Planlaşdırılmış izləmə yoxdur.</p>}
                </div>
              </motion.section>
            </aside>
          </div>
        </div>
      </div>

      {/* Lead details drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-white/8 bg-[#0B0F14]/95 backdrop-blur-2xl overflow-y-auto"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-[#0B0F14]/80 backdrop-blur px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/30 to-blue-600/30 border border-cyan-400/20 text-sm font-semibold text-cyan-100">
                    {selected.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{selected.name}</div>
                    <div className="text-[11px] text-white/50">{selected.company ?? "—"} · {selected.id.slice(0, 8)}</div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-white/70 hover:text-white"
                  aria-label="Bağla"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-5 space-y-6">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 mb-2">Lead information</div>
                  <div className="rounded-xl border border-white/8 bg-white/[0.03] divide-y divide-white/5">
                    <Row icon={Mail} label="Email" value={selected.email} />
                    <Row icon={Phone} label="Phone" value={selected.phone} />
                    <Row icon={Building2} label="Company" value={selected.company} />
                    <Row icon={Target} label="Value" value={formatMoney(Number(selected.value))} />
                    <Row icon={Circle} label="Status" value={STATUS_LABEL[asStatus(selected.status)]} chipClass={STATUS_STYLES[asStatus(selected.status)]} />
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 mb-2">Assigned AI agent</div>
                  <div className="flex items-center gap-3 rounded-xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/5 p-4">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_20px_-4px_rgba(34,211,238,0.6)]">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{selected.agent ?? "Təyin edilməyib"}</div>
                      <div className="text-[11px] text-white/60">Handles conversations, follow-ups and scoring.</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {selected.tags.map((t) => (
                      <span key={t} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/70">
                        <Tag className="h-3 w-3 text-cyan-300" /> {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 mb-2">Notes</div>
                  <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-sm text-white/80 leading-relaxed">
                    {selected.notes || "Qeyd əlavə edilməyib."}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 mb-2">Timeline</div>
                  <ol className="relative border-l border-white/10 ml-2 space-y-4 pl-5">
                    {(activitiesQuery.data ?? []).map((e) => (
                      <li key={e.id} className="relative">
                        <span className="absolute -left-[27px] top-1 grid h-4 w-4 place-items-center rounded-full border border-cyan-400/40 bg-[#0B0F14]">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                        </span>
                        <div className="text-xs font-medium">{e.title}</div>
                        <div className="text-[10px] text-white/50">{formatRelative(e.created_at)}</div>
                      </li>
                    ))}
                    {(activitiesQuery.data ?? []).length === 0 && (
                      <li className="text-xs text-white/40">Aktivlik qeydi yoxdur.</li>
                    )}
                  </ol>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <label className="flex-1 relative">
                    <Pencil className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#07090C]" />
                    <select
                      value={asStatus(selected.status)}
                      onChange={(e) => void handleStatusChange(e.target.value as LeadStatus)}
                      disabled={updateLead.isPending}
                      className="h-11 w-full appearance-none rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 pl-9 pr-3 text-sm font-semibold text-[#07090C] shadow-[0_0_30px_-5px_rgba(34,211,238,0.6)] hover:shadow-[0_0_40px_-5px_rgba(34,211,238,0.8)] transition disabled:opacity-60"
                    >
                      {LEAD_STATUSES.map((o) => (
                        <option key={o} value={o} className="bg-[#0B0F14] text-white">
                          {STATUS_LABEL[o]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    onClick={() => void handleArchive()}
                    disabled={updateLead.isPending}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06] hover:border-white/20 transition disabled:opacity-60"
                  >
                    <Archive className="h-4 w-4" /> Arxivləşdir
                  </button>
                </div>
                {formError && (
                  <p className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-xs text-rose-200">{formError}</p>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* New lead modal */}
      <AnimatePresence>
        {newLeadOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNewLeadOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 grid place-items-center p-4"
            >
              <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0B0F14]/95 backdrop-blur-2xl shadow-[0_20px_80px_-20px_rgba(34,211,238,0.35)]">
                <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
                  <h3 className="text-sm font-bold tracking-tight">New lead</h3>
                  <button
                    onClick={() => setNewLeadOpen(false)}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-white/70 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-5 grid gap-3 sm:grid-cols-2">
                  <Field label="Full name" placeholder="Aylin Mehdiyeva" />
                  <Field label="Company" placeholder="Nova Logistics" />
                  <Field label="Email" placeholder="lead@company.com" />
                  <Field label="Phone" placeholder="+994 …" />
                  <Field label="Assigned AI" placeholder="Sales Assistant" />
                  <Field label="Status" placeholder="New" />
                </div>
                <div className="flex items-center justify-end gap-3 border-t border-white/5 px-5 py-4">
                  <button
                    onClick={() => setNewLeadOpen(false)}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/[0.06]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setNewLeadOpen(false)}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-[#07090C] shadow-[0_0_25px_-6px_rgba(34,211,238,0.7)] hover:shadow-[0_0_35px_-6px_rgba(34,211,238,0.9)] transition"
                  >
                    <Plus className="h-4 w-4" /> Create lead
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  chipClass,
}: {
  icon: typeof Mail;
  label: string;
  value: string | null;
  chipClass?: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2.5 text-xs text-white/50">
        <Icon className="h-3.5 w-3.5 text-cyan-300" />
        {label}
      </div>
      {chipClass ? (
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${chipClass}`}>
          <Circle className="h-1.5 w-1.5 fill-current" /> {value}
        </span>
      ) : (
        <div className="text-xs font-medium text-white/90">{value || "—"}</div>
      )}
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 mb-1.5">{label}</div>
      <input
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-white/8 bg-white/[0.03] px-3 text-sm placeholder:text-white/40 focus:outline-none focus:border-cyan-400/40 transition"
      />
    </label>
  );
}
