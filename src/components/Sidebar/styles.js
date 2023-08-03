const styles = (theme) => ({
  sidebarContainer: {
    position: "fixed",
    paddingTop: "2.6rem",
    width: "4.375rem",
    backgroundColor: theme.palette.primary.main,
    height: "100vh",
    boxShadow: "0 0 10px #ddd",
    zIndex: 1,
  },
  sidebarMenu: {
    "& a span": { fontSize: "12px" },
  },
  sidebarItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "0.875rem 0rem",
    padding: "0.60rem 0.25rem",
    textAlign: "center",
    "& img": {
      padding: 0,
    },
  },
  sidebarItemName: {
    color: theme.palette.primary.contrastText,
  },
  sidebarItemSelected: {
    backgroundColor: theme.palette.background.active,
  },
  sidebarItemNameSelected: {
    color: "#0b1941 !important",
  },
  sidebarItemIconSelected: {},
});

export default styles;
