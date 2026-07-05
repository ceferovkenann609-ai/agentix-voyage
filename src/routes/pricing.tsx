import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "../components/site/PagePlaceholder";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Agentix" },
      { name: "description", content: "Flexible pricing that scales with your AI workforce." },
      { property: "og:title", content: "Pricing — Agentix" },
      { property: "og:description", content: "Flexible pricing that scales with your AI workforce." },
    ],
  }),
  component: () => (
    <PagePlaceholder
      eyebrow="Pricing"
      title="Simple pricing that scales with you"
      description="Start with a pilot, scale to an enterprise AI workforce. Transparent tiers, no per-seat traps."
    />
  ),
});
