import { createFileRoute } from "@tanstack/react-router";
import AboutPage from "@/dashboard/pages/AboutPage";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  staticData: {
    getTitle: () => "About",
  },
});
