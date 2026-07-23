import { Link } from "@tanstack/react-router";
import { ArrowRight, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

export type LegalSection = { heading: string; body: string[] };

export function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  sections,
  contactLabel,
  contactEmail = "hello@agentix.ai",
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
  contactLabel: string;
  contactEmail?: string;
}) {
  const { t } = useTranslation();

  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-32 left-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-6">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">{eyebrow}</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gradient font-display">
            {title}
          </h1>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {intro}
          </p>
          <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground/70">
            {updated}
          </p>
        </div>

        <div className="mt-16 space-y-6">
          {sections.map((s, i) => (
            <article
              key={s.heading}
              className="glass rounded-2xl border border-white/5 p-6 sm:p-8 hover:border-cyan-400/20 transition"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-sm font-semibold text-white">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-semibold">{s.heading}</h2>
                  <div className="mt-3 space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {s.body.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 glass-strong rounded-2xl border border-cyan-400/20 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{contactLabel}</p>
                <a href={`mailto:${contactEmail}`} className="text-base font-semibold hover:text-cyan-300 transition">
                  {contactEmail}
                </a>
              </div>
            </div>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-5 py-3 text-sm font-semibold text-white shadow-glow hover:-translate-y-0.5 transition"
            >
              {t("nav.contact")}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
