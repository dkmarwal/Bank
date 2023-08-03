import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  Grid,
  Typography,
  FormControlLabel,
  OutlinedInput,
  IconButton,
  Paper,
  Button,
  Select,
  Box,
  Checkbox,
  Input,
  MenuItem,
  ListItemText,
  CircularProgress,
} from "@material-ui/core";
import "../styles.scss";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import {
  getClientsList,
  getClientsAccessList,
  updateClientsAccessList,
  getPagiClientsAccessList,
  getBankClientsList
} from "~/redux/actions/bankClients";
import { Link } from "react-router-dom";
import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { withStyles } from "@material-ui/styles";
import Notification from "~/components/Notification";
import styles from "./styles";
import { ConfirmDialog, AlertDialog } from "~/components/Dialogs";
import accessRights from "../../../../config/accessRights";
import Pagination from "@material-ui/lab/Pagination";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { EntityType } from "../../../../config/entityTypes";

const StyledToggleButtonGroup = withStyles((theme) => ({
  grouped: {
    margin: theme.spacing(0.5),
    border: "none",
    "&:not(:first-child)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-child": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:selected": {
      backgroundColor: theme.palette.secondary.main,
    },
    padding: "2px 16px",
    color: "#4C4C4C",
    "&.Mui-selected": {
      backgroundColor: theme.palette.secondary.main,
      color: "#fff",
      "&:hover": {
        backgroundColor: theme.palette.secondary.main,
      },
    },
  },
}))(ToggleButtonGroup);

