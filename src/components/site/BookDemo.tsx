import { useState, type ChangeEvent, type FormEvent, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

type DemoForm = {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  message: string;
};

const initialForm: DemoForm = { name: "", email: "", company: "", phone: "", service: "", message: "" };

const T = {
  az: {
    eyebrow: "DEMO SİFARİŞ ET",
    title: "AI həllinizi birlikdə quraq",
    sub: "Biznesinizdən danışın və Agentix komandası ilə pulsuz konsultasiya planlayın.",
    formTitle: "Pulsuz demo planlayın",
    formSub: "Formanı doldurun və komandamız qısa müddət ərzində sizinlə əlaqə saxlayacaq.",
    name: "Ad Soyad", email: "Biznes e-poçtu", company: "Şirkət", phone: "Telefon",
    selectService: "Xidmət seçin",
    services: ["AI Chatbotlar", "Səsli AI", "Lead Generation", "Müştəri Dəstəyi", "İş Axını Avtomatlaşdırması", "CRM İnteqrasiya"],
    message: "Layihəniz haqqında yazın...",
    button: "Demoni Sifariş Et",
    sending: "Göndərilir...",
    success: "✅ Təşəkkür edirik! Demo sorğunuz qəbul edildi. Komandamız 24 saat ərzində sizinlə əlaqə saxlayacaq.",
    whyTitle: "Nəyə görə demo?",
    whySub: "AI-nin biznesinizi necə dəyişdirə biləcəyini görün.",
    perks: ["✅ Fərdi AI Strategiyası", "✅ Canlı Məhsul Nümayişi", "✅ Biznes Avtomatlaşdırma Planı", "✅ Pulsuz Konsultasiya"],
    nameErr: "Ad zəruridir", emailErr: "Düzgün e-poçt daxil edin", serviceErr: "Xidmət seçin", messageErr: "Ən azı 10 simvol daxil edin və ya boş buraxın",
  },
  en: {
    eyebrow: "BOOK A DEMO",
    title: "Let's Build Your AI Solution",
    sub: "Tell us about your business and schedule a free consultation with the Agentix team.",
    formTitle: "Schedule Your Free Demo",
    formSub: "Fill out the form below and our team will contact you shortly.",
    name: "Full Name", email: "Business Email", company: "Company Name", phone: "Phone Number",
    selectService: "Select a Service",
    services: ["AI Chatbots", "Voice AI", "Lead Generation", "Customer Support", "Workflow Automation", "CRM Integration"],
    message: "Tell us about your project...",
    button: "Book My Demo",
    sending: "Sending...",
    success: "✅ Thank you! Your demo request has been received. Our team will contact you within 24 hours.",
    whyTitle: "Why Book a Demo?",
    whySub: "Discover how AI can transform your business.",
    perks: ["✅ Personalized AI Strategy", "✅ Live Product Walkthrough", "✅ Business Automation Plan", "✅ Free Consultation"],
    nameErr: "Full name is required", emailErr: "Valid business email is required", serviceErr: "Please select a service", messageErr: "Please add at least 10 characters or leave it blank",
  },
};

export default function BookDemo() {
  const { i18n } = useTranslation();
  const t = i18n.resolvedLanguage === "en" ? T.en : T.az;

  const [form, setForm] = useState<DemoForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof DemoForm, string>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (key: keyof DemoForm) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSuccess(false);
  };

  const validate = () => {
    const next: Partial<Record<keyof DemoForm, string>> = {};
    const email = form.email.trim();
    const phone = form.phone.trim();
    if (!form.name.trim()) next.name = t.nameErr;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = t.emailErr;
    if (phone && !/^[+()\-\s\d]{6,30}$/.test(phone)) next.phone = i18n.resolvedLanguage === "en" ? "Enter a valid phone number" : "Düzgün telefon nömrəsi daxil edin";
    if (!form.service.trim()) next.service = t.serviceErr;
    if (form.message.trim().length > 0 && form.message.trim().length < 10) next.message = t.messageErr;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!validate()) return;
    if (loading || success) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("demo_bookings").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        company: form.company.trim() || null,
        service: form.service.trim() || null,
        message: form.message.trim() || null,
        locale: i18n.resolvedLanguage ?? null,
      });
      if (error) {
        if (error.code === "23505") {
          setErrors({ email: i18n.resolvedLanguage === "en" ? "You already booked this service. We'll be in touch soon." : "Bu xidmət üçün artıq sorğu göndərmisiniz. Tezliklə əlaqə saxlayacağıq." });
        } else {
          throw error;
        }
      } else {
        setSuccess(true);
        setForm(initialForm);
      }
    } catch (err) {
      console.error("[book-demo] insert failed", err);
      setErrors({ message: i18n.resolvedLanguage === "en" ? "Something went wrong. Please try again." : "Xəta baş verdi. Yenidən cəhd edin." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="uppercase tracking-[6px] text-cyan-400 font-semibold">{t.eyebrow}</p>
        <h1 className="mt-6 text-6xl font-bold">{t.title}</h1>
        <p className="mt-8 max-w-3xl mx-auto text-xl text-gray-400">{t.sub}</p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} noValidate className="lg:col-span-2 rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-10">
            <h2 className="text-3xl font-bold">{t.formTitle}</h2>
            <p className="mt-3 text-zinc-400">{t.formSub}</p>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div>
                <input type="text" placeholder={t.name} value={form.name} onChange={update("name")} maxLength={100} className="w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400" />
                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
              </div>
              <div>
                <input type="email" placeholder={t.email} value={form.email} onChange={update("email")} maxLength={255} className="w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400" />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
              </div>
              <input type="text" placeholder={t.company} value={form.company} onChange={update("company")} maxLength={100} className="bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400" />
              <div>
                <input type="tel" placeholder={t.phone} value={form.phone} onChange={update("phone")} maxLength={30} className="w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400" />
                {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
              </div>
            </div>

            <select value={form.service} onChange={update("service")} className="mt-6 w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400">
              <option value="">{t.selectService}</option>
              {t.services.map((s) => <option key={s}>{s}</option>)}
            </select>
            {errors.service && <p className="mt-1 text-sm text-red-400">{errors.service}</p>}

            <textarea rows={6} placeholder={t.message} value={form.message} onChange={update("message")} maxLength={1000} className="mt-6 w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400" />
            {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}

            <button type="submit" onClick={handleSubmit} disabled={loading} className="mt-8 w-full rounded-xl bg-brand-gradient p-4 text-lg font-bold text-white hover:opacity-90 transition disabled:opacity-50">
              {loading ? t.sending : t.button}
            </button>

            {success && <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center text-green-400">{t.success}</div>}
          </form>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-8">
            <h3 className="text-2xl font-bold">{t.whyTitle}</h3>
            <p className="mt-3 text-zinc-400">{t.whySub}</p>
            <div className="mt-8 space-y-6">
              {t.perks.map((p) => <div key={p}>{p}</div>)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
