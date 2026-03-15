import { formatParty, formatVolume } from "../utils/format";
import type { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import type { StockTrade } from "@/api/stocks";

export const rows = (trades: Array<StockTrade>): GridRowsProp => {
  return trades.map((trade, index) => ({
    id: index,
    name: trade.name,
    party: trade.party,
    house: trade.house,
    transactionDate: trade.transactionDate,
    transactionType: trade.transactionType,
    amount: trade.amount,
    range: trade.range,
    excessReturn: trade.excessReturn,
  }));
};

export const columns: Array<GridColDef> = [
  {
    field: "name",
    headerName: "Name",
    flex: 1.5,
    minWidth: 150,
  },
  {
    field: "party",
    headerName: "Affiliation",
    flex: 1,
    valueFormatter: (params) => formatParty(params as string),
  },
  {
    field: "house",
    headerName: "Chamber",
    flex: 1,
  },
  {
    field: "transactionDate",
    headerName: "Transaction Date",
    headerAlign: "right",
    align: "right",
    flex: 1,
    // minWidth: 120,
    renderCell: (params) => {
      const date = new Date(params.value);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },
  },
  {
    field: "transactionType",
    headerName: "Transaction Type",
    headerAlign: "right",
    align: "right",
    flex: 1,
    // minWidth: 150,
  },
  {
    field: "amount",
    headerName: "Amount",
    headerAlign: "right",
    align: "right",
    flex: 1,
    // minWidth: 50,
    renderCell: (params) => {
      const amount = params.value;
      return formatVolume(amount, 1);
    },
  },
  {
    field: "excessReturn",
    headerName: "Gain / Loss",
    headerAlign: "right",
    align: "right",
    flex: 1,
    // minWidth: 50,
    renderCell: (params) => {
      const excessReturn = params.value as number | null;
      if (excessReturn === null) {
        return "-";
      }
      return `${excessReturn >= 0 ? "+" : ""}${excessReturn.toFixed(2)}%`;
    },
  },
];
