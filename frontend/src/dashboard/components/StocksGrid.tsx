import { useMemo } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Copyright from "../internals/components/Copyright";
import { formatVolume } from "../internals/utils/format";
import ActiveStocksDataGrid from "./ActiveStocksDataGrid";
import BuySellRatioPieChart from "./BuySellRatioPieChart";
import StockSearchCard from "./StockSearchCard";
import StockTypeBarChart from "./StockTypeBarChart";
import TopStocksBarChart from "./TopStocksBarChart";
import { useMostActiveStocks } from "@/hooks/useMostActiveStocks";

interface CountCardProps {
  title: string;
  value: string | number;
}

function CountCard({ title, value }: Readonly<CountCardProps>) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="p">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function StocksGrid() {
  const { data } = useMostActiveStocks();

  const counts = useMemo(() => {
    if (!data) return { total: "—", purchases: "—", volume: "—" };
    const totalPurchases = data.reduce((sum, s) => sum + s.purchaseCount, 0);
    const totalVolume = data.reduce((sum, s) => sum + s.totalEstimatedVolume, 0);
    return {
      total: data.length,
      purchases: totalPurchases.toLocaleString(),
      volume: formatVolume(totalVolume),
    };
  }, [data]);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Find a Stock
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid size={{ xs: 12, sm: 6 }}>
          <StockSearchCard />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <CountCard title="Stocks Tracked" value={counts.total} />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <CountCard title="Total Purchases" value={counts.purchases} />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <CountCard title="Est. Volume (6mo)" value={counts.volume} />
        </Grid>
      </Grid>

      <Divider sx={{ mb: (theme) => theme.spacing(2) }} />

      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid size={{ xs: 12, md: 4 }}>
          <BuySellRatioPieChart />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StockTypeBarChart />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TopStocksBarChart />
        </Grid>
      </Grid>

      <Divider sx={{ mb: (theme) => theme.spacing(2) }} />

      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Most Active Stocks
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid size={{ xs: 12 }}>
          <ActiveStocksDataGrid />
        </Grid>
      </Grid>

      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}

