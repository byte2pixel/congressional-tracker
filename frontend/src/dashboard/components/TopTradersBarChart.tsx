import { useMemo } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";
import { useActiveTraders } from "@/hooks/useActiveTraders";

function formatVolume(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

export default function TopTradersBarChart() {
  const theme = useTheme();
  const { data, isLoading } = useActiveTraders();

  const { names, volumes } = useMemo(() => {
    if (!data) return { names: [], volumes: [] };
    const top10 = [...data]
      .sort((a, b) => b.totalEstimatedVolume - a.totalEstimatedVolume)
      .slice(0, 10);
    return {
      names: top10.map((t) => {
        const parts = t.name.trim().split(" ");
        return parts[parts.length - 1];
      }),
      volumes: top10.map((t) => t.totalEstimatedVolume),
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
                valueFormatter: formatVolume,
                height: 28,
                colorMap: {
                  type: "continuous",
                  color: [
                    theme.palette.primary.dark,
                    theme.palette.primary.main,
                  ],
                  min: Math.min(...volumes),
                  max: Math.max(...volumes),
                },
              },
            ]}
            series={[
              {
                data: volumes,
                label: "Est. Volume",
                color: theme.palette.primary.main,
              },
            ]}
            height={320}
            margin={{ left: 0, right: 10, top: 10, bottom: 0 }}
            grid={{ vertical: true }}
            hideLegend
          />
        )}
      </CardContent>
    </Card>
  );
}
