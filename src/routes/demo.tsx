import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PagePlaceholder } from "../components/site/PagePlaceholder";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Book a Demo — Agentix" },
      { name: "description", content: "See Agentix AI agents in action." },
      { property: "og:title", content: "Book a Demo — Agentix" },
      { property: "og:description", content: "See Agentix AI agents in action." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DemoPage,
});

function DemoPage() {
  const { i18n } = useTranslation();
  const isAz = i18n.resolvedLanguage !== "en";
  return (
    <PagePlaceholder
      eyebrow={isAz ? "Demo" : "Book a Demo"}
      title={isAz ? "Agentix-i iş başında görün" : "See Agentix in action"}
      description={isAz ? "İstifadə halınıza uyğun 30 dəqiqəlik təqdimat — slayd yox, real işləyən AI agentlər." : "A 30-minute walkthrough tailored to your use case — no slides, just working AI agents."}
    />
  );
}
