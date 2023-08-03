import React, { Component } from "react";
import { connect } from "react-redux";
import PromptImport from "~/components/Dialogs/PromptImport";
import GridCheckbox from "~/components/Forms/B2C/GridCheckbox";
import {
  Paper,
  Grid,
  Box,
  CircularProgress,
  FormGroup,
  FormControl,
  Typography,
  MenuItem, Checkbox, FormControlLabel, FormHelperText,
} from "@material-ui/core";
import Button from "~/components/Forms/Button";
import TextField from "~/components/Forms/TextField";
import { withStyles } from "@material-ui/styles";
import {
  b2cFetchFileTypes, b2cFetchNamingConvention, b2cFetchSelectedFileTypes, b2cUpdatePaymentFileTypes, b2cUpdateFileTypes,
  fetchCampaignInfo, addCampaignFile, getB2CGeneralSettingConfig, saveB2CPermissionsData
} from "~/redux/helpers/filesettings";
import InfoIcon from "@material-ui/icons/Info";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import styles from "./styles";
import Notification from "~/components/Notification";
import "react-notifications/lib/notifications.css";
import { getClientDataActivated } from "~/redux/actions/clients";
import trim from "deep-trim-node";
import CheckboxGroup from "~/components/Forms/CheckboxGroup";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

class FileSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: null,
      parentId: null,
      isHippa: null,
      emailAddress: "",
      openModal: false,
      isLoading: true,
      isISOselected: false,
      delimiters: [
        { label: "|", value: "|" },
        { label: ",", value: "," },
      ],
      fileFormat: [
        { label: ".dat", value: ".dat" },
        { label: ".txt", value: ".txt" },
        { label: ".csv", value: ".csv" },
      ],
      incomingPaymentFileType: [],
      validation: {},
      responseValidation: {},
      selectedFileTypes: [],
      selectedPaymentMethod: [],
      namingConvention: {},
      citiConnectId: null,
      fileIdentifier: null,
      campaignDelimiter: null,
      reportDelimiter: null,
      selectedFormat: null,
      reportFormat: null,
      bessId: "",
      clientBillingBranch: "",
      clientBillingAccount: "",
      showResponseFile: 1,
      fileLevel: true,
      transactionLevel: true,
      paymentStatus: true,
      error: null,
      variant: "error",
      OmniBusAccountNumber: "",
      EFTAccountNumber: "",
      isCampaignFileShow: 0
    };
  }

  async componentDidMount() {
    this.props.updateOnboardingStep(5);
    const clientId = sessionStorage.getItem("clientId");
    await this.fetchClientInformation(clientId);
    this.fetchAllFilesData(clientId, false);
  }

  fetchClientInformation = async (clientId) => {
    const clientData = await getClientDataActivated(clientId);
    const { data = {} } = clientData;
    let parentId = null;
    let isHippa = null;
    if (data.rows && data.rows[0]) {
      parentId = data.rows[0].parentId;
      isHippa = data.rows[0].isHippa;
    }
    this.setState({
      clientId: clientId,
      parentId: parentId,
      isHippa: isHippa,
      emailAddress: data.rows?.[0].emailAddress
    });
  };

  fetchAllFilesData = (id, flag) => {
    Promise.all([
      b2cFetchFileTypes(),
      b2cFetchSelectedFileTypes(id, flag),
      b2cFetchNamingConvention(id, flag),
      fetchCampaignInfo(id, flag),
      getB2CGeneralSettingConfig(id)
    ])
      .then(
        ([
          fileTypesInfo, selectedFileTypesInfo,
          namingConventionInfo,
          campaignInfo, settingInfo
        ]) => {
          const selectedFileTypes = selectedFileTypesInfo.data.length === 0 ? [11] : selectedFileTypesInfo.data;
          const {
            isPaymentResponse,
            isFileLevelAck,
            isTransactionLevelAck,
            isFinalPaymentStatusAck,
            sdr_accountnumber,
            sdr_eft_accountnumber,
            isCampaignFileOpted,
          } = settingInfo.data;

          this.setState({
            incomingPaymentFileType: fileTypesInfo.data.map((item) =>
              selectedFileTypes.includes(item.id)
                ? { ...item, checked: true }
                : { ...item, checked: false }
            ),
            selectedFileTypes: selectedFileTypes,
            citiConnectId: campaignInfo.data && campaignInfo.data.citiConnectID ? campaignInfo.data.citiConnectID : "",
            fileIdentifier: campaignInfo.data && campaignInfo.data.fileIdentifier ? campaignInfo.data.fileIdentifier : "",
            campaignDelimiter: campaignInfo.data && campaignInfo.data.fileDelimiter ? campaignInfo.data.fileDelimiter : "",
            selectedFormat: campaignInfo.data && campaignInfo.data.fileExtension ? campaignInfo.data.fileExtension : "",
            namingConvention: namingConventionInfo.data !== null ? namingConventionInfo.data : {},
            bessId: settingInfo.data && settingInfo.data.bessId ? settingInfo.data.bessId : "",
            reportDelimiter: settingInfo?.data?.staticReportH2hDelimiter ? settingInfo.data.staticReportH2hDelimiter
              : null,
            reportFormat: settingInfo?.data?.staticReportH2hExtension ? settingInfo.data.staticReportH2hExtension
              : null,
            clientBillingBranch: settingInfo.data && settingInfo.data.clientBillingBranch ? settingInfo.data.clientBillingBranch : "",
            clientBillingAccount: settingInfo.data && settingInfo.data.clientBillingAccount ? settingInfo.data.clientBillingAccount : "",
            showResponseFile: isPaymentResponse === 0 ? isPaymentResponse : 1,
            isCampaignFileShow: isCampaignFileOpted === 0 ? isCampaignFileOpted : 1,
            fileLevel: isFileLevelAck === 0 ? Boolean(isFileLevelAck) : true,
            transactionLevel: isTransactionLevelAck === 0 ? Boolean(isTransactionLevelAck) : true,
            paymentStatus: isFinalPaymentStatusAck === 0 ? Boolean(isFinalPaymentStatusAck) : true,
            isLoading: false,
            OmniBusAccountNumber: sdr_accountnumber || "",
            EFTAccountNumber: sdr_eft_accountnumber || "",
          });
        }
      )
      .catch((error) => {
        this.setState({
          isLoading: false,
          error:
            typeof error === "string" ? error : "An unknown error has occured.",
          variant: "error",
        });
      });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { incomingPaymentFileType } = this.state;
    const selectedMethods = [];
    incomingPaymentFileType.filter((s) => {
      if (s.checked === true) {
        selectedMethods.push(s.id);
      }
    });
    if (selectedMethods.length === 0) {
      this.setState({
        error: "Please select incoming payment file.",
        variant: "error",
      });
    } else {
      const isValid = this.validateNamingConvention();
      if (isValid) {
        this.handleUpdateFileSettings();
      } else {
        this.setState({
          processingUpdate: false,
          error: null,
          variant: null,
        });
      }
    }
  };
  handleFieldChange = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    let finalValue = "";

    switch (fieldName) {
      case "bessId":
        finalValue = fieldValue.replace(/[^0-9A-Za-z_#-]/g, "");
        break;
      case 'OmniBusAccountNumber':
        finalValue = fieldValue.replace(/[^0-9]/g, "");
        break;
      case 'EFTAccountNumber':
        finalValue = fieldValue.replace(/[^a-z0-9]/gi, '');
        break;
      default:
        finalValue = event.target.value;
        break;
    }

    this.setState({ [fieldName]: finalValue });
  }
  validateNamingConvention = () => {
    const { namingConvention, showResponseFile, fileLevel, transactionLevel, } = this.state;

    let valid = true;
    const validation = {};
    const convention = {
      clientUid: "",
      fpid: "",
    };
    for (const [key] of Object.entries(convention)) {
      const obj = Object.keys(namingConvention).find((item) => item === key);
      if (
        (typeof obj !== "undefined" && namingConvention[obj] !== null &&
          namingConvention[obj].toString().trim().length !== 0) && namingConvention[obj].toString().trim().replace(/^0+/, '').length === 0
      ) {
        valid = false;
        validation[key] = "Please enter a valid number";
      }
    }
    if (showResponseFile && !fileLevel && !transactionLevel) {
      valid = false;
      validation["fileAckReq"] = "Select at least one option";
    }
    this.setState({ validation: { ...validation } });
    return valid;
  };

  handleFileTypeSelection = (e, index) => {
    const { incomingPaymentFileType } = this.state;
    const obj = incomingPaymentFileType.find(
      (paymentFileType, i) => index === i
    );
    if (e.target.textContent === "ISO XML") {
      this.setState({
        isISOselected: e.target.checked,
      });
    } else if (
      e.target.textContent === "EDI820" ||
      e.target.textContent === "EDI835"
    ) {
      this.setState({
        isEDIselected: e.target.checked,
        ediFileTypeId: obj.id,
      });
    }
    this.setState({
      incomingPaymentFileType: incomingPaymentFileType.map((item, i) =>
        i === index
          ? {
            ...item,
            checked: e.target.checked,
          }
          : item
      ),
    });
  };

  handleUpdateFileSettings = () => {
    this.setState(
      {
        processingUpdate: true,
      },
      () => {
        const {
          namingConvention,
          citiConnectId,
          fileIdentifier,
          campaignDelimiter,
          selectedFormat,
          reportDelimiter,
          reportFormat,
          clientId, selectedFileTypes, bessId,
          clientBillingBranch, clientBillingAccount, showResponseFile,
          fileLevel, transactionLevel, paymentStatus, OmniBusAccountNumber, EFTAccountNumber, isCampaignFileShow
        } = this.state;

        const data = {
          "fileIdentifier": fileIdentifier !== null && fileIdentifier.toString().trim().length === 0 ? null : fileIdentifier,
          "fileExtension": selectedFormat !== null && selectedFormat.toString().trim().length === 0 ? null : selectedFormat,
          "fileDelimiter": campaignDelimiter !== null && campaignDelimiter.toString().trim().length === 0 ? null : campaignDelimiter,
          "clientId": clientId,
          "citiConnectID": citiConnectId !== null && citiConnectId.toString().trim().length === 0 ? null : citiConnectId,
        }

        const settingsData = trim({
          bessId: bessId !== null && bessId.toString().trim().length === 0 ? null : bessId,
          staticReportH2hDelimiter: reportDelimiter !== null && reportDelimiter.toString().trim().length === 0
            ? null : reportDelimiter,
          staticReportH2hExtension: reportFormat !== null && reportFormat.toString().trim().length === 0
            ? null : reportFormat,
          clientBillingBranch: clientBillingBranch !== null && clientBillingBranch.toString().trim().length === 0 ? null : clientBillingBranch,
          clientBillingAccount: clientBillingAccount !== null && clientBillingAccount.toString().trim().length === 0 ? null : clientBillingAccount,
          isFileSettingCall: 1,
          isPaymentResponse: showResponseFile !== null && showResponseFile.toString().trim().length === 0 ? null : showResponseFile,
          isCampaignFileOpted: isCampaignFileShow !== null && isCampaignFileShow.toString().trim().length === 0 ? null : isCampaignFileShow,
          isFileLevelAck: fileLevel !== null && fileLevel.toString().trim().length === 0 ? null : Number(fileLevel),
          isTransactionLevelAck: transactionLevel !== null && transactionLevel.toString().trim().length === 0 ? null : Number(transactionLevel),
          isFinalPaymentStatusAck: paymentStatus !== null && paymentStatus.toString().trim().length === 0 ? null : Number(paymentStatus),
          sdr_accountnumber: OmniBusAccountNumber || null,
          sdr_eft_accountnumber: EFTAccountNumber || null,
        });
        Promise.all([isCampaignFileShow && addCampaignFile(data), b2cUpdatePaymentFileTypes(clientId, { fileTypeIds: selectedFileTypes }),
        b2cUpdateFileTypes(clientId, namingConvention), saveB2CPermissionsData(settingsData, clientId)])
          .then((response) => {
            response.find(function (item) {
              if (item.error === true) {
                throw item;
              }
            });
            this.setState({
              processingUpdate: false,
              error: null
            });
            this.props.history.push({
              pathname: `/clientOnboard/b2c/remittance`,
            });

          })
          .catch((error) => {
            this.setState({
              processingUpdate: false,
              error:
                typeof error.message === "string"
                  ? error.message
                  : "An unknown error has occured.",
            });
          });
      }
    );
  };

  render() {
    const {
      isLoading,
      namingConvention,
      validation,
      processingUpdate,
      incomingPaymentFileType,
      fileIdentifier, fileFormat, campaignDelimiter,
      error, delimiters, selectedFormat, citiConnectId,
      parentId, variant, bessId, reportDelimiter, reportFormat, clientBillingBranch, clientBillingAccount, showResponseFile,
      fileLevel, transactionLevel, paymentStatus, OmniBusAccountNumber, EFTAccountNumber, isCampaignFileShow
    } = this.state;
    const { classes } = this.props;

    if (isLoading) {
      return (
        <Box display="flex" p={10} justifyContent="center" alignItems="center">
          <CircularProgress color="primary" />
        </Box>
      );
    }
    return (
      <>
        {Boolean(parentId) && (
          <Grid item xs={12} className={classes.importText}>
            <PromptImport
              promptText="We noticed that client's parent company is registered with us. Would you like to import File Settings?"
              importCb={() =>
                this.fetchAllFilesData(sessionStorage.getItem("parentId"), true)
              }
            />
          </Grid>
        )}
        <Paper display="flex" className={classes.root} elevation={1}>
          <Grid container item alignItems="flex-start" id="filesettings-list-view">
          <Grid container direction="column" xs={6}>
              <Grid
                item xs={11}
                container
                className={classes.gridContainers}
              >
                <Grid item xs={12} className={classes.gridMArgin}>
                  <Typography variant="h1">
                    Payment File Settings:
                  </Typography>
                </Grid>
                <Grid item xs={12} className={classes.gridMArgin}>
                  <Typography variant="caption" className={classes.legend}>
                    Payment File Format
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  {incomingPaymentFileType.map((fileType, index) => (
                    <GridCheckbox
                      label={fileType.fileName}
                      key={fileType.id}
                      id={fileType.id}
                      checked={fileType.checked}
                      index={index}
                      onChange={(e) => this.handleFileTypeSelection(e, index)}
                    />
                  ))}
                </Grid>
                <Grid
                  container
                  justify="flex-start"
                  direction="row"
                  alignItems="flex-start"
                  className={classes.gridContainers}
                >
                  <FormControl component="fieldset" className={classes.fieldset}>
                    <Grid item xs={12} className={classes.gridMArgin}>
                      <Typography variant="caption" className={classes.legend}>
                        File Naming Convention
                      </Typography>
                    </Grid>
                    <FormGroup
                      aria-label="position"
                      row={true}
                      justify="space-between"
                    >
                      <Grid container justify="flex-start">
                        <Grid item xs={12} sm={12} className={classes.gridItem}>
                          <Box>
                            <TextField color="secondary"
                              label="Client ID"
                              value={
                                namingConvention.clientUid
                                  ? namingConvention.clientUid
                                  : ""
                              }
                              name="clientUid"
                              error={validation.clientUid && validation.clientUid.length > 0}
                              helperText={validation.clientUid}
                              inputProps={{
                                ref: (el) => (this.clientUid = el),
                                maxLength: 10
                              }}
                              onChange={(event) =>
                                this.setState({
                                  namingConvention: {
                                    ...namingConvention,
                                    clientUid:
                                      event.target.value === ""
                                        ? null
                                        : event.target.value.replace(/[^0-9A-Za-z_#-]/g, ""),
                                  },
                                })
                              }
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} className={classes.gridItem}>
                          <Box>
                            <TextField color="secondary"
                              label="File Profile ID"
                              error={validation.fpid && validation.fpid.length > 0}
                              helperText={validation.fpid}
                              value={
                                namingConvention.fpid ? namingConvention.fpid : ""
                              }
                              name="fpid"
                              inputProps={{
                                ref: (el) => (this.fpid = el),
                                maxLength: 10,
                              }}
                              onChange={(event) =>
                                this.setState({
                                  namingConvention: {
                                    ...namingConvention,
                                    fpid:
                                      event.target.value === ""
                                        ? null
                                        : event.target.value.replace(/[^0-9A-Za-z_#-]/g, ""),
                                  },
                                })
                              }
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </FormGroup>
                    <Grid item xs={12} className={classes.gridMArgin}>
                      <Box className={classes.contentBackground} py={1}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={12}>
                            <Typography variant="caption" className={classes.legend}>
                            Do you want to receive Payment Response Files?
                            </Typography>
                          </Grid>
                          <Grid item  spacing={2}>
                            <CheckboxGroup
                              options={[
                                {
                                  label: "Yes",
                                  value: 1,
                                },
                                {
                                  label: "No",
                                  value: 0,
                                },
                              ]}
                              onChange={(selectedValue) => {
                                if (selectedValue.value === 0) {
                                  this.setState({
                                    showResponseFile: selectedValue.value,
                                    fileLevel: false,
                                    transactionLevel: false,
                                    paymentStatus: false,
                                  });
                                } else {
                                  this.setState({
                                    showResponseFile: selectedValue.value,
                                  });
                                }
                              }}
                              selectedOption={showResponseFile}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                      {showResponseFile === 1 && <Box py={1.75}>
                        <Box pt={2}> Select the option to receive payment file acknowledgements</Box>
                        <Box my={1} ml={4}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={fileLevel}
                                onChange={() => {
                                  this.setState({
                                    fileLevel: !fileLevel,
                                  })
                                }}
                                name="fileLevel"
                                color="primary"
                              />
                            }
                            label="File Level"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={transactionLevel}
                                onChange={() => {
                                  this.setState({
                                    transactionLevel: !transactionLevel,
                                  })
                                }}
                                name="transactionLevel"
                                color="primary"
                              />
                            }
                            label="Transaction Level"
                          />
                        </Box>
                        {transactionLevel && <Box my={1}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={paymentStatus}
                                onChange={() => {
                                  this.setState({
                                    paymentStatus: !paymentStatus,
                                  })
                                }}
                                name="paymentStatus"
                                color="primary"
                              />
                            }
                            label="Payment Status - All or Final"
                            className={classes.marginRight}
                          /><IconButton
                            color="primary"
                            component="span"
                          >
                            <Tooltip title="Applicable for Non CDM payments only" >
                              <InfoIcon fontSize="small" color="primary" />
                            </Tooltip>
                          </IconButton>
                          <Box mx={4} mb={2}>
                            If selected, acknowledgements will be shared only for final payment 
                            statuses consolidated for all payments received in a single input file. 
                            If not selected, acknowledgments for all statuses including intermediary 
                            and final statuses will be shared as & when the updates are received.</Box>
                        </Box>}
                        <FormHelperText className={classes.errorText2}>{validation.fileAckReq}</FormHelperText>
                      </Box>}
                    </Grid>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid
                item
                xs={11}
                container
                className={classes.gridContainers}
              >
                <Grid item xs={12} className={classes.gridMArgin}>
                  <Typography variant="h1">
                    Report Settings:
                  </Typography>
                </Grid>
                <Grid
                  container
                  justify="flex-start"
                  direction="row"
                  alignItems="flex-start"
                >
                  <FormControl
                    component="fieldset"
                    className={classes.fieldset}
                  >
                    <FormGroup
                      aria-label="position"
                      row={true}
                      justify="space-between"
                    >
                      <Grid container justify="flex-start">
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          className={classes.gridItem}
                        >
                          <Box>
                            <TextField
                              fullWidth={true}
                              color="secondary"
                              autoComplete="off"
                              name="bessId"
                              label={"BESS ID"}
                              variant="outlined"
                              value={bessId}
                              onChange={this.handleFieldChange}
                              inputProps={{ maxLength: 10 }}
                              error={validation.bessId && validation.bessId.length > 0}
                              helperText={validation.bessId || ""}
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          className={classes.gridItem}
                        >
                          <Box>
                            <TextField color="secondary"
                              fullWidth={true}
                              select
                              label="Delimiter"
                              error={validation.reportDelimiter}
                              value={reportDelimiter}
                              name="reportDelimiter"
                              autoComplete="off"
                              variant="outlined"
                              onChange={(event) =>
                                this.setState({
                                  reportDelimiter: event.target.value,
                                })
                              }
                            >
                              <MenuItem value=" ">
                                <em>Select</em>
                              </MenuItem>
                              {delimiters ? (
                                delimiters.map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
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
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          className={classes.gridItem}
                        >
                          <Box>
                            <TextField color="secondary"
                              fullWidth={true}
                              select
                              label="File Format"
                              error={validation.reportFormat}
                              value={reportFormat}
                              name="reportFormat"
                              autoComplete="off"
                              variant="outlined"
                              size="medium"
                              onChange={(event) =>
                                this.setState({
                                  reportFormat: event.target.value,
                                })
                              }
                            >
                              <MenuItem value=" ">
                                <em>Select</em>
                              </MenuItem>
                              {fileFormat ? (
                                fileFormat.map((option) => (
                                  option.value === ".txt" ? null :
                                    <MenuItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
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
                        </Grid>
                      </Grid>
                    </FormGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid
                item
                xs={11}
                container
                className={classes.gridContainers}
              >
                <Grid item xs={12}>
                  <Typography variant="h1" className={classes.SDRHeading}>
                    SDR Report Settings
                    <Tooltip
                      title="Same Day Reconciliation Feed"
                      placement="right-start"
                      arrow
                    >
                      <InfoOutlinedIcon fontSize="small" color="primary" />
                    </Tooltip>
                  </Typography>
                </Grid>
                <Grid
                  container
                  justify="flex-start"
                  direction="row"
                  alignItems="flex-start"
                  className={classes.gridContainers}
                >
                  <FormControl
                    component="fieldset"
                    className={classes.fieldset}
                  >
                    <FormGroup
                      aria-label="position"
                      row={true}
                      justify="space-between"
                    >
                      <Grid container justify="flex-start">
                        <Grid
                          item
                          xs={12}
                          sm={12}
                        >
                          <Box mb={2}>
                            <TextField
                              fullWidth={true}
                              color="secondary"
                              autoComplete="off"
                              name="OmniBusAccountNumber"
                              label="Omni Bus Account Number"
                              variant="outlined"
                              value={OmniBusAccountNumber}
                              onChange={this.handleFieldChange}
                              inputProps={{ maxLength: 10 }}
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                        >
                          <Box>
                            <TextField
                              fullWidth={true}
                              color="secondary"
                              autoComplete="off"
                              name="EFTAccountNumber"
                              label="EFT Account Number"
                              variant="outlined"
                              value={EFTAccountNumber}
                              onChange={this.handleFieldChange}
                              inputProps={{ maxLength: 10 }}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </FormGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid container direction="column" xs={6}>
              <Grid
                item xs={11}
                container
                className={classes.gridContainers}
              >
                <Grid item xs={12} className={classes.gridMArgin}>
                  <Typography variant="h1">
                    Campaign File Settings:
                  </Typography>
                </Grid>
                <Grid item xs={12} className={classes.gridMArgin} style={{marginBottom: "10px"}}>
                        <Typography variant="caption" className={classes.legend}>
                        Do you want to send campaign file?
                        </Typography>
                      </Grid>
                      <Grid item xs={12} className={classes.gridMArgin} style={{marginBottom: "20px", padding: "5px"}}>
                        <Typography variant="caption" className={classes.description}>
                        Select if you want to send a separate campaign file from the payment file (enrollment + payment).
                        </Typography>
                      </Grid>
                      <Grid item spacing={2}>
                                      <CheckboxGroup
                                        options={[
                                          {
                                            label: "Yes",
                                            value: 1,
                                          },
                                          {
                                            label: "No",
                                            value: 0,
                                          },
                                        ]}
                                        
                                        onChange={(selectedValue) => {
                                          this.setState({
                                            isCampaignFileShow:
                                              selectedValue.value,
                                            
                                          });
                                        }}
                                        
                                        selectedOption={isCampaignFileShow}
                                      />
                                    </Grid>
                {isCampaignFileShow === 1&& (<Grid item xs={12} className={classes.gridMArgin} style={{marginTop: "30px"}}>
                  <Typography variant="caption" className={classes.legend}>
                    Campaign File Format
                  </Typography>
                </Grid>)}

                {isCampaignFileShow === 1&& (<Grid
                  container
                  justify="flex-start"
                  direction="row"
                  alignItems="flex-start"
                >
                  <FormControl component="fieldset" className={classes.fieldset}>
                    <FormGroup
                      aria-label="position"
                      row={true}
                      justify="space-between"
                    >
                      <Grid container justify="flex-start">
                        <Grid item xs={12} sm={12} style={{ marginBottom: 16 }}>
                          <TextField color="secondary"
                            fullWidth={true}
                            select
                            label="File Format"
                            error={validation.selectedFormat}
                            value={selectedFormat}
                            name="selectedFormat"
                            autoComplete="off"
                            variant="outlined"
                            size="medium"
                            onChange={(event) =>
                              this.setState({
                                selectedFormat: event.target.value,
                              })
                            }
                          >
                            <MenuItem value=" ">
                              <em>Select</em>
                            </MenuItem>
                            {fileFormat ? (
                              fileFormat.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
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
                        </Grid>
                      </Grid></FormGroup>
                    <Grid item xs={12} className={classes.gridMArgin}>
                      <Typography variant="caption" className={classes.legend}>
                        File Naming Convention
                      </Typography>
                    </Grid>
                    <FormGroup
                      aria-label="position"
                      row={true}
                      justify="space-between"
                    >
                      <Grid container justify="flex-start">
                        <Grid item xs={12} sm={12} className={classes.gridItem}>
                          <Box>
                            <TextField color="secondary"
                              label="Client Identifier"
                              value={citiConnectId}
                              name="citiConnectId"
                              error={validation.citiConnectId}
                              inputProps={{
                                ref: (el) => (this.citiConnectId = el),
                                maxLength: 10
                              }}
                              onChange={(event) =>
                                this.setState({
                                  citiConnectId: event.target.value,
                                })
                              }
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} className={classes.gridItem}>
                          <Box>
                            <TextField color="secondary"
                              label="File Identifier"
                              error={validation.fileIdentifier}
                              value={fileIdentifier}
                              name="fileIdentifier"
                              inputProps={{
                                maxLength: 40,
                              }}
                              onChange={(event) =>
                                this.setState({
                                  fileIdentifier: event.target.value,
                                })
                              }
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} className={classes.gridItem}>
                          <Box>
                            <TextField color="secondary"
                              fullWidth={true}
                              select
                              label="Delimiter"
                              error={validation.campaignDelimiter}
                              value={campaignDelimiter}
                              name="campaignDelimiter"
                              autoComplete="off"
                              variant="outlined"
                              onChange={(event) =>
                                this.setState({
                                  campaignDelimiter: event.target.value,
                                })
                              }
                            >
                              <MenuItem value=" ">
                                <em>Select</em>
                              </MenuItem>
                              {delimiters ? (
                                delimiters.map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
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
                        </Grid>
                      </Grid>
                    </FormGroup>
                  </FormControl>
                </Grid>)}
              </Grid>
              <Grid
                item
                xs={11}
                container
                className={classes.gridContainers}
              >
                <Grid item xs={12} className={classes.gridMArgin}>
                  <Typography variant="h1">
                    Billing Feed Settings:
                  </Typography>
                </Grid>
                <Grid
                  container
                  justify="flex-start"
                  direction="row"
                  alignItems="flex-start"
                >
                  <FormControl
                    component="fieldset"
                    className={classes.fieldset}
                  >
                    <FormGroup
                      aria-label="position"
                      row={true}
                      justify="space-between"
                    >
                      <Grid container justify="flex-start">
                        <Grid
                          item
                          xs={6}
                          sm={6}
                          className={classes.gridItem}
                          style={{ paddingRight: 10 }}
                        >
                          <Box>
                            <TextField
                              fullWidth={true}
                              color="secondary"
                              autoComplete="off"
                              name="clientBillingBranch"
                              label={"Branch Code"}
                              variant="outlined"
                              value={clientBillingBranch}
                              onChange={this.handleFieldChange}
                              inputProps={{ maxLength: 50 }}
                              error={validation.clientBillingBranch && validation.clientBillingBranch.length > 0}
                              helperText={validation.clientBillingBranch || ""}
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          sm={6}
                          className={classes.gridItem}
                        >
                          <Box>
                            <TextField
                              fullWidth={true}
                              color="secondary"
                              autoComplete="off"
                              name="clientBillingAccount"
                              label={"Account Number"}
                              variant="outlined"
                              value={clientBillingAccount}
                              onChange={this.handleFieldChange}
                              inputProps={{ maxLength: 50 }}
                              error={validation.clientBillingAccount && validation.clientBillingAccount.length > 0}
                              helperText={validation.clientBillingAccount || ""}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </FormGroup>
                  </FormControl>
                </Grid>
              </Grid>
              
            </Grid>

            <Grid item xs={12}>
              {processingUpdate ? (
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justify="center"
                  spacing={3}
                  className={classes.gridItem}
                >
                  <CircularProgress color="primary" />
                </Grid>
              ) : (
                <Grid container direction="row" alignItems="center" spacing={3}>
                  <Grid container item xs={6} justify="flex-end">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={(e) =>
                        this.props.history.push({
                          pathname: `/clientOnboard/b2c/payments`,
                        })
                      }
                      style={{ padding: "0.60rem 2.15rem" }}
                    >
                      Back
                    </Button>
                  </Grid>
                  <Grid container item xs={6} justify="flex-start">
                    <Box m={2}>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={(event) => this.handleSubmit(event)}
                        style={{ padding: "0.60rem 2.15rem" }}
                      >
                        Next
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Paper>
        {error && <Notification variant={variant} message={error} handleClose={() => { this.setState({ error: false }) }} />}
      </>
    );
  }
}

export default connect((state) => ({ ...state.user }))(
  withStyles(styles)(FileSettings)
);
