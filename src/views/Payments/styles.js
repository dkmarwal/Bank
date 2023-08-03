const styles = (theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    textAlign: "left",
    "& .MuiTextField-root": {
      width: "100%",
    },
  },
  accordGrid: {
    '& .MuiExpansionPanel-root.Mui-expanded:first-child': {
      border: '1px solid #9E9E9E'
    }
  },
  accord: {
    //borderBottom: "none !important",
    boxShadow: 'none',
    borderRadius: '4px !important',
    '& .MuiExpansionPanelDetails-root': {
      padding: 0
    },
    '& .MuiFormLabel-root': {
      fontWeight: 'normal'
    },
    '&:hover': {
      boxShadow: '0px 3px 4px rgb(0 0 0 / 14%), 0px 3px 3px -2px rgb(0 0 0 / 12%), 0px 1px 8px rgb(0 0 0 / 20%)',
      border: 'none !important',
      borderBottom: '3px solid #002D43 !important'
    },
    '& .MuiExpansionPanelSummary-root.Mui-expanded': {
      borderRadius: '4px !important'
    }
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
    width: "100%",
  },
  gridContainers: {
    // padding: "15px 4px",
    width: "100%",
    display: "block",
  },
  gridPadding: {
    padding: "20px 0 40px",
  },
  genralTitleBold: {
    fontSize: "16px",
    lineHeight: "22px",
    color: "#0b1941",
    //fontWeight: "bold",
  },
  legend: {
    width: "auto",
    padding: "5px",
    fontSize: "14px",
    lineHeight: "22px",
    color: theme.palette.primary.heading,
    fontWeight: "bold",
    marginBottom: "10px",
  },
  gridMArgin: {
    marginBottom: "25px",
  },
  gridItem: {
    padding: "8px",
  },
  panelHeading: {
    padding: "5px 0px",
    marginTop: "10px",
    fontSize: "12px",
    fontWeight: 400,
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
  checkboxContainer: {
    marginBottom: "16px",
    "& paymentBox": {
      border: '2px solid #9E9E9E !important'
    }
  },
  pRelative:{
    position:"relative"
  },
  paymentcheckedBox: {
    '& img': {
      top: '0.5rem !important'
    }
  }
});

export default styles;
