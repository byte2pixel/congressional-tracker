import { Box } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

function AboutPage() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      About content here
    </Box>
  );
}

export const Route = createFileRoute("/about")({
  component: AboutPage,
  staticData: {
    getTitle: () => "About",
  },
});
