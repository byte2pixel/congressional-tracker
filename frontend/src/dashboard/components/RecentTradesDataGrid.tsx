import { DataGrid } from "@mui/x-data-grid";
import { columns, rows } from "../internals/data/recentTradesColumns";
import { useRecentTrades } from "@/hooks/useRecentTrades";

export default function RecentTradesDataGrid() {
  const { data, isLoading, error } = useRecentTrades();

  if (error) {
    console.log("Error fetching recent trades:", error);
  }

  return (
    <DataGrid
      loading={isLoading}
      checkboxSelection
      rows={data ? rows(data) : []}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density="standard"
      slotProps={{
        loadingOverlay: {
          variant: "skeleton",
          noRowsVariant: "linear-progress",
        },
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: "outlined",
              size: "small",
            },
            columnInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            operatorInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: "outlined",
                size: "small",
              },
            },
          },
        },
      }}
    />
  );
}
