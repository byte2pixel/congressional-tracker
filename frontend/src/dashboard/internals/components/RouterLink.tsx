import { Link } from "@mui/material";
import { createLink } from "@tanstack/react-router";
import React from "react";
import type { LinkProps } from "@mui/material";

export const RouterLink = createLink(
  React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
    <Link ref={ref} {...props} />
  )),
);
