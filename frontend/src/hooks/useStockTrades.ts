import { useQuery } from "@tanstack/react-query";
import useKeycloak from "./useKeycloak";
import { getStockTrades } from "@/api/stocks";

export function useStockTrades(symbol: string) {
  const { keycloak, authenticated } = useKeycloak();
  return useQuery({
    queryKey: ["stock", "trades", symbol],
    queryFn: () => getStockTrades(symbol, keycloak?.token),
    enabled: authenticated,
    staleTime: 60 * 60_000, // 1 hour, matches Redis cache
  });
}
