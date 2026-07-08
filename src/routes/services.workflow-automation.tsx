import { createFileRoute } from "@tanstack/react-router";
import WorkflowAutomationPage from "../components/site/WorkflowAutomation";

export const Route = createFileRoute("/services/workflow-automation")({
  head: () => ({
    meta: [
      { title: "AI Workflow Automation — Agentix" },
      { name: "description", content: "Chain multi-step business processes with intelligent, context-aware AI agents." },
      { property: "og:title", content: "AI Workflow Automation — Agentix" },
      { property: "og:description", content: "Automate any process across your tools with AI agents." },
    ],
  }),
  component: WorkflowAutomationPage,
});
