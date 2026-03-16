import { DataGrid } from "@mui/x-data-grid";
import { Card, useMediaQuery, useTheme } from "@mui/material";
import { memo, useMemo } from "react";
import { columns, rows } from "../internals/data/activeStocksColumns";
import { useMostActiveStocks } from "@/hooks/useMostActiveStocks";

function ActiveStocksDataGrid() {
  const { data, isLoading, error } = useMostActiveStocks();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const getRows = useMemo(() => {
    if (!data) return [];
    return rows(data);
  }, [data]);

  let columnVisibilityModel = {};
  if (isSmall) {
    columnVisibilityModel = {
      company: false,
      tickerType: false,
      purchaseCount: false,
      saleCount: false,
    };
  } else if (isMedium) {
    columnVisibilityModel = {
      company: true,
      tickerType: false,
      purchaseCount: false,
      saleCount: false,
    };
  } else {
    columnVisibilityModel = {
      company: true,
      tickerType: true,
      purchaseCount: true,
      saleCount: true,
    };
  }

  if (error) {
    console.error("Error fetching most active stocks:", error);
  }

  return (
    <Card sx={{ width: "100%" }}>
      <DataGrid
        label="Most Active Stocks (By Estimated Volume)"
        showToolbar
        loading={isLoading}
        checkboxSelection
        rows={getRows}
        columns={columns}
        disableRowSelectionOnClick
        disableColumnSelector
        columnVisibilityModel={columnVisibilityModel}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
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
    </Card>
  );
}

export default memo(ActiveStocksDataGrid);

