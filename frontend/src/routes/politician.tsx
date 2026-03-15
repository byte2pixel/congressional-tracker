import { createFileRoute } from "@tanstack/react-router";
import PoliticiansGrid from "@/dashboard/components/PoliticiansGrid";

export const Route = createFileRoute("/politician")({
  component: PoliticiansGrid,
  staticData: {
    getTitle: () => "Politicians",
  },
});
