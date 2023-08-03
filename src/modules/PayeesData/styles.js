const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    width: "100%",
    padding: theme.spacing(2),
  },
  table: {
    width: "100%",
    "& .MuiTableRow-head .MuiTableCell-head": {
      backgroundColor: "rgba(204,228,255,0.75)",
      fontWeight: 600,
      fontSize: 16,
      lineHeight: "1.2em",
      padding: "10px 16px",
    },
  },

  ".MuiTableHead-root": {
    "& .MuiTableCell-head": {
      color: "rgba(15,15,15,0.87) !important",
    },
  },

  smallBtn: {
    fontSize: "14px",
    color: "#0B1941",
    padding: "5px 10px",
    textTransform: "capitalize",
  },
  imgIcon: {
    marginRight: "5px",
    verticalAlign: "bottom",
  },
  iconGreyText: {
    fontSize: "14px",
    fontWeight: "600",
    color: theme.palette.text.grey,
  },
  iconText: {
    fontSize: "14px",
    fontWeight: "600",
  },
  fileText: {
    fontSize: 16,
    fontWeight: 600,
    color: theme.palette.text.blackLight,
    "& span": {
      color: theme.palette.secondary.main,
      fontWeight: "normal",
    },
  },
  bodyTextColor: {
    "& .MuiTableCell-body": {
      color: "#2B2D30;",
    },
  },
  textBold: {
    fontWeight: "400",
  },
  statusesLabel: {
    fontSize: 11,
    lineHeight: "18px",
    fontWeight: 400,
    color: "#4c4c4c",
  },
  selectItem: {
    padding: "10px 24px 7px 0",
    fontSize: "14px",
    color: "rgb(76, 76, 76)",
    display: "flex",
    fontWeight: "700",
    background: "none",
    "&:before": {
      borderBottom: "none",
    },
    "&:after": {
      borderBottom: "none",
      backgroundColor: "none",
    },
    "&:hover:not(.Mui-disabled):not(.Mui-focused):not(.Mui-error):before": {
      // hover
      borderBottom: "none",
    },
    "& .MuiSelect-select:focus":{
      background:"none",
      borderBottom: "none"
    },
    "& .MuiSelect-selectMenu": {
      padding: "0 24px 7px 0",
    },
    "& svg": {
      top: "5px",
      right: "10px",
    },
  },
  selectItemRadius: {
    marginTop: "5px",
    marginRight: "5px",
    boxShadow: "0px 0px 8px 0px #00000024",
    borderRadius: "16px",
    padding: "7px 24px 0px 12px",
    fontSize: "14px",
    color: "rgb(76, 76, 76)",
    display: "flex",
    fontWeight: "700",
    background: "none",
    "&:before": {
      borderBottom: "none",
    },
    "&:after": {
      borderBottom: "none",
      backgroundColor: "none",
    },
    "&:hover:not(.Mui-disabled):not(.Mui-focused):not(.Mui-error):before": {
      // hover
      borderBottom: "none",
    },
    "& .MuiSelect-select:focus":{
      background:"none",
      borderBottom: "none"
    },
    "& .MuiSelect-selectMenu": {
      padding: "0 24px 7px 0",
    },
    "& svg": {
      top: "2px",
      right: "7px",
    },
  },

});

export default styles;
