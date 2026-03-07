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
import { useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import type { HTMLAttributes } from "react";
import type { Politician } from "@/api/politicians";
import { usePoliticianSearch } from "@/hooks/usePoliticianSearch";

interface PoliticianOptionProps extends HTMLAttributes<HTMLLIElement> {
  option: Politician;
}

function PoliticianOption({ option, ...props }: PoliticianOptionProps) {
  const { key, ...restProps } = props as typeof props & { key?: React.Key };
  return (
    <li key={key} {...restProps}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2">{option.name}</Typography>
        <Typography variant="caption" color="text.secondary">
          {option.party} · {option.house}
        </Typography>
      </Stack>
    </li>
  );
}

export default function PoliticianSearchCard() {
  const [inputValue, setInputValue] = useState("");
  const { data: options = [], isFetching } = usePoliticianSearch(inputValue);

  return (
    <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Politician Search
        </Typography>
        <Stack spacing={2} sx={{ justifyContent: "space-between" }}>
          <Autocomplete
            freeSolo
            id="politician-search"
            disableClearable
            options={options}
            getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.name)}
            inputValue={inputValue}
            onInputChange={(_, newValue) => setInputValue(newValue)}
            loading={isFetching}
            renderOption={({ key, ...props }, option) => (
              <PoliticianOption key={key} {...props} option={option} />
            )}
            renderInput={(params) => (
              <OutlinedInput
                sx={{ width: { xs: "100%" } }}
                {...params.InputProps}
                inputProps={params.inputProps}
                id={params.id}
                size="small"
                placeholder="Search politicians…"
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
