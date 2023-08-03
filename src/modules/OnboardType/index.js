import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Typography,
  Box,
  withStyles,
} from "@material-ui/core";
import Button from "~/components/Forms/Button";
import { updateOnboardingCLient } from "~/redux/actions/clients";
import AssistedRegistration from "~/assets/images/assited-registration.svg";
import ClientRegistration from "~/assets/images/client-registration.svg";
import styles from "./styles";

const OnboardType = (props) => {
  const {
    classes,
    updateOnboardTitle,
    updateOnboardingStep,
  } = props;
  const [selectedEntityType] = useState(
    sessionStorage.getItem("selectedEntityType")
  );

  useEffect(() => {
    updateOnboardTitle("Select how do you want to onboard the client?");
    updateOnboardingStep(0);
  }, []);

  const onSubmit = (selectedOnboardType) => {
    if (selectedOnboardType) {
      sessionStorage.setItem("selectedOnboardType", selectedOnboardType);
      props.dispatch(
        updateOnboardingCLient({
          selectedOnboardType,
          selectedEntityType,
          currentOnboardingStep: 1,
        })
      );
      if(selectedEntityType === "B2C"){
        props.history.push("/clientOnboard/b2c/clientRegistration");
      } else {
         props.history.push("/clientOnboard/clientRegistration");
      }
    }
  };
  return (
    <>
      <Box className={classes.container}>
        <Box className={classes.selectionContainer}>
          <Typography variant="h1" className={classes.onboartTypeTitle}>
            Assisted Client Registration
          </Typography>
          <img
            src={AssistedRegistration}
            alt={`Assisted Registration`}
            className={classes.onboartTypeImage}
            height={250}
          />
          <Typography variant="h5" className={classes.onboartTypeDescription}>
            You'll register the client's portal permissions and profile based on
            an onboarding worksheet.
          </Typography>
          <Box display="flex" justifyContent="center" my={3}>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => onSubmit("self")}
            >
              <b style={{ color: "#0b1941",fontWeight:'normal' }}> Select</b>
            </Button>
          </Box>
        </Box>
        <Box className={classes.selectionContainer}>
          <Typography variant="h1" className={classes.onboartTypeTitle}>
            Client Registration
          </Typography>
          <img
            src={ClientRegistration}
            alt={`Client Registration`}
            className={classes.onboartTypeImage}
            height={250}
          />
          <Typography variant="h5" className={classes.onboartTypeDescription}>
            You'll configure the client portal permissions and the client will
            then complete the registration.
          </Typography>
          <Box display="flex" justifyContent="center" my={3}>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => onSubmit("client")}
              // disableEv
            >
              <b style={{ color: "#0b1941",fontWeight:'normal' }}> Select</b>
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default connect((state) => ({ ...state.user, ...state.clients }))(
  withStyles(styles)(OnboardType)
);
