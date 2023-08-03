import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import ThemeWrapper from "~/ThemeWrapper";
import { Box } from "@material-ui/core";
import { Helmet } from "react-helmet";

import { userInfo, logout, keepSessionLive,fetchIsPayeeChoicePortal } from "~/redux/actions/user";
import Header from "~/components/Header";
import Sidebar from "~/components/Sidebar";
import Footer from "~/components/Footer";

import Login from "~/views/Login";
import ResetPassword from "~/views/Login/ResetPassword/";
import Dashboard from "~/views/Dashboard";
import USBankDashboard from "~/views/Dashboard/USBank";
import UserManagement from "~/views/UserManagement";
import ClientOnboard from "./views/ClientOnboard";
import Reports from "~/views/Reports";

import SessionOut from "~/views/SessionOut/";

import "./App.css";
import UserProfile from "./views/UserProfile";
import ClientsOnboarded from "./views/ClientsOnboarded";
import Payees from "./views/Payees";
import CampaignLaunchTab from "~/views/Campaigns/";

import { IdleTimeOutModal } from "~/components/Dialogs";
import IdleTimer from "react-idle-timer";
import {
  fetchSSODetails,
  fetchPortalAccessDetails,
} from "./redux/helpers/user";
import config from "~/config";
import accessRights from "./config/accessRights.js";

import favicon from "~/assets/images/favicon.ico";
import usBankFav from "~/assets/images/usbank-favicon.ico"
import {
  updateOnboardingCLient,
} from "./redux/actions/clients";
import { fetchAppType } from "~/redux/helpers/clients";

class AuthRoute extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      userType: [] 
    }
  }

  componentDidMount() {
    const { info } = this.props.user;
    this.props.dispatch(fetchIsPayeeChoicePortal())
    if (info) {
      //this.props.dispatch(fetchUserPermissionsMinified({ UserId: info && info.Id}));
    }
    this.getAppType();
  }

  isAllowed(name, isProtected) {
    const permissions = this.props.permissions.minified;
    if (isProtected) {
      return permissions && permissions.includes(accessRights[name]);
    } else {
      return true;
    }
  }
  getAppType = () => {
    fetchAppType().then((response) => {
      const { error } = response;
      if (error)
        return false;
      else {
        this.setState({
          userType: response?.data ?? []
        })
      }
    })
  }
  render() {
    const { component: Component, isLoggedIn, ...rest } = this.props;
    const { info } = this.props.user;
    const { minified } = this.props.permissions;
    const { permissionName } = this.props;
    const {userType} = this.state;

    return (
      <Route
        {...rest}
        render={(props) =>
          isLoggedIn ? (
            <Fragment>
              <Header {...props} claims={minified} info={info} />
              <Sidebar {...props} user={info} userType={userType}/>
              {this.isAllowed(permissionName, props.isProtected) ? (
                <Box
                  pt={7}
                  style={{ minHeight: "calc(100vh - 56px)" }}
                  className={`has-sidebar`}
                >
                  <Component {...props} claims={minified} info={info} />
                </Box>
              ) : (
                <Box
                  pt={10}
                  pl={5}
                  style={{ minHeight: "calc(100vh - 56px)" }}
                  className={`has-sidebar`}
                ></Box>
              )}
              <Footer {...props} />
            </Fragment>
          ) : (
            <Redirect to="/" />
          )
        }
      />
    );
  }
}

