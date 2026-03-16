import Stack from "@mui/material/Stack";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import { useNavigate } from "@tanstack/react-router";
import ColorModeIconDropdown from "../../shared-theme/ColorModeIconDropdown";
import NavbarBreadcrumbs from "./NavbarBreadcrumbs";
import MenuButton from "./MenuButton";
import { useNotifications } from "@/context/NotificationsContext";
import { Route as NotificationsRoute } from "@/routes/notifications";

export default function Header() {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 1.5,
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs />
      <Stack direction="row" sx={{ gap: 1 }}>
        <MenuButton
          showBadge={unreadCount > 0}
          aria-label="Open notifications"
          onClick={() => void navigate({ to: NotificationsRoute.to })}
        >
          <NotificationsRoundedIcon />
        </MenuButton>
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}
