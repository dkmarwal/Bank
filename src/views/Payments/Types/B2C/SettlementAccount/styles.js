const styles = (theme) => ({
    inputBox:{
      float: "left",
      padding: "10px 10px 0",
      minHeight: "80px",
      "& .MuiTextField-root":{
        width: "100%"
      },
      "& .MuiFormControl-root":{
        width: "100%",
      },
      "& legend":{
        fontSize: "0.85em"
      },
      "& input": {
        // color: "#2B2D30",
        fontSize: "16px",
        boxSizing: "border-box",
        borderRadius: "4px",
        height: "56px"
      },
      "& .MuiFormLabel-root":{
        fontSize: "16px"
      },
      '& .MuiSelect-outlined.MuiSelect-outlined':{
          display:'flex',
          alignItems:'center'
      }
    },
    btnHolder:{
      float: "left",
      textAlign: "center",
      margin: "10px 0 0",
      "& button":{
        display: "inline-block",
        margin: "0 10px",
        textTransform: "uppercase",
        fontSize: "14px",
        "&.MuiButton-outlinedPrimary":{
          border: "1px solid #008CE6",
          color: "#008CE6"
        }
      }
    },
    newAccountMenu: {
      borderTop: '1px solid #9E9E9E',
      margin: theme.spacing(0.5, 1),
      display: 'flex',
      justifyContent: 'center',
    },
    plusIcon: {
      marginRight: theme.spacing(0.5),
    },
    accountsMenuList: {
      margin: theme.spacing(0.5, 0),
      minHeight:'40px'
    },
    settlementHeading: {
      color: '#0B1941',
      margin: theme.spacing(1),
      padding:'10px',
      '& .MuiTypography-body1':{
        fontSize: '18px',
      }
    },
    multitBox:{
      float: "left",
      padding:"0px 8px",
      // padding: "10px 10px 0",
      margin:'8px 0px',
      "& input": {
        color: "#2B2D30",
        fontSize: "14px",
        boxSizing: "border-box",
        borderRadius: "4px",
        height: "56px"
      },
      "& .MuiTextField-root":{
        width: "50%!important",
        padding: "0 5px",
        boxSizing: "border-box",
        margin: "0",
        "&:nth-child(2n+0)":{
          float: "right",
          paddingRight: "0"
        },
        "&:first-child":{
          float: "left",
          paddingLeft: "0"
        }
      },
      "& .MuiFormLabel-root":{
        fontSize: "16px"
      },
      "& .MuiSelect-root":{
        fontSize: "14px"
      },
      "& .MuiFormHelperText-root":{
        fontSize: "12px"
      }
    },
  });
  export default styles;
