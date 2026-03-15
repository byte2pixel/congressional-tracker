import { createFileRoute } from "@tanstack/react-router";
import PoliticianComparisonPage from "@/dashboard/components/PoliticianComparisonPage";

export const Route = createFileRoute("/politician-compare")({
  component: PoliticianComparisonPage,
  validateSearch: (search: Record<string, unknown>) => ({
    id1: String(search.id1 ?? ""),
    id2: String(search.id2 ?? ""),
  }),
  staticData: {
    getTitle: () => "Politician Comparison",
  },
});
