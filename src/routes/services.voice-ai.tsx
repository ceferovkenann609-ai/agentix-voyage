import { createFileRoute } from "@tanstack/react-router";
import VoiceAIPage from "../components/site/VoiceAI";

export const Route = createFileRoute("/services/voice-ai")({
  head: () => ({
    meta: [
      { title: "Voice AI Agents — Agentix" },
      { name: "description", content: "Natural-sounding voice agents that handle inbound and outbound calls in real time, 24/7." },
      { property: "og:title", content: "Voice AI Agents — Agentix" },
      { property: "og:description", content: "Human-like AI voice agents for support, sales, and scheduling." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VoiceAIPage,
});
