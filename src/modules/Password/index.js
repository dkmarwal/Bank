import React from "react";
import {
  Grid,
  Card,
  Box,
  TextField,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { connect } from "react-redux";
import "./styles.scss";
import { updateUserPassword } from "../../redux/helpers/user";
import { AlertDialog } from "../../components/Dialogs";

class Password extends React.Component {
  state = {
    password: "",
    oldPassword: "",
    confirmNewPassword: "",
    userData: {},
    questions: [],
    flag: false,
    message: "",
    btnLoader: false,
    validation: {},
  };

  isFormValid() {
    const { password, oldPassword, confirmNewPassword } = this.state;
    const errorText = {};
    let valid = true;
    const regex = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
    );
    if (!oldPassword || oldPassword.toString().trim().length === 0) {
      valid = false;
      errorText["oldPassword"] = "Password is required.";
    }
    if (!password || password.toString().trim().length === 0) {
      valid = false;
      errorText["password"] = "Password is required.";
    }
    if (
      !confirmNewPassword ||
      confirmNewPassword.toString().trim().length === 0
    ) {
      valid = false;
      errorText["confirmNewPassword"] = "Password is required.";
    }
    if (password != confirmNewPassword) {
      valid = false;
      errorText["confirmNewPassword"] = "Passwords do not match.";
    }
    if (password != confirmNewPassword) {
      valid = false;
      errorText["confirmNewPassword"] = "Passwords do not match.";
    }
    if (
      password &&
      password.toString().trim().length > 0 &&
      !regex.test(password)
    ) {
      valid = false;
      errorText["password"] =
        "Password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character";
    }
    if (
      oldPassword &&
      oldPassword.toString().trim().length > 0 &&
      !regex.test(oldPassword)
    ) {
      valid = false;
      errorText["oldPassword"] =
        "Password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character";
    }

    this.setState({
      validation: { ...errorText },
    });

    return valid;
  }

  handleInputChange(e) {
    const name = e.target.name;
    const obj = {};
    obj[name] = e.target.value;
    this.setState(obj);
  }

  setDialogMessage(message) {
    this.setState({ message: message, flag: true });
  }

  hideAlertMessage() {
    this.setState({ message: "", flag: false });
  }

  saveDetails() {
    if (this.isFormValid()) {
      const { password, oldPassword } = this.state;
      const payload = {
        password: password,
        oldPassword: oldPassword,
      };
      this.setState({ btnLoader: true }, () => {
        updateUserPassword(payload).then((response) => {
          this.setDialogMessage(response?.message || "");
          this.setState({ btnLoader: false });
        });
      });
    }
  }

  //   getDetails() {
  //     const { getUserProfileDetails, setDialogMessage } = this.props;
  //     const { userId } = this.props.user.userData;
  //     getUserProfileDetails(userId).then((response) => {
  //       if (response.error) {
  //         this.setDialogMessage(true, response.message);
  //       }
  //       this.setState({ userData: response.data });
  //     });
  //   }

  render() {
    const {
      flag,
      message,
      btnLoader,
      oldPassword,
      password,
      confirmNewPassword,
      validation,
    } = this.state;
    return (
      <Box m={5}>
        <Card>
          <div px={50} py={2}>
            <Box my={6} style={{ marginLeft: "4%", marginBottom: "4%" }}>
              <Grid>
                <div className="profileInfo">
                  <p
                    style={{
                      textAlign: "left",
                      color: "#1c4b6a",
                      fontWeight: "400",
                      fontSize: "18px",
                    }}
                  >
                    Change Your Password
                  </p>
                </div>
              </Grid>
            </Box>
            <Grid
              class="divContainer"
              style={{ width: "40%", marginLeft: "4%" }}
            >
              <Box my={4}>
                <Grid xs={12} sm={12}>
                  <TextField
                    fullWidth={true}
                    id="outlined-password-input"
                    label="Old Password"
                    type="password"
                    autoComplete="off"
                    value={oldPassword}
                    name="oldPassword"
                    placeholder="Enter old password"
                    onChange={(e) => this.handleInputChange(e)}
                    variant="outlined"
                    dir="horizontal"
                    size="medium"
                    inputProps={{
                      maxLength: 100,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    className={""}
                    error={
                      validation.oldPassword &&
                      validation.oldPassword.length > 0
                    }
                    helperText={validation.oldPassword}
                  />
                </Grid>
              </Box>

              <Box my={4}>
                <Grid xs={12} sm={12}>
                  <TextField
                    fullWidth={true}
                    id="outlined-password-input"
                    type="password"
                    autoComplete="off"
                    value={password}
                    name="password"
                    label="New Password"
                    placeholder="Enter New Password"
                    onChange={(e) => this.handleInputChange(e)}
                    variant="outlined"
                    dir="horizontal"
                    size="medium"
                    inputProps={{
                      maxLength: 100,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    className={""}
                    error={
                      validation.password && validation.password.length > 0
                    }
                    helperText={validation.password}
                  />
                </Grid>
              </Box>

              <Box my={4}>
                <Grid xs={12} sm={12}>
                  <TextField
                    id="outlined-password-input"
                    type="password"
                    fullWidth={true}
                    // error={validation.transactionType && validation.transactionType.length > 0}
                    // helperText={validation.transactionType}
                    // onBlur={() => this.validateData()}
                    autoComplete="off"
                    value={confirmNewPassword}
                    name="confirmNewPassword"
                    label="Confirm New Password"
                    placeholder="Confirm New Password"
                    onChange={(e) => this.handleInputChange(e)}
                    variant="outlined"
                    dir="horizontal"
                    size="medium"
                    inputProps={{
                      maxLength: 100,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    className={""}
                    error={
                      validation.confirmNewPassword &&
                      validation.confirmNewPassword.length > 0
                    }
                    helperText={validation.confirmNewPassword}
                  >
                  </TextField>
                </Grid>
              </Box>

              <Grid justify="center">
                <Box my={12}>
                  <div
                    style={{
                      justify: "center",
                      margin: "0 auto",
                      display: "table",
                    }}
                  >
                    <Box px={2}>
                      {btnLoader ? (
                        <CircularProgress color="primary" />
                      ) : (
                        <Button
                          disableElevation
                          variant="contained"
                          color="primary"
                          onClick={this.saveDetails.bind(this)}
                        >
                          Save
                        </Button>
                      )}
                    </Box>
                  </div>
                </Box>
              </Grid>
            </Grid>
          </div>
        </Card>

        {flag && (
          <AlertDialog
            title={message}
            open={flag}
            onConfirm={() => this.hideAlertMessage()}
          />
        )}
      </Box>
    );
  }
}

export default connect((state) => ({
  ...state.user,
  ...state.clientConfig,
}))(Password);
