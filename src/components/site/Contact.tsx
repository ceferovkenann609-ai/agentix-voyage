import { useState, type ChangeEvent, type FormEvent, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type FormState = {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  message: string;
};

const initial: FormState = { name: "", email: "", company: "", phone: "", service: "", message: "" };

const T = {
  az: {
    eyebrow: "BİZİMLƏ ƏLAQƏ",
    title: "AI komandanızı birlikdə quraq",
    sub: "Biznesinizdən danışın — AI-nin dəstək, satış, əməliyyat və iş axınlarını necə avtomatlaşdıra biləcəyini göstərək.",
    name: "Ad Soyad",
    email: "Biznes e-poçtu",
    company: "Şirkət",
    phone: "Telefon",
    selectService: "Xidmət seçin",
    services: ["AI Chatbotlar", "Səsli AI", "CRM İnteqrasiya", "İş Axını Avtomatlaşdırması", "Lead Generation", "Müştəri Dəstəyi"],
    message: "Biznesiniz haqqında yazın...",
    button: "Pulsuz Konsultasiya Sifariş Et",
    sending: "Göndərilir...",
    success: "✅ Təşəkkür edirik! 24 saat ərzində sizinlə əlaqə saxlayacağıq.",
    error: "Bir problem baş verdi. Yenidən cəhd edin və ya hello@agentix.ai ünvanına yazın.",
    secure: "🔒 Məlumatlarınız təhlükəsizdir və heç vaxt paylaşılmır.",
    contactInfo: "Əlaqə məlumatları",
    replyIn: "Adətən 24 saat ərzində cavablandırırıq.",
    emailLbl: "E-poçt",
    phoneLbl: "Telefon",
    locLbl: "Ünvan",
    loc: "Bakı, Azərbaycan",
    hoursLbl: "İş saatları",
    hoursDays: "Bazar ertəsi – Cümə",
    required: "Zəruridir",
    emailErr: "Düzgün e-poçt daxil edin",
    serviceErr: "Xidmət seçin",
    messageErr: "Ən azı 10 simvol daxil edin",
  },
  en: {
    eyebrow: "CONTACT US",
    title: "Let's Build Your AI Workforce",
    sub: "Tell us about your business and we'll show you how AI can automate your workflows, customer support, sales, and operations.",
    name: "Full Name",
    email: "Business Email",
    company: "Company Name",
    phone: "Phone Number",
    selectService: "Select a Service",
    services: ["AI Chatbots", "Voice AI", "CRM Integration", "Workflow Automation", "Lead Generation", "Customer Support"],
    message: "Tell us about your business...",
    button: "Book Free Consultation",
    sending: "Sending...",
    success: "✅ Thank you! We'll get back to you within 24 hours.",
    error: "Something went wrong. Please try again or email hello@agentix.ai.",
    secure: "🔒 Your information is secure and will never be shared.",
    contactInfo: "Contact Information",
    replyIn: "We usually reply within 24 hours.",
    emailLbl: "Email",
    phoneLbl: "Phone",
    locLbl: "Location",
    loc: "Baku, Azerbaijan",
    hoursLbl: "Business Hours",
    hoursDays: "Monday – Friday",
    required: "Required",
    emailErr: "Valid email required",
    serviceErr: "Please select a service",
    messageErr: "Please add a short message (10+ chars)",
  },
};

export default function Contact() {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const t = i18n.resolvedLanguage === "en" ? T.en : T.az;


  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const update = (k: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((current) => ({ ...current, [k]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = t.required;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = t.emailErr;
    if (!form.service.trim()) next.service = t.serviceErr;
    if (!form.message.trim() || form.message.trim().length < 10) next.message = t.messageErr;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const { error } = await supabase.from("contact_requests").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        company: form.company.trim() || null,
        subject: form.service.trim() || null,
        message: form.message.trim(),
        locale: i18n.resolvedLanguage ?? null,
        user_id: user?.id ?? null,
      });
      if (error) throw error;
      setStatus("success");
      setForm(initial);
    } catch (err) {
      console.error("[contact] insert failed", err);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="uppercase tracking-[6px] text-cyan-400 font-semibold">{t.eyebrow}</p>
        <h1 className="mt-6 text-5xl md:text-6xl font-bold">{t.title}</h1>
        <p className="mt-8 max-w-3xl mx-auto text-xl text-gray-400">{t.sub}</p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} noValidate className="lg:col-span-2 rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-10">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <input type="text" placeholder={t.name} value={form.name} onChange={update("name")} maxLength={100} className="w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400" />
                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
              </div>
              <div>
                <input type="email" placeholder={t.email} value={form.email} onChange={update("email")} maxLength={255} className="w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400" />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
              </div>
              <input type="text" placeholder={t.company} value={form.company} onChange={update("company")} maxLength={100} className="bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400" />
              <input type="tel" placeholder={t.phone} value={form.phone} onChange={update("phone")} maxLength={30} className="bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400" />
            </div>

            <select value={form.service} onChange={update("service")} className="mt-6 w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400">
              <option value="">{t.selectService}</option>
              {t.services.map((s) => <option key={s}>{s}</option>)}
            </select>
            {errors.service && <p className="mt-1 text-sm text-red-400">{errors.service}</p>}

            <textarea rows={6} placeholder={t.message} value={form.message} onChange={update("message")} maxLength={1000} className="mt-6 w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400" />
            {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}

            <button type="submit" onClick={handleSubmit} disabled={status === "loading"} className="mt-8 w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 transition p-4 text-black font-bold text-lg disabled:opacity-60">
              {status === "loading" ? t.sending : t.button}
            </button>

            {status === "success" && <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center text-green-400">{t.success}</div>}
            {status === "error" && <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-red-400">{t.error}</div>}
            <p className="mt-5 text-center text-sm text-zinc-500">{t.secure}</p>
          </form>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-8">
            <h3 className="text-2xl font-bold">{t.contactInfo}</h3>
            <p className="mt-3 text-zinc-400">{t.replyIn}</p>
            <div className="mt-8 space-y-6">
              <div>
                <p className="text-zinc-500 text-sm">{t.emailLbl}</p>
                <a href="mailto:hello@agentix.ai" className="font-semibold hover:text-cyan-400">hello@agentix.ai</a>
              </div>
              <div>
                <p className="text-zinc-500 text-sm">{t.phoneLbl}</p>
                <p className="font-semibold">+994 XX XXX XX XX</p>
              </div>
              <div>
                <p className="text-zinc-500 text-sm">{t.locLbl}</p>
                <p className="font-semibold">{t.loc}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-sm">{t.hoursLbl}</p>
                <p className="font-semibold">{t.hoursDays}</p>
                <p className="text-zinc-400">09:00 – 18:00</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
