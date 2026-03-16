import { Card, CardContent, Grid, Skeleton, Typography } from "@mui/material";
import { formatVolume } from "../internals/utils/format";
import { PoliticianLink } from "./PoliticianLink";
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

  const topPoliticianComponent = (
    <PoliticianLink
      name={topPolitician}
      bioGuideId={data?.find((t) => t.name === topPolitician)?.bioGuideId ?? ""}
    />
  );

  // top politician by total volume
  const topPoliticianVolume: { name: string; bioGuideId: string } = data
    ? data.reduce(
        (top, trade) => {
          const volume = data
            .filter((t) => t.name === trade.name)
            .reduce((sum, t) => sum + t.amount, 0);
          return volume > top.volume
            ? { name: trade.name, volume, bioGuideId: trade.bioGuideId }
            : top;
        },
        { name: "", volume: 0, bioGuideId: "" },
      )
    : { name: "N/A", bioGuideId: "" };

  const topPoliticianVolumeComponent = (
    <PoliticianLink
      name={topPoliticianVolume.name}
      bioGuideId={topPoliticianVolume.bioGuideId}
    />
  );

  const stats = [
    { label: "Total Trades", value: totalTrades },
    { label: "Total Volume", value: totalVolume },
    { label: "Top Politician by Trades", value: topPoliticianComponent },
    { label: "Top Politician by Volume", value: topPoliticianVolumeComponent },
  ];

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

export default StockTradeStats;
