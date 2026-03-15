import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { useMatches } from "@tanstack/react-router";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));

export default function NavbarBreadcrumbs() {
  const matches = useMatches();
  const titles = matches
    .filter((m) => m.staticData?.getTitle)
    .map((m, index) => (
      <Typography
        key={m.id}
        variant="body1"
        sx={{
          color: "text.primary",
          fontWeight: index === matches.length - 1 ? "bold" : "inherit",
        }}
      >
        {m.staticData.getTitle()}
      </Typography>
    ));

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {titles}
    </StyledBreadcrumbs>
  );
}