const ProtectedRoutes = connect((state) => ({
  ...state.user,
  ...state.permissions,
}))(AuthRoute);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      timeout: config.sessionTimeout - config.showPopupTime - 180000,//less 2 in milli seconds
      isTimedOut: false,
      logout: false,
      showModal: false,
    };
    this.idleTimer = null;
    //this.onAction = this._onAction.bind(this);
    //this.onActive = this._onActive.bind(this);
    this.onIdle = this._onIdle.bind(this);
  }

  getPortalAccessDetails(bankId) {
    return fetchPortalAccessDetails(bankId);
  }

  componentDidMount() {
    this.props.dispatch(fetchIsPayeeChoicePortal())
    this.props.dispatch(userInfo()).then(() => {
      this.setState({
        isLoading: false,
      });
      this.checkSession();
      setInterval(() => {
        this.checkSession();
      }, 60000); //Check in every one minutes
    });
    const selectedEntityType = sessionStorage.getItem("selectedEntityType");
    this.props.dispatch(
      updateOnboardingCLient({
        selectedEntityType,
      })
    );
  }

  checkSession = () => {
    //const clientId = cookies.get("@userId") ? parseInt(cookies.get("@userId")) : null;
    //const { info } = this.props.user;
    if (
      !this.state.showModal &&
      this.props.user &&
      this.props.user.isLoggedIn
    ) {
      const tokenExpiryTime = this.props.user.info.exp; //in seconds
      const currentTime = Math.floor(Date.now() / 1000); //convert to seconds
      //console.log("tokenExpiryTime", moment(tokenExpiryTime * 1000).format("DD-MM-YYYY h:mm:ss") );
      //console.log("current time", moment(currentTime * 1000).format("DD-MM-YYYY h:mm:ss") );
      if (
        !this.state.showModal &&
        tokenExpiryTime > currentTime &&
        currentTime >= tokenExpiryTime - 120
      ) {
        //refresh token
        this.updateSession();
      }
    }
  }

  _onActive(e) {
    const totalIdleTime = this.idleTimer && this.idleTimer.getTotalIdleTime();
    if (totalIdleTime >= config.sessionTimeout) {
      if (
        this.props.user &&
        this.props.user.isLoggedIn
      ) {
        this.idleTimer.reset();
        //this.setState({ logout: true, isTimedOut: true, showModal: false });
        console.log("in _onActive logout");
        //this.props.dispatch(logout());
      } else {
        this.idleTimer.reset();
      }
    } else {
      if (
        !this.state.showModal &&
        this.props.user &&
        this.props.user.isLoggedIn
      ) {
        const tokenExpiryTime = this.props.user.info.exp; //in seconds
        const currentTime = Math.floor(Date.now() / 1000); //convert to seconds

        if (
          !this.state.showModal &&
          tokenExpiryTime > currentTime &&
          currentTime >= tokenExpiryTime - 120
        ) {
          //refresh token
          this.updateSession();
        }
      }
      this.idleTimer.reset();
      this.setState({ isTimedOut: false });
    }
  }

  _onIdle(e) {
    if (
      this.props.user &&
      this.props.user.isLoggedIn
    ) {
      this.setState({ showModal: true });
      setTimeout(() => {
        if (
          this.state.showModal &&
          this.props.user &&
          this.props.user.isLoggedIn
        ) {
          this.idleTimer.reset();
          this.setState({ logout: true, isTimedOut: true, showModal: false });
          //console.log("in _onIdle logout");
          this.props.dispatch(logout());
        }
      }, config.showPopupTime);
    }
  }

  updateSession = () => {
    try {
      this.props.dispatch(keepSessionLive()).then((response) => {
        //console.log("updateSession keepSessionLive response", response);
        if (!response) {
          //console.log("in updateSession logout");
        }
        this.idleTimer.reset(); //reset timer
      });
    } catch (ex) {
      //console.log("in updateSession  Exception keepSessionLive");
      //this.idleTimer.reset(); //reset timer
    }
  };

  keepUpdateSession = () => {
    try {
      this.props.dispatch(keepSessionLive()).then((response) => {
        //console.log("updateSession keepSessionLive response", response);
        if (!response) {
          this.setState({ showModal: false });
        }
        this.idleTimer.reset(); //reset timer
        this.setState({ showModal: false });
      });
    } catch (ex) {
      //console.log("in updateSession  Exception keepSessionLive");
      this.setState({ showModal: false });
      this.idleTimer.reset(); //reset timer
    }
  };

  getSSODetails() {
    return fetchSSODetails();
  }

  render() {
    const { isLoggedIn,isPayeeChoicePortal } = this.props.user;
    const { isLoading, showModal } = this.state;

    if (isLoading) {
      return null;
    }

    return (
      <div className="App">
        <ThemeWrapper>
          <BrowserRouter>
            <Helmet>
              <title>{isPayeeChoicePortal ? "U.S. Bank" : "Citibank"}</title>
              <meta name="title" content={isPayeeChoicePortal ? "U.S. Bank" : "Citibank"} />
              <meta name="description" content={isPayeeChoicePortal ? "U.S. Bank" : "Citibank"} />
              <meta name="keywords" content={isPayeeChoicePortal ? "U.S. Bank" : "Citibank"} />
              <link
                id="favicon"
                rel="shortcut icon"
                type="image/x-icon"
                href={isPayeeChoicePortal ? usBankFav :favicon}
                sizes="16x16"
                data-react-helmet="true"
              />
            </Helmet>
            <IdleTimer
              ref={(ref) => {
                this.idleTimer = ref;
              }}
              startOnMount={true}
              element={document}
              onIdle={this.onIdle}
              debounce={250}
              timeout={this.state.timeout}
            />
            <React.Fragment>
              <Switch>
                <Route
                  exact
                  path={`${config.baseName}/`}
                  render={(props) => (
                    <Fragment>
                      <Box>
                        <Login {...props} forgotPasswordView={false} />
                      </Box>
                    </Fragment>
                  )}
                />
                <Route
                  exact
                  path={`${config.baseName}/forgot-password`}
                  render={(props) => (
                    <Fragment>
                      <Box>
                        <Login {...props} forgotPasswordView={true} />
                      </Box>
                    </Fragment>
                  )}
                />
                <Route exact path="/reset-password" component={ResetPassword} />
                <Route
                  exact
                  path={"/sessionout"}
                  {...this.props}
                  component={SessionOut}
                />
                <ProtectedRoutes
                  isLoggedIn={isLoggedIn}
                  isProtected={false}
                  path="/user"
                  component={UserProfile}
                />
                <ProtectedRoutes
                  isLoggedIn={isLoggedIn}
                  isProtected={true}
                  path="/dashboard"
                  component={isPayeeChoicePortal ? USBankDashboard :Dashboard}
                />
                <ProtectedRoutes
                  isLoggedIn={isLoggedIn}
                  isProtected={true}
                  path="/manage/user"
                  permissionName="USERS_LIST_VIEW"
                  component={UserManagement}
                />
                <ProtectedRoutes
                  isLoggedIn={isLoggedIn}
                  isProtected={true}
                  permissionName="CLIENTS_LIST_ONBOARDING"
                  path="/clientOnboard"
                  component={ClientOnboard}
                />
                <ProtectedRoutes
                  isProtected={true}
                  isLoggedIn={isLoggedIn}
                  permissionName="CLIENTS_LIST_VIEW"
                  path="/clients"
                  component={ClientsOnboarded}
                />
                <ProtectedRoutes
                  isProtected={true}
                  isLoggedIn={isLoggedIn}
                  permissionName="PAYEES_LIST_VIEW"
                  path="/payees"
                  component={Payees}
                />
                <ProtectedRoutes
                  isLoggedIn={isLoggedIn}
                  path="/campaign"
                  isProtected={true}
                  permissionName="CAMPAIGNS_VIEW"
                  component={CampaignLaunchTab}
                />
                <ProtectedRoutes
                  isLoggedIn={isLoggedIn}
                  path="/reports"
                  isProtected={true}
                  permissionName="REPORTS_VIEW"
                  component={Reports}
                />
              </Switch>
            </React.Fragment>
          </BrowserRouter>
        </ThemeWrapper>
        {showModal &&
          this.renderAlertMessage(
            "You have been idle!",
            "You will get signed out of the system. Do you want to stay signed in?",
            showModal
          )}
      </div>
    );
  }

  renderAlertMessage = (title, message, showModal) => {
    return (
      <IdleTimeOutModal
        open={showModal}
        title={title}
        message={message}
        onConfirm={() => this.keepUpdateSession()}
      />
    );
  };
}

export default connect((state) => ({ ...state.user, ...state.permissions }))(
  App
);
