import { createFileRoute } from "@tanstack/react-router";
import BookDemo from "../components/site/BookDemo";

export const Route = createFileRoute("/book-demo")({
  component: BookDemo,
});