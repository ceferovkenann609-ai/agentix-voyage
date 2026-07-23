import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  message: string;
};

const initial: FormState = {
  name: "",
  email: "",
  company: "",
  phone: "",
  service: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Valid email required";
    if (!form.message.trim() || form.message.trim().length < 10) next.message = "Please add a short message (10+ chars)";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setStatus("success");
      setForm(initial);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="uppercase tracking-[6px] text-cyan-400 font-semibold">CONTACT US</p>
        <h1 className="mt-6 text-5xl md:text-6xl font-bold">Let's Build Your AI Workforce</h1>
        <p className="mt-8 max-w-3xl mx-auto text-xl text-gray-400">
          Tell us about your business and we'll show you how AI can automate your workflows, customer support, sales, and operations.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-3 gap-8">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="lg:col-span-2 rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-10"
          >
            <div className="grid md:grid-cols-2 gap-6">
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
              <option>CRM Integration</option>
              <option>Workflow Automation</option>
              <option>Lead Generation</option>
              <option>Customer Support</option>
            </select>

            <textarea
              rows={6}
              placeholder="Tell us about your business..."
              value={form.message}
              onChange={update("message")}
              maxLength={1000}
              className="mt-6 w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-400"
            />
            {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}

            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-8 w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 transition p-4 text-black font-bold text-lg disabled:opacity-60"
            >
              {status === "loading" ? "Sending..." : "Book Free Consultation"}
            </button>

            {status === "success" && (
              <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center text-green-400">
                ✅ Thank you! We'll get back to you within 24 hours.
              </div>
            )}
            {status === "error" && (
              <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-red-400">
                Something went wrong. Please try again or email hello@agentix.ai.
              </div>
            )}
            <p className="mt-5 text-center text-sm text-zinc-500">
              🔒 Your information is secure and will never be shared.
            </p>
          </form>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-8">
            <h3 className="text-2xl font-bold">Contact Information</h3>
            <p className="mt-3 text-zinc-400">We usually reply within 24 hours.</p>
            <div className="mt-8 space-y-6">
              <div>
                <p className="text-zinc-500 text-sm">Email</p>
                <a href="mailto:hello@agentix.ai" className="font-semibold hover:text-cyan-400">hello@agentix.ai</a>
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
                <p className="font-semibold">Monday – Friday</p>
                <p className="text-zinc-400">09:00 – 18:00</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
