import type { ActiveTrader } from "@/api/activeTraders";
import type { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { PoliticianLink } from "@/dashboard/components/PoliticianLink";

export const rows = (traders: Array<ActiveTrader>): GridRowsProp => {
  return traders.map((trader, index) => ({
    id: index,
    bioGuideId: trader.bioGuideId,
    name: trader.name,
    party: trader.party,
    house: trader.house,
    state: trader.state,
    saleCount: trader.saleCount,
    purchaseCount: trader.purchaseCount,
    totalTrades: trader.totalTrades,
    totalEstimatedVolume: trader.totalEstimatedVolume,
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
    field: "party",
    headerName: "Affiliation",
    flex: 1,
  },
  {
    field: "totalTrades",
    headerName: "Total Trades",
    headerAlign: "right",
    align: "right",
    flex: 1,
  },
  {
    field: "totalEstimatedVolume",
    headerName: "Total Estimated Volume",
    headerAlign: "right",
    align: "right",
    flex: 1,
    renderCell: (params) => {
      const amount = params.value;
      // padded to 2 decimal places.
      return `$${amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
];
