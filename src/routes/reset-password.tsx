import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Agentix" },
      { name: "description", content: "Set a new password for your Agentix account." },
      { property: "og:title", content: "Reset password — Agentix" },
      { property: "og:description", content: "Set a new password for your Agentix account." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { i18n } = useTranslation();
  const isAz = i18n.resolvedLanguage !== "en";
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase auto-parses hash on load; wait for session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError(isAz ? "Şifrə ən azı 8 simvol olmalıdır" : "Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError(isAz ? "Şifrələr uyğun gəlmir" : "Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => navigate({ to: "/dashboard", replace: true }), 1500);
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
          <h1 className="text-2xl font-bold mb-6">{isAz ? "Yeni şifrə" : "New password"}</h1>

          {!ready ? (
            <p className="text-sm text-muted-foreground">
              {isAz ? "Sıfırlama linki yoxlanılır..." : "Verifying reset link..."}
            </p>
          ) : done ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-400 text-sm">
              {isAz ? "✅ Şifrə yeniləndi. Yönləndirilirsiniz..." : "✅ Password updated. Redirecting..."}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                placeholder={isAz ? "Yeni şifrə" : "New password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-cyan-400"
              />
              <input
                type="password"
                placeholder={isAz ? "Şifrəni təsdiq edin" : "Confirm password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-cyan-400"
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-brand-gradient p-4 font-semibold text-white disabled:opacity-60"
              >
                {loading ? (isAz ? "Yenilənir..." : "Updating...") : isAz ? "Şifrəni yenilə" : "Update password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
