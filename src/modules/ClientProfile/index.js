import React, { useEffect, useState } from "react";
import Button from "~/components/Forms/Button";
import TextField from "~/components/Forms/TextField";
import {
  Grid,
  makeStyles,
  Paper,
  MenuItem,
  Typography,
  Box,
  CircularProgress,
  Tooltip,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Divider
} from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import CountryPhoneCode from "../../components/Forms/CountryPhoneCode";
import {
  updateOnboardingCLient,
  getClientDataActivated,
} from "../../redux/actions/clients";
import { connect } from "react-redux";
import {
  getIndustryGroupList,
  getParentClientList,
  createClientProfile,
  getCardTypeList
} from "../../redux/helpers/clientProfileSetup";
import FormControlCheckBox from "../../components/Forms/FormControlCheckBox";
import "react-notifications/lib/notifications.css";
import SimpleDialog from "../../components/Model/SimpleDialog";
import MaskedInput from "../../components/MaskedInput";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import "./styles.scss";
import trim from 'deep-trim-node';
import Notification from "~/components/Notification";

import CheckIcon from "~/assets/icons/cc_check_icon.svg";
import CheckIcon_Selected from "~/assets/icons/check_icon_selected.svg";
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import { PayerTypes } from "~/config/entityTypes";

const useStyle = makeStyles((theme) => ({
  paper: {
    padding: 40,
  },
  title: {
    padding: "15px 0",
    borderBottom: "1px solid #d8d8d8",
    fontWeight: "500",
    textAlign: "left",
  },
  gridItemSpace: {
    paddingLeft: theme.spacing(2),
  },
  registered: {
    paddingLeft: theme.spacing(17),
  },
  clientTypeBox: {
    padding: '5px 10px',
    border: '1px solid #CCCCCC',
    borderRadius: theme.spacing(1),
    "&:hover": {
      boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.14), 0px 3px 3px -2px rgba(0, 0, 0, 0.12), 0px 1px 8px rgba(0, 0, 0, 0.2)",
    },
  },
  selectedTypeBox: {
    backgroundColor: '#008CE6',
    padding: '5px 10px',
    border: '1px solid #CCCCCC',
    borderRadius: theme.spacing(1),
    color: '#fff'
  },
  noteText: {
    fontSize: '12px',
    color: '#9E9E9E'
  },
  imageGrid: {
    textAlign: 'end',
    '& img': {
      padding: '6px 3px'
    },
    '& svg': {
      padding: '6px 3px'
    }
  },
  radioLabel: {
    width: '100%'
  },
  cardDivider: {
    display: 'inline-block',
    backgroundColor: '#9E9E9E',
    height: '27px',
    margin: '4px'
  },
  selectedCardDivider: {
    display: 'inline-block',
    backgroundColor: '#FFF',
    height: '27px',
    margin: '4px'
  },
  formControlStyle: {
    '& .MuiFormControlLabel-label': {
      marginRight: '0 !important'
    }
  }
}));

const StyledRadio = withStyles({
  root: {
    color: 'default',
    "&$checked": {
      color: '#fff'
    }
  },
  checked: {},
})((props) => <Radio size="small" color="default" {...props} />);

