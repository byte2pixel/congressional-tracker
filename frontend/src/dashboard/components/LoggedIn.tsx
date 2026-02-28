import { Avatar, Box, Typography } from "@mui/material";
import OptionsMenu from "./OptionsMenu";
import useKeycloak from "@/hooks/useKeycloak";

export default function LoggedIn() {
  const { keycloak } = useKeycloak();
  return (
    <>
      <Avatar
        sizes="small"
        alt="Mel Dommer"
        src="/static/images/avatar/7.jpg"
        sx={{ width: 36, height: 36 }}
      />
      <Box sx={{ mr: "auto" }}>
        <Typography
          variant="body1"
          sx={{ fontWeight: 499, lineHeight: "16px" }}
        >
          {keycloak?.tokenParsed?.preferred_username || "Unknown User"}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {keycloak?.tokenParsed?.email || "No email available"}
        </Typography>
      </Box>
      <OptionsMenu />
    </>
  );
}
