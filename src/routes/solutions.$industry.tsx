import { createFileRoute } from "@tanstack/react-router";
import IndustrySolution from "../components/site/IndustrySolution";

export const Route = createFileRoute("/solutions/$industry")({
  component: IndustrySolution,
});
