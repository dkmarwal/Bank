const styles = (theme) => ({
  tabClasses: {
    borderBottom: "1px solid",
  },
  paymentsTabContainer: {
    fontSize: "12px",
    fontWeight: "bold",
  },

  indicator: {
    // backgroundColor: "transparent",
    color: theme.palette.secondary.main,
    borderRadius: "5px",
    textTransform: "capitalize",
    // "&$selected": {
    //   color: theme.palette.primary.main,
    // },
  },

  value: {
    color: theme.palette.text.black,
    fontSize: "14px",
    letterSpacing: "0.44px",
    wordBreak: "break-word",
    display: "flex",
    alignItems: "flex-end",
  },
  key: {
    // margin: "0 40px 0 0",
    color: theme.palette.text.black,
    fontSize: "14px",
    fontWeight: "bold",
    // textAlign: "center",
  },
  validationDone: {
    color: "#008CE6",
    fontSize: "14px",
    letterSpacing: "0.25px",
    marginLeft: "10px",
    verticalAlign: "text-bottom",
  },
  validationPending: {
    color: "#282828",
    fontSize: "14px",
    letterSpacing: "0.25px",
    marginLeft: "10px",
    verticalAlign: "text-bottom",
  },
  smallIcon: {
    width: "20px",
    height: "24px",
  },
  details: {
    fontSize: "14px",
  },
  profileCircle: {
    fontSize: "48px",
    textAlign: "center",
    margin: "0 auto",
    borderRadius: "100%",
    color: "rgba(0,0,0,0.87)",
    fontWeight: 500,
    height: 100,
    width: 100,
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
  },
  circleContact: {
    padding: "10px",
    fontWeight: "500",
    width: "43px",
    borderRadius: "50%",
    marginRight: "10px",
    verticalAlign: "middle",
  },
  vendorName: {
    fontSize: "24px",
    textAlign: "center",
    fontWeight: "500",
    margin: "14px 0 0 0",
  },
  contactIcons: {
    fontSize: "10px",
    marginRight: "10px",
    width: 18,
  },
  card: {
    borderRadius: 0,
    boxShadow:
      "0 6px 10px 0 rgba(0,0,0,0.07), 0 1px 18px 0 rgba(0,0,0,0.06), 0 3px 5px -1px rgba(0,0,0,0.1)",
    // margin: "15px 0",
  },
  iconBtn: {
    width: "30px",
    height: "40px",
  },
  icon: {
    // margin: "0 0 0 10px",
    width: "21px",
    position: "relative",
    top: "14px",
    left: "10px",
  },
  overflowAuto: {
    overflow: "visible",
    height: "28rem",
  },
  gapHorizontal: {
    margin: "0 5px",
  },
  detailsView: {
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },
  panel: {
    backgroundColor: " #f6f6f6 !important",
    borderBottom: "3px solid #1e4564",
    boxShadow: "none !important",
    color: "#1e4564",
    padding: "5px 10px 5px 0",
    margin: "16px 0 !important",
  },
  payment_icon: {
    verticalAlign: "text-bottom",
  },
  remCheckbox: {
    padding: "20px",
  },
  btnContainer: {
    padding: "16px 25px 25px 16px",
    display: "block",
    float: "left",
  },
  btnSave: {
    minWidth: 90,
    border: "2px solid #0B1941 !important",
    fontSize: "14px !important",
    boxSizing: "border-box",
  },
  btnDisabled: {
    padding: "10px 30px",
    height: "35px",
    border: `1px solid #F2F2F2`,
    boxShadow: "none",
    backgroundColor: `${theme.palette.background.active} !important`,
    color: theme.palette.primary.grey,
  },
  icon_btn: {
    marginRight: "15px",
    cursor: "pointer",
  },
  checkIconClass: {
    fontSize: "20px",
    marginRight: "5px",
    position: "relative",
    bottom: "5px",
  },
  toolTipClass: {
    backgroundColor: theme.palette.primary.lightGrey,
    fontWeight: "normal",
    color: theme.palette.text.black,
  },
  paymentTitle: {
    color: "#0B1941",
    fontSize: "20px",
    lineHeight: "20px",
  },
  remInfo: {
    color: "rgba(0,0,0,0.87)",
    fontSize: "16px",
    fontWeight: "normal",
    padding: "0 16px",
  },
  showText: {
    color: theme.palette.primary.light,
    fontSize: "14px",
    fontWeight: "500",
  },
  expansionDetails: {
    borderTop: "1px solid #E2E2E2",
    borderBottom: "1px solid #E2E2E2",
  },
  infoKey: {
    paddingRight: "10px",
    color: "#000000",
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
    lineHeight: "19px",
  },
  infoValue: {
    color: "#000000",
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
    lineHeight: "19px",
  },
});

export default styles;
