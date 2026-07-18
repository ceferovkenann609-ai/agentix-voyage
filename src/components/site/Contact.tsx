export default function Contact() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="uppercase tracking-[6px] text-cyan-400 font-semibold">
          CONTACT US
        </p>

        <h1 className="mt-6 text-6xl font-bold">
          Let's Build Your AI Workforce
        </h1>

        <p className="mt-8 max-w-3xl mx-auto text-xl text-gray-400">
          Tell us about your business and we'll show you how AI can automate
          your workflows, customer support, sales, and operations.
        </p>
      </section>

      {/* Form */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
  <div className="grid lg:grid-cols-3 gap-8">
      
      <div className="lg:col-span-2 rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-10">  

          <div className="grid md:grid-cols-2 gap-6">

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

          <select
            className="mt-6 w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400"
          >
            <option>Select a Service</option>
            <option>AI Chatbots</option>
            <option>Voice AI</option>
            <option>CRM Integration</option>
            <option>Workflow Automation</option>
            <option>Lead Generation</option>
            <option>Customer Support</option>
          </select>

          <textarea
            rows={6}
            placeholder="Tell us about your business..."
            className="mt-6 w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400"
          />

          <button
            className="mt-8 w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 transition p-4 text-black font-bold text-lg"
          >
            Book Free Consultation
          </button>
<p className="mt-5 text-center text-sm text-zinc-500">
  🔒 Your information is secure and will never be shared.
</p>
        </div>
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-8">

  <h3 className="text-2xl font-bold">
    Contact Information
  </h3>

  <p className="mt-3 text-zinc-400">
    We usually reply within 24 hours.
  </p>

  <div className="mt-8 space-y-6">

    <div>
      <p className="text-zinc-500 text-sm">Email</p>
      <p className="font-semibold">hello@agentix.ai</p>
    </div>

    <div>
      <p className="text-zinc-500 text-sm">Phone</p>
      <p className="font-semibold">+994 XX XXX XX XX</p>
    </div>

    <div>
      <p className="text-zinc-500 text-sm">Location</p>
      <p className="font-semibold">Baku, Azerbaijan</p>
    </div>

    <div>
      <p className="text-zinc-500 text-sm">Business Hours</p>
      <p className="font-semibold">
        Monday - Friday
      </p>
      <p className="text-zinc-400">
        09:00 - 18:00
      </p>
    </div>

  </div>

</div>   {/* Contact Information */}
</div>   {/* Grid */}
</section>
</div>
);
}
