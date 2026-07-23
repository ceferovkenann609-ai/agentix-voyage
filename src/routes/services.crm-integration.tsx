import { createFileRoute } from "@tanstack/react-router";
import CRMIntegrationPage from "../components/site/CRMIntegration";

export const Route = createFileRoute("/services/crm-integration")({
  head: () => ({
    meta: [
      { title: "CRM Integration — Agentix" },
      { name: "description", content: "Sync every conversation into Salesforce, HubSpot, Zoho, and 50+ platforms in real time." },
      { property: "og:title", content: "CRM Integration — Agentix" },
      { property: "og:description", content: "Every AI interaction auto-logged into your CRM." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CRMIntegrationPage,
});
