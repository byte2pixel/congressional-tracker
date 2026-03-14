import { Stack, Typography } from "@mui/material";
import { formatVolume } from "../utils/format";
import type { RecentTrade } from "@/api/recentTrades";
import type { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { PoliticianLink } from "@/dashboard/components/PoliticianLink";

export const rows = (trades: Array<RecentTrade>): GridRowsProp => {
  return trades.map((trade, index) => ({
    id: index,
    bioGuideId: trade.bioGuideId,
    name: trade.name,
    party: trade.party,
    house: trade.house,
    symbol: trade.symbol,
    company: trade.company,
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
    headerName: "Politician",
    flex: 1.5,
    minWidth: 150,
    renderCell: (params) => (
      <PoliticianLink name={params.value} bioGuideId={params.row.bioGuideId} />
    ),
  },
  {
    field: "symbol",
    headerName: "Symbol",
    flex: 1,
    // minWidth: 300,
    // render the stack with Symbol and Company using MUI components
    renderCell: (params) => {
      const { symbol, company } = params.row;
      return (
        <Stack direction="column" marginTop={1} marginBottom={1}>
          <Typography variant="body2" fontWeight="bold">
            {symbol}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {company}
          </Typography>
        </Stack>
      );
    },
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
