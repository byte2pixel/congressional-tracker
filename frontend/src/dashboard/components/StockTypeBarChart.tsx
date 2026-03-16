import { useMemo } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material";
import { useMostActiveStocks } from "@/hooks/useMostActiveStocks";

export default function StockTypeBarChart() {
  const theme = useTheme();
  const { data, isLoading } = useMostActiveStocks();

  const chartData = useMemo(() => {
    if (!data) return { types: [], purchases: [], sales: [] };

    const counts: Record<string, { purchases: number; sales: number }> = {};
    for (const stock of data) {
      const type = stock.tickerType ?? "Unknown";
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!counts[type]) counts[type] = { purchases: 0, sales: 0 };
      counts[type].purchases += stock.purchaseCount;
      counts[type].sales += stock.saleCount;
    }

    // Sort by total volume descending, cap at top 3 types
    const sorted = Object.entries(counts)
      .sort(
        (a, b) => b[1].purchases + b[1].sales - (a[1].purchases + a[1].sales),
      )
      .slice(0, 3);

    return {
      types: sorted.map(([type]) => type),
      purchases: sorted.map(([, v]) => v.purchases),
      sales: sorted.map(([, v]) => v.sales),
    };
  }, [data]);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        height: "100%",
      }}
    >
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Purchases vs Sales by Type
        </Typography>
        {isLoading ? (
          <Skeleton variant="rectangular" height={250} />
        ) : (
          <BarChart
            borderRadius={4}
            xAxis={[{ scaleType: "band", data: chartData.types }]}
            series={[
              {
                id: "purchases",
                label: "Purchases",
                data: chartData.purchases,
                color: theme.palette.success.main,
              },
              {
                id: "sales",
                label: "Sales",
                data: chartData.sales,
                color: theme.palette.error.main,
              },
            ]}
            height={250}
            margin={{ left: 0, right: 0, top: 30, bottom: 0 }}
            grid={{ horizontal: true }}
          />
        )}
      </CardContent>
    </Card>
  );
}

