import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "@tanstack/react-router";
import { useNotifications } from "@/context/NotificationsContext";
import { Route as StockDetailRoute } from "@/routes/stock_.$symbol";
import { Route as PoliticianDetailRoute } from "@/routes/politician_.$bioguideid";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

export default function NotificationsPage() {
  const { notifications, dismiss, dismissAll } = useNotifications();
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography component="h2" variant="h6">
          Notifications
        </Typography>
        <Button
          size="small"
          variant="outlined"
          disabled={notifications.length === 0}
          onClick={dismissAll}
        >
          Clear all
        </Button>
      </Stack>

      {notifications.length === 0 ? (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              No new notifications. Add stocks or politicians to your watchlist
              to be notified about their trades.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={1}>
          {notifications.map((n) => {
            const { trade } = n;
            const isBuy = trade.transactionType
              .toLowerCase()
              .includes("purchase");
            return (
              <Card key={n.id} variant="outlined">
                <CardContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    "&:last-child": { pb: 2 },
                  }}
                >
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      flexWrap="wrap"
                      useFlexGap
                      sx={{ mb: 0.5 }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" },
                        }}
                        onClick={() =>
                          void navigate({
                            to: PoliticianDetailRoute.to,
                            params: { bioguideid: trade.bioGuideId },
                          })
                        }
                      >
                        {trade.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        traded
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" },
                        }}
                        onClick={() =>
                          void navigate({
                            to: StockDetailRoute.to,
                            params: { symbol: trade.symbol },
                          })
                        }
                      >
                        {trade.symbol}
                      </Typography>
                      <Chip
                        label={isBuy ? "Buy" : "Sell"}
                        color={isBuy ? "success" : "error"}
                        size="small"
                      />
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      flexWrap="wrap"
                      useFlexGap
                    >
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(trade.transactionDate)}
                      </Typography>
                      <Divider orientation="vertical" flexItem />
                      <Typography variant="caption" color="text.secondary">
                        {formatAmount(trade.amount)}
                        {trade.range ? ` (${trade.range})` : ""}
                      </Typography>
                      <Divider orientation="vertical" flexItem />
                      <Typography variant="caption" color="text.secondary">
                        {trade.company}
                      </Typography>
                    </Stack>
                  </Box>
                  <Tooltip title="Dismiss">
                    <IconButton
                      size="small"
                      aria-label="Dismiss notification"
                      onClick={() => dismiss(n.id)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
