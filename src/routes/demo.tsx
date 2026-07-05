import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "../components/site/PagePlaceholder";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Book a Demo — Agentix" },
      { name: "description", content: "See Agentix AI agents in action." },
      { property: "og:title", content: "Book a Demo — Agentix" },
      { property: "og:description", content: "See Agentix AI agents in action." },
    ],
  }),
  component: () => (
    <PagePlaceholder
      eyebrow="Book a Demo"
      title="See Agentix in action"
      description="A 30-minute walkthrough tailored to your use case — no slides, just working AI agents."
    />
  ),
});
