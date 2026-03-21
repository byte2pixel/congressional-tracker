import { Card, CardContent, Grid, Skeleton, Typography } from "@mui/material";
import { useMemo } from "react";
import { formatVolume } from "../internals/utils/format";
import { StockLink } from "./StockLink";
import { usePoliticianTrades } from "@/hooks/usePoliticianTrades";
import { Route as PoliticianDetialRoute } from "@/routes/politician_.$bioguideid";

function PoliticianTradeStats() {
  const { bioguideid } = PoliticianDetialRoute.useParams();
  const { data, isLoading } = usePoliticianTrades(bioguideid);

  const totalTrades = useMemo(
    () => data?.length.toLocaleString() ?? "0",
    [data],
  );
  const totalVolume = useMemo(
    () =>
      data
        ? formatVolume(data.reduce((sum, trade) => sum + trade.amount, 0))
        : formatVolume(0),
    [data],
  );

  // top stock by number of trades
  const topStock: { ticker: string; count: number } = useMemo(
    () =>
      data
        ? data.reduce(
            (top, trade) => {
              const count = data.filter(
                (t) => t.symbol === trade.symbol,
              ).length;
              return count > top.count ? { ticker: trade.symbol, count } : top;
            },
            { ticker: "", count: 0 },
          )
        : { ticker: "N/A", count: 0 },
    [data],
  );

  // top stock symbol by total volume
  const topStockVolume: { ticker: string; volume: number } = useMemo(
    () =>
      data
        ? data.reduce(
            (top, trade) => {
              const volume = data
                .filter((t) => t.symbol === trade.symbol)
                .reduce((sum, t) => sum + t.amount, 0);
              return volume > top.volume
                ? { ticker: trade.symbol, volume }
                : top;
            },
            { ticker: "", volume: 0 },
          )
        : { ticker: "N/A", volume: 0 },
    [data],
  );

  const topStockComponent = useMemo(
    () => (
      <>
        <StockLink symbol={topStock.ticker} />
        {` (${topStock.count})`}
      </>
    ),
    [topStock],
  );

  const topStockVolumeComponent = useMemo(
    () => (
      <>
        <StockLink symbol={topStockVolume.ticker} />
        {` (${formatVolume(topStockVolume.volume)})`}
      </>
    ),
    [topStockVolume],
  );

  const stats = useMemo(
    () => [
      { label: "Total Trades", value: totalTrades },
      { label: "Total Volume", value: totalVolume },
      { label: "Top Stock by Trades", value: topStockComponent },
      {
        label: "Top Stock by Volume",
        value: topStockVolumeComponent,
      },
    ],
    [totalTrades, totalVolume, topStockComponent, topStockVolumeComponent],
  );

  return (
    <Grid container spacing={2}>
      {stats.map((stat) => (
        <Grid key={stat.label} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                {stat.label}
              </Typography>
              {isLoading ? (
                <Skeleton variant="text" width={100} />
              ) : (
                <Typography variant="h6" width="60%" fontWeight="bold">
                  {stat.value}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default PoliticianTradeStats;
