import React, { useRef } from "react";

import {
  Grid,
  TextField,
  Box,
  makeStyles,
  Link,
  Typography,
  Button,
} from "@material-ui/core";
import ReCAPTCHA from "react-google-recaptcha";
import config from "~/config";
import {PortalLogo, PortalBankLabel} from '~/components/PortalDetails'

const useStyle = makeStyles({
  paper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "calc(100vh - 2px)",
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
  forgotLink: {
    textDecoration: "underline",
    color: "#008ce6 !important",
  },
});

const LoginView = (props) => {
  const {
    validation,
    credentials,
    handleChange,
    handleRecaptcha,
    onSubmit,
    handleForgotPassword,
    error,
    buttonDisabled,
  } = props;
  const classes = useStyle();

  const capRef = useRef(null);
  const handleSave = (event) => {
    if (event.keyCode === 13) {
      onSubmit();
    }
  };

  return (
    <>
      <Grid item xs md lg={6}>
        <div className={classes.paper}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width={1}
            className={classes.clientLogo}
          >
            
            <Grid item xs={5} className={classes.logoImg}>
            <PortalLogo/>
              {/* <img src={CitiLogo} alt="Citi Logo" height="34" width="58" /> */}
            </Grid>
            <Grid item xs={7} className={classes.logoLabel}>
              <Box
                fontFamily="Roboto"
                color="rgba(0,0,0,0.74)"
                fontWeight={600}
                fontSize={16}
              >
                {/* Payment Exchange{" "} */}
                <PortalBankLabel/>
              </Box>
            </Grid>
          </Box>
          <Box color="primary.main" fontSize={24} fontWeight={500} pt={4}>
            Super Admin Login
          </Box>
          <Box>
            <TextField
              color="primary"
              error={validation.Email}
              helperText={validation.Email}
              fullWidth={true}
              autoComplete="off"
              autoFocus={true}
              value={(credentials && credentials.Email) || ""}
              name="Email"
              label="User Name"
              placeholder="Username"
              onChange={(event) => handleChange("Email", event)}
              dir="horizontal"
              size="medium"
              variant="outlined"
              inputProps={{
                maxLength: 100,
              }}
              className={classes.textField}
            />
            <TextField
              color="primary"
              error={validation.Password}
              helperText={validation.Password}
              fullWidth={true}
              autoComplete="off"
              value={(credentials && credentials.Password) || ""}
              label="Password"
              name="Password"
              placeholder="Password"
              onChange={(event) => handleChange("Password", event)}
              onKeyDown={(event) => handleSave(event)}
              dir="horizontal"
              size="medium"
              type="password"
              variant="outlined"
              inputProps={{
                maxLength: 100,
              }}
              className={classes.textField}
            />
            <Box mt={3}>
              {config.showCaptcha && <ReCAPTCHA
                ref={capRef}
                sitekey="6Ld6MKYZAAAAALnTmc5dxhHMr5FWc4IEVTAGZLa6"
                onChange={handleRecaptcha}
              />
              }
              {validation && validation.recaptchaValue && (
                <span
                  style={{
                    color: "red",
                    fontFamily: "inherit",
                    paddingLeft: "16px",
                    fontWeight: "inherit",
                  }}
                >
                  {validation && validation.recaptchaValue}
                </span>
              )}
            </Box>
            <Box
              display="flex"
              justifyContent="flex-start"
              mt={1}
              mb={3}
              fontSize={14}
              fontWeight={500}
              color="secondary.main"
            >
              <Link
                href="javascript:void(0)"
                className={classes.forgotLink}
                underline="always"
                gutterBottom
                onClick={() => handleForgotPassword()}
              >
                Forgot password?
              </Link>
            </Box>
            <Box>
              <Typography variant="subtitle1" color="error">
                {error}
              </Typography>
            </Box>
            <Box mt={2} textAlign="center">
              <Button
                variant="contained"
                color="primary"
                style={{ color: "white" }}
                disableElevation
                className={classes.blueBtn}
                onClick={() => onSubmit()}
                size="medium"
                disabled={buttonDisabled}
              >
                Sign in
              </Button>
            </Box>
          </Box>
        </div>
      </Grid>
    </>
  );
};

export default LoginView;
