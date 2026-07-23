import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

const T = {
  az: {
    eyebrow: "AI HƏLLƏRİ",
    title: "Hər sahə üçün AI həlləri",
    sub: "Agentix əməliyyatları avtomatlaşdıran, müştəri təcrübəsini yaxşılaşdıran və bizneslərin daha sürətli böyüməsinə kömək edən fərdi AI sistemləri qurur.",
    bookDemo: "Demo Sifariş Et",
    explore: "Sahələrə bax",
    industriesTitle: "Dəyişdirdiyimiz Sahələr",
    industriesSub: "Hər sahənin öz problemləri var. Agentix biznesinizə uyğun AI həlləri təqdim edir.",
    whyTitle: "Niyə Agentix?",
    whySub: "Biz sadəcə AI alətləri qurmuruq — vaxt qazandıran, xərcləri azaldan və biznesləri daha sürətli böyüdən ağıllı sistemlər yaradırıq.",
    howTitle: "Necə İşləyirik",
    howSub: "AI-ni biznesinizə gətirmək üçün sadə dörd addım.",
    ctaEyebrow: "BÖYÜMƏYƏ HAZIRSINIZ?",
    ctaTitle: "Biznesinizi AI ilə dəyişdirin",
    ctaSub: "Müştəri dəstəyini, satışları və iş axınlarını avtomatlaşdırmaq üçün Agentix AI-dən istifadə edən bizneslərə qoşulun.",
    ctaBook: "🚀 Pulsuz Demo Sifariş Et",
    ctaContact: "Bizimlə Əlaqə",
    industries: [
      { emoji: "🍽️", slug: "restaurants" as const, title: "Restoranlar", desc: "AI ofisiant, rezervasiya, WhatsApp sifariş və müştəri dəstəyi." },
      { emoji: "🛒", slug: "ecommerce" as const, title: "E-ticarət", desc: "AI satış köməkçiləri, sifariş izləmə və məhsul tövsiyələri." },
      { emoji: "🏥", slug: "healthcare" as const, title: "Səhiyyə", desc: "Qeydiyyat, pasient dəstəyi və AI səsli resepşn." },
      { emoji: "🏢", slug: "real-estate" as const, title: "Daşınmaz Əmlak", desc: "Lead kvalifikasiyası, obyekt sorğuları və avtomatik izləmə." },
      { emoji: "⚖️", slug: "law-firms" as const, title: "Hüquq Şirkətləri", desc: "Müştəri qeydiyyatı, sənəd tələbləri və görüş planlaması." },
      { emoji: "🏨", slug: "hotels" as const, title: "Otellər", desc: "Rezervasiya avtomatlaşdırma, qonaq dəstəyi və AI konsyerj." },
      { emoji: "💇", slug: "beauty-salons" as const, title: "Gözəllik Salonları", desc: "Görüş qeydi, xatırlatmalar və müştəri əlaqəsi." },
      { emoji: "🎓", slug: "education" as const, title: "Təhsil", desc: "Tələbə dəstəyi, qeydiyyat avtomatlaşdırma və AI dərslik köməkçiləri." },
    ],
    why: [
      { emoji: "⚡", title: "Daha Sürətli Cavab", desc: "AI hər müştəriyə dərhal cavab verir, 24/7." },
      { emoji: "💰", title: "Daha Az Xərc", desc: "Təkrarlanan işləri avtomatlaşdıraraq işçi xərclərini azaldın." },
      { emoji: "📈", title: "Daha Çox Gəlir", desc: "Daha çox ziyarətçini müştəriyə çevirin." },
      { emoji: "🤖", title: "Ağıllı Avtomatlaşdırma", desc: "Adi işləri AI aparsın, komandanız böyüməyə fokuslansın." },
    ],
    steps: [
      { n: "1", title: "Kəşf", desc: "Biznesinizi və çətinliklərinizi öyrənirik." },
      { n: "2", title: "Strategiya", desc: "Ehtiyaclarınıza uyğun ən yaxşı AI həllini dizayn edirik." },
      { n: "3", title: "İmplementasiya", desc: "Komandamız AI sisteminizi qurub inteqrasiya edir." },
      { n: "4", title: "Böyümə", desc: "Nəticələri izləyin və performansı davamlı artırın." },
    ],
  },
  en: {
    eyebrow: "AI SOLUTIONS",
    title: "AI Solutions For Every Industry",
    sub: "Agentix builds custom AI systems that automate operations, improve customer experience and help businesses grow faster.",
    bookDemo: "Book a Demo",
    explore: "Explore Industries",
    industriesTitle: "Industries We Transform",
    industriesSub: "Every industry has different challenges. Agentix delivers AI solutions tailored to your business.",
    whyTitle: "Why Choose Agentix?",
    whySub: "We don't just build AI tools. We create intelligent systems that help businesses save time, reduce costs and grow faster.",
    howTitle: "How We Work",
    howSub: "A simple four-step process to bring AI into your business.",
    ctaEyebrow: "READY TO GROW?",
    ctaTitle: "Transform Your Business With AI",
    ctaSub: "Join businesses already using Agentix AI to automate customer support, sales, operations and business workflows.",
    ctaBook: "🚀 Book Free Demo",
    ctaContact: "Contact Us",
    industries: [
      { emoji: "🍽️", slug: "restaurants" as const, title: "Restaurants", desc: "AI Waiter, reservations, WhatsApp ordering and customer support." },
      { emoji: "🛒", slug: "ecommerce" as const, title: "E-commerce", desc: "AI sales assistants, order tracking and product recommendations." },
      { emoji: "🏥", slug: "healthcare" as const, title: "Healthcare", desc: "Appointment booking, patient support and AI voice receptionists." },
      { emoji: "🏢", slug: "real-estate" as const, title: "Real Estate", desc: "Lead qualification, property inquiries and automated follow-ups." },
      { emoji: "⚖️", slug: "law-firms" as const, title: "Law Firms", desc: "Client intake, document requests and appointment scheduling." },
      { emoji: "🏨", slug: "hotels" as const, title: "Hotels", desc: "Reservation automation, guest support and AI concierge." },
      { emoji: "💇", slug: "beauty-salons" as const, title: "Beauty Salons", desc: "Appointment booking, reminders and customer engagement." },
      { emoji: "🎓", slug: "education" as const, title: "Education", desc: "Student support, enrollment automation and AI learning assistants." },
    ],
    why: [
      { emoji: "⚡", title: "Faster Response", desc: "AI replies instantly to every customer 24/7." },
      { emoji: "💰", title: "Lower Costs", desc: "Reduce staffing costs by automating repetitive work." },
      { emoji: "📈", title: "More Revenue", desc: "Convert more visitors into paying customers." },
      { emoji: "🤖", title: "Smart Automation", desc: "Let AI handle routine tasks while your team focuses on growth." },
    ],
    steps: [
      { n: "1", title: "Discovery", desc: "We learn about your business and challenges." },
      { n: "2", title: "Strategy", desc: "We design the best AI solution for your needs." },
      { n: "3", title: "Implementation", desc: "Our team builds and integrates your AI system." },
      { n: "4", title: "Growth", desc: "Monitor results and continuously improve performance." },
    ],
  },
};

