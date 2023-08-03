import {
  Grid,
  Tab,
  Tabs,
  Box,
  Link,
} from "@material-ui/core";
import { TabPanel } from "~/components/TabPanel/index";
import React, { Component } from "react";
import config from "~/config";
import CloseIcon from "@material-ui/icons/Close";
import "./styles.scss";
import Phone from "~/assets/icons/phone.svg";
import Print from "~/assets/icons/print.svg";
import Weblink from "~/assets/icons/weblink.svg";
import Mail from "~/assets/icons/mail.svg";
import VendorContactInfo from "./VendorContactInfo";
import {
  fetchB2CCampaignCountsDetails,
  fetchClientPortalTokens,
  fetchPaymentCounts,
} from "~/redux/helpers/clients";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";

import { EntityType } from "~/config/entityTypes";

class ClientDetails extends Component {
  state = {
    selectedTab: 0,
    campaignCount: 1, //It will remain 1 always for b2c client : FSINPAYB2B-10071
    suppliersCount: 0,
    paymentsMade: 0,
    migrateBtnDisabled: false,
  };

  componentDidMount() {
    this.getCampaignCountsDetails();
    this.getPaymentsCounts();
  }

  getCampaignCountsDetails() {
    const clientId = this.props.selectedClient.clientId;
    fetchB2CCampaignCountsDetails(clientId).then((response) => {
      if (response.error) {
        return false;
      }
      this.setState({
        //campaignCount: response.data && response.data.count,
        suppliersCount: response.data && response.data.count,
      });
    });
  }

  getPaymentsCounts() {
    const clientId = this.props.selectedClient.clientId;
    const businessType = this.props.selectedClient.appType || EntityType.B2B;
    fetchPaymentCounts(clientId, businessType).then((response) => {
      if (response.error) {
        return false;
      }
      this.setState({ paymentsMade: response.data });
    });
  }

  getClientTokens(client) {
    return fetchClientPortalTokens(client.clientId, client.appType);
  }

  getProfileCircleName(name) {
    let newName = "";
    name && name.includes(" ")
      ? (newName =
          name &&
          `${name && name.split(" ")[0][0]}${name && name.split(" ")[1][0]}`)
      : (newName =
          name && `${name && name[0]}${name && name[1]}`.toUpperCase());
    return newName;
  }

  routeToClientDashboard() {
    const client = this.props.selectedClient;
    this.getClientTokens(client).then((response) => {
      if (response.error) {
        this.props.setDialogMessage(response.message);
        return false;
      }
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;
      const userId = this.props.user.info.userId;
      //const portalProfileId = this.props
      window.location.href = `${config.clientPortalBase}migrate/${userId}/${accessToken}/${refreshToken}`;
      //window.location.href = `http://localhost:3000/migrate/${userId}/${accessToken}/${refreshToken}`;
    });
  }

  handleTabChange(val) {
    this.setState({ selectedTab: val });
  }

  getOnboardingRoute(client) {
    const props = this.props;
    const { appType } = client;
    window.sessionStorage.setItem("clientId", client.clientId);
    window.sessionStorage.setItem("isHippa", client.isHippa);
    window.sessionStorage.setItem("parentId", client.parentId);
    window.sessionStorage.setItem("selectedOnboardType", "self");

    /* ---- Routes for Entity type B2C ----*/
    if (appType === EntityType.B2C) {
      switch (client.stepId) {
        case 0:
          props.history.push("/clientOnboard/OnboardType");
          break;
        case 100:
          props.history.push(
            `/clientOnboard/b2c/clientPermissions/${client.clientId}`
          );
          break;
        case 500:
        case 9100:
          props.history.push("/clientOnboard/b2c/clientProfile");
          break;
        case 10000:
          props.history.push("/clientOnboard/b2c/ClientRegistrationCompleted");
          break;
        default:
          props.history.push(
            `/clientOnboard/b2c/clientPermissions/${client.clientId}`
          );
          break;
      }
    } else {
    /* ---- Routes for Entity type B2B ----*/
      switch (client.stepId) {
        case 0:
          props.history.push("/clientOnboard/OnboardType");
          break;
        case 100:
          props.history.push(
            `/clientOnboard/clientPermissions/${client.clientId}`
          );
          break;
        case 500:
        case 9100:
          props.history.push("/clientOnboard/clientProfile");
          break;
        case 10000:
          props.history.push("/clientOnboard/ClientRegistrationCompleted");
          break;
        default:
          props.history.push(
            `/clientOnboard/clientPermissions/${client.clientId}`
          );
          break;
      }
    }
  }

