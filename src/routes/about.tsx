import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "../components/site/PagePlaceholder";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Agentix" },
      { name: "description", content: "The team building the AI workforce of tomorrow." },
      { property: "og:title", content: "About — Agentix" },
      { property: "og:description", content: "The team building the AI workforce of tomorrow." },
    ],
  }),
  component: () => (
    <PagePlaceholder
      eyebrow="About"
      title="The team building the AI workforce of tomorrow"
      description="We're a team of engineers, designers, and operators obsessed with making AI actually useful for real businesses."
    />
  ),
});
