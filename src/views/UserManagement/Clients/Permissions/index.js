import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Grid, Button, Box, Typography } from "@material-ui/core";
import { fetchClientAccessRights } from "~/redux/actions/role";
import {
  fetchClientPermissionsSpecificToUser,
  updateClientPermissionsSpecificToUser,
} from "~/redux/actions/permissions";
//import Permissions from '~/modules/permissions';
import Permissions from "./Permissions";
import Notification from "~/components/Notification";
import { AlertDialog } from "../../../../components/Dialogs";
import {EntityType} from "~/config/entityTypes";

class ClientPermissions extends React.Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;
    this.state = {
      selectedClient: state,
      clientPermissionOptions: [],
      permissionsGranted: [],
      alertType: "success",
      alertMessage: "",
      alertFlag: false,
    };
  }

  fetchAccessRightsList = () => {
    // Fetching the permissions for Client Access List
    const portalTypeId = 2; //It will be fixed for bank portal
    const {state} = this.props.location;
    const appType = state.appType || EntityType.B2B;
    this.props
      .dispatch(fetchClientAccessRights({ portalTypeId, appType }))
      .then((response) => {
        if (!response) {
          this.setState({
            alertType: "error",
            alertMessage: this.props.role.error,
          });
          return false;
        }
        this.setState({
          clientPermissionOptions: this.props.role.accessRights,
        });
      });
  };

  getClientPermissionsForSpecificUser = () => {
    const { info } = this.props.user;
    this.props
      .dispatch(
        fetchClientPermissionsSpecificToUser({
          portalProfileId: info.portalProfileId,
          userId: this.state.selectedClient.userId,
          clientId: this.state.selectedClient.clientId,
        })
      )
      .then((response) => {
        if (!response) {
          this.setState({
            alertType: "error",
            alertMessage: this.props.permissions.error,
          });
          return false;
        }
        //console.log("dd", this.props.permissions.clientPermissions);
        this.setState({
          permissionsGranted: this.props.permissions.clientPermissions,
        });
      });
  };

  componentDidMount = async () => {
    const { selectedClient } = this.state;
    this.fetchAccessRightsList();
    await this.getClientPermissionsForSpecificUser();
  };
  backToClientsScreen = () => {
    const userId = this.state.selectedClient.userId;
    this.props.history.push({
      pathname: `/manage/user/clients/${userId}`,
      state: {
        userId: userId,
        user: this.state.selectedClient.user,
      },
    });
  };
  saveBtnClicked = () => {
    // update Permissions call
    const { info } = this.props.user;
    this.props
      .dispatch(
        updateClientPermissionsSpecificToUser({
          portalProfileId: info.portalProfileId,
          userId: this.state.selectedClient.userId,
          clientId: this.state.selectedClient.clientId,
          permissions: this.state.permissionsGranted,
        })
      )
      .then((response) => {
        if (!response) {
          this.setState({
            alertType: "error",
            alertMessage: this.props.permissions.error,
          });
          return false;
        }
        this.setState({
          // permissionsGranted: this.props.permissions.permissionsGranted || [],
          alertMessage: response && response.message,
          alertFlag: true,
        });
      });
  };

  onChangePermission = (event) => {
    const { name, type, value, checked } = event.target;
    const currentPermissionIDs = this.state.permissionsGranted;
    //        console.log(currentPermissionIDs);
    let permissionIDs;
    if (checked) {
      permissionIDs = [...currentPermissionIDs, parseInt(value)];
    } else {
      let index = currentPermissionIDs.indexOf(parseInt(value));
      if (index > -1) {
        permissionIDs = currentPermissionIDs.splice(index, 1);
      }
      permissionIDs = currentPermissionIDs;
    }

    this.setState({
      permissionsGranted: permissionIDs,
    });
  };

  flatten = (arr) => {
    return arr.reduce(
      (flat, next) =>
        flat.concat(Array.isArray(next) ? this.flatten(next) : next),
      []
    );
  };

  onClearAllPermissions = (event) => {
    this.setState({
      permissionsGranted: [],
    });
  };

  onSaveAllPermissions = (event) => {
    const { clientPermissionOptions } = this.state;
    const allPermissions = this.flatten(
      clientPermissionOptions.map(({ RightsGroup }) =>
        RightsGroup.map(({ Rights }) =>
          Rights.map(({ AccessRightMappingId }) => {
            return AccessRightMappingId;
          })
        )
      )
    );

    this.setState({ permissionsGranted: allPermissions });
  };

  onGroupSelection = (event, rightsGroup) => {
    const { permissionsGranted } = this.state;
    let newPermissions = [];
    const allGroupPermissons = this.flatten(
      rightsGroup.map(({ Rights }) =>
        Rights.map(({ AccessRightMappingId }) => {
          return AccessRightMappingId;
        })
      )
    );
    if (event.target.checked) {
      newPermissions = new Set([...permissionsGranted, ...allGroupPermissons]);
    } else {
      newPermissions =
        permissionsGranted &&
        permissionsGranted.filter(
          (item) => allGroupPermissons.indexOf(item) == -1
        );
    }

    this.setState({ permissionsGranted: [...newPermissions] });
  };

  render() {
    const {
      clientPermissionOptions,
      permissionsGranted,
      selectedClient,
      alertFlag,
      alertMessage,
    } = this.state;
    return (
      <Fragment>
        <Grid container xs={12} style={{ display: "block" }}>
          <Grid item>
            <Permissions
              permissionOptions={clientPermissionOptions}
              permissionsGranted={permissionsGranted}
              onChangePermission={this.onChangePermission}
              saveBtnClicked={this.saveBtnClicked}
              backToClientsScreen={this.backToClientsScreen}
              onGroupSelection={this.onGroupSelection}
              onSaveAllPermissions={this.onSaveAllPermissions}
              onClearAllPermissions={this.onClearAllPermissions}
              selectedClient={selectedClient}
            />
          </Grid>
        </Grid>
        {alertFlag && (
          <AlertDialog
            title={alertMessage}
            onConfirm={() => this.backToClientsScreen()}
          />
        )}
      </Fragment>
    );
  }
}
export default connect((state) => ({
  ...state.user,
  ...state.role,
  ...state.permissions,
}))(ClientPermissions);
