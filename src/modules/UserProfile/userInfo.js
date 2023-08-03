import React, { useState, useEffect } from "react";
import { Grid, MenuItem } from "@material-ui/core";
import TextField from "~/components/Forms/TextField";
import Tabs from "~/components/Forms/Tabs";
import { TabPanel } from "~/components/TabPanel/index";
import { connect } from "react-redux";
import CountryPhoneCode from "../../components/Forms/CountryPhoneCode";

function UserInfo(props) {
  const {
    userInfoObj,
    checkUserInput,
    validation,
    value,
    handleChange,
  } = props;
  // const [questions, setquestions] = useState({});
  const tabLabels = [
    "Register using Single Sign On (SSO) ID",
    "Register as Stand Alone User",
  ];

  useEffect(() => {
    // getQuestions();
  }, []);

  const tooltipObj = {
    title: "New password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
    arrow: true,
    placement: "top-end",
  }

  return (
    <form autoComplete="off" className="companyDetails">
      <div className="title">System Admin Credentials:</div>
      <Grid container spacing={3} direction='row'>
        <Grid item xs={12} sm={6} container direction="row" spacing={2}>
          <Grid item xs={12} sm={2}>
            <TextField
              name="prefix"
              select
              label="Prefix"
              SelectProps={{
                native: true,
              }}
              value={userInfoObj.prefix.value}
              onChange={checkUserInput}
            >
              <MenuItem key="Male" value="Mr">
                Mr
              </MenuItem>
              <MenuItem key="Female" value="Ms">
                Ms
              </MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              name="f_name"
              label="First Name"
              type="text"
              value={userInfoObj.f_name.value}
              error={validation.firstName && validation.firstName.length > 0}
              helperText={validation.firstName}
              inputProps={{ maxLength: 50 }}
              onChange={checkUserInput}
              required
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              name="l_name"
              label="Last Name"
              type="text"
              value={userInfoObj.l_name.value}
              error={validation.lastName && validation.lastName.length > 0}
              helperText={validation.lastName}
              inputProps={{ maxLength: 50 }}
              onChange={checkUserInput}
              required
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} container direction="row" spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="user_email"
              label="Email"
              type="text"
              value={userInfoObj.user_email.value}
              error={validation.userEmail && validation.userEmail.length > 0}
              helperText={validation.userEmail}
              onChange={checkUserInput}
              required
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} container direction="row" spacing={2}>
          <Grid item xs={12} sm={3}>
            <CountryPhoneCode
              select
              name="phoneCountryCode"
              id="country_code"
              label="Country"
              value={userInfoObj.phoneCountryCode.value}
              required
              onChange={checkUserInput}
              inputProps={{ maxLength: 4 }}
              error={
                validation.phoneCountryCode &&
                validation.phoneCountryCode.length > 0
              }
              helperText={validation.phoneCountryCode}
              excludeCountryCode={["CA", "UM"]}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="user_phone"
              id="user_phone"
              label="Phone Number"
              type="text"
              required
              value={userInfoObj.user_phone.value}
              error={validation.userPhone && validation.userPhone.length > 0}
              helperText={validation.userPhone}
              onChange={checkUserInput}
              inputProps={{ maxLength: 10 }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="user_ext"
              id="user_ext"
              label="Extension"
              type="text"
              required
              value={userInfoObj.user_ext.value}
              onChange={checkUserInput}
              inputProps={{ maxLength: 10 }}
              error={validation.userExt && validation.userExt.length > 0}
              helperText={validation.userExt}
            />
          </Grid>
        </Grid>
        <Grid
          item
          xs={9}
          container
          direction="row"
          spacing={2}
          justify="center"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            labels={tabLabels}
          ></Tabs>
        </Grid>
        <Grid item xs={12}>
          <TabPanel value={value} index={0}>
            <Grid container direction="row" spacing={3}>
              <Grid item xs={12} sm={6} container direction="row" spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="standaloneOrSSONumber"
                    id="standaloneOrSSO_number"
                    label="SSO-ID"
                    type="text"
                    value={userInfoObj.standaloneOrSSONumber.value}
                    onChange={checkUserInput}
                    inputProps={{ maxLength: 20 }}
                    style={{ marginTop: "30px" }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </TabPanel>
        </Grid>
        <Grid item xs={12}>
          <TabPanel value={value} index={1}>
            <Grid container direction="row" spacing={3}>
              <Grid item xs={12} sm={6} container direction="row" spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="user_name"
                    label="User Name"
                    type="text"
                    value={userInfoObj.user_name.value}
                    error={validation.userName && validation.userName.length > 0}
                    helperText={validation.userName}
                    inputProps={{ maxLength: 50 }}
                    onChange={checkUserInput}
                    required
                  />
                </Grid>
                <Grid container item xs={12} spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      name="user_pass"
                      label="Password"
                      type="password"
                      value={userInfoObj.user_pass.value}
                      error={
                        validation.userPassword &&
                        validation.userPassword.length > 0
                      }
                      helperText={validation.userPassword}
                      onChange={checkUserInput}
                      tooltipProps={tooltipObj}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      name="confirm_pass"
                      label="Confirm Password"
                      type="password"
                      value={userInfoObj.confirm_pass.value}
                      onChange={checkUserInput}
                      error={
                        validation.userConfirmPassword &&
                        validation.userConfirmPassword.length > 0
                      }
                      helperText={validation.userConfirmPassword}
                      required
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </TabPanel>
        </Grid>
      </Grid>
    </form >
  );
}
export default connect((state) => ({ ...state.user }))(UserInfo);
