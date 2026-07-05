import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "../components/site/PagePlaceholder";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Solutions — Agentix" },
      { name: "description", content: "Industry-specific AI solutions built on Agentix." },
      { property: "og:title", content: "Solutions — Agentix" },
      { property: "og:description", content: "Industry-specific AI solutions built on Agentix." },
    ],
  }),
  component: () => (
    <PagePlaceholder
      eyebrow="Solutions"
      title="AI solutions tailored to your industry"
      description="E-commerce, SaaS, healthcare, finance, real estate — Agentix ships pre-configured agents for the workflows that matter most."
    />
  ),
});
