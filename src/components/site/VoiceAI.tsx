import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Phone, PhoneOff, Volume2, Headphones, Languages, Clock, Zap, ShieldCheck, PhoneCall } from "lucide-react";
import { ServiceHero, ServiceFeatureGrid, ServiceCTA } from "./ServicePageShell";

type Turn = { from: "user" | "ai"; text: string };

const SCRIPT: Turn[] = [
  { from: "ai", text: "Hi, thanks for calling Agentix. How can I help you today?" },
  { from: "user", text: "I'd like to book a table for four people this Friday at 7 PM." },
  { from: "ai", text: "Absolutely. I have a table for four available at 7 PM this Friday. May I have a name for the reservation?" },
  { from: "user", text: "Sure, it's under Alex Morgan." },
  { from: "ai", text: "Booked! You'll receive a confirmation text shortly. Anything else, Alex?" },
];

const WAVE_HEIGHTS = Array.from({ length: 32 }, (_, i) => 10 + ((i * 17) % 30));
const WAVE_DURATIONS = Array.from({ length: 32 }, (_, i) => 0.5 + ((i * 7) % 4) / 10);

function VoiceDemo() {
  const [active, setActive] = useState(false);
  const [transcript, setTranscript] = useState<Turn[]>([]);
  const [speaking, setSpeaking] = useState<"user" | "ai" | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const start = () => {
    clearTimers();
    setTranscript([]);
    setActive(true);
    let delay = 400;
    SCRIPT.forEach((turn) => {
      timers.current.push(
        setTimeout(() => setSpeaking(turn.from), delay),
        setTimeout(() => {
          setTranscript((t) => [...t, turn]);
          setSpeaking(null);
        }, delay + 1600),
      );
      delay += 2200;
    });
    timers.current.push(setTimeout(() => setActive(false), delay + 400));
  };

  const stop = () => {
    clearTimers();
    setActive(false);
    setSpeaking(null);
  };

  useEffect(() => () => clearTimers(), []);

  return (
    <div className="relative w-full max-w-[520px] mx-auto">
      <div className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-brand-gradient opacity-25 blur-3xl" />
      <div className="relative gradient-border rounded-3xl overflow-hidden">
        <div className="relative bg-[oklch(0.14_0.03_280/0.85)] backdrop-blur-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient">
                <PhoneCall className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">Agentix Voice</p>
                <p className="text-[11px] text-emerald-300 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {active ? "Live call" : "Ready"}
                </p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              {active ? "00:12" : "00:00"}
            </div>
          </div>

          {/* Visualizer */}
          <div className="relative h-40 flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              {[0, 1, 2].map((r) => (
                <motion.div
                  key={r}
                  className="absolute rounded-full border border-purple-400/30"
                  style={{ width: 120 + r * 40, height: 120 + r * 40 }}
                  animate={active ? { scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] } : { scale: 1, opacity: 0.2 }}
                  transition={{ duration: 2, repeat: Infinity, delay: r * 0.4 }}
                />
              ))}
            </div>
            <button
              onClick={active ? stop : start}
              className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-all ${
                active ? "bg-red-500/90 shadow-[0_0_50px_rgb(239_68_68/0.6)]" : "bg-brand-gradient shadow-glow-lg hover:scale-105"
              }`}
              aria-label={active ? "End call" : "Start call"}
            >
              {active ? <PhoneOff className="h-8 w-8 text-white" /> : <Mic className="h-8 w-8 text-white" />}
            </button>
          </div>

          {/* Waveform */}
          <div className="flex items-center justify-center gap-1 h-12 mb-6">
            {WAVE_HEIGHTS.map((height, i) => (
              <motion.span
                key={i}
                className="w-1 rounded-full bg-brand-gradient"
                animate={
                  speaking
                    ? { height: [6, height, 6] }
                    : { height: 6 }
                }
                transition={{ duration: WAVE_DURATIONS[i], repeat: Infinity, delay: i * 0.03 }}
              />
            ))}
          </div>

          {/* Transcript */}
          <div className="h-40 overflow-y-auto space-y-2 pr-1">
            <AnimatePresence initial={false}>
              {transcript.length === 0 && !active && (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Tap the microphone to start a simulated call.
                </p>
              )}
              {transcript.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm rounded-xl px-3 py-2 ${
                    t.from === "ai" ? "glass-strong" : "bg-brand-gradient/20 border border-purple-400/20"
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground mr-2">
                    {t.from === "ai" ? "AI" : "Caller"}
                  </span>
                  {t.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VoiceAIPage() {
  return (
    <>
      <ServiceHero
        eyebrow="Voice AI Agents"
        title="AI Voice Agents"
        gradientTitle="That Sound Human"
        tail="Around the Clock"
        description="Handle inbound and outbound calls with natural-sounding voice agents that book, qualify, and resolve — 24/7, in 30+ languages."
        badges={["Human-like voice", "Sub-second latency", "50+ languages"]}
        demo={<VoiceDemo />}
      />
      <ServiceFeatureGrid
        eyebrow="Capabilities"
        title="What can a voice agent do?"
        subtitle="One agent replaces an entire phone team without the wait times."
        items={[
          { icon: Phone, title: "Inbound Calls", desc: "Greet, route, and resolve callers instantly with zero hold time." },
          { icon: PhoneCall, title: "Outbound Campaigns", desc: "Run reminder, follow-up, and sales calls at scale." },
          { icon: Headphones, title: "Live Handoff", desc: "Escalate to a human seamlessly with full context." },
          { icon: Languages, title: "Multilingual", desc: "Auto-detect and speak 30+ languages fluently." },
          { icon: Volume2, title: "Custom Voice", desc: "Match your brand with cloned or curated voice profiles." },
          { icon: ShieldCheck, title: "Compliant", desc: "SOC2, GDPR, HIPAA-ready with full call recordings." },
        ]}
      />
      <ServiceCTA
        title="Give your phone lines an AI upgrade"
        description="Book a demo and hear an Agentix voice agent trained on your business in under 5 minutes."
      />
    </>
  );
}
