import { useMemo } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { LineChart } from "@mui/x-charts";
import { Route as StockDetailRoute } from "@/routes/stock_.$symbol";
import { useStockTrades } from "@/hooks/useStockTrades";

export default function StockDetailTradeActivityChart() {
  const theme = useTheme();
  const { symbol } = StockDetailRoute.useParams();
  const { data, isLoading } = useStockTrades(symbol);

  const colorPalette = [theme.palette.success.main, theme.palette.error.main];

  const chartData = useMemo(() => {
    if (!data || data.length === 0)
      return { dates: [], purchases: [], sales: [] };

    const dateVolume: Record<string, { purchases: number; sales: number }> = {};

    data.forEach((trade) => {
      const date = trade.transactionDate.slice(0, 10); // YYYY-MM-DD
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!dateVolume[date]) {
        dateVolume[date] = { purchases: 0, sales: 0 };
      }
      if (trade.transactionType.startsWith("P")) {
        dateVolume[date].purchases += trade.amount;
      } else if (trade.transactionType.startsWith("S")) {
        dateVolume[date].sales += trade.amount;
      }
    });

    const sorted = Object.entries(dateVolume).sort(([a], [b]) =>
      a.localeCompare(b),
    );

    return {
      dates: sorted.map(([date]) => new Date(date)),
      purchases: sorted.map(([, vol]) => vol.purchases),
      sales: sorted.map(([, vol]) => vol.sales),
    };
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
        <Box sx={{ flex: 1, height: "100%", marginRight: 6 }}>
          {isLoading ? (
            <Skeleton variant="rectangular" height="100%" />
          ) : (
            <LineChart
              height={250}
              colors={colorPalette}
              xAxis={[
                {
                  scaleType: "time",
                  data: chartData.dates,
                  tickInterval: (date: Date) =>
                    date.getDate() === 1 && date.getMonth() % 2 === 0,
                  valueFormatter: (date: Date, context) =>
                    context.location === "tick"
                      ? date.toLocaleDateString("en-US", {
                          month: "short",
                          year: "2-digit",
                        })
                      : date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }),
                  height: 28,
                },
              ]}
              yAxis={[
                {
                  width: 70,
                  valueFormatter: (value: number) => {
                    if (value >= 1_000_000)
                      return `$${(value / 1_000_000).toFixed(1)}M`;
                    if (value >= 1_000)
                      return `$${(value / 1_000).toFixed(0)}K`;
                    return `$${value}`;
                  },
                },
              ]}
              series={[
                {
                  id: "purchases",
                  data: chartData.purchases,
                  label: "Purchase Volume",
                  showMark: false,
                  curve: "linear",
                  stack: "total",
                  area: true,
                  stackOrder: "ascending",
                },
                {
                  id: "sales",
                  data: chartData.sales,
                  label: "Sale Volume",
                  showMark: false,
                  curve: "linear",
                  stack: "total",
                  area: true,
                  stackOrder: "descending",
                },
              ]}
              sx={{ marginRight: 6 }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
