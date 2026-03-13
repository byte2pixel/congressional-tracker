import { createFileRoute } from "@tanstack/react-router";
import PoliticiansGrid from "@/dashboard/components/PoliticiansGrid";

export const Route = createFileRoute("/politicians")({
  component: PoliticiansGrid,
});
