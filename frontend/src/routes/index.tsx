import { createFileRoute } from "@tanstack/react-router";
import MainPage from "@/dashboard/pages/MainPage";

export const Route = createFileRoute("/")({
  component: MainPage,
  staticData: {
    getTitle: () => "Home",
  },
});
