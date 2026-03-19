import { Chip } from "@mui/material";
import { useMemo } from "react";
import type { JSX } from "react";
import type { GridRenderCellParams } from "@mui/x-data-grid";

export const CellChipTransactionType = (
  params: GridRenderCellParams,
): JSX.Element => {
  const transactionType = params.value as string;

  const color: "error" | "success" | "default" = useMemo(() => {
    const firstLetter = transactionType.charAt(0).toUpperCase();
    switch (firstLetter) {
      case "S":
        return "error"; // Sale
      case "P":
        return "success"; // Purchase
      default:
        return "default"; // Grey Exchange or unknown types
    }
  }, [transactionType]);

  return <Chip label={transactionType} color={color} />;
};
