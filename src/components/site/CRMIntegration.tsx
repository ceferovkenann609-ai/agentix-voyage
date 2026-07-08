import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, DollarSign, Activity as ActivityIcon, FileText, Database, RefreshCw, Zap, ShieldCheck, Layers } from "lucide-react";
import { ServiceHero, ServiceFeatureGrid, ServiceCTA } from "./ServicePageShell";

type ActivityItem = { id: number; type: "call" | "email" | "note" | "deal"; text: string; time: string };

const ACTIVITIES: Omit<ActivityItem, "id" | "time">[] = [
  { type: "email", text: "Sent proposal follow-up" },
  { type: "call", text: "Discovery call · 32 min" },
  { type: "note", text: "Champion identified: VP Ops" },
  { type: "deal", text: "Stage moved → Negotiation" },
  { type: "email", text: "Received signed NDA" },
  { type: "call", text: "Demo scheduled for Friday" },
];

function CRMDashboard() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [dealStage, setDealStage] = useState(2);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    let counter = 0;
    let idx = 0;

    const push = () => {
      const template = ACTIVITIES[idx % ACTIVITIES.length];
      idx++;
      setSyncing(true);
      setTimeout(() => setSyncing(false), 700);
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      setActivities((a) => [{ ...template, id: counter++, time }, ...a].slice(0, 5));
      if (template.type === "deal") setDealStage((s) => Math.min(4, s + 1));
    };

    push();
    const int = setInterval(push, 2200);
    return () => clearInterval(int);
  }, []);

  const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won"];
  const iconFor = (t: ActivityItem["type"]) =>
    t === "email" ? Mail : t === "call" ? Phone : t === "deal" ? DollarSign : FileText;

  return (
    <div className="relative w-full max-w-[560px] mx-auto">
      <div className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-brand-gradient opacity-25 blur-3xl" />
      <div className="relative gradient-border rounded-3xl overflow-hidden">
        <div className="relative bg-[oklch(0.14_0.03_280/0.85)] backdrop-blur-xl p-6">
          {/* Contact header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white font-bold">
              AM
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold flex items-center gap-2">
                Alex Morgan
                <motion.span
                  animate={{ opacity: syncing ? 1 : 0.5, rotate: syncing ? 360 : 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <RefreshCw className="h-3 w-3 text-emerald-300" />
                </motion.span>
              </p>
              <p className="text-[11px] text-muted-foreground">VP Operations · Northwind Inc.</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Deal</p>
              <p className="text-sm font-bold text-emerald-300">$48,200</p>
            </div>
          </div>

          {/* Pipeline */}
          <div className="mb-5">
            <div className="flex justify-between text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">
              {stages.map((s, i) => (
                <span key={s} className={i === dealStage ? "text-purple-300 font-semibold" : ""}>{s}</span>
              ))}
            </div>
            <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(dealStage / (stages.length - 1)) * 100}%` }}
                transition={{ duration: 0.6 }}
                className="absolute inset-y-0 left-0 bg-brand-gradient"
              />
            </div>
          </div>

          {/* Two column */}
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-2 space-y-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Details</p>
              {[
                { icon: Mail, label: "alex@northwind.co" },
                { icon: Phone, label: "+1 (415) 555 0142" },
                { icon: User, label: "Champion" },
              ].map((d) => (
                <div key={d.label} className="glass-strong rounded-lg px-2.5 py-2 flex items-center gap-2">
                  <d.icon className="h-3 w-3 text-purple-300 shrink-0" />
                  <span className="text-[11px] truncate">{d.label}</span>
                </div>
              ))}
            </div>

            <div className="col-span-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Activity Timeline</p>
              <div className="space-y-1.5 min-h-[160px]">
                <AnimatePresence initial={false}>
                  {activities.map((a) => {
                    const Icon = iconFor(a.type);
                    return (
                      <motion.div
                        key={a.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-start gap-2 rounded-lg glass-strong px-2.5 py-1.5"
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-gradient shrink-0">
                          <Icon className="h-3 w-3 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] truncate">{a.text}</p>
                          <p className="text-[9px] text-muted-foreground">{a.time}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CRMIntegrationPage() {
  return (
    <>
      <ServiceHero
        eyebrow="CRM Integration"
        title="Every Conversation"
        gradientTitle="Auto-Synced"
        tail="To Your CRM"
        description="Agentix writes every call, chat, and email straight into Salesforce, HubSpot, Zoho, or Pipedrive — with fields, notes, tasks, and stages updated in real time."
        badges={["50+ CRMs", "Real-time sync", "Zero data entry"]}
        demo={<CRMDashboard />}
      />
      <ServiceFeatureGrid
        eyebrow="Capabilities"
        title="Your CRM, finally up to date"
        subtitle="No more forgotten notes, missed follow-ups, or stale pipelines."
        items={[
          { icon: Database, title: "Native Connectors", desc: "Salesforce, HubSpot, Zoho, Pipedrive, Close, and more." },
          { icon: RefreshCw, title: "Bi-directional Sync", desc: "Changes flow both ways — instantly, without conflicts." },
          { icon: Zap, title: "Auto-enrichment", desc: "Firmographic and social data added on every new contact." },
          { icon: ActivityIcon, title: "Activity Logging", desc: "Every AI interaction becomes a call, note, or task." },
          { icon: Layers, title: "Custom Fields", desc: "Map any AI output to your existing CRM schema." },
          { icon: ShieldCheck, title: "SOC 2 & GDPR", desc: "Enterprise-grade encryption and audit trails." },
        ]}
      />
      <ServiceCTA
        title="Stop losing deals to bad data"
        description="Book a demo and watch Agentix log a live conversation into your CRM in real time."
      />
    </>
  );
}
