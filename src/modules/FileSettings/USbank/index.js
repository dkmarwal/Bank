import React, { Component } from "react";
import { connect } from "react-redux";
import PromptImport from "~/components/Dialogs/PromptImport";
import {
  Paper,
  Grid,
  Box,
  CircularProgress,
  Typography, MenuItem,
  FormControlLabel, Checkbox
} from "@material-ui/core";
import Button from "~/components/Forms/Button";
import TextField from "~/components/Forms/TextField";
import { withStyles } from "@material-ui/styles";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import GridBoxSelect from '../../../components/Forms/GridBoxSelect';
import { getClientDataActivated } from "../../../redux/actions/clients";
import styles from "./styles";
import Notification from "~/components/Notification";
import "react-notifications/lib/notifications.css";
import trim from "deep-trim-node";

import { updateFileSettingsData, getFileSettingsData } from '~/redux/helpers/USbank/filesettings';

class FileSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: null,
      parentId: null,
      isLoading: false,
      showBanner: false,
      isBtnClicked: false,
      errorMsg: null,
      isCsv: 1,
      isDat: 1,
      isText: 1,
      clientuid: "",
      filecode: "",
      delimeter: ',',
      delimeter1: ',',
      fileformat: '.csv',
      billingAccountNumber: null,
      billingAccountCompanyNumber: null,
      paymentResFile: 'Y',
      errors: {}
    };
  }

  componentDidMount() {
    this.props.updateOnboardingStep(5);

    const clientId = sessionStorage.getItem("clientId");
     this.fetchClientInformation(clientId);
    this.loadData(clientId,false);
  }

  fetchClientInformation = async (clientId) => {
    // const clientData = await getClientDataActivated(clientId);
    // const { data = {} } = clientData;
    // let parentId = null;
    // if (data?.rows && data?.rows?.length > 0) {
    //   parentId = data.rows[0].parentId;
    // }
    // this.setState({
    //   clientId: clientId,
    //   parentId: parentId,
    //   showBanner: parentId ? true : false
    // });
    // this.setState({clientuid: clientId})
    const clientData = await getClientDataActivated(clientId);
    const { data = {} } = clientData;
    let parentId = null;
    if (data.rows && data.rows[0]) {
      parentId = data.rows[0].parentId;
    }
    this.setState({
      clientId: clientId,
      parentId: parentId,
      showBanner: parentId === null ||
    typeof parentId === "undefined"
    ? false
    : true,
    });
    
   
  };

  loadData = (clientId,flag) => {
    this.setState({ isLoading: true });
    Promise.all([
      getFileSettingsData(clientId,flag)
    ])
      .then(
        
        ([
          fileSettingsData
        ]) => {
          const {billingFeedSettings,paymentFileSettings} = fileSettingsData?.data ?? {};
          this.setState({
            billingAccountNumber:   billingFeedSettings?.clientBillingAccount,
            billingAccountCompanyNumber:  billingFeedSettings?.clientBillingBranch,
            paymentResFile:paymentFileSettings?.isPaymentResponseFileOpted?paymentFileSettings?.isPaymentResponseFileOpted===1?'Y':'N':"Y",
            clientuid: paymentFileSettings?.clientUid||clientId,
            filecode:paymentFileSettings?.fpid,
           
            delimeter1:paymentFileSettings?.delimiter||',',
           
            errors: {},
            isLoading: false,
            errorMsg: ''
          });
        }
      )
      .catch((error) => {
        this.setState({
          isLoading: false,
          errorMsg: typeof error === "string" ? error : "An unknown error has occured."
        });
      });
  };

  fetchAllFileSettingsDataByParentId = () => {
    const { parentId } = this.state;
    this.setState({ showBanner: false });
    this.loadData(parentId,true);
  }

  handlePaymentFile = (event, res) => {
    this.setState({ paymentResFile: res });
  };

  onChangeHandler = (field, event) => {
    let fieldValue = null;

    switch (field) {
      case "billingAccountNumber":
        const bilingNumber = event.target.value;
        fieldValue = bilingNumber.replace(/[^0-9]/g, "");
        break;
      case "billingAccountCompanyNumber":
        const bilingComNumber = event.target.value;
        fieldValue = bilingComNumber.replace(/[^0-9]/g, "");
        break;
      case "clientuid":
        const clientuidNumber = event.target.value;
        fieldValue = clientuidNumber.replace(/[^0-9]/g, "");
        break;
      case "filecode":
        const filecode = event.target.value;
        const fileCodeRegex = /^((?!(0))[0-9]{0,20})$/g // bugfix 17832
        if(fileCodeRegex.test(filecode)){
          fieldValue = filecode
        } else {
          fieldValue = this.state.filecode
        }
        // fieldValue = filecode.replace(/[^0-9]/g, "");
        break;
      case "fileformat":
        fieldValue = event.target.value;
        break;
      case "delimeter":
        fieldValue = event.target.value;
        break;
      default:
        fieldValue = event.target.value;
        break;
    }
    this.setState({ [field]: fieldValue });
  }

  onBlurHandler = (e) => {
    const { errors } = this.state;
    delete errors[e.target.name];
    const { name, value } = e.target;
    // if (e.target.value.toString().trim().length === 0) {
      let errorMsgs = null;
      switch (name) {
        
        case "billingAccountNumber":
          if (value.toString().trim().length === 0) {
          errorMsgs = "Billing Account Number is required";
          }
          else if (value && value.length > 50) {
            errorMsgs = "Billing Account Number must not be greater than 50 digits.";
          }
        
          break;
        case "billingAccountCompanyNumber":
          if (value.toString().trim().length === 0) {
            errorMsgs = "Billing Account Company Number is required";}
            else if (value && value.length > 500) {
              errorMsgs = "Billing Account Company Number must not be greater than 500 digits.";;
            } 
          break;
        case "clientuid":
          if (value.toString().trim().length === 0) {
            errorMsgs =  "Client UID is required";}
            else if (value && value.length > 10) {
              errorMsgs = "Client UID must not be greater than 10 digits.";
            } 

          break;
        case "filecode":
          
          if (value.toString().trim().length === 0) {
            errorMsgs = "File Code is required";}
            else if (value && value.length > 20) {
              errorMsgs = "File Code must not be greater than 15 digits.";
            } 
          break;
        default:
          errorMsgs = "Field is required";
          break;
      }
      errors[e.target.name] = errorMsgs;

     

    this.setState({ errors: { ...errors } });
  }

  validateForm = () => {
    const { clientuid, filecode, billingAccountNumber, billingAccountCompanyNumber, errors } = this.state;
    let valid = true;

    if (clientuid === null || clientuid === '') {
      errors['clientuid'] = "Client UID is required";
      valid = false;
    }   else if (clientuid && clientuid.length > 10) {
      errors['clientuid'] = "Billing Account Number must not be greater than 10 digits.";
      valid = false;
    } 
  
    if (filecode === null || filecode === '') {
      errors['filecode'] = "File Code is required";
      valid = false;
    }  else if (filecode && filecode.length > 20) {
      errors['filecode'] = "File Code must not be greater than 15 digits.";
      valid = false;
    } 
    if (billingAccountNumber === null || billingAccountNumber === '') {
      errors['billingAccountNumber'] = "Billing Account Number is required";
      valid = false;
    }   else if (billingAccountNumber && billingAccountNumber.length > 50) {
      errors['billingAccountNumber'] = "Billing Account Number must not be greater than 50 digits.";
      valid = false;
    }
    
    if (billingAccountCompanyNumber === null || billingAccountCompanyNumber === '') {
      errors['billingAccountCompanyNumber'] = "Billing Account Company Number is required";
      valid = false;
    } else if (billingAccountCompanyNumber && billingAccountCompanyNumber.length > 500) {
      errors['billingAccountNumber'] = "Billing Account Number must not be greater than 500 digits.";
      valid = false;
    }
    this.setState({ errors: { ...errors } });

    return valid;
  }
  onChangeCheckboxHandler = (event, checked) => {
    const newValue = checked ? 1 : 0;
    const { name } = event.target;
    this.setState({ [name]: parseInt(newValue) });
  };
  saveFileSettingsData = async () => {
    if (this.validateForm()) {
      this.setState({ isBtnClicked: true });
      const { clientId, isCsv, isDat, isText, clientuid, filecode,
        delimeter, delimeter1, fileformat,
        billingAccountNumber, billingAccountCompanyNumber, paymentResFile } = this.state;

      this.setState({ errorMsg: null });
      const fileTypeIdArr = [15];
    

      const payloadFileObj = {
        fileTypeIds: fileTypeIdArr,
        clientUid: clientuid,
        fpid: filecode,
        segmentDelimiter: delimeter1,
        isPaymentResponse: paymentResFile === 'Y' ? 1 : 0,
        isFileSettingCall: 1,
        clientBillingAccount: billingAccountNumber,
        clientBillingBranch: billingAccountCompanyNumber,
        staticReportH2hExtension: fileformat,
        staticReportH2hDelimiter: delimeter
      };

      const payload = await trim(payloadFileObj);
      let promiseArray = [updateFileSettingsData(clientId, payload)];

      Promise.all(promiseArray)
        .then((response) => {
          this.setState({ isBtnClicked: false });
          if (response.error) {
            this.setState({
              errorMsg: typeof response.message === "string" ? response.message : "An unknown error has occured.",
              variant: "error"
            });
          } else {
            this.props.history.push({
              pathname: "/clientOnboard/b2c/remittance",
            });
          }
        })
        .catch((error) => {
          this.setState({
            errorMsg: typeof error === "string" ? error : "An unknown error has occured.",
            variant: "error"
          });
        });
    }
  };

  handleClosekMaxFieldError = () => {
    this.setState({ errorMsg: null });
  };

  handleClosekMaxFieldError = () => {
    this.setState({ errorMsg: null });
  };

  onChangeParameter = (name, checked, event) => {
    const newValue = checked ? 1 : 0;
    this.setState({ [name]: parseInt(newValue) });
  };

  render() {
    const { parentId,
      isLoading,
      showBanner,
      isBtnClicked,
      errorMsg,
      isCsv,
      isDat,
      isText,
      filecode,
      clientuid,
      fileformat,
      delimeter,
      delimeter1,
      billingAccountNumber,
      billingAccountCompanyNumber,
      paymentResFile,
      errors } = this.state;
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
          {Boolean(parentId) && showBanner && (
          <Grid item xs={12} className={classes.importText}>
            <PromptImport
              promptText="We noticed that your parent company is registered with us. Would you like to import the Payemnt information?"
              importCb={() => this.fetchAllFileSettingsDataByParentId()}
            />
          </Grid>
        )}
        <Paper display="flex" className={classes.root} elevation={1}>
          <Grid item xs={12} spacing={5}>
            <Typography className={`${classes.genralTitleBold} ${classes.mtTypo}`} style={{ marginTop: '0' }}>
              Payment File Settings:
            </Typography>
          </Grid>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={12}>
              <Typography variant="h5" component="h5" className={classes.bold}>
                Payment File Format
              </Typography>
            </Grid>
          </Grid>

        
           <Grid container spacing={4} className={classes.checkboxStyle}>
              <Grid item xs={3} sm={3}>
                <Box className={classes.kboxStyle}>
                  <FormControlLabel
                    aria-label="Payment file format"
                    onClick={(event) => event.stopPropagation()}
                    onFocus={(event) => event.stopPropagation()}
                    control={
                      <Checkbox
                        name={'isCsv'}
                        checked={isCsv === 1 ? true : false}
                        disabled={true}
                        onChange={this.onChangeCheckboxHandler}
                        icon={
                          <RadioButtonUncheckedIcon
                            style={{
                              color: "#fff", height: "18px",
                              width: "18px",
                            }}
                          />
                        }
                        checkedIcon={
                          <img
                            className={classes.checkClass}
                            src={require(`~/assets/icons/checkTick.svg`)}
                            alt=""
                          />
                        }
                        label={'CSV'}
                      />
                    }
                    label={'.csv'}
                  />
                </Box>
              </Grid>
              <Grid item xs={3} sm={3}>
                <Box className={classes.kboxStyle}>
                  <FormControlLabel
                    aria-label="Acknowledge"
                    onClick={(event) => event.stopPropagation()}
                    onFocus={(event) => event.stopPropagation()}
                    control={
                      <Checkbox
                        name={'isDat'}
                        checked={isDat === 1 ? true : false}
                        disabled={true}
                        onChange={this.onChangeCheckboxHandler}
                        icon={
                          <RadioButtonUncheckedIcon
                            style={{
                              color: "#fff", height: "18px",
                              width: "18px",
                            }}
                          />
                        }
                        checkedIcon={
                          <img
                            className={classes.checkClass}
                            src={require(`~/assets/icons/checkTick.svg`)}
                            alt=""
                          />
                        }
                      />
                    }
                    label={'.dat'}
                  />
                </Box>
              </Grid>
              <Grid item xs={3} sm={3}>
                <Box className={classes.kboxStyle}>
                  <FormControlLabel
                    aria-label="Acknowledge"
                    onClick={(event) => event.stopPropagation()}
                    onFocus={(event) => event.stopPropagation()}
                    control={
                      <Checkbox
                        name={'isText'}
                        checked={(isText === 1 || isText === true) ? true : false}
                        disabled={true}
                        onChange={this.onChangeCheckboxHandler}
                        icon={
                          <RadioButtonUncheckedIcon
                            style={{
                              color: "#fff", height: "18px",
                              width: "18px",
                            }}
                          />
                        }
                        checkedIcon={
                          <img
                            className={classes.checkClass}
                            src={require(`~/assets/icons/checkTick.svg`)}
                            alt=""
                          />
                        }
                      />
                    }
                    label={".txt"}
                  />
                </Box>
              </Grid>
            </Grid>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={12}>
              <Typography variant="h5" component="h5" className={classes.bold}>
                File Naming Convention
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            <Grid item xs={6} sm={6}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    name="clientuid"
                    label={'Client UID'}
                    variant="outlined"
                    value={clientuid}
                    onChange={(e) => this.onChangeHandler('clientuid', e)}
                    inputProps={{
                      maxLength: 10,
                    }}
                    required
                    onBlur={this.onBlurHandler}
                    error={errors?.clientuid || false}
                    helperText={errors?.clientuid || ''}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={4}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    select
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    name="delimeter1"
                    label={'Delimeter'}
                    variant="outlined"
                    onChange={(e) => this.onChangeHandler('delimeter1', e)}
                    value={delimeter1}
                  >
                    <MenuItem value={','}>{'Comma'}</MenuItem>
                    <MenuItem value={'|'}>{'Pipe'}</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6} sm={6}>
              <TextField
                fullWidth={true}
                color="secondary"
                autoComplete="off"
                name="filecode"
                label={'File Code'}
                variant="outlined"
                value={filecode}
                onChange={(e) => this.onChangeHandler('filecode', e)}
                inputProps={{ maxLength: 20 }}
                required
                onBlur={this.onBlurHandler}
                error={errors?.filecode || false}
                helperText={errors?.filecode || ''}
              />
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={12}>
              <Typography variant="h5" component="h5" className={classes.bold}>
                Do you want to receive Payment Response Files?
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={12}>
              <ToggleButtonGroup
                className={classes.fileBtnGroup}
                size="small"
                value={paymentResFile}
                exclusive
                onChange={this.handlePaymentFile}
                aria-label="File payment response"
              >
                <ToggleButton value="Y" aria-label="left aligned">
                  Yes
                </ToggleButton>
                <ToggleButton value="N" aria-label="centered">
                  No
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>

          <Grid container item direction="row"  >
            <Grid item xs={12} spacing={5}>
              <Typography className={`${classes.genralTitleBold} ${classes.mtTypo}`}>
                Report Settings:
              </Typography>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={6} sm={6}>
                <TextField
                  select
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="file format"
                  label={'File Format'}
                  variant="outlined"
                  onChange={(e) => this.onChangeHandler('fileformat', e)}
                  value={fileformat}
                  required
                >
                  <MenuItem value={'.csv'}>.{'CSV'}</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6} sm={6}>
                <TextField
                  select
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="delimeter"
                  label={'Delimeter'}
                  variant="outlined"
                  onChange={(e) => this.onChangeHandler('delimeter', e)}
                  value={delimeter}
                  required
                >
                  <MenuItem value={','}>{'Comma'}</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Grid>

          <Grid container item direction="row"  >
            <Grid item xs={12} spacing={5}>
              <Typography className={`${classes.genralTitleBold} ${classes.mtTypo}`}>
                Billing Feed Settings:
              </Typography>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={6} >
                <Box>
                  <TextField
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    name="billingAccountNumber"
                    label={'Billing Account Number'}
                    variant="outlined"
                    value={billingAccountNumber || ''}
                    required
                    inputProps={{ maxLength: 50 }}
                    onPaste={(e) => e.preventDefault()}
                    onChange={(event) => this.onChangeHandler("billingAccountNumber", event)}
                    onBlur={this.onBlurHandler}
                    error={errors?.billingAccountNumber || false}
                    helperText={errors?.billingAccountNumber || ''}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} >
                <Box>
                  <TextField
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    name="billingAccountCompanyNumber"
                    label={'Billing Account Company Number'}
                    variant="outlined"
                    value={billingAccountCompanyNumber || ''}
                    required
                    inputProps={{ maxLength: 500 }}
                    onChange={(event) => this.onChangeHandler("billingAccountCompanyNumber", event)}
                    onBlur={this.onBlurHandler}
                    error={errors?.billingAccountCompanyNumber || false}
                    helperText={errors?.billingAccountCompanyNumber || ''}
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} style={{ marginTop: '30px' }}>
            {isBtnClicked ?
              <Grid container direction="row" alignItems="center" justifyContent="center" spacing={3}>
                <Box display="flex" p={3} justifyContent="center" alignItems="center">
                  <CircularProgress color="primary" />
                </Box>
              </Grid> :
              <Grid container direction="row" alignItems="center" spacing={4}>
                <Grid container item xs={6} justify="flex-end">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={(e) =>
                      this.props.history.push({
                        pathname: `/clientOnboard/b2c/payments`,
                      })
                    }
                    className={`${classes.nextBtn}`}
                  >
                    Back
                  </Button>
                </Grid>
                <Grid container item xs={6} justify="flex-start">
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={this.saveFileSettingsData}
                    className={`${classes.nextBtn}`}
                  >
                    NEXT
                  </Button>
                </Grid>
              </Grid>}
          </Grid>
        </Paper>
        {errorMsg &&
          <Notification
            variant={'error'}
            message={errorMsg}
            handleClose={() => { this.setState({ errorMsg: null }) }}
          />}
      </>
    );
  }
}

export default connect((state) => ({ ...state.user }))(
  withStyles(styles)(FileSettings)
);
