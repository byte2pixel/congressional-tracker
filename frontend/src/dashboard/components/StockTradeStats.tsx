import { Card, CardContent, Grid, Skeleton, Typography } from "@mui/material";
import { formatVolume } from "../internals/utils/format";
import { Route as StockDetailRoute } from "@/routes/stock_.$symbol";
import { useStockTrades } from "@/hooks/useStockTrades";

function StockTradeStats() {
  const { symbol } = StockDetailRoute.useParams();
  const { data, isLoading } = useStockTrades(symbol);

  const totalTrades = data?.length.toLocaleString() ?? "0";
  const totalVolume = data
    ? formatVolume(data.reduce((sum, trade) => sum + trade.amount, 0))
    : formatVolume(0);

  // top politician by number of trades  const topPolitician: string = data
  const topPolitician: string = data
    ? data.reduce(
        (top, trade) => {
          const count = data.filter((t) => t.name === trade.name).length;
          return count > top.count ? { name: trade.name, count } : top;
        },
        { name: "", count: 0 },
      ).name
    : "N/A";

  // top politician by total volume
  const topPoliticianVolume: string = data
    ? data.reduce(
        (top, trade) => {
          const volume = data
            .filter((t) => t.name === trade.name)
            .reduce((sum, t) => sum + t.amount, 0);
          return volume > top.volume ? { name: trade.name, volume } : top;
        },
        { name: "", volume: 0 },
      ).name
    : "N/A";

  const stats = [
    { label: "Total Trades", value: totalTrades },
    { label: "Total Volume", value: totalVolume },
    { label: "Top Politician by Trades", value: topPolitician },
    { label: "Top Politician by Volume", value: topPoliticianVolume },
  ];

  return (
    <Grid container spacing={2}>
      {stats.map((stat) => (
        <Grid key={stat.label} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card variant="outlined">
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

export default StockTradeStats;