const ClientProfile = ({
  history,
  dispatch,
  // reInitStepper,
  updateOnboardingStep,
  updateOnboardTitle,
  match,
}) => {
  const [clientProfileDetail, setClientProfileDetail] = useState({
    data: {
      emailAddress: "",
      clientName: "",
      taxIdIsSSN: 0,
      taxId: "",
      identificationType: "",
      phoneNumber: "",
      phoneExt: "",
      countryCode: "+1",
      groupId: "",
      isHippa: 0,
      parentId: null,
      deletePreviousRecord: 0
    },
    error: {
      emailAddress: "",
      clientName: "",
      taxIdIsSSN: "",
      taxId: "",
      phoneNumber: "",
      phoneExt: "",
      countryCode: "",
      groupId: "",
      isHippa: "",
      parentId: "",
      identificationType: ""
    },
  });

  const [isRegisteredCompany, setIsRegisteredCompany] = useState(2);
  const [paymentClientType, setPaymentClientType] = useState(1);

  const handleChange = (event) => {
    setIsRegisteredCompany(parseInt(event.target.value));
    setClientProfileDetail({
      ...clientProfileDetail,
      data: { ...clientProfileDetail.data, parentId: null },
      error: { ...clientProfileDetail.error, parentId: "" },
    });
  };

  const dialogModalActions = {
    clientExistActions: [
      {
        label: "OK",
        onClickHandler: () => onCloseModal(),
        variant: "contained",
      },
    ],
    partialOnBoardActions: [
      {
        label: "No",
        onClickHandler: () => onPartialOnBoardAbortHandler(),
        variant: "ouPermissionsOptionListtlined",
      },
      {
        label: "Yes",
        onClickHandler: () => onPartialOnBoardProceedHandler(),
        variant: "contained",
      },
    ],
  };

  const [industryGroupList, setIndustryGroupList] = useState({
    data: [],
    error: {},
  });
  const [clientParentList, setClientParentList] = useState({
    data: [],
    error: {},
  });
  const [cardTypeList, setCardTypeList] = useState({
    data: [],
    error: {},
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedOnboardType] = useState(
    sessionStorage.getItem("selectedOnboardType")
  );
  const [clientId, setClientId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalActions, setModalActions] = useState(
    dialogModalActions.clientExistActions
  );
  const [modalTitle, setModalTitle] = useState("Response Error");
  const [, setApiClientProfileDetail] = useState({
    emailAddress: "",
    clientName: "",
    taxIdIsSSN: 0,
    taxId: "",
    phoneNumber: "",
    phoneExt: "",
    countryCode: "+1",
    groupId: "",
    isHippa: 0,
    parentId: null,
  });
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  useEffect(() => {
    fetchIndustryGroupList();
    fetchClientParentList();
    fetchCardTypeList();

    if (match && match.params && match.params.clientId) {
      setClientId(match.params.clientId);
      fetchClientInformation(match.params.clientId);
    } else if (selectedOnboardType === "self") {
      updateOnboardingStep(1);
    } else {
      updateOnboardTitle("COMPANY PROFILE SETUP");
    }
  }, []);

  const fetchClientInformation = async (clientId) => {
    const clientData = await getClientDataActivated(clientId);
    const { data = {}} = clientData;
    if (data.rows && data.rows[0]) {
      const {
        emailAddress,
        clientName,
        taxIdIsSSN,
        taxId,
        phoneNumber,
        phoneExt,
        countryCode,
        groupId,
        isHippa,
        parentId,
      } = data.rows[0];
      setClientProfileDetail({
        ...clientProfileDetail,
        data: {
          emailAddress,
          clientName,
          taxIdIsSSN,
          taxId,
          phoneNumber,
          phoneExt,
          countryCode,
          groupId,
          isHippa,
          parentId,
        },
      });
    }
  };

  const fetchIndustryGroupList = async () => {
    const industryGroupData = await getIndustryGroupList();
    const { data, error, message } = await industryGroupData;
    //console.log("industryGroupData +++++ -------", data, error, message)
    if (!error) {
      setIndustryGroupList({ ...industryGroupList, data: data && data.rows });
    } else {
      // report Error Message here for not getting grouplist;
      setIndustryGroupList({ ...industryGroupList, error: message });
    }
  };

  const fetchClientParentList = async () => {
    try {
      const clientParentData = await getParentClientList();
      const { data, error, message } = await clientParentData;
      //console.log("clientParentData +++++ -------", data, error, message)
      if (!error) {
        setClientParentList({ ...clientParentList, data: data.rows });
      } else {
        // report Error Message here for not getting grouplist;
        setClientParentList({ ...clientParentList, error: message });
      }
    } catch (error) {
    }
  };

  const fetchCardTypeList = async () => {
    try {
      const cardListData = await getCardTypeList();
      const { data, error, message } = await cardListData;
      if (!error) {
        setCardTypeList({ ...cardTypeList, data: data });
      } else {
        // report Error Message here for not getting grouplist;
        setCardTypeList({ ...cardTypeList, error: message });
      }
    } catch (error) {
    }
  }

  const onChange = (event) => {
    const { name, type, checked } = event.target;
    let { value } = event.target;
    if (type === "checkbox") {
      value = +checked;
    }
    if (type === "select") {
      value = value === "" ? null : value;
    }
    if (name === "identificationType") {
      value = value.replace(/[^A-Za-z0-9 ]/g, '');
    }
    setClientProfileDetail({
      ...clientProfileDetail,
      data: { ...clientProfileDetail.data, [name]: name === "taxId" ? value.replace(/[^0-9]/g, "") : value },
    });
  };

  const onNext = async (e, deletePreviousRecord = 0) => {
    const valid = formValidation();
    if (valid) {
      setIsLoading(true);
      let clientProfile = {
        ...clientProfileDetail.data,
        phoneNumber: clientProfileDetail?.data?.phoneNumber?.replace(/-/g, "") || null,
        phoneExt: clientProfileDetail?.data?.phoneExt?.replace(/-/g, "") || null,
        taxId: clientProfileDetail?.data?.taxId?.replace(/-/g, "") || null,
        ...(deletePreviousRecord ? { deletePreviousRecord } : {}),
        payerTypeId: paymentClientType || null
      };
      clientProfile = trim(clientProfile);
      const response = await createClientProfile(clientProfile);
      const { error, data, message } = response;
      if (!error && data.clientId) {
        const {
          clientId = null,
          isHippa = null,
          parentId = null,
          taxId = null,
          isVerified = null,
        } = data || [];
        sessionStorage.setItem("clientId", clientId);
        sessionStorage.setItem("parentId", parentId);
        sessionStorage.setItem("isHippa", isHippa || 0);

        await dispatch(
          updateOnboardingCLient({
            clientId,
            isHippa,
            parentId,
            taxId,
            isVerified,
          })
        );
        setIsLoading(false);
        // await dispatch(updateOnboardingStep());
        history.push(`/clientOnboard/clientPermissions/${clientId}`);
      } else {
        setIsLoading(false);
        if (
          message &&
          message ===
          "Your profile already exists in the system, do you wish to continue with the same profile information"
        ) {
          setModalActions(dialogModalActions.partialOnBoardActions);
          const { isVerified, clientId, ...apiData } = data;
          delete apiData["duns"];
          setApiClientProfileDetail(apiData);
          setClientProfileDetail({
            ...clientProfileDetail,
            data: { ...clientProfileDetail.data, deletePreviousRecord: 1 },
          });
        } else if (
          message &&
          message ===
          "Your profile already exists in the system, please contact to the profile owner"
        ) {
          setModalActions(dialogModalActions.clientExistActions);
        }
        setModalTitle(message || "Response Error");
        setOpenModal(!openModal);
      }
    } else {
      setAlertMessage("Validation error! Please fill the required information.");
      setAlertType("error");
    }
  };

  const updateError = (data) => {
    setClientProfileDetail({
      ...clientProfileDetail,
      error: { ...clientProfileDetail.error, ...data },
    });
  };

  const formValidation = () => {
    let validation = true;
    const dataError = {};
    const { data } = clientProfileDetail;
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;
    const {
      emailAddress,
      clientName,
      taxId,
      phoneNumber,
      phoneExt,
      countryCode,
      groupId,
      parentId,
    } = data;
    if (!emailAddress || emailAddress.length === 0) {
      dataError.emailAddress = "Email is required";
      validation = false;
    } else if (!reg.test(emailAddress)) {
      dataError.emailAddress = "Please enter valid Email Address";
      validation = false;
    }
    if (!clientName || clientName.length === 0) {
      dataError.clientName = "Company Name is required";
      validation = false;
    } else if (clientName && clientName.length > 100) {
      dataError.clientName =
        "Company Name should be less than or equals to 100 characters";
      validation = false;
    }

    if (!countryCode) {
      dataError.countryCode = "Country Code is required";
      validation = false;
    }

    if (phoneNumber && phoneNumber.length !== 0 && phoneNumber.length !== 10) {
      dataError.phoneNumber = "Phone Number should be of 10 digits";
      validation = false;
    } else if (phoneNumber && phoneNumber.length !== 0 && phoneNumber.startsWith("0")) {
      dataError.phoneNumber = "Phone Number should be valid";
      validation = false;
    }

    if (!taxId || taxId.trim().length === 0) {
      dataError.taxId = "Identification Number is required";
      validation = false;
    } else if (!taxId || taxId.length !== 9) {
      dataError.taxId = "Identification Number should be of 9 digits";
      validation = false;
    } else if (!taxId || taxId.startsWith("0")) {
      dataError.taxId = "Identification Number should be valid";
      validation = false;
    }

    if (phoneExt && phoneExt.length > 10) {
      dataError.phoneExt = "Extension should not be more than 10 digits";
      validation = false;
    }

    if (!groupId || groupId.length === 0) {
      dataError.groupId = "Industry Type is required";
      validation = false;
    }
    if (isRegisteredCompany === 1 && !parentId) {
      dataError.parentId = "Parent Company is required";
      validation = false;
    }

    updateError(dataError);
    return validation;
  };

  const Validation = (event) => {
    const { name } = event.target;
    const { value } = event.target;
    let validation = true;
    const dataError = { [name]: "" };
    switch (name) {
      case "emailAddress":
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;
        if (value.length === 0) {
          dataError[name] = "Email is required";
          validation = false;
        } else if (!re.test(value.trim().toLowerCase())) {
          dataError[name] = "Please enter valid Email Address";
          validation = false;
        }

        break;
      case "clientName":
        if (value.length === 0) {
          dataError[name] = "Company Name is required";
          validation = false;
        } else if (value && value.length > 100) {
          dataError[name] =
            "Company Name should be less than or equals to 100 characters";
          validation = false;
        }
        break;
      case "countryCode":

        if (value.length === 0) {
          dataError[name] = "Country Code is required";
          validation = false;
        }

        break;
      case "taxId":

        if (!taxId || taxId.trim().length === 0) {
          dataError[name] = "Identification Number is required";
          validation = false;
        } else if (taxId.length !== 9) {
          dataError[name] = "Identification Number should be of 9 digits";
          validation = false;
        } else if (!taxId || taxId.startsWith("0")) {
          dataError[name] = "Identification Number should be valid";
          validation = false;
        }

        break;
      case "phoneNumber":

        if (phoneNumber.length !== 0 && phoneNumber.length !== 10) {
          dataError[name] = "Phone Number should be of 10 digits";
          validation = false;
        } else if (phoneNumber.length !== 0 && phoneNumber.startsWith("0")) {
          dataError[name] = "Phone Number should be valid";
          validation = false;
        }

        break;
      case "phoneExt":
        if (value.length > 10) {
          dataError[name] = "Please Enter a Valid phone Extention";
          validation = false;
        }
        break;
      case "groupId":
        if (value.length === 0) {
          dataError[name] = "Industry Type is required";
          validation = false;
        }

        break;
      case "parentId":
        if (isRegisteredCompany === 1 && !value) {
          dataError.parentId = "Parent Company is required";
          validation = false;
        }
        break;
      default: 
      break;
    }
    updateError(dataError);
  };

  const classes = useStyle();
  const { data, error } = clientProfileDetail;

  const tooltipPC = {
    title: "Clients have the option to maintain multiple PMTX profiles within 1 Parent Company PMTX profile. This is typically used when a company has different business lines who want to have separate PMTX profiles but management wants to have 1 profile that gives consolidated reporting and views for all the profiles. If this is the first time a company is signing up to use PMTX, they will always fall into the 'Register yourself as Parent Company' bucket here.",
    arrow: true,
    placement: "right-end",
  };

  const {
    emailAddress,
    clientName,
    taxIdIsSSN,
    taxId,
    identificationType,
    phoneNumber,
    phoneExt,
    countryCode,
    groupId,
    isHippa,
    parentId
  } = data;
  const {
    emailAddress: emailAddressError,
    clientName: clientNameError,
    taxIdIsSSN: taxIdIsSSNError,
    taxId: taxIdError,
    phoneNumber: phoneNumberError,
    phoneExt: phoneExtError,
    countryCode: countryCodeError,
    groupId: groupIdError,
    isHippa: isHippaError,
    parentId: parentIdError,
    identificationType: identificationTypeError,
  } = error;

  const onCloseModal = () => {
    setOpenModal(false);
  };

  const onPartialOnBoardAbortHandler = () => {
    setOpenModal(false);
    onNext(null, 1);
  };

  const onPartialOnBoardProceedHandler = () => {
    setOpenModal(false);
    setApiClientProfileDetail((apiState) => {
      const data = apiState;
      setClientProfileDetail((state) => ({
        data: {
          ...state.data,
          ...data,
        },
        error: {
          emailAddress: "",
          clientName: "",
          taxIdIsSSN: "",
          taxId: "",
          phoneNumber: "",
          phoneExt: "",
          countryCode: "",
          groupId: "",
          isHippa: "",
          parentId: "",
        },
      }));
    });
  };

  const renderSnackbar = (type, message) => {
    return <Notification variant={type} message={message} handleClose={hideAlertMessage} />
  }

  const hideAlertMessage = () => {
    setAlertMessage(null);
    setAlertType(null);
  }

  const onPaymentChangeHandler = (event) => {
    setPaymentClientType(Number(event.target.value))
  }
  return (
    <>
      <Box m={6}>
        <Paper elevation={3} className={classes.paper}>
          <Grid
            className="textfieldContainer"
            container
            direction="row"
            spacing={4}
          >
            <Grid
              item
              container
              xs={12}
              lg={12}
              justify="flex-start"
              spacing={4}
            >
              <Grid item xs={6}>
                <Typography style={{ paddingBottom: '10px' }}>
                  Company Profile Details
                </Typography>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <TextField
                      color="secondary"
                      name={"clientName"}
                      id={"clientName"}
                      label={"Company Name"}
                      type="text"
                      value={clientName}
                      required
                      onChange={onChange}
                      onBlur={Validation}
                      error={Boolean(clientNameError)}
                      helperText={clientNameError}
                      disabled={Boolean(clientId)}
                      inputProps={{ maxLength: 100 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item xs={3}>
                        <CountryPhoneCode
                          name={"countryCode"}
                          id={"countryCode"}
                          label={"Country"}
                          type={"select"}
                          value={countryCode}
                          onChange={onChange}
                          disabled={Boolean(clientId)}
                          excludeCountryCode={["CA", "UM"]}
                        />
                      </Grid>
                      <Grid item xs={6} className={classes.gridItemSpace}>
                        <MaskedInput
                          value={phoneNumber}
                          name="phoneNumber"
                          type="text"
                          label="Phone"
                          id={"phoneNumber"}
                          onChange={onChange}
                          onBlur={Validation}
                          placeholder={"XXX-XXX-XXXX"}
                          error={Boolean(phoneNumberError)}
                          helperText={phoneNumberError}
                          inputProps={{ maxLength: 10 }}
                          disabled={Boolean(clientId)}
                          formatterProps={{
                            format: "###-###-####",
                            isNumericString: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={3} className={classes.gridItemSpace}>
                        <TextField
                          name={"phoneExt"}
                          color="secondary"
                          id={"phoneExt"}
                          label={"Ext"}
                          type="text"
                          value={phoneExt}
                          onChange={onChange}
                          onBlur={Validation}
                          error={Boolean(phoneExtError)}
                          helperText={phoneExtError}
                          inputProps={{ maxLength: 10 }}
                          disabled={Boolean(clientId)}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      name={"emailAddress"}
                      color="secondary"
                      id={"emailAddress"}
                      label={"Email Address"}
                      type="text"
                      value={emailAddress}
                      required
                      onChange={onChange}
                      onBlur={Validation}
                      error={Boolean(emailAddressError)}
                      helperText={emailAddressError}
                      //tooltipProps={showEmailInfo ? tooltipObj : ""}
                      disabled={Boolean(clientId)}
                      inputProps={{ maxLength: 50 }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* for commercial card */}
              <Grid item xs={6}>
                <Box>
                  <Typography style={{ paddingBottom: '10px' }}>
                    Choose Payer Type
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup aria-label="quiz" name="quiz" value={paymentClientType} onChange={onPaymentChangeHandler}>
                      <Grid container spacing={2}>

                        {cardTypeList.data &&
                          cardTypeList.data.map(({ name, payerTypeId }) => (
                            <Grid item xs={12}>
                              <Box className={paymentClientType == payerTypeId ? classes.selectedTypeBox : classes.clientTypeBox}>
                                <Grid container>
                                  <Grid item xs={9}>
                                    <FormControlLabel
                                      className={classes.radioLabel}
                                      value={payerTypeId}
                                      control={<StyledRadio />}
                                      label={name}
                                    />
                                  </Grid>
                                  <Grid item xs={3} className={classes.imageGrid}>
                                    {payerTypeId == PayerTypes.PMTX ? <>
                                      <CreditCardIcon fontSize="small" htmlColor={paymentClientType == payerTypeId ? "#FFF" : "#9E9E9E"} />
                                      <AccountBalanceIcon fontSize="small" htmlColor={paymentClientType == payerTypeId ? "#FFF" : "#9E9E9E"} />
                                      <img src={paymentClientType == payerTypeId ? CheckIcon_Selected : CheckIcon} alt={"Check"} width="24" height="24" />
                                    </> : null}

                                    {payerTypeId == PayerTypes.CARDS ?
                                      <CreditCardIcon fontSize="small" htmlColor={paymentClientType == payerTypeId ? "#FFF" : "#9E9E9E"} />
                                      : null}

                                    {payerTypeId == PayerTypes.OTHERS ? <>
                                      <CreditCardIcon fontSize="small" htmlColor={paymentClientType == payerTypeId ? "#FFF" : "#9E9E9E"} />
                                      <Divider orientation="vertical" className={paymentClientType == payerTypeId ? classes.selectedCardDivider : classes.cardDivider} />
                                      <AccountBalanceIcon fontSize="small" htmlColor={paymentClientType == payerTypeId ? "#FFF" : "#9E9E9E"} />
                                      <img src={paymentClientType == payerTypeId ? CheckIcon_Selected : CheckIcon} alt={"Check"} width="24" height="24" />
                                    </> : null}
                                  </Grid>
                                </Grid>
                              </Box>
                            </Grid>
                          ))}
                      </Grid>
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Grid container spacing={4}>
                  <Grid item xs={6}>
                    <TextField
                      select
                      color="secondary"
                      name={"taxIdIsSSN"}
                      id={"taxIdIsSSN"}
                      label={"Identification Number Type"}
                      type={"select"}
                      value={taxIdIsSSN}
                      required
                      onChange={onChange}
                      disabled={Boolean(clientId)}
                    >
                      <MenuItem key={"0"} value={1}>
                        Social Security Number
                      </MenuItem>
                      <MenuItem key={"1"} value={0}>
                        Federal Tax ID
                      </MenuItem>
                      <MenuItem key={"2"} value={2}>
                        Other Identification
                      </MenuItem>
                      {/* <MenuItem key={"3"} value={3}>
                        None
                      </MenuItem> */}
                    </TextField>
                  </Grid>

                  {taxIdIsSSN === 2 ?
                    <Grid item xs={6}>
                      <TextField
                        name={"identificationType"}
                        color="secondary"
                        id="specificationLabel"
                        label="Identification Type"
                        type="text"
                        value={identificationType}
                        //required
                        placeholder="Identification Type"
                        onChange={onChange}
                        onBlur={Validation}
                        error={Boolean(identificationTypeError)}
                        helperText={identificationTypeError}
                        inputProps={{ maxLength: 50 }}
                        disabled={Boolean(clientId)}
                      />
                    </Grid>
                    : null}

                  <Grid item xs={taxIdIsSSN === 2 ? 12 : 6}>
                    {/* <MaskedInput
                                    value={taxId}
                                    name="taxId"
                                    type="text"
                                    label="Federal Tax ID/SSN"
                                    id={"taxId"}
                                    onChange={onChange}
                                    onBlur={Validation}
                                    placeholder={"XXXXXXXXX"}
                                    error={Boolean(taxIdError)}
                                    helperText={taxIdError}
                                    inputProps={{ maxLength: 9 }}
                                    disabled={Boolean(clientId)}
                                    formatterProps={{
                                        format: "#########",
                                        isNumericString: true,
                                      }}
                                    required
                                /> */}
                    <TextField
                      name={"taxId"}
                      color="secondary"
                      id={"taxId"}
                      label={"Identification Number"}
                      type="text"
                      value={taxId}
                      required
                      placeholder={"XXXXXXXXX"}
                      onChange={onChange}
                      onBlur={Validation}
                      error={Boolean(taxIdError)}
                      helperText={taxIdError}
                      inputProps={{ maxLength: 9 }}
                      disabled={Boolean(clientId)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      select
                      color="secondary"
                      name={"groupId"}
                      id={"groupId"}
                      label={"Industry Type"}
                      type={"select"}
                      value={groupId}
                      required
                      onChange={onChange}
                      onBlur={Validation}
                      error={Boolean(groupIdError)}
                      helperText={groupIdError}
                      disabled={Boolean(clientId)}
                    >
                      {industryGroupList.data &&
                        industryGroupList.data.map(({ name, groupId }) => (
                          <MenuItem key={groupId} value={groupId}>
                            {name}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container spacing={4}>
                      <Grid item xs={12}>
                        <Typography>
                          Is your Parent Company already registered with us?
                          <Tooltip {...tooltipPC} >
                            <Box p={1} component="div" display="inline" style={{ verticalAlign: "middle" }}>
                              <InfoOutlinedIcon color="primary" />
                            </Box>
                          </Tooltip>
                        </Typography>
                        <Grid item xs={12}>
                          <FormControl component="fieldset" fullWidth>
                            <RadioGroup row aria-label="position" name="isRegisteredCompany" value={isRegisteredCompany || 2} onChange={handleChange}>
                              <FormControlLabel
                                value={1}
                                control={<Radio color="primary" />}
                                label="Registered"
                                labelPlacement="end"
                              />
                              <FormControlLabel
                                //className={classes.registered}
                                value={2}
                                control={<Radio color="primary" />}
                                label="Register yourself as Parent Company"
                                labelPlacement="end"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          select
                          color="secondary"
                          name={"parentId"}
                          id={"parentId"}
                          label={"Parent Company"}
                          type={"select"}
                          value={parentId || ""}
                          // required
                          onChange={onChange}
                          onBlur={Validation}
                          error={Boolean(parentIdError)}
                          helperText={parentIdError || ""}
                          disabled={Boolean(clientId) || (isRegisteredCompany === 2)}
                        >
                          <MenuItem key={"none"} value={null}>
                            <em>Select Company</em>
                          </MenuItem>
                          {clientParentList.data &&
                            clientParentList.data.map(({ clientName, clientId }) => (
                              <MenuItem key={clientId} value={clientId}>
                                {clientName}
                              </MenuItem>
                            ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} className={classes.formControlStyle}>
                        <FormControlCheckBox
                          name={"isHippa"}
                          id={"isHippa"}
                          label={"HIPAA"}
                          checked={Boolean(isHippa)}
                          onChange={onChange}
                          disabled={Boolean(clientId)}
                        />
                        <Tooltip
                          title="Clients providing support in treatment, payment, and operations in healthcare and business associates; must select this checkbox"
                          arrow
                          placement="right"
                        >
                          <InfoOutlinedIcon style={{ verticalAlign: "middle" }} />
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Grid>

                </Grid>
              </Grid>

              {/* <Grid container item xs={12}>
                <Grid item xs={6}>
                  <Typography>
                    Is your Parent Company already registered with us?
                    <Tooltip {...tooltipPC} >
                      <Box p={1} component="div" display="inline" style={{ verticalAlign: "middle" }}>
                        <InfoOutlinedIcon color="primary" />
                      </Box>
                    </Tooltip>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup row aria-label="position" name="isRegisteredCompany" value={isRegisteredCompany || 2} onChange={handleChange}>
                      <FormControlLabel
                        value={1}
                        control={<Radio color="primary" />}
                        label="Registered"
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        className={classes.registered}
                        value={2}
                        control={<Radio color="primary" />}
                        label="Register yourself as Parent Company"
                        labelPlacement="end"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid> */}

              {/* <Grid item xs={3}>
                <TextField
                  select
                  color="secondary"
                  name={"parentId"}
                  id={"parentId"}
                  label={"Parent Company"}
                  type={"select"}
                  value={parentId || ""}
                  // required
                  onChange={onChange}
                  onBlur={Validation}
                  error={Boolean(parentIdError)}
                  helperText={parentIdError || ""}
                  disabled={Boolean(clientId) || (isRegisteredCompany === 2)}
                >
                  <MenuItem key={"none"} value={null}>
                    <em>Select Company</em>
                  </MenuItem>
                  {clientParentList.data &&
                    clientParentList.data.map(({ clientName, clientId }) => (
                      <MenuItem key={clientId} value={clientId}>
                        {clientName}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid> */}

            </Grid>

            {/* <Grid item xs={6}>
              <FormControlCheckBox
                name={"isHippa"}
                id={"isHippa"}
                label={"HIPAA"}
                checked={Boolean(isHippa)}
                onChange={onChange}
                disabled={Boolean(clientId)}
              />
              <Tooltip
                title="Clients providing support in treatment, payment, and operations in healthcare and business associates; must select this checkbox"
                arrow
                placement="right"
              >
                <InfoOutlinedIcon style={{ verticalAlign: "middle" }} />
              </Tooltip>
            </Grid> */}
          </Grid>
        </Paper>

        {!clientId && (
          <Grid item container xs={12} justify="center" spacing={3}>
            <Box pt={4}>
              {isLoading ? (
                <CircularProgress color="primary" />
              ) : (
                <Button
                  color="primary"
                  onClick={onNext}
                  //  disabled={isNextDisabled}
                  style={{ color: "white", padding: "0.60rem 2.15rem", fontSize: 14 }}

                >
                  NEXT
                </Button>
              )}
            </Box>
          </Grid>
        )}

        {alertMessage && renderSnackbar(alertType, alertMessage)}
        <SimpleDialog
          open={openModal}
          onCloseModal={onCloseModal}
          modalActions={modalActions}
          title={modalTitle}
        // subtitle={subtitle}
        />
      </Box>
    </>
  );
};

export default connect()(ClientProfile);
