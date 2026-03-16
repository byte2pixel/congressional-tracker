import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import CoffeeRoundedIcon from "@mui/icons-material/CoffeeRounded";
import DataObjectRoundedIcon from "@mui/icons-material/DataObjectRounded";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";

const apiSources = [
  {
    name: "Quiver Quantitative",
    description:
      "Provides congressional trading data, including buy/sell disclosures filed by members of Congress.",
    url: "https://www.quiverquant.com/",
    icon: <StorageRoundedIcon />,
  },
  {
    name: "Finnhub.io",
    description:
      "Real-time stock market data, company fundamentals, and financial news used to enrich trade details.",
    url: "https://finnhub.io/",
    icon: <DataObjectRoundedIcon />,
  },
  {
    name: "Congress.gov",
    description:
      "Official source for congressional member information, biographical data, and legislative records.",
    url: "https://congress.gov/",
    icon: <StorageRoundedIcon />,
  },
];

export default function AboutPage() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Hero */}
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
          Congressional Trading Tracker
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: "text.secondary", maxWidth: 720 }}
        >
          A transparency tool that surfaces stock trades made by U.S. members of
          Congress — letting you follow the market activity of your elected
          representatives in one place.
        </Typography>
      </Stack>

      <Divider sx={{ mb: 4 }} />

      {/* What it does */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                What This Site Does
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", mb: 2 }}
              >
                Members of the U.S. Congress are required by the STOCK Act to
                publicly disclose stock transactions within 45 days of a trade.
                This site aggregates those disclosures and makes them easy to
                explore — search by politician, by ticker symbol, filter by
                party, chamber, or date range, and spot patterns in how
                lawmakers are investing.
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Track the most active traders, see buy/sell ratios, monitor
                individual portfolios, and watch the stocks most frequently
                traded by Congress — all updated regularly from public filings.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            elevation={1}
            sx={{
              height: "100%",
            }}
          >
            <CardContent>
              <Stack spacing={1} sx={{ mb: 2 }}>
                <Chip
                  label="Open Source"
                  size="small"
                  icon={<CodeRoundedIcon />}
                  color="primary"
                  variant="outlined"
                />
              </Stack>
              <Typography variant="h6" gutterBottom>
                Built in the Open
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                The full source code is publicly available.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Link
                  href="https://github.com/byte2pixel/congressional-tracker"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <GitHubIcon fontSize="small" />
                  byte2pixel/congressional-tracker
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Creator */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Creator
      </Typography>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, hsl(210,98%,35%) 0%, hsl(210,98%,20%) 100%)"
                    : "linear-gradient(135deg, hsl(210,98%,55%) 0%, hsl(210,98%,42%) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Typography variant="h5" sx={{ color: "white", fontWeight: 700 }}>
                MD
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Mel Dommer
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 1.5 }}
              >
                Full-stack developer and open-source enthusiast. Built this site
                to make congressional trade data more accessible and transparent
                for everyone.
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Link
                  href="https://github.com/byte2pixel"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <GitHubIcon fontSize="small" />
                  GitHub
                </Link>
                <Link
                  href="https://www.byte2pixel.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <LanguageRoundedIcon fontSize="small" />
                  byte2pixel.dev
                </Link>
                <Link
                  href="https://www.buymeacoffee.com/byte2pixel"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <CoffeeRoundedIcon fontSize="small" />
                  Buy me a coffee
                </Link>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Data Sources
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        This project is made possible by the following third-party APIs. A
        special thank you to Quiver Quantitative for providing a free API key.
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {apiSources.map((source) => (
          <Grid key={source.name} size={{ xs: 12, sm: 4 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 1.5 }}
                >
                  <Box
                    sx={{
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {source.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "1rem", fontWeight: 600 }}
                  >
                    {source.name}
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 2 }}
                >
                  {source.description}
                </Typography>
                <Link
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="body2"
                >
                  {source.url.replace(/^https?:\/\//, "")}
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ mb: 3 }} />
      <Typography variant="body2" sx={{ color: "text.secondary", pb: 2 }}>
        Congressional trade disclosures are public record. This site is not
        affiliated with or endorsed by the U.S. Congress or any government
        agency.
      </Typography>
    </Box>
  );
}
