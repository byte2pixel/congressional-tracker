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
import { Route as StockDetailRoute } from "@/routes/stock_.$symbol";
import { useStockTrades } from "@/hooks/useStockTrades";

const StyledText = styled("text")(({ theme }) => ({
  textAnchor: "middle",
  dominantBaseline: "central",
  fill: (theme.vars || theme).palette.text.secondary,
}));

function PieCenterLabel({ total }: Readonly<{ total: number }>) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <React.Fragment>
      <StyledText
        x={left + width / 2}
        y={top + height / 2 - 10}
        style={{ fontSize: "1.25rem", fontWeight: 600 }}
      >
        {total.toLocaleString()}
      </StyledText>
      <StyledText
        x={left + width / 2}
        y={top + height / 2 + 14}
        style={{ fontSize: "0.75rem" }}
      >
        Trades
      </StyledText>
    </React.Fragment>
  );
}

export default function StockDetailBuySellChart() {
  const theme = useTheme();
  const colorPalette = [theme.palette.success.main, theme.palette.error.main];
  const { symbol } = StockDetailRoute.useParams();
  const { data, isLoading } = useStockTrades(symbol);

  const { pieData, total } = useMemo(() => {
    if (!data) return { pieData: [], total: 0 };
    const purchases = data.filter((t) =>
      t.transactionType.startsWith("P"),
    ).length;
    const sales = data.filter((t) => t.transactionType.startsWith("S")).length;
    return {
      pieData: [
        { label: "Purchases", value: purchases },
        { label: "Sales", value: sales },
      ],
      total: purchases + sales,
    };
  }, [data]);

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        height: "100%",
      }}
    >
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Buy / Sell Breakdown
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
              colors={colorPalette}
              series={[
                {
                  data: pieData,
                  innerRadius: 60,
                  outerRadius: 85,
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
            <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
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
                      bgcolor: colorPalette[i],
                    }}
                  />
                  <Typography variant="caption">
                    {item.label}: {item.value.toLocaleString()}
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
