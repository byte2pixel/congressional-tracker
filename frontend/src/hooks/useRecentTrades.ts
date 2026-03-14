import { useQuery } from "@tanstack/react-query";
import useKeycloak from "./useKeycloak";
import { recentTrades } from "@/api/recentTrades";

export function useRecentTrades() {
  const { keycloak, authenticated } = useKeycloak();
  return useQuery({
    queryKey: ["trades", "recent"],
    queryFn: () => recentTrades(keycloak?.token),
    enabled: authenticated,
    staleTime: 60 * 60_000, // 1 hour, matches Redis cache
  });
}
