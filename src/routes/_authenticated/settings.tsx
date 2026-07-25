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
  Settings as SettingsIcon,
  LifeBuoy,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  Sparkles,
  User as UserIcon,
  Building2,
  Lock,
  Palette,
  Globe,
  Key,
  ShieldCheck,
  Camera,
  Check,
  Eye,
  EyeOff,
  Copy,
  Plus,
  Trash2,
  Monitor,
  Moon,
  Sun,
  Smartphone,
  Save,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Agentix" },
      { name: "description", content: "Manage your profile, company, security, appearance and API keys." },
      { property: "og:title", content: "Settings — Agentix" },
      { property: "og:description", content: "Manage your profile, company, security, appearance and API keys." },
    ],
  }),
  component: SettingsPage,
});

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" as const },
  { key: "agents", label: "AI Agents", icon: Bot, to: "/ai-agents" as const },
  { key: "conversations", label: "Conversations", icon: MessageSquare, to: "/conversations" as const },
  { key: "leads", label: "Leads", icon: Users, to: "/crm" as const },
  { key: "demos", label: "Demo Requests", icon: CalendarCheck, to: "/demo-requests" as const },
  { key: "analytics", label: "Analytics", icon: BarChart3, to: "/analytics" as const },
  { key: "billing", label: "Billing", icon: CreditCard, to: "/billing" as const },
  { key: "settings", label: "Settings", icon: SettingsIcon, to: "/settings" as const, active: true },
  { key: "support", label: "Support", icon: LifeBuoy, to: "/support" as const },
];

type SectionKey =
  | "profile"
  | "company"
  | "password"
  | "notifications"
  | "appearance"
  | "language"
  | "api-keys"
  | "security";

const sections: { key: SectionKey; label: string; icon: typeof UserIcon; desc: string }[] = [
  { key: "profile", label: "Profile", icon: UserIcon, desc: "Your personal information" },
  { key: "company", label: "Company", icon: Building2, desc: "Organization details" },
  { key: "password", label: "Password", icon: Lock, desc: "Change your password" },
  { key: "notifications", label: "Notifications", icon: Bell, desc: "Email & in-app alerts" },
  { key: "appearance", label: "Appearance", icon: Palette, desc: "Theme and layout" },
  { key: "language", label: "Language", icon: Globe, desc: "Language & region" },
  { key: "api-keys", label: "API Keys", icon: Key, desc: "Developer credentials" },
  { key: "security", label: "Security", icon: ShieldCheck, desc: "2FA & sessions" },
];

function SettingsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive] = useState<SectionKey>("profile");

  const name = user?.email?.split("@")[0] || "Operator";

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
                        layoutId="active-nav-settings"
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
                  placeholder="Search settings…"
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
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-[11px] font-medium text-cyan-300">
                  <SettingsIcon className="h-3 w-3" /> Workspace Settings
                </div>
                <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-white via-cyan-100 to-blue-300 bg-clip-text text-transparent">Settings</span>
                </h1>
                <p className="mt-2 text-white/60 max-w-xl">
                  Configure your workspace, personal preferences and security.
                </p>
              </div>
            </motion.section>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
              {/* Section nav */}
              <aside className="lg:sticky lg:top-40 lg:h-fit rounded-2xl border border-white/8 bg-white/[0.02] p-2">
                <ul className="space-y-1">
                  {sections.map((s) => {
                    const Icon = s.icon;
                    const isActive = active === s.key;
                    return (
                      <li key={s.key}>
                        <button
                          onClick={() => setActive(s.key)}
                          className={`relative w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                            isActive
                              ? "text-white bg-gradient-to-r from-cyan-500/15 to-blue-500/10 border border-cyan-400/25"
                              : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                          }`}
                        >
                          <Icon className={`h-4.5 w-4.5 ${isActive ? "text-cyan-300" : ""}`} />
                          <span className="flex-1 text-left">{s.label}</span>
                          {isActive && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </aside>

              {/* Section content */}
              <div className="min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    {active === "profile" && <ProfileSection name={name} email={user?.email || ""} />}
                    {active === "company" && <CompanySection />}
                    {active === "password" && <PasswordSection />}
                    {active === "notifications" && <NotificationsSection />}
                    {active === "appearance" && <AppearanceSection />}
                    {active === "language" && <LanguageSection />}
                    {active === "api-keys" && <ApiKeysSection />}
                    {active === "security" && <SecuritySection />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Sections ---------- */

function Card({ title, desc, children, footer }: { title: string; desc?: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
      <div className="px-6 py-5 border-b border-white/5">
        <div className="text-base font-bold">{title}</div>
        {desc && <div className="mt-0.5 text-xs text-white/50">{desc}</div>}
      </div>
      <div className="px-6 py-5">{children}</div>
      {footer && <div className="px-6 py-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-end gap-2">{footer}</div>}
    </section>
  );
}

function Field({
  label,
  placeholder,
  defaultValue,
  type = "text",
  suffix,
}: {
  label: string;
  placeholder?: string;
  defaultValue?: string;
  type?: string;
  suffix?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">{label}</span>
      <div className="mt-1.5 relative">
        <input
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className="h-10 w-full rounded-xl border border-white/8 bg-white/[0.03] px-3 pr-10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.05] transition"
        />
        {suffix && <div className="absolute right-2 top-1/2 -translate-y-1/2">{suffix}</div>}
      </div>
    </label>
  );
}

function SaveButton() {
  return (
    <>
      <button className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold hover:bg-white/[0.06] transition">
        Cancel
      </button>
      <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-[#07090C] shadow-[0_0_30px_-5px_rgba(34,211,238,0.6)] hover:scale-[1.02] active:scale-[0.98] transition">
        <Save className="h-4 w-4" /> Save changes
      </button>
    </>
  );
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative h-6 w-11 rounded-full border transition ${
        on ? "bg-gradient-to-r from-cyan-400 to-blue-500 border-cyan-400/40 shadow-[0_0_15px_-3px_rgba(34,211,238,0.6)]" : "bg-white/5 border-white/10"
      }`}
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 h-4.5 w-4.5 rounded-full bg-white shadow transition-all ${
          on ? "left-[calc(100%-1.25rem)]" : "left-1"
        }`}
      />
    </button>
  );
}

function ProfileSection({ name, email }: { name: string; email: string }) {
  return (
    <Card title="Profile" desc="Your personal information visible across Agentix." footer={<SaveButton />}>
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="relative">
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 grid place-items-center text-2xl font-bold uppercase shadow-[0_0_30px_-5px_rgba(34,211,238,0.5)]">
            {name.slice(0, 2)}
          </div>
          <button className="absolute -bottom-2 -right-2 grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-[#0B0F14] text-cyan-300 hover:border-cyan-400/40 transition">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First name" defaultValue={name} />
          <Field label="Last name" defaultValue="Doe" />
          <Field label="Email" defaultValue={email} type="email" />
          <Field label="Phone" defaultValue="+994 55 555 55 55" />
          <div className="sm:col-span-2">
            <Field label="Job title" defaultValue="AI Operations Manager" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function CompanySection() {
  return (
    <Card title="Company" desc="Organization details used across invoices and integrations." footer={<SaveButton />}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Company name" defaultValue="Agentix Labs" />
        <Field label="Website" defaultValue="https://agentix.ai" />
        <Field label="Industry" defaultValue="AI Automation" />
        <Field label="Company size" defaultValue="11 — 50" />
        <Field label="Country" defaultValue="Azerbaijan" />
        <Field label="VAT / Tax ID" defaultValue="AZ-1234567890" />
        <div className="sm:col-span-2">
          <Field label="Billing address" defaultValue="28 May Street 12, Baku, Azerbaijan" />
        </div>
      </div>
    </Card>
  );
}

function PasswordSection() {
  const [show, setShow] = useState(false);
  return (
    <Card title="Password" desc="Use a strong password with at least 12 characters." footer={<SaveButton />}>
      <div className="grid grid-cols-1 gap-4 max-w-lg">
        <Field
          label="Current password"
          type={show ? "text" : "password"}
          placeholder="••••••••••"
          suffix={
            <button onClick={() => setShow(!show)} className="text-white/50 hover:text-white transition">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <Field label="New password" type="password" placeholder="At least 12 characters" />
        <Field label="Confirm new password" type="password" placeholder="Repeat new password" />
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3 text-xs text-white/60">
          <div className="font-semibold text-white/80 mb-2">Password strength</div>
          <ul className="space-y-1">
            {["At least 12 characters", "One uppercase letter", "One number", "One symbol"].map((r) => (
              <li key={r} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-300" /> {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

function NotificationsSection() {
  const rows = [
    { label: "New conversations", desc: "Email me when a new conversation begins.", on: true },
    { label: "Weekly performance report", desc: "Every Monday at 09:00.", on: true },
    { label: "Lead alerts", desc: "Notify me when a high-intent lead is captured.", on: true },
    { label: "Billing & invoices", desc: "Receive invoices and payment updates.", on: true },
    { label: "Product updates", desc: "New features and releases.", on: false },
    { label: "Security alerts", desc: "Sign-ins from new devices or locations.", on: true },
  ];
  return (
    <Card title="Notifications" desc="Choose how you want to hear from Agentix." footer={<SaveButton />}>
      <ul className="divide-y divide-white/5">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-4 py-3">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">{r.label}</div>
              <div className="text-xs text-white/50">{r.desc}</div>
            </div>
            <Toggle defaultOn={r.on} />
          </li>
        ))}
      </ul>
    </Card>
  );
}

function AppearanceSection() {
  const [theme, setTheme] = useState<"dark" | "system" | "light">("dark");
  const [density, setDensity] = useState<"cozy" | "compact">("cozy");
  const themes = [
    { key: "dark", label: "Dark", icon: Moon },
    { key: "system", label: "System", icon: Monitor },
    { key: "light", label: "Light", icon: Sun },
  ] as const;
  const accents = ["#22d3ee", "#60a5fa", "#34d399", "#a78bfa", "#f472b6"];
  return (
    <Card title="Appearance" desc="Customize the look and feel of your workspace." footer={<SaveButton />}>
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-white/50">Theme</div>
          <div className="mt-2 grid grid-cols-3 gap-3 max-w-md">
            {themes.map((t) => {
              const Icon = t.icon;
              const isActive = theme === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTheme(t.key)}
                  className={`rounded-xl border p-3 text-left transition ${
                    isActive
                      ? "border-cyan-400/40 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 shadow-[0_0_20px_-8px_rgba(34,211,238,0.6)]"
                      : "border-white/8 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? "text-cyan-300" : "text-white/60"}`} />
                  <div className="mt-2 text-sm font-semibold">{t.label}</div>
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-white/50">Accent color</div>
          <div className="mt-2 flex items-center gap-3">
            {accents.map((c, i) => (
              <button
                key={c}
                className={`h-8 w-8 rounded-full border transition ${i === 0 ? "border-white ring-2 ring-cyan-400/40" : "border-white/20 hover:scale-110"}`}
                style={{ background: c, boxShadow: `0 0 15px -3px ${c}66` }}
                aria-label={`Accent ${c}`}
              />
            ))}
          </div>
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-white/50">Density</div>
          <div className="mt-2 inline-flex items-center rounded-xl border border-white/10 bg-white/[0.03] p-1">
            {(["cozy", "compact"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDensity(d)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition ${
                  density === d
                    ? "bg-gradient-to-r from-cyan-400/20 to-blue-500/20 text-cyan-200 border border-cyan-400/30"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function LanguageSection() {
  const [lang, setLang] = useState<"az" | "en">("az");
  const languages = [
    { code: "az", label: "Azerbaijani", flag: "🇦🇿" },
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "tr", label: "Türkçe", flag: "🇹🇷" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
    { code: "ar", label: "العربية", flag: "🇦🇪" },
  ] as const;
  return (
    <Card title="Language & Region" desc="Set your preferred language, timezone and formats." footer={<SaveButton />}>
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-white/50">Interface language</div>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {languages.map((l) => {
              const isActive = lang === (l.code as "az" | "en");
              return (
                <button
                  key={l.code}
                  onClick={() => (l.code === "az" || l.code === "en") && setLang(l.code as "az" | "en")}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                    isActive
                      ? "border-cyan-400/40 bg-gradient-to-r from-cyan-500/10 to-blue-500/5"
                      : "border-white/8 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <span className="text-xl">{l.flag}</span>
                  <span className="flex-1 text-sm font-semibold">{l.label}</span>
                  {isActive && <Check className="h-4 w-4 text-cyan-300" />}
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Timezone" defaultValue="(GMT+04:00) Baku" />
          <Field label="Date format" defaultValue="DD / MM / YYYY" />
          <Field label="Currency" defaultValue="USD ($)" />
          <Field label="First day of week" defaultValue="Monday" />
        </div>
      </div>
    </Card>
  );
}

function ApiKeysSection() {
  const keys = [
    { name: "Production", key: "sk_live_9f8•••••••••••••••3a21", created: "Jul 12, 2026", last: "2 min ago" },
    { name: "Staging", key: "sk_test_2c4•••••••••••••••bd91", created: "Jun 04, 2026", last: "Yesterday" },
    { name: "Analytics ingest", key: "sk_live_ae7•••••••••••••••4102", created: "Mar 22, 2026", last: "3 days ago" },
  ];
  return (
    <Card
      title="API Keys"
      desc="Use these keys to authenticate requests to the Agentix API."
      footer={
        <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-[#07090C] shadow-[0_0_30px_-5px_rgba(34,211,238,0.6)] hover:scale-[1.02] active:scale-[0.98] transition">
          <Plus className="h-4 w-4" /> Create new key
        </button>
      }
    >
      <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-xs text-cyan-200 mb-4 flex items-start gap-2">
        <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" />
        <span>Treat API keys like passwords. Never share them or expose them in client-side code.</span>
      </div>
      <ul className="space-y-2">
        {keys.map((k) => (
          <li key={k.name} className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold">{k.name}</div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/60">Live</span>
              </div>
              <div className="mt-1 font-mono text-xs text-white/70 truncate">{k.key}</div>
              <div className="mt-1 text-[10px] text-white/40">Created {k.created} · Last used {k.last}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-white/70 hover:text-white hover:border-cyan-400/30 transition" aria-label="Copy">
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-white/70 hover:text-rose-300 hover:border-rose-400/30 transition" aria-label="Revoke">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function SecuritySection() {
  const sessions = [
    { device: "MacBook Pro · Safari", location: "Baku, Azerbaijan", ip: "89.147.•••.42", last: "Active now", current: true, icon: Monitor },
    { device: "iPhone 15 · Agentix iOS", location: "Baku, Azerbaijan", ip: "89.147.•••.42", last: "12 min ago", current: false, icon: Smartphone },
    { device: "Chrome · Windows", location: "Istanbul, Türkiye", ip: "78.180.•••.11", last: "3 days ago", current: false, icon: Monitor },
  ];
  return (
    <div className="space-y-6">
      <Card title="Two-factor authentication" desc="Add an extra layer of security to your account.">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold flex items-center gap-2">
              Authenticator app
              <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">Enabled</span>
            </div>
            <div className="mt-1 text-xs text-white/50">Use an app like 1Password or Authy to generate codes.</div>
          </div>
          <button className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold hover:bg-white/[0.06] transition">
            Reconfigure
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/5 pt-4">
          <div>
            <div className="text-sm font-semibold">SMS verification</div>
            <div className="mt-1 text-xs text-white/50">Backup codes sent to +994 55 ••• 55 55.</div>
          </div>
          <Toggle defaultOn={false} />
        </div>
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/5 pt-4">
          <div>
            <div className="text-sm font-semibold">Passkey / Biometric</div>
            <div className="mt-1 text-xs text-white/50">Sign in with Face ID, Touch ID or Windows Hello.</div>
          </div>
          <Toggle defaultOn={true} />
        </div>
      </Card>

      <Card title="Active sessions" desc="Devices currently signed in to your Agentix account.">
        <ul className="space-y-2">
          {sessions.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.device} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.04] border border-white/10">
                  <Icon className="h-4 w-4 text-cyan-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    {s.device}
                    {s.current && (
                      <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-200">
                        This device
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-white/50">{s.location} · {s.ip} · {s.last}</div>
                </div>
                {!s.current && (
                  <button className="text-xs font-semibold text-rose-300 hover:text-rose-200 transition">Sign out</button>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex items-center justify-end">
          <button className="inline-flex items-center gap-2 rounded-xl border border-rose-400/25 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-500/15 transition">
            <LogOut className="h-4 w-4" /> Sign out of all other sessions
          </button>
        </div>
      </Card>

      <Card title="Danger zone" desc="Irreversible actions that affect your account.">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-rose-400/20 bg-rose-500/[0.04] p-4">
          <div>
            <div className="text-sm font-semibold text-rose-200">Delete account</div>
            <div className="mt-1 text-xs text-white/50">Permanently delete your Agentix account and all associated data.</div>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-500/25 transition">
            <Trash2 className="h-4 w-4" /> Delete account
          </button>
        </div>
      </Card>
    </div>
  );
}
