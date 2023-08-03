import React from "react";
import {
  Grid,
  Card,
  Box,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  Avatar,
} from "@material-ui/core";
import { connect } from "react-redux";
import "./styles.scss";
import { fetchSecurityQuestions } from "../../redux/helpers/user";
import { AlertDialog } from "../../components/Dialogs";
import { updateUserInfo } from "../../redux/actions/user";
import CountryPhoneCode from "../../components/Forms/CountryPhoneCode";

class Profile extends React.Component {
  state = {
    userData: {},
    questions: [],
    flag: false,
    message: "",
    btnLoader: false,
    errors: {},
  };

  componentDidMount() {
    this.getDetails();
    this.getSecurityQuestions();
  }

  setDialogMessage(flag, message) {
    this.setState({ message: message, flag: true });
  }

  hideAlertMessage() {
    this.setState({ message: "", flag: false });
  }

  getSecurityQuestions() {
    fetchSecurityQuestions().then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message);
      }
      this.setState({ questions: response.data || [] });
    });
  }

  // getSecurityQuestion() {
  //     getSecurityQuestions
  // }
  validateForm() {
    const { userData } = this.state;
    const errors = {};
    let valid = true;
    const { isSSO } = this.props.user.info;
    const userNameValidation = !userData ||
      !userData["userName"] ||
      userData["userName"].toString().trim().length === 0;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;

    if (
      !userData ||
      !userData["title"] ||
      userData["title"].toString().trim().length === 0
    ) {
      errors["title"] = "Title is required.";
      valid = false;
    }
    if (
      !userData ||
      !userData["firstName"] ||
      userData["firstName"].toString().trim().length === 0
    ) {
      errors["firstName"] = "First name is required.";
      valid = false;
    }
    if (
      !userData ||
      !userData["phone"] ||
      userData["phone"].toString().trim().length === 0
    ) {
      errors["phone"] = "Phone number is required.";
      valid = false;
    }
    if (
      !userData ||
      !userData["phoneCountryCode"] ||
      userData["phoneCountryCode"].toString().trim().length === 0
    ) {
      errors["phoneCountryCode"] = "Country code is required.";
      valid = false;
    }
    if (userNameValidation && !isSSO) {
      (errors["userName"] = "Username is required.");
      valid = false;
    }
    if (
      !userData ||
      !userData["lastName"] ||
      userData["lastName"].toString().trim().length === 0
    ) {
      errors["lastName"] = "Last name is required.";
      valid = false;
    }
    if (
      !userData ||
      !userData["email"] ||
      userData["email"].toString().trim().length === 0
    ) {
      errors["email"] = "Email is required.";
      valid = false;
    }
    if (
      userData &&
      userData["email"] &&
      userData["email"].toString().trim().length &&
      !re.test(String(userData["email"]).toLowerCase())
    ) {
      errors["email"] = "Please enter a valid email.";
      valid = false;
    }
    if (
      (!userData ||
        !userData["securityAnswer"] ||
        userData["securityAnswer"].toString().trim().length === 0) && !isSSO
    ) {
      errors["securityAnswer"] = "Security Answer is required.";
      valid = false;
    }
    if (
      (userData &&
        userData["securityAnswer"] &&
        userData["securityAnswer"].toString().trim().length <6 && !isSSO
      )
    ) {
      errors["securityAnswer"] = "Security answer must be at least 6 characters long.";
      valid = false;
    }
    if (
      (!userData ||
        !userData["securityQuestionId"] ||
        userData["securityQuestionId"].toString().trim().length === 0) && !isSSO
    ) {
      errors["securityQuestionId"] = "Security question is required.";
      valid = false;
    }

    this.setState({ errors: errors });
    return valid;
  }

  saveDetails() {
    if (this.validateForm()) {
      const { userId } = this.props.user.info;
      let payload = {
        userId: userId,
        ...this.state.userData,
      };
      delete payload["displayName"];
      delete payload["appType"];
      delete payload["payerTypeId"];
      this.setState({ btnLoader: true }, () => {
        this.props.updateUserProfileDetails(payload).then((response) => {
          let { info } = this.props.user;
          const userData_ = this.state.userData;
          const { firstName, lastName } = userData_;
          info = userData_;
          // userData["firstName"] = firstName;
          // userData["lastName"] = lastName;
          // userData["displayName"] = `${firstName} ${lastName}`;
          userData_["displayName"] = `${firstName} ${lastName}`;

          this.props.dispatch(updateUserInfo(info));
          this.setDialogMessage(true, response.message);
          this.setState({ btnLoader: false });
        });
      });
    }
  }

  handlePhoneChange = ({target}) => {
    const {name, value} = target
    this.setState({
      userData: {...this.state.userData, [name] : value.replace(/[^0-9]/g, '')}
    })
  }

  handleInputChange(e) {
    let obj = {};
    let fieldName = e.target.name;
    obj[fieldName] = e.target.value;
    this.setState({ userData: { ...this.state.userData, ...obj } });
  }

  getDetails() {
    const { getUserProfileDetails } = this.props;
    const { userId } = this.props.user.info;
    getUserProfileDetails(userId).then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message);
      }
      this.setState({ userData: response.data });
    });
  }

  render() {
    const {
      flag,
      message,
      questions,
      userData,
      btnLoader,
      errors,
    } = this.state;
    const { isSSO } = this.props.user.info;
    return (
      <Box m={5}>
        <Card>
          <div
            px={75}
            py={2}
            style={{ width: "50%", display: "inline-block", marginLeft: "4%" }}
          >
            <Grid>
              {/* <Box my={4}>
                                <Grid>
                                    <span className="profilePhotoContainer">
                                        <img />
                                        <span>Upload Profile Image</span>
                                    </span> */}
              {/* <span className="">

                                </span> */}
              {/* </Grid>
                            </Box> */}

              <Box my={4} style={{ marginLeft: "2%" }}>
                <Grid>
                  <div className="profileInfo">
                    <p
                      style={{
                        textAlign: "left",
                        color: "#0b1941",
                        fontWeight: "400",
                        fontSize: "18px",
                      }}
                    >
                      User Details
                    </p>
                    {/* <span className="designation">
                                            system administrator
                                    </span> */}
                  </div>
                </Grid>
              </Box>

              <Box my={4}>
                <Grid container spacing={2}>
                  <Grid item sm={2} xs={2}>
                      <input
                        type="email"
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
                      select
                      fullWidth={true}
                      error={errors.title && errors.title.length > 0}
                      helperText={errors.title}
                      // onBlur={() => this.validateData()}
                      autoComplete="off"
                      // value={transactionType}
                      name="title"
                      value={userData.title || ""}
                      label="Prefix"
                      placeholder=""
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
                    >
                    <MenuItem id={"Mr"} value={"Mr"} key={"Mr"}>
                      Mr.
                      </MenuItem>
                    <MenuItem id={"Ms"} value={"Ms"} key={"Ms"}>
                      Ms.
                      </MenuItem>
                    <MenuItem id={"Mrs"} value={"Mrs"} key={"Mrs"}>
                      Mrs.
                      </MenuItem>
                    </TextField>
                </Grid>

                <Grid item sm={5} xs={5}>
                  <TextField
                    fullWidth={true}
                    error={errors.firstName && errors.firstName.length > 0}
                    helperText={errors.firstName}
                    // onBlur={() => this.validateData()}
                    autoComplete="off"
                    // value={transactionType}
                    name="firstName"
                    value={userData.firstName}
                    label="First Name"
                    placeholder=""
                    onChange={(e) => this.handleInputChange(e)}
                    variant="outlined"
                    dir="horizontal"
                    size="medium"
                    inputProps={{
                      maxLength: 20,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    className={""}
                  />
                </Grid>

                <Grid item sm={5} xs={5}>
                  <TextField
                    fullWidth={true}
                    error={errors.lastName && errors.lastName.length > 0}
                    helperText={errors.lastName}
                    // onBlur={() => this.validateData()}
                    autoComplete="off"
                    // value={transactionType}
                    name="lastName"
                    value={userData.lastName}
                    label="Last Name"
                    placeholder=""
                    onChange={(e) => this.handleInputChange(e)}
                    variant="outlined"
                    dir="horizontal"
                    size="medium"
                    inputProps={{
                      maxLength: 20,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    className={""}
                  />
                </Grid>
                </Grid>
              </Box>

            <Box my={3}>
              <Grid container spacing={2}>
                <Grid item sm={2} xs={2}>
                  <CountryPhoneCode
                    fullWidth={true}
                    error={
                      errors.phoneCountryCode &&
                      errors.phoneCountryCode.length > 0
                    }
                    helperText={errors.phoneCountryCode}
                    // onBlur={() => this.validateData()}
                    autoComplete="off"
                    name="phoneCountryCode"
                    value={`${userData.phoneCountryCode}`}
                    label="Country"
                    placeholder=""
                    type={"select"}
                    onChange={(e) => this.handleInputChange(e)}
                    excludeCountryCode={["CA", "UM"]}
                    variant="outlined"
                    dir="horizontal"
                    size="medium"
                    inputProps={{
                      maxLength: 4,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    className={""}
                  />
                  {/* <TextField
                      // error={validation.transactionType && validation.transactionType.length > 0}
                      // helperText={validation.transactionType}
                      // onBlur={() => this.validateData()}
                      // value={transactionType}
                      inputProps={{
                        maxLength: 100,
                      }}
                    /> */}
                </Grid>

                <Grid item sm={6} xs={6}>
                  <TextField
                    fullWidth={true}
                    error={errors.phone && errors.phone.length > 0}
                    helperText={errors.phone}
                    // onBlur={() => this.validateData()}
                    autoComplete="off"
                    // value={transactionType}
                    name="phone"
                    value={userData.phone}
                    label="Phone Number"
                    placeholder=""
                    onChange={(e) => this.handlePhoneChange(e)}
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
                  />
                </Grid>

                <Grid item sm={4} xs={4}>
                  <TextField
                    fullWidth={true}
                    // error={validation.transactionType && validation.transactionType.length > 0}
                    // helperText={validation.transactionType}
                    // onBlur={() => this.validateData()}
                    autoComplete="off"
                    value={userData.phoneExt}
                    name="phoneExt"
                    label="Extension"
                    placeholder=""
                    onChange={(e) => this.handleInputChange(e)}
                    variant="outlined"
                    dir="horizontal"
                    size="medium"
                    inputProps={{
                      maxLength: 10,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    className={""}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box my={4}>
              <Grid xs={12} sm={12}>
                <TextField
                  fullWidth={true}
                  // error={validation.transactionType && validation.transactionType.length > 0}
                  // helperText={validation.transactionType}
                  // onBlur={() => this.validateData()}
                  autoComplete="off"
                  disabled={isSSO}
                  value={
                    isSSO ? userData.SSOUserId : userData.userName
                  }
                  name={isSSO ? "SSOUserId" : "userName"}
                  label={isSSO ? "SSO User ID" : "User Name"}
                  placeholder=""
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
                />
              </Grid>
            </Box>

            <Box my={4}>
              <Grid xs={12} sm={12}>
                <TextField
                  fullWidth={true}
                  error={errors.email && errors.email.length > 0}
                  helperText={errors.email}
                  // onBlur={() => this.validateData()}
                  autoComplete="off"
                  value={userData.email}
                  name="email"
                  label="Email"
                  placeholder=""
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
                />
              </Grid>
            </Box>

            {!isSSO && <Box my={4}>
              <Grid xs={12} sm={12}>
                <TextField
                  select
                  fullWidth={true}
                  error={
                    errors.securityQuestionId &&
                    errors.securityQuestionId.length > 0
                  }
                  helperText={errors.securityQuestionId}
                  // onBlur={() => this.validateData()}
                  autoComplete="off"
                  value={
                    userData.securityQuestionId
                      ? Number(userData.securityQuestionId)
                      : ""
                  }
                  name="securityQuestionId"
                  label="Security question"
                  placeholder=""
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
                >
                  {questions &&
                    questions.map((q) => (
                      <MenuItem
                        id={q.questionId}
                        value={q.questionId}
                        key={q.questionId}
                      >
                        {q.question}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
            </Box>}

            {!isSSO && <Box my={4}>
              <Grid xs={12} sm={12}>
                <TextField
                  fullWidth={true}
                  error={
                    errors.securityAnswer && errors.securityAnswer.length > 0
                  }
                  helperText={errors.securityAnswer}
                  // onBlur={() => this.validateData()}
                  autoComplete="off"
                  value={userData.securityAnswer}
                  name="securityAnswer"
                  type="password"
                  label="Security Answer"
                  placeholder=""
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
                />
              </Grid>
            </Box>}

            <Grid justify="center">
              <Box my={12}>
                {/* <Box px={5}>
                      <Button
                        variant="contained"
                        style={{
                          display: "inline-block",
                          float: "left",
                          padding: "6px 10px",
                          width: "120px",
                          margin: "0px 10px 0 0",
                          background: "black",
                          color: "white",
                        }}
                        color=""
                      // onClick={onCancel}
                      >
                        Cancel
                      </Button>
                    </Box> */}

                <Box display="flex" justifyContent="center">
                  {btnLoader ? (
                    <CircularProgress color="primary" />
                  ) : (
                      <Button
                        variant="contained"
                        disableElevation
                        color="primary"
                        style={{ color: "white" }}
                        onClick={this.saveDetails.bind(this)}
                      >
                        Save
                      </Button>
                    )}
                </Box>
              </Box>
            </Grid>
            </Grid>
          </div>
        <div
          style={{
            width: "43%",
            height: "100%",
            display: "inline-block",
            verticalAlign: "top",
            paddingTop: "7%",
          }}
        >
          <div class="card">
            <div style={{ width: "100%", textAlign: "center" }}>

              <Avatar
                alt="user pic"
                src="/static/images/avatar/1.jpg"
                className={"large"}
              >
                {userData &&
                  userData.displayName &&
                  userData.displayName
                    .match(/(\b\S)?/g)
                    .join("")
                    .match(/(^\S|\S$)?/g)
                    .join("")
                    .toUpperCase()}
              </Avatar>

            </div>
            <div class="container">
              <h4>
                <b
                  style={{
                    fontSize: "18px",
                    color: "#0b1941",
                    fontWeight: "bold",
                  }}
                >
                  {userData && `${userData.displayName}`}
                </b>
              </h4>
              {/* <p style={{ fontWeight: "100", fontSize: "14px" }}>
                  SYSTEM ADMINISTRATOR1
                </p> */}
            </div>
          </div>
        </div>
        </Card>

        {
      flag && (
        <AlertDialog
          title={message}
          open={flag}
          onConfirm={() => this.hideAlertMessage()}
        />
      )
    }
      </Box >
    );
  }
}

export default connect((state) => ({
  ...state.user,
  ...state.clientConfig,
}))(Profile);
