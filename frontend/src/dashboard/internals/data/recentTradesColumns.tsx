import { Stack, Typography } from "@mui/material";
import { CellTypographyAmount } from "../components/CellTypographyAmount";
import { CellTypographyGainLoss } from "../components/CellTypographyGainLoss";
import { CellChipTransactionType } from "../components/CellChipTransactionType";
import { formatVolume } from "../utils/format";
import type { RecentTrade } from "@/api/recentTrades";
import type { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { PoliticianLink } from "@/dashboard/components/PoliticianLink";
import { StockLink } from "@/dashboard/components/StockLink";

export const rows = (trades: Array<RecentTrade>): GridRowsProp => {
  return trades.map((trade, index) => ({
    id: index,
    bioGuideId: trade.bioGuideId,
    name: trade.name,
    party: trade.party,
    house: trade.house,
    symbol: trade.symbol,
    company: trade.company,
    transactionDate: new Date(trade.transactionDate),
    reportDate: new Date(trade.reportDate),
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
    renderCell: (params) => {
      const { symbol, company } = params.row;
      return (
        <Stack direction="column" marginTop={1} marginBottom={1}>
          <StockLink symbol={symbol} sx={{ lineHeight: 1.43 }} />
          <Typography variant="caption" color="text.secondary">
            {company}
          </Typography>
        </Stack>
      );
    },
  },
  {
    field: "reportDate",
    headerName: "Report Date",
    headerAlign: "right",
    align: "right",
    flex: 1,
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
    field: "transactionDate",
    headerName: "Transaction Date",
    headerAlign: "right",
    align: "right",
    flex: 1,
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
    renderCell: CellChipTransactionType,
  },
  {
    field: "amount",
    headerName: "Amount",
    headerAlign: "right",
    align: "right",
    flex: 1,
    renderCell: (params) => (
      <CellTypographyAmount amount={formatVolume(params.value as number)} />
    ),
  },
  {
    field: "excessReturn",
    headerName: "Gain / Loss",
    headerAlign: "right",
    align: "right",
    flex: 1,
    renderCell: CellTypographyGainLoss,
  },
];
