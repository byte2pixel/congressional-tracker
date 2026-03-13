import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import useKeycloak from "@/hooks/useKeycloak";

export default function LoggedIn() {
  const { keycloak, userPicture } = useKeycloak();
  return (
    <Stack direction="column" alignItems="end">
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          sizes="small"
          alt={keycloak?.tokenParsed?.preferred_username ?? "Unknown User"}
          src={userPicture ?? "/static/images/avatar/7.jpg"}
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: "auto" }}>
          <Typography
            variant="body1"
            sx={{ fontWeight: 499, lineHeight: "16px" }}
          >
            {keycloak?.tokenParsed?.name ??
              keycloak?.tokenParsed?.preferred_username ??
              "Unknown User"}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {keycloak?.tokenParsed?.email ?? "No email available"}
          </Typography>
        </Box>
      </Stack>
      <Button
        color="primary"
        onClick={() => keycloak?.logout()}
        size="small"
        startIcon={<LogoutIcon />}
      >
        Logout
      </Button>
    </Stack>
  );
}
