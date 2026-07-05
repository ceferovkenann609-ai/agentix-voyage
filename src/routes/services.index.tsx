import { createFileRoute } from "@tanstack/react-router";
import ServicesPage from "../components/site/Services";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "AI Services for Modern Businesses — Agentix" },
      {
        name: "description",
        content:
          "Explore Agentix's AI services: chatbots, voice agents, lead generation, customer support, workflow automation, and CRM integration.",
      },
      { property: "og:title", content: "AI Services for Modern Businesses — Agentix" },
      {
        property: "og:description",
        content:
          "Intelligent AI solutions that automate customer communication, sales, support, and business operations.",
      },
    ],
  }),
  component: ServicesPage,
});
