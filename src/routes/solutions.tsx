import { createFileRoute } from "@tanstack/react-router";
import Solutions from "../components/site/Solutions";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Solutions — Agentix" },
      { name: "description", content: "Industry-specific AI solutions built on Agentix." },
      { property: "og:title", content: "Solutions — Agentix" },
      { property: "og:description", content: "Industry-specific AI solutions built on Agentix." },
    ],
  }),
  component: Solutions,
});