import { keepPreviousData, useQuery } from "@tanstack/react-query";
import useKeycloak from "@/hooks/useKeycloak";
import { getStockDetail } from "@/api/stocks";

export function useStock(symbol: string) {
  const { authenticated, keycloak } = useKeycloak();

  return useQuery({
    queryKey: ["stocks", "detail", symbol],
    queryFn: () => getStockDetail(symbol, keycloak?.token),
    enabled: authenticated && symbol.length > 0,
    placeholderData: keepPreviousData,
    staleTime: 60 * 60_000, //  1 hour,  matches redis cache
  });
}
