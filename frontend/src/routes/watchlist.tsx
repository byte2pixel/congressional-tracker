import { Box } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

function WatchlistPage() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      Watchlist content here
    </Box>
  );
}

export const Route = createFileRoute("/watchlist")({
  component: WatchlistPage,
});
