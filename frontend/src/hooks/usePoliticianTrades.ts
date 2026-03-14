import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getPoliticiansTrades } from "@/api/politicians";
import useKeycloak from "@/hooks/useKeycloak";

export function usePoliticianTrades(bioGuideId: string) {
  const { authenticated, keycloak } = useKeycloak();

  return useQuery({
    queryKey: ["politicians", "trades", bioGuideId],
    queryFn: () => getPoliticiansTrades(bioGuideId, keycloak?.token),
    enabled: authenticated && bioGuideId.length >= 2,
    placeholderData: keepPreviousData,
    staleTime: 60 * 60_000, //  1 hour, politician trades don't change often, matches redis cache
  });
}
