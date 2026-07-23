import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password — Agentix" },
      { name: "description", content: "Reset your Agentix account password." },
      { property: "og:title", content: "Forgot password — Agentix" },
      { property: "og:description", content: "Reset your Agentix account password." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { i18n } = useTranslation();
  const isAz = i18n.resolvedLanguage !== "en";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
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
          <h1 className="text-2xl font-bold mb-2">
            {isAz ? "Şifrəni sıfırla" : "Reset your password"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {isAz
              ? "E-poçt ünvanınızı daxil edin, sizə şifrə sıfırlama linki göndərəcəyik."
              : "Enter your email and we'll send you a password reset link."}
          </p>

          {sent ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-400 text-sm">
              {isAz
                ? "✅ Link göndərildi. Poçt qutunuzu yoxlayın."
                : "✅ Link sent. Check your inbox."}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder={isAz ? "E-poçt" : "Email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-cyan-400"
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-brand-gradient p-4 font-semibold text-white disabled:opacity-60"
              >
                {loading ? (isAz ? "Göndərilir..." : "Sending...") : isAz ? "Sıfırlama linkini göndər" : "Send reset link"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/auth" className="text-sm text-cyan-400 hover:text-cyan-300">
              {isAz ? "← Daxil olma səhifəsinə qayıt" : "← Back to sign in"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
