import { Link } from "@tanstack/react-router";
import { Sparkles, Twitter, Linkedin, Github, Youtube, Mail, Check, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, type FormEvent } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const currentYear = 2026;

export function Footer() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isAz = i18n.resolvedLanguage === "az";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const onSubscribe = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setStatus("error");
      setErrMsg(isAz ? "Düzgün e-poçt daxil edin." : "Please enter a valid email.");
      return;
    }
    setStatus("loading");
    const { error } = await supabase.from("newsletter_subscribers").insert({
      email: value,
      locale: i18n.resolvedLanguage ?? null,
      source: "footer",
      user_id: user?.id ?? null,
    });
    if (error) {
      if (error.code === "23505") {
        setStatus("success");
        setEmail("");
        return;
      }
      setStatus("error");
      setErrMsg(isAz ? "Xəta baş verdi. Yenidən cəhd edin." : "Something went wrong. Please try again.");
      return;
    }
    setStatus("success");
    setEmail("");
  };

  return (
    <footer className="relative border-t border-white/5 bg-[#07090C] pt-20 pb-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient font-display">Agentix</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
              {t("footer.tagline")}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { Icon: Twitter, label: "Twitter/X" },
                { Icon: Linkedin, label: "LinkedIn" },
                { Icon: Github, label: "GitHub" },
                { Icon: Youtube, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <span
                  key={label}
                  role="link"
                  aria-disabled="true"
                  aria-label={label}
                  title={`${label} profile coming soon`}
                  className="flex h-10 w-10 items-center justify-center rounded-lg glass hover:bg-white/10 transition"
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>

            <div className="mt-6"><LanguageSwitcher /></div>
          </div>

          <FooterCol
            title={t("footer.company")}
            links={[
              { to: "/about", label: t("nav.about") },
              { to: "/services", label: t("nav.services") },
              { to: "/pricing", label: t("nav.pricing") },
              { to: "/contact", label: t("nav.contact") },
            ]}
          />
          <FooterCol
            title={t("footer.servicesCol")}
            links={[
              { to: "/services/ai-chatbots", label: t("footer.chatbots") },
              { to: "/services/voice-ai", label: t("footer.voice") },
              { to: "/services/lead-generation", label: t("home.services.items.leads.t") },
              { to: "/services/customer-support", label: t("home.services.items.support.t") },
              { to: "/services/workflow-automation", label: t("footer.automation") },
              { to: "/services/crm-integration", label: t("home.services.items.crm.t") },
            ]}
          />
          <FooterCol
            title={t("footer.resources")}
            links={[
              { to: "/about", label: t("footer.faq") },
              { to: "/about", label: t("footer.blog") },
              { to: "/privacy", label: t("footer.privacy") },
              { to: "/terms", label: t("footer.terms") },
            ]}
          />
        </div>

        <div className="mt-16 flex flex-col md:flex-row justify-between gap-4 pt-8 border-t border-white/5 text-xs text-muted-foreground">
          <p>© {currentYear} Agentix. {t("footer.rights")}</p>
          <div className="flex gap-6">
            <Link to="/privacy">{t("footer.privacy")}</Link>
            <Link to="/terms">{t("footer.terms")}</Link>
            <span>hello@agentix.ai</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: {
    to:
      | "/"
      | "/services"
      | "/services/ai-chatbots"
      | "/services/voice-ai"
      | "/services/lead-generation"
      | "/services/customer-support"
      | "/services/workflow-automation"
      | "/services/crm-integration"
      | "/solutions"
      | "/pricing"
      | "/about"
      | "/contact"
      | "/privacy"
      | "/terms"
      | "/demo"
      | "/login";
    label: string;
  }[];
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground mb-4">{title}</h4>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={`${l.to}-${l.label}`}>
            <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
