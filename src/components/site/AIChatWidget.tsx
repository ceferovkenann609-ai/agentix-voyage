import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, X, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Msg = { sender: "ai" | "user"; text: string };

const REPLIES: { az: { match: RegExp; reply: string }[]; en: { match: RegExp; reply: string }[] } = {
  az: [
    { match: /restoran|kafe|yemək/i, reply: "🍽️ Restoran üçün AI rezervasiya, WhatsApp sifariş və AI ofisiant tövsiyə edirəm." },
    { match: /klinik|həkim|tibb/i, reply: "🏥 Klinika üçün onlayn qeydiyyat, səsli resepşn və pasient dəstəyi AI həllərimiz var." },
    { match: /mağaza|shop|onlayn satış|e-commerce/i, reply: "🛒 Mağaza üçün AI satış köməkçisi, məhsul tövsiyələri və sifariş izləmə uyğundur." },
    { match: /qiymət|price|neçəyə/i, reply: "💎 Paketlərimiz Starter-dən Enterprise-a qədərdir. Qiymət səhifəsinə baxa və ya demo sifariş edə bilərsiniz." },
    { match: /demo|nümayiş/i, reply: "🎬 30 dəqiqəlik canlı demo təşkil edə bilərik. 'Book a Demo' düyməsinə klikləyin." },
    { match: /salam|hi|hello|necəsən/i, reply: "👋 Salam! Bizneslə bağlı sualınızı yazın — sizə uyğun AI həllini təklif edim." },
  ],
  en: [
    { match: /restaurant|cafe|food/i, reply: "🍽️ For a restaurant I recommend AI Reservations, WhatsApp Orders and an AI Waiter." },
    { match: /clinic|doctor|medical|health/i, reply: "🏥 For a clinic: online booking, voice receptionist and patient support AI." },
    { match: /shop|store|ecommerce|e-commerce/i, reply: "🛒 For a shop: AI sales assistant, product recommendations and order tracking." },
    { match: /price|pricing|cost/i, reply: "💎 Our plans range from Starter to Enterprise. Check the Pricing page or book a demo." },
    { match: /demo/i, reply: "🎬 We can run a live 30-minute demo — just tap the 'Book a Demo' button." },
    { match: /hi|hello|hey/i, reply: "👋 Hi! Tell me about your business and I'll suggest the right AI setup." },
  ],
};

export default function AIChatWidget() {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const isAz = i18n.resolvedLanguage !== "en";
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const sessionId = useMemo(() => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }, []);
  const [messages, setMessages] = useState<Msg[]>([
    { sender: "ai", text: isAz ? "👋 Salam! Mən Agentix AI-yam. Biznesiniz haqqında danışın." : "👋 Hi! I'm Agentix AI. Tell me about your business." },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const persist = (sender: "user" | "ai", text: string) => {
    void supabase
      .from("chat_messages")
      .insert({ session_id: sessionId, sender, message: text, locale: i18n.resolvedLanguage ?? null, user_id: user?.id ?? null })
      .then(({ error }) => {
        if (error) console.error("[chat] insert failed", error);
      });
  };

  const sendMessage = () => {
    const text = message.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setMessage("");
    setTyping(true);
    persist("user", text);

    const rules = isAz ? REPLIES.az : REPLIES.en;
    const match = rules.find((r) => r.match.test(text));
    const fallback = isAz
      ? "Bunun üçün pulsuz demo təşkil etməyi tövsiyə edirəm — sizə uyğun AI həllini birlikdə quraq."
      : "I recommend booking a free demo so we can design the right AI solution for you.";
    const reply = match ? match.reply : fallback;

    window.setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
      setTyping(false);
      persist("ai", reply);
    }, 700 + Math.random() * 500);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label={isAz ? "AI köməkçini aç" : "Open AI assistant"}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient text-white shadow-2xl hover:scale-105 transition"
      >
        {open ? <X size={28} /> : <Bot size={28} />}
      </button>

      {open && (
        <div className="fixed bottom-28 right-6 z-50 w-[360px] rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl">
          <div className="rounded-t-3xl bg-brand-gradient p-5">
            <h3 className="text-xl font-bold text-white">Agentix AI</h3>
            <p className="mt-1 text-sm text-white/80">
              {isAz ? "Bizneslə bağlı hər şeyi soruşun." : "Ask anything about your business."}
            </p>
          </div>

          <div ref={scrollRef} className="h-[300px] overflow-y-auto space-y-3 p-5">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === "user"
                    ? "ml-auto w-fit max-w-[80%] rounded-2xl bg-cyan-500 p-3 text-black"
                    : "w-fit max-w-[80%] rounded-2xl bg-zinc-800 p-3 text-white"
                }
              >
                {msg.text}
              </div>
            ))}
            {typing && (
              <div className="w-fit rounded-2xl bg-zinc-800 p-3">
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-zinc-800 p-4">
            <div className="flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={isAz ? "Mesajınızı yazın..." : "Type your message..."}
                className="flex-1 rounded-xl border border-zinc-700 bg-black p-3 text-white outline-none"
              />
              <button
                type="button"
                onClick={sendMessage}
                aria-label={isAz ? "Göndər" : "Send"}
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
