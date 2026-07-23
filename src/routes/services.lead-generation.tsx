import { createFileRoute } from "@tanstack/react-router";
import LeadGenerationPage from "../components/site/LeadGeneration";

export const Route = createFileRoute("/services/lead-generation")({
  head: () => ({
    meta: [
      { title: "AI Lead Generation — Agentix" },
      { name: "description", content: "Qualify, score, and route leads to your sales team around the clock with AI." },
      { property: "og:title", content: "AI Lead Generation — Agentix" },
      { property: "og:description", content: "Fill your pipeline with qualified, sales-ready leads on autopilot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LeadGenerationPage,
});
