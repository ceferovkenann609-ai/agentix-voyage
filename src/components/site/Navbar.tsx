import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const nav = [
    { to: "/", label: t("nav.home") },
    { to: "/services", label: t("nav.services") },
    { to: "/solutions", label: t("nav.solutions") },
    { to: "/pricing", label: t("nav.pricing") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ] as const;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={`glass-strong flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 ${
            scrolled ? "shadow-[0_8px_40px_oklch(0.82_0.15_210/0.15)]" : ""
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient glow">
              <Sparkles className="h-5 w-5 text-white" />
              <div className="absolute inset-0 rounded-xl bg-brand-gradient opacity-50 blur-lg group-hover:opacity-80 transition" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gradient font-display">
              Agentix
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: true }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              to="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3"
            >
              {t("nav.login")}
            </Link>
            <Link
              to="/book-demo"
              className="relative inline-flex items-center rounded-xl bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_oklch(0.82_0.15_210/0.4)] hover:shadow-[0_0_45px_oklch(0.82_0.15_210/0.6)] transition-all hover:-translate-y-0.5"
            >
              {t("nav.bookDemo")}
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg glass"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden mt-2 glass-strong rounded-2xl p-4 animate-fade-in">
            <nav className="flex flex-col gap-1">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-white/5"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-white/10">
                <div className="px-2 py-2"><LanguageSwitcher /></div>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-white/5"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/book-demo"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-sm font-semibold text-center rounded-lg bg-brand-gradient text-white"
                >
                  {t("nav.bookDemo")}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
