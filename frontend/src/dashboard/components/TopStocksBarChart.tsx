import { useMemo } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import { Gradient } from "../internals/components/Gradient";
import { useMostActiveStocks } from "@/hooks/useMostActiveStocks";

function formatVolume(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

export default function TopStocksBarChart() {
  const { data, isLoading } = useMostActiveStocks();

  const { symbols, volumes } = useMemo(() => {
    if (!data) return { symbols: [], volumes: [] };
    const top10 = [...data]
      .sort((a, b) => b.totalEstimatedVolume - a.totalEstimatedVolume)
      .slice(0, 10);
    return {
      symbols: top10.map((s) => s.symbol),
      volumes: top10.map((s) => s.totalEstimatedVolume),
    };
  }, [data]);

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
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
                valueFormatter: formatVolume,
                height: 28,
              },
            ]}
            series={[
              {
                data: volumes,
                label: "Est. Volume",
                color: `url(#my-gradient)`,
              },
            ]}
            height={320}
            margin={{ left: 0, right: 10, top: 10, bottom: 0 }}
            grid={{ vertical: true }}
            hideLegend
          >
            <Gradient id="my-gradient" />
          </BarChart>
        )}
      </CardContent>
    </Card>
  );
}

