import { createFileRoute } from "@tanstack/react-router";
import PoliticianDetailPage from "@/dashboard/components/PoliticianDetailPage";

export const Route = createFileRoute("/politicians_/$bioguideid")({
  component: PoliticianDetailPage,
});
