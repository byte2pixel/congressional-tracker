import type { MostActiveStock } from "@/api/mostActiveStocks";
import type { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { StockLink } from "@/dashboard/components/StockLink";

export const rows = (stocks: Array<MostActiveStock>): GridRowsProp => {
  return stocks.map((stock, index) => ({
    id: index,
    symbol: stock.symbol,
    company: stock.company ?? "—",
    tickerType: stock.tickerType ?? "—",
    purchaseCount: stock.purchaseCount,
    saleCount: stock.saleCount,
    totalTrades: stock.totalTrades,
    totalEstimatedVolume: stock.totalEstimatedVolume,
  }));
};

export const columns: Array<GridColDef> = [
  {
    field: "symbol",
    headerName: "Symbol",
    flex: 0.8,
    minWidth: 80,
    renderCell: (params) => <StockLink symbol={params.value} />,
  },
  {
    field: "company",
    headerName: "Company",
    flex: 2,
    minWidth: 160,
    renderCell: (params) => (
      <StockLink
        symbol={params.row.symbol}
        name={params.value}
        sx={{ fontWeight: "normal" }}
      />
    ),
  },
  {
    field: "tickerType",
    headerName: "Type",
    flex: 1,
    minWidth: 100,
  },
  {
    field: "purchaseCount",
    headerName: "Purchases",
    headerAlign: "right",
    align: "right",
    flex: 0.8,
    minWidth: 90,
  },
  {
    field: "saleCount",
    headerName: "Sales",
    headerAlign: "right",
    align: "right",
    flex: 0.8,
    minWidth: 70,
  },
  {
    field: "totalTrades",
    headerName: "Total Trades",
    headerAlign: "right",
    align: "right",
    flex: 0.8,
    minWidth: 100,
  },
  {
    field: "totalEstimatedVolume",
    headerName: "Est. Volume",
    headerAlign: "right",
    align: "right",
    flex: 1,
    minWidth: 120,
    renderCell: (params) => {
      const amount: number = params.value;
      return `$${amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
];

