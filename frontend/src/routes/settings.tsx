import { Box } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

function SettingsPage() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      Settings content here
    </Box>
  );
}

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});
