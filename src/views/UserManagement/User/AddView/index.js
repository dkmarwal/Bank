import React from "react";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  Paper,
  Button,
  MenuItem,
  CircularProgress,
  Tabs,
  Tab,
  Typography,
} from "@material-ui/core";

import TextField from "~/components/Forms/TextField";
import { TabPanel } from "~/components/TabPanel/index";

import { withStyles } from "@material-ui/styles";

import Phone from "~/components/TextBox/Phone";

import Notification from "~/components/Notification";
import { AlertDialog } from "~/components/Dialogs";
import trim from 'deep-trim-node';

import {
  createUser,
  updateUserDetails,
  fetchSecurityQuestions,
} from "~/redux/actions/user";
import { fetchRoles } from "~/redux/actions/role";
import config from "~/config";
import styles from "./styles";
import "./styles.css";
class UserAdd extends React.Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;
    this.state = {
      user: { ...state, newPassword: (state && state.password) || null },
      validation: {},
      roleList: [], //System Role list
      //roles: state && state.RoleID.split(',').map(Number) || [], //assigned user roles
      roles: (state && state.roles) || [], //assigned user roles
      securityQuestionList: [],
      updateProgress: false,
      alertType: "success",
      alertMessage: null,
      alertMessageCallbackType: null,
      isLoading: true,
    };
  }

  componentDidMount = async () => {
    await this.fetchRoleList();
    this.fetchSQList();
  };

  fetchRoleList = () => {
    const { info } = this.props.user;
    this.props
      .dispatch(
        fetchRoles({
          portalProfileId: info.portalProfileId,
          portalTypeId: info.portalTypeId,
          userId: info.userId,
        })
      )
      .then((response) => {
        if (!response) {
          this.setState({
            alertMessage: this.props.role.error,
            alertMessageCallbackType: null,
            alertType: "error",
            isLoading: false,
          });
          return false;
        }
        this.setState({
          isLoading: false,
          roleList: this.props.role.list,
        });
      });
  };

  fetchSQList = () => {
    this.props.dispatch(fetchSecurityQuestions()).then((response) => {
      if (!response) {
        this.setState({
          alertMessage: this.props.user.error,
          alertMessageCallbackType: null,
          alertType: "error",
          isLoading: false,
        });
        return false;
      }
      this.setState({
        isLoading: false,
        securityQuestionList: this.props.user.securityQuestionList,
      });
    });
  };

  validateForm = () => {
    const { user } = this.state;

    let valid = true;
    let validation = {};
    if (!user || !user.title || user.title.trim() === '') {
      validation["title"] = "Prefix is required.";
      valid = false;
    }
    if (!user || !user.firstName || user.firstName.trim() === "") {
      validation["firstName"] = "First name is required.";
      valid = false;
    }
    if (!user || !user.lastName || user.lastName.trim() === "") {
      validation["lastName"] = "Last name is required.";
      valid = false;
    }
    if (
      !user ||
      !user.phone ||
      user.phone.toString().trim() === "" ||
      user.phone.toString().trim().length !== 10
    ) {
      validation["phone"] = "Phone number should be 10 digits.";
      valid = false;
    }
    if (!user || !user.email || user.email.trim() === "") {
      validation["email"] = "Email is required.";
      valid = false;
    }
    if (user && user.email && user.email.trim().length > 0) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(user.email.trim().toLowerCase())) {
        validation["email"] = "Invalid email address.";
        valid = false;
      }
    }
    //if(!user || !user.userName || user.userName.trim()=== ''){
    //    validation["userName"] = true;
    //    valid=false;
    //}
    /*if(!user || !user.roleId || user.roleId.length== 0){
            validation["roleId"] = "Please select at least one role";
            valid=false;
        }
        if(!user || !user.securityQuestionId || user.securityQuestionId === 0){
            validation["securityQuestionId"] = true;
            valid=false;
        }
        if(!user || !user.securityAnswer || user.securityAnswer.trim()=== ''){
            validation["securityAnswer"] = true;
            valid=false;
        }*/

    if (!user || !user.isSSO || user.isSSO === false) {
      if (!user || !user.userName || user.userName.trim() === "") {
        validation["userName"] = "User name is required.";
        valid = false;
      }
      /*if(!user || !user.securityQuestionId || user.securityQuestionId === 0){
                validation["securityQuestionId"] = true;
                valid=false;
            }
            if(!user || !user.securityAnswer || user.securityAnswer.trim()=== ''){
                validation["securityAnswer"] = true;
                valid=false;
            }*/

      if (
        !user ||
        !user.password ||
        !user.newPassword ||
        user.newPassword.trim() !== user.password.trim()
      ) {
        if (
          !user ||
          !user.newPassword ||
          (user.newPassword && user.newPassword.trim() === "")
        ) {
          validation["password"] = "New password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.";
          valid = false;
        }
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;
        if (user.newPassword && !re.test(user.newPassword.trim())) {
          validation["password"] = "New password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.";
          valid = false;
        }
        if (
          !user ||
          !user.confirmPassword ||
          user.confirmPassword.trim() === ""
        ) {
          validation["ConfirmPassword"] = "Password and confirm password must be same.";
          valid = false;
        }
        if (user && user.newPassword !== user.confirmPassword) {
          validation["confirmPassword"] = "Password and confirm password must be same.";
          valid = false;
        }
      }
    } else {
      if (!user || !user.SSOUserId || user.SSOUserId.trim() === "") {
        validation["SSOUserId"] = "Please enter a valid SSO ID.";
        valid = false;
      }
      if (user && user.SSOUserId && user.SSOUserId.trim().length > 0) {
        const re = /^[0-9a-zA-Z]+$/; //Alphanumeric check expression
        if (!re.test(user.SSOUserId.trim())) {
          validation["SSOUserId"] = "Please enter a valid SSO ID.";
          valid = false;
        }
      }
    }

    this.setState({ validation: { ...validation } });

    return valid;
  };

  handleChangeISO = (event, value) => {
    const { user } = this.state;
    const newUserDetail = { ...user };
    if (value === 1) {
      newUserDetail["isSSO"] = true;
    } else {
      newUserDetail["isSSO"] = false;
    }
    this.setState({ user: { ...newUserDetail } });
  };

  handleChange = (field, event, value, position) => {
    const { user } = this.state;
    const newUserDetail = { ...user };
    const fieldName = event.target.name;

    switch (field) {
      case "roleId":
        const { value: options } = event.target;
        const value = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
          //if (options[i].selected) {
          value.push(options[i]);
          //}
        }
        //newUserDetail[fieldName] = value.join();
        newUserDetail[fieldName] = value;
        this.setState({ roles: value });

        break;

      case "SSOUserId":
        const SSOUserId = event.target.value;
        newUserDetail["SSOUserId"] = SSOUserId.replace(/[^a-zA-Z0-9]/g, "");
        break;
      case "phone":
        const phoneValue = event.target.value;
        newUserDetail["phoneCountryCode"] = phoneValue.ccode;
        newUserDetail["phone"] = phoneValue.phone;
        newUserDetail["phoneExt"] = phoneValue.ext;
        break;
      default:
        newUserDetail[fieldName] = event.target.value;
        break;
    }

    this.setState({ user: { ...newUserDetail } });

  };

  handleSubmit = () => {
    const { user } = this.state;
    const valid = this.validateForm();
    if (!valid) {
      return false;
    }

    this.setState(
      {
        updateProgress: true,
      },
      () => {
        const { info } = this.props.user;
        if (user && user.userId) {
          this.props
            .dispatch(
              updateUserDetails({
                portalProfileId: info.portalProfileId,
                portalTypeId: info.portalTypeId,
                user: trim(user),
              })
            )
            .then((response) => {
              if (!response) {
                this.setState({
                  alertMessage: this.props.user.error,
                  alertType: "error",
                  alertMessageCallbackType: null,
                  updateProgress: false,
                });
                return false;
              }
              this.setState({
                updateProgress: false,
                alertMessage: "User information updated successfully",
                alertMessageCallbackType: "REDIRECT",
                alertType: "success",
              });
              //this.props.history.push("/manage/user");
            });
        } else {
          this.props
            .dispatch(
              createUser({
                portalProfileId: info.portalProfileId,
                portalTypeId: info.portalTypeId,
                user: trim(user),
              })
            )
            .then((response) => {
              if (!response) {
                this.setState({
                  alertMessage: this.props.user.error,
                  alertType: "error",
                  alertMessageCallbackType: null,
                  updateProgress: false,
                });
                return false;
              }
              this.setState({
                updateProgress: false,
                alertMessage: "User added successfully",
                alertMessageCallbackType: "REDIRECT",
                alertType: "success",
              });
              //this.props.history.push("/manage/user");
            });
        }
      }
    );
  };

  hideAlertMessage = () => {
    this.setState({
      alertMessage: null,
      alertType: null,
      alertMessageCallbackType: null,
    });
  };

  goBack = () => {
    this.setState({
      alertMessage: null,
      alertMessageCallbackType: null,
    });
    this.props.history.push(`${config.baseName}/manage/user`);
  };

  handleCancel = () => {
    this.props.history.push(`${config.baseName}/manage/user`);
  };

  render() {
    const {
      isLoading,
      validation,
      user,
      updateProgress,
      securityQuestionList,
      alertMessage,
      alertMessageCallbackType,
    } = this.state;
    const { classes } = this.props;

    const tooltipObj = {
      title: "New password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
      arrow: true,
      placement: "top-end",
    }

    return (
      <Grid container justify="center" className={classes.root}>
        <Grid item container xs={12}>
          <Paper className={classes.paper}>
            <Grid
              container
              justify="center"
              style={{ marginTop: "25px" }}
            >
              <Grid item xs={2} sm={2} >
                <Box mx={1} pt={1} pl={2}>
                  <TextField
                    required
                    error={validation && validation.title}
                    helperText={validation && validation.title}
                    fullWidth={true}
                    select
                    autoComplete="off"
                    variant="outlined"
                    name="title"
                    label={"Prefix"}
                    value={(user && user.title) || ""}
                    onChange={(event) => this.handleChange("title", event)}
                  >
                    <MenuItem value=" ">
                      <em>Select</em>
                    </MenuItem>
                    <MenuItem value="Mr">Mr.</MenuItem>
                    <MenuItem value="Mrs">Mrs.</MenuItem>
                    <MenuItem value="Ms">Ms.</MenuItem>
                  </TextField>
                </Box>
              </Grid>
              <Grid item xs={4} sm={4} className={classes.gridItem}>
                <Box mx={1} pt={1} >
                  <input
                    type="text"
                    name="userName"
                    style={{ display: "none" }}
                  />
                  <input
                    type="password"
                    name="password"
                    autocomplete="new-password"
                    style={{ display: "none" }}
                  />
                  <TextField
                    required
                    label="First Name"
                    error={validation.firstName}
                    helperText={validation.firstName}
                    fullWidth={true}
                    autoComplete="off"
                    autoFocus={false}
                    variant="outlined"
                    color="secondary"
                    value={(user && user.firstName) || ""}
                    name="firstName"
                    onChange={(event) => this.handleChange("firstName", event)}
                    inputProps={{
                      maxLength: 20,
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} sm={6} className={classes.gridItem}>
                <Box pl={1} pr={1}>
                  <TextField
                    required
                    className={classes.inputLabel}
                    label="Last Name"
                    error={validation.lastName}
                    helperText={validation.lastName}
                    fullWidth={true}
                    autoComplete="off"
                    autoFocus={false}
                    variant="outlined"
                    color="secondary"
                    value={(user && user.lastName) || ""}
                    name="lastName"
                    onChange={(event) => this.handleChange("lastName", event)}
                    inputProps={{
                      maxLength: 20,
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} sm={6} className={classes.gridItem}>
                <Box mx={1} pt={2} pl={1}>
                  <Phone
                    required
                    error={validation.phone}
                    helperText={validation.phone}
                    id="phone"
                    name="phone"
                    ext={(user && user.phoneExt) || ""}
                    value={(user && user.phone) || ""}
                    ccode={(user && user.phoneCountryCode) || ""}
                    prefixCcode="+1"
                    onChange={(event) => this.handleChange("phone", event)}
                    color="secondary"
                  />
                </Box>
              </Grid>
              <Grid item xs={6} sm={6} className={classes.gridItem}>
                <Box mx={1} pt={2}>
                  <TextField
                    required
                    label={"Email"}
                    error={validation.email}
                    helperText={validation.email}
                    fullWidth={true}
                    autoFocus={false}
                    autoComplete="off"
                    variant="outlined"
                    value={(user && user.email) || ""}
                    color="secondary"
                    name="email"
                    inputProps={{
                      maxLength: 50,
                    }}
                    onChange={(event) => this.handleChange("email", event)}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} sm={6} className={classes.gridItem}>
                {" "}
              </Grid>
              {/*<Grid item xs={6} sm={6} className={classes.gridItem}>
                              <Box pl={2} width="50%" pt={1}>
                                <input
                                    accept="image/*"
                                    className={classes.input}
                                    id="userPhoto"
                                    type="file"
                                />
                                  <label htmlFor="userPhoto">
                                    <Button variant="outlined" color="primary" 
                                        component="span"
                                        className={classes.uploadBtn}
                                        startIcon={<PublishIcon />}
                                        >
                                        Upload a user profile photo
                                    </Button>
                                  </label>
                              </Box>
                            </Grid>*/}

              <Grid item xs={12} sm={12} className={classes.gridItem}>
                <Box
                  mx={1}
                  mt={1}
                  ml={2}
                  display="flex"
                  border={1}
                  borderColor="#0b1941"
                  width="450px"
                >
                  <Tabs
                    value={user && user.isSSO ? 1 : 0}
                    onChange={(event, value) =>
                      this.handleChangeISO(event, value)
                    }
                    variant="fullWidth"
                    className={classes.tabClass}
                    indicatorColor="none"
                  >
                    <Tab
                      key="tab-0"
                      label={
                        <span className={classes.checkedIcon}>
                          <span>Setup User Name</span>
                          {user && !user.isSSO && (
                            <img
                              className={classes.checkClass}
                              src={require(`~/assets/icons/checkTick.svg`)}
                              alt=""
                            />
                          )}
                        </span>
                      }
                      style={{ minHeight: "20px", height: "25px" }}
                      classes={classes}
                    />
                    <Tab
                      key="tab-1"
                      label={
                        <span className={classes.checkedIcon}>
                          <span style={{ marginRight: "8px" }}>
                            Single Sign On (SSO) ID
                          </span>
                          {user && user.isSSO && (
                            <img
                              className={classes.checkClass}
                              src={require(`~/assets/icons/checkTick.svg`)}
                              alt=""
                            />
                          )}
                        </span>
                      }
                      style={{ minHeight: "20px", height: "25px" }}
                      classes={classes}
                    />
                  </Tabs>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TabPanel value={user && user.isSSO ? 1 : 0} index={1}>
                  <Grid
                    item
                    container
                    direction="row"
                    xs={6}
                    sm={6}
                    className={classes.gridItem}
                  >
                    <Box mx={1} pt={1} pl={1} width="100%">
                      <TextField
                        required
                        label="SSO-Id"
                        error={validation.SSOUserId}
                        helperText={validation.SSOUserId}
                        disabled={user && user.isSSO ? false : true}
                        inputProps={{
                          maxLength: 20,
                        }}
                        fullWidth={true}
                        autoComplete="off"
                        autoFocus={false}
                        variant="outlined"
                        value={(user && user.SSOUserId) || ""}
                        name="SSOUserId"
                        onChange={(event) =>
                          this.handleChange("SSOUserId", event)
                        }
                      />
                    </Box>
                  </Grid>

                </TabPanel>
              </Grid>
              <Grid item xs={12}>
                <TabPanel value={user && user.isSSO ? 1 : 0} index={0}>
                  <Grid
                    item
                    container
                    direction="row"
                    xs={12}
                    sm={12}
                    className={classes.gridItem}
                  >
                    <Grid item xs={6} sm={6} className={classes.gridItem}>
                      <Box mx={1} pt={1}>
                        <TextField
                          required
                          label="User Name"
                          error={validation.userName}
                          helperText={validation.userName}
                          fullWidth={true}
                          autoFocus={false}
                          autoComplete="off"
                          variant="outlined"
                          value={(user && user.userName) || ""}
                          color="secondary"
                          name="userName"
                          onChange={(event) =>
                            this.handleChange("userName", event)
                          }
                          inputProps={{
                            maxLength: 50,
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      sm={6}
                      className={classes.gridItem}
                    ></Grid>
                    <Grid item xs={6} sm={6} className={classes.gridItem}>
                      <Box mx={1} pt={2}>
                        <TextField
                          required
                          label="Password"
                          error={validation.password}
                          fullWidth={true}
                          autoFocus={false}
                          autoComplete="off"
                          onPaste={(e) => e.preventDefault()}
                          onCopy={(e) => e.preventDefault()}
                          onDrag={(e) => e.preventDefault()}
                          onDrop={(e) => e.preventDefault()}
                          variant="outlined"
                          value={(user && user.newPassword) || ""}
                          color="secondary"
                          name="newPassword"
                          type="password"
                          tooltipProps={tooltipObj}
                          onChange={(event) =>
                            this.handleChange("newPassword", event)
                          }
                        />
                        <Typography variant="caption" color="error">
                          <Box pl={2}>{validation.password}</Box>
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6} sm={6} className={classes.gridItem}>
                      <Box mx={1} pt={2}>
                        <TextField
                          required
                          label="Confirm Password"
                          error={validation.confirmPassword}
                          helperText={validation.confirmPassword}
                          fullWidth={true}
                          autoFocus={false}
                          autoComplete="off"
                          onPaste={(e) => e.preventDefault()}
                          onCopy={(e) => e.preventDefault()}
                          onDrag={(e) => e.preventDefault()}
                          onDrop={(e) => e.preventDefault()}
                          variant="outlined"
                          value={(user && user.confirmPassword) || ""}
                          color="secondary"
                          name="confirmPassword"
                          type="password"
                          onChange={(event) =>
                            this.handleChange("confirmPassword", event)
                          }
                        />
                      </Box>
                    </Grid>
                    {1 == 0 && (
                      <>
                        <Grid item xs={6} sm={6} className={classes.gridItem}>
                          <Box mx={1} pt={1}>
                            <TextField
                              label="Security Question"
                              required
                              error={validation.securityQuestionId}
                              helperText={validation.securityQuestionId}
                              disabled={user && user.isSSO ? true : false}
                              fullWidth={true}
                              select
                              value={(user && user.securityQuestionId) || ""}
                              autoComplete="off"
                              autoFocus={false}
                              variant="outlined"
                              name="securityQuestionId"
                              onChange={(event) =>
                                this.handleChange("securityQuestionId", event)
                              }
                            >
                              {securityQuestionList ? (
                                securityQuestionList.map((option) => (
                                  <MenuItem
                                    key={option.questionId}
                                    value={option.questionId}
                                  >
                                    {option.question}
                                  </MenuItem>
                                ))
                              ) : (
                                <Box
                                  width="100px"
                                  display="flex"
                                  mt={1.875}
                                  justifyContent="center"
                                  alignItems="center"
                                >
                                  <CircularProgress color="primary" />
                                </Box>
                              )}
                            </TextField>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={6} className={classes.gridItem}>
                          <Box mx={1} pt={1}>
                            <TextField
                              label="Security Answer"
                              required
                              type="password"
                              error={validation.securityAnswer}
                              helperText={validation.securityAnswer}
                              disabled={user && user.isSSO ? true : false}
                              fullWidth={true}
                              autoComplete="off"
                              autoFocus={false}
                              variant="outlined"
                              value={(user && user.securityAnswer) || ""}
                              name="securityAnswer"
                              onChange={(event) =>
                                this.handleChange("securityAnswer", event)
                              }
                            />
                          </Box>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </TabPanel>
              </Grid>
              <Grid item container xs={12} sm={12} className={classes.gridItem}>
                <div
                  style={{
                    margin: "auto",
                    marginTop: "24px",
                    marginBottom: "40px",
                  }}
                  display="flex"
                  mb={5}
                  mt={3}
                  pl={3}
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  {updateProgress ? (
                    <CircularProgress color="primary" />
                  ) : (<>
                    <Button
                        variant="outlined"
                        style={{ marginLeft: "10px" }}
                        color="primary"
                        onClick={() => this.handleCancel()}
                    >
                        CANCEL
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginLeft: "10px", color: "white" }}
                      onClick={() => this.handleSubmit()}
                    >
                      CREATE USER
                    </Button>
                  </>)}
                </div>
              </Grid>
              <Grid item xs={6} sm={6} className={classes.gridItem}>
                {" "}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {alertMessage &&
          this.renderAlertMessage("", alertMessage, alertMessageCallbackType)}
      </Grid>
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
        onConfirm={() => {
          callbackType === "REDIRECT" ? this.goBack() : this.hideAlertMessage();
        }}
      />
    );
  };
}

export default connect((state) => ({ ...state.user, ...state.role }))(
  withStyles(styles)(UserAdd)
);