export default function Solutions() {
  const { i18n } = useTranslation();
  const t = i18n.resolvedLanguage === "en" ? T.en : T.az;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
        <p className="uppercase tracking-[6px] text-cyan-400 font-semibold">{t.eyebrow}</p>
        <h1 className="mt-6 text-6xl font-bold">{t.title}</h1>
        <p className="mt-8 max-w-3xl mx-auto text-xl text-zinc-400 leading-relaxed">{t.sub}</p>
        <div className="mt-12 flex justify-center gap-5 flex-wrap">
          <Link to="/book-demo" className="rounded-xl bg-brand-gradient px-8 py-4 font-semibold hover:scale-105 transition">{t.bookDemo}</Link>
          <a href="#industries" className="rounded-xl border border-zinc-700 px-8 py-4 hover:border-cyan-400 transition">{t.explore}</a>
        </div>
      </section>

      <section id="industries" className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-4xl font-bold text-center">{t.industriesTitle}</h2>
        <p className="mt-4 text-center text-zinc-400 max-w-2xl mx-auto">{t.industriesSub}</p>
        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {t.industries.map((it) => (
            <Link
              key={it.slug}
              to="/solutions/$industry"
              params={{ industry: it.slug }}
              className="block rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 hover:border-cyan-400 transition"
            >
              <div className="text-5xl">{it.emoji}</div>
              <h3 className="mt-6 text-2xl font-bold">{it.title}</h3>
              <p className="mt-4 text-zinc-400">{it.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center">
          <h2 className="text-4xl font-bold">{t.whyTitle}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-zinc-400">{t.whySub}</p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {t.why.map((w) => (
            <div key={w.title} className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8">
              <div className="text-5xl">{w.emoji}</div>
              <h3 className="mt-5 text-2xl font-bold">{w.title}</h3>
              <p className="mt-3 text-zinc-400">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center">
          <h2 className="text-4xl font-bold">{t.howTitle}</h2>
          <p className="mt-4 text-zinc-400">{t.howSub}</p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-4">
          {t.steps.map((s) => (
            <div key={s.n} className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 text-center">
              <div className="text-5xl font-bold text-cyan-400">{s.n}</div>
              <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
              <p className="mt-3 text-zinc-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="relative overflow-hidden rounded-[40px] border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-zinc-900 to-purple-500/10 p-16 text-center">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl"></div>
          <div className="relative">
            <p className="uppercase tracking-[6px] text-cyan-400 font-semibold">{t.ctaEyebrow}</p>
            <h2 className="mt-6 text-5xl font-bold">{t.ctaTitle}</h2>
            <p className="mt-6 max-w-3xl mx-auto text-zinc-400 text-lg leading-relaxed">{t.ctaSub}</p>
            <div className="mt-10 flex justify-center gap-5 flex-wrap">
              <Link to="/book-demo" className="rounded-xl bg-brand-gradient px-8 py-4 font-semibold hover:scale-105 transition">{t.ctaBook}</Link>
              <Link to="/contact" className="rounded-xl border border-zinc-700 px-8 py-4 hover:border-cyan-400 transition">{t.ctaContact}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
