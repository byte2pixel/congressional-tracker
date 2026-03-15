import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import StockTradeStats from "./StockTradeStats";
import StockDetailTradeActivityChart from "./StockDetailTradeActivityChart";
import StockDetailBuySellChart from "./StockDetailBuySellChart";
import StockTradesDataGrid from "./StockTradesDataGrid";
import { useStock } from "@/hooks/useStock";
import { Route as StockDetailRoute } from "@/routes/stock_.$symbol";

function StockHeader() {
  const { symbol } = StockDetailRoute.useParams();
  const { data, isLoading } = useStock(symbol);
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems={{ sm: "center" }}
        >
          {/* TODO: replace with stock logo */}
          <Skeleton variant="circular" width={80} height={80} />
          <Stack spacing={0.5}>
            {isLoading ? (
              <>
                <Skeleton variant="text" width={20} />
                <Skeleton variant="text" width={120} />
              </>
            ) : (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h6" fontWeight="bold">
                  {data?.symbol || "Unknown Stock"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {data?.company || "Company name not available"}
                </Typography>
              </Stack>
            )}
            <Stack direction="row" spacing={1}>
              {isLoading ? (
                <Skeleton variant="text" width={80} />
              ) : (
                <Typography variant="body2">{data?.type}</Typography>
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary">
              ID: {symbol}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function StockDetailPage() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack spacing={3} sx={{ mb: 2 }}>
        <StockHeader />
        <StockTradeStats />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <StockDetailTradeActivityChart />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StockDetailBuySellChart />
          </Grid>
        </Grid>
        <StockTradesDataGrid />
      </Stack>
    </Box>
  );
}
