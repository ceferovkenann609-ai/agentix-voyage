import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "../components/site/PagePlaceholder";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Agentix" },
      { name: "description", content: "Agentix privacy policy and data handling overview." },
      { property: "og:title", content: "Privacy Policy — Agentix" },
      { property: "og:description", content: "Agentix privacy policy and data handling overview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PagePlaceholder
      eyebrow="Privacy"
      title="Privacy Policy"
      description="Our full legal privacy policy is being finalized. For data handling questions, contact hello@agentix.ai."
    />
  ),
});