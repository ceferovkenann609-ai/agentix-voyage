import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
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
  component: LoginPage,
});

function LoginPage() {
  const { i18n } = useTranslation();
  const isAz = i18n.resolvedLanguage !== "en";
  return (
    <PagePlaceholder
      eyebrow={isAz ? "Daxil ol" : "Login"}
      title={isAz ? "Yenidən xoş gəlmisiniz" : "Welcome back"}
      description={isAz ? "AI agentlərinizi idarə etmək üçün Agentix iş sahənizə daxil olun." : "Sign in to your Agentix workspace to manage your AI agents."}
    />
  );
}
