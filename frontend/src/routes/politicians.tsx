import { Box } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

function PoliticiansPage() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      Politicians content here
    </Box>
  );
}

export const Route = createFileRoute("/politicians")({
  component: PoliticiansPage,
});
