import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import "./App.css";
const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#6094B1",
      main: "#0B1941",
      contrastText: "#F0F0F0",
      heading: "#1C4B6B",
    },
    secondary: {
      light: "#f7fafc",
      main: "#008ce6",
      dark: "#20252d",
      bars: "#CCE4FF",
      contrastText: "#999999",//"#0B1941"
      active: "#008ce6",
      text: "#FFF",
    },
    success: {
      main: "#6CC551",
    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "#fff",
    },
    background: {
      default: "#F7F7F7",
      active: "#FFF",
      light: "#FAFAFA",
      selected: "#008ce6",
    },
    text: {
      primary: "rgba(0,0,0,0.87)",
      secondary: "#5f697a",
      default: "#FFFFFF",
      selected: "#008ce6",
      active: "#008ce6",
    },
    button: {
      primary: "#0b1a40",
      disabled: "#e0e0e0",
    },
    border: {
      main: "#0b1941",
      primary: "#0b1941",
    },
  },
  typography: {
    baseFontSize: 1,
    fontSize: 1,
    htmlFontSize: 1,
    fontFamily: "Interstate ,Arial, Helvetica, sanserif",
    button: {
      textTransform: "none",
    },
    h1: {
      fontWeight: 500,
      fontSize: "1.5rem",
    },
    h2: {
      fontWeight: "normal",
      fontSize: "1.125rem",
    },
    h3: {
      fontWeight: 400,
      fontSize: "1.125rem",
    },
    h4: {
      fontWeight: 500,
      fontSize: "1rem",
    },
    h5: {
      fontWeight: 300,
      fontSize: "1rem",
    },
    h6: {
      fontWeight: 500,
      fontSize: "0.75rem",
    },
    subtitle1: {
      fontWeight: 300,
      fontSize: "0.813rem",
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: "0.813rem",
    },
    body1: {
      fontWeight: 400,
      fontSize: "1rem",
    },
    body2: {
      fontWeight: 400,
      fontSize: "0.875rem",
    },
    caption: {
      fontWeight: 400,
      fontSize: "0.75rem",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "@font-face": ["Interstate"],
      },
    },
    MuiButton: {
      outlined: {
        border: "1px solid #0b1941",
        "&.Mui-disabled": {
          border: "1px solid rgba(0, 0, 0, 0.38)",
        },
      },
    },
  },
});

const ThemeWrapper = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ThemeWrapper;
