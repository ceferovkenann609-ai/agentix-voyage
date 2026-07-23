import { createFileRoute } from "@tanstack/react-router";
import { Home } from "../components/site/Home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Agentix — Enterprise AI Automation" },
      {
        name: "description",
        content:
          "Agentix builds enterprise AI agents for support, sales, lead generation, workflow automation and CRM operations.",
      },
      { property: "og:title", content: "Agentix — Enterprise AI Automation" },
      {
        property: "og:description",
        content:
          "Premium AI automation for companies across Azerbaijan, Turkey, UAE and Europe.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});
