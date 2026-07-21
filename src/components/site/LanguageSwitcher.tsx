import { useTranslation } from "react-i18next";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith("en") ? "en" : "az";

  return (
    <div
      role="group"
      aria-label="Language"
      className={`inline-flex items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.03] p-0.5 ${className}`}
    >
      {(["az", "en"] as const).map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => i18n.changeLanguage(lng)}
          aria-pressed={current === lng}
          className={`px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full transition ${
            current === lng
              ? "bg-brand-gradient text-white shadow-[0_0_20px_oklch(0.82_0.15_210/0.4)]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {lng}
        </button>
      ))}
    </div>
  );
}
