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
      <stop offset="0%" stopColor={theme.palette.grey[600]} />
      <stop offset="50%" stopColor={theme.palette.grey[500]} />
      <stop offset="100%" stopColor={theme.palette.grey[400]} />
    </linearGradient>
  );
}
