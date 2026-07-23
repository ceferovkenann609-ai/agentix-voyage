import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

type Copy = {
  hero: { title: string; sub: string };
  who: { title: string; body: string };
  mission: { title: string; body: string };
  services: { title: string; items: { title: string; description: string }[] };
  why: { title: string; items: { title: string; text: string }[] };
  cta: { title: string; button: string };
};

const AZ: Copy = {
  hero: {
    title: "Biznesləri AI ilə daha ağıllı edirik",
    sub: "Agentix şirkətlər üçün AI agentlər, chatbotlar və avtomatlaşdırma sistemləri yaradır.",
  },
  who: {
    title: "Biz kimik?",
    body: "Agentix bizneslərin gündəlik işlərini süni intellekt vasitəsilə avtomatlaşdıran texnologiya şirkətidir. Biz şirkətlərə daha az resursla daha çox nəticə əldə etməyə kömək edən AI həlləri qururuq.",
  },
  mission: {
    title: "Missiyamız",
    body: "Məqsədimiz süni intellekti hər bir biznes üçün əlçatan etmək və şirkətlərin daha sürətli, effektiv və ağıllı işləməsinə imkan yaratmaqdır.",
  },
  services: {
    title: "Nə edirik?",
    items: [
      { title: "AI Chatbotlar", description: "24/7 işləyən ağıllı chatbotlar ilə müştəri dəstəyi və satış proseslərinizi avtomatlaşdırın." },
      { title: "AI Səsli Agentlər", description: "Telefon zənglərini idarə edən və müştərilərinizlə danışan səsli AI agentlər." },
      { title: "Biznes Avtomatlaşdırma", description: "Təkrarlanan işləri avtomatlaşdıraraq vaxtınıza və resurslarınıza qənaət edin." },
      { title: "AI Marketinq", description: "Sosial media, reklam və kontent yaratmaq üçün AI əsaslı marketinq həlləri." },
    ],
  },
  why: {
    title: "Niyə Agentix?",
    items: [
      { title: "24/7 İşləyir", text: "AI agentləriniz fasiləsiz işləyərək biznesinizə daim dəstək verir." },
      { title: "Xərcləri Azaldır", text: "Avtomatlaşdırma ilə əməliyyat xərclərinizi aşağı salır." },
      { title: "Daha Sürətli İnkişaf", text: "Daha effektiv proseslərlə biznesinizin böyüməsinə kömək edir." },
      { title: "Ağıllı Texnologiya", text: "Müasir süni intellekt həlləri ilə fərdi sistemlər yaradırıq." },
    ],
  },
  cta: { title: "Biznesinizi AI ilə inkişaf etdirin", button: "AI səyahətinizə başlayın" },
};

const EN: Copy = {
  hero: {
    title: "Making businesses smarter with AI",
    sub: "Agentix builds AI agents, chatbots and automation systems for modern companies.",
  },
  who: {
    title: "Who we are",
    body: "Agentix is a technology company that automates day-to-day business operations with artificial intelligence. We build AI solutions that help teams achieve more with fewer resources.",
  },
  mission: {
    title: "Our mission",
    body: "Our mission is to make AI accessible to every business and enable companies to work faster, smarter and more efficiently.",
  },
  services: {
    title: "What we do",
    items: [
      { title: "AI Chatbots", description: "Automate customer support and sales with intelligent chatbots that work 24/7." },
      { title: "AI Voice Agents", description: "Voice agents that handle phone calls and speak naturally with your customers." },
      { title: "Business Automation", description: "Save time and resources by automating repetitive work." },
      { title: "AI Marketing", description: "AI-powered marketing solutions for social, ads and content." },
    ],
  },
  why: {
    title: "Why Agentix",
    items: [
      { title: "24/7 Uptime", text: "Your AI agents run non-stop, supporting your business at all hours." },
      { title: "Lower Costs", text: "Automation reduces your operational expenses significantly." },
      { title: "Faster Growth", text: "More efficient processes help your business grow faster." },
      { title: "Smart Technology", text: "We build custom systems with modern AI." },
    ],
  },
  cta: { title: "Grow your business with AI", button: "Start Your AI Journey" },
};

export default function About() {
  const { i18n } = useTranslation();
  const c = i18n.resolvedLanguage === "en" ? EN : AZ;
  return (
    <section className="min-h-screen bg-black text-white px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold">{c.hero.title}</h1>
        <p className="mt-6 text-gray-400 text-lg">{c.hero.sub}</p>
      </motion.div>

      <div className="max-w-5xl mx-auto mt-32">
        <h2 className="text-3xl font-bold">{c.who.title}</h2>
        <p className="mt-5 text-gray-400 leading-8">{c.who.body}</p>
      </div>

      <div className="max-w-5xl mx-auto mt-20">
        <h2 className="text-3xl font-bold">{c.mission.title}</h2>
        <p className="mt-5 text-gray-400 leading-8">{c.mission.body}</p>
      </div>

      <div className="max-w-6xl mx-auto mt-32">
        <h2 className="text-3xl font-bold text-center">{c.services.title}</h2>
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          {c.services.items.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 p-8 bg-white/5 hover:border-white/30 transition">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-32">
        <h2 className="text-3xl font-bold text-center">{c.why.title}</h2>
        <div className="grid md:grid-cols-4 gap-5 mt-10">
          {c.why.items.map((item) => (
            <div key={item.title} className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-gray-400 mt-3 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-32">
        <h2 className="text-4xl font-bold">{c.cta.title}</h2>
        <Link
          to="/book-demo"
          className="mt-8 inline-block px-8 py-4 rounded-full bg-white text-black font-semibold"
        >
          {c.cta.button}
        </Link>
      </div>
    </section>
  );
}
