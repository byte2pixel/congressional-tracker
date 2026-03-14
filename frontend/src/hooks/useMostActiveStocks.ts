import { useQuery } from "@tanstack/react-query";
import useKeycloak from "./useKeycloak";
import { mostActiveStocks } from "@/api/mostActiveStocks";

export function useMostActiveStocks() {
  const { keycloak, authenticated } = useKeycloak();
  return useQuery({
    queryKey: ["stocks", "active"],
    queryFn: () => mostActiveStocks(keycloak?.token),
    enabled: authenticated,
    staleTime: 1 * 60 * 60000, // 1 hour, matches Redis cache
  });
}

