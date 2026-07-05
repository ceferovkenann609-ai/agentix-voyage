import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "../components/site/PagePlaceholder";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Agentix" },
      { name: "description", content: "Sign in to your Agentix workspace." },
      { property: "og:title", content: "Login — Agentix" },
      { property: "og:description", content: "Sign in to your Agentix workspace." },
    ],
  }),
  component: () => (
    <PagePlaceholder
      eyebrow="Login"
      title="Welcome back"
      description="Sign in to your Agentix workspace to manage your AI agents."
    />
  ),
});