class Clients extends Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;
    this.state = {
      selectedUser: state,
      clientsList: [],
      clientIds: [],
      selectedClients: [], //using for internal manipulation
      assgnedClients: [], //getting from API
      alertType: "success",
      alertMessage: "",
      showConfirmRemoveDialog: false,
      isLoading: true,
      removeUserId: null,
      pageNumber: 1,
      offset: 0,
      limit: 10,
      limitedClientList: [],
      appType: 3
    };
  }

  fetchClientsList = () => {
    const { appType } = this.state;

    const { portalProfileId } = this.props.user.info;
    const payerTypeId = [1,2];

    const payload = {
      portalProfileId: this.props?.user?.isPayeeChoicePortal ? undefined : portalProfileId,
      appType,
      filter: 1, // for onboarded client
      payerTypeId
    };
    this.setState(
      {
        isLoading: true,
      },
      () => {
        this.props.dispatch(getBankClientsList(payload)).then((response) => {
          if (!response) {
            this.setState({
              alertMessage: this.props.bankClients.error,
              alertType: "error",
              isLoading: false,
              alertMessageCallbackType: null,
            });
            return false;
          }
          this.setState({
            clientsList: this.props.bankClients.clientsList.clients,
            isLoading: false,
          });
        });
      }
    );
  };

  //Get selected client list per user
  fetchClientsAccessList = () => {
    const { info } = this.props.user;
    const { appType } = this.state;
    this.props
      .dispatch(
        getClientsAccessList({
          portalProfileId: info.portalProfileId,
          userId: this.state.selectedUser.userId
        })
      )
      .then((response) => {
        if (!response) {
          this.setState({
            alertMessage: this.props.bankClients.error,
            alertType: "error",
            alertMessageCallbackType: null,
          });
          return false;
        }
        const assgnedClients = this.props.bankClients.selectedClients;

        this.setState({
          assgnedClients: assgnedClients,
          selectedClients:
            (assgnedClients &&
              assgnedClients.filter(item => item.appType === appType || appType === EntityType.ALL).map((client) => client.clientId)) || [],
        });
      });
  };

  fetchLimitedClientsAccessList = () => {
    const { info } = this.props.user;
    const { appType } = this.state;
    this.props
      .dispatch(
        getPagiClientsAccessList({
          portalProfileId: info.portalProfileId,
          userId: this.state.selectedUser.userId,
          limit: this.state.limit,
          offset: this.state.offset
        })
      )
      .then((response) => {
        if (!response) {
          this.setState({
            alertMessage: this.props.bankClients.error,
            alertType: "error",
            alertMessageCallbackType: null,
          });
          return false;
        }
        const assgnedClients = this.props.bankClients.selectedClients;
        this.setState({
          limitedClientList:
            (assgnedClients &&
              assgnedClients.filter(item => item.appType === appType || appType === EntityType.ALL).map((client) => client.clientId)) ||
            [],
        });
      });
  };

  componentDidMount = async () => {
    this.fetchClientsList();
    await this.fetchClientsAccessList();
    await this.fetchLimitedClientsAccessList();
    const ids = [];
    this.state.clientsList &&
      this.state.clientsList.map((item, index) => {
        ids.push(item.clientId);
      });
    this.setState({
      clientIds: [...ids],
    });
  };

  getClientsPermissions = (item) => {
    this.props.history.push({
      pathname: `/manage/user/clients/permissions/${item.clientId}`,
      state: {
        clientId: item.clientId,
        clientName: item.clientName,
        userId: this.state.selectedUser.userId,
        user: this.state.selectedUser.user,
        appType: item.appType
      },
    });
  };

  updateClientsAccess(list) {
    const { info } = this.props.user;
    const { clientsList } = this.state;
    const newSelectedClients =
      clientsList &&
      clientsList
        .filter((client) => list.indexOf(client.clientId) != -1)
        .map((item) => {
          return { clientId: item.clientId, clientName: item.clientName, appType: item.appType };
        });

    this.props
      .dispatch(
        updateClientsAccessList({
          portalProfileId: info.portalProfileId,
          userId: this.state.selectedUser.userId,
          clientIds: newSelectedClients
        })
      )
      .then((response) => {
        if (!response) {
          this.setState({
            alertMessage: this.props.bankClients.error,
            alertType: "error",
            alertMessageCallbackType: null,
          });
          return false;
        }
        this.setState({
          //selectedClients: this.props.bankClients.selectedClients
          selectedClients: list
        }, () => this.fetchLimitedClientsAccessList());
      });
  }

  handleChange = (event) => {
    const { value: options } = event.target;
    this.updateClientsAccess(options)

  };

  handleRemoveClient = (clientId) => {
    const { selectedClients } = this.state;
    this.setState({
      showConfirmRemoveDialog: true,
      removeUserId: clientId,
    });
  };

  onConfirmDelete = () => {
    const { removeUserId, clientsList, selectedClients, pageNumber, offset, limit } = this.state;
    const selectedConfirmUser = removeUserId;
    this.setState(
      {
        showConfirmRemoveDialog: false,
        removeUserId: null,
      },
      () => {
        const { info } = this.props.user;

        const newUpdatedClientValues = selectedClients.filter(
          (item, index) => item !== selectedConfirmUser
        );
        const newSelectedClients =
          clientsList &&
          clientsList
            .filter(
              (client) => newUpdatedClientValues.indexOf(client.clientId) != -1
            )
            .map((item) => {
              return { clientId: item.clientId, clientName: item.clientName, appType: item.appType };
            });

        this.props
          .dispatch(
            updateClientsAccessList({
              portalProfileId: info.portalProfileId,
              userId: this.state.selectedUser.userId,
              clientIds: newSelectedClients
            })
          )
          .then((response) => {
            if (!response) {
              this.setState({
                alertMessage: this.props.bankClients.error,
                alertMessageCallbackType: null,
                alertType: "error",
              });
              return false;
            }
            this.setState({
              selectedClients: newUpdatedClientValues,
              alertMessage: "Client deleted successfully.",
              alertMessageCallbackType: null,
              alertType: "success",
            }, () => {
              const tempPageN = pageNumber > Math.ceil(Number(Number(selectedClients.length - 1) / limit))
                ? Number(pageNumber - 1)
                : pageNumber

              this.setState({
                pageNumber: tempPageN,
                offset: tempPageN > 1 ? (tempPageN - 1) * limit : 0,
              }, () => this.fetchLimitedClientsAccessList())
            });
          });
      }
    );
  };

  onCancelDelete = () => {
    this.setState({
      showConfirmRemoveDialog: false,
      removeUserId: null,
    });
  };

  handleSelectAllClick = (event) => {
    const { clientsList } = this.state;
    if (event.target.checked) {
      const newSelecteds = clientsList.map((n) => n.clientId);
      this.updateClientsAccess(newSelecteds);

      //this.setState({selectedClients: newSelecteds});

      return;
    }
    this.setState({ selectedClients: [] });
  };

  hideAlertMessage = () => {
    this.setState({
      alertMessage: null,
      alertType: null,
      alertMessageCallbackType: null,
    });
  };

  isPermissionSet = (clientId) => {
    const { assgnedClients } = this.state;

    const aCilent = assgnedClients.filter(
      (item) => item.clientId == clientId && item.isPermissionSet
    );
    if (aCilent.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  handlePageChange = (pageNumber) => {
    const { limit } = this.state;
    this.setState({
      pageNumber,
      offset: (pageNumber - 1) * limit,
    }, () => this.fetchLimitedClientsAccessList())
  }

  onToggleChange = (e, type) => {
    this.setState({ appType: type, selectedClients: [] }, () => {
      this.fetchClientsList();
      this.fetchClientsAccessList();
      this.fetchLimitedClientsAccessList();
    });
  }

  render() {
    const {
      isLoading,
      clientsList,
      selectedClients,
      alertType,
      alertMessage,
      showConfirmRemoveDialog,
      alertMessageCallbackType,
      selectedUser,
      pageNumber,
      limit,
      limitedClientList,
      appType
    } = this.state;
    const { classes, permissions, user } = this.props;
    const userName = selectedUser.user && selectedUser.user.isSSO == 0 ? (selectedUser.user.userName || "") : (selectedUser.user.SSOUserId || "");

	const showToggleButton = user?.isPayeeChoicePortal ? false: true;

    return (
      <Fragment>
        <Grid container xs={12} spacing={3} className={classes.root}>
          <Paper className={classes.paper}>
            <Grid item md={12} xs={12}>
				{showToggleButton ?<Box display="flex" mb={2}>
                <Box
                  bgColor="#fff"
                  border="1px solid #CCCCCC"
                  borderRadius={4}
                >
                  <StyledToggleButtonGroup
                    size="small"
                    value={appType}
                    exclusive
                    onChange={this.onToggleChange}
                  >
                    <ToggleButton value={EntityType.ALL}>All</ToggleButton>
                    <ToggleButton value={EntityType.B2C}>B2C</ToggleButton>
                    <ToggleButton value={EntityType.B2B}>B2B</ToggleButton>
                  </StyledToggleButtonGroup>
                </Box>
              </Box>: null}
            </Grid>

            <Grid item xs={12} className={classes.gtidItem}>
              <Box p={2} display="flex" justifyContent="space-between">
                <Typography variant="h2">
                  Select Client Access for {`${userName}`}
                </Typography>
                <Box display="flex" m={-2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="checkedB"
                        color="secondary"
                        checked={
                          clientsList.length > 0 &&
                          clientsList.length === selectedClients.length
                        }
                        onChange={(event) => this.handleSelectAllClick(event)}
                      />
                    }
                    label="Grant Access to all client portals"
                  />
                </Box>
                {/* <Link
                  to={`/manage/user`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                    color: "#0b1941",
                  }}
                >
                  <ArrowBackOutlinedIcon variant="contained" />
                  <span>Back</span>
                </Link> */}
              </Box>
            </Grid>
            <Grid item xs={12} className={classes.gtidItem}>
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                width="50%"
              ></Box>
            </Grid>
            <Grid item xs={3} className={classes.gtidItem}>
              <Box p={1}>
                <FormControl variant="outlined" fullWidth={true}>
                  <InputLabel
                    htmlFor="clientId"
                    style={{ backgroundColor: "#fff" }}
                  >
                    Add Client
                  </InputLabel>
                  <Select
                    labelId="clientId"
                    fullWidth={true}
                    input={<OutlinedInput />}
                    multiple
                    value={selectedClients}
                    autoComplete="off"
                    variant="outlined"
                    name="clientId"
                    MenuProps={{
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left"
                      },
                      getContentAnchorEl: null
                    }}
                    onChange={(event) => this.handleChange(event)}
                    renderValue={(selected) => {
                      if (selected.length === 1) {
                        const selectedClient =
                          clientsList &&
                          clientsList.filter(
                            (client) => client.clientId == selected[0]
                          );
                        return (
                          <em>
                            {(clientsList.length &&
                              selectedClient.length &&
                              selectedClient[0].clientName) ||
                              ""}
                          </em>
                        );
                      }

                      return `Multiple (${selected.length} Clients)`;
                    }}
                  >
                    {clientsList &&
                      clientsList.map((client) => (

                        <MenuItem key={client.clientId} value={client.clientId}>
                          <Checkbox
                            checked={
                              selectedClients.length > 0 &&
                              selectedClients.indexOf(client.clientId) > -1
                            }
                          />
                          <ListItemText primary={client.clientName} />
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item spacing={2} className={classes.gtidItem} xs={12}>
              <Grid item container justify="center">
                {isLoading ? (
                  <CircularProgress
                    color="primary"
                  />
                ) : null}
              </Grid>
              <Grid item container>
                {clientsList &&
                  clientsList
                    .filter(
                      (client) => limitedClientList.indexOf(client.clientId) != -1
                    )
                    .map((client) => {
                      const isPermissionSet = this.isPermissionSet(
                        client.clientId
                      );

                      return (
                        <Grid item xs={6} sm={6}>
                          <Box display="flex" justifyContent="flex-start" width="100%" p={1}>
                            <Box
                              p={1}
                              width="200px"
                              display="flex"
                              alignItems="center"
                              justifyContent="flex-start"
                            >
                              <Typography variant="body1" color="primary" style={{ wordBreak: "break-all" }}>
                                {client.clientName}
                              </Typography>
                            </Box>
                            <Box p={1}>
                              <Button
                                variant="contained"
                                color="primary"
                                disableElevation
                                onClick={() =>
                                  this.getClientsPermissions(client)
                                }
                              >
                                Set Custom Permissions
                              </Button>
                            </Box>
                            <Box p={0}>
                              <IconButton
                                color="primary"
                                component="span"
                                onClick={() =>
                                  this.handleRemoveClient(client.clientId)
                                }
                              >
                                <DeleteIcon color="primary" />
                              </IconButton>
                            </Box>
                            {isPermissionSet && (
                              <Box p={1} style={{ padding: "13px 0 0" }}>
                                <VisibilityIcon color="primary" />
                              </Box>
                            )}
                          </Box>
                        </Grid>
                      );
                    })}
              </Grid>

              {!isLoading
                ? <Grid>
                  <Box my={2} className={classes.paginationBox}>
                    <Paper>
                      <Box py={2} display="flex" justifyContent="flex-end">
                        <Pagination
                          count={selectedClients && Math.ceil(Number((selectedClients.length / limit)))}
                          defaultPage={pageNumber}
                          page={pageNumber}
                          onChange={(e, page) => this.handlePageChange(page)}
                        />
                      </Box>
                    </Paper>
                  </Box>
                </Grid>
                : null
              }

            </Grid>
          </Paper>
        </Grid>

        {alertMessage &&
          this.renderAlertMessage("", alertMessage, alertMessageCallbackType)}
        {showConfirmRemoveDialog &&
          this.renderDeleteDialog(
            "Are you sure you want to delete client?",
            ""
          )}
      </Fragment>
    );
  }

  renderSnackbar = (type, message) => {
    return (
      <Notification
        variant={type}
        message={message}
        handleClose={this.hideAlertMessage}
      />
    );
  };

  renderAlertMessage = (title, message, callbackType) => {
    return (
      <AlertDialog
        dialogClassName={"alert-dialoge-root"}
        title={title}
        message={message}
        onConfirm={() => this.hideAlertMessage()}
      />
    );
  };

  renderDeleteDialog = (title, message) => {
    return (
      <ConfirmDialog
        title={title}
        message={message}
        onCancel={() => this.onCancelDelete()}
        onConfirm={() => this.onConfirmDelete()}
      />
    );
  };
}

export default connect((state) => ({ ...state.user, ...state.bankClients }))(
  withStyles(styles)(Clients)
);
