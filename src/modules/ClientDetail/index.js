import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import Button from '~/components/Forms/Button';
import {
  Grid,
  Box,
  makeStyles,
  Paper,
  CircularProgress, Switch
} from "@material-ui/core";
import ExpansionBar from '~/components/ExpansionBar'
import MultiCheckBoxGroup from "../../components/Forms/MultiCheckBoxGroup";
import Notification from '~/components/Notification'
import { updateOnboardingStep } from "../../redux/actions/clients";
import { getClientPermissions, getPermissionOptions, updateClientPermissions, sendActivationCode } from "../../redux/helpers/ConfigureClientPortal";
import SimpleDialog from "../../components/Model/SimpleDialog";
import PromptImport from "../../components/Dialogs/PromptImport";
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Route } from "react-router-dom";

const useStyles = makeStyles({
  formLabel: {
    textAlign: "left",
    marginLeft: "20px",
    marginTop: "10px",
    fontSize: "0.9rem",
  },
});

const ClientDetail = ({ history }) => {

  const [process, setProcess] = useState(true);
  const [isNextLoading, setNextLoading] = useState(false);

  useEffect(() => {
    if (selectedOnboardType === "self") {
      updateOnboardingStep(2);
    } else {
      updateOnboardTitle('CONFIGURE CLIENT PORTAL')
    }
    fetchPermissionOptions();

  }, [])

  return (
    <Box ml={6} mt={2} mr={6}>
      <Switch>
        <Route exact path='/clientDetail' render={() => <ClientProfile showEmailInfo={true} clientID={1} />} />
        <Route exact path='/clientDetail/resendActivationCode' render={() => <ConfigureClientPortal clientID={1} />}/>
      </Switch>

    </Box>
  );
};

const mapStateToProps = ({ clients = {} }) => {
  const { onBoarding: {
    clientId, isHippa, parentId, selectedOnboardType
  } } = clients;
  return { clientId, isHippa, parentId };
};

export default connect(mapStateToProps)(ConfigureClientPortal);
