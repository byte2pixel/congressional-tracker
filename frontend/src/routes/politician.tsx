import { createFileRoute } from "@tanstack/react-router";
import PoliticianPage from "@/dashboard/pages/PoliticianPage";

export const Route = createFileRoute("/politician")({
  component: PoliticianPage,
  staticData: {
    getTitle: () => "Politicians",
  },
});
