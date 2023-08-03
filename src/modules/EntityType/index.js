import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  Typography,
  Box,
  withStyles
} from "@material-ui/core";
import Button from "~/components/Forms/Button";
import { updateOnboardingCLient } from "~/redux/actions/clients";
import BusinessToConsumer from "~/assets/images/business-to-consumer.svg";
import BusinessToBusiness from "~/assets/images/business-to-business.png";

import styles from "./styles";

const EntityType = (props) => {
  const {
    classes,
    updateOnboardTitle,
    updateOnboardingStep,
  } = props;

  useEffect(() => {
    updateOnboardTitle("Which payer do you want to Onboard?");
    updateOnboardingStep(0);
  }, []);

  const onSubmit = (selectedEntityType) => {
    if (selectedEntityType) {
      sessionStorage.setItem("selectedEntityType", selectedEntityType);
      props.dispatch(
        updateOnboardingCLient({
          selectedEntityType,
          currentOnboardingStep: 1,
        })
      );
      props.history.push("/clientOnboard/OnboardType");
    }
  };

  return (
    <>
      <Box className={classes.container}>
        <Box className={classes.selectionContainer}>
          <Typography variant="h1" className={classes.onboartTypeTitle}>
            Business to Consumer (B2C)
          </Typography>
          <img
            src={BusinessToConsumer}
            alt={`Business To Consumer`}
            height={250}
            style={{margin: "3rem 0 5rem 0"}}
          />
          <Box display="flex" justifyContent="center" my={2}>
            <Button
              onClick={(e) => onSubmit("B2C")}
              className={classes.buttonComp}
            >
              SELECT
            </Button>
          </Box>
        </Box>
        <Box className={classes.selectionContainer}>
          <Typography variant="h1" className={classes.onboartTypeTitle}>
            Business to Business (B2B)
          </Typography>
          <img
            src={BusinessToBusiness}
            alt={`Business To Business`}
            height={250}
            style={{margin: "3rem 0 5rem 0"}}
          />          
          <Box display="flex" justifyContent="center" my={2}>
            <Button
              onClick={(e) => onSubmit("B2B")}
              className={classes.buttonComp}
            >
              SELECT
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default connect((state) => ({ ...state.user, ...state.clients }))(
  withStyles(styles)(EntityType)
);
