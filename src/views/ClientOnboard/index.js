import React, { useState } from "react";
import { connect } from "react-redux";
import { Grid, Box, makeStyles, Paper, Link, Tooltip } from "@material-ui/core";
import { Route, Switch, withRouter } from "react-router-dom";
import ConfigureClientPortal from "~/modules/ConfigureClientPortal";
import UserProfile from "~/modules/UserProfile";
import ClientProfile from "~/modules/ClientProfile";
import FileSettings from "~/modules/FileSettings";

import B2CConfigureClientPortal from "~/modules/ConfigureClientPortal/B2C/";
import B2CUserProfile from "~/modules/UserProfile/B2C/";
import B2CClientProfile from "~/modules/ClientProfile/B2C/";
import B2CFileSettings from "~/modules/FileSettings/B2C/";
import USbankFileSettings from "~/modules/FileSettings/USbank/";
import B2CCustomizedSteppers from "~/components/Stepper/B2C/Stepper";

import EntityType from "~/modules/EntityType";
import OnboardType from "~/modules/OnboardType";
import Remittance from "~/modules/Remittance";
import B2CRemittance from "~/modules/Remittance/B2C"
import Success from "~/modules/ConfigureClientPortal/Success";
import Payments from "~/views/Payments";
import accessRights from "~/config/accessRights";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { ConfirmDialog } from "~/components/Dialogs";
import CloseIcon from '@material-ui/icons/Close';
import {USBankStepper,Steppers} from '~/utils/const'
import USbankPayments from "~/views/Payments/USBank"
import B2CPayments from "~/views/Payments/B2C"

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: theme.palette.background.default,
  },
  paper: {
    padding: "10px",
    marginBottom: "5px",
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: "34px",
    height: "90px",
    fontWeight: "bold",
    letterSpacing: 0,
    display: "flex",
    alignItems: "center",
  },
}));

