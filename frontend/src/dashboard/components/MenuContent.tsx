import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Route as StockRoute } from "@/routes/stock";
import { Route as PoliticianRoute } from "@/routes/politician";
import { Route as NotificationsRoute } from "@/routes/notifications";
import { Route as WatchlistRoute } from "@/routes/watchlist";
import { Route as SettingsRoute } from "@/routes/settings";
import { Route as AboutRoute } from "@/routes/about";
import { Route as FeedbackRoute } from "@/routes/feedback";
import { Route as HomeRoute } from "@/routes/index";

function isRouteActive(pathname: string, route: string): boolean {
  if (route === "/") return pathname === "/";
  return (
    pathname === route ||
    pathname.startsWith(route + "/") ||
    pathname.startsWith(route + "-")
  );
}

export default function MenuContent() {
  const mainListItems = [
    { text: "Home", icon: <HomeRoundedIcon />, to: HomeRoute.to },
    {
      text: "Politicians",
      icon: <PeopleRoundedIcon />,
      to: PoliticianRoute.to,
    },
    { text: "Stocks", icon: <AnalyticsRoundedIcon />, to: StockRoute.to },
    {
      text: "Watchlist",
      icon: <AssignmentRoundedIcon />,
      to: WatchlistRoute.to,
    },
    {
      text: "Notifications",
      icon: <NotificationsRoundedIcon />,
      to: NotificationsRoute.to,
    },
  ];

  const secondaryListItems = [
    { text: "Settings", icon: <SettingsRoundedIcon />, to: SettingsRoute.to },
    { text: "About", icon: <InfoRoundedIcon />, to: AboutRoute.to },
    { text: "Feedback", icon: <HelpRoundedIcon />, to: FeedbackRoute.to },
  ];
  const navigate = useNavigate();
  const { location } = useRouterState();

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={isRouteActive(location.pathname, item.to)}
              onClick={() => navigate({ to: item.to })}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={isRouteActive(location.pathname, item.to)}
              onClick={() => navigate({ to: item.to })}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
