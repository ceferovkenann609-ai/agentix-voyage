import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Check, PlayCircle } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

function useShellLabels() {
  const { i18n } = useTranslation();
  const isEn = i18n.resolvedLanguage === "en";
  return {
    bookDemo: isEn ? "Book a Demo" : "Demo Sifariş Et",
    contactSales: isEn ? "Contact Sales" : "Satış ilə əlaqə",
    steps: isEn
      ? [
          { number: "01", title: "Business Analysis", text: "We understand your business, goals, and customer journey." },
          { number: "02", title: "AI Configuration", text: "We train and customize your AI agent using your business data." },
          { number: "03", title: "Deployment", text: "Your AI goes live across your website, WhatsApp, social media, and more." },
          { number: "04", title: "Optimization", text: "We continuously improve performance based on real customer interactions." },
        ]
      : [
          { number: "01", title: "Biznes Analizi", text: "Biznesinizi, hədəflərinizi və müştəri səyahətini öyrənirik." },
          { number: "02", title: "AI Konfiqurasiyası", text: "AI agentinizi biznes datanızla təlim edir və fərdiləşdiririk." },
          { number: "03", title: "Yayım", text: "AI-niz vebsayt, WhatsApp, sosial media və digər kanallarda canlı olur." },
          { number: "04", title: "Optimizasiya", text: "Real müştəri qarşılıqlı təsirlərinə əsasən performansı təkmilləşdiririk." },
        ],
  };
}

export function Particles({ count = 24 }: { count?: number }) {
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

export function ServiceHero({
  eyebrow,
  title,
  gradientTitle,
  tail,
  description,
  badges,
  demo,
}: {
  eyebrow: string;
  title: string;
  gradientTitle: string;
  tail?: string;
  description: string;
  badges: string[];
  demo: ReactNode;
}) {
  const L = useShellLabels();
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
            <span className="text-xs font-medium text-muted-foreground">{eyebrow}</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            <span className="text-gradient">{title}</span>
            <br />
            <span className="text-brand-gradient">{gradientTitle}</span>
            {tail && (
              <>
                <br />
                <span className="text-gradient">{tail}</span>
              </>
            )}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">{description}</p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {badges.map((b) => (
              <div key={b} className="inline-flex items-center gap-2 rounded-full glass-strong px-3.5 py-1.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-gradient">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-xs font-medium">{b}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/book-demo"
              className="group inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_oklch(0.65_0.26_295/0.5)] hover:shadow-[0_0_50px_oklch(0.65_0.26_295/0.7)] transition-all hover:-translate-y-0.5"
            >
              Book a Demo <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </Link>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-xl glass-strong px-6 py-3.5 text-sm font-semibold hover:bg-white/10 transition"
            >
              <PlayCircle className="h-4 w-4" /> Contact Sales
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}>
          {demo}
        </motion.div>
      </div>
    </section>
  );
}
export function ServiceFeatureGrid({
  eyebrow,
  title,
  subtitle,
  items,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    desc: string;
  }[];
}) {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
            <Sparkles className="h-3 w-3 text-purple-400" />
            <span className="text-xs font-medium">
              {eyebrow}
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-gradient">
            {title}
          </h2>

          <p className="mt-4 text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {items.map((item, index) => (

            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              className="gradient-border rounded-2xl p-7 hover:shadow-glow transition"
            >

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient">
                <item.icon className="h-5 w-5 text-white" />
              </div>

              <h3 className="text-xl font-semibold mb-3">
                {item.title}
              </h3>

              <p className="text-muted-foreground">
                {item.desc}
              </p>

            </motion.div>

          ))}

        </div>

      </div>
    </section>
  );
}
export function ServiceSolution({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const steps = [
    {
      number: "01",
      title: "Business Analysis",
      text: "We understand your business, goals, and customer journey.",
    },
    {
      number: "02",
      title: "AI Configuration",
      text: "We train and customize your AI agent using your business data.",
    },
    {
      number: "03",
      title: "Deployment",
      text: "Your AI goes live across your website, WhatsApp, social media, and more.",
    },
    {
      number: "04",
      title: "Optimization",
      text: "We continuously improve performance based on real customer interactions.",
    },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-5xl font-bold text-gradient">
            {title}
          </h2>

          <p className="mt-5 text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {steps.map((step) => (

            <div
              key={step.number}
              className="gradient-border rounded-3xl p-8 text-center hover:shadow-glow transition-all duration-300"
            >

              <div className="text-5xl font-bold text-brand-gradient mb-6">
                {step.number}
              </div>

              <h3 className="text-2xl font-semibold mb-4">
                {step.title}
              </h3>

              <p className="text-muted-foreground leading-7">
                {step.text}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export function ServiceCTA({ title, description }: { title: string; description: string }) {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative gradient-border rounded-3xl overflow-hidden p-12 sm:p-16 text-center">
          <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: "var(--gradient-glow)" }} />
          <div className="relative">
            <h2 className="text-4xl sm:text-5xl font-bold text-gradient">{title}</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">{description}</p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-glow hover:shadow-glow-lg transition-all hover:-translate-y-0.5"
              >
                Book a Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl glass-strong px-6 py-3.5 text-sm font-semibold hover:bg-white/10 transition"
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
