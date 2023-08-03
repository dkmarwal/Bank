import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  MenuItem,
  Button,
  CircularProgress,
  Typography,
  withStyles
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import TextField from "~/components/Forms/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { updateVirtualCardInfo } from "~/redux/actions/payments";
import { createVirtualCardInfo } from "~/redux/actions/payments";
import MultiCheckBoxGroup from "../../../../components/Forms/MultiCheckBoxGroup";
import {
  getTransactionType,
  getClientTransactionType,
  getPurchaseType,
  getCardSelectionType,
  savePaymentCardtype,
  getVirtualCardType
} from "../../../../redux/actions/payments";
import Divider from "../../../../components/Divider";
import "react-notifications/lib/notifications.css";
import MaskInput from "~/components/MaskInput";
import MasterCard from "~/modules/MasterCard";
import MasterCardPMTX from "~/modules/MasterCardPMTX";
import { CardType, PayerTypes } from "~/config/entityTypes";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .PrivateNotchedOutline-legendLabelled-140": {
      fontSize: "0.87em !important",
    },
  },

  gridItem: {
    margin: 0,
  },
  recommendedLabel: {
    background: '#33C3A4',
    color: '#fff',
    padding: '2px 5px',
    borderRadius: '3px',
    fontSize: '12px'
  },
  toggleBtn: {
    width: 280
  },
  cardCheckImage: {
    display: 'flex',
    '& img': {
      position: 'initial'
    },
    '& .MuiBox-root': {
      border: 'none'
    }
  },
  saveButton: {
    fontSize: 14,
    color: 'white'
  }
}));

const StyledToggleButtonGroup = withStyles((theme) => ({
  grouped: {
    margin: theme.spacing(0.25),
    border: "none",
    "&:not(:first-child)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-child": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:selected": {
      backgroundColor: theme.palette.secondary.main,
    },
    padding: "2px 16px",
    color: "#4C4C4C",
    "&.Mui-selected": {
      backgroundColor: theme.palette.secondary.main,
      color: "#fff",
      "&:hover": {
        backgroundColor: theme.palette.secondary.main,
      },
    },
  },
}))(ToggleButtonGroup);

