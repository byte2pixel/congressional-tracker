import { createFileRoute } from "@tanstack/react-router";
import StocksGrid from "@/dashboard/components/StocksGrid";

export const Route = createFileRoute("/stock")({
  component: StocksGrid,
  staticData: {
    getTitle: () => "Stocks",
  },
});
