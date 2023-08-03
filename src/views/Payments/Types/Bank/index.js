import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  MenuItem,
  Button,
  CircularProgress,
} from "@material-ui/core";
import TextField from "~/components/Forms/TextField";
import { makeStyles } from "@material-ui/core/styles";
import {
  updateBankInfo,
  createBankInfo,
  achProfilesInformation,
} from "~/redux/actions/payments";
import { connect } from "react-redux";
import { getTransactionType } from "~/redux/actions/payments";
import MultiCheckBoxGroup from "~/components/Forms/MultiCheckBoxGroup";
import Divider from "~/components/Divider";
import { getClientTransactionType } from "~/redux/actions/payments";
import "react-notifications/lib/notifications.css";
import MaskInput from "~/components/MaskInput";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .PrivateNotchedOutline-legendLabelled-140": {
      fontSize: "0.87em !important",
    },
  },
  gridItem: {
    margin: 0,
    "& .MuiOutlinedInput-notchedOutline": {
      "& legend": {
        fontSize: "0.85em"
      }
    },
  },
  saveButton: {
    fontSize: 14,
    color: 'white'
  }
}));

const Bank = ({
  currencyList = [],
  clientId,
  parentId,
  isHippa,
  bankDetail,
  showParentInfo,
  paymentType,
  dispatch,
  onPaymentMethodSave,
  notification,
}) => {
  const [saveProcessing, setSaveProcessing] = useState(false);
  const [AccounttransactionType, setTransactionTypes] = useState([]);
  const [bankDetailInfo, setBankDetailInfo] = useState({
    data: {
      accountId: "",
      accountName: null,
      accountNumber: null,
      routingCode: null,
      AchProfileId: "",
      companyName: null,
      immediateOrigin: "",
      immediateOriginName: "",
      immediateDestination: "",
      immediateDestinationName: "",
      companyIdentification: null,
      companyEntryDescription: null,
      companyDiscretionaryData: null,
      originatingDFIIdentification: null,
      originatingDFIDiscretionaryData: null,
      cardAccountId: "",
      bankName: "",
      bankAddress1: "",
      bankAddress2: "",
      bankCity: "",
      bankStateRegion: "",
      bankZipPostal: "",
      BankContact: "",
      bankContactEmail: "",
      bankPhone: "",
      bankPhoneExt: "",
      accountClassification: "",
      currencyCode: null,
      currency: "",
      paymentMethodId: "",
      acctClassId: "",
      transactionType: [],
      formatingFlags: "",
      originatorShortName: "",
      bankCountryIso: null,
      GS02: null,
      GS03: null,
      type: paymentType,
    },
    error: {
      accountId: "",
      accountName: "",
      accountNumber: "",
      routingCode: "",
      AchProfileId: "",
      companyName: "",
      companyIdentification: "",
      companyEntryDescription: "",
      companyDiscretionaryData: "",
      originatingDFIIdentification: "",
      originatingDFIDiscretionaryData: "",
      cardAccountId: "",
      bankName: "",
      bankAddress1: "",
      bankAddress2: "",
      bankCity: "",
      bankStateRegion: "",
      bankZipPostal: "",
      bankCountryIso: "",
      BankContact: "",
      bankContactEmail: "",
      bankPhone: "",
      bankPhoneExt: "",
      accountClassification: "",
      currencyCode: "",
      currency: "",
      paymentMethodId: "",
      acctClassId: "",
      formatingFlags: "",
      transactionType: [],
      originatorShortName: "",
      GS02: "",
      GS03: "",
      type: paymentType,
    },
  });

  useEffect(() => {
    initBankInformation();
    fetchTransactionType();
  }, [bankDetail, showParentInfo]);

  const classes = useStyles();
  const { data, error } = bankDetailInfo;
  const {
    accountId,
    accountName,
    accountNumber,
    routingCode,
    companyName,
    immediateOrigin,
    immediateOriginName,
    immediateDestination,
    immediateDestinationName,
    companyIdentification,
    companyEntryDescription,
    companyDiscretionaryData,
    originatingDFIIdentification,
    originatingDFIDiscretionaryData,
    transactionType,
    bankCountryIso,
    currencyCode,
    GS02,
    GS03,
    type,
  } = data;

  const initBankInformation = async () => {
    let ID = clientId;
    if (showParentInfo) {
      ID = parentId;
    }
    const transactionType = await getClientTransactionType(ID, paymentType);
    const achImmediateInfo = await achProfilesInformation();
    let transactionTypeArr = [];
    let achImmediateInfoArr = [];

    if (achImmediateInfo && achImmediateInfo.data) {
      const { data = [] } = achImmediateInfo;
      achImmediateInfoArr = data || [];
      // const immediateOriginFields = await get
    }
    if (transactionType && transactionType.data) {
      const { data } = transactionType.data;
      transactionTypeArr = data.rows || [];
    }
    setBankDetailInfo({
      ...bankDetailInfo,
      data: {
        ...bankDetailInfo.data,
        ...bankDetail,
        transactionType: transactionTypeArr,
        ...achImmediateInfoArr,
      },
    });
  };

  const removeArrElement = (ele, arr) => {
    const index = arr.indexOf(ele);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  };

  const onChangeTransactionType = (event) => {
    const { checked } = event.target;
    let { value } = event.target;
    const newTransactionType = checked
      ? [...(transactionType || []), parseInt(value)]
      : removeArrElement(parseInt(value), transactionType);

    setBankDetailInfo({
      ...bankDetailInfo,
      data: {
        ...bankDetailInfo.data,
        transactionType: newTransactionType,
        bankCountryIso: null,
        currencyCode: null,
      },
    });
  };

  const onChange = (event) => {
    const { name, type } = event.target;
    let { value } = event.target;

    if (type === "select") {
      value = value === "" ? null : value;
    }

    setBankDetailInfo({
      ...bankDetailInfo,
      data: { ...bankDetailInfo.data, [name]: value === "" ? null : value },
    });
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setBankDetailInfo({
      ...bankDetailInfo,
      data: {
        ...bankDetailInfo.data,
        [name]: value === "" ? null : value.trim(),
      },
    });
  };

  const onSubmit = () => {
    const valid = validation();
    setSaveProcessing(true);
    if (valid) {
      const clientId = sessionStorage.getItem("clientId");
      const data = {
        accountId,
        accountName,
        accountNumber,
        routingCode,
        currencyCode,
        // currency,
        companyName,
        companyIdentification,
        companyEntryDescription,
        companyDiscretionaryData,
        originatingDFIIdentification,
        originatingDFIDiscretionaryData,
        bankCountryIso,
        transactionType,
        type,
      };

      if (Boolean(isHippa)) {
        data.isHippaInformation = { GS02, GS03 };
      }

      // const valid = this.validateForm("ACH") || true;
      if (accountId) {
        dispatch(
          updateBankInfo({
            clientId: clientId,
            paymentType: data.type,
            bankDetail: data,
          })
        ).then((response) => {
          setSaveProcessing(false);
          if (response && !response.error) {
            notification(
              "success",
              "Information has been Updated Successfully."
            );
            onPaymentMethodSave(paymentType);
          } else {
            notification("error", "Something went wrong");
            return false;
          }
        });
      } else {
        const { accountId, ...restBankDetail } = data;
        dispatch(
          createBankInfo({
            clientId: clientId,
            paymentType: data.type,
            bankDetail: restBankDetail,
          })
        ).then((response) => {
          if (response && response.data && response.data.accountId) {
            setBankDetailInfo({
              //...bankDetailInfo,
              error: {
                accountId: "",
                accountName: "",
                accountNumber: "",
                routingCode: "",
                AchProfileId: "",
                companyName: "",
                companyIdentification: "",
                companyEntryDescription: "",
                companyDiscretionaryData: "",
                originatingDFIIdentification: "",
                originatingDFIDiscretionaryData: "",
                cardAccountId: "",
                bankName: "",
                bankAddress1: "",
                bankAddress2: "",
                bankCity: "",
                bankStateRegion: "",
                bankZipPostal: "",
                bankCountryIso: "",
                BankContact: "",
                bankContactEmail: "",
                bankPhone: "",
                bankPhoneExt: "",
                accountClassification: "",
                currencyCode: "",
                currency: "",
                paymentMethodId: "",
                acctClassId: "",
                formatingFlags: "",
                transactionType: [],
                originatorShortName: "",
                GS02: "",
                GS03: "",
                type: paymentType,
              },
              data: {
                ...bankDetailInfo.data,
                accountId: response.data.accountId,
              },
            });
            notification(
              "success",
              "Information has been Updated Successfully."
            );
            onPaymentMethodSave(paymentType);
          } else {
            notification("error", "Something went wrong");
          }
          setSaveProcessing(false);
        });
      }
    } else {
      notification(
        "error",
        "Validation error! Please fill the required information."
      );
      setSaveProcessing(false);
    }
  };

  const fetchTransactionType = async () => {
    const transactionTypeData = await getTransactionType();
    const { data, error } = await transactionTypeData;
    const AccountTransactionTypes =
      data &&
      data.rows.filter(({ paymentCode }) => {
        return paymentCode === paymentType;
      });
    if (!error) {
      setTransactionTypes(AccountTransactionTypes);
    } else {
      // report Error Message here for not getting grouplist;
      setTransactionTypes([]);
    }
  };
  const ACHOptions = Array.isArray(AccounttransactionType)
    ? AccounttransactionType.map(
        ({ currency, transactionTypeId, bankCountryIso, paymentCode }) => ({
          name: currency,
          value: transactionTypeId,
          label: `${bankCountryIso} ${currency}`,
        })
      )
    : [];

  const currencyListOptions = () => {
    if (
      Array.isArray(transactionType) &&
      Array.isArray(AccounttransactionType)
    ) {
      const selectedCurrencyList = AccounttransactionType.filter(
        ({ transactionTypeId, bankCountryIso: bankIso }) =>
          transactionType.includes(transactionTypeId) &&
          bankCountryIso === bankIso
      ).map(({ currency }) => currency);

      const newCurrencyList = currencyList.filter(
        ({ isoNumeric, isoCode, name }) =>
          selectedCurrencyList.includes(isoCode)
      );
      return newCurrencyList;
    }
    return [];
  };

  const bankCountryISOptions = () => {
    if (
      Array.isArray(transactionType) &&
      Array.isArray(AccounttransactionType)
    ) {
      const selectedCountryISOList = AccounttransactionType.filter(
        ({ transactionTypeId }) => transactionType.includes(transactionTypeId)
      ).map(({ bankCountryIso }) => bankCountryIso);

      return [...new Set(selectedCountryISOList)];
    }
    return [];
  };

  const validation = () => {
    let valid = true;
    let validation = {};

    if (!accountNumber || accountNumber.length === 0) {
      validation["accountNumber"] = "Account Number is required";
      valid = false;
    }
    if (accountNumber && accountNumber.length > 17) {
      validation["accountNumber"] =
        "Account Number must not be greater than 17 digits.";
      valid = false;
    }
    if (accountNumber && accountNumber.length < 6) {
      validation["accountNumber"] =
        "Account Number must not be less than 6 digits.";
      valid = false;
    }
    if (accountName && accountName.length > 50) {
      validation["accountName"] =
        "Account Name must not be greater than 50 digits.";
      valid = false;
    }
    if (routingCode && routingCode.length !== 9) {
      validation["routingCode"] = "Routing code must be of 9 digits.";
      valid = false;
    }
    if (companyName && companyName.length > 16) {
      validation["companyName"] =
        "Company Name must not be greater than 16 digits.";
      valid = false;
    }
    if (companyIdentification && companyIdentification.length !== 10) {
      validation["companyIdentification"] =
        "CompanyIdentification must be of 10 digits.";
      valid = false;
    }
    if (companyEntryDescription && companyEntryDescription.length < 2) {
      validation["companyEntryDescription"] =
        "CompanyEntryDescription must not be less than 2 digits.";
      valid = false;
    }
    if (companyEntryDescription && companyEntryDescription.length > 10) {
      validation["companyEntryDescription"] =
        "CompanyEntryDescription must not be greater than 10 digits.";
      valid = false;
    }
    if (companyDiscretionaryData && companyDiscretionaryData.length > 20) {
      validation["companyDiscretionaryData"] =
        "CompanyDiscretionaryData must not be greater than 20 digits.";
      valid = false;
    }
    if (
      originatingDFIIdentification &&
      originatingDFIIdentification.length !== 8
    ) {
      validation["originatingDFIIdentification"] =
        "originatingDFIIdentification must be of 8 digits.";
      valid = false;
    }
    if (
      originatingDFIDiscretionaryData &&
      originatingDFIDiscretionaryData.length > 2
    ) {
      validation["originatingDFIDiscretionaryData"] =
        "OriginatingDFIDiscretionaryData must not be greater than 2 digits.";
      valid = false;
    }
    if (bankCountryIso && bankCountryIso.length > 2) {
      validation["bankCountryIso"] =
        "Bank Country ISO must not be greater than 2 digits.";
      valid = false;
    }
    if (currencyCode && currencyCode.length > 3) {
      validation["currencyCode"] =
        "Currency Code must not be greater than 3 digits.";
      valid = false;
    }
    
    setBankDetailInfo({
      ...bankDetailInfo,
      error: {...validation }
    });
    return valid;
  };

  return (
    <Box className={classes.root}>
      <Grid container>
        <>
          <Grid container item>
            <Grid item xs={12} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <MultiCheckBoxGroup
                  key={"transactionType"}
                  label={"Transaction Type"}
                  options={ACHOptions}
                  onChangeCheckBox={onChangeTransactionType}
                  selectedCheckbox={transactionType || []}
                />
              </Box>
              <Box pb={1}>
                <Divider />{" "}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 50,
                    minLength: 1,
                  }}
                  label="Account Name"
                  error={Boolean(error.accountName)}
                  helperText={error.accountName}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={accountName}
                  name="accountName"
                  onChange={onChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 9,
                    minLength: 9,
                  }}
                  label="Bank Routing Code"
                  error={Boolean(error.routingCode)}
                  helperText={error.routingCode}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={routingCode}
                  name="routingCode"
                  onChange={onChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <MaskInput
                  inputProps={{
                    maxLength: 17,
                    minLength: 6,
                  }}
                  label="Bank Account Number"
                  error={Boolean(error.accountNumber)}
                  helperText={error.accountNumber}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={accountNumber}
                  name="accountNumber"
                  getValue={(val) => {
                    setBankDetailInfo({
                      ...bankDetailInfo,
                      data: { ...bankDetailInfo.data, accountNumber: val },
                    });
                  }}
                  required
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 3,
                  }}
                  label="Bank Country ISO"
                  error={Boolean(error.bankCountryIso)}
                  helperText={error.bankCountryIso}
                  select
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={bankCountryIso}
                  name="bankCountryIso"
                  onChange={onChange}
                >
                  <MenuItem key={""} value={""}>
                    Select
                  </MenuItem>
                  {bankCountryISOptions().map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  select
                  label="Currency"
                  error={Boolean(error.currencyCode)}
                  helperText={error.currencyCode}
                  value={currencyCode}
                  name="currencyCode"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  onChange={onChange}
                >
                  <MenuItem key={""} value={""}>
                    Select
                  </MenuItem>
                  {currencyListOptions().map(
                    ({ isoNumeric, isoCode, name }) => (
                      <MenuItem key={isoCode} value={isoCode}>
                        {name}
                      </MenuItem>
                    )
                  )}
                </TextField>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 16,
                    minLength: 1,
                  }}
                  label="Company Name"
                  error={Boolean(error.companyName)}
                  helperText={error.companyName}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={companyName}
                  name="companyName"
                  onChange={onChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 10,
                    minLength: 10,
                  }}
                  label=" Company Identification Number"
                  error={Boolean(error.companyIdentification)}
                  helperText={error.companyIdentification}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={companyIdentification}
                  name="companyIdentification"
                  onChange={onChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 10,
                    minLength: 2,
                  }}
                  label="Company Entry Description"
                  error={Boolean(error.companyEntryDescription)}
                  helperText={error.companyEntryDescription}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={companyEntryDescription}
                  name="companyEntryDescription"
                  onChange={onChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 20,
                    minLength: 1,
                  }}
                  label="Company Discretionary Data"
                  error={Boolean(error.companyDiscretionaryData)}
                  helperText={error.companyDiscretionaryData}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={companyDiscretionaryData}
                  name="companyDiscretionaryData"
                  onChange={onChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  label="Originating DFI Identification"
                  error={Boolean(error.originatingDFIIdentification)}
                  helperText={error.originatingDFIIdentification}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    maxLength: 8,
                    minLength: 8,
                  }}
                  variant="outlined"
                  value={originatingDFIIdentification}
                  name="originatingDFIIdentification"
                  onChange={onChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 2,
                    minLength: 1,
                  }}
                  label="Originating DFI Discretionary Data"
                  error={Boolean(error.originatingDFIDiscretionaryData)}
                  helperText={error.originatingDFIDiscretionaryData}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={originatingDFIDiscretionaryData}
                  name="originatingDFIDiscretionaryData"
                  onChange={onChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} sm={6} className={classes.gridItem}>
                <Box mx={1} my={2}>
                  <TextField
                    color="secondary"
                    label="Immediate Origin"
                    disabled={true}
                    fullWidth={true}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      maxLength: 10,
                      minLength: 10,
                    }}
                    variant="outlined"
                    autoComplete="off"
                    value={immediateOrigin}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} className={classes.gridItem}>
                <Box mx={1} my={2}>
                  <TextField
                    color="secondary"
                    label="Immediate Origin Name"
                    disabled={true}
                    fullWidth={true}
                    autoComplete="off"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      maxLength: 23,
                      minLength: 1,
                    }}
                    variant="outlined"
                    value={immediateOriginName}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} className={classes.gridItem}>
                <Box mx={1} my={2}>
                  <TextField
                    color="secondary"
                    label="Immediate Destination"
                    disabled={true}
                    fullWidth={true}
                    autoComplete="off"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      maxLength: 9,
                      minLength: 9,
                    }}
                    variant="outlined"
                    value={immediateDestination}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} className={classes.gridItem}>
                <Box mx={1} my={2}>
                  <TextField
                    color="secondary"
                    label="Immediate Destination Name"
                    disabled={true}
                    fullWidth={true}
                    autoComplete="off"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      maxLength: 23,
                      minLength: 1,
                    }}
                    variant="outlined"
                    value={immediateDestinationName}
                  />
                </Box>
              </Grid>
            </Grid>
            {Boolean(isHippa) && (
              <Grid container item xs={12}>
                <Grid item xs={12} sm={6} className={classes.gridItem}>
                  <Box mx={1} my={2}>
                    <TextField
                      color="secondary"
                      label="Application Sender Code(GS02)"
                      error={Boolean(error.GS02)}
                      helperText={error.GS02}
                      fullWidth={true}
                      autoComplete="off"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      value={GS02}
                      name="GS02"
                      onChange={onChange}
                      onBlur={handleBlur}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} className={classes.gridItem}>
                  <Box mx={1} my={2}>
                    <TextField
                      color="secondary"
                      label="Application Receiver Code(GS03)"
                      error={Boolean(error.GS03)}
                      helperText={error.GS03}
                      fullWidth={true}
                      autoComplete="off"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      value={GS03}
                      name="GS03"
                      onChange={onChange}
                      onBlur={handleBlur}
                    />
                  </Box>
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid container item xs={12} justify="center">
            {saveProcessing ? (
              <CircularProgress color="primary" />
            ) : (
              <Button
                className={classes.saveButton}
                variant="contained"
                color="primary"
                onClick={()=>onSubmit()}
              >
                SAVE
              </Button>
            )}
          </Grid>{" "}
        </>
      </Grid>
    </Box>
  );
};

export default connect()(Bank);
