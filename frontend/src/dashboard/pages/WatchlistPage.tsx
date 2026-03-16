import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import WatchlistTradesDataGrid from "../components/WatchlistTradesDataGrid";
import { useWatchlist } from "@/context/WatchlistContext";
import { Route as StockDetailRoute } from "@/routes/stock_.$symbol";
import { Route as PoliticianDetailRoute } from "@/routes/politician_.$bioguideid";

export default function WatchlistPage() {
  const { watchedStocks, watchedPoliticians, removeStock, removePolitician } =
    useWatchlist();
  const navigate = useNavigate();

  const hasWatchedItems =
    watchedStocks.length > 0 || watchedPoliticians.length > 0;

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Watchlist
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Watched Stocks */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Typography
                component="h3"
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
              >
                Watched Stocks
              </Typography>
              {watchedStocks.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No stocks watched yet. Visit a stock page to add one.
                </Typography>
              ) : (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {watchedStocks.map((stock) => (
                    <Chip
                      key={stock.symbol}
                      label={stock.symbol}
                      title={stock.company}
                      onClick={() =>
                        void navigate({
                          to: StockDetailRoute.to,
                          params: { symbol: stock.symbol },
                        })
                      }
                      onDelete={() => removeStock(stock.symbol)}
                    />
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Watched Politicians */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Typography
                component="h3"
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
              >
                Watched Politicians
              </Typography>
              {watchedPoliticians.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No politicians watched yet. Visit a politician page to add
                  one.
                </Typography>
              ) : (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {watchedPoliticians.map((politician) => (
                    <Chip
                      key={politician.bioGuideId}
                      label={politician.name}
                      onClick={() =>
                        void navigate({
                          to: PoliticianDetailRoute.to,
                          params: { bioguideid: politician.bioGuideId },
                        })
                      }
                      onDelete={() => removePolitician(politician.bioGuideId)}
                    />
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 2 }} />

      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Recent Watchlist Trades
      </Typography>

      {hasWatchedItems ? (
        <WatchlistTradesDataGrid />
      ) : (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Add stocks or politicians to your watchlist to see their recent
              trades here.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
