import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { formatParty } from "../internals/utils/format";
import PoliticianTradesDataGrid from "./PoliticianTradesDataGrid";
import PoliticianTradeStats from "./PoliticianTradeStats";
import PoliticianDetailBuySellChart from "./PoliticianDetailBuySellChart";
import PoliticianDetailTradeActivityChart from "./PoliticianDetailTradeActivityChart";
import { Route as PoliticianDetailRoute } from "@/routes/politician_.$bioguideid";
import { usePolitician } from "@/hooks/usePolitician";

function ProfileHeader() {
  const { bioguideid } = PoliticianDetailRoute.useParams();
  const { data, isLoading } = usePolitician(bioguideid);
  return (
    <Card variant="outlined">
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
                  <Typography variant="body2">
                    {formatParty(data?.party ?? "Other")}
                  </Typography>
                  <Typography variant="body2">{data?.house}</Typography>
                </>
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary">
              ID: {bioguideid}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function PoliticianDetailPage() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack spacing={3} sx={{ mb: 2 }}>
        <ProfileHeader />
        <PoliticianTradeStats />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <PoliticianDetailTradeActivityChart />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <PoliticianDetailBuySellChart />
          </Grid>
        </Grid>
        <PoliticianTradesDataGrid />
      </Stack>
    </Box>
  );
}
