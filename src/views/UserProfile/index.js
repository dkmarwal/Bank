import React from "react";
import SubHeader from "~/components/_SubHeader";
import Profile from "~/modules/Profile";
import { connect } from "react-redux";
import { AlertDialog } from "~/components/Dialogs";
import {
  fetchUserProfileDetails,
  updateUserProfileDetails,
} from "~/redux/helpers/user";
import Password from "~/modules/Password";
import Security from "~/modules/Security";

class UserProfile extends React.Component {
  state = {
    message: "",
    flag: false,
  };

  setDialogMessage(flag, message) {
    this.setState({ message: message, flag: flag });
  }

  hideAlertMessage() {
    this.setState({ message: "", flag: false });
  }

  getUserProfileDetails(userId) {
    //let clientId = this.props.user.userData.portalProfileId;
    return fetchUserProfileDetails(userId);
  }

  getSecurityQuestions() {
    //return fetchSecurityQuestions();
  }

  updateUserProfileDetails(payload) {
    //let clientId = this.props.user.userData.portalProfileId;
    return updateUserProfileDetails(payload);
  }

  render() {
    const { flag, message } = this.state;
    const { isSSO } = this.props.user.info;
    return (
      <div className={"paymentsTabContainer"}>
        <SubHeader
          {...this.props}
          title={"Profile"}
          alias={"profile"}
          tabs={[
            {
              url: "/user/profile",
              name: "Profile",
              items: [],
              component: (
                <Profile
                  getUserProfileDetails={this.getUserProfileDetails.bind(this)}
                  updateUserProfileDetails={(payload) =>
                    this.updateUserProfileDetails(payload)
                  }
                />
              ),
              alias: "user",
              isProtected: true,
              showTab: true,
            },
            {
              url: "/user/password",
              name: "Password",
              items: [],
              component: (
                <Password
                  getUserProfileDetails={this.getUserProfileDetails.bind(this)}
                  updateUserProfileDetails={(payload) =>
                    this.updateUserProfileDetails(payload)
                  }
                />
              ),
              alias: "user",
              isProtected: true,
              showTab: isSSO ? false : true,
            },
            {
              url: "/user/Security",
              name: "Security",
              items: [],
              component: (
                <Security />
              ),
              alias: "Security",
              isProtected: true,
              showTab: true,
            },
          ]}
        />
        {flag && (
          <AlertDialog
            title={message}
            open={flag}
            onConfirm={() => this.hideAlertMessage()}
          />
        )}
      </div>
    );
  }
}

export default connect((state) => ({
  ...state.user,
  ...state.clientConfig,
}))(UserProfile);
