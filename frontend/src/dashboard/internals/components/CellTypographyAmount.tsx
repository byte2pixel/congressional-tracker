import { Typography } from "@mui/material";
import { formatVolume } from "../utils/format";
import type { JSX } from "react";

export const CellTypographyAmount = ({
  amount,
}: {
  amount: string;
}): JSX.Element => {
  return (
    <Typography
      variant="body2"
      color="text.main"
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        fontWeight: "bold",
      }}
    >
      {amount}
    </Typography>
  );
};
