import {
  Box,
  Grid,
  Paper,
  TextField,
  Typography,
  withStyles,
  Button,
  CircularProgress,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import React, { Component } from "react";
import { connect } from "react-redux";
import Chip from "@material-ui/core/Chip";
import Pagination from "@material-ui/lab/Pagination";
import {
  fetchOnBoardedClients,
  fetchClientsFilterChips,
  fetchClientDetails,
} from "~/redux/helpers/clients";
import AddIcon from "@material-ui/icons/Add";
import styles from "./styles";
import "react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { sendActivationCode } from "~/redux/helpers/ConfigureClientPortal";
import { AlertDialog } from "~/components/Dialogs";
import config from "~/config";
import accessRights from "~/config/accessRights";

import { fetchCompanyData } from "~/redux/helpers/userProfile";
import Options from "./sankeyConfig/options";
import Callback from "./sankeyConfig/callback";

import Highcharts from "highcharts";
import HighchartsSankey from "highcharts/modules/sankey";
import HighchartsReact from "highcharts-react-official";
import "./sankeyConfig/sankey.css";
import "./styles.css";
import {
  getNodeColor,
  getStatusColorFromPoint,
  getStatusColorToPoint,
} from "./sankeyConfig/colors";
import { fetchDashboardSankeyData } from "../../../redux/helpers/clients";
HighchartsSankey(Highcharts);

var H = Highcharts;

H.seriesTypes.sankey.prototype.pointAttribs = function (point, state) {
  var opacity = this.options.linkOpacity,
    color = point.color;

  if (state) {
    opacity = this.options.states[state].linkOpacity || opacity;
    color = this.options.states[state].color || point.color;
  }

  return {
    fill: point.isNode
      ? point.column === 0
        ? "#939393"
        : getNodeColor(point)
      : point.fromNode.column === 0
        ? {
          linearGradient: {
            x1: 0,
            x2: 1,
            y1: 0,
            y2: 0,
          },
          stops: [
            [0, H.color("#939393").setOpacity(0.6).get()],
            [1, H.color(getStatusColorToPoint(point)).setOpacity(0.8).get()],
          ],
        }
        : {
          linearGradient: {
            x1: 0,
            x2: 1,
            y1: 0,
            y2: 0,
          },
          stops: [
            [0, H.color(getStatusColorFromPoint(point)).setOpacity(0.8).get()],
            [1, H.color(getStatusColorToPoint(point)).setOpacity(0.6).get()],
          ],
        },
  };
};

class ListView extends Component {
  state = {
    message: "",
    filterActive: false,
    alertFlag: false,
    rowsPerPage: 4,
    objectPerPage: 12,
    pageNumber: 1,
    filterChips: [],
    selectedVendorId: "",
    selectedChip: -1,
    clients: [],
    selectedClient: {},
    searchText: "",
    viewGrid: false,
    showClientPortal: false,
    showClientModal: false,
    clientName: "",
    filter: -1,
    offset: 0,
    limit: 10,
    totalCount: 0,
    isFetching: false,
    selectedExpansionIndex: null,
    isSankeyLoading: false,
    data: {},
  };

  componentDidMount() {
    this.getListData();
    this.getFilterList();
    if (
      this.props.location &&
      this.props.location._state &&
      this.props.location._state.message &&
      this.props.location._state.type
    ) {
      NotificationManager[this.props.location._state.type](
        this.props.location._state.message,
        this.props.location._state.type === "success" ? "Saved !!" : "Error !!",
        2000
      );
    }
  }

  setDialogMessage(message) {
    this.setState({ message: message, alertFlag: true });
  }

  hideDialogMessage() {
    this.setState({ message: "", alertFlag: false });
  }

  getClientDetails(client) {
    const clientDetails =
      client.status === "Inprogress" ? fetchCompanyData : fetchClientDetails;
    this.setState({ selectedClient: {} }, () => {
      clientDetails({ clientId: client.clientId }).then((response) => {
        if (response.error) {
          this.setDialogMessage(response.message);
          return false;
        }
        this.setState({
          selectedClient:
            client.status === "Inprogress"
              ? { ...response.data.rows[0], status: "Inprogress" }
              : { ...response.data, status: client.status },
          showClientModal: true,
        });
      });
    });
  }

  getClientCircleName(name) {
    let newName = "";
    name.includes(" ")
      ? (newName =
        name &&
        `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`.toUpperCase())
      : (newName = name && `${name[0]}${name[1]}`.toUpperCase());
    return newName;
  }

  getFilterList() {
    fetchClientsFilterChips().then((response) => {
      if (response.error) {
        this.setDialogMessage(response.message);
        return false;
      } else {
        this.setState({ filterChips: response.data });
      }
    });
  }

  searchData(e) {
    const { viewGrid, selectedChip } = this.state;
    const limit = viewGrid ? 9 : 10;
    this.setState(
      {
        searchText: e.target.value,
        clientName: e.target.value,
        pageNumber: 1,
        offset: 0,
        limit: limit,
        filter: selectedChip,
        selectedExpansionIndex: null,
      },
      () => this.getListData()
    );
  }

  getSankeyChartData = () => {
    const { selectedEntityClientId } = this.state;
    const reportType = "ALL";
    this.setState({ isSankeyLoading: true }, () => {
      fetchDashboardSankeyData(selectedEntityClientId, "-1", reportType).then(
        (res) => {
          if(!res || res.error){
            this.setDialogMessage(res.message || 'Oops! Something went wrong.')
            this.setState({ isSankeyLoading: false });
          return false;
          }else if (res) {
            this.setState({
              data: res && res["data"],
              isSankeyLoading: false,
            });
          }
        }
      );
    });
  };

  getListData() {
    const { filter, offset, clientName, viewGrid } = this.state;
    const limit = viewGrid ? 9 : 10;
    const { portalProfileId} = this.props.user.info;
    const payerTypeId = [1]; //FSINPAYB2B-14087: 1 for b2b user
    this.setState({ isFetching: true }, () => {
      fetchOnBoardedClients(
        {
          portalProfileId,
          filter,
          limit,
          offset,
          appType:1,
          clientName,
          payerTypeId
        }
      ).then((response) => {
        if (response.error) {
          this.setDialogMessage(response.message);
          this.setState({ isFetching: false });
          return false;
        }
        this.setState({
          clients: response.data.clients,
          totalCount: response.data.totalCount,
          isFetching: false,
        });
      });
    });
  }

  handlePageChange(pageNumber) {
    const { viewGrid, searchText, selectedChip } = this.state;
    const limit = viewGrid ? 9 : 10;
    this.setState(
      {
        pageNumber,
        offset: (pageNumber - 1) * limit,
        limit: limit,
        clientName: searchText,
        filter: selectedChip,
        selectedExpansionIndex: null,
      },
      () => this.getListData()
    );
  }

  onClickClientDetails(e, clientId) {
    this.props.history.push(`/clients/clientDetail/${clientId}`);
  }

  handleChip(key) {
    const { viewGrid, searchText } = this.state;
    const limit = viewGrid === true ? 9 : 10;
    this.setState(
      {
        selectedChip: key,
        clientName: searchText,
        pageNumber: 1,
        offset: 0,
        limit: limit,
        selectedVendorId: null,
        filter: key,
      },
      () => this.getListData()
    );
  }

  gotoPermissionPage = () => {
    const { selectedVendorId } = this.state;
    const userId = selectedVendorId;
    this.props.history.push({
      pathname: `/clients/clientPermissions/${userId}`,
      search: "?update=true",
    });
  };

  gotoOnboardclient = () => {
    this.props.history.push({
      pathname: `/clientOnboard/OnboardType`,
    });
  };

  async resendActivationCode() {
    const { selectedVendorId } = this.state;
    const userId = selectedVendorId;
    const data = {
      clientId: userId,
      isVerified: 0,
    };
    try {
      const resp = await sendActivationCode(data);
      if (resp) {
        const { error = true, message, data: respData } = resp.data || {};
        if (error) {
          NotificationManager.error(
            message || "Resend Activation Code failed",
            "Error !!",
            2000
          );
        } else {
          NotificationManager.success(
            "Resend Activation Code sent successfully",
            "Sent !!",
            2000
          );
        }
      } else {
        NotificationManager.error(
          "Resend Activation Code failed",
          "Error !!",
          2000
        );
      }
    } catch (error) {
      NotificationManager.error(
        error || "Resend Activation Code failed",
        "Error !!",
        2000
      );
    }
  }

  showClientData() {
    this.setState({ showClientPortal: true });
  }

  render() {
    const {
      alertFlag,
      message,
      clients,
      pageNumber,
      filterChips,
      selectedChip,
      filterActive,
      totalCount,
      isFetching,
      limit,
      selectedExpansionIndex,
      data,
      isSankeyLoading,
    } = this.state;

    const { classes, permissions } = this.props;

    const count = Math.ceil(Number((totalCount / limit)));
    const claims = permissions.minified;
    const isCampaignAddAllowed =
      (claims && claims.includes(accessRights["CAMPAIGNS_ADD"])) || false;

    const campaignSupplierObj =
      data &&
      data["numberOfSupplier"] &&
      data["numberOfSupplier"].filter((obj) => obj["key"] === "campaign");
    const statusSupplierObj =
      data &&
      data["numberOfSupplier"] &&
      data["numberOfSupplier"].filter((obj) => obj["key"] === "status");
    const methodSupplierObj =
      data &&
      data["numberOfSupplier"] &&
      data["numberOfSupplier"].filter((obj) => obj["key"] === "paymentMethod");

    return (
      <Grid className={classes.root}>
        <Box my={0} mx={6}>
          <Box my={5} py={1}>
            {isCampaignAddAllowed && (
              <Box
                mt={-5}
                mb={2}
                mx={1}
                display="flex"
                justifyContent="flex-end"
              >
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.mainButton}
                  onClick={() =>
                    this.props.history.push(
                      `${config.baseName}/campaign/launch`
                    )
                  }
                  startIcon={<AddIcon />}
                >
                  LAUNCH CAMPAIGN
                </Button>
              </Box>
            )}
            <Paper>
              <Box p={2}>
                <Grid container style={{ marginTop: "-3px" }}>
                  <Grid item mx={9} sm={9}>
                    <Grid
                      container
                      item
                      xs={12}
                      md={12}
                      justify="flex-end"
                      className={classes.gridItem}
                    >
                      <Box display="flex" justifyContent="flex-end">
                        <Box p={1}>
                          <Button
                            color="primary"
                            aria-label="View"
                            title="Filters"
                            component="span"
                            className={classes.smallBtn}
                            startIcon={
                              <img
                                src={require(`~/assets/icons/icon_filter.svg`)}
                                width="14"
                                alt={"View Filter"}
                                className={classes.imgIcon}
                              />
                            }
                            onClick={() => {
                              this.setState({
                                filterActive: !filterActive,
                              });
                            }}
                          >
                            <b> Filters</b>
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid item xs={3} style={{ marginTop: "3px" }}>
                    <Box mx={2}>
                      <TextField
                        fullWidth={true}
                        variant="outlined"
                        placeholder="Search client name.."
                        onChange={this.searchData.bind(this)}
                        size="small"
                      />
                    </Box>
                  </Grid>
                </Grid>

                {filterActive && (
                  <Grid
                    container
                    item
                    xs={12}
                    md={12}
                    justify="flex-start"
                    className={classes.gridItem}
                  >
                    <Box
                      my={1.5}
                      display="flex"
                      width="100%"
                      justifyContent="flex-start"
                    >                      
                      {filterChips &&
                        filterChips.map((chip) => (
                          <Box mx={1}>
                            <Chip
                              color={
                                selectedChip == chip.filterKey ? "primary" : ""
                              }
                              clickable
                              label={`${chip.roleName} (${chip.count})`}
                              onClick={() => this.handleChip(chip.filterKey)}
                            />
                          </Box>
                        ))}
                    </Box>
                  </Grid>
                )}
              </Box>
            </Paper>
          </Box>

          <Grid container item xs={12} md={12} className={classes.gridItem}>
            <Paper className={classes.root}>
              <Grid>
                {!isFetching ? (
                  <Grid>
                    {clients &&
                      clients.map((vendor, i) => (
                        <Box px={4} pb={3}>
                          <ExpansionPanel
                            className="accPanel"
                            expanded={
                              selectedExpansionIndex == i ? true : false
                            }
                          >
                            <ExpansionPanelSummary
                              expandIcon={
                                <ArrowDropDownIcon
                                  style={{ color: "rgb(0, 45, 114)" }}
                                />
                              }
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                              style={{ borderBottom: "none" }}
                              className="checkboxGroupContainer"
                              key={""}
                              name={""}
                              checkBoxLabel={false}
                              checked={false}
                              onClick={(e) => {
                                if (selectedExpansionIndex == i) {
                                  this.setState({
                                    selectedExpansionIndex: null,
                                  });
                                } else {
                                  this.setState(
                                    {
                                      selectedExpansionIndex: i,
                                      selectedEntityClientId:
                                        vendor && vendor.clientId,
                                    },
                                    () => this.getSankeyChartData()
                                  );
                                }
                              }}
                            >
                              <Typography className="accheading">
                                {vendor && vendor.clientName}
                              </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails
                              style={{ backgroundColor: "white" }}
                            >
                              <Grid container direction="row">
                                <Grid item xs={12}>
                                  <Box>
                                    {!isSankeyLoading ? (                                      
                                      <Box
                                        display="flex"
                                        justifyContent="center"
                                      >
                                        {data.mapping &&
                                          data.mapping["length"] > 0 ? (
                                          <Box>
                                            <HighchartsReact
                                              allowChartUpdate={true}
                                              immutable={false}
                                              updateArgs={[true, true, true]}
                                              containerProps={{
                                                className: "chartContainer",
                                              }}
                                              highcharts={Highcharts}
                                              callback={(chart) =>
                                                Callback(chart, data)
                                              }
                                              options={Options(data)}
                                            />
                                            <Box
                                              display="flex"
                                              justifyContent="space-between"
                                              mr={5}
                                              ml={8}
                                              my={4}
                                              style={{ fontSize: "15px" }}
                                            >
                                              <span>
                                                Of{" "}
                                                {campaignSupplierObj &&
                                                  campaignSupplierObj[0] &&
                                                  campaignSupplierObj[0][
                                                  "count"
                                                  ]}{" "}
                                                payees
                                              </span>
                                              <span>
                                                Of{" "}
                                                {statusSupplierObj &&
                                                  statusSupplierObj[0] &&
                                                  statusSupplierObj[0][
                                                  "count"
                                                  ]}{" "}
                                                payees
                                              </span>
                                              <span>
                                                Of{" "}
                                                {methodSupplierObj &&
                                                  methodSupplierObj[0] &&
                                                  methodSupplierObj[0][
                                                  "count"
                                                  ]}{" "}
                                                payees
                                              </span>
                                            </Box>
                                          </Box>
                                        ) : (
                                          <Box width={1} my={6}>
                                            <Box
                                              display="block"
                                              textAlign="center"
                                            >
                                              <img
                                                alt="no-data"
                                                src={require("~/assets/images/nodata.svg")}
                                              />
                                              <Box
                                                py={3}
                                                color="#A1A1A1"
                                                fontSize={14}
                                                display="block"
                                              >
                                                {" "}
                                                No Data to Show{" "}
                                              </Box>
                                            </Box>
                                          </Box>
                                        )}
                                      </Box>
                                    ) : (
                                      <Box>
                                        <CircularProgress color="primary" />
                                      </Box>
                                    )}
                                  </Box>
                                </Grid>
                              </Grid>
                            </ExpansionPanelDetails>
                          </ExpansionPanel>
                        </Box>
                      ))}
                  </Grid>
                ) : (
                  <Box display="flex" justifyContent="center">
                    <CircularProgress color="primary" />
                  </Box>
                )}
              </Grid>
              <Paper>
                <Box py={2} display="flex" justifyContent="flex-end">
                  <Pagination
                    count={count}
                    defaultPage={pageNumber}
                    page={pageNumber}
                    onChange={(e, page) => this.handlePageChange(page)}
                  />
                </Box>
              </Paper>
            </Paper>
          </Grid>

          <NotificationContainer />
        </Box>

        {alertFlag && (
          <AlertDialog
            title={message}
            onConfirm={this.hideDialogMessage.bind(this)}
          />
        )}
      </Grid>
    );
  }
}

export default connect((state) => ({
  ...state.user,
  ...state.clientConfig,
  ...state.permissions,
}))(withStyles(styles)(ListView));
