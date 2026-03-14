import { useMemo } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import { Gradient } from "../internals/components/Gradient";
import { formatVolume } from "../internals/utils/format";
import { useActiveTraders } from "@/hooks/useActiveTraders";

export default function TopTradersBarChart() {
  const { data, isLoading } = useActiveTraders();

  const { names, volumes } = useMemo(() => {
    if (!data) return { names: [], volumes: [] };
    const top10 = [...data]
      .sort((a, b) => b.totalEstimatedVolume - a.totalEstimatedVolume)
      .slice(0, 10);
    const v = top10.map((t) => t.totalEstimatedVolume);
    return {
      names: top10.map((t) => {
        const parts = t.name.trim().split(" ");
        return parts[parts.length - 1];
      }),
      volumes: v,
    };
  }, [data]);

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Top 10 Traders by Volume
        </Typography>
        {isLoading ? (
          <Skeleton variant="rectangular" height={320} />
        ) : (
          <BarChart
            layout="horizontal"
            yAxis={[{ scaleType: "band", data: names, width: 80 }]}
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
