import { createFileRoute } from "@tanstack/react-router";
import StockDetailPage from "@/dashboard/pages/StockDetailPage";

export const Route = createFileRoute("/stock_/$symbol")({
  component: StockDetailPage,
  staticData: {
    getTitle: () => "Stock Detail",
  },
});
