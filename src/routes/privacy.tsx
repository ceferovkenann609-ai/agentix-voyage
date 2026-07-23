import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
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
  component: PrivacyPage,
});

function PrivacyPage() {
  const { i18n } = useTranslation();
  const isAz = i18n.resolvedLanguage !== "en";
  return (
    <PagePlaceholder
      eyebrow={isAz ? "Məxfilik" : "Privacy"}
      title={isAz ? "Məxfilik Siyasəti" : "Privacy Policy"}
      description={isAz ? "Tam hüquqi məxfilik siyasətimiz yekunlaşdırılır. Data emalı sualları üçün hello@agentix.ai ünvanına yazın." : "Our full legal privacy policy is being finalized. For data handling questions, contact hello@agentix.ai."}
    />
  );
}