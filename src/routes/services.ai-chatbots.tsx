import { createFileRoute } from "@tanstack/react-router";
import AIChatbotsPage from "../components/site/AIChatbots";

export const Route = createFileRoute("/services/ai-chatbots")({
  head: () => ({
    meta: [
      { title: "AI Chatbots That Work 24/7 — Agentix" },
      {
        name: "description",
        content:
          "Agentix AI Chatbots answer customer questions, generate leads, book appointments, and support your customers 24/7 across every channel.",
      },
      { property: "og:title", content: "AI Chatbots That Work 24/7 — Agentix" },
      {
        property: "og:description",
        content:
          "Human-like AI chatbots for support, sales, bookings, and lead generation. Deployed in days, trained on your data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AIChatbotsPage,
});
