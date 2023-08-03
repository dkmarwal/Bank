const styles = (theme) => ({
  root: {
    margin: "0px",
    width: "100%",
  },
  paper: {
    margin: "32px 48px",
    width: "100%",
  },
  gtidItem: {
    backgroundColor: theme.palette.background.paper,
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
  smallBtn: {
    // width: "150px",
    fontSize: "14px",
    color: "#0b1941",
  },
  mediumBtn: {
    width: "200px",
    height: "48px",
    fontSize: "14px",
    color: "#FFFFFF",
    borderRadius: "28px",
    backgroundColor: "#008ce6",
    boxShadow:
      "0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.2)",
    "&:hover": {
      color: "#FFFFFF",
      backgroundColor: "#008ce6",
      borderRadius: "28px",
    },
  },
  smallIcon: {
    width: "20px",
    height: "26px",
    color: "#0b1941",
  },
  iconText: {
    paddingLeft: "5px",
    fontSize: "14px",
    lineHeight: "18px",
    lineSpacing: "0.25px",
    color: "#0b1941",
  },
  searchBox: {
    //height: "0.1876em",
    width: "370px",
    paddingTop: "5px",
    fontSize: "14px",
    letterSpacing: "0.44px",
    lineHeight: "24px",
  },
  multiSelect: {
    margin: theme.spacing(1),
    width: "100%",
    display: "flex",
  },
  dropdownStyle: {
    maxHeight: "200px",
  },
});
export default styles;
