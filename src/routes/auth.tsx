import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    mode: (s.mode as "signin" | "signup" | undefined) ?? "signin",
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Agentix" },
      { name: "description", content: "Sign in or create your Agentix account." },
      { property: "og:title", content: "Sign in — Agentix" },
      { property: "og:description", content: "Access your Agentix workspace." },
    ],
  }),
  component: AuthPage,
});

const T = {
  az: {
    signin: "Daxil ol",
    signup: "Qeydiyyat",
    welcome: "Yenidən xoş gəlmisiniz",
    create: "Agentix hesabı yaradın",
    fullName: "Ad Soyad",
    email: "E-poçt",
    password: "Şifrə",
    submitSignin: "Daxil ol",
    submitSignup: "Hesab yarat",
    loading: "Gözləyin...",
    forgot: "Şifrəni unutmusunuz?",
    noAccount: "Hesabınız yoxdur?",
    haveAccount: "Artıq hesabınız var?",
    createOne: "Yaradın",
    signInLink: "Daxil olun",
    signupSuccess: "Hesab yaradıldı! İndi daxil ola bilərsiniz.",
    passwordShort: "Şifrə ən azı 8 simvol olmalıdır",
    invalidEmail: "Düzgün e-poçt daxil edin",
    nameRequired: "Ad Soyad zəruridir",
  },
  en: {
    signin: "Sign in",
    signup: "Sign up",
    welcome: "Welcome back",
    create: "Create your Agentix account",
    fullName: "Full Name",
    email: "Email",
    password: "Password",
    submitSignin: "Sign in",
    submitSignup: "Create account",
    loading: "Please wait...",
    forgot: "Forgot password?",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    createOne: "Create one",
    signInLink: "Sign in",
    signupSuccess: "Account created! You can sign in now.",
    passwordShort: "Password must be at least 8 characters",
    invalidEmail: "Enter a valid email",
    nameRequired: "Full name is required",
  },
};

function AuthPage() {
  const { i18n } = useTranslation();
  const t = i18n.resolvedLanguage === "en" ? T.en : T.az;
  const search = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(search.mode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate({ to: search.redirect ?? "/dashboard", replace: true });
    }
  }, [user, navigate, search.redirect]);

  useEffect(() => setMode(search.mode), [search.mode]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(t.invalidEmail);
      return;
    }
    if (password.length < 8) {
      setError(t.passwordShort);
      return;
    }
    if (mode === "signup" && !name.trim()) {
      setError(t.nameRequired);
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name.trim() },
          },
        });
        if (error) throw error;
        // After signup, if session exists, redirect; else sign in
        const { data: sess } = await supabase.auth.getSession();
        if (sess.session) {
          navigate({ to: search.redirect ?? "/dashboard", replace: true });
        } else {
          const { error: signInErr } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
          if (signInErr) {
            setInfo(t.signupSuccess);
            setMode("signin");
          }
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-[#07090C] text-white">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-gradient font-display">Agentix</span>
        </Link>

        <div className="glass-strong rounded-3xl p-8">
          <div className="flex gap-2 p-1 rounded-xl bg-white/5 mb-6">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${mode === "signin" ? "bg-brand-gradient text-white" : "text-muted-foreground"}`}
            >
              {t.signin}
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${mode === "signup" ? "bg-brand-gradient text-white" : "text-muted-foreground"}`}
            >
              {t.signup}
            </button>
          </div>

          <h1 className="text-2xl font-bold mb-6">{mode === "signin" ? t.welcome : t.create}</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <input
                type="text"
                placeholder={t.fullName}
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-cyan-400"
              />
            )}
            <input
              type="email"
              placeholder={t.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-cyan-400"
            />
            <input
              type="password"
              placeholder={t.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-cyan-400"
            />

            {error && <p className="text-sm text-red-400">{error}</p>}
            {info && <p className="text-sm text-emerald-400">{info}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-gradient p-4 font-semibold text-white disabled:opacity-60"
            >
              {loading ? t.loading : mode === "signin" ? t.submitSignin : t.submitSignup}
            </button>
          </form>

          {mode === "signin" && (
            <div className="mt-4 text-center">
              <Link to="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300">
                {t.forgot}
              </Link>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                {t.noAccount}{" "}
                <button onClick={() => setMode("signup")} className="text-cyan-400 hover:text-cyan-300 font-semibold">
                  {t.createOne}
                </button>
              </>
            ) : (
              <>
                {t.haveAccount}{" "}
                <button onClick={() => setMode("signin")} className="text-cyan-400 hover:text-cyan-300 font-semibold">
                  {t.signInLink}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
