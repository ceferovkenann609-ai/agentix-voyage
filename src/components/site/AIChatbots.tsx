import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionTemplate, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Sparkles,
  Check,
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
  Users,
  ChevronDown,
  Headphones,
  CalendarCheck,
  HelpCircle,
  UserPlus,
  ShoppingBag,
  Package,
  Utensils,
  Stethoscope,
  Hotel,
  Home,
  GraduationCap,
  Scissors,
  Scale,
  Building2,
  PlayCircle,
  Bot,
  User as UserIcon,
  Cpu,
  Rocket,
  Settings,
  Search,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ---------- Particles ---------- */
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

/* ---------- Animated Chatbot Preview (Hero visual) ---------- */
type Msg = { from: "user" | "bot"; text: string };

const DEMO_REPLIES: { match: RegExp; reply: string }[] = [
  { match: /appointment|book|schedul/i, reply: "Absolutely! I can check availability and confirm bookings directly in your calendar. What day works best?" },
  { match: /whatsapp|instagram|messenger|channel/i, reply: "Yes — I work across WhatsApp, Instagram, Messenger, SMS, and your website out of the box." },
  { match: /language|multi.?lingual|spanish|french/i, reply: "I speak 50+ languages fluently and auto-detect the visitor's language in real time." },
  { match: /deploy|how (fast|quick|long)|setup|launch/i, reply: "Most chatbots are trained and live within 3–5 business days, fully branded to your business." },
  { match: /price|cost|pricing/i, reply: "Plans start at $299/month and scale with usage. I'll route you to sales for a tailored quote." },
  { match: /customer|question|answer|support|faq/i, reply: "I resolve up to 80% of tier-1 questions instantly and hand off complex cases to a human." },
  { match: /lead|qualif|crm/i, reply: "I qualify visitors, capture contact details, score intent, and sync leads straight into your CRM." },
];

function generateReply(input: string): string {
  for (const rule of DEMO_REPLIES) if (rule.match.test(input)) return rule.reply;
  return "Great question! In production I'd be trained on your business data to answer that precisely. Ask me about bookings, channels, languages, or deployment time.";
}

