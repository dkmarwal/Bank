import React from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import App from "./App";
import { connect } from "react-redux";
import config from "~/config";

export class Wrapper extends React.Component {

    updateCookie(name, value) {
        document.cookie = name + "=" + value + `; Path=${config.baseName}/;`;
    }

    render() {
        return <div>
            <Switch>
                <Route
                    key={1}
                    exact
                    path={
                        "/migrate/:portalProfileId/:token/:refreshToken/:userId"
                    }
                    render={(props) => {
                        /* Get token from URL params */
                        const token = props.match.params.token;
                        const refreshToken = props.match.params.refreshToken;
                        const userId = props.match.params.userId;
                        const bankId = props.match.params.portalProfileId;
                        // this.deleteAllCookies();

                        //   this.setCookie("@accessToken", token);
                        //   this.setCookie("@refreshToken", refreshToken);
                        //   this.setCookie("@userId", userId);
                        //   this.setCookie("@portalTypeId", 1);

                        this.updateCookie("@accessToken", token);
                        this.updateCookie("@refreshToken", refreshToken);
                        this.updateCookie("@userId", userId);
                        this.updateCookie("@portalTypeId", 1);
                        setTimeout(() => {
                            window.location.href = `${config.baseName}/dashboard`;
                        });

                        // this.getPortalAccessDetails(bankId).then((response) => {
                        //   console.log(response, "ACCESS_RESPONSE");
                        //   if (response.error) {
                        //     return false;
                        //   }
                        //   this.deleteAllCookies();
                        //   this.setCookie("@accessToken", response.data.accessToken);
                        //   this.setCookie(
                        //     "@refreshToken",
                        //     response.data.refreshToken
                        //   );
                        //   this.setCook`ie("@userId", response.data.userData.userId);
                        //   this.setCookie("@portalTypeId", 1);
                        //   setTimeout(() => {
                        //
                        //   });
                        // });
                        return <div>Redirecting...</div>;
                    }}
                />
                <Route key={2} path={"/"} component={App} />
            </Switch>
        </div>
    }
}

export default connect((state) => ({ ...state.user, ...state.permissions }))(
    Wrapper
  );
  