const ClientOnboard = ({ history, dispatch, stepIndex, _permissions, ...props }) => {
 const [openModal, setOpenModal] = useState(false);
  const [currentOnboardingStep, setCurrentStep] = useState(0);
  const [onboardTitle, setOnboardTitle] = useState("");
  const isPayeeChoicePortal = props.user?.user?.isPayeeChoicePortal
  const stepperlist = isPayeeChoicePortal ? [...USBankStepper] : [...Steppers]

  const updateOnboardingStep = (step) => {
    setCurrentStep(step);
  };
  const updateOnboardTitle = (title) => {
    setOnboardTitle(title);
  };

  const onCloseModal = ()=> {
    sessionStorage.setItem("selectedEntityType", null);
    sessionStorage.setItem("selectedOnboardType", null);
    history.push({
      pathname: `/clients`,
    })
  }

  const classes = useStyles();
  const permissions_ = _permissions.permissions.minified;
  const isOnboardingAllowed =
    permissions_ &&
    permissions_.includes(accessRights["CLIENTS_LIST_ONBOARDING"]);

  return (
    <>      
      <Grid>
        {isOnboardingAllowed && (
          <Grid container direction='column'>
            <Paper elevation={3} className={classes.paper}>
              {Boolean(currentOnboardingStep) ? (
                <B2CCustomizedSteppers                  
                  stepsList={stepperlist}
                  activeStep={currentOnboardingStep}
                  history={history}
                  onClose={() => setOpenModal(true)}
                />
                )                
                : (
                <Box
                  color='secondary.main'
                  fontSize={34}
                  fontWeight={500}
                  py={2}
                  pl={8}
                >
                  <Grid container>
                    <Grid item xs={1}>
                      {!isPayeeChoicePortal && props.location.pathname.includes('OnboardType') && (
                        <Link
                          component='button'
                          variant='body2'
                          onClick={() => {
                            history.push({
                              pathname: `/clientOnboard/EntityType`,
                            });
                          }}
                        >
                          <ArrowBackIcon style={{ margin: '0 5px 0 0' }} />
                        </Link>
                      )}
                    </Grid>
                    <Grid item xs={10}>
                      <span>{onboardTitle}</span>
                    </Grid>
                    <Grid item xs={1}>
                      <Link
                        component='button'
                        variant='body2'
                        onClick={() => {
                          setOpenModal(true);
                        }}
                      >
                        <Tooltip title='Cancel Client Onboarding'>
                          <CloseIcon style={{ margin: '0 5px 0 0' }} />
                        </Tooltip>
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
            <Box className={classes.box}>
              <Switch>
                <Route
                  path='/clientOnboard/EntityType'
                  render={(props) => (
                    <EntityType
                      {...props}
                      updateOnboardTitle={updateOnboardTitle}
                      updateOnboardingStep={updateOnboardingStep}
                    />
                  )}
                />
                <Route
                  path='/clientOnboard/OnboardType'
                  render={(props) => (
                    <OnboardType
                      {...props}
                      updateOnboardTitle={updateOnboardTitle}
                      updateOnboardingStep={updateOnboardingStep}
                    />
                  )}
                />
                {props.selectedEntityType === 'B2C' ? (
                  <>
                    <Route
                      path='/clientOnboard/b2c/clientRegistration'
                      render={(props) => (
                        <B2CClientProfile
                          {...props}
                          updateOnboardingStep={updateOnboardingStep}
                          updateOnboardTitle={updateOnboardTitle}
                        />
                      )}
                    />
                    <Route
                      path='/clientOnboard/b2c/clientPermissions/:clientId'
                      render={(props) => (
                        <B2CConfigureClientPortal
                          {...props}
                          updateOnboardingStep={updateOnboardingStep}
                          updateOnboardTitle={updateOnboardTitle}
                        />
                      )}
                    />
                    <Route
                      path='/clientOnboard/b2c/clientProfile'
                      render={(props) => (
                        <B2CUserProfile
                          {...props}
                          updateOnboardingStep={updateOnboardingStep}
                        />
                      )}
                    />
                    <Route
                      path='/clientOnboard/b2c/payments'
                      render={(props) =>
                        isPayeeChoicePortal ? (
                          <USbankPayments
                            {...props}
                            updateOnboardingStep={updateOnboardingStep}
                          />
                        ) : (
                          <B2CPayments
                            {...props}
                            updateOnboardingStep={updateOnboardingStep}
                          />
                        )
                      }
                    />
                    <Route
                      path='/clientOnboard/b2c/fileSettings'
                      render={(props) =>
                        isPayeeChoicePortal ? (
                        <USbankFileSettings
                          {...props}
                          updateOnboardingStep={updateOnboardingStep}
                        />
                      ) : (
                        <B2CFileSettings
                        {...props}
                        updateOnboardingStep={updateOnboardingStep}
                      />
                      )
                    }
                    />
                    <Route
                      path='/clientOnboard/b2c/remittance'
                      render={(props) => (
                        <B2CRemittance
                          {...props}
						              isPayeeChoicePortal={isPayeeChoicePortal}
                          updateOnboardingStep={updateOnboardingStep}
                        />
                      )}
                    />
                    <Route
                      path='/clientOnboard/b2c/ClientRegistrationCompleted'
                      render={(props) => (
                        <Success
                          {...props}
                          updateOnboardTitle={updateOnboardTitle}
                        />
                      )}
                    />
                  </>
                ) : (
                  <>
                    <Route
                      path='/clientOnboard/clientRegistration'
                      render={(props) => (
                        <ClientProfile
                          {...props}
                          updateOnboardingStep={updateOnboardingStep}
                          updateOnboardTitle={updateOnboardTitle}
                        />
                      )}
                    />
                    <Route
                      path='/clientOnboard/clientPermissions/:clientId'
                      render={(props) => (
                        <ConfigureClientPortal
                          {...props}
                          updateOnboardingStep={updateOnboardingStep}
                          updateOnboardTitle={updateOnboardTitle}
                        />
                      )}
                    />
                    <Route
                      path='/clientOnboard/clientProfile'
                      render={(props) => (
                        <UserProfile
                          {...props}
                          updateOnboardingStep={updateOnboardingStep}
                        />
                      )}
                    />
                    <Route
                      path='/clientOnboard/payments'
                      render={(props) => (
                        <Payments
                          {...props}
                          updateOnboardingStep={updateOnboardingStep}
                        />
                      )}
                    />
                    <Route
                      path='/clientOnboard/fileSettings'
                      render={(props) => (
                        <FileSettings
                          {...props}
                          updateOnboardingStep={updateOnboardingStep}
                        />
                      )}
                    />
                    <Route
                      path='/clientOnboard/remittance'
                      render={(props) => (
                        <Remittance
                          {...props}
                          updateOnboardingStep={updateOnboardingStep}
                        />
                      )}
                    />
                    <Route
                      path='/clientOnboard/ClientRegistrationCompleted'
                      render={(props) => (
                        <Success
                          {...props}
                          updateOnboardTitle={updateOnboardTitle}
                        />
                      )}
                    />
                  </>
                )}
              </Switch>
            </Box>
          </Grid>
        )}
      </Grid>
      {openModal && (
        <ConfirmDialog
          dialogClassName={'alert-dialoge-root'}
          title={'Close Client Registration?'}
          message={''}
          onCancel={() => {
            setOpenModal(false);
          }}
          onConfirm={onCloseModal}
        />
      )}
    </>
  );
};

const mapStateToProps = ({ clients, permissions,user }) => {
  const {
    onBoarding: { selectedOnboardType, selectedEntityType, currentOnboardingStep } = {
      selectedOnboardType: "self",
      selectedEntityType: "B2B",
      currentOnboardingStep: 0,
    },
  } = clients;
  return {
    selectedOnboardType,
    selectedEntityType,
    currentOnboardingStep,
    _permissions: permissions,
    user:user
  };
};

export default withRouter(connect(mapStateToProps)(ClientOnboard));
