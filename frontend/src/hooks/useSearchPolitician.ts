import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDeferredValue } from "react";
import { searchPoliticians } from "@/api/politicians";
import useKeycloak from "@/hooks/useKeycloak";

export function usePoliticianSearch(query: string, limit = 20) {
  const { authenticated, keycloak } = useKeycloak();
  const debouncedQuery = useDeferredValue(query);

  return useQuery({
    queryKey: ["politicians", "search", debouncedQuery, limit],
    queryFn: () => searchPoliticians(debouncedQuery, limit, keycloak?.token),
    enabled: authenticated && debouncedQuery.length >= 2, // don't query on empty/single char
    placeholderData: keepPreviousData, // keep old results while typing
    staleTime: 60_000, // 1 minute, matches Redis 1-min cache
  });
}
