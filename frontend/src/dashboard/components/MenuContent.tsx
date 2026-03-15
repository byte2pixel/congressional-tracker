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
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import { useNavigate, useRouterState } from "@tanstack/react-router";

const mainListItems = [
  { text: "Home", icon: <HomeRoundedIcon />, route: "/" },
  {
    text: "Politicians",
    icon: <PeopleRoundedIcon />,
    route: "/politician",
  },
  { text: "Stocks", icon: <AnalyticsRoundedIcon />, route: "/stock" },
  { text: "Watchlist", icon: <AssignmentRoundedIcon />, route: "/watchlist" },
];
const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon />, route: "/settings" },
  { text: "About", icon: <InfoRoundedIcon />, route: "/about" },
  { text: "Feedback", icon: <HelpRoundedIcon />, route: "/feedback" },
];

export default function MenuContent() {
  const navigate = useNavigate();
  const { location } = useRouterState();

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={location.pathname === item.route}
              onClick={() => navigate({ to: item.route })}
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
              selected={location.pathname === item.route}
              onClick={() => navigate({ to: item.route })}
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
