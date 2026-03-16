import { useMemo } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Copyright from "../internals/components/Copyright";
import ActiveTradersDataGrid from "../components/ActiveTradersDataGrid";
import HouseSenateChart from "../components/HouseSenateChart";
import PartyTradesBarChart from "../components/PartyTradesBarChart";
import PoliticianSearchCard from "../components/PoliticianSearchCard";
import TopTradersBarChart from "../components/TopTradersBarChart";
import { useActiveTraders } from "@/hooks/useActiveTraders";

interface CountCardProps {
  title: string;
  value: string | number;
}

function CountCard({ title, value }: CountCardProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="p">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function PoliticianPage() {
  const { data } = useActiveTraders();

  const counts = useMemo(() => {
    if (!data) return { total: "—", house: "—", senate: "—" };
    return {
      total: data.length,
      house: data.filter((t) => t.house === "Representatives").length,
      senate: data.filter((t) => t.house === "Senate").length,
    };
  }, [data]);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Find a Politician
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid size={{ xs: 12, sm: 6 }}>
          <PoliticianSearchCard />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <CountCard title="Active Traders" value={counts.total} />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <CountCard title="House Members" value={counts.house} />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <CountCard title="Senate Members" value={counts.senate} />
        </Grid>
      </Grid>

      <Divider sx={{ mb: (theme) => theme.spacing(2) }} />

      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid size={{ xs: 12, md: 4 }}>
          <HouseSenateChart />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <PartyTradesBarChart />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TopTradersBarChart />
        </Grid>
      </Grid>

      <Divider sx={{ mb: (theme) => theme.spacing(2) }} />

      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Most Active Traders
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid size={{ xs: 12 }}>
          <ActiveTradersDataGrid />
        </Grid>
      </Grid>

      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
