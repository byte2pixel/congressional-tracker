import { createFileRoute } from "@tanstack/react-router";
import PoliticianDetailPage from "@/dashboard/pages/PoliticianDetailPage";

export const Route = createFileRoute("/politician_/$bioguideid")({
  component: PoliticianDetailPage,
  staticData: {
    getTitle: () => "Politician Detail",
  },
});
