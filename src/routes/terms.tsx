import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "../components/site/PagePlaceholder";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — Agentix" },
      { name: "description", content: "Agentix terms of use and service conditions overview." },
      { property: "og:title", content: "Terms of Use — Agentix" },
      { property: "og:description", content: "Agentix terms of use and service conditions overview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PagePlaceholder
      eyebrow="Terms"
      title="Terms of Use"
      description="Our full legal terms are being finalized. For commercial terms, contact hello@agentix.ai."
    />
  ),
});