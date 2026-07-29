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
  Sparkles,
  Filter,
  Download,
  Send,
  Paperclip,
  Smile,
  MoreHorizontal,
  Check,
  CheckCheck,
  MessageCircle,
  Globe,
  Instagram,
  Mail,
  Mic,
  Facebook,
  Calendar,
  Tag,
  Languages,
  Activity,
  Building2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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

type Channel = "WhatsApp" | "Website" | "Instagram" | "Messenger" | "Email" | "Voice AI";
type Status = "Open" | "Resolved" | "Escalated" | "Pending";
type Sentiment = "Positive" | "Neutral" | "Negative";

const channelMeta: Record<Channel, { icon: typeof MessageCircle; tint: string; ring: string }> = {
  WhatsApp: { icon: MessageCircle, tint: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20", ring: "from-emerald-400 to-teal-500" },
  Website: { icon: Globe, tint: "text-cyan-300 bg-cyan-400/10 border-cyan-400/20", ring: "from-cyan-400 to-blue-500" },
  Instagram: { icon: Instagram, tint: "text-pink-300 bg-pink-400/10 border-pink-400/20", ring: "from-pink-400 to-fuchsia-500" },
  Messenger: { icon: Facebook, tint: "text-blue-300 bg-blue-400/10 border-blue-400/20", ring: "from-blue-400 to-indigo-500" },
  Email: { icon: Mail, tint: "text-amber-300 bg-amber-400/10 border-amber-400/20", ring: "from-amber-400 to-orange-500" },
  "Voice AI": { icon: Mic, tint: "text-violet-300 bg-violet-400/10 border-violet-400/20", ring: "from-violet-400 to-indigo-500" },
};

type Message = {
  id: string;
  from: "user" | "ai";
  text: string;
  time: string;
  status?: "sent" | "delivered" | "read";
};

type Conversation = {
  id: string;
  name: string;
  company: string;
  channel: Channel;
  agent: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: Status;
  sentiment: Sentiment;
  language: string;
  firstContact: string;
  lastActivity: string;
  tags: string[];
  messages: Message[];
};

const conversations: Conversation[] = [
  {
    id: "C-4021",
    name: "Aylin Mammadova",
    company: "Nova Logistics",
    channel: "WhatsApp",
    agent: "WhatsApp AI",
    lastMessage: "Perfect, please send the invoice to accounts@nova.az.",
    time: "2m",
    unread: 2,
    status: "Open",
    sentiment: "Positive",
    language: "Azerbaijani",
    firstContact: "Mar 12, 2025",
    lastActivity: "2 min ago",
    tags: ["Enterprise", "Shipping", "Baku"],
    messages: [
      { id: "m1", from: "user", text: "Salam, sifariş vəziyyətini yoxlaya bilərəm?", time: "10:12", status: "read" },
      { id: "m2", from: "ai", text: "Salam Aylin! Sifariş #NL-88213 hazırda tranzitdə — Bakıya sabah 14:00-a çatacaq.", time: "10:12", status: "read" },
      { id: "m3", from: "user", text: "Great. Can you also send the invoice?", time: "10:13", status: "read" },
      { id: "m4", from: "ai", text: "Absolutely. Should I send the PDF invoice to your registered email or a different address?", time: "10:13", status: "read" },
      { id: "m5", from: "user", text: "Perfect, please send the invoice to accounts@nova.az.", time: "10:14", status: "delivered" },
    ],
  },
  {
    id: "C-4018",
    name: "Emre Yıldırım",
    company: "Arcadia Ventures",
    channel: "Website",
    agent: "Sales Assistant",
    lastMessage: "Thanks — I'll share this with our CTO tomorrow.",
    time: "18m",
    unread: 0,
    status: "Pending",
    sentiment: "Positive",
    language: "English",
    firstContact: "Feb 04, 2025",
    lastActivity: "18 min ago",
    tags: ["SMB", "Istanbul"],
    messages: [
      { id: "m1", from: "user", text: "Hey, can you compare your Pro and Enterprise plans?", time: "09:41", status: "read" },
      { id: "m2", from: "ai", text: "Sure! Pro is $499/mo with 3 agents and 20k messages. Enterprise is custom with unlimited agents, SSO and dedicated infra.", time: "09:41", status: "read" },
      { id: "m3", from: "user", text: "What's the SLA on Enterprise?", time: "09:42", status: "read" },
      { id: "m4", from: "ai", text: "99.99% uptime with a 15-minute response for P1 incidents and a named CSM.", time: "09:42", status: "read" },
      { id: "m5", from: "user", text: "Thanks — I'll share this with our CTO tomorrow.", time: "09:43", status: "read" },
    ],
  },
  {
    id: "C-4015",
    name: "Layla Al-Farsi",
    company: "Dune Capital",
    channel: "Instagram",
    agent: "Customer Support AI",
    lastMessage: "Amazing — booked. See you Thursday!",
    time: "42m",
    unread: 0,
    status: "Resolved",
    sentiment: "Positive",
    language: "English",
    firstContact: "Jan 22, 2025",
    lastActivity: "42 min ago",
    tags: ["Finance", "Dubai"],
    messages: [
      { id: "m1", from: "user", text: "Hi! Do you offer implementation help?", time: "Yesterday", status: "read" },
      { id: "m2", from: "ai", text: "Yes — every Growth+ plan includes a 4-week onboarding with a dedicated engineer.", time: "Yesterday", status: "read" },
      { id: "m3", from: "user", text: "Can we schedule a kickoff?", time: "Yesterday", status: "read" },
      { id: "m4", from: "ai", text: "Absolutely. Thursday 10:00 GST works — I've held the slot for you.", time: "Yesterday", status: "read" },
      { id: "m5", from: "user", text: "Amazing — booked. See you Thursday!", time: "Yesterday", status: "read" },
    ],
  },
  {
    id: "C-4012",
    name: "Jonas Meyer",
    company: "Helix Robotics",
    channel: "Email",
    agent: "Email Assistant",
    lastMessage: "Attached is the signed NDA — please proceed with the pilot.",
    time: "1h",
    unread: 1,
    status: "Open",
    sentiment: "Neutral",
    language: "German",
    firstContact: "Dec 03, 2024",
    lastActivity: "1 hr ago",
    tags: ["Manufacturing", "Berlin"],
    messages: [
      { id: "m1", from: "user", text: "Hallo, könnten Sie eine NDA unterzeichnen bevor wir tiefer einsteigen?", time: "Mon", status: "read" },
      { id: "m2", from: "ai", text: "Selbstverständlich — ich habe unsere Standard-NDA als PDF angehängt.", time: "Mon", status: "read" },
      { id: "m3", from: "user", text: "Attached is the signed NDA — please proceed with the pilot.", time: "Bu gün", status: "delivered" },
    ],
  },
  {
    id: "C-4009",
    name: "Sofia Rossi",
    company: "Loop Health",
    channel: "Voice AI",
    agent: "Voice Receptionist",
    lastMessage: "Voice call transcript · 4 min 12 sec",
    time: "3h",
    unread: 0,
    status: "Resolved",
    sentiment: "Positive",
    language: "Italian",
    firstContact: "Nov 18, 2024",
    lastActivity: "3 hr ago",
    tags: ["Healthcare", "Milan"],
    messages: [
      { id: "m1", from: "user", text: "Buongiorno, vorrei prenotare una demo.", time: "12:04", status: "read" },
      { id: "m2", from: "ai", text: "Certamente. Ho disponibilità venerdì alle 15:00 CET — le va bene?", time: "12:04", status: "read" },
      { id: "m3", from: "user", text: "Sì, perfetto.", time: "12:05", status: "read" },
      { id: "m4", from: "ai", text: "Prenotato. Le ho appena inviato l'invito via email.", time: "12:05", status: "read" },
    ],
  },
  {
    id: "C-4004",
    name: "Ömer Kaya",
    company: "Vertex Retail",
    channel: "Messenger",
    agent: "Lead Qualification AI",
    lastMessage: "Sounds good — please have a rep call me.",
    time: "5h",
    unread: 0,
    status: "Escalated",
    sentiment: "Neutral",
    language: "Turkish",
    firstContact: "Oct 09, 2024",
    lastActivity: "5 hr ago",
    tags: ["Retail", "Ankara"],
    messages: [
      { id: "m1", from: "user", text: "WhatsApp otomasyonu istiyoruz — 5000 sipariş/gün.", time: "Tue", status: "read" },
      { id: "m2", from: "ai", text: "Anladım. Bu hacim için Enterprise planı öneririm. Bir uzmanın sizinle iletişime geçmesini ister misiniz?", time: "Tue", status: "read" },
      { id: "m3", from: "user", text: "Sounds good — please have a rep call me.", time: "Tue", status: "read" },
    ],
  },
  {
    id: "C-3998",
    name: "Rana Aliyeva",
    company: "Caspian Tech",
    channel: "Website",
    agent: "Lead Qualification AI",
    lastMessage: "Can you send pricing in AZN?",
    time: "1d",
    unread: 3,
    status: "Open",
    sentiment: "Positive",
    language: "Azerbaijani",
    firstContact: "Sep 27, 2024",
    lastActivity: "1 day ago",
    tags: ["Startup", "Baku"],
    messages: [
      { id: "m1", from: "user", text: "Salam! Xidmətlər haqqında məlumat ala bilərəm?", time: "Yesterday", status: "read" },
      { id: "m2", from: "ai", text: "Salam Rana! Əlbəttə — hansı biznes ölçüsü üçün maraqlanırsınız?", time: "Yesterday", status: "read" },
      { id: "m3", from: "user", text: "Can you send pricing in AZN?", time: "Yesterday", status: "delivered" },
    ],
  },
  {
    id: "C-3990",
    name: "Fatima Zahra",
    company: "Orbit HR",
    channel: "WhatsApp",
    agent: "Sales Assistant",
    lastMessage: "Our legal is reviewing — will revert by Friday.",
    time: "2d",
    unread: 0,
    status: "Pending",
    sentiment: "Neutral",
    language: "English",
    firstContact: "Aug 15, 2024",
    lastActivity: "2 days ago",
    tags: ["HR Tech", "Abu Dhabi"],
    messages: [
      { id: "m1", from: "user", text: "Received the proposal, thanks!", time: "Sun", status: "read" },
      { id: "m2", from: "ai", text: "Great — happy to jump on a call if anything needs clarification.", time: "Sun", status: "read" },
      { id: "m3", from: "user", text: "Our legal is reviewing — will revert by Friday.", time: "Sun", status: "read" },
    ],
  },
];

const channelFilters: (Channel | "All")[] = ["All", "WhatsApp", "Website", "Instagram", "Messenger", "Email", "Voice AI"];
const agentFilters = ["All", "WhatsApp AI", "Sales Assistant", "Customer Support AI", "Email Assistant", "Voice Receptionist", "Lead Qualification AI"];
const statusFilters: (Status | "All")[] = ["All", "Open", "Pending", "Escalated", "Resolved"];
const dateFilters = ["İstənilən vaxt", "Bu gün", "Son 7 gün", "Son 30 gün"];

const sentimentStyles: Record<Sentiment, string> = {
  Positive: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
  Neutral: "text-white/70 bg-white/5 border-white/10",
  Negative: "text-rose-300 bg-rose-400/10 border-rose-400/20",
};

const statusStyles: Record<Status, string> = {
  Open: "text-cyan-300 bg-cyan-400/10 border-cyan-400/20",
  Pending: "text-amber-300 bg-amber-400/10 border-amber-400/20",
  Escalated: "text-rose-300 bg-rose-400/10 border-rose-400/20",
  Resolved: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
};

function ConversationsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState<Channel | "All">("All");
  const [agent, setAgent] = useState<string>("All");
  const [status, setStatus] = useState<Status | "All">("All");
  const [date, setDate] = useState<string>("İstənilən vaxt");
  const [activeId, setActiveId] = useState<string>(conversations[0].id);
  const [draft, setDraft] = useState("");

  const name = user?.email?.split("@")[0] || "İstifadəçi";

  const filtered = useMemo(() => {
    return conversations.filter((c) => {
      if (channel !== "All" && c.channel !== channel) return false;
      if (agent !== "All" && c.agent !== agent) return false;
      if (status !== "All" && c.status !== status) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !c.name.toLowerCase().includes(q) &&
          !c.company.toLowerCase().includes(q) &&
          !c.lastMessage.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [query, channel, agent, status]);

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];

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
                  placeholder="Söhbətləri, müştəriləri axtar…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-10 w-full rounded-xl border border-white/8 bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.05] transition"
                />
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/8 bg-white/[0.03] text-white/70 hover:text-white hover:border-cyan-400/30 transition">
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
                  Review every AI interaction across all connected channels.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06] hover:border-white/20 transition">
                  <Download className="h-4 w-4" /> İxrac et
                </button>
                <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-sm font-semibold text-[#07090C] shadow-[0_0_30px_-5px_rgba(34,211,238,0.6)] hover:shadow-[0_0_40px_-5px_rgba(34,211,238,0.8)] transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <Filter className="h-4 w-4" /> Filtrlər
                </button>
              </div>
            </motion.section>

            {/* Filter bar */}
            <section className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.02] p-3">
              <FilterSelect label="Kanal" value={channel} options={channelFilters} onChange={(v) => setChannel(v as Channel | "All")} />
              <FilterSelect label="AI Agent" value={agent} options={agentFilters} onChange={setAgent} />
              <FilterSelect label="Status" value={status} options={statusFilters} onChange={(v) => setStatus(v as Status | "All")} />
              <FilterSelect label="Tarix" value={date} options={dateFilters} onChange={setDate} />
              <div className="ml-auto text-xs text-white/50">
                {filtered.length} söhbətdən {filtered.length}
              </div>
            </section>

            {/* 3-column workspace */}
            <section className="grid gap-4 xl:grid-cols-[340px_1fr_320px]">
              {/* Conversation list */}
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
                <div className="border-b border-white/5 px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-white/40">
                  All Conversations
                </div>
                <div className="max-h-[720px] overflow-y-auto divide-y divide-white/5">
                  {filtered.length === 0 && (
                    <div className="p-8 text-center text-sm text-white/50">Filtrlərinizə uyğun söhbət yoxdur.</div>
                  )}
                  {filtered.map((c) => {
                    const Meta = channelMeta[c.channel];
                    const Icon = Meta.icon;
                    const isActive = c.id === activeId;
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
                            <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${Meta.ring} text-white text-xs font-bold uppercase`}>
                              {c.name
                                .split(" ")
                                .map((p) => p[0])
                                .slice(0, 2)
                                .join("")}
                            </div>
                            <span className={`absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border border-[#07090C] ${Meta.tint}`}>
                              <Icon className="h-2.5 w-2.5" />
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-semibold truncate">{c.name}</div>
                              <div className="ml-auto text-[10px] text-white/40 shrink-0">{c.time}</div>
                            </div>
                            <div className="text-[11px] text-white/50 truncate">{c.company} · {c.agent}</div>
                            <div className="mt-1 flex items-center gap-2">
                              <p className="text-xs text-white/60 truncate flex-1">{c.lastMessage}</p>
                              {c.unread > 0 && (
                                <span className="grid h-4.5 min-w-[18px] place-items-center rounded-full bg-cyan-400 px-1.5 text-[10px] font-bold text-[#07090C]">
                                  {c.unread}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chat thread */}
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden flex flex-col min-h-[720px]">
                <div className="flex items-center justify-between border-b border-white/5 px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${channelMeta[active.channel].ring} text-white text-xs font-bold uppercase`}>
                      {active.name
                        .split(" ")
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{active.name}</div>
                      <div className="text-[11px] text-white/50 flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] ${channelMeta[active.channel].tint}`}>
                          {(() => {
                            const I = channelMeta[active.channel].icon;
                            return <I className="h-2.5 w-2.5" />;
                          })()}
                          {active.channel}
                        </span>
                        <span>·</span>
                        <span>{active.agent}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusStyles[active.status]}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" /> {active.status}
                    </span>
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
                        className={`flex ${m.from === "user" ? "justify-start" : "justify-end"}`}
                      >
                        <div className={`max-w-[75%] ${m.from === "user" ? "" : "text-right"}`}>
                          <div
                            className={`inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                              m.from === "user"
                                ? "bg-white/[0.05] border border-white/8 text-white rounded-bl-md"
                                : "bg-gradient-to-br from-cyan-400/90 to-blue-500/90 text-[#07090C] font-medium rounded-br-md shadow-[0_0_25px_-8px_rgba(34,211,238,0.6)]"
                            }`}
                          >
                            {m.text}
                          </div>
                          <div className={`mt-1 flex items-center gap-1 text-[10px] text-white/40 ${m.from === "user" ? "" : "justify-end"}`}>
                            <span>{m.time}</span>
                            {m.from === "ai" && m.status && (
                              <span className="text-cyan-300">
                                {m.status === "read" ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : m.status === "delivered" ? (
                                  <CheckCheck className="h-3 w-3 text-white/40" />
                                ) : (
                                  <Check className="h-3 w-3 text-white/40" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="border-t border-white/5 px-4 py-3">
                  <div className="flex items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
                    <button className="grid h-8 w-8 place-items-center rounded-lg text-white/50 hover:text-white transition" aria-label="Əlavə et">
                      <Paperclip className="h-4 w-4" />
                    </button>
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="AI agent kimi cavab yaz…"
                      className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                    />
                    <button className="grid h-8 w-8 place-items-center rounded-lg text-white/50 hover:text-white transition" aria-label="Emoji">
                      <Smile className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDraft("")}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-3 py-1.5 text-xs font-semibold text-[#07090C] shadow-[0_0_20px_-5px_rgba(34,211,238,0.6)] hover:shadow-[0_0_28px_-5px_rgba(34,211,238,0.9)] transition"
                    >
                      <Send className="h-3.5 w-3.5" /> Göndər
                    </button>
                  </div>
                </div>
              </div>

              {/* Details panel */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-4">Söhbət Təfərrüatları</div>
                  <div className="flex items-center gap-3">
                    <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${channelMeta[active.channel].ring} text-white text-sm font-bold uppercase`}>
                      {active.name
                        .split(" ")
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">{active.name}</div>
                      <div className="text-[11px] text-white/50 flex items-center gap-1 truncate">
                        <Building2 className="h-3 w-3" /> {active.company}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <DetailRow icon={Bot} label="Təyin edilmiş AI" value={active.agent} />
                    <DetailRow
                      icon={Activity}
                      label="Sentiment"
                      value={
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] ${sentimentStyles[active.sentiment]}`}>
                          {active.sentiment}
                        </span>
                      }
                    />
                    <DetailRow icon={Languages} label="Dil" value={active.language} />
                    <DetailRow
                      icon={channelMeta[active.channel].icon}
                      label="Kanal"
                      value={active.channel}
                    />
                    <DetailRow icon={Calendar} label="İlk əlaqə" value={active.firstContact} />
                    <DetailRow icon={Activity} label="Son fəaliyyət" value={active.lastActivity} />
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-white/40">
                      <Tag className="h-3 w-3" /> Etiketlər
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {active.tags.map((t) => (
                        <span key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/70">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">Sürətli Əməliyyatlar</div>
                  <div className="space-y-2">
                    {[
                      { label: "Komanda yoldaşına təyin et", icon: Users },
                      { label: "Qeyd əlavə et", icon: MessageSquare },
                      { label: "Həll olundu kimi qeyd et", icon: Check },
                      { label: "Transkripti ixrac et", icon: Download },
                    ].map((a) => {
                      const Icon = a.icon;
                      return (
                        <button
                          key={a.label}
                          className="flex w-full items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5 text-xs text-white/80 hover:bg-white/[0.05] hover:border-cyan-400/25 transition"
                        >
                          <Icon className="h-4 w-4 text-cyan-300" />
                          {a.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
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
