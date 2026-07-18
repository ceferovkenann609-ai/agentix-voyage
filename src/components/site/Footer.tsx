import { Link } from "@tanstack/react-router";
import { Sparkles, Twitter, Linkedin, Github, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#050505] pt-20 pb-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
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
            Agentix biznesiniz üçün 24/7 çalışan AI agentləri hazırlayır. Müştəri dəstəyi,
            satış, marketinq və gündəlik iş proseslərini avtomatlaşdıraraq vaxtınıza və
            xərclərinizə qənaət edir.
            </p>
            <div className="mt-6 flex gap-3">
              {[Twitter, Linkedin, Github, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg glass hover:bg-white/10 transition"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Company"
            links={[
              { to: "/about", label: "Haqqımızda" },
              { to: "/services", label: "Xidmətlər" },
              { to: "/pricing", label: "Qiymətlər" },
              { to: "/contact", label: "Əlaqə" },
            ]}
          />
          <FooterCol
            title="Services"
            links={[
              { to: "/services", label: "AI Çatbotlar" },                                                    

              { to: "/services", label: "Səsli AI" },
              { to: "/services", label: "AI Avtomatlaşdırma" },
              { to: "/services", label: "AI Veb Saytlar" },

              { to: "/services", label: "AI Marketinq" },
              { to: "/services", label: "Fərdi AI Həlləri" },
            ]}
          />
          <FooterCol
            title="Resources"
            links={[
              { to: "/about", label: "Tez-tez verilən suallar" },
              { to: "/about", label: "Bloq" },
              { to: "/about", label: "Məxfilik siyasəti" },
              { to: "/contact", label: "İstifadə şərtləri" },
            ]}
          />
        </div>

        <div className="mt-16 flex flex-col md:flex-row justify-between gap-4 pt-8 border-t border-white/5 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Agentix. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
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
