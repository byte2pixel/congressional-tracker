import { useQuery } from "@tanstack/react-query";
import useKeycloak from "./useKeycloak";
import { activeTraders } from "@/api/activeTraders";

export function useActiveTraders() {
  const { keycloak, authenticated } = useKeycloak();
  return useQuery({
    queryKey: ["traders", "active"],
    queryFn: () => activeTraders(keycloak?.token),
    enabled: authenticated,
    staleTime: 1 * 60 * 60000, // 1 hour, matches Redis cache
  });
}
