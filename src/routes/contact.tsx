import { createFileRoute } from "@tanstack/react-router";
import Contact from "../components/site/Contact";

export const Route = createFileRoute("/contact")({
  component: Contact,
});