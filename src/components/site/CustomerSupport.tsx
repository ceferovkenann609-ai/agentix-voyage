import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Clock, CheckCircle2, Users, Headphones, Bot, ShieldCheck, Globe, Zap } from "lucide-react";
import { ServiceHero, ServiceFeatureGrid, ServiceCTA } from "./ServicePageShell";

type Chat = {
  id: number;
  customer: string;
  avatar: string;
  question: string;
  answer: string;
  status: "typing" | "answering" | "resolved";
};

const CHATS: Omit<Chat, "id" | "status">[] = [
  { customer: "Sarah", avatar: "SC", question: "Where is my order #48291?", answer: "Your order is out for delivery and will arrive today by 6 PM 📦" },
  { customer: "Marcus", avatar: "MW", question: "Can I change my subscription plan?", answer: "Of course — I've upgraded you to Pro. Prorated invoice sent to your email." },
  { customer: "Priya", avatar: "PP", question: "What's your refund policy?", answer: "We offer full refunds within 30 days. Would you like me to start one?" },
  { customer: "Diego", avatar: "DA", question: "Is the app down?", answer: "All systems are operational ✅ Try clearing cache — happy to walk you through it." },
  { customer: "Emma", avatar: "EW", question: "How do I reset my password?", answer: "I've just sent a reset link to your email. It expires in 15 minutes." },
];

function SupportCenter() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [resolved, setResolved] = useState(1847);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let idCounter = 0;
    let cycle = 0;

    const spawn = () => {
      const template = CHATS[cycle % CHATS.length];
      const id = idCounter++;
      cycle++;
      const chat: Chat = { ...template, id, status: "typing" };
      setChats((c) => [chat, ...c].slice(0, 4));
      setActive((a) => a + 1);

      setTimeout(() => setChats((c) => c.map((x) => (x.id === id ? { ...x, status: "answering" } : x))), 1200);
      setTimeout(() => {
        setChats((c) => c.map((x) => (x.id === id ? { ...x, status: "resolved" } : x)));
        setResolved((r) => r + 1);
        setActive((a) => Math.max(0, a - 1));
      }, 2800);
    };

    spawn();
    const int = setInterval(spawn, 2000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="relative w-full max-w-[560px] mx-auto">
      <div className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-brand-gradient opacity-25 blur-3xl" />
      <div className="relative gradient-border rounded-3xl overflow-hidden">
        <div className="relative bg-[oklch(0.14_0.03_280/0.85)] backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold">Support Center</p>
              <p className="text-[11px] text-emerald-300 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> {active} active conversations
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="glass-strong rounded-lg px-2.5 py-1">
                <span className="text-muted-foreground">Avg</span> <span className="font-semibold">1.2s</span>
              </div>
              <div className="glass-strong rounded-lg px-2.5 py-1">
                <span className="text-muted-foreground">Resolved</span> <motion.span key={resolved} initial={{ color: "#6ee7b7" }} animate={{ color: "#fff" }} className="font-semibold">{resolved}</motion.span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {chats.map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  className="glass-strong rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-xs font-bold text-white shrink-0">
                      {c.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold">{c.customer}</p>
                        <span className={`text-[10px] uppercase tracking-wide flex items-center gap-1 ${
                          c.status === "resolved" ? "text-emerald-300" : c.status === "answering" ? "text-purple-300" : "text-muted-foreground"
                        }`}>
                          {c.status === "resolved" && <CheckCircle2 className="h-3 w-3" />}
                          {c.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{c.question}</p>
                      {c.status === "typing" ? (
                        <div className="flex gap-1">
                          {[0, 1, 2].map((d) => (
                            <motion.span
                              key={d}
                              className="h-1.5 w-1.5 rounded-full bg-purple-300"
                              animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                              transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }}
                            />
                          ))}
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start gap-2 rounded-lg bg-brand-gradient/15 border border-purple-400/20 px-3 py-2"
                        >
                          <Bot className="h-3.5 w-3.5 text-purple-300 mt-0.5 shrink-0" />
                          <p className="text-xs leading-relaxed">{c.answer}</p>
                        </motion.div>
                      )}
                    </div>
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

export default function CustomerSupportPage() {
  return (
    <>
      <ServiceHero
        eyebrow="Customer Support"
        title="Resolve 80% of Tickets"
        gradientTitle="Instantly"
        description="Agentix AI support agents answer thousands of customer questions in parallel — with the tone, accuracy, and empathy of your best rep."
        badges={["1.2s average reply", "50+ languages", "Human handoff"]}
        demo={<SupportCenter />}
      />
      <ServiceFeatureGrid
        eyebrow="Capabilities"
        title="An always-on support team"
        subtitle="Deflect volume, delight customers, and free your agents for what matters."
        items={[
          { icon: MessageCircle, title: "Omnichannel", desc: "Web, WhatsApp, Instagram, email, SMS — one AI, every inbox." },
          { icon: Zap, title: "Instant Answers", desc: "Sub-second responses trained on your help center and policies." },
          { icon: Headphones, title: "Human Handoff", desc: "Escalate to a live agent with full context and transcript." },
          { icon: Globe, title: "Multilingual", desc: "Reply in the customer's language, automatically." },
          { icon: ShieldCheck, title: "Safe & Compliant", desc: "PII redaction, guardrails, and audit logs by default." },
          { icon: Users, title: "Team Assist", desc: "Suggest replies and summarize tickets for human agents." },
        ]}
      />
      <ServiceCTA
        title="Delight customers without the burnout"
        description="Book a demo and see Agentix handle your top 100 tickets in real time."
      />
    </>
  );
}
