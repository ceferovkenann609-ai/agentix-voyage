import { createFileRoute } from "@tanstack/react-router";
import CustomerSupportPage from "../components/site/CustomerSupport";

export const Route = createFileRoute("/services/customer-support")({
  head: () => ({
    meta: [
      { title: "AI Customer Support — Agentix" },
      { name: "description", content: "Resolve up to 80% of tickets instantly with tier-1 AI support agents." },
      { property: "og:title", content: "AI Customer Support — Agentix" },
      { property: "og:description", content: "Instant, multilingual customer support powered by AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CustomerSupportPage,
});
