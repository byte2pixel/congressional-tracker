import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import { useMemo } from "react";
import Copyright from "../internals/components/Copyright";
// import ChartUserByCountry from "./ChartUserByCountry";
// import CustomizedDataGrid from "./CustomizedDataGrid";
// import HighlightedCard from "./HighlightedCard";
// import PageViewsBarChart from "./PageViewsBarChart";
// import SessionsChart from "./SessionsChart";
// import StatCard from "./StatCard";
import PoliticianSearchCard from "../components/PoliticianSearchCard";
import StockSearchCard from "../components/StockSearchCard";
import RecentTradesDataGrid from "../components/RecentTradesDataGrid";
import ActiveTradersDataGrid from "../components/ActiveTradersDataGrid";
import TopIndustryPieChart from "../components/TopIndustryPieChart";
import { formatVolume } from "../internals/utils/format";
import { useRecentTrades } from "@/hooks/useRecentTrades";
// import type { StatCardProps } from "./StatCard";

// const data: Array<StatCardProps> = [
//   {
//     title: "Total Trades",
//     value: "1,245",
//     interval: "This Session",
//     trend: "up",
//     data: [
//       200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340,
//       380, 360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
//     ],
//   },
//   {
//     title: "Insider Buys",
//     value: "312",
//     interval: "This Month",
//     trend: "up",
//     data: [
//       1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600,
//       820, 780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300,
//       220,
//     ],
//   },
//   {
//     title: "Politicians Tracked",
//     value: "538",
//     interval: "All Time",
//     trend: "neutral",
//     data: [
//       500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510,
//       530, 520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
//     ],
//   },
// ];

export default function MainPage() {
  const { data: recentTrades, isLoading: recentTradesLoading } =
    useRecentTrades();

  const topIndustriesByCount = useMemo(() => {
    if (!recentTrades) return [];
    const industryCounts: Record<string, number> = {};
    recentTrades.forEach((trade) => {
      const industry = trade.industry || "Unknown";
      industryCounts[industry] = (industryCounts[industry] || 0) + 1;
    });
    return Object.entries(industryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([label, value]) => ({ label, value }));
  }, [recentTrades]);

  const topIndustriesByVolume = useMemo(() => {
    if (!recentTrades) return [];
    const industryVolumes: Record<string, number> = {};
    recentTrades.forEach((trade) => {
      const industry = trade.industry || "Unknown";
      industryVolumes[industry] =
        (industryVolumes[industry] || 0) + trade.amount;
    });
    return Object.entries(industryVolumes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([label, value]) => ({ label, value }));
  }, [recentTrades]);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Find a Politician or Stock
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid size={{ xs: 12, sm: 6 }}>
          <PoliticianSearchCard />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <StockSearchCard />
        </Grid>
      </Grid>
      <Divider sx={{ mb: (theme) => theme.spacing(2) }} />
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Latest Activity
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid size={{ xs: 12, md: 6 }}>
          <TopIndustryPieChart
            title="Top Industries by Trade Count"
            subtitle="Top 10 industries"
            data={topIndustriesByCount}
            isLoading={recentTradesLoading}
            valueFormatter={(value) => value.toString()}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TopIndustryPieChart
            title="Top Industries by Trade Volume"
            subtitle="Top 10 industries"
            data={topIndustriesByVolume}
            isLoading={recentTradesLoading}
            valueFormatter={formatVolume}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <RecentTradesDataGrid />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid size={{ xs: 12 }}>
          <ActiveTradersDataGrid />
        </Grid>
      </Grid>
      {/* <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>
      </Grid> */}
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
