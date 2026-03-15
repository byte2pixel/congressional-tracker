import { createFileRoute } from "@tanstack/react-router";
import MainGrid from "@/dashboard/components/MainGrid";

export const Route = createFileRoute("/")({
  component: MainGrid,
  staticData: {
    getTitle: () => "Home",
  },
});
