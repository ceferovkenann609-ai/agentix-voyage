import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  MessageSquare,
  Phone,
  Target,
  Headphones,
  Workflow,
  Database,
  ArrowRight,
  Sparkles,
  Check,
  X,
  Clock,
  Zap,
  Infinity as InfinityIcon,
  Brain,
  MessagesSquare,
  Send,
  Instagram,
  Facebook,
  Calendar,
  Mail,
  Slack,
  Users,
  ChevronDown,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* Reused visual pieces — kept locally to avoid touching Home.tsx */

function Particles({ count = 24 }: { count?: number }) {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; dx: number; dy: number; size: number; delay: number; duration: number }[]
  >([]);
  useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        dx: (Math.random() - 0.5) * 200,
        dy: (Math.random() - 0.5) * 200,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 10,
        duration: Math.random() * 15 + 15,
      })),
    );
  }, [count]);
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


/* ---------- AI orb — smaller variant tuned for the services hero ---------- */
function ServicesOrb() {
  const nodes = [
    { x: 50, y: 50, size: 76, icon: Brain },
    { x: 15, y: 22, size: 40, label: "NLP" },
    { x: 82, y: 20, size: 42, label: "API" },
    { x: 12, y: 78, size: 40, label: "CRM" },
    { x: 86, y: 80, size: 44, label: "Chat" },
    { x: 50, y: 10, size: 32, label: "LLM" },
    { x: 50, y: 92, size: 34, label: "Voice" },
  ];
  return (
    <div className="relative aspect-square w-full max-w-[520px] mx-auto">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.65_0.26_295/0.4),transparent_60%)] blur-2xl" />
      <div className="absolute inset-8 rounded-full border border-purple-500/20 animate-spin-slow" />
      <div className="absolute inset-16 rounded-full border border-blue-500/20 animate-spin-reverse" />
      <div className="absolute inset-24 rounded-full border border-cyan-500/20 animate-spin-slow" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="svc-line" x1="0" y1="0" x2="1" y2="1">
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
            stroke="url(#svc-line)"
            strokeWidth="0.3"
            strokeDasharray="2 2"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="20" dur={`${3 + i}s`} repeatCount="indefinite" />
          </line>
        ))}
      </svg>

      {nodes.map((n, i) => (
        <motion.div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            className={`relative flex items-center justify-center rounded-2xl glass-strong ${i === 0 ? "bg-brand-gradient" : ""}`}
            style={{ width: n.size, height: n.size }}
          >
            <div className="absolute inset-0 rounded-2xl bg-brand-gradient opacity-20 blur-md" />
            {i === 0 && n.icon ? (
              <n.icon className="relative h-8 w-8 text-white" />
            ) : (
              <span className="relative text-[10px] font-mono font-semibold text-purple-200">{n.label}</span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  const badges = ["24/7 AI Automation", "Custom Solutions", "Fast Deployment"];
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 left-10 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.5 0.1 280 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.5 0.1 280 / 0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
          }}
        />
      </div>
      <Particles count={30} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-6">
            <Sparkles className="h-3 w-3 text-purple-400" />
            <span className="text-xs font-medium text-muted-foreground">Services</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            <span className="text-gradient">AI Services for</span>
            <br />
            <span className="text-brand-gradient">Modern Businesses</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            We build intelligent AI solutions that automate customer communication, sales,
            support, and business operations.
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {badges.map((b) => (
              <div
                key={b}
                className="inline-flex items-center gap-2 rounded-full glass-strong px-3.5 py-1.5"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-gradient">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-xs font-medium">{b}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/demo"
              className="group inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_oklch(0.65_0.26_295/0.5)] hover:shadow-[0_0_50px_oklch(0.65_0.26_295/0.7)] transition-all hover:-translate-y-0.5"
            >
              Book a Demo <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl glass-strong px-6 py-3.5 text-sm font-semibold hover:bg-white/10 transition"
            >
              Contact Sales
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}>
          <ServicesOrb />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Service Card (large) ---------- */
function ServiceCard({
  s,
  i,
}: {
  s: {
    icon: typeof MessageSquare;
    title: string;
    desc: string;
    slug: "ai-chatbots" | "voice-ai" | "lead-generation" | "customer-support" | "workflow-automation" | "crm-integration";
  };
  i: number;
}) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.06 }}
    >
      <Link
        ref={ref}
        to={`/services/${s.slug}` as const}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="group relative block gradient-border rounded-2xl p-8 h-full transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-glow"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: useMotionTemplate`radial-gradient(280px circle at ${mx}px ${my}px, oklch(0.65 0.26 295 / 0.22), transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 rounded-2xl bg-brand-gradient opacity-0 group-hover:opacity-10 blur-xl transition duration-500" />
        <div className="relative">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-gradient shadow-[0_0_30px_oklch(0.65_0.26_295/0.4)] mb-6 group-hover:scale-110 transition-transform duration-300">
            <s.icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>

          <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-purple-300 group-hover:text-white transition">
            Learn more
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ServicesGrid() {
  const services: Array<{
    icon: typeof MessageSquare;
    title: string;
    desc: string;
    slug: "ai-chatbots" | "voice-ai" | "lead-generation" | "customer-support" | "workflow-automation" | "crm-integration";
  }> = [
    { icon: MessageSquare, title: "AI Chatbots", desc: "Human-like conversations across web, mobile, and messaging platforms.", slug: "ai-chatbots" },
    { icon: Phone, title: "Voice AI Agents", desc: "Natural-sounding voice agents that handle calls in real time.", slug: "voice-ai" },
    { icon: Target, title: "Lead Generation", desc: "Qualify and route high-intent leads to your sales team 24/7.", slug: "lead-generation" },
    { icon: Headphones, title: "Customer Support", desc: "Resolve up to 80% of tickets instantly with tier-1 AI support.", slug: "customer-support" },
    { icon: Workflow, title: "Workflow Automation", desc: "Chain multi-step business processes with intelligent agents.", slug: "workflow-automation" },
    { icon: Database, title: "CRM Integration", desc: "Sync seamlessly with Salesforce, HubSpot, Zoho, and 50+ tools.", slug: "crm-integration" },
  ];

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
            <Sparkles className="h-3 w-3 text-purple-400" />
            <span className="text-xs font-medium">What we offer</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient">Purpose-built AI, end to end</h2>
          <p className="mt-4 text-muted-foreground">
            Six flagship services — click any card to explore capabilities, pricing, and integrations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <ServiceCard key={s.slug} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Why Choose Agentix (comparison) ---------- */
function WhyChoose() {
  const rows = [
    { t: "Limited working hours", a: "24/7 AI automation", ti: Clock, ai: InfinityIcon },
    { t: "Slow replies", a: "Instant responses", ti: Clock, ai: Zap },
    { t: "Manual, repetitive work", a: "Intelligent automation", ti: Users, ai: Brain },
    { t: "Limited scalability", a: "Unlimited conversations", ti: Users, ai: InfinityIcon },
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient">Why choose Agentix</h2>
          <p className="mt-4 text-muted-foreground">
            The difference between running a business and running an AI-first business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Traditional */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-8 border border-white/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-muted-foreground">Traditional Business</h3>
            </div>
            <ul className="space-y-4">
              {rows.map((r) => (
                <li key={r.t} className="flex items-start gap-3">
                  <r.ti className="h-5 w-5 text-red-400/70 mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">{r.t}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Agentix */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative gradient-border rounded-2xl p-8 shadow-glow"
          >
            <div className="absolute -inset-2 rounded-3xl bg-brand-gradient opacity-20 blur-2xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient shadow-glow">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-brand-gradient">Agentix AI</h3>
              </div>
              <ul className="space-y-4">
                {rows.map((r, i) => (
                  <motion.li
                    key={r.a}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <r.ai className="h-5 w-5 text-purple-300 mt-0.5 shrink-0" />
                    <span className="text-sm">{r.a}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Integrations ---------- */
function Integrations() {
  const items = [
    { i: MessagesSquare, l: "WhatsApp" },
    { i: Send, l: "Telegram" },
    { i: Instagram, l: "Instagram" },
    { i: Facebook, l: "Messenger" },
    { i: Calendar, l: "Google Calendar" },
    { i: Mail, l: "Gmail" },
    { i: Slack, l: "Slack" },
    { i: Database, l: "CRM Systems" },
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient">Works with your existing tools</h2>
          <p className="mt-4 text-muted-foreground">
            Plug Agentix into the platforms your team already uses — no rip and replace.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((it, i) => (
            <motion.div
              key={it.l}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group gradient-border rounded-2xl p-5 flex flex-col items-center gap-3 hover:-translate-y-1 hover:shadow-glow transition-all duration-300"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient/15 border border-purple-500/25 group-hover:scale-110 group-hover:bg-brand-gradient/25 transition">
                <it.i className="h-5 w-5 text-purple-200" />
              </div>
              <span className="text-sm font-medium">{it.l}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- How We Deliver ---------- */
function HowWeDeliver() {
  const steps = [
    { n: "01", t: "Discovery Call", d: "We map your workflows and pinpoint the highest-ROI automation opportunities." },
    { n: "02", t: "AI Development", d: "Custom-trained agents on your data, tone, and business logic." },
    { n: "03", t: "Integration", d: "Deployed into your stack — chat, voice, CRM, and beyond." },
    { n: "04", t: "Launch & Optimization", d: "Continuous tuning, analytics, and iterative expansion." },
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient">How we deliver</h2>
          <p className="mt-4 text-muted-foreground">A proven four-step process from first call to full rollout.</p>
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

/* ---------- FAQ ---------- */
function FAQ() {
  const faqs = [
    { q: "Which services do you offer?", a: "Chatbots, voice agents, lead generation, customer support, workflow automation, and CRM integration — fully managed." },
    { q: "How long does it take to launch a service?", a: "Most engagements go live in 2–4 weeks, including discovery, training, integration, and QA." },
    { q: "Do I need engineers on my side?", a: "No. Agentix is fully managed. We build, deploy, and maintain — you approve and monitor." },
    { q: "Can services be customized to my industry?", a: "Yes. Every service is trained on your data, tone, and business logic — no generic templates." },
    { q: "How is pricing structured?", a: "Transparent monthly plans per service, with volume-based tiers. Full pricing on each service page." },
    { q: "Is my data secure?", a: "SOC 2 Type II, GDPR compliant, and end-to-end encryption. Your data is never used to train foundation models." },
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient">Frequently asked questions</h2>
          <p className="mt-4 text-muted-foreground">Everything you need to know about our services.</p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="gradient-border rounded-xl border-0 px-5"
            >
              <AccordionTrigger className="text-left hover:no-underline py-5 [&>svg]:hidden group">
                <span className="text-base font-semibold">{f.q}</span>
                <ChevronDown className="h-4 w-4 text-purple-300 transition-transform duration-300 group-data-[state=open]:rotate-180" />
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */
function CTA() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative glass-strong rounded-3xl p-12 sm:p-16 overflow-hidden text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,oklch(0.65_0.26_295/0.25),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,oklch(0.62_0.22_255/0.25),transparent_55%)]" />
          <div className="relative">
            <h2 className="text-4xl sm:text-5xl font-bold text-gradient">Let's build your AI workforce</h2>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
              Book a free consultation and discover how Agentix can automate your business.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
              to="/book-demo"
                className="group inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_oklch(0.65_0.26_295/0.5)] hover:shadow-[0_0_50px_oklch(0.65_0.26_295/0.7)] transition-all hover:-translate-y-0.5"
              >
                Book a Demo <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl glass-strong px-6 py-3.5 text-sm font-semibold hover:bg-white/10 transition"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <WhyChoose />
      <Integrations />
      <HowWeDeliver />
      <FAQ />
      <CTA />
    </>
  );
}
