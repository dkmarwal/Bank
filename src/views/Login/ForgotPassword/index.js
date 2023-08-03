import React from "react";
import {
  Grid,
  TextField,
  Box,
  makeStyles,
  Typography,
  Button,
} from "@material-ui/core";
import {PortalLogo, PortalName} from '~/components/PortalDetails'

const useStyle = makeStyles({
  paper: {
    width: "100%",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },
  heading: {
    paddingTop: 0,
    color: "#0c2074",
    fontSize: 26,
    fontWeight: 400,
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
    fontSize: "small",
  },
  textField: {
    marginTop: "22px",
  },
  blueBtn: {
    textTransform: "uppercase",
    fontWeight: 700,
    fontSize: "14px",
    padding: "10px 50px",
  },
});

const ForgotPassword = (props) => {
  const {
    credentials,
    handleChange,
    onSubmit,
    onCancel,
    error,
    validation,
  } = props;
  const classes = useStyle();

  return (
    <>
      <Grid item xs={6} md={6} lg={6}>
        <div className={classes.paper}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width={1}
            className={classes.clientLogo}
          >
            <Grid item xs={5} md={5} lg={5} className={classes.logoImg}>
              {/* <img src={CitiLogo} alt="Citi Logo" height="34" width="58" /> */}
              <PortalLogo/>
            </Grid>
            <Grid item xs={7} md={7} lg={7} className={classes.logoLabel}>
              {/* <img src={IncedoLogo} alt="Citi Logo" height="18" width="120" /> */}
              <PortalName/>
            </Grid>
          </Box>
          <Box
            color="primary.main"
            fontSize={24}
            display="flex"
            justifyContent="center"
            width={1}
            fontWeight={500}
            pt={4}
          >
            Forgot Password?
          </Box>
          <Box p={2} width={1}>
            <TextField
              fullWidth={true}
              error={validation && validation.Email}
              autoComplete="off"
              value={(credentials && credentials.Email) || ""}
              name="Email"
              placeholder="User Name"
              onChange={(event) => handleChange("Email", event)}
              dir="horizontal"
              size="medium"
              variant="outlined"
              inputProps={{
                maxLength: 100,
              }}
              label="User Name"
              className={classes.textField}
            />
            <Box>
              <Typography variant="subtitle1" color="error">
                {error}
              </Typography>
            </Box>
            <Box mt={2} width={1} display="flex" justifyContent="center">
              <Button
                variant="outlined"
                style={{ marginRight: 24, fontSize: 14, fontWeight: 600 }}
                color="primary"
                onClick={() => onCancel()}
              >
                CANCEL
              </Button>
              <Button
                variant="contained"
                style={{ fontSize: 14, fontWeight: 600 }}
                color="primary"
                disableElevation
                onClick={() => onSubmit()}
              >
                RESET PASSWORD
              </Button>
            </Box>
          </Box>
        </div>
      </Grid>
    </>
  );
};

export default ForgotPassword;
