import { createFileRoute } from "@tanstack/react-router";
import About from "../components/site/About";

export const Route = createFileRoute("/about")({
  component: About,
});