import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Camera, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Agentix" },
      { name: "description", content: "Manage your Agentix profile." },
      { property: "og:title", content: "Profile — Agentix" },
      { property: "og:description", content: "Manage your Agentix profile." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const isAz = i18n.resolvedLanguage !== "en";
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadAvatar = async (path: string | null) => {
    if (!path) { setAvatarUrl(null); return; }
    const { data } = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60);
    setAvatarUrl(data?.signedUrl ?? null);
  };

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (data) {
        setFullName(data.full_name ?? "");
        setCompany(data.company ?? "");
        setPhone(data.phone ?? "");
        setAvatarPath(data.avatar_url);
        await loadAvatar(data.avatar_url);
      }
      setLoading(false);
    })();
  }, [user]);

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      setError(isAz ? "Fayl 5MB-dan böyük ola bilməz" : "File must be under 5MB");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      if (avatarPath) await supabase.storage.from("avatars").remove([avatarPath]);
      await supabase.from("profiles").update({ avatar_url: path }).eq("id", user.id);
      setAvatarPath(path);
      await loadAvatar(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullName.trim() || null,
        company: company.trim() || null,
        phone: phone.trim() || null,
      });
      if (error) throw error;
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07090C]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090C] text-white pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <p className="uppercase tracking-[6px] text-cyan-400 font-semibold text-sm">
          {isAz ? "PROFİL" : "PROFILE"}
        </p>
        <h1 className="mt-3 text-4xl font-bold">
          {isAz ? "Profilinizi idarə edin" : "Manage your profile"}
        </h1>

        <form onSubmit={handleSubmit} className="mt-10 glass-strong rounded-3xl p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative h-24 w-24 rounded-full bg-brand-gradient overflow-hidden flex items-center justify-center text-2xl font-bold">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <span>{(fullName || user?.email || "?").charAt(0).toUpperCase()}</span>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition flex items-center justify-center"
              >
                {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Camera className="h-6 w-6" />}
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/5"
              >
                {uploading ? (isAz ? "Yüklənir..." : "Uploading...") : isAz ? "Şəkli dəyişdir" : "Change photo"}
              </button>
              <p className="mt-1 text-xs text-muted-foreground">JPG / PNG, max 5MB</p>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatar} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-muted-foreground">{isAz ? "Ad Soyad" : "Full name"}</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                maxLength={100}
                className="mt-2 w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">{isAz ? "Şirkət" : "Company"}</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                maxLength={100}
                className="mt-2 w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">{isAz ? "Telefon" : "Phone"}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={30}
                className="mt-2 w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">{isAz ? "E-poçt" : "Email"}</label>
              <input
                type="email"
                value={user?.email ?? ""}
                disabled
                className="mt-2 w-full bg-black/20 border border-white/5 rounded-xl p-3 text-muted-foreground"
              />
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
          {saved && <p className="mt-4 text-sm text-emerald-400">{isAz ? "✅ Yaddaşa alındı" : "✅ Saved"}</p>}

          <button
            type="submit"
            disabled={saving}
            className="mt-8 rounded-xl bg-brand-gradient px-8 py-3 font-semibold text-white disabled:opacity-60"
          >
            {saving ? (isAz ? "Yaddaşa alınır..." : "Saving...") : isAz ? "Dəyişiklikləri saxla" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
