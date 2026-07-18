import { useState } from "react";
export default function BookDemo() {
const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState(false);

const handleSubmit = () => {
  setLoading(true);

  setTimeout(() => {
    setLoading(false);
    setSuccess(true);
  }, 2000);
};


  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">

        <p className="uppercase tracking-[6px] text-cyan-400 font-semibold">
          BOOK A DEMO
        </p>

        <h1 className="mt-6 text-6xl font-bold">
          Let's Build Your AI Solution
        </h1>

        <p className="mt-8 max-w-3xl mx-auto text-xl text-gray-400">
          Tell us about your business and schedule a free consultation with the Agentix team.
        </p>

      </section>
    {/* Demo Form */}

<section className="max-w-7xl mx-auto px-6 pb-24">



  <div className="grid lg:grid-cols-3 gap-8">



    {/* Form */}

    <div className="lg:col-span-2 rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-10">



      <h2 className="text-3xl font-bold">

        Schedule Your Free Demo

      </h2>



      <p className="mt-3 text-zinc-400">

        Fill out the form below and our team will contact you shortly.

      </p>



      <div className="grid md:grid-cols-2 gap-6 mt-8">



        <input

          type="text"

          placeholder="Full Name"

          className="bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400"

        />



        <input

          type="email"

          placeholder="Business Email"

          className="bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400"

        />



        <input

          type="text"

          placeholder="Company Name"

          className="bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400"

        />



        <input

          type="text"

          placeholder="Phone Number"

          className="bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400"

        />



      </div>



      <select className="mt-6 w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400">



        <option>Select a Service</option>

        <option>AI Chatbots</option>

        <option>Voice AI</option>

        <option>AI Automation</option>

        <option>AI Websites</option>

        <option>AI Marketing</option>

        <option>Custom AI Solutions</option>



      </select>



      <textarea

        rows={6}

        placeholder="Tell us about your project..."

        className="mt-6 w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400"

      />



      <button
  onClick={handleSubmit}
  disabled={loading}
  className="mt-8 w-full rounded-xl bg-brand-gradient p-4 text-lg font-bold text-white hover:opacity-90 transition disabled:opacity-50"
>
  {loading ? "Sending..." : "Book My Demo"}
</button>
{success && (
  <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center text-green-400">
    ✅ Thank you! Your demo request has been received.
    <br />
    Our team will contact you within 24 hours.
  </div>
)}

    </div>

{/* Contact Card */}

    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-8">

      <h3 className="text-2xl font-bold">
        Why Book a Demo?
      </h3>

      <p className="mt-3 text-zinc-400">
        Discover how AI can transform your business.
      </p>

      <div className="mt-8 space-y-6">

        <div>
          ✅ Personalized AI Strategy
        </div>

        <div>
          ✅ Live Product Walkthrough
        </div>

        <div>
          ✅ Business Automation Plan
        </div>

        <div>
          ✅ Free Consultation
        </div>

      </div>

    </div>

  </div>
</section>

    </div>
    
  );
}