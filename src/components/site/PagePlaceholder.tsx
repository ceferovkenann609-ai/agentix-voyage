import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export function PagePlaceholder({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-40 left-10 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-6">
          <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">{eyebrow}</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-gradient">{title}</h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            to="/book-demo"
            className="group inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-glow hover:-translate-y-0.5 transition"
          >
            {t("common.bookDemo")} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl glass-strong px-6 py-3.5 text-sm font-semibold hover:bg-white/10 transition"
          >
            {t("nav.home")}
          </Link>
        </div>
      </div>
    </section>
  );
}
