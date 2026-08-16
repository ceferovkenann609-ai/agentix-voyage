import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { streamText, type ModelMessage } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider, DEFAULT_AGENT_MODEL } from "./ai-gateway.server";

const AgentChatInput = z.object({
  agentId: z.string().uuid(),
  sessionId: z.string().min(1),
  message: z.string().min(1).max(4000),
  locale: z.string().nullable().optional(),
});

const SiteChatInput = z.object({
  sessionId: z.string().min(1),
  message: z.string().min(1).max(2000),
  locale: z.string().nullable().optional(),
});

const HISTORY_LIMIT = 20;

function readApiKey(): string {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI xidməti konfiqurasiya edilməmişdir.");
  return key;
}

/**
 * Real AI execution for a company-owned agent.
 *
 * Flow: user message -> persisted in ai_chat_messages -> agent prompt/model +
 * recent history -> Lovable AI Gateway -> reply persisted in ai_chat_messages.
 * All database access uses the caller's RLS-scoped client, so an agent from
 * another company simply is not visible and the call fails.
 */
export const runAgentChat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => AgentChatInput.parse(data))
  .handler(async ({ data, context }) => {
    const apiKey = readApiKey();
    const { supabase, userId } = context;

    const { data: agent, error: agentError } = await supabase
      .from("ai_agents")
      .select("id, name, kind, status, language, model, system_prompt, description")
      .eq("id", data.agentId)
      .maybeSingle();

    if (agentError) throw new Error(agentError.message);
    if (!agent) throw new Error("Agent tapılmadı və ya icazəniz yoxdur.");
    if (agent.status === "paused") throw new Error("Bu agent dayandırılıb.");

    const { data: history } = await supabase
      .from("ai_chat_messages")
      .select("sender, message, created_at")
      .eq("session_id", data.sessionId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(HISTORY_LIMIT);

    const { error: userInsertError } = await supabase.from("ai_chat_messages").insert({
      session_id: data.sessionId,
      user_id: userId,
      sender: "user",
      message: data.message,
      locale: data.locale ?? null,
    });
    if (userInsertError) throw new Error(userInsertError.message);

    const language = data.locale ?? agent.language ?? "az";
    const system = [
      agent.system_prompt?.trim() ||
        `Sən Agentix platformasının "${agent.name}" adlı AI agentisən (${agent.kind}). Müştərilərə peşəkar, qısa və faydalı cavab ver.`,
      agent.description ? `Agent təsviri: ${agent.description}` : null,
      `Cavabı bu dildə yaz: ${language === "en" ? "English" : "Azərbaycan dili"}.`,
    ]
      .filter(Boolean)
      .join("\n\n");

    const messages: ModelMessage[] = [
      ...(history ?? [])
        .slice()
        .reverse()
        .map((row) => ({
          role: row.sender === "user" ? ("user" as const) : ("assistant" as const),
          content: row.message,
        })),
      { role: "user", content: data.message },
    ];

    const gateway = createLovableAiGatewayProvider(apiKey);

    let reply: string;
    try {
      const result = streamText({
        model: gateway(agent.model || DEFAULT_AGENT_MODEL),
        system,
        messages,
      });
      reply = (await result.text).trim();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("429")) throw new Error("AI limiti aşıldı, bir az sonra yenidən yoxlayın.");
      if (message.includes("402")) throw new Error("AI kreditləri bitdi. Zəhmət olmasa balansı artırın.");
      throw new Error(`AI cavabı alınmadı: ${message}`);
    }

    if (!reply) throw new Error("AI boş cavab qaytardı.");

    const { error: aiInsertError } = await supabase.from("ai_chat_messages").insert({
      session_id: data.sessionId,
      user_id: userId,
      sender: "ai",
      message: reply,
      locale: data.locale ?? null,
    });
    if (aiInsertError) throw new Error(aiInsertError.message);

    return { reply, agentId: agent.id, model: agent.model || DEFAULT_AGENT_MODEL };
  });

/**
 * Public website assistant used by the floating chat widget. Unauthenticated by
 * design; message persistence is handled by the widget through the existing
 * anon insert policy on ai_chat_messages.
 */
export const runSiteAssistantChat = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => SiteChatInput.parse(data))
  .handler(async ({ data }) => {
    const apiKey = readApiKey();
    const gateway = createLovableAiGatewayProvider(apiKey);
    const isEn = data.locale === "en";

    const result = streamText({
      model: gateway(DEFAULT_AGENT_MODEL),
      system: isEn
        ? "You are Agentix AI, the assistant of Agentix — an enterprise AI automation company (AI chatbots, voice AI, lead generation, customer support, workflow automation, CRM integration) serving Azerbaijan, Turkey, UAE and Europe. Answer in English, max 4 sentences, and suggest booking a demo when relevant. Never invent prices."
        : "Sən Agentix AI-san — Agentix şirkətinin köməkçisi. Agentix müəssisə səviyyəsində AI avtomatlaşdırma həlləri təqdim edir (AI çatbotlar, səsli AI, lead generasiya, müştəri dəstəyi, iş axını avtomatlaşdırması, CRM inteqrasiyası); bazarlar: Azərbaycan, Türkiyə, BƏƏ və Avropa. Azərbaycan dilində, maksimum 4 cümlə ilə cavab ver və uyğun olduqda demo sifarişi təklif et. Qiymət uydurma.",
      prompt: data.message,
    });

    const reply = (await result.text).trim();
    if (!reply) throw new Error("AI boş cavab qaytardı.");
    return { reply };
  });
