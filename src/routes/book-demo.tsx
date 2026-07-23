import { createFileRoute } from "@tanstack/react-router";
import BookDemo from "../components/site/BookDemo";

export const Route = createFileRoute("/book-demo")({
  head: () => ({
    meta: [
      { title: "Book a Demo — Agentix AI Automation" },
      { name: "description", content: "Book a free Agentix demo and see AI automation opportunities for your business." },
      { property: "og:title", content: "Book a Demo — Agentix AI Automation" },
      { property: "og:description", content: "Schedule a consultation with Agentix to explore AI agents for support, sales and operations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookDemo,
});