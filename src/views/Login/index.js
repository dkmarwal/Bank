import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Grid,
  Paper,
  Box,
  Modal,
} from "@material-ui/core";

import { withStyles } from "@material-ui/styles";
import { AlertDialog } from "~/components/Dialogs";
import { login, setNewPassword, forgotPassword } from "~/redux/actions/user";

import styles from "./styles";
import LoginView from "./View/";
import ForgotPassword from "./ForgotPassword/";
import FirstLogin from "./FirstLogin/";
import PasswordExpired from "./PasswordExpired/";
import config from "~/config";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginProgress: false,
      buttonDisabled: false, //commented for recaptcha needs to be true in case of recaptcha is there
      showUpdatePasswordModal: false,
      loginId: null,
      password: null,
      forgotPasswordView: this.props.forgotPasswordView,
      isVerified: !config.showCaptcha, //commented for recaptcha needs to be false in case recaptcha is there
      error: null,
      validation: {},
      alertMessage: null,
      alertMessageCallbackType: null,
      showResetModal: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.user.isLoggedIn) {
      if (!nextProps.user.info.isFirstLogin) {
        nextProps.history.push("/dashboard");
      }
    }
    return null;
  }

  handleRecaptcha = (value) => {
    const recaptchaValue = value;
    if (recaptchaValue.length === 0) {
      this.setState({ isVerified: false });
    } else {
      this.setState({ isVerified: true });
    }
    this.setState({
      error: null,
    });
  };

  resetRecaptcha = (event) => {
    window.grecaptcha && window.grecaptcha.reset();
  };

  handleChange = (field, event, position) => {
    const { isVerified } = this.state;

    switch (field) {
      case "Email":
        this.setState({ loginId: event.target.value });
        break;
      case "Password":
        this.setState({ password: event.target.value });
        break;
      default:
        break;
    }

    this.setState({
      error: null,
    });
  };

  hideAlertMessage = () => {
    this.props.history.push(`${config.baseName}/`);
    this.setState({
      alertMessage: null,
      alertMessageCallbackType: null,
      forgotPasswordView: false,
    });
  };

  validateForm = () => {
    const { loginId, password, isVerified } = this.state;

    let valid = true;
    const validation = {};

    if (!loginId || (loginId && loginId.trim() === "")) {
      validation["Email"] = "Please enter username.";
      valid = false;
    }

    if (!password || (password && password.trim() === "")) {
      validation["Password"] = "Please enter password.";
      valid = false;
    }
    if (!isVerified) {
      validation["recaptchaValue"] = "Please select Captcha";
      valid = false;
    }

    this.setState({ validation: { ...validation } });
    return valid;
  };

  processLogin = (event) => {
    const {
      loginId,
      password,
      loginProgress,
      isVerified,
    } = this.state;

    const valid = this.validateForm();
    if (!valid) {
      return false;
    }
    if (loginId && password && isVerified && !loginProgress) {
      this.setState(
        {
          loginProgress: true,
          error: null,
        },
        async () => {
          const creds = {
            userName: loginId,
            password: password,
            portalTypeId: 1,
          };

          await this.props.dispatch(login(creds)).then((response) => {
            if (!response) {
              const { user } = this.props;
              if (user && user["data"] && user.data["isExpired"]) {
                this.setState({ showResetModal: true })
              }
              this.setState({
                validation: { Password: this.props.user.error || "" },
                loginProgress: false,
              });
              this.resetRecaptcha();
              return false;
            }

            const { user } = this.props;
            if (user && user.info && user.info.isFirstLogin) {
              this.setState({
                loginProgress: false,
                error: null,
                showUpdatePasswordModal: true,
              });
            }
          });
        }
      );
    }
  };

  processReset = ({ password, securityQuestionId, securityAnswer }) => {
    const resetData = {
      userName: this.props.user.info.userName,
      password: password,
      securityQuestionId: securityQuestionId,
      securityAnswer: securityAnswer,
    };
    return this.props.dispatch(setNewPassword(resetData));
  };

  handleForgotPassword = () => {
    this.setState({ forgotPasswordView: true, validation: {}, error: null });
    this.props.history.push(`${config.baseName}/forgot-password`);
  };

  onCancel = () => {
    this.setState({ forgotPasswordView: false, validation: {}, error: null });
    this.props.history.push(`${config.baseName}/`);
  };

  processForgotPassword = () => {
    const { loginId } = this.state;
    if (loginId && loginId.trim() !== "") {
      this.setState(
        {
          loginProgress: true,
          validation: {},
          error: null,
        },
        async () => {
          await this.props
            .dispatch(forgotPassword({ loginId }))
            .then((response) => {
              if (!response) {
                const { user } = this.props;
                if (user && user["data"] && user.data["isExpired"]) {
                  this.setState({ showResetModal: true })
                }
                this.setState({
                  error: this.props.user.error,
                  loginProgress: false,
                });

                return false;
              }

              this.setState({
                loginProgress: false,
                error: null,
                alertMessage: "Reset password link sent to your email address if user id is registered with us. If haven't received it yet please check your spam or retry after 30 minutes.",
                alertMessageCallbackType: null,
              });
            });
        }
      );
    } else {
      this.setState({
        validation: { Email: true },
      });
    }
  };

  render() {
    const {
      loginId,
      password,
      forgotPasswordView,
      showUpdatePasswordModal,
      alertMessage,
      alertMessageCallbackType,
      buttonDisabled,
      loginProgress,
      error,
      validation,
      showResetModal
    } = this.state;
    const { classes } = this.props;

    return (
      <Grid>
        {showResetModal ?
          <PasswordExpired
            userName={loginId}
            history={this.props.history}
          /> :
          <Grid container justify="center" className={classes.root}>
            <Grid item xs={12} md={6} lg={6} className={classes.leftWrap}>
              <Box display="flex" mt={2}></Box>
            </Grid>
            <Grid item xs={12} md={6} lg={6} className={classes.startupContainer}>
              <Box display="flex" justifyContent="center">
                {forgotPasswordView ? (
                  <ForgotPassword
                    credentials={{ Email: loginId }}
                    handleChange={this.handleChange}
                    onSubmit={this.processForgotPassword}
                    onCancel={this.onCancel}
                    updateProgress={loginProgress}
                    error={error}
                    validation={validation}
                    buttonDisabled={buttonDisabled}
                  />
                ) : (
                  <LoginView
                    credentials={{ Email: loginId, Password: password }}
                    handleChange={this.handleChange}
                    onSubmit={this.processLogin}
                    handleForgotPassword={this.handleForgotPassword}
                    handleRecaptcha={this.handleRecaptcha}
                    updateProgress={loginProgress}
                    error={error}
                    validation={validation}
                    buttonDisabled={buttonDisabled}
                  />
                )}
              </Box>
            </Grid>
            {alertMessage &&
              this.renderAlertMessage("", alertMessage, alertMessageCallbackType)}
          </Grid>}
        <Modal open={showUpdatePasswordModal} onClose={() => null}>
          <Paper className="update-password-modal-container">
            <Grid container justify="center">
              <Grid item sm={6} xs={12}>
                <FirstLogin
                  error={this.props.user.error}
                  processReset={this.processReset}
                />
              </Grid>
            </Grid>
          </Paper>
        </Modal>
      </Grid>
    );
  }

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
}

export default connect((state) => ({ ...state.user }))(
  withStyles(styles)(Login)
);
