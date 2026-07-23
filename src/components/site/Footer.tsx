import { Link } from "@tanstack/react-router";
import { Sparkles, Twitter, Linkedin, Github, Youtube } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Footer() {
  const { t } = useTranslation();
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
                { Icon: Twitter, href: "https://twitter.com/agentix", label: "Twitter" },
                { Icon: Linkedin, href: "https://linkedin.com/company/agentix", label: "LinkedIn" },
                { Icon: Github, href: "https://github.com/agentix", label: "GitHub" },
                { Icon: Youtube, href: "https://youtube.com/@agentix", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg glass hover:bg-white/10 transition"
                >
                  <Icon className="h-4 w-4" />
                </a>
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
              { to: "/services", label: t("footer.chatbots") },
              { to: "/services", label: t("footer.voice") },
              { to: "/services", label: t("footer.automation") },
              { to: "/services", label: t("footer.websites") },
              { to: "/services", label: t("footer.marketing") },
              { to: "/services", label: t("footer.custom") },
            ]}
          />
          <FooterCol
            title={t("footer.resources")}
            links={[
              { to: "/about", label: t("footer.faq") },
              { to: "/about", label: t("footer.blog") },
              { to: "/about", label: t("footer.privacy") },
              { to: "/contact", label: t("footer.terms") },
            ]}
          />
        </div>

        <div className="mt-16 flex flex-col md:flex-row justify-between gap-4 pt-8 border-t border-white/5 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Agentix. {t("footer.rights")}</p>
          <div className="flex gap-6">
            <a href="#">{t("footer.privacy")}</a>
            <a href="#">{t("footer.terms")}</a>
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
  links: { to: "/" | "/services" | "/solutions" | "/pricing" | "/about" | "/contact" | "/demo" | "/login"; label: string }[];
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground mb-4">{title}</h4>
      <ul className="space-y-3">
        {links.map((l, i) => (
          <li key={i}>
            <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