function ChatbotHeroPreview() {
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: "Hi! I'm the Agentix AI assistant. Try asking me anything — bookings, channels, languages, deployment…" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((m) => [...m, { from: "user", text: clean }]);
    setInput("");
    setTyping(true);
    const delay = 700 + Math.min(clean.length * 20, 1200);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { from: "bot", text: generateReply(clean) }]);
    }, delay);
  };

  const suggestions = [
    "Can you book an appointment?",
    "Do you support WhatsApp?",
    "Do you speak multiple languages?",
    "How quickly can you be deployed?",
  ];

  return (
    <div className="relative w-full max-w-[520px] mx-auto">
      <div className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-brand-gradient opacity-25 blur-3xl" />

      <motion.div
        aria-hidden
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-6 top-14 glass-strong rounded-2xl px-4 py-3 shadow-glow z-20 hidden sm:flex items-center gap-3"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-400/30">
          <Check className="h-4 w-4 text-emerald-300" />
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">Resolved</p>
          <p className="text-sm font-semibold">1,284 chats</p>
        </div>
      </motion.div>

      <motion.div
        aria-hidden
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-4 bottom-24 glass-strong rounded-2xl px-4 py-3 shadow-glow z-20 hidden sm:flex items-center gap-3"
      >
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 border border-purple-400/30">
          <span className="absolute h-2.5 w-2.5 rounded-full bg-emerald-400 top-1 right-1 animate-pulse" />
          <Zap className="h-4 w-4 text-purple-200" />
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">Response</p>
          <p className="text-sm font-semibold">~1.2s avg</p>
        </div>
      </motion.div>

      <div className="relative gradient-border rounded-3xl overflow-hidden">
        <div className="relative bg-[oklch(0.14_0.03_280/0.85)] backdrop-blur-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient">
                <Bot className="h-5 w-5 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#0b0b18]" />
              </div>
              <div>
                <p className="text-sm font-semibold">Agentix Assistant</p>
                <p className="text-[11px] text-emerald-300 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online · Replies instantly
                </p>
              </div>
            </div>
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            </div>
          </div>

          <div ref={scrollRef} className="h-[340px] px-5 py-5 space-y-3 overflow-y-auto flex flex-col">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={`${i}-${m.from}`}
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-end gap-2 ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.from === "bot" && (
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gradient shrink-0">
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.from === "user"
                        ? "bg-brand-gradient text-white rounded-br-sm shadow-[0_0_20px_oklch(0.65_0.26_295/0.4)]"
                        : "glass-strong rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.from === "user" && (
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 border border-white/10 shrink-0">
                      <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
              {typing && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-end gap-2"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gradient shrink-0">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="glass-strong rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full bg-purple-300"
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                        transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {messages.length <= 1 && (
            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[11px] rounded-full glass-strong px-3 py-1.5 hover:bg-white/10 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="px-5 py-4 border-t border-white/5 flex items-center gap-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything…"
              className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-purple-400/50 transition"
            />
            <button
              type="submit"
              aria-label="Send"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient shadow-glow hover:scale-105 transition"
            >
              <Send className="h-4 w-4 text-white" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  const badges = ["Available 24/7", "Human-like Conversations", "Fast Deployment"];
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
            <span className="text-xs font-medium text-muted-foreground">AI Chatbots</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            <span className="text-gradient">AI Chatbots That</span>
            <br />
            <span className="text-brand-gradient">Work 24/7</span>
            <br />
            <span className="text-gradient">for Your Business</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            Agentix AI Chatbots answer customer questions, generate leads, book appointments,
            qualify prospects, and support your customers automatically — day and night.
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
            <a
              href="#live-demo"
              className="group inline-flex items-center gap-2 rounded-xl glass-strong px-6 py-3.5 text-sm font-semibold hover:bg-white/10 transition"
            >
              <PlayCircle className="h-4 w-4" /> Watch Live Demo
            </a>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}>
          <ChatbotHeroPreview />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Feature Card ---------- */
function FeatureCard({
  icon: Icon,
  title,
  desc,
  i,
}: {
  icon: typeof Headphones;
  title: string;
  desc: string;
  i: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.06 }}
      className="group relative gradient-border rounded-2xl p-7 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: useMotionTemplate`radial-gradient(260px circle at ${mx}px ${my}px, oklch(0.65 0.26 295 / 0.22), transparent 70%)`,
        }}
      />
      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient shadow-[0_0_30px_oklch(0.65_0.26_295/0.4)] mb-5 group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

function Capabilities() {
  const items = [
    { icon: Headphones, title: "Customer Support", desc: "Instantly resolve common questions and hand off complex cases to humans." },
    { icon: CalendarCheck, title: "Appointment Booking", desc: "Check availability and confirm bookings straight into your calendar." },
    { icon: HelpCircle, title: "FAQ Automation", desc: "Answer thousands of repetitive questions with brand-perfect responses." },
    { icon: UserPlus, title: "Lead Collection", desc: "Qualify visitors, capture details, and sync leads to your CRM." },
    { icon: ShoppingBag, title: "Product Recommendations", desc: "Suggest the right product based on intent, history, and preferences." },
    { icon: Package, title: "Order Tracking", desc: "Give customers real-time status updates without waiting for support." },
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
            <Sparkles className="h-3 w-3 text-purple-400" />
            <span className="text-xs font-medium">Capabilities</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient">What can an AI chatbot do?</h2>
          <p className="mt-4 text-muted-foreground">
            One AI assistant, endless jobs. Deploy in days and start saving time from day one.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <FeatureCard key={it.title} icon={it.icon} title={it.title} desc={it.desc} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Industries ---------- */
function Industries() {
  const items = [
    { icon: Utensils, title: "Restaurants", desc: "Take reservations and answer menu questions instantly." },
    { icon: Stethoscope, title: "Clinics", desc: "Schedule appointments and triage patient inquiries." },
    { icon: Hotel, title: "Hotels", desc: "Handle bookings, upgrades, and concierge requests." },
    { icon: Home, title: "Real Estate", desc: "Qualify buyers and book property viewings 24/7." },
    { icon: ShoppingBag, title: "E-commerce", desc: "Recommend products and recover abandoned carts." },
    { icon: GraduationCap, title: "Education", desc: "Guide students through admissions and coursework." },
    { icon: Scissors, title: "Beauty Salons", desc: "Book appointments and upsell serviceautomatically." },
    { icon: Scale, title: "Law Firms", desc: "Intake new clients and pre-qualify legal cases." },
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
            <Building2 className="h-3 w-3 text-purple-400" />
            <span className="text-xs font-medium">Industries</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient">Industries we serve</h2>
          <p className="mt-4 text-muted-foreground">
            Trained on domain-specific data — tailored to how your industry actually operates.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group gradient-border rounded-2xl p-5 hover:-translate-y-1 hover:shadow-glow transition-all duration-300"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient/15 border border-purple-500/25 group-hover:scale-110 group-hover:bg-brand-gradient/25 transition mb-3">
                <it.icon className="h-5 w-5 text-purple-200" />
              </div>
              <h3 className="text-sm font-semibold mb-1">{it.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Live Conversation Demo (in-view triggered) ---------- */
function LiveDemo() {
  const script: Msg[] = [
    { from: "user", text: "Hi, I'd like to schedule an appointment." },
    { from: "bot", text: "Of course! Which day works best for you?" },
    { from: "user", text: "Tomorrow afternoon." },
    { from: "bot", text: "I've found availability at 3:00 PM. Would you like me to confirm your booking?" },
  ];
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    let cancelled = false;
    const tick = () => {
      if (cancelled || i >= script.length) return;
      const next = script[i];
      if (next.from === "bot") {
        setTyping(true);
        setTimeout(() => {
          if (cancelled) return;
          setTyping(false);
          setMessages((m) => [...m, next]);
          i += 1;
          setTimeout(tick, 900);
        }, 1300);
      } else {
        setMessages((m) => [...m, next]);
        i += 1;
        setTimeout(tick, 1100);
      }
    };
    tick();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return (
    <section id="live-demo" className="relative py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
            <PlayCircle className="h-3 w-3 text-purple-400" />
            <span className="text-xs font-medium">Live Demo</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient">See it in action</h2>
          <p className="mt-4 text-muted-foreground">
            A real conversation between a customer and Agentix — no scripts, no delays.
          </p>
        </div>

        <div ref={containerRef} className="relative gradient-border rounded-3xl overflow-hidden">
          <div className="relative bg-[oklch(0.14_0.03_280/0.85)] backdrop-blur-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient">
                  <Bot className="h-5 w-5 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#0b0b18]" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Agentix Assistant</p>
                  <p className="text-[11px] text-emerald-300 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live · Responding in real time
                  </p>
                </div>
              </div>
            </div>

            <div className="min-h-[380px] px-6 py-6 space-y-3 flex flex-col justify-end">
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35 }}
                    className={`flex items-end gap-2 ${m.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {m.from === "bot" && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gradient shrink-0">
                        <Bot className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.from === "user"
                          ? "bg-brand-gradient text-white rounded-br-sm shadow-[0_0_20px_oklch(0.65_0.26_295/0.4)]"
                          : "glass-strong rounded-bl-sm"
                      }`}
                    >
                      {m.text}
                    </div>
                    {m.from === "user" && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 border border-white/10 shrink-0">
                        <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {typing && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-end gap-2"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gradient shrink-0">
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="glass-strong rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                      {[0, 1, 2].map((d) => (
                        <motion.span
                          key={d}
                          className="h-1.5 w-1.5 rounded-full bg-purple-300"
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                          transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- How It Works ---------- */
function HowItWorks() {
  const steps = [
    { icon: Search, title: "Understand Your Business", desc: "We map your workflows, tone of voice, and top customer questions." },
    { icon: Brain, title: "Train Your AI", desc: "We fine-tune the model on your knowledge base, docs, and past conversations." },
    { icon: Settings, title: "Connect Your Systems", desc: "We integrate calendars, CRMs, messaging apps, and internal tools." },
    { icon: Rocket, title: "Launch & Optimize", desc: "Go live in days and continuously improve from real conversations." },
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
            <Cpu className="h-3 w-3 text-purple-400" />
            <span className="text-xs font-medium">How it works</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient">From idea to live in days</h2>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-4 bottom-4 w-px bg-gradient-to-b from-purple-500/50 via-blue-500/40 to-transparent" />
          <div className="space-y-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex gap-6 items-start"
              >
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow shrink-0">
                  <s.icon className="h-6 w-6 text-white" />
                  <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#0b0b18] border border-purple-400/40 text-[11px] font-semibold text-purple-200">
                    {i + 1}
                  </span>
                </div>
                <div className="flex-1 gradient-border rounded-2xl p-5">
                  <h3 className="text-lg font-semibold mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
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
    { i: Mail, l: "Gmail" },
    { i: Calendar, l: "Google Calendar" },
    { i: Sparkles, l: "HubSpot" },
    { i: Zap, l: "Salesforce" },
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient">Works with your existing tools</h2>
          <p className="mt-4 text-muted-foreground">
            Deploy across the channels your customers already use.
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

/* ---------- Why Choose (comparison) ---------- */
function WhyChoose() {
  const rows = [
    { t: "Limited hours", a: "24/7 support", ti: Clock, ai: InfinityIcon },
    { t: "Slow replies", a: "Instant responses", ti: Clock, ai: Zap },
    { t: "One customer at a time", a: "Unlimited conversations", ti: Users, ai: InfinityIcon },
    { t: "High staffing costs", a: "Lower operating costs", ti: Users, ai: Sparkles },
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient">Why businesses choose Agentix</h2>
          <p className="mt-4 text-muted-foreground">
            The gap between traditional support and an AI-powered assistant.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-8 border border-white/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                <Clock className="h-5 w-5 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-muted-foreground">Traditional Support</h3>
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
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-brand-gradient">Agentix AI Chatbot</h3>
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

/* ---------- FAQ ---------- */
function FAQ() {
  const faqs = [
    { q: "How long does deployment take?", a: "Most Agentix chatbots go live within 5–10 business days, depending on the complexity of your workflows and integrations." },
    { q: "Can the chatbot speak my brand's voice?", a: "Yes. We fine-tune tone, style, and vocabulary on your existing content so every response feels on-brand." },
    { q: "Which languages are supported?", a: "Agentix supports 50+ languages out of the box, with automatic detection and multilingual conversations." },
    { q: "What happens when the AI can't answer?", a: "The bot escalates gracefully to a human agent with full conversation context — no repeating questions." },
    { q: "Is my customer data secure?", a: "All data is encrypted in transit and at rest. We're SOC 2 aligned and support region-specific data residency." },
    { q: "Can it integrate with my CRM?", a: "Yes — HubSpot, Salesforce, Zoho, Pipedrive, and 50+ others are supported natively." },
  ];

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
            <HelpCircle className="h-3 w-3 text-purple-400" />
            <span className="text-xs font-medium">FAQ</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient">Frequently asked questions</h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="gradient-border rounded-2xl px-6 border-none"
            >
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline py-5">
                <span className="flex items-center gap-3">
                  <ChevronDown className="h-4 w-4 text-purple-300 shrink-0" />
                  {f.q}
                </span>
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
function FinalCTA() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-purple-600/25 blur-[140px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[700px] rounded-full bg-blue-600/20 blur-[140px]" />
      </div>
      <Particles count={20} />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative gradient-border rounded-3xl p-12 sm:p-16 text-center shadow-glow"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-brand-gradient opacity-25 blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="text-gradient">Ready to automate your</span>
              <br />
              <span className="text-brand-gradient">customer conversations?</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
              Book a free demo and discover how an AI chatbot can save time, reduce costs,
              and improve customer satisfaction.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function AIChatbotsPage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <Industries />
      <LiveDemo />
      <HowItWorks />
      <Integrations />
      <WhyChoose />
      <FAQ />
      <FinalCTA />
    </>
  );
}
