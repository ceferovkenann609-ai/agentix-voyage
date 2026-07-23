import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
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
  component: TermsPage,
});

function TermsPage() {
  const { i18n } = useTranslation();
  const isAz = i18n.resolvedLanguage !== "en";
  return (
    <PagePlaceholder
      eyebrow={isAz ? "Şərtlər" : "Terms"}
      title={isAz ? "İstifadə Şərtləri" : "Terms of Use"}
      description={isAz ? "Tam hüquqi şərtlərimiz yekunlaşdırılır. Kommersiya şərtləri üçün hello@agentix.ai ünvanına yazın." : "Our full legal terms are being finalized. For commercial terms, contact hello@agentix.ai."}
    />
  );
}