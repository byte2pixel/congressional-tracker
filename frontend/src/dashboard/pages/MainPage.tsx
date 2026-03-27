import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import { useMemo } from "react";
import PoliticianSearchCard from "../components/PoliticianSearchCard";
import StockSearchCard from "../components/StockSearchCard";
import RecentTradesDataGrid from "../components/RecentTradesDataGrid";
import ActiveTradersDataGrid from "../components/ActiveTradersDataGrid";
import TopIndustryPieChart from "../components/TopIndustryPieChart";
import LiveStatCard from "../components/LiveStatCard";
import { formatVolume } from "../internals/utils/format";
import { useRecentTrades } from "@/hooks/useRecentTrades";
import Copyright from "../internals/components/Copyright";

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

  // Daily trade volume sparkline
  const dailyVolumeStat = useMemo(() => {
    if (!recentTrades || recentTrades.length === 0)
      return { value: "$0", trendLabel: "0%", trend: "neutral" as const, data: [], xLabels: [] };

    const byDay: Record<string, number> = {};
    recentTrades.forEach((trade) => {
      const day = trade.transactionDate.slice(0, 10);
      byDay[day] = (byDay[day] || 0) + trade.amount;
    });

    const sorted = Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b));
    const data = sorted.map(([, v]) => v);
    const xLabels = sorted.map(([d]) => {
      const date = new Date(d + "T00:00:00");
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    });

    const total = data.reduce((s, v) => s + v, 0);
    const half = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, half).reduce((s, v) => s + v, 0);
    const secondHalf = data.slice(half).reduce((s, v) => s + v, 0);
    const pct = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0;
    let trend: "up" | "down" | "neutral" = "neutral";
    if (pct > 2) trend = "up";
    else if (pct < -2) trend = "down";
    const sign = pct >= 0 ? "+" : "";

    return {
      value: formatVolume(total),
      trendLabel: `${sign}${pct.toFixed(0)}%`,
      trend,
      data,
      xLabels,
    };
  }, [recentTrades]);

  // Daily buy ratio sparkline
  const buyRatioStat = useMemo(() => {
    if (!recentTrades || recentTrades.length === 0)
      return { value: "0%", trendLabel: "Neutral", trend: "neutral" as const, data: [], xLabels: [] };

    const byDay: Record<string, { buys: number; total: number }> = {};
    recentTrades.forEach((trade) => {
      const day = trade.transactionDate.slice(0, 10);
      if (!byDay[day]) byDay[day] = { buys: 0, total: 0 };
      byDay[day].total += 1;
      if (trade.transactionType.startsWith("P")) byDay[day].buys += 1;
    });

    const sorted = Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b));
    const data = sorted.map(([, v]) => Math.round((v.buys / v.total) * 100));
    const xLabels = sorted.map(([d]) => {
      const date = new Date(d + "T00:00:00");
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    });

    const totalBuys = recentTrades.filter((t) => t.transactionType.startsWith("P")).length;
    const overallPct = Math.round((totalBuys / recentTrades.length) * 100);

    let trend: "up" | "down" | "neutral" = "neutral";
    if (overallPct > 55) trend = "up";
    else if (overallPct < 45) trend = "down";

    return {
      value: `${overallPct}% Buys`,
      trendLabel: `${recentTrades.length - totalBuys} Sells`,
      trend,
      data,
      xLabels,
    };
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
        <Grid size={{ xs: 12, sm: 6 }}>
          <LiveStatCard
            title="Trade Volume"
            value={dailyVolumeStat.value}
            interval="All synced trades, grouped by day"
            trend={dailyVolumeStat.trend}
            trendLabel={dailyVolumeStat.trendLabel}
            data={dailyVolumeStat.data}
            xLabels={dailyVolumeStat.xLabels}
            valueFormatter={(v) => (v == null ? "" : formatVolume(v))}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <LiveStatCard
            title="Buy / Sell Ratio"
            value={buyRatioStat.value}
            interval="% of trades that are purchases, per day"
            trend={buyRatioStat.trend}
            trendLabel={buyRatioStat.trendLabel}
            data={buyRatioStat.data}
            xLabels={buyRatioStat.xLabels}
          />
        </Grid>
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
