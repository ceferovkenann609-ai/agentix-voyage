import { useMemo, useState } from "react";
import { Sparkles, Send, Bot, CheckCircle2 } from "lucide-react";

type Recommendation = {
  title: string;
  services: string[];
  roi: string;
  deploy: string;
};

const recommendations: Record<string, Recommendation> = {
  restaurant: {
    title: "Restaurant AI Package",
    services: [
      "AI Waiter Chatbot",
      "WhatsApp Orders",
      "Reservation Automation",
      "Google Reviews Assistant",
    ],
    roi: "+38% More Reservations",
    deploy: "3 Days",
  },

  ecommerce: {
    title: "E-commerce AI Package",
    services: [
      "AI Sales Assistant",
      "Product Recommendation",
      "Order Tracking",
      "Customer Support",
    ],
    roi: "+27% Sales",
    deploy: "2 Days",
  },

  clinic: {
    title: "Healthcare AI Package",
    services: [
      "Appointment Booking",
      "Patient FAQ",
      "Voice Receptionist",
      "Reminder Automation",
    ],
    roi: "-60% Reception Work",
    deploy: "4 Days",
  },

  default: {
    title: "Business AI Package",
    services: [
      "AI Chatbot",
      "Lead Generation",
      "Workflow Automation",
      "CRM Integration",
    ],
    roi: "+42% Productivity",
    deploy: "5 Days",
  },
};

export default function AIDemo() {
  const [text, setText] = useState("");

  const result = useMemo(() => {
    const value = text.toLowerCase();

    if (
      value.includes("restaurant") ||
      value.includes("cafe") ||
      value.includes("food")
    )
      return recommendations.restaurant;

    if (
      value.includes("shop") ||
      value.includes("store") ||
      value.includes("ecommerce")
    )
      return recommendations.ecommerce;

    if (
      value.includes("clinic") ||
      value.includes("hospital") ||
      value.includes("doctor")
    )
      return recommendations.clinic;

    return recommendations.default;
  }, [text]);

  return (
    <section className="py-28">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
            <Sparkles size={16} />
            Live AI Demo
          </div>

          <h2 className="text-5xl font-bold mt-6">
            Talk With Agentix AI
          </h2>

          <p className="text-muted-foreground mt-5 max-w-2xl mx-auto">
            Describe your business and instantly receive AI recommendations.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          <div className="gradient-border rounded-3xl p-8">

            <div className="flex items-center gap-3 mb-6">
              <Bot />
              <h3 className="text-2xl font-semibold">
                AI Consultant
              </h3>
            </div>

            <textarea
              rows={7}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Example: I own a restaurant..."
              className="w-full rounded-xl bg-black border border-zinc-700 p-4"
            />

            <button className="mt-6 bg-brand-gradient rounded-xl px-6 py-3 text-white flex items-center gap-2">
              <Send size={18} />
              Analyze Business
            </button>

          </div>

          <div className="gradient-border rounded-3xl p-8">

            <h3 className="text-2xl font-bold">
              {result.title}
            </h3>

            <div className="mt-8 space-y-4">

              {result.services.map((service) => (
                <div
                  key={service}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="text-green-400" size={20} />
                  {service}
                </div>
              ))}

            </div>

            <div className="mt-10 border-t border-zinc-800 pt-8">

              <div className="flex justify-between">
                <span>Estimated ROI</span>
                <strong>{result.roi}</strong>
              </div>

              <div className="flex justify-between mt-4">
                <span>Deployment</span>
                <strong>{result.deploy}</strong>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}