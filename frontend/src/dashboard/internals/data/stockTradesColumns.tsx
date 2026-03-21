import { formatVolume } from "../utils/format";
import { CellTypographyGainLoss } from "../components/CellTypographyGainLoss";
import { CellTypographyAmount } from "../components/CellTypographyAmount";
import { CellChipTransactionType } from "../components/CellChipTransactionType";
import type { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import type { StockTrade } from "@/api/stocks";
import { PoliticianLink } from "@/dashboard/components/PoliticianLink";

export const rows = (trades: Array<StockTrade>): GridRowsProp => {
  return trades.map((trade, index) => ({
    id: index,
    bioGuideId: trade.bioGuideId,
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
    renderCell: (params) => (
      <PoliticianLink name={params.value} bioGuideId={params.row.bioGuideId} />
    ),
  },
  {
    field: "party",
    headerName: "Affiliation",
    flex: 1,
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
