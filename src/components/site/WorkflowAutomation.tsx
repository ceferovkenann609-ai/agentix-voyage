import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Brain, Database, Bell, CheckCircle2, GitBranch, Workflow, Zap, Layers, Cpu, ShieldCheck } from "lucide-react";
import { ServiceHero, ServiceFeatureGrid, ServiceCTA } from "./ServicePageShell";

const STEPS = [
  { icon: Mail, label: "Email Received", color: "from-purple-500 to-blue-500" },
  { icon: Brain, label: "AI Analysis", color: "from-blue-500 to-cyan-500" },
  { icon: Database, label: "CRM Updated", color: "from-cyan-500 to-emerald-500" },
  { icon: Bell, label: "Notification Sent", color: "from-emerald-500 to-purple-500" },
  { icon: CheckCircle2, label: "Task Completed", color: "from-purple-500 to-pink-500" },
];

function WorkflowDemo() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const int = setInterval(() => setActive((a) => (a + 1) % (STEPS.length + 1)), 1300);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="relative w-full max-w-[560px] mx-auto">
      <div className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-brand-gradient opacity-25 blur-3xl" />
      <div className="relative gradient-border rounded-3xl overflow-hidden">
        <div className="relative bg-[oklch(0.14_0.03_280/0.85)] backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold">Workflow Runner</p>
              <p className="text-[11px] text-emerald-300 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Running · 12,458 runs today
              </p>
            </div>
            <Workflow className="h-4 w-4 text-purple-300" />
          </div>

          <div className="space-y-3">
            {STEPS.map((s, i) => {
              const isActive = i < active;
              const isCurrent = i === active - 1;
              return (
                <div key={s.label}>
                  <motion.div
                    animate={{
                      scale: isCurrent ? 1.02 : 1,
                      opacity: isActive ? 1 : 0.4,
                    }}
                    className="flex items-center gap-4 glass-strong rounded-xl p-3.5 relative overflow-hidden"
                  >
                    {isCurrent && (
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"
                      />
                    )}
                    <motion.div
                      animate={isCurrent ? { rotate: [0, 360] } : {}}
                      transition={{ duration: 1.2, ease: "linear" }}
                      className={`relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} shrink-0`}
                    >
                      <s.icon className="h-4.5 w-4.5 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{s.label}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {isActive ? (isCurrent ? "Running…" : "Completed") : "Waiting"}
                      </p>
                    </div>
                    {isActive && !isCurrent && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                  </motion.div>
                  {i < STEPS.length - 1 && (
                    <div className="flex justify-center my-1">
                      <motion.div
                        className="h-6 w-px bg-gradient-to-b from-purple-400/60 to-transparent"
                        animate={{ opacity: i < active - 1 ? 1 : 0.2 }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkflowAutomationPage() {
  return (
    <>
      <ServiceHero
        eyebrow="Workflow Automation"
        title="Automate Any Process"
        gradientTitle="With AI Agents"
        description="Chain multi-step business workflows across your tools. Agentix agents read, decide, and act — moving work from inbox to completion, automatically."
        badges={["No-code triggers", "500+ integrations", "Human-in-the-loop"]}
        demo={<WorkflowDemo />}
      />
      <ServiceFeatureGrid
        eyebrow="Capabilities"
        title="Every workflow, automated"
        subtitle="From simple triggers to end-to-end multi-agent processes."
        items={[
          { icon: GitBranch, title: "Conditional Logic", desc: "Branch, loop, and route based on AI-analyzed content." },
          { icon: Cpu, title: "AI Decision Steps", desc: "Let agents classify, extract, and decide in every run." },
          { icon: Layers, title: "500+ Integrations", desc: "Slack, Notion, HubSpot, Stripe, Google Workspace, and more." },
          { icon: Zap, title: "Real-time Triggers", desc: "Webhooks, schedules, emails, forms — anything starts a run." },
          { icon: ShieldCheck, title: "Audit & Retry", desc: "Every step logged, retriable, and observable." },
          { icon: Workflow, title: "Human-in-the-loop", desc: "Pause for approvals when the stakes are high." },
        ]}
      />
      <ServiceCTA
        title="Move work forward on its own"
        description="Book a demo and we'll map your busiest workflow to an Agentix agent in minutes."
      />
    </>
  );
}
