import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "../components/site/PagePlaceholder";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Agentix" },
      { name: "description", content: "Get in touch with the Agentix team." },
      { property: "og:title", content: "Contact — Agentix" },
      { property: "og:description", content: "Get in touch with the Agentix team." },
    ],
  }),
  component: () => (
    <PagePlaceholder
      eyebrow="Contact"
      title="Let's talk about your AI roadmap"
      description="Tell us about your workflows and we'll respond within one business day."
    />
  ),
});
