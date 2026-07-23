import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Sparkles, LayoutDashboard, User, LogOut, ClipboardList } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function Navbar() {
  const { t, i18n } = useTranslation();
  const isAz = i18n.resolvedLanguage !== "en";
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!user) { setAvatarUrl(null); setFullName(""); return; }
    (async () => {
      const { data } = await supabase.from("profiles").select("full_name,avatar_url").eq("id", user.id).maybeSingle();
      setFullName(data?.full_name ?? "");
      if (data?.avatar_url) {
        const { data: signed } = await supabase.storage.from("avatars").createSignedUrl(data.avatar_url, 60 * 60);
        setAvatarUrl(signed?.signedUrl ?? null);
      } else {
        setAvatarUrl(null);
      }
    })();
  }, [user]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const initial = (fullName || user?.email || "?").charAt(0).toUpperCase();

  const handleSignOut = async () => {
    setMenuOpen(false);
    setOpen(false);
    await signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}
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
            <span className="text-xl font-bold tracking-tight text-gradient font-display">Agentix</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
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

          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient overflow-hidden text-sm font-bold text-white"
                  aria-label="Account menu"
                >
                  {avatarUrl ? <img src={avatarUrl} alt="" className="h-full w-full object-cover" /> : initial}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass-strong rounded-2xl p-2 shadow-2xl">
                    <div className="px-3 py-3 border-b border-white/10">
                      <div className="font-semibold truncate">{fullName || (isAz ? "İstifadəçi" : "User")}</div>
                      <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    </div>
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-white/5">
                      <LayoutDashboard className="h-4 w-4" /> {isAz ? "İdarə paneli" : "Dashboard"}
                    </Link>
                    <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-white/5">
                      <User className="h-4 w-4" /> {isAz ? "Profil" : "Profile"}
                    </Link>
                    <Link to="/history" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-white/5">
                      <ClipboardList className="h-4 w-4" /> {isAz ? "Tarixçə" : "History"}
                    </Link>
                    <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-white/5 text-red-400">
                      <LogOut className="h-4 w-4" /> {isAz ? "Çıxış" : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3"
              >
                {t("nav.login")}
              </Link>
            )}
            <Link
              to="/book-demo"
              className="relative inline-flex items-center rounded-xl bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_oklch(0.82_0.15_210/0.4)] hover:shadow-[0_0_45px_oklch(0.82_0.15_210/0.6)] transition-all hover:-translate-y-0.5"
            >
              {t("nav.bookDemo")}
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg glass"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden mt-2 glass-strong rounded-2xl p-4 animate-fade-in">
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
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setOpen(false)} className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-white/5">
                      {isAz ? "İdarə paneli" : "Dashboard"}
                    </Link>
                    <Link to="/profile" onClick={() => setOpen(false)} className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-white/5">
                      {isAz ? "Profil" : "Profile"}
                    </Link>
                    <Link to="/history" onClick={() => setOpen(false)} className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-white/5">
                      {isAz ? "Tarixçə" : "History"}
                    </Link>
                    <button onClick={handleSignOut} className="text-left px-4 py-3 text-sm font-medium rounded-lg hover:bg-white/5 text-red-400">
                      {isAz ? "Çıxış" : "Logout"}
                    </button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setOpen(false)} className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-white/5">
                    {t("nav.login")}
                  </Link>
                )}
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
