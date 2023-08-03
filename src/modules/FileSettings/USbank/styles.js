const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    margin: "32px 48px",
    padding: "26px 30px",
    textAlign: "left",
    "& .MuiTextField-root": {
      width: "100%",
    },
    '& .MuiFormControlLabel-root .MuiFormControlLabel-label': {
      fontSize: "14px",
      fontWeight: '400',
      lineHeight: '16px',
      color: '#FFFFFF',
    },
    '& .MuiFormControlLabel-root': {
      paddingLeft: '32px'
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
    margin: "15px 0",
    padding: "0px 10px",
  },

  gridPadding: {
    padding: "20px 0 40px",
  },

  b2bSectionHead: {
    marginTop: "20px",
  },

  b2bSectionSubHead: {
    marginBottom: "5px",
    marginTop: "7px",
  },

  importText: {
    margin: "0 0px 5px 0px",
  },

  errorText2: {
    color: " #f44336",
    marginLeft: "40px",
    marginRight: "14px"
  },

  genralTitleBold: {
    fontSize: '24px',
    fontWeight: '400',
    lineHeight: '28px',
    marginBottom: '6px'
  },

  panelHeading: {
    padding: '2px 0px',
    fontSize: '16px',
    marginTop: '5px',
    fontWeight: 400
  },

  mtTypo: {
    marginTop: '25px',
    marginBottom: '15px',
  },

  mediumBtn: {
    width: "130px",
    fontSize: "14px",
    color: "#FFFFFF",
    borderRadius: "28px",
    backgroundColor: "#008ce6 !important",
    minWidth: '115px !important',
    boxShadow:
      "0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.2)",
    "&:hover": {
      backgroundColor: "#008ce6 !important",
    },
  },

  editIcon: {
    marginLeft: '40px',
    cursor: 'pointer'
  },

  controlLabel: {
    paddingLeft: "20px",
    '& .MuiFormControlLabel-label': {
      fontSize: "14px",
      fontWeight: '400',
      lineHeight: '16'
    }
  },

  nextBtn: {
    padding: "10px 48px",
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '18px',
    letterSpacing: '0.5px',
    height: '37px'
  },

  deleteIcon: {
    color: "#cb0d0d", cursor: 'pointer'
  },

  checkboxContainer: {
    '& .MuiOutlinedInput-input': {
      padding: '10.5px 14px',
    }
  },

  width60: {
    width: '60%'
  },
  width80: {
    width: '80%',
    marginBottom: '18px',
    paddingLeft: '38px',
  },

  margLeft: {
    marginLeft: '16px'
  },
 
  addFIeldButton:{
    fontSize: '16px',
    fontWeight: 400,
    letterSpacing: '0.5px',
    color: '#ffffff',
    padding: '10px 20px',
    background: '#008ce6 !important',
    borderRadius: '50px',
    margin: '-8px 4% 0 0 ',
    '& .MuiButton-startIcon':{
      marginRight: '12px'
    }
},

contentBackground: {
  backgroundColor: theme.palette.background.header,
  borderRadius: "4px",
  padding: "16px 32px",
},
bold: {
  fontWeight: 600,
  fontSize: '16px',
  marginTop: '10px'
},

fileBtnGroup: {
  border: 'solid 1px #CCCCCC !important',
  '& .MuiToggleButtonGroup-grouped': {
    padding: '8px 24px !important',
    color: 'rgb(25, 118, 210) !important',
    width: '60px !important',
    border: 'none',
    textTransform: 'capitalize',
  },
  '& .Mui-selected': {
    backgroundColor: 'rgb(25, 118, 210) !important',
    color: '#fff !important',
    margin: '2px !important',
    borderRadius: '4px 4px !important',
  },
  '& .MuiToggleButton-root.Mui-disabled': {
    backgroundColor: 'rgba(0, 0, 0, 0.12) !important'
  }
},
checkboxStyle: {
  '&.MuiGrid-spacing-xs-4 > .MuiGrid-item': {
    padding: '16px 0 !important',
  },
  '& .MuiSvgIcon-root': {
    color: '#fff',
  }
},

// checkboxStyle: {
//   '& .MuiFormControlLabel-root': {
//     background: 'rgb(25, 118, 210)',
//     display: 'flex',
//     padding: '0',
//     marginLeft: '-1px',
//     borderRadius: '5px',
//     position: 'relative',
//     marginRight: 0
//   },
//   '& .MuiFormControlLabel-root .MuiFormControlLabel-label': {
//     position: 'absolute',
//     right: 0,
//     left: 0,
//     margin: '0 auto',
//     width: '35px',
//     color: '#fff',
//     fontWeight: '500'
//   },
//   '& .MuiSvgIcon-root': {
//     color: '#fff',
//   },
// },
bold: {
  fontWeight: 600,
  fontSize: '16px',
  marginTop: '10px'
},
checkClass: {
  height: "18px",
  width: "18px",
},
kboxStyle: {
  background: 'rgb(25, 118, 210) !important',
  color: '#fff',
  cursor: 'pointer',
  margin: '0px 18px',
  padding: '3px 0',
  textAlign: 'left',
  fontWeight: 'bold',
  lineHeight: '22px',
  borderRadius: '4px',
  '& .MuiFormControlLabel-root':{
    display: 'block',
    padding: '0',
    paddingLeft: '20px',
    width: '100%'
  },
  '& .MuiTypography-root.MuiFormControlLabel-label':{
    marginLeft: '25%'
  }
},

});

export default styles;
