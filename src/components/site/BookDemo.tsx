import { useState, type ChangeEvent, type FormEvent } from "react";

type DemoForm = {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  message: string;
};

const initialForm: DemoForm = {
  name: "",
  email: "",
  company: "",
  phone: "",
  service: "",
  message: "",
};

export default function BookDemo() {
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

    if (!form.name.trim()) next.name = "Full name is required";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Valid business email is required";
    if (!form.service.trim()) next.service = "Please select a service";
    if (form.message.trim().length > 0 && form.message.trim().length < 10) {
      next.message = "Please add at least 10 characters or leave it blank";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);

    window.setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm(initialForm);
    }, 900);
  };


  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="uppercase tracking-[6px] text-cyan-400 font-semibold">BOOK A DEMO</p>
        <h1 className="mt-6 text-6xl font-bold">Let's Build Your AI Solution</h1>
        <p className="mt-8 max-w-3xl mx-auto text-xl text-gray-400">
          Tell us about your business and schedule a free consultation with the Agentix team.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-3 gap-8">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="lg:col-span-2 rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-10"
          >
            <h2 className="text-3xl font-bold">Schedule Your Free Demo</h2>
            <p className="mt-3 text-zinc-400">Fill out the form below and our team will contact you shortly.</p>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={update("name")}
                  maxLength={100}
                  className="w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400"
                />
                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Business Email"
                  value={form.email}
                  onChange={update("email")}
                  maxLength={255}
                  className="w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400"
                />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
              </div>

              <input
                type="text"
                placeholder="Company Name"
                value={form.company}
                onChange={update("company")}
                maxLength={100}
                className="bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={update("phone")}
                maxLength={30}
                className="bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400"
              />
            </div>

            <select
              value={form.service}
              onChange={update("service")}
              className="mt-6 w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400"
            >
              <option value="">Select a Service</option>
              <option>AI Chatbots</option>
              <option>Voice AI</option>
              <option>Lead Generation</option>
              <option>Customer Support</option>
              <option>Workflow Automation</option>
              <option>CRM Integration</option>
            </select>
            {errors.service && <p className="mt-1 text-sm text-red-400">{errors.service}</p>}

            <textarea
              rows={6}
              placeholder="Tell us about your project..."
              value={form.message}
              onChange={update("message")}
              maxLength={1000}
              className="mt-6 w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400"
            />
            {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}

            <button
              type="submit"
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
          </form>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-8">
            <h3 className="text-2xl font-bold">Why Book a Demo?</h3>
            <p className="mt-3 text-zinc-400">Discover how AI can transform your business.</p>

            <div className="mt-8 space-y-6">
              <div>✅ Personalized AI Strategy</div>
              <div>✅ Live Product Walkthrough</div>
              <div>✅ Business Automation Plan</div>
              <div>✅ Free Consultation</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}