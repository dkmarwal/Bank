import React from "react";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  Paper,
  Input,
  Button,
  IconButton,
  Select,
  Checkbox,
  MenuItem,
  ListItemText,
  CircularProgress,
  Typography,
  InputLabel,
  FormControl, FormHelperText,
} from "@material-ui/core";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { AlertDialog } from "~/components/Dialogs";
import { withStyles } from "@material-ui/styles";
import EventIcon from "@material-ui/icons/Event";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";

import ReportsFilter from "~/components/Dialogs/reports/";
import DateFilter from "~/modules/Reports/DateFilter/";

import TextField from "~/components/Forms/TextField";

import {
  getClientsList,
  getCampaignList,
  fetchReportFilter,
  getFrequencyList,
  downloadStaticReport,
  downloadFileProcessingStaticReport,
  updateReportSubscription,
} from "~/redux/actions/reports";

import styles from "./styles";
import moment from "moment";
import config from "~/config";

import accessRights from "~/config/accessRights";

// import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

class ReportView extends React.Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;
    this.state = {
      data: state && state.report,
      isLoading: true,
      showFilter: false,
      filterList: [],
      selectedDateFilter: 1,
      startDate: null,
      endDate: null,
      filterListProgress: false,
      validation: {},
      isSubscriber:
        state && state.report && state.report.subscription == 1 ? true : false,
      selectedClient: [],
      selectedCampaign: [],
      subscriptionFrequencyList: [],
      emailSubscriptionFrequencyId:
        (state && state.report && state.report.frequency) || null,
      emailSubscriptionFrequency:
        (state && state.report && state.report.frequency) || null,
      frequencyId: (state && state.report && state.report.frequencyId) || null,
      downloadProgress: false,
      frequencyListProgress: false,
      campaignList: [],
      clientList: [],
    };
  }

  componentDidMount = async () => {
    //todo: remove
    // const defaultFromDate = moment(
    //   new Date().setDate(new Date().getDate() - 30)
    // );
    // const defaultToDate = moment(new Date());
    //By Default set today date
    //this.setState({startDate: defaultFromDate, endDate: defaultToDate});
    this.getFilterList();
    //this.getCampaignList();

    this.fetchFrequencyList();
    this.fetchClientsList();
    //console.log(this.state.data)
  };

  resetFilter = () => {
    this.setState(
      {
        selectedDateFilter: 1,
        startDate: null,
        endDate: null,
      },
      () => {
        //this.getReportData();
      }
    );
  };

  applyFilter = () => {
    this.setState(
      {
        showFilter: false,
      },
      () => {
        //this.getReportData();
      }
    );
  };

  hideFilter = () => {
    this.setState({
      showFilter: false,
      selectedDateFilter: 1,
      startDate: null,
      endDate: null,
    });
  };

  getFilterList = () => {
    const { reportType } = this.state;

    this.setState(
      {
        filterListProgress: true,
      },
      () => {
        const { info } = this.props.user;
        this.props
          .dispatch(
            fetchReportFilter({
              reportType,
              userId: info.userId,
              portalProfileId: info.portalProfileId,
              portalTypeId: info.portalTypeId,
            })
          )
          .then((response) => {
            if (!response) {
              this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: this.props.report.error,
                filterListProgress: false,
              });
              return false;
            }

            this.setState({
              filterListProgress: false,
              filterList: this.props.report.filterList,
            });
          });
      }
    );
  };

  fetchClientsList = () => {
    const { info } = this.props.user;
    const {data} = this.state;
    let appType = undefined;//For B2B user reports
    if (data && (data.reportCode == "enrollmentSummary" || data.reportCode =="dailyEnrollment")){
      appType = 1;
    }
    this.props
      .dispatch(getClientsList({appType:appType, reportCode:data.reportCode}))
      .then((response) => {
        if (!response) {
          this.setState({
            alertMessage: this.props.report.error,
            alertType: "error",
            alertMessageCallbackType: null,
          });
          return false;
        }
        this.setState({
          clientList: this.props.report.clientList,
        });
      });
  };

  getCampaignList = () => {
    const { selectedClient, selectedCampaign } = this.state;
    
    this.setState(
      {
        campaignListProgress: true,
      },
      () => {
        const { info } = this.props.user;
        this.props
          .dispatch(
            getCampaignList({
              userId: info.userId,
              portalProfileId: info.portalProfileId,
              portalTypeId: info.portalTypeId,
              selectedClient: selectedClient,
            })
          )
          .then((response) => {
            if (!response) {
              this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: this.props.report.error,
                campaignListProgress: false,
              });
              return false;
            }
            const listCampaign = this.props.report.campaignList;
            let newSelected = [];
            selectedCampaign.map((item) => listCampaign.some(c => c.campaignId === item) ? newSelected.push(item) : newSelected);
            this.setState({
              campaignListProgress: false,
              campaignList: this.props.report.campaignList,
              selectedCampaign: newSelected,
            });
          });
      }
    );
  };

  fetchFrequencyList = () => {

    this.setState(
      {
        frequencyListProgress: true,
      },
      () => {
        this.props.dispatch(getFrequencyList()).then((response) => {
          if (!response) {
            this.setState({
              alertType: "error",
              alertMessageCallbackType: null,
              alertMessage: this.props.report.error,
              frequencyListProgress: false,
            });
            return false;
          }

          this.setState({
            frequencyListProgress: false,
            subscriptionFrequencyList: this.props.report.frequencyList,
          });
        });
      }
    );
  };

  handleDateChange = (fieldName, date) => {
    switch (fieldName) {
      case "startDate":
        this.setState({ startDate: date });
        break;
      case "endDate":
        this.setState({ endDate: date });
        break;
      default:
        break;
    }
  };

  handleChange = (field, event, value, position) => {
    const {
      selectedPaymentParameters,
      data,
    } = this.state;

    switch (field) {
      case "name":
        const reportName = event.target.value;
        this.setState({ name: reportName });
        break;
      case "client":
        const { value: clients } = event.target;
        this.setState({ selectedClient: clients }, () => {
          //get campaign list base on selected clients
          if (data && data.reportCode == "enrollmentSummary") {
            this.getCampaignList();
          }
        });
        break;
      case "campaign":
        const { value: campaigns } = event.target;
        this.setState({ selectedCampaign: campaigns });
        break;

      case "selectedDateFilter":
        let FromDate = new Date();
        let ToDate = new Date();
        switch (value) {
          case 1:
            FromDate = null;
            ToDate = null;
            break;
          case 3:
            FromDate.setMonth(FromDate.getMonth() - 1);
            ToDate.setMonth(ToDate.getMonth() - 1);
            FromDate.setDate(1);
            ToDate.setFullYear(ToDate.getFullYear(), ToDate.getMonth() + 1, 0);
            break;
          case 4:
            FromDate.setMonth(FromDate.getMonth() - 4);
            ToDate.setMonth(ToDate.getMonth() - 1);
            FromDate.setDate(1);
            ToDate.setFullYear(ToDate.getFullYear(), ToDate.getMonth() + 1, 0);
            break;
          case 5:
            FromDate.setFullYear(new Date().getFullYear() - 1, 0, 1);
            ToDate.setFullYear(new Date().getFullYear(), 0, 0);
            break;
          case 6:
            FromDate.setDate(new Date().getDate() - 7);
            break;
          case 7:
            FromDate.setDate(new Date().getDate() - 30);
            break;
          default:
            break;
        }
        this.setState({
          selectedDateFilter: value,
          startDate: FromDate,
          endDate: ToDate,
        });
        break;
      case "paymentParameter":
        //this.setState({selectedPaymentParameters: [...selectedPaymentParameters, value ]});
        if (position) {
          this.setState({
            selectedPaymentParameters: [...selectedPaymentParameters, value],
          });
        } else {
          const newSelectedPaymentParameters =
            selectedPaymentParameters &&
            selectedPaymentParameters.filter((item, index) => item != value);
          this.setState({
            selectedPaymentParameters: [...newSelectedPaymentParameters],
          });
        }
        break;
      case "emailSubscriptionFrequency":
        const emailSubscriptionFrequencyId = event.target.value;
        this.setState({
          emailSubscriptionFrequencyId: emailSubscriptionFrequencyId,
        });
        break;
      default:
        break;
    }
  };

  handleDownload = (item) => {
    const {
      startDate,
      endDate,
      selectedCampaign,
      selectedClient,
    } = this.state;
    const fromDate = startDate && startDate instanceof Date && !isNaN(startDate) ? moment(startDate).format("YYYY-MM-DD") : null;
    const toDate = endDate ? moment(endDate).format("YYYY-MM-DD") : null;

    let valid = {};

    if (item && item.reportCode == "enrollmentSummary") {
      if (selectedCampaign && selectedCampaign.length == 0) {
        valid["campaign"] = "Please select at least one campaign";
      }
      if (selectedClient && selectedClient.length == 0) {
        valid["client"] = "Please select at least one client";
      }

      if ((selectedCampaign && selectedCampaign.length == 0) || (selectedClient && selectedClient.length == 0)) {
        this.setState({ validation: { ...valid } });
        return false;
      }
      //} else if (item && (item.reportCode == "totalPayee" || item.reportCode == "DailyPaymentStatusReport")) {
    } else if (item && (item.reportCode == "totalPayee")) {

      if (!startDate) {
        valid["startDate"] = "Please select any date";
      }
      if (selectedClient.length == 0) {
        valid["client"] = "Please select at least one client";
      }
      if (!startDate || selectedClient.length == 0) {
        this.setState({ validation: { ...valid } });
        return false;
      }
    }else if (item && (item.reportCode == "PaymentsDailyStatusCC")) {
      if (selectedClient.length == 0) {
        valid["client"] = "Please select at least one client";
      }
      if (!fromDate) {
        valid["startDate"] = "Please select a valid date";
        this.setState({ validation: { ...valid } });
        return false;
      }
    } else {
      if (!startDate) {
        valid["startDate"] = "Please select any date";
      }

      if (!startDate) {
        this.setState({ validation: { ...valid } });
        return false;
      }
    }

    this.setState(
      {
        downloadProgress: true,
        validation: {},
      },
      () => {
        const { info } = this.props.user;
        const filename = item.reportCode + (fromDate ? fromDate : "") + ".xlsx";
        if (
          item.reportCode == "DailyAllClientPayments" ||
          item.reportCode == "PaymentsMonthlyStatus" || item.reportCode == "DailyPaymentStatusReport" ||
          item.reportCode == "PaymentsDailyStatusCC"
        ) {
          this.props
            .dispatch(
              downloadFileProcessingStaticReport({
                portalProfileId: info.portalProfileId,
                startDate: fromDate,
                endDate: toDate,
                reportCode: item.reportCode,
                format: "xlsx",
                clientIds: selectedClient.join()
              })
            )
            .then((response) => {
              if (!response) {
                this.setState({
                  alertType: "error",
                  alertMessageCallbackType: null,
                  alertMessage: this.props.report.error,
                  downloadProgress: false,
                });
                return false;
              }

              this.setState({
                downloadProgress: false,
                alertType: "success",
                alertMessageCallbackType: null,
                alertMessage: "Your file will get downloaded shortly",
              });

              const type = response.headers["content-type"];
              const data = new Blob([response.data], {
                type: type,
                encoding: "UTF-8",
              });
              FileSaver.saveAs(data, filename);
            });
        } else {
          const { info } = this.props.user;
          this.props
            .dispatch(
              downloadStaticReport({
                portalProfileId: info.portalProfileId,
                clientIds: selectedClient,
                campaignIds: selectedCampaign,
                startDate: fromDate,
                endDate: toDate,
                reportCode: item.reportCode,
                format: "xlsx",
              })
            )
            .then((response) => {
              if (!response) {
                this.setState({
                  alertType: "error",
                  alertMessageCallbackType: null,
                  alertMessage: this.props.report.error,
                  downloadProgress: false,
                });
                return false;
              }

              this.setState({
                downloadProgress: false,
              });

              const type = response.headers["content-type"];
              const data = new Blob([response.data], {
                type: type,
                encoding: "UTF-8",
              });
              FileSaver.saveAs(data, filename);
            });
        }
      }
    );
  };

  handleSubscription = (item) => {
    const {
      isSubscriber,
      emailSubscriptionFrequency,
      subscriptionFrequencyList,
      frequencyId
    } = this.state;
    const filterFrequencyInfo =
      subscriptionFrequencyList.filter(
        (frequencyItem) => frequencyItem.description == emailSubscriptionFrequency
      ) || [];
    this.setState(
      {
        subscriptionProgress: true,
      },
      () => {
        const { info } = this.props.user;
        const data = {
          portalProfileId: info.portalProfileId,
          subscription: !isSubscriber,
          bankReportId: item.bankReportId,
          frequency: emailSubscriptionFrequency,
          frequencyId: filterFrequencyInfo && filterFrequencyInfo[0] && filterFrequencyInfo[0].subscriptionTypeId || frequencyId,
          reportCode: item.reportCode,
          dataType: item.dataType
        };
        this.props
          .dispatch(
            updateReportSubscription(data)
          )
          .then((response) => {
            if (!response) {
              this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: this.props.report.error,
                subscriptionProgress: false,
              });
              return false;
            }

            this.setState({
              subscriptionProgress: false,
              isSubscriber: !isSubscriber,
              alertMessageCallbackType: null,
              alertMessage: !isSubscriber
                ? "Report subscribed successfully."
                : " Report unsubscribed successfully.",
            });

            this.props.history.push({
              pathname: `${config.baseName}/reports/view`,
              state: {
                report: { ...item, subscription: isSubscriber ? 0 : 1 },
              },
            });
          });
      }
    );
  };

  handleFrequency = (item, event) => {
    const { isSubscriber, subscriptionFrequencyList } = this.state;
    const frequencyId = event.target.value;
    const filterFrequencyInfo =
      subscriptionFrequencyList.filter(
        (frequencyItem) => frequencyItem.description == frequencyId
      ) || [];
    const frequencyInfo = filterFrequencyInfo && filterFrequencyInfo[0];

    this.setState(
      {
        subscriptionProgress: true,
      },
      () => {
        const { info } = this.props.user;
        const data1 = {
          portalProfileId: info.portalProfileId,
          subscription: isSubscriber,
          bankReportId: item.bankReportId,
          frequency: frequencyInfo && frequencyInfo.description,
          frequencyId: frequencyId,
          reportCode: item.reportCode,
          dataType: item.dataType
        };
        this.props
          .dispatch(
            updateReportSubscription(data1)
          )
          .then((response) => {
            if (!response) {
              this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: this.props.report.error,
                subscriptionProgress: false,
              });
              return false;
            }

            this.setState({
              subscriptionProgress: false,
              emailSubscriptionFrequencyId: frequencyId,
              emailSubscriptionFrequency:
                (frequencyInfo && frequencyInfo.description) || item.frequency,
              alertMessageCallbackType: null,
              alertMessage:
                "Report subscription frequency changed successfully.",
            });

            this.props.history.push({
              pathname: `${config.baseName}/reports/view`,
              state: {
                report: {
                  ...item,
                  frequency:
                    (frequencyInfo && frequencyInfo.description) ||
                    item.frequency,
                },
              },
            });
          });
      }
    );
  };

  handleCancel = () => {
    this.props.history.push(`${config.baseName}/reports`);
  };

  hideAlertMessage = () => {
    this.setState({
      alertMessage: null,
      alertType: null,
      alertMessageCallbackType: null,
    });
  };

  render() {
    const {
      alertMessage,
      alertMessageCallbackType,
      clientList,
      selectedClient,
      selectedCampaign,
      campaignList,
      downloadProgress,
      subscriptionFrequencyList,
      emailSubscriptionFrequencyId,
      emailSubscriptionFrequency,
      isSubscriber,
      data,
      showFilter,
      filterList,
      selectedDateFilter,
      startDate,
      endDate,
      filterListProgress,
      validation,
    } = this.state;
    const { classes, user, permissions } = this.props;

    const claims = permissions.minified;

    const isReportDownloadEnabled =
      (claims && claims.includes(accessRights["REPORTS_DOWNLOAD"])) || false;
    const isReportSubscribeEnabled =
      (claims && claims.includes(accessRights["REPORTS_SUBSCRIBE"])) || false;

    const canSubscribe =
      (data && data.reportCode === "enrollmentSummary" || data && data.reportCode==="PaymentsDailyStatusCC") ? false : true;
    const showYearMonth =
      data && data.reportCode === "PaymentsMonthlyStatus" ? true : false;

    const showClientList = data && (data.reportCode === "enrollmentSummary" ||
      //data.reportCode == "totalPayee" || data.reportCode == "dailyEnrollment" || data.reportCode =="DailyPaymentStatusReport")
      data.reportCode === "totalPayee" || data.reportCode === "dailyEnrollment" || data.reportCode === "PaymentsDailyStatusCC")
      ? true
      : false;

    let newsubscriptionFrequencyList = [];
    switch (data.reportCode) {
      case "totalPayeeReport":
        newsubscriptionFrequencyList = subscriptionFrequencyList.filter(
          (item) => item.subscriptionTypeId !== 2
        );
        break;
      default:
        newsubscriptionFrequencyList = subscriptionFrequencyList.filter(
          (item) => item.description === emailSubscriptionFrequencyId
        );
        break;
    }

    return (
      <Grid container justify="center" className={classes.root}>
        <Grid item container xs={12}>
          <Paper className={classes.paper} square>
            <Grid container justify="center">
              <Grid item xs={12} sm={12} className={classes.gridItem}>
                <Box p={1}>
                  <Typography variant="h1">{data.reportName}</Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid container justify="flex-start">
              <Grid item xs={9} sm={9} className={classes.gridItem}>
                <Box display="flex" justifyContent="flex-start">
                  <Box pl={2}>
                    <Grid item xs={12} sm={12} className={classes.gridItem}>
                      <Box
                        pt={1}
                        display="flex"
                        justifyContent="flex-start"
                        flexDirection="column"
                      >
                        <Box pl={2}>
                          <Typography variant="h2">Report Type</Typography>
                        </Box>
                        <Box pl={3}>{data.dataType}</Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} className={classes.gridItem}>
                      <Box
                        pt={1}
                        display="flex"
                        justifyContent="flex-start"
                        flexDirection="column"
                      >
                        <Box pl={2}>
                          <Typography variant="h2">Report Frequency</Typography>
                        </Box>
                        <Box pl={3}>{emailSubscriptionFrequency}</Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} className={classes.gridItem}>
                      <Box display="flex" width="100%" flexDirection="column">
                        {isReportSubscribeEnabled && canSubscribe && (
                          <Box p={1} display="flex" justifyContent="flex-start">
                            <IconButton
                              color="primary"
                              aria-label={
                                isSubscriber === true
                                  ? "UNSUBSCRIBE"
                                  : "SUBSCRIBE"
                              }
                              title={
                                isSubscriber === true
                                  ? "UNSUBSCRIBE"
                                  : "SUBSCRIBE"
                              }
                              component="span"
                              className={classes.smallBtn}
                              onClick={(event) => this.handleSubscription(data)}
                            >
                              {isSubscriber === true ? (
                                <RemoveCircleOutlineIcon
                                  size="small"
                                  className={classes.smallIcon}
                                />
                              ) : (
                                <AddCircleOutlineIcon
                                  size="small"
                                  className={classes.smallIcon}
                                />
                              )}
                              <Typography
                                variant="h6"
                                className={classes.iconText}
                              >
                                {isSubscriber === true
                                  ? "UNSUBSCRIBE"
                                  : "SUBSCRIBE"}
                              </Typography>
                            </IconButton>
                          </Box>
                        )}
                        {isReportSubscribeEnabled && canSubscribe &&
                          isSubscriber &&
                          newsubscriptionFrequencyList.length > 0 && (
                            <Box
                              p={1}
                              pl={2}
                              // display="flex"
                              justifyContent="flex-start"
                            >
                              <TextField
                                label="Email Subscription Frequency"
                                fullWidth={true}
                                size="small"
                                style={{ width: "300px" }}
                                select
                                value={emailSubscriptionFrequencyId || ""}
                                autoComplete="off"
                                variant="outlined"
                                name="emailSubscriptionFrequency"
                                onChange={(event) =>
                                  this.handleFrequency(data, event)
                                }
                              >
                                {newsubscriptionFrequencyList ? (
                                  newsubscriptionFrequencyList.map((option) => (
                                    <MenuItem
                                      key={option.subscriptionTypeId}
                                      value={option.description}
                                    >
                                      {option.description}
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
                          )}
                      </Box>
                    </Grid>
                  </Box>
                </Box>
              </Grid>
              {isReportDownloadEnabled && (
                <Grid item xs={3} sm={3} className={classes.gridItem}>
                  <Box
                    display="flex"
                    justifyContent="flex-start"
                    flexDirection="column"
                  >
                    { (data.reportCode==="PaymentsDailyStatusCC" || (canSubscribe && !showYearMonth)) && (
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Box display="flex">
                          <Box p={2}>
                            <KeyboardDatePicker
                              autoOk={true}
                              clearable={true}
                              views={["year", "month", "date"]}
                              disableToolbar
                              variant="inline"
                              format="MM/dd/yyyy"
                              margin="normal"
                              id="startDate"
                              className={classes.dateBox}
                              name="startDate"
                              label="Select Report Date"
                              value={startDate}
                              maxDate={moment().subtract(1, "days")}
                              error={validation && validation.startDate}
                              helperText={validation && validation.startDate}
                              onChange={(date) => {
                                this.setState({ startDate: date });
                              }}
                              KeyboardButtonProps={{
                                "aria-label": "Start Date",
                              }}
                            />
                          </Box>
                        </Box>
                      </MuiPickersUtilsProvider>
                    )}

                    {canSubscribe && showYearMonth && (
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Box display="flex">
                          <Box p={2}>
                            <KeyboardDatePicker
                              autoOk={true}
                              clearable={true}
                              openTo="year"
                              views={["year", "month"]}
                              disableToolbar
                              variant="inline"
                              margin="normal"
                              id="startDate"
                              name="startDate"
                              label="Select Report Date"
                              value={startDate}
                              maxDate={moment().subtract(1, "days")}
                              error={validation && validation.startDate}
                              helperText={validation && validation.startDate}
                              onChange={(date) => {
                                this.setState({ startDate: date });
                              }}
                              KeyboardButtonProps={{
                                "aria-label": "Start Date",
                              }}
                            />
                          </Box>
                        </Box>
                      </MuiPickersUtilsProvider>
                    )}
                    {showClientList && (
                      <Box p={1} display="flex">
                        <FormControl className={classes.formControl}>
                          <InputLabel id="client">Select Client</InputLabel>
                          <Select
                            multiple
                            required
                            id="client"
                            label={"Select Client"}
                            className={classes.maxwidthInput}
                            input={<Input />}
                            error={validation && validation.client || ""}
                            helperText={validation && validation.client || ""}
                            fullWidth={true}
                            value={selectedClient || []}
                            autoComplete="off"
                            variant="selectedMenu"
                            name="client"
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  overflow: "auto",
                                  width: "400px",
                                },
                              },
                            }}
                            onChange={(event) =>
                              this.handleChange("client", event)
                            }
                            renderValue={(selected) => {
                              if (selected.length === 1) {
                                const selectedRole =
                                  clientList &&
                                  clientList.filter(
                                    (client) => client.clientId == selected[0]
                                  );
                                return (
                                  <em className={classes.locations}>
                                    {(clientList.length &&
                                      selectedRole.length &&
                                      selectedRole[0].clientName) ||
                                      ""}
                                  </em>
                                );
                              }

                              return `Multiple (${selected.length} Clients)`;
                            }}
                          >
                            {clientList ? (
                              clientList.map((option) => (
                                <MenuItem
                                  key={option.clientId}
                                  value={option.clientId}
                                >
                                  <Checkbox
                                    checked={
                                      selectedClient.indexOf(option.clientId) >
                                      -1
                                    }
                                  />
                                  <ListItemText primary={option.clientName} />
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
                          </Select>
                          <FormHelperText style={{ color: "red" }}>{validation && validation.client || ""}</FormHelperText>
                        </FormControl>
                      </Box>
                    )}
                    {data && data.reportCode == "enrollmentSummary" && (
                      <Box p={1} display="flex">
                        <FormControl className={classes.formControl}>
                          <InputLabel id="campaign">Select Campaign</InputLabel>
                          <Select
                            multiple
                            required
                            id="campaign"
                            label={"Select Campaign"}
                            className={classes.maxwidthInput}
                            input={<Input />}
                            error={validation && validation.campaign}
                            helperText={validation && validation.campaign}
                            fullWidth={true}
                            value={selectedCampaign || []}
                            autoComplete="off"
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  overflow: "auto",
                                  maxWidth: "400px",
                                },
                              },
                            }}
                            variant="selectedMenu"
                            name="campaign"
                            onChange={(event) =>
                              this.handleChange("campaign", event)
                            }
                            renderValue={(selected) => {
                              if (selected.length === 1) {
                                const selectedRole =
                                  campaignList &&
                                  campaignList.filter(
                                    (campaigns) =>
                                      campaigns.campaignId == selected[0]
                                  );
                                return (
                                  <em className={classes.locations}>
                                    {(campaignList.length &&
                                      selectedRole.length &&
                                      selectedRole[0].campaignName) ||
                                      ""}
                                  </em>
                                );
                              }

                              return `Multiple (${selected.length} Campaigns)`;
                            }}
                          >
                            {campaignList ? (
                              campaignList.map((option) => (
                                <MenuItem
                                  key={option.campaignId}
                                  value={option.campaignId}
                                >
                                  <Checkbox
                                    checked={
                                      selectedCampaign.indexOf(
                                        option.campaignId
                                      ) > -1
                                    }
                                  />
                                  <ListItemText primary={option.campaignName} />
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
                          </Select>
                          <FormHelperText style={{ color: "red" }}>{validation && validation.campaign || ""}</FormHelperText>
                        </FormControl>
                      </Box>
                    )}
                    {/*<Box p={1} display="flex" justifyContent="flex-start" flexDirection="row">
                                    <Box>
                                        <EventIcon size="medium" />
                                    </Box>
                                    <Box p={1}>
                                        <Typography variant='h3' >
                                            {filterName}
                                        </Typography>
                                     </Box>
                                </Box>
                                <Box p={1}>
                                    <Button
                                      color="primary"
                                      aria-label="View"
                                      title="View Filter"
                                      component="span"
                                      className={classes.smallBtn}
                                      onClick={() => {
                                        this.setState({
                                            showFilter: true,
                                        });
                                      }}
                                    >
                                      <img
                                        src={require(`~/assets/icons/icon_filter.svg`)}
                                        alt={"View Filter"}
                                        className={classes.smallIcon}
                                      />
                                      <Typography variant="h6" className={classes.iconText}>
                                        Filters
                                      </Typography>
                                    </Button>
                                </Box>
                             */}
                  </Box>
                </Grid>
              )}
              <Grid
                item
                container
                xs={12}
                sm={12}
                className={classes.gridItem}
                justify="center"
              >
                {isReportDownloadEnabled && (
                  <Box
                    display="flex"
                    mb={5}
                    mt={3}
                    justifyContent="space-between"
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => this.handleCancel()}
                    >
                      Cancel
                    </Button>
                    {downloadProgress ? (
                      <CircularProgress color="primary" />
                    ) : (
                      <Button
                        variant="contained"
                        style={{ marginLeft: "30px", color: "white" }}
                        color="primary"
                        onClick={() => this.handleDownload(data)}
                      >
                        Download
                      </Button>
                    )}
                  </Box>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <ReportsFilter
          open={showFilter}
          handleClose={() => this.hideFilter()}
          headerText="Date Filter"
          icon={<EventIcon size="medium" />}
        >
          <DateFilter
            filterList={filterList}
            selectedDateFilter={selectedDateFilter}
            startDate={startDate}
            endDate={endDate}
            handleChange={this.handleChange}
            resetFilter={this.resetFilter}
            applyFilter={this.applyFilter}
            handleDateChange={this.handleDateChange}
            validation={validation}
            processing={filterListProgress}
          />
        </ReportsFilter>
        {alertMessage &&
          this.renderAlertMessage("", alertMessage, alertMessageCallbackType)}
      </Grid>
    );
  }

  renderAlertMessage = (title, message, callbackType) => {
    return (
      <AlertDialog
        dialogClassName={"alert-dialoge-root"}
        title={title}
        message={message}
        onConfirm={() => {
          this.hideAlertMessage();
        }}
      />
    );
  };
}
export default connect((state) => ({
  ...state.user,
  ...state.report,
  ...state.campaign,
  ...state.permissions,
}))(withStyles(styles)(ReportView));