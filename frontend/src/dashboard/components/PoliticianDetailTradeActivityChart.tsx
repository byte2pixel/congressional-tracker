import { useMemo } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { LineChart } from "@mui/x-charts";
import { usePoliticianTrades } from "@/hooks/usePoliticianTrades";
import { Route as PoliticianDetailRoute } from "@/routes/politician_.$bioguideid";

export default function PoliticianDetailTradeActivityChart() {
  const theme = useTheme();
  const { bioguideid } = PoliticianDetailRoute.useParams();
  const { data, isLoading } = usePoliticianTrades(bioguideid);

  const colorPalette = [theme.palette.success.main, theme.palette.error.main];

  // group trades by month and count purchases vs sales
  const monthlyData = useMemo(() => {
    if (!data) return [];
    const monthlyCounts: Record<string, { purchases: number; sales: number }> =
      {};
    data.forEach((trade) => {
      // use only the last 24 months of data
      if (
        trade.transactionDate <
        new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10)
      ) {
        return;
      }
      const month = trade.transactionDate.slice(0, 7); // YYYY-MM

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!monthlyCounts[month]) {
        monthlyCounts[month] = { purchases: 0, sales: 0 };
      }

      if (trade.transactionType.startsWith("P")) {
        monthlyCounts[month].purchases += 1;
      } else if (trade.transactionType.startsWith("S")) {
        monthlyCounts[month].sales += 1;
      }
    });
    // convert to array and sort by month
    return Object.entries(monthlyCounts)
      .map(([month, counts]) => ({
        month,
        ...counts,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [data]);

  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        height: 320,
      }}
    >
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Trade Activity Over Time
        </Typography>
        <Box sx={{ flex: 1, height: "100%" }}>
          {isLoading ? (
            <Skeleton variant="rectangular" height="100%" />
          ) : (
            <LineChart
              height={250}
              colors={colorPalette}
              xAxis={[
                {
                  scaleType: "point",
                  data: monthlyData.map((d) => d.month),
                  tickInterval: (_index, i) => (i + 1) % 2 === 0,
                  height: 28,
                },
              ]}
              yAxis={[{ width: 50 }]}
              series={[
                {
                  id: "purchases",
                  data: monthlyData.map((d) => d.purchases),
                  label: "Purchases",
                  showMark: false,
                  curve: "linear",
                  stack: "total",
                  area: true,
                  stackOrder: "ascending",
                },
                {
                  id: "sales",
                  data: monthlyData.map((d) => d.sales),
                  label: "Sales",
                  showMark: false,
                  curve: "linear",
                  stack: "total",
                  area: true,
                  stackOrder: "descending",
                },
              ]}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
