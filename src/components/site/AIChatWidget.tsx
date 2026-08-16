import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, X, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AGENTIX_CHAT_OPEN_EVENT } from "@/lib/support-chat";
import { runSiteAssistantChat } from "@/lib/ai.functions";


type Msg = { sender: "ai" | "user"; text: string };


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

  // Lets any page (e.g. /support) open the chat in place via openSupportChat().
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(AGENTIX_CHAT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(AGENTIX_CHAT_OPEN_EVENT, onOpen);
  }, []);


  const persist = (sender: "user" | "ai", text: string) => {
    void supabase
      .from("ai_chat_messages")
      .insert({ session_id: sessionId, sender, message: text, locale: i18n.resolvedLanguage ?? null, user_id: user?.id ?? null })
      .then(({ error }) => {
        if (error) console.error("[chat] insert failed", error);
      });
  };

  const askAssistant = useServerFn(runSiteAssistantChat);

  /** Real AI turn: the key stays server-side inside the server function. */
  const sendMessage = async () => {
    const text = message.trim();
    if (!text || typing) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setMessage("");
    setTyping(true);
    persist("user", text);

    try {
      const { reply } = await askAssistant({
        data: { sessionId, message: text, locale: i18n.resolvedLanguage ?? null },
      });
      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
      persist("ai", reply);
    } catch (error) {
      console.error("[chat] ai request failed", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: isAz
            ? "Bağışlayın, cavab hazırlanarkən xəta baş verdi. Bir az sonra yenidən yazın və ya demo sifariş edin."
            : "Sorry, something went wrong while generating a reply. Please try again shortly or book a demo.",
        },
      ]);
    } finally {
      setTyping(false);
    }
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
