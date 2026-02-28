import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import useKeycloak from "@/hooks/useKeycloak";

const apiUrl =
  import.meta.env.VITE_services__apiservice__http__0 || "http://localhost:5348";

function fetchStock(token?: string) {
  // Replace with your actual API endpoint
  return fetch(`${apiUrl}/api/stocks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}

function fetchPolitician(token?: string) {
  // Replace with your actual API endpoint
  return fetch(`${apiUrl}/api/politicians`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}

export function ApiTest() {
  const [selected, setSelected] = useState<"stock" | "politician" | null>(null);
  const { keycloak } = useKeycloak();

  const {
    data: stockData,
    refetch: refetchStock,
    isFetching: isFetchingStock,
  } = useQuery({
    queryKey: ["stock"],
    queryFn: () => fetchStock(keycloak?.token),
    enabled: false,
  });

  const {
    data: politicianData,
    refetch: refetchPolitician,
    isFetching: isFetchingPolitician,
  } = useQuery({
    queryKey: ["politician"],
    queryFn: () => fetchPolitician(keycloak?.token),
    enabled: false,
  });

  let response = "";
  if (selected === "stock" && stockData) {
    response = JSON.stringify(stockData, null, 2);
  } else if (selected === "politician" && politicianData) {
    response = JSON.stringify(politicianData, null, 2);
  }
  return (
    <Stack
      direction={"column"}
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Typography variant="h4" gutterBottom>
        Congressional Trading Tracker
      </Typography>
      <Button
        onClick={async () => {
          setSelected("stock");
          await refetchStock();
        }}
        disabled={isFetchingStock}
        sx={{ mb: 1 }}
      >
        Get Stock
      </Button>
      <Button
        onClick={async () => {
          setSelected("politician");
          await refetchPolitician();
        }}
        disabled={isFetchingPolitician}
        sx={{ mb: 2 }}
      >
        Get Politician
      </Button>
      <Stack sx={{ width: "100%", maxWidth: 600, mt: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          API Response
        </Typography>
        <TextareaAutosize
          minRows={8}
          maxRows={16}
          value={response}
          readOnly
          style={{
            width: "100%",
            fontFamily: "monospace",
            fontSize: 14,
            color: "#111",
            padding: 10,
            borderRadius: 4,
            border: "1px solid #ccc",
            background: "#fff",
            whiteSpace: "pre-wrap",
            boxSizing: "border-box",
          }}
        />
      </Stack>
    </Stack>
  );
}
