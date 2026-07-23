import { createFileRoute } from "@tanstack/react-router";
import About from "../components/site/About";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Agentix — AI Automation Company" },
      { name: "description", content: "Learn about Agentix, an AI automation company building AI agents for modern businesses." },
      { property: "og:title", content: "About Agentix — AI Automation Company" },
      { property: "og:description", content: "Agentix helps companies work faster, smarter and more efficiently with AI automation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});