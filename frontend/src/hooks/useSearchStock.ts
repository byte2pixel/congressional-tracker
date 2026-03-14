import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDeferredValue } from "react";
import useKeycloak from "@/hooks/useKeycloak";
import { searchStocks } from "@/api/stocks";

export function useStockSearch(query: string, limit = 20) {
  const { authenticated, keycloak } = useKeycloak();
  const debouncedQuery = useDeferredValue(query);

  return useQuery({
    queryKey: ["stocks", "search", debouncedQuery, limit],
    queryFn: () => searchStocks(debouncedQuery, limit, keycloak?.token),
    enabled: authenticated && debouncedQuery.length >= 2, // don't query on empty/single char
    placeholderData: keepPreviousData, // keep old results while typing
    staleTime: 60_000, // matches Redis 1-min cache
  });
}
