import { createFileRoute } from "@tanstack/react-router";

import Dashboard from "@/dashboard/Dashboard";

export const Route = createFileRoute("/")({
  component: App,
});


function App() {
  return (
    // <Box alignItems="center" display="flex" flexDirection="column" justifyContent="center" minHeight="100vh">
    //   <Typography variant="h4" gutterBottom>
    //     Congressional Trading Tracker
    //   </Typography>
    //   <Button
    //     onClick={async () => {
    //       setSelected('stock');
    //       await refetchStock();
    //     }}
    //     disabled={isFetchingStock}
    //     sx={{ mb: 1 }}
    //   >
    //     Get Stock
    //   </Button>
    //   <Button
    //     onClick={async () => {
    //       setSelected('politician');
    //       await refetchPolitician();
    //     }}
    //     disabled={isFetchingPolitician}
    //     sx={{ mb: 2 }}
    //   >
    //     Get Politician
    //   </Button>
    //   <TextField
    //     label="API Response"
    //     multiline
    //     minRows={8}
    //     maxRows={16}
    //     value={response}
    //     fullWidth
    //     InputProps={{ readOnly: true, style: { fontFamily: 'monospace' } }}
    //     sx={{ mt: 2, width: '100%', maxWidth: 600 }}
    //   />
    // </Box>
    <Dashboard />
  );
}
