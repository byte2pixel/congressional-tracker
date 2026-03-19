import { Typography, useTheme } from "@mui/material";
import type { GridRenderCellParams } from "@mui/x-data-grid";
import type { JSX } from "react";

export const CellTypographyGainLoss = (
  params: GridRenderCellParams,
): JSX.Element => {
  const theme = useTheme();
  const excessReturn = params.value as number | null;
  const csx = {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  };
  if (excessReturn === null) {
    return (
      <Typography
        variant="body2"
        color={theme.palette.text.primary}
        sx={{ ...csx, fontWeight: "bold" }}
      >
        N/A
      </Typography>
    );
  }
  return (
    <Typography
      variant="body2"
      color={
        excessReturn >= 0
          ? theme.palette.success.main
          : theme.palette.error.main
      }
      sx={{ ...csx, fontWeight: "bold" }}
    >
      {`${excessReturn >= 0 ? "+" : ""}${excessReturn.toFixed(2)}%`}
    </Typography>
  );
};
