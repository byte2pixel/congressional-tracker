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
import { useNavigate } from "@tanstack/react-router";
import { Avatar } from "@mui/material";
import PoliticianTradesDataGrid from "../components/PoliticianTradesDataGrid";
import PoliticianTradeStats from "../components/PoliticianTradeStats";
import PoliticianDetailBuySellChart from "../components/PoliticianDetailBuySellChart";
import PoliticianDetailTradeActivityChart from "../components/PoliticianDetailTradeActivityChart";
import PoliticianSearchCard from "../components/PoliticianSearchCard";
import type { Politician } from "@/api/politicians";
import { Route as PoliticianDetailRoute } from "@/routes/politician_.$bioguideid";
import { usePolitician } from "@/hooks/usePolitician";
import { useWatchlist } from "@/context/WatchlistContext";

function ProfileHeader() {
  const { bioguideid } = PoliticianDetailRoute.useParams();
  const { data, isLoading } = usePolitician(bioguideid);
  const { addPolitician, removePolitician, isWatchingPolitician } =
    useWatchlist();
  const watching = isWatchingPolitician(bioguideid);

  function handleWatchToggle() {
    if (watching) {
      removePolitician(bioguideid);
    } else if (data) {
      addPolitician({
        bioGuideId: bioguideid,
        name: data.name,
        party: data.party,
        house: data.house,
      });
    }
  }

  return (
    <Card>
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
              alt={data?.imageAltText ?? data?.name ?? "Politician Image"}
              src={data?.imageUrl}
              sx={{ width: 80, height: 80 }}
            />
          )}
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" fontWeight="bold">
                {isLoading ? (
                  <Skeleton variant="text" width={120} />
                ) : (
                  data?.name || "Unknown Politician"
                )}
              </Typography>
              <Tooltip
                title={watching ? "Remove from watchlist" : "Add to watchlist"}
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
            <Stack direction="row" spacing={1}>
              {isLoading ? (
                <>
                  <Skeleton variant="text" width={80} />
                  <Skeleton variant="text" width={80} />
                </>
              ) : (
                <>
                  <Typography variant="body2">
                    {data?.party ?? "Other"}
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
  const { bioguideid } = PoliticianDetailRoute.useParams();
  const navigate = useNavigate();

  function handleCompareSelect(politician: Politician) {
    void navigate({
      to: "/politician-compare",
      search: { id1: bioguideid, id2: politician.bioGuideId },
    });
  }

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack spacing={3} sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="stretch">
          <Grid size={{ xs: 12, md: 6 }}>
            <ProfileHeader />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <PoliticianSearchCard
              label="Compare with another politician"
              onSelect={handleCompareSelect}
            />
          </Grid>
        </Grid>
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
