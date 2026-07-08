import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Users, Target, Calendar, Zap, Filter, LineChart, Sparkles } from "lucide-react";
import { ServiceHero, ServiceFeatureGrid, ServiceCTA } from "./ServicePageShell";

type Lead = { id: number; name: string; company: string; score: number; source: string };

const NAMES = ["Sarah Chen", "Marcus Weber", "Priya Patel", "Diego Alvarez", "Emma Wilson", "Liam Novak", "Yuki Tanaka", "Amelia Ross", "Noah Kim", "Zara Ahmed"];
const COMPANIES = ["Northwind", "Acme Labs", "Loop Health", "Vertex Retail", "Blueprint", "Kite Studio", "Orbit HR", "Meridian", "Cascade", "Everline"];
const SOURCES = ["Website Chat", "LinkedIn Ad", "WhatsApp", "Instagram", "Cold Email", "Google Ads"];

function useAnimatedNumber(target: number, duration = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let raf = 0;
    const step = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / duration, 1);
      setV(Math.round(target * (0.2 + 0.8 * p)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

function LeadDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [newLeads, setNewLeads] = useState(147);
  const [qualified, setQualified] = useState(89);
  const [meetings, setMeetings] = useState(23);
  const conv = useAnimatedNumber(34);

  useEffect(() => {
    let id = 0;
    const seed: Lead[] = Array.from({ length: 4 }).map(() => ({
      id: id++,
      name: NAMES[Math.floor(Math.random() * NAMES.length)],
      company: COMPANIES[Math.floor(Math.random() * COMPANIES.length)],
      score: 60 + Math.floor(Math.random() * 40),
      source: SOURCES[Math.floor(Math.random() * SOURCES.length)],
    }));
    setLeads(seed);

    const interval = setInterval(() => {
      const newLead: Lead = {
        id: id++,
        name: NAMES[Math.floor(Math.random() * NAMES.length)],
        company: COMPANIES[Math.floor(Math.random() * COMPANIES.length)],
        score: 55 + Math.floor(Math.random() * 45),
        source: SOURCES[Math.floor(Math.random() * SOURCES.length)],
      };
      setLeads((l) => [newLead, ...l].slice(0, 5));
      setNewLeads((n) => n + 1);
      if (newLead.score > 75) setQualified((q) => q + 1);
      if (Math.random() > 0.7) setMeetings((m) => m + 1);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "New Leads", value: newLeads, icon: Users, color: "from-purple-500 to-blue-500" },
    { label: "Qualified", value: qualified, icon: Target, color: "from-blue-500 to-cyan-500" },
    { label: "Meetings", value: meetings, icon: Calendar, color: "from-cyan-500 to-emerald-500" },
    { label: "Conv. %", value: conv, icon: TrendingUp, color: "from-emerald-500 to-purple-500" },
  ];

  return (
    <div className="relative w-full max-w-[560px] mx-auto">
      <div className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-brand-gradient opacity-25 blur-3xl" />
      <div className="relative gradient-border rounded-3xl overflow-hidden">
        <div className="relative bg-[oklch(0.14_0.03_280/0.85)] backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold">Lead Pipeline</p>
              <p className="text-[11px] text-emerald-300 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
              </p>
            </div>
            <LineChart className="h-4 w-4 text-purple-300" />
          </div>

          <div className="grid grid-cols-4 gap-2 mb-5">
            {stats.map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-strong rounded-xl p-3"
              >
                <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-2`}>
                  <s.icon className="h-3.5 w-3.5 text-white" />
                </div>
                <motion.p key={s.value} initial={{ scale: 1.2, color: "#c4b5fd" }} animate={{ scale: 1, color: "#fff" }} className="text-lg font-bold">
                  {s.value}
                </motion.p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">Incoming leads</p>
            <AnimatePresence initial={false}>
              {leads.map((l) => (
                <motion.div
                  key={l.id}
                  layout
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3 rounded-xl glass-strong px-3 py-2.5"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-white">
                    {l.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{l.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{l.company} · {l.source}</p>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-0.5 rounded-md ${l.score > 80 ? "bg-emerald-500/20 text-emerald-300" : l.score > 65 ? "bg-purple-500/20 text-purple-300" : "bg-white/10 text-muted-foreground"}`}>
                    {l.score}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LeadGenerationPage() {
  return (
    <>
      <ServiceHero
        eyebrow="Lead Generation"
        title="Fill Your Pipeline"
        gradientTitle="On Autopilot"
        description="Agentix AI qualifies, scores, and books meetings with your best-fit leads across every channel — 24/7, without a single missed reply."
        badges={["AI qualification", "CRM sync", "24/7 outreach"]}
        demo={<LeadDashboard />}
      />
      <ServiceFeatureGrid
        eyebrow="Capabilities"
        title="A tireless SDR that never sleeps"
        subtitle="From first touch to booked meeting — automated end to end."
        items={[
          { icon: Filter, title: "Smart Qualification", desc: "Ask the right questions and score intent in real time." },
          { icon: Zap, title: "Instant Response", desc: "Reply in under 30 seconds across chat, email, and ads." },
          { icon: Target, title: "Multi-channel Outreach", desc: "Website, WhatsApp, Instagram, LinkedIn — one agent." },
          { icon: Calendar, title: "Meeting Booking", desc: "Book straight into your rep's calendar with reminders." },
          { icon: LineChart, title: "Pipeline Analytics", desc: "See conversion, sources, and revenue attribution live." },
          { icon: Sparkles, title: "CRM Enrichment", desc: "Auto-enrich contacts with firmographic data." },
        ]}
      />
      <ServiceCTA
        title="Turn every visitor into revenue"
        description="Book a demo and see how Agentix can 3x your qualified pipeline in 30 days."
      />
    </>
  );
}
