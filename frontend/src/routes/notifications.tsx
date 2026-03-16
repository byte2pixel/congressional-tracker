import { createFileRoute } from "@tanstack/react-router";
import NotificationsPage from "@/dashboard/pages/NotificationsPage";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
  staticData: {
    getTitle: () => "Notifications",
  },
});
