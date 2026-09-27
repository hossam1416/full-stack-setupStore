"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",

    background: {
      default: "#0c0a09",
      paper: "#1c1917",
    },

    primary: {
      main: "#fbbf24",
      contrastText: "#000000",
    },

    text: {
      primary: "#ffffff",
      secondary: "#a1a1aa",
    },

    divider: "#27272a",
  },
});

export default theme;
