import { createFileRoute } from "@tanstack/react-router";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Dashboard from "@/dashboard/Dashboard";

export const Route = createFileRoute("/")({
  component: App,
});

const apiUrl =
  import.meta.env.VITE_services__apiservice__http__0 || "http://localhost:5348";

function fetchStock() {
  // Replace with your actual API endpoint
  return fetch(`${apiUrl}/api/stocks`).then((res) => res.json());
}

function fetchPolitician() {
  // Replace with your actual API endpoint
  return fetch(`${apiUrl}/api/politicians`).then((res) => res.json());
}

function App() {
  const [selected, setSelected] = useState<"stock" | "politician" | null>(null);

  const {
    data: stockData,
    refetch: refetchStock,
    isFetching: isFetchingStock,
  } = useQuery({
    queryKey: ["stock"],
    queryFn: fetchStock,
    enabled: false,
  });

  const {
    data: politicianData,
    refetch: refetchPolitician,
    isFetching: isFetchingPolitician,
  } = useQuery({
    queryKey: ["politician"],
    queryFn: fetchPolitician,
    enabled: false,
  });

  let response = "";
  if (selected === "stock" && stockData) {
    response = JSON.stringify(stockData, null, 2);
  } else if (selected === "politician" && politicianData) {
    response = JSON.stringify(politicianData, null, 2);
  }

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
