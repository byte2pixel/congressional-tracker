import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import { Route } from "@/routes/politicians_.$bioguideid";
import { usePolitician } from "@/hooks/usePolitician";

// TODO: wire up GET /api/politicians/{bioGuideId} when backend endpoint is ready

function ProfileHeader({ bioGuideId }: { bioGuideId: string }) {
  const { data, isLoading } = usePolitician(bioGuideId);
  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems={{ sm: "center" }}
        >
          {/* TODO: replace with politician photo */}
          <Skeleton variant="circular" width={80} height={80} />
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight="bold">
              {isLoading ? (
                <Skeleton variant="text" width={120} />
              ) : (
                data?.name || "Unknown Politician"
              )}
            </Typography>
            <Stack direction="row" spacing={1}>
              {isLoading ? (
                <>
                  <Skeleton variant="text" width={80} />
                  <Skeleton variant="text" width={80} />
                </>
              ) : (
                <>
                  <Typography variant="body2">{data?.party}</Typography>
                  <Typography variant="body2">{data?.house}</Typography>
                </>
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary">
              ID: {bioGuideId}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function StatCards() {
  return (
    <Grid container spacing={2}>
      {/* TODO: replace skeletons with real data */}
      {(["Total Trades", "Total Volume", "Top Stock"] as const).map((label) => (
        <Grid key={label} size={{ xs: 12, sm: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                {label}
              </Typography>
              <Skeleton variant="text" width="60%" height={32} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

function TradeHistory() {
  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Trade History
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {/* TODO: replace with real data grid */}
        <Stack spacing={1}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={40} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

function ActivityChart() {
  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Trade Activity Over Time
        </Typography>
        {/* TODO: replace with real chart */}
        <Skeleton variant="rectangular" height={240} />
      </CardContent>
    </Card>
  );
}

function BuySellChart() {
  return (
    <Card variant="outlined" sx={{ width: "100%", height: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Buy / Sell Breakdown
        </Typography>
        {/* TODO: replace with real chart */}
        <Skeleton
          variant="circular"
          width={180}
          height={180}
          sx={{ mx: "auto", mt: 1 }}
        />
      </CardContent>
    </Card>
  );
}

export default function PoliticianDetailPage() {
  const { bioguideid } = Route.useParams();

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack spacing={3} sx={{ mb: 2 }}>
        <ProfileHeader bioGuideId={bioguideid} />
        <StatCards />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <ActivityChart />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <BuySellChart />
          </Grid>
        </Grid>
        <TradeHistory />
      </Stack>
    </Box>
  );
}
