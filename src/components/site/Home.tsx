import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionTemplate, useSpring } from "framer-motion";
import {
  MessageSquare,
  Phone,
  Target,
  Headphones,
  Workflow,
  Database,
  Check,
  ArrowRight,
  Play,
  Zap,
  Shield,
  Globe,
  BarChart3,
  Clock,
  Bot,
  Sparkles,
  Star,
  ChevronDown,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";


/* ---------------- Cursor Glow ---------------- */
function CursorGlow() {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { damping: 25, stiffness: 200 });
  const sy = useSpring(y, { damping: 25, stiffness: 200 });
  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[1] h-[500px] w-[500px] rounded-full opacity-30 mix-blend-screen"
      style={{
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        background:
          "radial-gradient(circle, oklch(0.65 0.26 295 / 0.5) 0%, transparent 60%)",
      }}
    />
  );
}

/* ---------------- Particles ---------------- */
function Particles({ count = 30 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    dx: (Math.random() - 0.5) * 200,
    dy: (Math.random() - 0.5) * 200,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 10,
    duration: Math.random() * 15 + 15,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-purple-400/40"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            // @ts-expect-error custom props
            "--dx": `${p.dx}px`,
            "--dy": `${p.dy}px`,
            animation: `particle-drift ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------------- AI Visualization ---------------- */
function AIVisualization() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      setTilt({ x: (e.clientX - cx) / 40, y: (e.clientY - cy) / 40 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const nodes = [
    { x: 50, y: 50, size: 80, label: "Core" },
    { x: 15, y: 20, size: 40, label: "NLP" },
    { x: 82, y: 18, size: 44, label: "API" },
    { x: 10, y: 78, size: 42, label: "CRM" },
    { x: 85, y: 82, size: 46, label: "Chat" },
    { x: 50, y: 8, size: 34, label: "Vision" },
    { x: 50, y: 92, size: 36, label: "Voice" },
  ];

  return (
    <div
      ref={ref}
      className="relative aspect-square w-full max-w-[560px] mx-auto"
      style={{
        transform: `perspective(1200px) rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)`,
        transition: "transform 0.2s ease-out",
      }}
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.65_0.26_295/0.4),transparent_60%)] blur-2xl" />

      {/* Rotating rings */}
      <div className="absolute inset-8 rounded-full border border-purple-500/20 animate-spin-slow" />
      <div className="absolute inset-16 rounded-full border border-blue-500/20 animate-spin-reverse" />
      <div className="absolute inset-24 rounded-full border border-cyan-500/20 animate-spin-slow" />

      {/* Connection lines */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.65 0.26 295)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="oklch(0.62 0.22 255)" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {nodes.slice(1).map((n, i) => (
          <line
            key={i}
            x1="50"
            y1="50"
            x2={n.x}
            y2={n.y}
            stroke="url(#line-grad)"
            strokeWidth="0.3"
            strokeDasharray="2 2"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="20"
              dur={`${3 + i}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}
      </svg>

      {/* Nodes */}
      {nodes.map((n, i) => (
        <motion.div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            className={`relative flex items-center justify-center rounded-2xl glass-strong ${
              i === 0 ? "bg-brand-gradient" : ""
            }`}
            style={{ width: n.size, height: n.size }}
          >
            <div className="absolute inset-0 rounded-2xl bg-brand-gradient opacity-20 blur-md" />
            {i === 0 ? (
              <Bot className="relative h-8 w-8 text-white" />
            ) : (
              <span className="relative text-[10px] font-mono font-semibold text-purple-200">
                {n.label}
              </span>
            )}
          </div>
        </motion.div>
      ))}

      {/* Floating stat panels */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-6 -left-6 glass-strong rounded-xl px-3 py-2 shadow-lg hidden sm:block"
      >
        <div className="flex items-center gap-2">
          <div className
          
          ="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono text-muted-foreground">98.4% uptime</span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-8 -right-4 glass-strong rounded-xl px-3 py-2 shadow-lg hidden sm:block"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="h-3 w-3 text-purple-400" />
          <span className="text-[10px] font-mono text-muted-foreground">+248% ROI</span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity }}
        className="absolute top-1/2 -right-8 glass-strong rounded-xl px-3 py-2 shadow-lg hidden md:block"
      >
        <div className="text-[10px] font-mono text-muted-foreground">1.2s avg</div>
      </motion.div>
    </div>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 left-10 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.5 0.1 280 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.5 0.1 280 / 0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
          }}
        />
      </div>
      <Particles count={40} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">
              {t("home.hero.badge")}
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            <span className="text-gradient">{t("home.hero.titleTop")}</span>
            <br />
            <span className="text-brand-gradient">{t("home.hero.titleBottom")}</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            {t("home.hero.subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/book-demo"
              className="group inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_oklch(0.65_0.26_295/0.5)] hover:shadow-[0_0_50px_oklch(0.65_0.26_295/0.7)] transition-all hover:-translate-y-0.5"
            >
              {t("common.bookDemo")}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </Link>
            <Link
              to="/demo"
              className="group inline-flex items-center gap-2 rounded-xl glass-strong px-6 py-3.5 text-sm font-semibold hover:bg-white/10 transition"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-gradient">
                <Play className="h-3 w-3 text-white fill-white" />
              </div>
              {t("common.watchDemo")}
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {[
              t("home.hero.chips.support"),
              t("home.hero.chips.noCode"),
              t("home.hero.chips.integration"),
            ].map((c) => (
              <div key={c} className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-gradient">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm text-muted-foreground">{c}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <AIVisualization />
        </motion.div>
      </div>
    </section>
  );
}


/* ---------------- Trusted By ---------------- */
function TrustedBy() {
  const { t } = useTranslation();
  const companies = ["Nebula", "Orbit", "Quantum", "Vertex", "Lumen", "Pulse", "Axiom", "Zenith"];
  return (
    <section className="relative py-20 border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-center text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-10">
          {t("home.trusted")}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {companies.map((c) => (
            <div
              key={c}
              className="group flex items-center justify-center py-4 opacity-40 hover:opacity-100 transition duration-500"
            >
              <span className="text-lg font-bold font-display tracking-tight text-muted-foreground group-hover:text-gradient group-hover:drop-shadow-[0_0_15px_oklch(0.65_0.26_295/0.6)] transition">
                {c}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ---------------- Dashboard Preview ---------------- */
function DashboardPreview() {
  const { t } = useTranslation();
  const messages = [
    { user: "Sarah K.", msg: "What's your return policy?", time: "2s ago" },
    { user: "Marcus D.", msg: "Can I upgrade my plan?", time: "5s ago" },
    { user: "Priya R.", msg: "Do you ship internationally?", time: "8s ago" },
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
            <Activity className="h-3 w-3 text-purple-400" />
            <span className="text-xs font-medium">{t("home.dashboard.badge")}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient">
            {t("home.dashboard.title")}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t("home.dashboard.subtitle")}
          </p>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-3xl bg-brand-gradient opacity-20 blur-3xl" />
          <div className="relative glass-strong rounded-3xl p-4 sm:p-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400/60" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/60" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/60" />
              </div>
              <div className="text-xs font-mono text-muted-foreground">agentix.ai/dashboard</div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-muted-foreground">{t("home.dashboard.live")}</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 mt-4">
              {/* Stats */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { l: t("home.dashboard.stats.activeChats"), v: "1,248", d: "+12%", i: Users },
                    { l: t("home.dashboard.stats.response"), v: "0.8s", d: "-24%", i: Clock },
                    { l: t("home.dashboard.stats.automation"), v: "94%", d: "+8%", i: Bot },
                    { l: t("home.dashboard.stats.csat"), v: "4.9", d: "+0.2", i: Star },

                  ].map((s) => (
                    <div key={s.l} className="gradient-border rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <s.i className="h-4 w-4 text-purple-400" />
                        <span className="text-[10px] text-emerald-400 font-mono">{s.d}</span>
                      </div>
                      <div className="text-xl font-bold">{s.v}</div>
                      <div className="text-[10px] text-muted-foreground">{s.l}</div>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="gradient-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-sm font-semibold">{t("home.dashboard.conversations")}</div>
                      <div className="text-xs text-muted-foreground">{t("home.dashboard.last24")}</div>

                    </div>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-end gap-1.5 h-28">
                    {[40, 55, 35, 70, 50, 85, 65, 95, 75, 88, 60, 92, 70, 100, 82].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.05 }}
                        className="flex-1 rounded-t bg-gradient-to-t from-purple-600/80 to-blue-500/60"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="gradient-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold">{t("home.dashboard.liveMessages")}</div>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-3">
                  {messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 }}
                      className="space-y-2"
                    >
                      <div className="flex items-start gap-2">
                        <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[10px] font-bold">
                          {m.user[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold truncate">{m.user}</span>
                            <span className="text-[10px] text-muted-foreground">{m.time}</span>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground bg-white/5 rounded-lg px-2 py-1.5">
                            {m.msg}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 pl-6">
                        <div className="h-6 w-6 shrink-0 rounded-full bg-brand-gradient flex items-center justify-center">
                          <Bot className="h-3 w-3 text-white" />
                        </div>
                        <div className="flex-1 text-xs bg-brand-gradient/10 rounded-lg px-2 py-1.5 border border-purple-500/20">
                          <span className="inline-flex gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse [animation-delay:0.2s]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse [animation-delay:0.4s]" />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Services ---------------- */
function ServiceCard({
  s,
  i,
}: {
  s: { i: typeof MessageSquare; t: string; d: string; slug: string };
  i: number;
}) {
  const { t: tr } = useTranslation();
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };
  const handleLeave = () => {
    mx.set(-200);
    my.set(-200);
  };

  const bg = useMotionTemplate`radial-gradient(240px circle at ${mx}px ${my}px, oklch(0.65 0.26 295 / 0.22), transparent 70%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.05 }}
    >
      <Link
        ref={ref}
        to={`/services/${s.slug}` as string}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="group relative block gradient-border rounded-2xl p-6 h-full transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-glow"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: bg }}
        />
        <div className="absolute inset-0 rounded-2xl bg-brand-gradient opacity-0 group-hover:opacity-10 blur-xl transition duration-500" />
        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient shadow-[0_0_30px_oklch(0.65_0.26_295/0.4)] mb-5 group-hover:scale-110 transition-transform duration-300">
            <s.i className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{s.t}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-1">{s.d}</p>
          <div className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-purple-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition">
            {tr("common.learnMore")} <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Services() {
  const { t } = useTranslation();
  const services = [
    { i: MessageSquare, t: t("home.services.items.chatbots.t"), d: t("home.services.items.chatbots.d"), slug: "ai-chatbots" },
    { i: Phone, t: t("home.services.items.voice.t"), d: t("home.services.items.voice.d"), slug: "voice-ai" },
    { i: Target, t: t("home.services.items.leads.t"), d: t("home.services.items.leads.d"), slug: "lead-generation" },
    { i: Headphones, t: t("home.services.items.support.t"), d: t("home.services.items.support.d"), slug: "customer-support" },
    { i: Workflow, t: t("home.services.items.workflow.t"), d: t("home.services.items.workflow.d"), slug: "workflow-automation" },
    { i: Database, t: t("home.services.items.crm.t"), d: t("home.services.items.crm.d"), slug: "crm-integration" },
  ];

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
            <Sparkles className="h-3 w-3 text-purple-400" />
            <span className="text-xs font-medium">{t("home.services.badge")}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient">
            {t("home.services.title")}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <ServiceCard key={s.slug} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}



/* ---------------- How It Works ---------------- */
function HowItWorks() {
  const { t } = useTranslation();
  const steps = [
    { n: "01", t: t("home.how.steps.1.t"), d: t("home.how.steps.1.d") },
    { n: "02", t: t("home.how.steps.2.t"), d: t("home.how.steps.2.d") },
    { n: "03", t: t("home.how.steps.3.t"), d: t("home.how.steps.3.d") },
    { n: "04", t: t("home.how.steps.4.t"), d: t("home.how.steps.4.d") },
  ];

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient">{t("home.how.title")}</h2>
          <p className="mt-4 text-muted-foreground">{t("home.how.subtitle")}</p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-16 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative"
              >
                <div className="relative gradient-border rounded-2xl p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-white font-mono font-bold shadow-glow">
                      {s.n}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{s.t}</h3>
                  <p className="text-sm text-muted-foreground">{s.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ---------------- Features ---------------- */
function Features() {
  const { t } = useTranslation();
  const features = [
    { i: MessageSquare, t: t("home.features.items.conversations") },
    { i: Workflow, t: t("home.features.items.integrations") },
    { i: Shield, t: t("home.features.items.security") },
    { i: Globe, t: t("home.features.items.multilang") },
    { i: BarChart3, t: t("home.features.items.analytics") },
    { i: Clock, t: t("home.features.items.availability") },
    { i: Zap, t: t("home.features.items.automation") },
    { i: Bot, t: t("home.features.items.custom") },
  ];

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient">
            {t("home.features.title")}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t("home.features.subtitle")}
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            {features.map((f) => (
              <div key={f.t} className="flex items-center gap-3 gradient-border rounded-xl px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient/20 border border-purple-500/30">
                  <f.i className="h-4 w-4 text-purple-300" />
                </div>
                <span className="text-sm font-medium">{f.t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI interface preview */}
        <div className="relative">
          <div className="absolute -inset-8 rounded-3xl bg-brand-gradient opacity-20 blur-3xl" />
          <div className="relative glass-strong rounded-3xl p-5">
            <div className="flex items-center gap-3 pb-4 border-b border-white/5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold">{t("home.features.chat.assistant")}</div>
                <div className="text-xs text-emerald-400 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {t("home.features.chat.online")}
                </div>
              </div>
            </div>
            <div className="space-y-3 mt-4">
              <div className="flex justify-end">
                <div className="bg-white/5 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%] text-sm">
                  {t("home.features.chat.u1")}
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-brand-gradient/20 border border-purple-500/20 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%] text-sm">
                  {t("home.features.chat.a1")}
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-white/5 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%] text-sm">
                  {t("home.features.chat.u2")}
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-brand-gradient/20 border border-purple-500/20 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%] text-sm">
                  {t("home.features.chat.a2")}
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
              <input
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder={t("home.features.chat.placeholder")}
                aria-label={t("home.features.chat.placeholder")}
              />
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient" aria-label="Send">
                <ArrowRight className="h-4 w-4 text-white" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Stats ---------------- */
function Counter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let started = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true;
          const dur = 2000;
          const t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min((t - t0) / dur, 1);
            setV(Math.floor(end * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="text-5xl sm:text-6xl font-bold text-brand-gradient font-display">
      {prefix}
      {v.toLocaleString()}
      {suffix}
    </div>
  );
}

function Stats() {
  const { t } = useTranslation();
  const stats = [
    { n: 100, s: "+", l: t("home.stats.businesses") },
    { n: 500, s: "K+", l: t("home.stats.messages") },
    { n: 98, s: "%", l: t("home.stats.csat") },
    { n: 24, s: "/7", l: t("home.stats.availability") },
  ];

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass-strong rounded-3xl p-10 sm:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,oklch(0.65_0.26_295/0.2),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,oklch(0.62_0.22_255/0.2),transparent_50%)]" />
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.l}>
                <Counter end={s.n} suffix={s.s} />
                <div className="mt-2 text-sm text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */
function Testimonials() {
  const { t } = useTranslation();
  const items = [
    {
      n: t("home.testimonials.items.1.n"),
      r: t("home.testimonials.items.1.r"),
      q: t("home.testimonials.items.1.q"),
      avatar: "linear-gradient(135deg,#a855f7,#3b82f6)",
    },
    {
      n: t("home.testimonials.items.2.n"),
      r: t("home.testimonials.items.2.r"),
      q: t("home.testimonials.items.2.q"),
      avatar: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    },
    {
      n: t("home.testimonials.items.3.n"),
      r: t("home.testimonials.items.3.r"),
      q: t("home.testimonials.items.3.q"),
      avatar: "linear-gradient(135deg,#ec4899,#a855f7)",
    },
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient">{t("home.testimonials.title")}</h2>
          <p className="mt-4 text-muted-foreground">
            {t("home.testimonials.subtitle")}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((x, i) => (
            <motion.div
              key={x.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="gradient-border rounded-2xl p-6 flex flex-col"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">"{x.q}"</p>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/5">
                <div
                  className="h-10 w-10 rounded-full shrink-0"
                  style={{ background: x.avatar }}
                />
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{x.n}</div>
                  <div className="text-xs text-muted-foreground truncate">{x.r}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ---------------- FAQ ---------------- */
function FAQ() {
  const { t } = useTranslation();
  const faqs = [
    { q: t("home.faq.items.1.q"), a: t("home.faq.items.1.a") },
    { q: t("home.faq.items.2.q"), a: t("home.faq.items.2.a") },
    { q: t("home.faq.items.3.q"), a: t("home.faq.items.3.a") },
    { q: t("home.faq.items.4.q"), a: t("home.faq.items.4.a") },
    { q: t("home.faq.items.5.q"), a: t("home.faq.items.5.a") },
    { q: t("home.faq.items.6.q"), a: t("home.faq.items.6.a") },
  ];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient">{t("home.faq.title")}</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="gradient-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <span className="font-medium pr-6">{f.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-purple-300 transition-transform duration-300 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */
function FinalCTA() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-10 sm:p-20 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.65_0.26_295/0.3),transparent_60%)]" />
          <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-purple-600/30 blur-[100px] animate-pulse-glow" />
          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-600/30 blur-[100px] animate-pulse-glow" />
          <Particles count={20} />

          <div className="relative">
            <h2 className="text-4xl sm:text-6xl font-bold text-gradient max-w-3xl mx-auto leading-[1.1]">
              Ready to Build Your AI Workforce?
            </h2>
            <p className="mt-6 text-muted-foreground max-w-xl mx-auto">
              Join hundreds of teams shipping intelligent automation with Agentix.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                to="/book-demo"
                className="group inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-7 py-4 text-sm font-semibold text-white shadow-glow hover:shadow-[0_0_60px_oklch(0.65_0.26_295/0.7)] transition-all hover:-translate-y-0.5"
              >
                Book a Demo
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl glass-strong px-7 py-4 text-sm font-semibold hover:bg-white/10 transition"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Page ---------------- */
export function Home() {
  return (
    <div className="relative bg-[#050505] text-foreground">
      <CursorGlow />
      <Hero />
      <TrustedBy />
      <DashboardPreview />
      <Services />
      <HowItWorks />
      <Features />
      <Stats />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </div>
  );
}
