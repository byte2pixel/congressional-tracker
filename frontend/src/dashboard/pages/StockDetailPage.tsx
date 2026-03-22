import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Bookmark from "@mui/icons-material/Bookmark";
import BookmarkBorder from "@mui/icons-material/BookmarkBorder";
import { Avatar } from "@mui/material";
import StockTradeStats from "../components/StockTradeStats";
import StockDetailTradeActivityChart from "../components/StockDetailTradeActivityChart";
import StockDetailBuySellChart from "../components/StockDetailBuySellChart";
import StockTradesDataGrid from "../components/StockTradesDataGrid";
import { useStock } from "@/hooks/useStock";
import { useWatchlist } from "@/context/WatchlistContext";
import { Route as StockDetailRoute } from "@/routes/stock_.$symbol";

function StockHeader() {
  const { symbol } = StockDetailRoute.useParams();
  const { data, isLoading } = useStock(symbol);
  const { addStock, removeStock, isWatchingStock } = useWatchlist();
  const watching = isWatchingStock(symbol);

  function handleWatchToggle() {
    if (watching) {
      removeStock(symbol);
    } else if (data) {
      addStock({ symbol, company: data.company });
    }
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems={{ sm: "center" }}
        >
          {isLoading ? (
            <Skeleton variant="circular" width={80} height={80} />
          ) : (
            <Avatar
              src={data?.logo ?? "/static/images/avatar/7.jpg"}
              alt={`${data?.company} logo`}
              sx={{ width: 80, height: 80 }}
            />
          )}
          <Stack spacing={0.5}>
            {isLoading ? (
              <>
                <Skeleton variant="text" width={20} />
                <Skeleton variant="text" width={120} />
              </>
            ) : (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h6" fontWeight="bold">
                  {data?.symbol || "Unknown Stock"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {data?.company || "Company name not available"}
                </Typography>
                <Tooltip
                  title={
                    watching ? "Remove from watchlist" : "Add to watchlist"
                  }
                >
                  <span>
                    <IconButton
                      size="small"
                      onClick={handleWatchToggle}
                      color={watching ? "primary" : "default"}
                      disabled={!data}
                    >
                      {watching ? (
                        <Bookmark fontSize="small" />
                      ) : (
                        <BookmarkBorder fontSize="small" />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            )}
            <Stack direction="row" spacing={1}>
              {isLoading ? (
                <Skeleton variant="text" width={80} />
              ) : (
                <Typography variant="body2">{data?.type}</Typography>
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary">
              ID: {symbol}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function StockDetailPage() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack spacing={3} sx={{ mb: 2 }}>
        <StockHeader />
        <StockTradeStats />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <StockDetailTradeActivityChart />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StockDetailBuySellChart />
          </Grid>
        </Grid>
        <StockTradesDataGrid />
      </Stack>
    </Box>
  );
}
