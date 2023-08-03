const styles = (theme) => ({
  root: {
    width: "100%",
    margin: "-60px 0 0 0",
  },
  mainButton: {    
    color: "#ffffff",
    padding: "12px 20px",
    borderRadius: "50px",
  },
  center: {
    margin: "15px auto",
    display: "table",
  },
  checkClass: {
    verticalAlign: "middle",
  },
  paper: {
    margin: "20px 30px 5px",
    width: "100%",
  },
  gtidItem: {
    backgroundColor: theme.palette.background.paper,
  },
  marginRightSm: {
    margin: "0 6px",
  },
  wrapper: {
    wordWrap: "break-word",
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
    width: "auto",
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
  row: {
    width: "100%",
  },
  floatLeft: {
    float: "left",
  },
  floatRight: {
    float: "right",
  },
  roundBox: {
    background: "#d4cbcb",
    width: "42px",
    height: "42px",
    textAlign: "center",
    textTransform: "capitalize",
    borderRadius: "100px",
    fontSize: "20px",
    fontWeight: "500",
    margin: "0 12px 0 0",
    lineHeight: "2.1",
    display: "inline-block"    
  },
  RadioBtn: {
    color: "red",
  },
});
export default styles;
