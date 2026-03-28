import { useMemo } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import { useNavigate } from "@tanstack/react-router";
import { useTheme } from "@mui/material";
import { Gradient } from "../internals/components/Gradient";
import { formatVolume } from "../internals/utils/format";
import { useMostActiveStocks } from "@/hooks/useMostActiveStocks";
import { Route as StockDetailsRoute } from "@/routes/stock_.$symbol";

export default function TopStocksBarChart() {
  const theme = useTheme();
  const colors = [
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.secondary.main,
  ];
  const { data, isLoading } = useMostActiveStocks();
  const navigate = useNavigate();

  const { symbols, volumes, purchases, sales } = useMemo(() => {
    if (!data) return { symbols: [], volumes: [], purchases: [], sales: [] };
    const top10 = [...data]
      .sort((a, b) => b.totalEstimatedVolume - a.totalEstimatedVolume)
      .slice(0, 10);
    return {
      symbols: top10.map((s) => s.symbol),
      volumes: top10.map((s) => s.totalEstimatedVolume),
      purchases: top10.map((s) => s.purchaseCount),
      sales: top10.map((s) => s.saleCount),
    };
  }, [data]);

  return (
    <Card sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Top 10 Stocks by Volume
        </Typography>
        {isLoading ? (
          <Skeleton variant="rectangular" height={320} />
        ) : (
          <BarChart
            layout="horizontal"
            yAxis={[{ scaleType: "band", data: symbols, width: 60 }]}
            xAxis={[
              {
                id: "volume",
                valueFormatter: (value: number | null) =>
                  formatVolume(value ?? 0, 1),
                height: 28,
              },
              {
                id: "count",
                valueFormatter: (value: number | null) =>
                  (value ?? 0).toString(),
                height: 28,
              },
            ]}
            series={[
              {
                data: volumes,
                label: "Est. Volume",
                color: colors[2],
                xAxisId: "volume",
                valueFormatter: (value: number | null) =>
                  formatVolume(value ?? 0, 1),
              },
              {
                data: purchases,
                label: "Purchases",
                color: colors[0],
                stack: "count",
                xAxisId: "count",
              },
              {
                data: sales,
                label: "Sales",
                color: colors[1],
                stack: "count",
                xAxisId: "count",
              },
            ]}
            height={320}
            margin={{ left: 0, right: 10, top: 10, bottom: 0 }}
            grid={{ vertical: true }}
            hideLegend
            onAxisClick={(_, context) => {
              if (context?.dataIndex === undefined) return;
              const symbol = symbols[context.dataIndex];
              if (symbol) {
                void navigate({
                  to: StockDetailsRoute.to,
                  params: { symbol },
                });
              }
            }}
          >
            <Gradient id="my-gradient" />
          </BarChart>
        )}
      </CardContent>
    </Card>
  );
}

