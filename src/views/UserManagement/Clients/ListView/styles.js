const styles = (theme) => ({
  root: {
    margin: "0px",
    width: "100%",
  },
  paper: {
    margin: "40px 30px 5px",
    padding: "20px",
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
    width: "50px",
    fontSize: "14px",
    color: "#0b1941",
  },
  mediumBtn: {
    width: "130px",
    height: "48px",
    fontSize: "14px",
    color: "#FFFFFF",
    borderRadius: "28px",
    backgroundColor: " ",
    boxShadow:
      "0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.2)",
    "&:hover": {
      color: "#FFFFFF",
      backgroundColor: " ",
      borderRadius: "28px",
    },
  },
  smallIcon: {
    width: "20px",
    height: "24px",
    color: "#0b1941",
  },
  iconText: {
    width: "50px",
    height: "10px",
    fontSize: "14px",
    lineHeight: "18px",
    lineSpacing: "0.25px",
    color: "#0b1941",
  },
  searchBox: {
    height: "0.1876em",
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

  dropDownListLoader:{
    position: "absolute",
    top: "8px",
    left: "35%",
    zIndex:"9999"       
  },

  paginationBox:{
    float: "left",
    width: "100%",
    margin: "20px 0 0",
    "& .MuiPaper-elevation1":{
      boxShadow: "none",
      borderTop: "1px solid rgba(224, 224, 224, 1)",
      "& .MuiBox-root":{
        paddingBottom: "0"
      }
    }
  }

});
export default styles;
