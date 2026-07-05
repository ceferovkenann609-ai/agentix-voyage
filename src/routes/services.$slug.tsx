import { createFileRoute, notFound } from "@tanstack/react-router";
import { PagePlaceholder } from "../components/site/PagePlaceholder";

const SERVICES: Record<string, { title: string; description: string }> = {
  "ai-chatbots": {
    title: "AI Chatbots",
    description: "Human-like conversations across web, mobile, and messaging platforms.",
  },
  "voice-ai": {
    title: "Voice AI Agents",
    description: "Natural-sounding voice agents that handle inbound and outbound calls in real time.",
  },
  "lead-generation": {
    title: "Lead Generation",
    description: "Qualify, score, and route leads to your sales team around the clock.",
  },
  "customer-support": {
    title: "Customer Support",
    description: "Resolve up to 80% of tickets instantly with tier-1 AI support agents.",
  },
  "workflow-automation": {
    title: "Workflow Automation",
    description: "Chain multi-step business processes with intelligent, context-aware agents.",
  },
  "crm-integration": {
    title: "CRM Integration",
    description: "Sync with Salesforce, HubSpot, Zoho, and 50+ platforms out of the box.",
  },
};

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = SERVICES[params.slug];
    if (!service) throw notFound();
    return service;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Agentix` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: `${loaderData.title} — Agentix` },
          { property: "og:description", content: loaderData.description },
        ]
      : [{ title: "Service not found — Agentix" }, { name: "robots", content: "noindex" }],
  }),
  errorComponent: () => (
    <PagePlaceholder eyebrow="Services" title="Something went wrong" description="Please try again." />
  ),
  notFoundComponent: () => (
    <PagePlaceholder
      eyebrow="Services"
      title="Service not found"
      description="The service you're looking for doesn't exist."
    />
  ),
  component: ServicePage,
});

function ServicePage() {
  const { title, description } = Route.useLoaderData();
  return (
    <PagePlaceholder
      eyebrow="Service"
      title={title}
      description={`${description} Detailed pricing, use cases, integrations, and FAQs coming soon.`}
    />
  );
}
