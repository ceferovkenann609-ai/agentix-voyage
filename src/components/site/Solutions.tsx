import { Link } from "@tanstack/react-router";
export default function Solutions() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">

        <p className="uppercase tracking-[6px] text-cyan-400 font-semibold">
          AI SOLUTIONS
        </p>

        <h1 className="mt-6 text-6xl font-bold">
          AI Solutions For Every Industry
        </h1>

        <p className="mt-8 max-w-3xl mx-auto text-xl text-zinc-400 leading-relaxed">
          Agentix builds custom AI systems that automate operations,
          improve customer experience and help businesses grow faster.
        </p>

        <div className="mt-12 flex justify-center gap-5 flex-wrap">

          <a
            href="/book-demo"
            className="rounded-xl bg-brand-gradient px-8 py-4 font-semibold hover:scale-105 transition"
          >
            Book a Demo
          </a>

          <a
            href="#industries"
            className="rounded-xl border border-zinc-700 px-8 py-4 hover:border-cyan-400 transition"
          >
            Explore Industries
          </a>

        </div>

      </section>
    {/* Industries */}

<section
  id="industries"
  className="max-w-7xl mx-auto px-6 pb-24"
>

  <h2 className="text-4xl font-bold text-center">
    Industries We Transform
  </h2>

  <p className="mt-4 text-center text-zinc-400 max-w-2xl mx-auto">
    Every industry has different challenges. Agentix delivers
    AI solutions tailored to your business.
  </p>

  <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

    <Link
  to="/solutions/$industry"
  params={{ industry: "restaurants" }}
  className="block rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 hover:border-cyan-400 transition"
>
  <div className="text-5xl">🍽️</div>

  <h3 className="mt-6 text-2xl font-bold">
    Restaurants
  </h3>

  <p className="mt-4 text-zinc-400">
    AI Waiter, reservations, WhatsApp ordering and customer support.
  </p>
</Link>

  <Link
  to="/solutions/$industry"
  params={{ industry: "ecommerce" }}
  className="block rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 hover:border-cyan-400 transition"
>
  <div className="text-5xl">🛒</div>

  <h3 className="mt-6 text-2xl font-bold">
    E-commerce
  </h3>

  <p className="mt-4 text-zinc-400">
    AI sales assistants, order tracking and product recommendations.
  </p>
</Link>

   <Link
  to="/solutions/$industry"
  params={{ industry: "healthcare" }}
  className="block rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 hover:border-cyan-400 transition"
>
  <div className="text-5xl">🏥</div>

  <h3 className="mt-6 text-2xl font-bold">
    Healthcare
  </h3>

  <p className="mt-4 text-zinc-400">
    Appointment booking, patient support and AI voice receptionists.
  </p>
</Link>

   <Link
  to="/solutions/$industry"
  params={{ industry: "real-estate" }}
  className="block rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 hover:border-cyan-400 transition"
>
  <div className="text-5xl">🏢</div>

  <h3 className="mt-6 text-2xl font-bold">
    Real Estate
  </h3>

  <p className="mt-4 text-zinc-400">
    Lead qualification, property inquiries and automated follow-ups.
  </p>
</Link>

  <Link
  to="/solutions/$industry"
  params={{ industry: "law-firms" }}
  className="block rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 hover:border-cyan-400 transition"
>
  <div className="text-5xl">⚖️</div>

  <h3 className="mt-6 text-2xl font-bold">
    Law Firms
  </h3>

  <p className="mt-4 text-zinc-400">
    Client intake, document requests and appointment scheduling.
  </p>
</Link>

   <Link
  to="/solutions/$industry"
  params={{ industry: "hotels" }}
  className="block rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 hover:border-cyan-400 transition"
>
  <div className="text-5xl">🏨</div>

  <h3 className="mt-6 text-2xl font-bold">
    Hotels
  </h3>

  <p className="mt-4 text-zinc-400">
    Reservation automation, guest support and AI concierge.
  </p>
</Link>

   <Link
  to="/solutions/$industry"
  params={{ industry: "beauty-salons" }}
  className="block rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 hover:border-cyan-400 transition"
>
  <div className="text-5xl">💇</div>

  <h3 className="mt-6 text-2xl font-bold">
    Beauty Salons
  </h3>

  <p className="mt-4 text-zinc-400">
    Appointment booking, reminders and customer engagement.
  </p>
</Link>

    <Link
  to="/solutions/$industry"
  params={{ industry: "education" }}
  className="block rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 hover:border-cyan-400 transition"
