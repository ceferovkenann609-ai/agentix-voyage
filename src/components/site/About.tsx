import { motion } from "framer-motion";

const services = [
  {
    title: "AI Chatbots",
    description:
      "24/7 işləyən ağıllı chatbotlar ilə müştəri dəstəyi və satış proseslərinizi avtomatlaşdırın.",
  },
  {
    title: "AI Voice Agents",
    description:
      "Telefon zənglərini idarə edən və müştərilərinizlə danışan səsli AI agentlər.",
  },
  {
    title: "Business Automation",
    description:
      "Təkrarlanan işləri avtomatlaşdıraraq vaxtınıza və resurslarınıza qənaət edin.",
  },
  {
    title: "AI Marketing",
    description:
      "Sosial media, reklam və kontent yaratmaq üçün AI əsaslı marketinq həlləri.",
  },
];

const advantages = [
  {
    title: "24/7 İşləyir",
    text: "AI agentləriniz fasiləsiz işləyərək biznesinizə daim dəstək verir.",
  },
  {
    title: "Xərcləri Azaldır",
    text: "Avtomatlaşdırma ilə əməliyyat xərclərinizi aşağı salır.",
  },
  {
    title: "Daha Sürətli İnkişaf",
    text: "Daha effektiv proseslərlə biznesinizin böyüməsinə kömək edir.",
  },
  {
    title: "Ağıllı Texnologiya",
    text: "Müasir süni intellekt həlləri ilə fərdi sistemlər yaradırıq.",
  },
];

export default function About() {
  return (
    <section className="min-h-screen bg-black text-white px-6 py-24">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold">
          Biznesləri AI ilə daha ağıllı edirik
        </h1>

        <p className="mt-6 text-gray-400 text-lg">
          Agentix şirkətlər üçün AI agentlər, chatbotlar və avtomatlaşdırma
          sistemləri yaradır.
        </p>
      </motion.div>


      {/* Who We Are */}
      <div className="max-w-5xl mx-auto mt-32">
        <h2 className="text-3xl font-bold">
          Biz kimik?
        </h2>

        <p className="mt-5 text-gray-400 leading-8">
          Agentix bizneslərin gündəlik işlərini süni intellekt vasitəsilə
          avtomatlaşdıran texnologiya şirkətidir. Biz şirkətlərə daha az
          resursla daha çox nəticə əldə etməyə kömək edən AI həlləri qururuq.
        </p>
      </div>


      {/* Mission */}
      <div className="max-w-5xl mx-auto mt-20">
        <h2 className="text-3xl font-bold">
          Missiyamız
        </h2>

        <p className="mt-5 text-gray-400 leading-8">
          Məqsədimiz süni intellekti hər bir biznes üçün əlçatan etmək və
          şirkətlərin daha sürətli, effektiv və ağıllı işləməsinə imkan
          yaratmaqdır.
        </p>
      </div>


      {/* Services */}
      <div className="max-w-6xl mx-auto mt-32">
        <h2 className="text-3xl font-bold text-center">
          Nə edirik?
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          {services.map((item) => (
            <div
              key={item.title}
              className="
              rounded-2xl border border-white/10 
              p-8 bg-white/5
              hover:border-white/30
              transition
              "
            >
              <h3 className="text-xl font-semibold">
                {item.title}
              </h3>

              <p className="mt-3 text-gray-400">
                {item.description}
              </p>
            </div>
          ))}

        </div>
      </div>


      {/* Why Agentix */}
      <div className="max-w-6xl mx-auto mt-32">

        <h2 className="text-3xl font-bold text-center">
          Niyə Agentix?
        </h2>

        <div className="grid md:grid-cols-4 gap-5 mt-10">

          {advantages.map((item)=>(
            <div
              key={item.title}
              className="
              p-6 rounded-2xl 
              bg-white/5 border border-white/10
              "
            >
              <h3 className="font-bold">
                {item.title}
              </h3>

              <p className="text-gray-400 mt-3 text-sm">
                {item.text}
              </p>

            </div>
          ))}

        </div>

      </div>


      {/* CTA */}
      <div className="text-center mt-32">

        <h2 className="text-4xl font-bold">
          Biznesinizi AI ilə inkişaf etdirin
        </h2>

        <button
          className="
          mt-8 px-8 py-4 rounded-full
          bg-white text-black
          font-semibold
          "
        >
          Start Your AI Journey
        </button>

      </div>

    </section>
  );
}