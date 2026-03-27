import { useMemo } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

export interface IndustryEntry {
  label: string;
  value: number;
}

export interface TopIndustryPieChartProps {
  title: string;
  subtitle: string;
  data: Array<IndustryEntry>;
  isLoading?: boolean;
  valueFormatter?: (value: number) => string;
}

function PieCenterLabel({ topIndustry }: Readonly<{ topIndustry: string }>) {
  const { width, height, left, top } = useDrawingArea();
  const theme = useTheme();
  const fw = 100;
  const fh = 64;
  const cx = left + width / 2;
  const cy = top + height / 2;

  return (
    <foreignObject x={cx - fw / 2} y={cy - fh / 2} width={fw} height={fh}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          textAlign: "center",
          fontSize: "0.7rem",
          fontWeight: 600,
          color: (theme.vars || theme).palette.text.secondary,
          lineHeight: 1.3,
        }}
      >
        {topIndustry}
      </div>
    </foreignObject>
  );
}

export default function TopIndustryPieChart({
  title,
  subtitle,
  data,
  isLoading = false,
  valueFormatter,
}: TopIndustryPieChartProps) {
  const theme = useTheme();

  const colors = useMemo(
    () => [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
      theme.palette.info.main,
      theme.palette.secondary.main,
      theme.palette.primary.light,
      theme.palette.success.light,
      theme.palette.warning.light,
      theme.palette.info.light,
    ],
    [theme],
  );

  const topIndustry = data.length > 0 ? data[0].label : "N/A";

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        height: "100%",
      }}
    >
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {subtitle}
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
            }}
          >
            <PieChart
              colors={colors}
              series={[
                {
                  data,
                  innerRadius: 60,
                  outerRadius: 85,
                  paddingAngle: 2,
                  highlightScope: { fade: "global", highlight: "item" },
                  valueFormatter: valueFormatter
                    ? (item) => valueFormatter(item.value)
                    : undefined,
                },
              ]}
              height={210}
              width={210}
              margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
              hideLegend
            >
              <PieCenterLabel topIndustry={topIndustry} />
            </PieChart>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
