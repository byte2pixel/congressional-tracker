import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import type { AvatarProps } from "@mui/material/Avatar";

export interface LazyAvatarProps extends AvatarProps {
  isLoading?: boolean;
}

export function LazyAvatar({ isLoading, sx, ...props }: LazyAvatarProps) {
  if (isLoading) {
    return (
      <Skeleton variant="circular" sx={sx}>
        <Avatar sx={{ ...sx, visibility: "hidden" }} />
      </Skeleton>
    );
  }

  return <Avatar sx={sx} {...props} />;
}
