import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { formatParty, formatVolume } from "../internals/utils/format";
import { PoliticianLink } from "./PoliticianLink";
import { StockLink } from "./StockLink";
import type { PoliticianTrade } from "@/api/politicians";
import { usePolitician } from "@/hooks/usePolitician";
import { usePoliticianTrades } from "@/hooks/usePoliticianTrades";
import { Route as CompareRoute } from "@/routes/politician-compare";

function computeStats(data: Array<PoliticianTrade> | undefined) {
  if (!data) return null;

  const totalTrades = data.length;
  const totalPurchases = data.filter((t) =>
    t.transactionType.toLowerCase().includes("purchase"),
  ).length;
  const totalSales = data.filter((t) =>
    t.transactionType.toLowerCase().includes("sale"),
  ).length;

  const bySymbol: Record<string, { count: number; volume: number }> = {};
  for (const trade of data) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!bySymbol[trade.symbol])
      bySymbol[trade.symbol] = { count: 0, volume: 0 };
    bySymbol[trade.symbol].count += 1;
    bySymbol[trade.symbol].volume += trade.amount;
  }

  const totalVolume = data.reduce((sum, t) => sum + t.amount, 0);

  const excessReturns = data
    .map((t) => t.excessReturn)
    .filter((v): v is number => v !== null);
  const avgExcessReturn =
    excessReturns.length > 0
      ? excessReturns.reduce((sum, v) => sum + v, 0) / excessReturns.length
      : null;

  const symbols = Object.keys(bySymbol);
  const top3ByCount = [...symbols]
    .sort((a, b) => bySymbol[b].count - bySymbol[a].count)
    .slice(0, 3)
    .map((symbol) => ({ symbol, count: bySymbol[symbol].count }));

  const top3ByVolume = [...symbols]
    .sort((a, b) => bySymbol[b].volume - bySymbol[a].volume)
    .slice(0, 3)
    .map((symbol) => ({ symbol, volume: bySymbol[symbol].volume }));

  return {
    totalTrades,
    totalPurchases,
    totalSales,
    totalVolume,
    avgExcessReturn,
    top3ByCount,
    top3ByVolume,
  };
}

interface PoliticianColumnProps {
  bioguideid: string;
}

function PoliticianColumn({ bioguideid }: PoliticianColumnProps) {
  const { data: politician, isLoading: politicianLoading } =
    usePolitician(bioguideid);
  const { data: trades, isLoading: tradesLoading } =
    usePoliticianTrades(bioguideid);

  const stats = computeStats(trades);
  const isLoading = politicianLoading || tradesLoading;

  const summaryRows = [
    {
      label: "Total Trades",
      value: stats?.totalTrades.toLocaleString() ?? "0",
    },
    {
      label: "Purchases",
      value: stats?.totalPurchases.toLocaleString() ?? "0",
    },
    { label: "Sales", value: stats?.totalSales.toLocaleString() ?? "0" },
    {
      label: "Total Volume",
      value: stats ? formatVolume(stats.totalVolume) : "$0",
    },
    {
      label: "Avg Excess Return",
      value:
        stats?.avgExcessReturn != null
          ? `${stats.avgExcessReturn >= 0 ? "+" : ""}${stats.avgExcessReturn.toFixed(2)}%`
          : "N/A",
    },
  ];

  return (
    <Stack spacing={2}>
      {/* Profile Card */}
      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="circular" width={60} height={60} />
            <Stack spacing={0.5}>
              <Typography variant="h6" fontWeight="bold">
                {politicianLoading ? (
                  <Skeleton variant="text" width={140} />
                ) : politician ? (
                  <PoliticianLink
                    name={politician.name}
                    bioGuideId={politician.bioGuideId}
                  />
                ) : (
                  "Unknown Politician"
                )}
              </Typography>
              <Stack direction="row" spacing={1}>
                {politicianLoading ? (
                  <Skeleton variant="text" width={100} />
                ) : (
                  <>
                    <Typography variant="body2">
                      {formatParty(politician?.party ?? "Other")}
                    </Typography>
                    <Typography variant="body2">{politician?.house}</Typography>
                  </>
                )}
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Trade Summary */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Trade Summary
          </Typography>
          <Stack spacing={1.5} divider={<Divider flexItem />}>
            {summaryRows.map(({ label, value }) => (
              <Stack
                key={label}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
                {isLoading ? (
                  <Skeleton variant="text" width={60} />
                ) : (
                  <Typography variant="body2" fontWeight="bold">
                    {value}
                  </Typography>
                )}
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Top 3 Stocks by Trade Count */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Top 3 Stocks by Trade Count
          </Typography>
          <Stack spacing={1}>
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} variant="text" height={24} />
                ))
              : (stats?.top3ByCount ?? []).map(({ symbol, count }) => (
                  <Stack
                    key={symbol}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <StockLink symbol={symbol} />
                    <Typography variant="body2" color="text.secondary">
                      {count} trades
                    </Typography>
                  </Stack>
                ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Top 3 Stocks by Volume */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Top 3 Stocks by Volume
          </Typography>
          <Stack spacing={1}>
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} variant="text" height={24} />
                ))
              : (stats?.top3ByVolume ?? []).map(({ symbol, volume }) => (
                  <Stack
                    key={symbol}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <StockLink symbol={symbol} />
                    <Typography variant="body2" color="text.secondary">
                      {formatVolume(volume)}
                    </Typography>
                  </Stack>
                ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default function PoliticianComparisonPage() {
  const { id1, id2 } = CompareRoute.useSearch();

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack spacing={3} sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Politician Comparison
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <PoliticianColumn bioguideid={id1} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <PoliticianColumn bioguideid={id2} />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
