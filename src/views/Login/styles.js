import bgImage from "~/assets/images/superAdmin-bg.png";
const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "transparent",
    "& .MuiTextField-root": {
      width: "100%",
    },
    height: "100vh",
  },
  leftWrap: {
    background: `url(${bgImage}) no-repeat 0px 0px`,
    backgroundSize: "cover",
    paddingRight: "15px",
    paddingLeft: "15px",
    marginRight: "auto",
    marginLeft: "auto",
  },

  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  startupContainer: {
    background: "#fff",
  },
  startupHeading: {
    marginLeft: "2em",
    "& h3": {
      color: "#fff",
      marginTop: "2em",
      fontSize: "26px",
      lineHeight: "1.2",
      fontWeight: 500,
    },
    "& p": {
      color: "#fff",
      fontSize: "1.4em",
      marginTop: "1.1em",
      textAlign: "left",
      margin: "0 0 10px",
    },
  },
  updatePasswordModal: {
    position: "absolute",
    width: "40%",
    left: "30%",
    top: "20%",
    outline: "none",
    padding: "3.125rem 0rem",
    borderRadius: "0 !important",
    overflowY: "auto",
    maxHeight: "350px",
  },
  textField: {
    height: "1.75rem",
  },
  heading: {
    paddingTop: 0,
    color: "#0c2074",
    fontSize: 26,
    fontWeight: 400,
  },
  clientLogo: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  logoImg: {
    display: "flex",
    justifyContent: "flex-end",
    paddingRight: "20px",
    borderRight: "1px solid #ddd",
  },
  logoLabel: {
    display: "flex",
    justifyContent: "flex-start",
    paddingLeft: "20px",
    alignItems: "flex-end",
    fontSize: 16,
    color: "rgba(0,0,0,0.74)",
    fontFamily: "'Roboto', Arial, Helvetica, sans-serif",
    fontWeight: 600,
  },
  customStyle: {
    '& .MuiOutlinedInput-root': {
      fontSize: 16
    }
  }
});

export default styles;
