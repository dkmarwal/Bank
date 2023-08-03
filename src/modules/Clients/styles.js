const styles = (theme) => ({
  root: {
    margin: "-40px 0 0 0",
    width: "100%",
  },
  mainButton: {
    background: "#008ce6 !important",
    color: "#ffffff",
    padding: "12px 20px",
    borderRadius: "50px",
  },
  center: {
    margin: "0px auto",
    display: "table",
  },
  checkClass: {
    verticalAlign: "middle",
    maxWidth: "24px!important",
    maxHeight: "24px!important",
    display: "inline-block",
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
    fontSize: 16,
    color: "#0b1941",
    fontWeight: 400,
  },

  lightColor: {
    width: "auto",
    fontSize: "14px",
    color: "#4C4C4C",
    fontWeight: "normal",
    paddingRight: "0px",
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
    background: "#E9EEF2",
    width: 50,
    height: 50,
    textAlign: "center",
    textTransform: "capitalize",
    borderRadius: "100%",
    fontSize: 18,
    fontWeight: 500,
    display: "inline-block",
    lineHeight: "50px",
  },
  RadioBtn: {
    color: "red",
  },
  cardShadow: {
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    height: "250px",
  },
  redDot: {
    position: "absolute",
    right: "10px",
    top: "10px",
    height: "16px",
    width: "16px",
    backgroundColor: "#CF6679",
    borderRadius: "50%",
  },
  cardContent: {
    // height: "230px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  alignCenter: {
    textAlign: "center",
  },
  cardTexts: {
    textAlign: "center",
    position: "relative",
    width: "99.5%",
  },
  profileCircle: {
    borderRadius: "50%",
    fontSize: 16,
    width: 34,
    height: 34,
    display: "inline-block",
    lineHeight: "34px",
    background: "#F0F6FB",
    color: theme.palette.primary.main,
  },
  supplierName: {
    margin: "0 16px 0 16px",
    fontSize: "20px",
    fontWeight: "500",
    letterSpacing: "1.1px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  marginHorizontal: {
    margin: "0 5px",
  },
  smallTitle: {
    fontSize: "14px",
    fontWeight: 500,
    textAlign: "center",
  },
  PaymentMethodTitle: {
    fontSize: "14px",
    fontWeight: 500,
    textAlign: "center",
    lineHeight: "20px",
  },
  accountNoTitle: {
    fontSize: "14px",
    fontWeight: 300,
    textAlign: "center",
    color: "#000",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    margin: "0 16px",
  },
  approvedText: {
    padding: "3px 10px",
    textAlign: "center",
    letterSpacing: "1px",
  },
  filterSelected: {
    borderRadius: "16px",
    border: "solid #0B1941 thin",
  },
  filterButtons: {
    height: "32px",
  },
});
export default styles;
