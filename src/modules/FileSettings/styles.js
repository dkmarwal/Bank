const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    margin: "32px 48px",
    padding: "18px",
    textAlign: "left",
    "& .MuiTextField-root": {
      width: "100%",
    },
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
    margin: "15px 0",
    padding: "0px 10px",
  },
  gridPadding: {
    padding: "20px 0 40px",
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
    marginBottom: "20px",
  },
  gridCheckbox: {
    marginBottom: "20px",
    '& div':{
      fontWeight: 'unset',
      fontSize: '0.75rem',
      margin: 0,
    },
    padding: "0px 10px",
  },
  boxRadius: {
    border: '1px solid transparent',
    borderRadius: '5px'
  },
  gridItem: {
    padding: "0px 8px",
  },
  radioGridItem: {
    paddingLeft: "2px",
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
  importText: {
    margin: "40px 0px 5px 0px",
  },
  csvLabel: {
    fontSize: theme.spacing(3),
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  csvLocation: {
    paddingLeft: theme.spacing(2)
  },
  mscResponseLegend: {
    fontSize: '14px',
    color: '#000000'
  },
  smallPlaceholderText: {
    '& label': {
        fontSize: 13
    },
    '& legend': {
        fontSize: 10
    }
  },
  resHelperTxt: {
    fontStyle: 'italic',
    fontSize: 12,
    paddingTop: 3
  }
});

export default styles;
