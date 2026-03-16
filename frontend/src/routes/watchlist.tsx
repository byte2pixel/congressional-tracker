import { createFileRoute } from "@tanstack/react-router";
import WatchlistPage from "@/dashboard/pages/WatchlistPage";

export const Route = createFileRoute("/watchlist")({
  component: WatchlistPage,
  staticData: {
    getTitle: () => "Watchlist",
  },
});
