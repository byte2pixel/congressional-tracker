import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  Autocomplete,
  CircularProgress,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { HTMLAttributes } from "react";
import type { Stock } from "@/api/stocks";
import { useStockSearch } from "@/hooks/useSearchStock";
import { Route as StockDetailRoute } from "@/routes/stock_.$symbol";

interface StockOptionProps extends HTMLAttributes<HTMLLIElement> {
  option: Stock;
}

function StockOption({ option, ...props }: StockOptionProps) {
  const { key, ...restProps } = props as typeof props & { key?: React.Key };
  return (
    <li key={key} {...restProps}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2">{option.symbol}</Typography>
        <Typography variant="caption" color="text.secondary">
          {option.company}
        </Typography>
      </Stack>
    </li>
  );
}

export default function StockSearchCard() {
  const [inputValue, setInputValue] = useState("");
  const { data: options = [], isFetching } = useStockSearch(inputValue);
  const navigate = useNavigate();

  function handleSelect(_: React.SyntheticEvent, value: Stock | string) {
    if (typeof value === "string") return;
    void navigate({
      to: StockDetailRoute.to,
      params: { symbol: value.symbol },
    });
  }

  return (
    <Card sx={{ height: "100%", flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Stock Search
        </Typography>
        <Stack spacing={2} sx={{ justifyContent: "space-between" }}>
          <Autocomplete
            freeSolo
            id="stock-search"
            disableClearable
            options={options}
            filterOptions={(x) => x}
            getOptionLabel={(opt) =>
              typeof opt === "string" ? opt : opt.symbol
            }
            inputValue={inputValue}
            onInputChange={(_, newValue) => setInputValue(newValue)}
            loading={isFetching}
            onChange={handleSelect}
            renderOption={({ key, ...props }, option) => (
              <StockOption key={key} {...props} option={option} />
            )}
            renderInput={(params) => (
              <OutlinedInput
                sx={{ width: { xs: "100%" } }}
                {...params.InputProps}
                inputProps={params.inputProps}
                id={params.id}
                size="small"
                placeholder="Search stocks…"
                startAdornment={
                  <InputAdornment
                    position="start"
                    sx={{ color: "text.primary" }}
                  >
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                }
                endAdornment={
                  <>
                    {isFetching ? <CircularProgress size={16} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                }
              />
            )}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
