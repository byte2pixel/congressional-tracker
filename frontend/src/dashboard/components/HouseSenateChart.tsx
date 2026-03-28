import * as React from "react";
import { useMemo } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useActiveTraders } from "@/hooks/useActiveTraders";

const StyledText = styled("text")(({ theme }) => ({
  textAnchor: "middle",
  dominantBaseline: "central",
  fill: (theme.vars || theme).palette.text.secondary,
}));

function PieCenterLabel({ total }: { total: number }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <React.Fragment>
      <StyledText
        x={left + width / 2}
        y={top + height / 2 - 10}
        style={{ fontSize: "1.25rem", fontWeight: 600 }}
      >
        {total}
      </StyledText>
      <StyledText
        x={left + width / 2}
        y={top + height / 2 + 14}
        style={{ fontSize: "0.75rem" }}
      >
        Traders
      </StyledText>
    </React.Fragment>
  );
}

export default function HouseSenateChart() {
  const theme = useTheme();
  const colors = [
    theme.palette.primary.main,
    theme.palette.error.main,
    theme.palette.grey[500],
    "hsl(220, 20%, 55%)",
    "hsl(220, 20%, 35%)",
  ];
  const { data, isLoading } = useActiveTraders();

  const { pieData, total } = useMemo(() => {
    if (!data) return { pieData: [], total: 0 };
    const houseCount = data.filter((t) => t.house === "Representatives").length;
    const senateCount = data.filter((t) => t.house === "Senate").length;
    return {
      pieData: [
        { label: "House", value: houseCount, color: colors[3] },
        { label: "Senate", value: senateCount, color: colors[4] },
      ],
      total: data.length,
    };
  }, [data]);

  const { pieData2 } = useMemo(() => {
    if (!data) return { pieData2: [] };
    const senateDemocrats = data.filter(
      (t) => t.house === "Senate" && t.party === "Democratic",
    ).length;
    const senateRepublicans = data.filter(
      (t) => t.house === "Senate" && t.party === "Republican",
    ).length;
    const senateOthers = data.filter(
      (t) =>
        t.house === "Senate" &&
        t.party !== "Democratic" &&
        t.party !== "Republican",
    ).length;
    const houseDemocrats = data.filter(
      (t) => t.house === "Representatives" && t.party === "Democratic",
    ).length;
    const houseRepublicans = data.filter(
      (t) => t.house === "Representatives" && t.party === "Republican",
    ).length;
    const houseOthers = data.filter(
      (t) =>
        t.house === "Representatives" &&
        t.party !== "Democratic" &&
        t.party !== "Republican",
    ).length;
    return {
      pieData2: [
        { label: "House Democrats", value: houseDemocrats, color: colors[0] },
        {
          label: "House Republicans",
          value: houseRepublicans,
          color: colors[1],
        },
        { label: "House Others", value: houseOthers, color: colors[2] },
        { label: "Senate Democrats", value: senateDemocrats, color: colors[0] },
        {
          label: "Senate Republicans",
          value: senateRepublicans,
          color: colors[1],
        },
        { label: "Senate Others", value: senateOthers, color: colors[2] },
      ],
    };
  }, [data]);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        height: "100%",
      }}
    >
      <CardContent
        sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
      >
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Chamber Breakdown
        </Typography>
        {isLoading ? (
          <Skeleton
            variant="circular"
            width={200}
            height={200}
            sx={{ mx: "auto", my: 2 }}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
            }}
          >
            <PieChart
              series={[
                {
                  data: pieData,
                  innerRadius: 50,
                  outerRadius: 65,
                  paddingAngle: 2,
                  highlightScope: { fade: "global", highlight: "item" },
                },
                {
                  data: pieData2,
                  innerRadius: 70,
                  outerRadius: 100,
                  paddingAngle: 2,
                  highlightScope: { fade: "global", highlight: "item" },
                },
              ]}
              height={210}
              width={210}
              margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
              hideLegend
            >
              <PieCenterLabel total={total} />
            </PieChart>
            <Stack direction="row" spacing={3}>
              {pieData.map((item, i) => (
                <Stack
                  key={item.label}
                  direction="row"
                  alignItems="center"
                  spacing={0.5}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: colors[i + 2],
                    }}
                  />
                  <Typography variant="caption">
                    {item.label}: {item.value}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
