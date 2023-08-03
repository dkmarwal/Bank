const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#fff",
    "& .MuiTextField-root": {
      width: "100%",
    },
    height: "100vh",
  },
  heading: {
    paddingTop: 0,
    color: "#0c2074",
    fontSize: 26,
    fontWeight: 500,
    padding: "35px 80px",
  },
  title: {
    height: "43px",
    width: "538px",
    color: "rgba(11,25,65,0.87)",
    fontSize: "34px",
    letterSpacing: 0,
    lineHeight: "36px",
  },
  h1: {
    fontWeight: 400,
    fontSize: 24,
    color: theme.palette.primary.main,
  },
  headingNew: {
    fontWeight: 500,
    fontSize: 24,
    color: "#0b1941",
    width: "100%",
    margin: 0,
    padding: 23,
    lineHeight: "normal",
  },

  h2: {
    fontWeight: 400,
    fontSize: "22px",
  },
  textAttention: {
    fontWeight: 400,
    fontSize: 20,
    color: "#202020",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: "#002D72",
    marginRight: 5,
    display: "inline-block",
  },

  textNum: {
    fontWeight: 500,
    fontSize: 24,
    color: "rgba(0,0,0,0.87)",
  },
  subHeading: {
    fontWeight: 400,
    fontSize: "14px",
    color: "#4C4C4C",
    margin: "5px 0",
  },
  flagContainer: {
    fontWeight: 500,
    display: "flex",
    position: "relative",
    lineHeight: "42px",
    color: "#7F7F7F",
    cursor: "pointer",
    alignItems: "center",
  },
  tabContainer: {
    border: "1px solid #e6e6e6",
    borderRadius: "6px",
    padding: 2,
    width: 320,
    display: "flex",
    justifyContent: "space-between",
    boxSizing: "content-box",
  },
  tab: {
    padding: 5,
    borderRadius: 4,
    color: "#0b1941",
    fontSize: 16,
    width: "50%",
    textAlign: "center",
    fontWeight: 500,
  },
  expansionBtn: {
    boxShadow: "0 1px 1px 0 rgba(0,0,0,0.14), 0 0 3px 0 rgba(0,0,0,0.2)",
    borderRadius: "110px",
    margin: "0 0px 11px 0",
    width: "28px",
    height: "28px",
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
  },
  arrowsColor: {
    width: 24,
    color: "#7F7F7F",
  },
  expansionCards: {
    position: "relative",
    paddingBottom: "200px",
    boxShadow:
      "0 6px 10px 0 rgba(0,0,0,0.07), 0 1px 18px 0 rgba(0,0,0,0.06), 0 3px 5px -1px rgba(0,0,0,0.1)",
  },
  bgBlur: {
    position: "absolute",
    bottom: 0,
    background: `linear-gradient(0deg, rgba(255,255,255,1) 55%, rgba(255,255,255,0.5298494397759104) 100%)`,
    height: "70px",
    width: "100%",
    zIndex: 3,
  },
  link: {
    color: "#0b1941",
    marginRight: "2px",
    textDecoration: "underline !important",
  },
  iconContainer: { width: 21 },
  icon: {
    height: "21px",
    width: "21px",
    backgroundColor: "#E9EEF2",
    borderRadius: "76px",
    padding: "3px",
    color: "#53565A",
    fontSize: 8,
    position: "relative",
    top: "7px",
    margin: "0 10px 0 0",
  },
  circleText: {
    height: "20px",
    width: "20px",
    backgroundColor: "#E9EEF2",
    borderRadius: "76px",
    color: "#0B1941",
    margin: "3px 10px 0 0",
    textAlign: "center",
    display: "table",
    fontSize: 8,
    fontWeight: "bold",
    lineHeight: "20px",
  },
  text16: {
    fontSize: 16,
    margin: "8px 0",
  },
  percentage: {
    margin: "11px 0",
    display: "block",
    fontWeight: 500,
    color: "#282828",
    fontSize: "11px",
  },
  B2CEnrollDoughnutChrt:{
    float: "left",
    margin: "0 0 15px",
    width: "100%",
    textAlign: "center",
    "& canvas":{
      margin: "0 auto"
    },
    "& img":{
      margin: "0 auto"
    }
  },
  B2CTotalPayments:{
    float: "left",
    width: "100%",
    padding: "0 20px 20px",
    boxSizing: "border-box",
    color: "#4C4C4C",
    fontSize: "16px",
    textAlign: "center",
    lineHeight: "20px",
    "& span":{
      fontSize: "30px",
      color: "#000000",
      lineHeight: "28px",
      float: "left",
      margin: "-4px 0",
      width: "165px",
      textAlign: "center"
    },
    "& label":{
      float: "left",
      height: "10px",
      width: "10px",
      borderRadius: "50%",
      background: "#162D6E",
      margin: "5px 8px 0 0"
    }
  },
  B2CEnrollStatusTxt:{
    textAlign: "center",
    color: "rgba(18, 18, 18, 0.87)",
    fontSize: "16px"
  },

  SubHeader:{
    color: 'rgba(0,0,0,0.87)',
    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    backgroundColor: '#fff',
    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    paddingLeft: "48px",
    paddingRight: "48px",
    height: "130px",
    "& h1":{
      color: "#0B1941",
      padding: "21px 0px",
      fontSize: "34px",
      fontWeight: "500",
      margin: "0"
    }
  },

  legendList:{
    cursor: "default",
    "& .strike":{
      textDecoration: "line-through"
    }
  },

  B2CDataFilter:{
    float: "right",
    width: "auto",
    "& button":{
      textTransform: "capitalize",
      color: "#0b1941",
      margin: "-17px 0 20px 0",
      fontSize: 14,
      float: "left",
    },
    "& .clientDropDown":{
      float: "left",
      margin: "-20px 0 17px 0"
    }
  },

  B2CTopHead:{
    float: "left",
    width: "100%",
    borderBottom: "1px solid #8F9EC3",
    padding: "0",
    "& h1":{
      color: '#0B1941',
      display: 'inline-block',
      margin: 0,
      padding: '0 0 18px',
      fontSize: '24px',
      fontWeight: '400',
      lineHeight: 'normal',
    },
    "& .selectedClientName":{
      fontSize: "13px",
      color: "#828282",
      display: "inline-block",
      width: "auto",
      margin: "0 0 0 10px"
    }
  },

  topGrphData:{
    textAlign: "center",
    fontSize: "12px",
    color: "#828282",
    margin: "0 0 20px"
  },

  B2CBottomGraph:{
    borderBottom: "1px solid #8F9EC3",
    display:"block",
    paddingBottom: "10px",
    "& h1":{
      float: "left",
      width: "auto",
      padding: "0 0 18px",
      color: "#0B1941",
      fontWeight: '400',
    },
    "& .fileType":{
      float: "right"
    },
    "& .selectedClientName":{
      fontSize: "13px",
      color: "#828282",
      display: "inline-block",
      width: "auto",
      margin: "11px 0 0 10px"
    }
  },

  B2CPayeeGraph:{
    borderRight: "1px solid #8F9EC3",
    margin: '2% 30px 0 0',
    height: '96%',
    padding: "0 30px 0 0",
    boxSizing: "border-box"
  },

  payeGraphDiffBox:{
    borderTop: "1px solid #8F9EC3",
    margin: "20px 0 0",
    padding: "20px 0 0",
  },

  payeeGraphTitles:{
    textAlign: "center",
    marginBottom: 0,
    padding:"0 0 30px",
    position: "relative",
    "& h3":{
      color: "#121212",
      lineHeight: "20px",
      padding: "0 0 5px"
    },
    "& h6":{
      color: "#828282",
      fontSize: 12
    },
    "& .viewAllStatus":{
      position: "absolute",
      right: 0,
      top: 0,
      "& span.MuiCheckbox-root":{
        margin: "0 -5px 0 0"
      },
      "& span.MuiFormControlLabel-label":{
        color: "#4C4C4C",
        fontSize: "13px"
      }
    }
  },

  mixedGraph:{
    float: "left",
    width: "100%",
    margin: "0",
    padding: "0",
    position: "relative",
    "& h3":{
      top: '37%',
      left: '-37px',
      position: 'absolute',
      transform: 'rotate(270deg) translate(10px, -50%)',
      fontSize: '12px',
      color: "#828282",
      letterSpacing: '1px'
    },
    "& .GraphHolder":{
      width: "96%",
      float: "right"
    }
  },

  PayeeDetailBox:{
    float: "left",
    width: "100%",
    margin: "0 0 30px",
    padding: "0 0 20px",
    borderBottom: "1px solid #8F9EC3",
    "& .box":{
      width: "100%",
      float: "left",
      padding: "0 15px"
    },
    "& .bottomTxt":{
      float: "left",
      width: "100%",
      textAlign: "center",
      color: "#828282",
      fontSize: "12px",
      fontWeight: 'normal',
      padding: '20px 0 0',
    }
  },

  B2CtextNum: {
    fontWeight: 500,
    fontSize: 24,
    color: "rgba(0,0,0,0.87)",
    textAlign: "center",
    clear: "both",
    padding: "0 0 5px"
  },

});

export default styles;
