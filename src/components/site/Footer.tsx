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
              AI agents that work around the clock — automating support, sales, scheduling,
              and every workflow that keeps your business moving.
            </p>
            <div className="mt-6 flex gap-3">
              {[Twitter, Linkedin, Github, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
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
              { to: "/about", label: "About" },
              { to: "/services", label: "Careers" },
              { to: "/about", label: "Press" },
              { to: "/contact", label: "Contact" },
            ]}
          />
          <FooterCol
            title="Product"
            links={[
              { to: "/services", label: "Services" },
              { to: "/solutions", label: "Solutions" },
              { to: "/pricing", label: "Pricing" },
              { to: "/demo", label: "Book a Demo" },
            ]}
          />
          <FooterCol
            title="Resources"
            links={[
              { to: "/about", label: "Documentation" },
              { to: "/about", label: "Blog" },
              { to: "/about", label: "Case Studies" },
              { to: "/contact", label: "Support" },
            ]}
          />
        </div>

        <div className="mt-16 flex flex-col md:flex-row justify-between gap-4 pt-8 border-t border-white/5 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Agentix Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Security</a>
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
