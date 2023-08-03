const styles = (theme) => ({
  root: {
    margin: "0px",
    width: "100%",
  },
  paper: {
    margin: "24px 48px",
    width: "100%",
  },
  inputLabel: {
    margin: ".5rem 0",
    color: "#76777b",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "25px",
    display: "block",
    marginBottom: 0,
  },
  fieldset: {
    border: "1px solid #d8d8d8",
    padding: "0 20px 10px 20px",
    width: "90%",
    display: "block",
    marginBottom: "20px",
  },
  legend: {
    width: "auto",
    padding: "5px",
    fontSize: "14px",
    borderBottom: "0px",
    fontWeight: "500",
    marginBottom: "10px",
  },
  gridItem: {
    padding: "0px 10px",
  },
  panelHeading: {
    backgroundColor: "#f9f9f9",
  },
  pageHeader: {
    borderBottom: "0px",
    padding: "0px 0px 15px 0px",
    letterSpacing: "1px",
    fontSize: "24px",
    color: "#243d7d",
  },
  mandatory: {
    color: "#ff0000",
  },
  formHeading: {
    paddingLeft: "28px",
    margin: "10px",
    fontSize: "20px",
    color: "#056dae",
    fontWeight: 700,
    textTransform: "uppercase",
    display: "inline-block",
  },
  input: {
    display: "none",
  },
  uploadBtn: {
    borderRadius: "28px",
    justifyContent: "flex-start",
    height: "54px",
    width: "100%",
  },
  multiSelect: {
    width: "100%",
  },

  tabClass: {
    flexGrow: 1,
    padding: "4px",
    margin: "5px",
    height: "25px",
    minHeight: "25px",
  },
  tabItem: {
    root: {
      flexGrow: 1,
      color: theme.palette.secondary.dark,
      borderRadius: "4px",
      textTransform: "capitalize",
      // backgroundColor: theme.palette.background.active,
      backgroundColor: "#6094B1",
      border: "none",
    },
    flexContainer: {
      margin: "5px",
    },
  },
  indicator: {
    backgroundColor: "transparent",
    color: "#fff",
    borderRadius: "0",
  },
  checkedIcon: {
    position: "relative",
  },
  checkClass: {
    height: "22px",
    width: "22px",
    position: "absolute",
    right: "-21%",
    top: "8%",
  },
  selected: {
    backgroundColor: "#008ce6",
    color: theme.palette.background.active,
    borderRadius: "4px",
    textTransform: "capitalize",
  },
});

export default styles;
