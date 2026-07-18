import { useState } from "react";
import { Bot, X, Send } from "lucide-react";

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
const [messages, setMessages] = useState([
  {
    sender: "ai",
    text: "👋 Hi! I'm Agentix AI. Tell me about your business.",
  },
]);
const sendMessage = () => {
  if (!message.trim()) return;

  const userMessage = {
    sender: "user",
    text: message,
  };

  let aiReply =
    "I recommend booking a free demo so we can build the best AI solution for your business.";

  const text = message.toLowerCase();

  if (text.includes("restaurant")) {
    aiReply =
      "🍽️ For a restaurant I recommend AI Reservations, WhatsApp Orders and an AI Waiter.";
  }

  if (text.includes("clinic")) {
    aiReply =
      "🏥 For a clinic I recommend Appointment Booking, Voice Receptionist and Patient Support AI.";
  }

  if (text.includes("shop")) {
    aiReply =
      "🛒 For a shop I recommend AI Sales Assistant, Product Recommendations and Order Tracking.";
  }

  setMessages([
    ...messages,
    userMessage,
    {
      sender: "ai",
      text: aiReply,
    },
  ]);

  setMessage("");
};
  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient text-white shadow-2xl hover:scale-105 transition"
      >
        {open ? <X size={28} /> : <Bot size={28} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-28 right-6 z-50 w-[360px] rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl">

          <div className="rounded-t-3xl bg-brand-gradient p-5">
            <h3 className="text-xl font-bold text-white">
              Agentix AI
            </h3>

            <p className="mt-1 text-sm text-white/80">
              Ask anything about your business.
            </p>
          </div>

        <div className="h-[300px] overflow-y-auto space-y-3 p-5">
  {messages.map((msg, index) => (
    <div
      key={index}
      className={
        msg.sender === "user"
          ? "ml-auto w-fit max-w-[80%] rounded-2xl bg-cyan-500 p-3 text-black"
          : "w-fit max-w-[80%] rounded-2xl bg-zinc-800 p-3"
      }
    >
      {msg.text}
    </div>
  ))}
</div>  

          <div className="border-t border-zinc-800 p-4">

            <div className="flex gap-2">

              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
}}
                placeholder="Type your message..."
                className="flex-1 rounded-xl border border-zinc-700 bg-black p-3 outline-none"
              />

             <button
  onClick={sendMessage}
  className="rounded-xl bg-brand-gradient px-4 text-white"
>
                <Send size={18} />
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}