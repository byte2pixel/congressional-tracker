import { useMemo } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material";
import { useActiveTraders } from "@/hooks/useActiveTraders";

export default function PartyTradesBarChart() {
  const theme = useTheme();
  const { data, isLoading } = useActiveTraders();
  const partyColors = {
    Democrat: theme.palette.primary.main,
    Republican: theme.palette.error.main,
    Other: theme.palette.grey[500],
  };

  const chartData = useMemo(() => {
    // Initialize counts
    const counts = {
      Democratic: { sales: 0, purchases: 0 },
      Republican: { sales: 0, purchases: 0 },
      Other: { sales: 0, purchases: 0 },
    };
    if (data) {
      for (const trader of data) {
        let party: "Democratic" | "Republican" | "Other" = "Other";
        if (trader.party === "Democratic") party = trader.party;
        else if (trader.party === "Republican") party = trader.party;
        counts[party].sales += trader.saleCount;
        counts[party].purchases += trader.purchaseCount;
      }
    }
    return counts;
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
          Purchases vs Sales by Party
        </Typography>
        {isLoading ? (
          <Skeleton variant="rectangular" height={250} />
        ) : (
          <BarChart
            borderRadius={4}
            xAxis={[{ scaleType: "band", data: ["Sales", "Purchases"] }]}
            series={[
              {
                id: "Democratic",
                label: "Democratic",
                data: [
                  chartData.Democratic.sales,
                  chartData.Democratic.purchases,
                ],
                color: partyColors.Democrat,
              },
              {
                id: "Republican",
                label: "Republican",
                data: [
                  chartData.Republican.sales,
                  chartData.Republican.purchases,
                ],
                color: partyColors.Republican,
              },
              {
                id: "Other",
                label: "Other",
                data: [chartData.Other.sales, chartData.Other.purchases],
                color: partyColors.Other,
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
