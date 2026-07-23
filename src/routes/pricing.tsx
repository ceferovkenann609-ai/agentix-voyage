import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Agentix" },
      { name: "description", content: "Transparent pricing for Agentix AI agents. Choose a plan or estimate your ROI." },
      { property: "og:title", content: "Pricing — Agentix" },
      { property: "og:description", content: "Transparent pricing for Agentix AI agents." },
    ],
  }),
  component: PricingPage,
});

const tiers = [
  {
    name: "Starter",
    price: "$490",
    cadence: "/mo",
    desc: "For small teams launching their first AI agent.",
    features: [
      "1 AI agent (chat)",
      "Up to 2,000 conversations / mo",
      "Email & chat support",
      "Standard integrations",
    ],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$1,490",
    cadence: "/mo",
    desc: "For growing teams automating support and sales.",
    features: [
      "Up to 3 AI agents (chat + voice)",
      "20,000 conversations / mo",
      "CRM & workflow integrations",
      "Priority support",
      "Custom training on your data",
    ],
    cta: "Book a Demo",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    desc: "For enterprises with complex, high-volume needs.",
    features: [
      "Unlimited agents & volume",
      "Dedicated success manager",
      "SLA, SSO & advanced security",
      "Custom AI models & integrations",
      "On-prem / private cloud options",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

function PricingPage() {
  const [conversations, setConversations] = useState(5000);
  const [agentSalary, setAgentSalary] = useState(2500);
  const [agentsReplaced, setAgentsReplaced] = useState(3);

  const monthlySavings = useMemo(() => {
    const humanCost = agentSalary * agentsReplaced;
    const aiCost = Math.min(1490 + Math.max(0, conversations - 20000) * 0.05, 8000);
    return Math.max(0, humanCost - aiCost);
  }, [conversations, agentSalary, agentsReplaced]);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-16 text-center">
        <p className="uppercase tracking-[6px] text-cyan-400 font-semibold">Pricing</p>
        <h1 className="mt-6 text-5xl md:text-6xl font-bold">Simple, transparent pricing</h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-400">
          Start small, scale as you grow. Every plan includes onboarding, training on your data, and ongoing optimization.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-3xl border p-8 backdrop-blur-xl transition ${
                t.highlight
                  ? "border-cyan-400/50 bg-gradient-to-b from-cyan-500/10 to-zinc-900/70 shadow-[0_0_60px_oklch(0.82_0.15_210/0.25)]"
                  : "border-zinc-800 bg-zinc-900/70 hover:border-zinc-700"
              }`}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-cyan-500 px-3 py-1 text-xs font-bold text-black">
                  <Sparkles className="h-3 w-3" /> Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold">{t.name}</h3>
              <p className="mt-2 text-zinc-400 text-sm">{t.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold">{t.price}</span>
                <span className="text-zinc-400">{t.cadence}</span>
              </div>
              <ul className="mt-8 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-zinc-300">
                    <Check className="mt-0.5 h-4 w-4 text-cyan-400 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={t.name === "Enterprise" ? "/contact" : "/book-demo"}
                className={`mt-8 block text-center rounded-xl p-4 font-bold transition ${
                  t.highlight
                    ? "bg-cyan-500 hover:bg-cyan-400 text-black"
                    : "border border-zinc-700 hover:border-cyan-400"
                }`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-10">
          <div className="text-center">
            <p className="uppercase tracking-[6px] text-cyan-400 font-semibold text-sm">ROI Calculator</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold">Estimate your monthly savings</h2>
            <p className="mt-3 text-zinc-400">Move the sliders to match your business.</p>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-8">
            <Slider
              label="Monthly conversations"
              value={conversations}
              min={500}
              max={50000}
              step={500}
              onChange={setConversations}
              format={(v) => v.toLocaleString()}
            />
            <Slider
              label="Avg. agent salary ($ / mo)"
              value={agentSalary}
              min={500}
              max={8000}
              step={100}
              onChange={setAgentSalary}
              format={(v) => `$${v.toLocaleString()}`}
            />
            <Slider
              label="Agents replaced"
              value={agentsReplaced}
              min={1}
              max={20}
              step={1}
              onChange={setAgentsReplaced}
              format={(v) => v.toString()}
            />
          </div>

          <div className="mt-10 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-8 text-center">
            <p className="text-zinc-300">Estimated monthly savings with Agentix</p>
            <p className="mt-2 text-5xl font-extrabold text-cyan-300">
              ${monthlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <Link
              to="/book-demo"
              className="mt-6 inline-block rounded-xl bg-cyan-500 hover:bg-cyan-400 transition px-6 py-3 font-bold text-black"
            >
              Book Free Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline">
        <label className="text-sm text-zinc-400">{label}</label>
        <span className="font-bold text-cyan-300">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-cyan-400"
      />
    </div>
  );
}
