import { createFileRoute } from "@tanstack/react-router";
import PoliticianDetailPage from "@/dashboard/components/PoliticianDetailPage";

export const Route = createFileRoute("/politician_/$bioguideid")({
  component: PoliticianDetailPage,
  staticData: {
    getTitle: () => "Politician Detail",
  },
});