const VirtualCard = ({
  currencyList = [],
  clientId,
  parentId,
  isHippa,
  payerTypeId,
  virtualCardDetail,
  showParentInfo,
  paymentType,
  dispatch,
  onPaymentMethodSave,
  notification,
  selectedPaymentTypes,
}) => {
  const [saveProcessing, setSaveProcessing] = useState(false);
  const [AccounttransactionType, setTransactionTypes] = useState([]);
  const [purchaseTypeList, setPurchaseTypeList] = useState([]);
  const [mcCardType, setmcCardType] = useState(2);

  const [virtualCardInfo, setVirtualCardInfo] = useState({
    data: {
      cardAccountDetailsId: "",
      accountId: "",
      clientId: "",
      currencyCode: null,
      bankCountryIso: null,
      currencyIntCode: null,
      purchaseTypeId: null,
      issuerId: null,
      version: null,
      commonName: null,
      companyIdentification: null,
      companyName: null,
      companyEntryDescription: null,
      cardAlias: null,
      validFor: null,
      bankRoutingCode: null,
      accountNumber: null,
      supplierName: null,
      GS02: null,
      GS03: null,
      transactionType: [],
      programName: []
    },
    error: {
      cardAccountDetailsId: "",
      accountId: "",
      clientId: "",
      currencyCode: "",
      bankCountryIso: "",
      currencyIntCode: "",
      purchaseTypeId: "",
      issuerId: "",
      version: "",
      commonName: "",
      companyIdentification: "",
      companyName: "",
      companyEntryDescription: "",
      cardAlias: "",
      validFor: "",
      bankRoutingCode: "",
      cpex: "",
      eps: "",
      accountNumber: "",
      supplierName: "",
      GS02: "",
      GS03: "",
      transactionType: [],
    },
  });

  useEffect(() => {
    initVirtualCardInfo();
    fetchTransactionType();
    fetchPurchaseType();
    //fetchVirtualCardType();
    fetchSelectedCardType();

  }, [virtualCardDetail, showParentInfo]);

  const fetchPurchaseType = async () => {
    const purchaseType = await getPurchaseType();
    if (
      purchaseType &&
      purchaseType.data &&
      purchaseType.data.rows &&
      !purchaseType.error
    ) {
      setPurchaseTypeList(purchaseType.data.rows);
    }
  };

  // const fetchVirtualCardType = async () => {
  //   const cardType = await getVirtualCardType(clientId);
  // }

  const fetchSelectedCardType = async () => {
    const cardType = await getCardSelectionType(clientId);
    if (cardType.data.length) {
      setmcCardType(cardType.data[0].cardTypeId);
    }
  }

  const initVirtualCardInfo = async () => {
    let ID = clientId;
    if (showParentInfo) {
      ID = parentId;
    }
    const transactionType = await getClientTransactionType(ID, paymentType);
    if (transactionType && transactionType.data) {
      const {
        data: transactionTypeArr,
        error: typeError,
        message: errorMessage,
      } = transactionType.data;
      setVirtualCardInfo({
        ...virtualCardInfo,
        data: {
          ...virtualCardInfo.data,
          ...virtualCardDetail,
          transactionType: transactionTypeArr.rows || [],
        },
      });
    } else {
      setVirtualCardInfo({
        ...virtualCardInfo,
        data: { ...virtualCardInfo.data, ...virtualCardDetail },
      });
    }
  };

  const { data, error } = virtualCardInfo;
  const {
    cardAccountDetailsId,
    accountId,
    currencyCode,
    bankCountryIso,
    currencyIntCode,
    purchaseTypeId,
    issuerId,
    version,
    commonName,
    companyIdentification,
    companyName,
    companyEntryDescription,
    cardAlias,
    validFor,
    bankRoutingCode,
    cpex,
    eps,
    accountNumber,
    supplierName,
    GS02,
    GS03,
    transactionType,
  } = data;

  const onChange = (event) => {
    const { name, type } = event.target;
    let { value } = event.target;

    if (
      type === "select" ||
      ["purchaseTypeId", "bankCountryIso", "currencyCode", "currencyIntCode"].includes(name)
    ) {
      value = value || null;
    }
    else{
      value = value && value.replace(/\s/g, "") === "" ? null : value;
    }

    if (name === "currencyCode") {
      const currencyIntCode = getCurrencyCode(value);
      setVirtualCardInfo({
        ...virtualCardInfo,
        data: {
          ...virtualCardInfo.data,
          [name]: value || null,
          currencyIntCode,
        },
      });
    } else {
      setVirtualCardInfo({
        ...virtualCardInfo,
        data: { ...virtualCardInfo.data, [name]: value || null },
      });
    }
  };

  const handleBlur = (event) => {
    let { name, value } = event.target;
    value = value && value.replace(/\s/g, "") === "" ? null : value;
    setVirtualCardInfo({
      ...virtualCardInfo,
      data: { ...virtualCardInfo.data, [name]: value || null },
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
    const { name, type, checked } = event.target;
    let { value } = event.target;
    const newTransactionType = checked
      ? [...(virtualCardInfo.data.transactionType || []), parseInt(value)]
      : removeArrElement(parseInt(value), transactionType);
    setVirtualCardInfo({
      ...virtualCardInfo,
      data: {
        ...virtualCardInfo.data,
        transactionType: newTransactionType,
        bankCountryIso: null,
        currencyCode: null,
      },
    });
  };

  const onSubmit = () => {
    const valid = validation();
    setSaveProcessing(true);
    if (valid) {
      const clientId = sessionStorage.getItem("clientId");
      const data = {
        cardAccountDetailsId,
        accountId,
        clientId,
        currencyCode,
        bankCountryIso,
        currencyIntCode,
        issuerId,
        version,
        commonName,
        purchaseTypeId,
        companyIdentification,
        companyName,
        companyEntryDescription,
        cardAlias,
        bankRoutingCode,
        accountNumber,
        isHippaInformation: { GS02, GS03 },
        supplierName,
        transactionType,
      };

      if (cardAccountDetailsId) {
        const { accountId, ...restBankDetail } = data;
        dispatch(
          updateVirtualCardInfo({
            clientId: clientId,
            virtualCardDetail: restBankDetail,
          })
        ).then((response) => {
          setSaveProcessing(false);
          if (response && !response.error) {
            notification(
              "success",
              "Information has been Updated Successfully."
            );
            onPaymentMethodSave(paymentType);
            // For Save Card type Id (changes for commercial card) 
            dispatch(savePaymentCardtype({
              clientId: clientId,
              cardTypeId: CardType.MSC1
            }))
          } else {
            notification("error", "Something went wrong");
            return false;
          }
        });
      } else {
        const { cardAccountDetailsId, accountId, ...restBankDetail } = data;
        dispatch(
          createVirtualCardInfo({
            clientId: clientId,
            virtualCardDetail: restBankDetail,
          })
        ).then((response) => {
          setSaveProcessing(false);
          if (response && response.data && response.data.cardAccountDetailsId) {
            setVirtualCardInfo({
              //...virtualCardInfo,
              error: {
                cardAccountDetailsId: "",
                accountId: "",
                clientId: "",
                currencyCode: "",
                bankCountryIso: "",
                currencyIntCode: "",
                purchaseTypeId: "",
                issuerId: "",
                version: "",
                commonName: "",
                companyIdentification: "",
                companyName: "",
                companyEntryDescription: "",
                cardAlias: "",
                validFor: "",
                bankRoutingCode: "",
                cpex: "",
                eps: "",
                accountNumber: "",
                supplierName: "",
                GS02: "",
                GS03: "",
                transactionType: [],
              },
              data: {
                ...virtualCardInfo.data,
                cardAccountDetailsId: response.data.cardAccountDetailsId,
              },
            });
            notification(
              "success",
              "Information has been Updated Successfully."
            );
            onPaymentMethodSave(paymentType);
            dispatch(savePaymentCardtype({
              clientId: clientId,
              cardTypeId: CardType.MSC1
            }))
          } else {
            notification("error", "Something went wrong");
            return false;
          }
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
    const { data, error, message } = await transactionTypeData;
    const AccountTransactionTypes =
      data &&
      data.rows.filter(({ paymentCode }) => {
        return paymentCode === paymentType;
      });
    if (!error) {
      setTransactionTypes(AccountTransactionTypes);
    } else {
      // report Error Message here for not getting grouplist;
      setTransactionTypes({ ...transactionType, error: message });
    }
  };

  const VCAOptions = Array.isArray(AccounttransactionType)
    ? AccounttransactionType.map(
      ({ currency, transactionTypeId, bankCountryIso, paymentCode }) => ({
        name: currency,
        value: transactionTypeId,
        label: `${bankCountryIso} ${currency}`,
      })
    )
    : [];

  const validation = () => {
    let valid = true;
    let validation = {};   
    
    if (!accountNumber || accountNumber.trim().length === 0) {
      validation["accountNumber"] = "Account Number is required.";
      valid = false;
    }
    if (accountNumber && accountNumber.trim().length < 6) {
      validation["accountNumber"] =
        "Account Number can not be less than 6 characters.";
      valid = false;
    }
    if (accountNumber && accountNumber.trim().length > 17) {
      validation["accountNumber"] =
        "Account Number can not be more than 17 characters.";
      valid = false;
    }
    if (supplierName && supplierName.length < 2) {
      validation["supplierName"] =
        "Supplier Name can not be less than 2 characters.";
      valid = false;
    }
    if (supplierName && supplierName.length > 50) {
      validation["supplierName"] =
        "Supplier Name can not be more than 50 characters.";
      valid = false;
    }
    if (bankRoutingCode && bankRoutingCode.length !== 9) {
      validation["bankRoutingCode"] =
        "Bank Routing Code should be of 9 characters.";
      valid = false;
    }
    if (bankCountryIso && bankCountryIso.length !== 2) {
      validation["bankCountryIso"] =
        "BankCountryIso should be of 2 characters.";
      valid = false;
    }
    if (cardAlias && cardAlias.length < 2) {
      validation["cardAlias"] = "cardAlias can not be less than 2 characters.";
      valid = false;
    }
    if (cardAlias && cardAlias.length > 50) {
      validation["cardAlias"] = "cardAlias can not be more than 50 characters.";
      valid = false;
    }

    if (currencyCode && currencyCode.length !== 3) {
      validation["currencyCode"] = "CurrencyCode should be of 3 characters.";
      valid = false;
    }
    if (currencyIntCode && currencyIntCode.toString().length !== 3) {
      validation["currencyIntCode"] =
        "CurrencyIntCode should be of 3 characters.";
      valid = false;
    }
    if (issuerId && issuerId.length > 1) {
      validation["issuerId"] = "IssuerId can not be more than 1 characters.";
      valid = false;
    }
    if (companyName && companyName.length < 2) {
      validation["companyName"] =
        "Company Name can not be less than 2 characters.";
      valid = false;
    }

    if (companyName && companyName.length > 17) {
      validation["companyName"] =
        "Company Name can not be more than 17 characters.";
      valid = false;
    }

    if (companyIdentification && companyIdentification.length !== 10) {
      validation["companyIdentification"] =
        "Company Identification should be of 10 characters.";
      valid = false;
    }
    if (companyEntryDescription && companyEntryDescription.length > 20) {
      validation["companyEntryDescription"] =
        "Company Entry Description can not be more than 20 characters.";
      valid = false;
    }
    if (version && version.length < 2) {
      validation["version"] = "Version can not be less than 2 characters.";
      valid = false;
    }
    if (version && version.length > 5) {
      validation["version"] = "Version can not be more than 5 characters.";
      valid = false;
    }
    if (commonName && commonName.length < 2) {
      validation["commonName"] =
        "Common Name can not be less than 2 characters.";
      valid = false;
    }

    if (commonName && commonName.length > 50) {
      validation["commonName"] =
        "Common Name can not be more than 50 characters.";
      valid = false;
    }

    setVirtualCardInfo({
      ...virtualCardInfo,
      error: { ...validation }
    });
    return valid;
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

  const getCurrencyCode = (currencyCode) => {
    const currency = currencyList.find(
      ({ isoCode }) => currencyCode === isoCode
    );
    const currencyIsoNumeric = currency ? currency.isoNumeric : "";

    return currencyIsoNumeric;
  };

  const handleCardTypeChange = (event, value) => {
    setmcCardType(value);
  }

  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Grid container>
        {/* <Box pb={1}>
          <Typography className={classes.genralTitleBold}>
            Please select the Virtual Cards you want to be opt for*
          </Typography>
        </Box> */}

        {/* <Box
          bgColor="#fff"
          border="1px solid #CCCCCC"
          borderRadius={4}
          mx={1}
        >
          <StyledToggleButtonGroup
            size="small"
            value={mcCardType}
            exclusive
            onChange={handleCardTypeChange}
          >
            <ToggleButton value={CardType.MSC2} className={classes.toggleBtn}>
              <Box className={classes.cardCheckImage}>
                <Checkbox
                  color="primary"
                  checked={mcCardType == CardType.MSC2}
                />
                <span>MasterCard 2.0 <span className={classes.recommendedLabel}>RECOMMENDED</span></span>
              </Box>
            </ToggleButton>
            {payerTypeId != 2 ?
              <ToggleButton value={CardType.MSC1} className={classes.toggleBtn}>
                <Box className={classes.cardCheckImage}>
                  <Checkbox
                    color="primary"
                    checked={mcCardType == CardType.MSC1}
                  />
                  MasterCard 1.0
                </Box>
              </ToggleButton> : null}
          </StyledToggleButtonGroup>
        </Box> */}

        {payerTypeId != PayerTypes.PMTX ?
          <MasterCard
            clientId={clientId}
            selectedPaymentTypes={selectedPaymentTypes}
          />
          // <MasterCardPMTX />
          : null
        }

        {payerTypeId == PayerTypes.PMTX ? <>
          <Grid container item>
            <Grid item xs={12} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <MultiCheckBoxGroup
                  key={"transactionType"}
                  label={"Transaction Type"}
                  options={VCAOptions}
                  onChangeCheckBox={onChangeTransactionType}
                  selectedCheckbox={transactionType || []}
                />
              </Box>
              <Box mx={1} pb={1}>
                <Divider />{" "}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 50,
                    minLength: 2,
                  }}
                  label="Supplier Name"
                  error={Boolean(error.supplierName)}
                  helperText={error.supplierName}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={supplierName}
                  name="supplierName"
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
                    setVirtualCardInfo({
                      ...virtualCardInfo,
                      data: { ...virtualCardInfo.data, accountNumber: val },
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
                    maxLength: 9,
                    minLength: 9,
                  }}
                  label="Bank Routing Code"
                  error={Boolean(error.bankRoutingCode)}
                  helperText={error.bankRoutingCode}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={bankRoutingCode}
                  name="bankRoutingCode"
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
                    minLength: 2,
                  }}
                  label="Bank Country ISO"
                  error={Boolean(error.bankCountryIso)}
                  helperText={error.bankCountryIso}
                  select
                  value={bankCountryIso}
                  name="bankCountryIso"
                  onChange={onChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
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
                  inputProps={{
                    maxLength: 50,
                    minLength: 2,
                  }}
                  label="Virtual Card Alias"
                  error={Boolean(error.cardAlias)}
                  helperText={error.cardAlias}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={cardAlias}
                  name="cardAlias"
                  onChange={onChange}
                  onBlur={handleBlur}
                />
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
                  {currencyListOptions().map(({ isoNumeric, isoCode, name }) => (
                    <MenuItem key={isoCode} value={isoCode}>
                      {name}
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
                  label="Currency Code"
                  error={Boolean(error.currencyIntCode)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  helperText={error.currencyIntCode}
                  value={currencyIntCode}
                  name="currencyIntCode"
                >
                  {currencyList.map(({ isoNumeric }) => (
                    <MenuItem key={isoNumeric} value={isoNumeric}>
                      {isoNumeric}
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
                  label="Purchase Type"
                  error={Boolean(error.purchaseTypeId)}
                  helperText={error.purchaseTypeId}
                  value={purchaseTypeId}
                  name="purchaseTypeId"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  onChange={onChange}
                >
                  {purchaseTypeList.length > 0 &&
                    purchaseTypeList.map(
                      ({ purchaseTypeId, purchaseTypeName }) => (
                        <MenuItem key={purchaseTypeId} value={purchaseTypeId}>
                          {purchaseTypeName}
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
                    maxLength: 1,
                    minLength: 1,
                  }}
                  label="Issuer ID"
                  error={Boolean(error.issuerId)}
                  helperText={error.issuerId}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={issuerId}
                  name="issuerId"
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
                    maxLength: 17,
                    minLength: 2,
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
                  label="Company Identification Number"
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
                    maxLength: 20,
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
                    maxLength: 5,
                    minLength: 2,
                  }}
                  label="Version Number"
                  error={Boolean(error.version)}
                  helperText={error.version}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={version}
                  name="version"
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
                    maxLength: 50,
                    minLength: 2,
                  }}
                  label=" Common Name"
                  error={Boolean(error.commonName)}
                  helperText={error.commonName}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={commonName}
                  name="commonName"
                  onChange={onChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>
            {Boolean(isHippa) && (
              <Grid container item xs={12}>
                <Grid item xs={12} sm={6} className={classes.gridItem}>
                  <Box mx={1} my={2}>
                    <TextField
                      color="secondary"
                      inputProps={{
                        maxLength: 50,
                      }}
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
                      inputProps={{
                        maxLength: 50,
                      }}
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
                onClick={() => onSubmit()}
              >
                SAVE
              </Button>
            )}
          </Grid>
        </>
          : null
        }
        </Grid>
    </Box >
  );
};

export default connect()(withStyles()(VirtualCard));
