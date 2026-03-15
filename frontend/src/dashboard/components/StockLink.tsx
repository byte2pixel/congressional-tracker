import { RouterLink } from "../internals/components/RouterLink";
import type { SxProps, Theme } from "@mui/material";
import { Route as StockDetailRoute } from "@/routes/stock_.$symbol";

export function StockLink({
  symbol,
  name,
  sx,
}: {
  symbol: string;
  name?: string;
  sx?: SxProps<Theme>;
}) {
  return (
    <RouterLink
      preload="intent"
      to={StockDetailRoute.to}
      params={{ symbol }}
      sx={[
        {
          color: "text.primary",
          fontWeight: "bold",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {name ?? symbol}
    </RouterLink>
  );
}
