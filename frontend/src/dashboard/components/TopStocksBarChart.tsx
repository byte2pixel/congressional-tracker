import { useMemo } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import { Gradient } from "../internals/components/Gradient";
import { formatVolume } from "../internals/utils/format";
import { useMostActiveStocks } from "@/hooks/useMostActiveStocks";

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
                valueFormatter: (value: number) => formatVolume(value, 1),
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

