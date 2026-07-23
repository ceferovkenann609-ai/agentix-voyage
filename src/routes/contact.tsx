import { createFileRoute } from "@tanstack/react-router";
import Contact from "../components/site/Contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Agentix — AI Automation Experts" },
      { name: "description", content: "Contact Agentix to discuss AI chatbots, voice agents, workflow automation and CRM integration." },
      { property: "og:title", content: "Contact Agentix — AI Automation Experts" },
      { property: "og:description", content: "Tell Agentix about your business and get an AI automation consultation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});