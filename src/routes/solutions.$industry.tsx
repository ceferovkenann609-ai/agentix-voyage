import { createFileRoute } from "@tanstack/react-router";
import IndustrySolution from "../components/site/IndustrySolution";

export const Route = createFileRoute("/solutions/$industry")({
  head: ({ params }) => {
    const industry = params.industry
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    return {
      meta: [
        { title: `${industry} AI Solutions — Agentix` },
        { name: "description", content: `AI automation solutions for ${industry.toLowerCase()} businesses by Agentix.` },
        { property: "og:title", content: `${industry} AI Solutions — Agentix` },
        { property: "og:description", content: `Industry-specific AI agents and workflow automation for ${industry.toLowerCase()}.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: IndustrySolution,
});
