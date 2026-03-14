import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getPolitician } from "@/api/politicians";
import useKeycloak from "@/hooks/useKeycloak";

export function usePolitician(bioGuideId: string) {
  const { authenticated, keycloak } = useKeycloak();

  return useQuery({
    queryKey: ["politicians", "detail", bioGuideId],
    queryFn: () => getPolitician(bioGuideId, keycloak?.token),
    enabled: authenticated && bioGuideId.length >= 2,
    placeholderData: keepPreviousData,
    staleTime: 60 * 60_000, //  1 hour, politician details don't change often, matches redis cache
  });
}
