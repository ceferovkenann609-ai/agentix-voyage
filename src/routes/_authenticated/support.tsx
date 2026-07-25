import { createFileRoute, Link } from "@tanstack/react-router";
import { LifeBuoy, Mail, MessageSquare, BookOpen, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/_authenticated/support")({
  head: () => ({
    meta: [
      { title: "Support — Agentix" },
      { name: "description", content: "Get help from the Agentix team." },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  const cards = [
    {
      icon: MessageSquare,
      title: "Live chat",
      desc: "Chat with our team in real time from the Agentix widget.",
      cta: "Open chat",
      to: "/" as const,
    },
    {
      icon: Mail,
      title: "Email support",
      desc: "Reach us at support@agentix.ai — we reply within a few hours.",
      cta: "Contact us",
      to: "/contact" as const,
    },
    {
      icon: BookOpen,
      title: "Documentation",
      desc: "Guides, API references and playbooks for every service.",
      cta: "Browse services",
      to: "/services" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-[#07090C] text-white pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <LifeBuoy className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="uppercase tracking-[6px] text-cyan-400 font-semibold text-xs">SUPPORT</p>
            <h1 className="text-3xl font-bold">How can we help?</h1>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {cards.map((c) => (
            <div key={c.title} className="glass rounded-2xl p-6 flex flex-col">
              <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <c.icon className="h-5 w-5 text-cyan-300" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground flex-1">{c.desc}</p>
              <Link
                to={c.to}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
              >
                {c.cta} <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold">Frequently asked</h2>
          <div className="mt-4 divide-y divide-white/5">
            {[
              { q: "How fast do you respond?", a: "Live chat within minutes during business hours, email under 4 hours." },
              { q: "Can I request a custom integration?", a: "Yes — book a demo and our team will scope it with you." },
              { q: "Do you offer enterprise SLAs?", a: "Enterprise plans include 24/7 support and a 99.9% uptime SLA." },
            ].map((f) => (
              <div key={f.q} className="py-4">
                <p className="font-medium">{f.q}</p>
                <p className="mt-1 text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
