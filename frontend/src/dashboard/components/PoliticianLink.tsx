import { RouterLink } from "../internals/components/RouterLink";

export function PoliticianLink({
  name,
  bioGuideId,
}: {
  name: string;
  bioGuideId: string;
}) {
  return (
    <RouterLink
      preload="intent"
      to="/politicians/$bioguideid"
      params={{ bioguideid: bioGuideId }}
    >
      {name}
    </RouterLink>
  );
}
