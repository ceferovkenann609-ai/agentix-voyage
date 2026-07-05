import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "../components/site/PagePlaceholder";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — Agentix" },
      { name: "description", content: "AI chatbots, voice agents, lead generation, and more." },
      { property: "og:title", content: "Services — Agentix" },
      { property: "og:description", content: "AI chatbots, voice agents, lead generation, and more." },
    ],
  }),
  component: () => (
    <PagePlaceholder
      eyebrow="Services"
      title="Purpose-built AI for every workflow"
      description="Chatbots, voice agents, lead generation, customer support, workflow automation, and CRM integration — all managed for you."
    />
  ),
});