  render() {
    const {
      selectedTab,
      campaignCount,
      suppliersCount,
      paymentsMade,
      migrateBtnDisabled,
    } = this.state;
    const client = this.props.selectedClient;
    const {
      phoneNumber,
      emailAddress,
      fax,
      duns,
      taxId,
      website,
      clientName,
      clientLocations,
      clientId,
    } = client;
    const { closeModal } = this.props;
    return (
      <Box py={5} width="920px">
        <Box mb={5} mt={-4} className="heading">
          <Grid>
            <Box mx={5} boxSizing="border-box">
              <div className="title longTitle">{clientName}</div>
              <span className="floatRight">
                <CloseIcon onClick={() => closeModal()} />
              </span>
            </Box>
          </Grid>
        </Box>

        <Box mx={5}>
          <Box my={5} width={1 / 2} mx="auto" textAlign="center">
            <Grid>
              <span className="displayAvatar">
                {clientName && clientName[0]}
              </span>
            </Grid>
            <Grid mx={5}>
              <Typography noWrap={true} title={clientName}>
                {" "}
                <span className="clientName">{clientName}</span>
              </Typography>
            </Grid>
          </Box>

          <Box my={5}>
            <Grid container>
              <Grid item xs={4} sm={4} className="detailsSection">
                <div className="propName">Payments Made</div>
                <div className="propValue">{paymentsMade || 0}</div>
                <div className="propSubInfo">Last 30 days</div>
              </Grid>
              <Grid item xs={4} sm={4} className="detailsSection">
                <div className="propName">Payees</div>
                <div className="propValue">{suppliersCount || 0}</div>
                <div className="propSubInfo">As of Today</div>
              </Grid>
              <Grid item xs={4} sm={4} className="detailsSection">
                <div className="propName">Active Campaigns</div>
                <div className="propValue">{campaignCount || 0}</div>
                <div className="propSubInfo">As of Today</div>
              </Grid>
            </Grid>
          </Box>
          <Box my={5}>
            {/* {migrateBtnDisabled == true ?
              <CircularProgress color="primary" /> : */}
            <button
              disabled={migrateBtnDisabled}
              style={
                migrateBtnDisabled === true
                  ? {
                      pointerEvents: "none",
                    }
                  : {}
              }
              className={"btnTrans"}
              onClick={(e) => {
                e.target.disabled = true;
                this.setState({ migrateBtnDisabled: true }, () => {
                  client.status && client.status === "Inprogress"
                    ? this.getOnboardingRoute(client)
                    : this.routeToClientDashboard();
                });
              }}
            >
              <div
                className="gotoDashboard"
                onClick={(e) => {
                  e.target.disabled = true;
                  this.setState({ migrateBtnDisabled: true });
                }}
              >
                {client.status && client.status === "Inprogress"
                  ? "Complete client's onboarding."
                  : `Go to ${client.clientName}'s Dashboard.`}
              </div>
            </button>
          </Box>

          <Grid>
            <Grid item xs={12} md={12} lg={12}>
              <Tabs
                orientation="horizontal"
                variant="standard"
                value={selectedTab}
                aria-label="Payment Type"
                textColor="secondary"
                indicatorColor="secondary"
              >
                <Tab
                  onClick={() => this.handleTabChange(0)}
                  label={"Company Information"}
                  disabled={false}
                  color="primary"
                />
                {client.appType === EntityType.B2B && (
                  <Tab
                    onClick={() => this.handleTabChange(1)}
                    label={"Contact Information"}
                    disabled={false}
                  />
                )}
                {/* <Tab
                  onClick={() => this.handleTabChange(2)}
                  label={"Payment Information"}
                  disabled={false}
                /> */}
              </Tabs>
            </Grid>

            <Grid>
              {selectedTab === 0 && (
                <TabPanel value={0} index={0}>
                  <Grid container>
                    <Grid item sm={6} xs={6}>
                      <div className="divMargin">
                        <span className={"key"}>Address</span>
                        <span className={"specialValue"}>
                          {clientLocations &&
                            clientLocations[0] &&
                            `${
                              clientLocations[0]["address1"]
                                ? clientLocations[0]["address1"]
                                : ""
                            }${
                              clientLocations[0]["address1"] &&
                              clientLocations[0]["address1"].length > 0
                                ? ", "
                                : ""
                            }
                        ${
                          clientLocations[0]["address2"]
                            ? clientLocations[0]["address2"]
                            : ""
                        }${
                              clientLocations[0]["address2"] &&
                              clientLocations[0]["address2"].length > 0
                                ? ", "
                                : ""
                            }  
                        ${clientLocations[0]["city"]}${
                              clientLocations[0]["city"] &&
                              clientLocations[0]["city"].length > 0
                                ? ", "
                                : ""
                            }
                        ${
                          clientLocations[0]["stateRegion"] &&
                          clientLocations[0]["stateRegion"].length > 0
                            ? `${clientLocations[0]["stateRegion"]}${
                                clientLocations[0]["countryIso"] ? ", " : ""
                              }`
                            : ""
                        }

                        ${
                          clientLocations[0]["countryIso"]
                            ? clientLocations[0]["countryIso"]
                            : ""
                        }

                        ${
                          clientLocations &&
                          clientLocations[0] &&
                          clientLocations[0]["zipPostal"] &&
                          "-"
                        }
                        ${
                          clientLocations[0]["zipPostal"]
                            ? clientLocations[0]["zipPostal"]
                            : ""
                        }`}
                        </span>
                      </div>
                      <div className="divMargin">
                        <span className={"key"}>Federal Tax ID</span>
                        <span className={"value"}>
                          {taxId &&
                            `${taxId.toString().substring(0, 3)}-${taxId
                              .toString()
                              .substring(3, 5)}-${taxId
                              .toString()
                              .substring(5, 10)}`}
                        </span>
                      </div>{" "}
                      <div className="divMargin">
                        <span className={"key"}>DUNS Number</span>
                        <span
                          className={"value"}
                          style={{ paddingLeft: "0px" }}
                        >
                          {duns &&
                            `${duns.toString().substring(0, 3)}-${duns
                              .toString()
                              .substring(3, 5)}-${duns
                              .toString()
                              .substring(5, 10)}`}
                        </span>
                      </div>
                    </Grid>

                    <Grid item sm={6} xs={6}>
                      <div className="contactAligns">
                        <img src={Phone} alt="Phone" className="svgStyle" />
                        {/* <span className={"key"}>Contact</span> */}
                        <span className={"value"}>
                          {" "}
                          {phoneNumber
                            ? `
                          (${phoneNumber.substring(
                            0,
                            3
                          )})-${phoneNumber.substring(
                                3,
                                6
                              )}-${phoneNumber.substring(6, 10)}`
                            : ""}
                        </span>
                      </div>
                      <div className="contactAligns">
                        <img src={Print} alt="Print" />
                        {/* <span className={"key"}>Fax No.</span> */}
                        <span className={"value"}>{fax}</span>
                      </div>{" "}
                      <div className="contactAligns">
                        <img src={Weblink} alt="Link" />
                        {/* <span className={"key"}>Website</span> */}
                        <span className={"value"}>{website}</span>
                      </div>
                      <div className="contactAligns">
                        <img src={Mail} alt="Mail"/>
                        {/* <span className={"key"}>Email</span> */}
                        <span className={"value"}>
                          <Link color="inherit" href={`mailto:${emailAddress}`}>
                            {emailAddress}
                          </Link>
                        </span>
                      </div>
                    </Grid>
                  </Grid>
                </TabPanel>
              )}
              {selectedTab === 1 && client.appType === EntityType.B2B && (
                <TabPanel value={0} index={0}>
                  <VendorContactInfo
                    id={clientId}
                    getProfileCircleName={this.getProfileCircleName}
                    isPayeeEditable={false}
                  />
                </TabPanel>
              )}
              {/* {selectedTab == 2 && (
                <TabPanel value={0} index={0}>
                  <Grid container>
                    <Grid item sm={6} xs={6}>
                      <div>
                        <span className={"key"}>Address</span>
                        <span className={"value"}>
                          12:, Baker street, NZ - 235534
                        </span>
                      </div>
                      <div>
                        <span className={"key"}>Fedral Tax ID</span>
                        <span className={"value"}>32323232</span>
                      </div>{" "}
                      <div>
                        <span className={"key"}>DUNS Number</span>
                        <span className={"value"}>323232343434</span>
                      </div>
                    </Grid>
                    <Grid item sm={6} xs={6}>
                      <div>
                        <span className={"key"}>Contact</span>
                        <span className={"value"}>434343434343</span>
                      </div>
                      <div>
                        <span className={"key"}>Fax No.</span>
                        <span className={"value"}>434343434434</span>
                      </div>{" "}
                      <div>
                        <span className={"key"}>Website</span>
                        <span className={"value"}>www.rerere.com</span>
                      </div>
                      <div>
                        <span className={"key"}>Email</span>
                        <span className={"value"}>qncv@smail.com</span>
                      </div>
                    </Grid>
                  </Grid>
                </TabPanel>
              )} */}
              {/* </Grid> */}
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }
}

export default connect((state) => ({ ...state.user }))(ClientDetails);
