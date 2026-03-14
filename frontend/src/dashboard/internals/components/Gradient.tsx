import { useTheme } from "@mui/material";

export function Gradient({ id }: { id: string }) {
  const theme = useTheme();
  return (
    <linearGradient
      id={id}
      x1="0%"
      y1="0%"
      x2="100%"
      y2="0%"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0%" stopColor={theme.palette.primary.dark} />
      <stop offset="50%" stopColor={theme.palette.primary.main} />
      <stop offset="100%" stopColor={theme.palette.error.main} />
    </linearGradient>
  );
}
