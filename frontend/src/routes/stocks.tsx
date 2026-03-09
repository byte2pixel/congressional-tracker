import { Box } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

function StocksPage() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      Stocks content here
    </Box>
  );
}

export const Route = createFileRoute("/stocks")({
  component: StocksPage,
});
