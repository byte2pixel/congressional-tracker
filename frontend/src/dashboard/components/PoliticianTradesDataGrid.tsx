import { DataGrid } from "@mui/x-data-grid";
import { Card, useMediaQuery, useTheme } from "@mui/material";
import { memo, useMemo } from "react";
import { columns, rows } from "../internals/data/politicianTradesColumns";
import { usePoliticianTrades } from "@/hooks/usePoliticianTrades";
import { Route as PoliticianDetailRoute } from "@/routes/politician_.$bioguideid";

function PoliticianTradesDataGrid() {
  const { bioguideid } = PoliticianDetailRoute.useParams();
  const { data, isLoading, error } = usePoliticianTrades(bioguideid);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLarge = useMediaQuery(theme.breakpoints.between("md", "lg"));

  const getRows = useMemo(() => {
    if (!data) return [];
    return rows(data);
  }, [data]);

  let columnVisibilityModel = {};
  if (isSmall) {
    columnVisibilityModel = {
      amount: false,
      transactionDate: false,
      transactionType: false,
    };
  } else if (isMedium) {
    columnVisibilityModel = {
      amount: true,
      transactionDate: false,
      transactionType: false,
    };
  } else if (isLarge) {
    columnVisibilityModel = {
      amount: true,
      transactionDate: true,
      transactionType: false,
    };
  } else {
    columnVisibilityModel = {
      amount: true,
      transactionDate: true,
      transactionType: true,
    };
  }

  if (error) {
    console.log("Error fetching politician trades:", error);
  }

  return (
    <Card sx={{ width: "100%" }}>
      <DataGrid
        label="Trade History"
        showToolbar
        loading={isLoading}
        checkboxSelection
        rows={getRows}
        columns={columns}
        disableColumnSelector
        disableRowSelectionOnClick
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

export default memo(PoliticianTradesDataGrid);
