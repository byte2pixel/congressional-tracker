import { Box } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

function FeedbackPage() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      Feedback content here
    </Box>
  );
}

export const Route = createFileRoute("/feedback")({
  component: FeedbackPage,
  staticData: {
    getTitle: () => "Feedback",
  },
});
