import { CellTypographyGainLoss } from "../components/CellTypographyGainLoss";
import { CellTypographyAmount } from "../components/CellTypographyAmount";
import { CellChipTransactionType } from "../components/CellChipTransactionType";
import { formatVolume } from "../utils/format";
import type { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import type { PoliticianTrade } from "@/api/politicians";
import { StockLink } from "@/dashboard/components/StockLink";

export const rows = (trades: Array<PoliticianTrade>): GridRowsProp => {
  return trades.map((trade, index) => ({
    id: index,
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
    field: "symbol",
    headerName: "Symbol",
    flex: 1.5,
    minWidth: 150,
    renderCell: (params) => <StockLink symbol={params.value} />,
  },
  {
    field: "company",
    headerName: "Company",
    flex: 1,
    renderCell: (params) => (
      <StockLink
        name={params.value}
        symbol={params.row.symbol}
        sx={{ fontWeight: "normal" }}
      />
    ),
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
    // minWidth: 50,
    renderCell: CellTypographyGainLoss,
  },
];
