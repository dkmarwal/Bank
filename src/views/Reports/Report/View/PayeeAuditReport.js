import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Button,
  FormControl,
  Box,
  CircularProgress,
  TextField,
} from "@material-ui/core";
import { AlertDialog } from "~/components/Dialogs";
import { Autocomplete } from "@material-ui/lab";
import { connect } from "react-redux";
import styles from "./styles";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { withStyles } from "@material-ui/styles";
import {
  getClientsList,
  getCampaignList,
  getPayeeList,
  downloadPayeeAuditReport,
} from "~/redux/actions/reports";
import config from "~/config";
import moment from "moment";
// import debounce from 'lodash.debounce';
import _ from "lodash";
import * as FileSaver from "file-saver";

class PayeeAuditReport extends React.Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;
    this.state = {
      clientList: [],
      payeeList: [],
      campaignList: [],
      selectedClient: null,
      selectedCampaign: "",
      selectedPayee: [],
      startDate: null,
      endDate: null,
      validation: {},
      downloadProgress: false,
      open: false,
      disabledPayee: true,
      alertMessage: "",
      alertType: "",
      isValidReport: (state && state.isValidReport) || false,
    };
    this.fetchPayeeList = _.debounce(this.fetchPayeeList, 1000);
  }

  componentDidMount = async () => {
    this.fetchClientsList();
  };

  fetchClientsList = () => {
    const { data } = this.state;
    let appType = undefined; //For B2B user reports
    if (
      data &&
      (data.reportCode === "enrollmentSummary" ||
        data.reportCode === "dailyEnrollment")
    ) {
      appType = 1;
    }
    this.props
      .dispatch(getClientsList({ appType: appType, reportCode: data.reportCode }))
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
          campaignList: [],
          clientList: this.props.report.clientList,
        });
      });
  };

  downloadPayeeAuditReport = () => {
    const {
      selectedClient,
      selectedCampaign,
      selectedPayee,
      startDate,
      endDate,
    } = this.state;
    const fromDate = startDate ? moment(startDate).format("YYYY-MM-DD") : "";
    const toDate = endDate ? moment(endDate).format("YYYY-MM-DD") : "";
    const todayDate = moment().format("YYYY-MM-DD");
    const selectedPayeeIds = selectedPayee?.map((payee) => payee.payeeId) || [];
    this.setState(
      {
        downloadProgress: true,
        validation: {},
      },
      () => {
        const filename =
        "Campaign_Audit_Report_" +
        todayDate +
        ".csv";
        this.props
          .dispatch(
            downloadPayeeAuditReport({
              clientIds: selectedClient?.clientId || null,
              campaignIds: selectedCampaign?.campaignId || null,
              payeeId: selectedPayeeIds && selectedPayeeIds.length !== 0 ? selectedPayeeIds : undefined,
              startDate: fromDate,
              endDate: toDate,
            })
          )
          .then((response) => {
            if (!response || (response && response.error)) {
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
    );
  };

  fetchPayeeList = (value) => {
    const { selectedClient, selectedCampaign } = this.state;
    this.props
      .dispatch(
        getPayeeList({
          clientIds: selectedClient?.clientId || null,
          campaignIds: selectedCampaign?.campaignId || "",
          companyName: value,
        })
      )
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
          payeeList: this.props.report.payeeList,
        });
      });
  };

  fetchCampaignList = () => {
    const { selectedClient } = this.state;
    this.setState(
      {
        campaignListProgress: true,
      },
      () => {
        this.props
          .dispatch(
            getCampaignList({
              selectedClient: selectedClient && [selectedClient.clientId],
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

            this.setState({
              campaignListProgress: false,
              campaignList: this.props.report.campaignList,
            });
          });
      }
    );
  };

  handlePayeeChange = (event) => {
    const { value: payees } = event.target;
    this.setState({ selectedPayee: [payees] });
  };

  handleCancel = () => {
    this.props.history.push(`${config.baseName}/reports`);
  };

  validateForm = () => {
    const {
      startDate,
      endDate,
      selectedCampaign,
      selectedClient,
      campaignList,
    } = this.state;
    const fromDate = startDate ? moment(startDate).format("YYYY-MM-DD") : null;
    const toDate = endDate ? moment(endDate).format("YYYY-MM-DD") : null;
    let valid = true;
    let validation = {};

    if (!selectedClient) {
      validation["client"] = "Client is required.";
      valid = false;
    }

    if (!selectedCampaign) {
      validation["campaign"] = "Campaign is required.";
      valid = false;
    }

    if (selectedClient && campaignList.length === 0) {
      validation["campaign"] = "No Campaign launched for this Client.";
      valid = false;
    }

    if (!fromDate && toDate) {
      validation["startDate"] = "Starting date is required.";
      valid = false;
    }

    if (fromDate && !toDate) {
      validation["endDate"] = "Ending date is required.";
      valid = false;
    }

    if (this.getFormattedDate(fromDate) > this.getFormattedDate(toDate)) {
      validation["dateRange"] = "End date should be greater than start date.";
      valid = false;
    }

    this.setState({ validation: { ...validation } });
    return valid;
  };

  handleDownload = () => {
    const isValid = this.validateForm();

    if (isValid) {
      this.downloadPayeeAuditReport();
    }
  };

  handlePayeeDisable() {
    const { selectedCampaign, selectedClient } = this.state;

    if (selectedCampaign && selectedClient) {
      this.setState({ disabledPayee: false });
    } else {
      this.setState({ disabledPayee: true });
    }
  }

  handlePayeeChange = (event) => {
    if (event.target.value.length >= 1) {
      this.fetchPayeeList(event.target.value);
    } else {
      this.setState({ payeeList: [] });
    }
  };

  getFormattedDate = (dateVal) => {
    if (dateVal) {
      return moment(dateVal).format("YYYY-MM-DD");
    }
    return null;
  };

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

  hideAlertMessage = () => {
    this.setState({
      alertMessage: null,
      alertType: null,
      alertMessageCallbackType: null,
    });
  };

  onCampaignChange = (event, value) => {
    const { selectedClient } = this.state;
    console.log(value);
    if (value && selectedClient) {
      this.setState(
        {
          selectedCampaign: value,
        },
        () => {
          this.handlePayeeDisable();
        }
      );
    } else {
      this.setState(
        {
          selectedCampaign: "",
          selectedPayee: [],
          payeeList: [],
        },
        () => {
          this.handlePayeeDisable();
        }
      );
    }
  };

  onClientChange = (event, value) => {
    if (value) {
      this.setState(
        {
          selectedClient: value,
          selectedCampaign: "",
          payeeList: [],
          selectedPayee: [],
        },
        () => {
          this.fetchCampaignList();
          this.handlePayeeDisable();
        }
      );
    } else {
      this.setState(
        {
          selectedCampaign: "",
          selectedClient: null,
          campaignList: [],
          payeeList: [],
          selectedPayee: [],
        },
        () => {
          this.handlePayeeDisable();
        }
      );
    }
  };

  onPayeeChange = (event, value) => {
    if (value) {
      this.setState({ selectedPayee: value });
    }
  };

  render() {
    const {
      alertMessage,
      alertMessageCallbackType,
      clientList,
      selectedClient,
      selectedCampaign,
      selectedPayee,
      campaignList,
      payeeList,
      startDate,
      endDate,
      validation,
      downloadProgress,
      open,
      disabledPayee,
      isValidReport,
    } = this.state;
    const { classes } = this.props;
    if (!isValidReport) {
      this.props.history.push({
        pathname: `${config.baseName}/reports/`,
      });
      return false;
    }
    return (
      <>
        <Paper className={classes.paperContainer}>
          <Grid container className={classes.gridContainer} direction="column">
            <Grid>
              <Typography variant="h1" className={classes.reportHeading}>
                Report Details
              </Typography>
            </Grid>
            <Grid>
              <Typography variant="h4" className={classes.reportHeading}>
                Campaign Audit Report
              </Typography>
            </Grid>
          </Grid>
          <hr style={{ margin: "0 -20px" }} />
          <Grid container className={classes.gridContainer} direction="column">
            <Grid>
              <Typography variant="h1" className={classes.parameterHeading}>
                Report Parameters
              </Typography>
            </Grid>
            <Grid xs={4} className={classes.gridMargin}>
              <FormControl variant="outlined" style={{ width: "100%" }}>
                <Autocomplete
                  id="clientPayer"
                  options={clientList || []}
                  value={selectedClient || null}
                  getOptionLabel={(option) => option.clientName}
                  onChange={(event, value) => {
                    this.onClientChange(event, value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={validation && validation.client}
                      helperText={validation && validation.client}
                      label="Client/Payer*"
                      variant="outlined"
                      value={
                        (selectedClient && selectedClient?.clientName) || ""
                      }
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid xs={4} className={classes.gridMargin}>
              <FormControl variant="outlined" style={{ width: "100%" }}>
                <Autocomplete
                  id="campaign"
                  value={selectedCampaign || ""}
                  noOptionsText={
                    selectedClient
                      ? "No Campaign launched for this client."
                      : "Please select a Client first."
                  }
                  options={campaignList || []}
                  getOptionLabel={(option) => option.campaignName}
                  onChange={(event, value) => {
                    this.onCampaignChange(event, value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={validation && validation.campaign}
                      helperText={validation && validation.campaign}
                      label="Campaign*"
                      variant="outlined"
                      value={
                        (selectedCampaign && selectedCampaign?.campaignName) ||
                        ""
                      }
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid xs={4} style={{ marginBottom: "27px" }}>
              <FormControl variant="outlined" style={{ width: "100%" }}>
                <Autocomplete
                  multiple
                  noOptionsText={
                    selectedPayee.length === 0 || "Start typing name of Payee"
                  }
                  id="suppliers-payees"
                  open={open}
                  disabled={disabledPayee}
                  onOpen={() => {
                    this.setState({ open: true });
                  }}
                  onClose={() => {
                    this.setState({ open: false });
                  }}
                  getOptionSelected={(option, value) =>
                    option.companyName === value.companyName
                  }
                  getOptionLabel={(option) => option.companyName}
                  options={payeeList}
                  onChange={(event, value) => {
                    this.onPayeeChange(event, value);
                  }}
                  value={selectedPayee || []}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Suppliers/Payees"
                      variant="outlined"
                      onChange={(event) => this.handlePayeeChange(event)}
                      value={selectedPayee || []}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid
              container
              xs={4}
              className={classes.gridMargin}
              justify="space-between"
              direction="row"
            >
              <Grid xs={6} style={{ flexBasis: "auto" }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    autoOk={true}
                    clearable={true}
                    views={["year", "month", "date"]}
                    disableToolbar
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="startDate"
                    name="startDate"
                    label="Start Date"
                    variant="inline"
                    inputVariant="outlined"
                    value={startDate}
                    maxDate={moment().subtract(1, "days")}
                    error={validation && validation.startDate}
                    helperText={validation && validation.startDate}
                    className={classes.helperText}
                    onChange={(date) => {
                      this.setState({ startDate: date });
                    }}
                    KeyboardButtonProps={{
                      "aria-label": "Start Date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid xs={6} style={{ flexBasis: "auto" }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    autoOk={true}
                    clearable={true}
                    views={["year", "month", "date"]}
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="startDate"
                    name="startDate"
                    label="End Date"
                    inputVariant="outlined"
                    value={endDate}
                    maxDate={moment().subtract(1, "days")}
                    error={
                      (validation && validation.endDate) ||
                      (validation && validation.dateRange)
                    }
                    helperText={
                      (validation && validation.endDate) ||
                      (validation && validation.dateRange)
                    }
                    className={classes.helperText}
                    onChange={(date) => {
                      this.setState({ endDate: date });
                    }}
                    KeyboardButtonProps={{
                      "aria-label": "Start Date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
            <Grid xs={4}>
              <Box className={classes.dateCaption}>
                <Typography variant="caption">
                  <em>
                    <strong>
                      If status date is not selected then report will be
                      generated from Campaign initiated to last update on each
                      campaign/payee.
                    </strong>
                  </em>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        <Grid
          container
          display="flex"
          justify="center"
          className={classes.buttonGrid}
        >
          <Button
            variant="outlined"
            color="primary"
            className={classes.cancelButton}
            onClick={() => this.handleCancel()}
          >
            CANCEL
          </Button>
          {downloadProgress ? (
            <CircularProgress color="primary" />
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.handleDownload()}
            >
              DOWNLOAD
            </Button>
          )}
        </Grid>
        {alertMessage &&
          this.renderAlertMessage("", alertMessage, alertMessageCallbackType)}
      </>
    );
  }
}

export default connect((state) => ({
  ...state.user,
  ...state.report,
  ...state.campaign,
}))(withStyles(styles)(PayeeAuditReport));