>
  <div className="text-5xl">🎓</div>

  <h3 className="mt-6 text-2xl font-bold">
    Education
  </h3>

  <p className="mt-4 text-zinc-400">
    Student support, enrollment automation and AI learning assistants.
  </p>
</Link>

  </div>

</section>
{/* Why Choose Agentix */}

<section className="max-w-7xl mx-auto px-6 py-24">

  <div className="text-center">

    <h2 className="text-4xl font-bold">
      Why Choose Agentix?
    </h2>

    <p className="mt-4 max-w-2xl mx-auto text-zinc-400">
      We don't just build AI tools. We create intelligent systems
      that help businesses save time, reduce costs and grow faster.
    </p>

  </div>

  <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8">
      <div className="text-5xl">⚡</div>

      <h3 className="mt-5 text-2xl font-bold">
        Faster Response
      </h3>

      <p className="mt-3 text-zinc-400">
        AI replies instantly to every customer 24/7.
      </p>
    </div>

    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8">
      <div className="text-5xl">💰</div>

      <h3 className="mt-5 text-2xl font-bold">
        Lower Costs
      </h3>

      <p className="mt-3 text-zinc-400">
        Reduce staffing costs by automating repetitive work.
      </p>
    </div>

    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8">
      <div className="text-5xl">📈</div>

      <h3 className="mt-5 text-2xl font-bold">
        More Revenue
      </h3>

      <p className="mt-3 text-zinc-400">
        Convert more visitors into paying customers.
      </p>
    </div>

    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8">
      <div className="text-5xl">🤖</div>

      <h3 className="mt-5 text-2xl font-bold">
        Smart Automation
      </h3>

      <p className="mt-3 text-zinc-400">
        Let AI handle routine tasks while your team focuses on growth.
      </p>
    </div>

  </div>

</section>

{/* How It Works */}

<section className="max-w-7xl mx-auto px-6 pb-24">

  <div className="text-center">

    <h2 className="text-4xl font-bold">
      How We Work
    </h2>

    <p className="mt-4 text-zinc-400">
      A simple four-step process to bring AI into your business.
    </p>

  </div>

  <div className="mt-16 grid gap-8 md:grid-cols-4">

    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 text-center">
      <div className="text-5xl font-bold text-cyan-400">1</div>
      <h3 className="mt-5 text-xl font-bold">Discovery</h3>
      <p className="mt-3 text-zinc-400">
        We learn about your business and challenges.
      </p>
    </div>

    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 text-center">
      <div className="text-5xl font-bold text-cyan-400">2</div>
      <h3 className="mt-5 text-xl font-bold">Strategy</h3>
      <p className="mt-3 text-zinc-400">
        We design the best AI solution for your needs.
      </p>
    </div>

    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 text-center">
      <div className="text-5xl font-bold text-cyan-400">3</div>
      <h3 className="mt-5 text-xl font-bold">Implementation</h3>
      <p className="mt-3 text-zinc-400">
        Our team builds and integrates your AI system.
      </p>
    </div>

    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 text-center">
      <div className="text-5xl font-bold text-cyan-400">4</div>
      <h3 className="mt-5 text-xl font-bold">Growth</h3>
      <p className="mt-3 text-zinc-400">
        Monitor results and continuously improve performance.
      </p>
    </div>

  </div>

</section>
{/* Final CTA */}

<section className="max-w-7xl mx-auto px-6 pb-32">

  <div className="relative overflow-hidden rounded-[40px] border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-zinc-900 to-purple-500/10 p-16 text-center">

    <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"></div>

    <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl"></div>

    <div className="relative">

      <p className="uppercase tracking-[6px] text-cyan-400 font-semibold">
        READY TO GROW?
      </p>

      <h2 className="mt-6 text-5xl font-bold">
        Transform Your Business With AI
      </h2>

      <p className="mt-6 max-w-3xl mx-auto text-zinc-400 text-lg leading-relaxed">
        Join businesses already using Agentix AI to automate customer support,
        sales, operations and business workflows.
      </p>

      <div className="mt-10 flex justify-center gap-5 flex-wrap">

        <a
          href="/book-demo"
          className="rounded-xl bg-brand-gradient px-8 py-4 font-semibold hover:scale-105 transition"
        >
          🚀 Book Free Demo
        </a>

        <a
          href="/contact"
          className="rounded-xl border border-zinc-700 px-8 py-4 hover:border-cyan-400 transition"
        >
          Contact Us
        </a>

      </div>

    </div>

  </div>

</section>
    </div>
  );
}