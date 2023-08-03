import React, { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@material-ui/core";
import TextField from "~/components/Forms/TextField";
import { makeStyles } from "@material-ui/core/styles";
import {
  updateUSbankDeposittodebit,
  addUSbankDeposittodebit,
  getUSbankDeposittodebitData,
} from "~/redux/helpers/USbank/payments";
import { connect } from "react-redux";
import "react-notifications/lib/notifications.css";
import trim from "deep-trim-node";
import { USBANK_TRANSACTION_TYPE} from "~/config/entityTypes";
const useStyles = makeStyles((theme) => ({
  gridItem: {
    margin: 0,
    "& .MuiOutlinedInput-notchedOutline": {
      "& legend": {
        fontSize: "0.85em",
      },
    },
  },
  textinputLabel: {
    color: "black",
  },
  selectLimit: {
    fontSize: "0.85em",
  },
}));

const USbankDepositToDebitcard = (props) => {
  const {
    showParentInfo,
    paymentType,
    dispatch,
    onSaveBtnClick,
    notification,
  } = props;
  const clientId = sessionStorage.getItem("clientId") || null;
  const parentId = sessionStorage.getItem("parentId");
  const [saveProcessing, setSaveProcessing] = useState(false);
  const [debitcardInfo, setDebitcardInfo] = useState({
    data: {
      id: "",
      ddcSSLMerchantId: "",
      ddcConvergeUserId: "",
      ddcTransactionType: USBANK_TRANSACTION_TYPE,
      usBankpaymentdata1: null,
      ddcSSLPin: "",
      ddcSSLUserId: "",
    },
    error: {
      id: "",
      ddcSSLMerchantId: "",
      ddcTransactionType: "",
      ddcConvergeUserId: "",
      ddcSSLPin: "",
      ddcSSLUserId: "",
    },
  });

  const classes = useStyles();
  const { data, error } = debitcardInfo;
  const { id, ddcSSLMerchantId, ddcConvergeUserId, ddcTransactionType, ddcSSLPin, ddcSSLUserId } = data;

  useEffect(() => {
    async function initDebitcardInformation() {
      let ID = clientId;
      if (showParentInfo) {
        ID = parentId;
      }
      const payPalDetails = await dispatch(
        getUSbankDeposittodebitData(ID, paymentType)
      );
   
      if (payPalDetails && payPalDetails.length > 0) {
        let finalDebitcardDetails = payPalDetails[0];

        if (showParentInfo) {
          const { id, ...restDetail } = payPalDetails[0];
          finalDebitcardDetails = restDetail;
        }
        setDebitcardInfo({
          ...debitcardInfo,
          data: {
            ...debitcardInfo.data,
            id: finalDebitcardDetails.id,
            ddcSSLMerchantId: finalDebitcardDetails.ddcSSLMerchantId,
            ddcConvergeUserId: finalDebitcardDetails.ddcConvergeUserId,
            ddcSSLPin: finalDebitcardDetails.ddcSSLPin,
            ddcSSLUserId: finalDebitcardDetails.ddcSSLUserId,
          },
        });
      }
    }

    initDebitcardInformation();
  }, [showParentInfo,  paymentType]);

  const onChange = (event) => {
    const numeric = /^[0-9]*\.?[0-9]*$/;
    const { name, value } = event.target;

    if (numeric.test(value)) {
      setDebitcardInfo({
        ...debitcardInfo,
        data: {
          ...debitcardInfo.data,
          [name]: event.target.value,
        },
      });
    }
  };

  const onChangeAlphaNum = (event) => {
    const { name, value } = event.target;
    setDebitcardInfo({
      ...debitcardInfo,
      data: {
        ...debitcardInfo.data,
        [name]: value.length === 0 ? null : value.trim(),
      },
    });
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setDebitcardInfo({
      ...debitcardInfo,
      data: {
        ...debitcardInfo.data,
        [name]: value === "" ? null : value.trim(),
      },
    });
    let valid = true;
    let validation = { [name]: "" };
    switch (name) {
      case "ddcSSLMerchantId":
        if (!value || value.trim().length === 0) {
          validation["ddcSSLMerchantId"] = "SSL Merchant ID is required";
          valid = false;
        } else if (value && value.length > 15) {
          validation["ddcSSLMerchantId"] =
            "SSL Merchant ID must not be greater than 15 digits";
          valid = false;
        }
        break;

      case "ddcConvergeUserId":
        if (value && value.length > 15) {
          validation["ddcConvergeUserId"] =
            "Merchant ID/ Converge ID must not be greater than 15 digits.";
          valid = false;
        }
        break;
        case "ddcSSLPin":
          if (!value || value.trim().length === 0) {
            validation["ddcSSLPin"] =
              "SSL Pin is required"
            valid = false;
          } else if (value && value.length > 64) {
            validation["ddcSSLPin"] =
              "SSL Pin must not be greater than 64 digits"
            valid = false;
          }
          break;
      case "ddcSSLUserId":
            if (!value || value.trim().length === 0) {
              validation["ddcSSLUserId"] =
                "SSL User ID is required"
              valid = false;
            } else if (value && value.length > 15) {
              validation["ddcSSLUserId"] =
                "SSL User ID must not be greater than 15 digits"
              valid = false;
            }
            break;
      default: {
      }
    }
    setDebitcardInfo({
      ...debitcardInfo,
      error: { ...validation },
    });
  };

  const renderNotification = (mesg, title) => {
    notification(
      mesg,
       title
    );
  };
  const onSubmit = () => {
    const valid = validation();
    setSaveProcessing(true);
    if (valid) {
      const data = {
        id,
        ddcSSLMerchantId,
        ddcTransactionType,
        ddcConvergeUserId,
        ddcSSLPin,
        ddcSSLUserId,
      };
      if (id) {
        dispatch(
          updateUSbankDeposittodebit({
            clientId,
            bankDetail: trim(data),
          })
        ).then((response) => {
          setSaveProcessing(false);
     
          if (response && !response.error) {
            renderNotification("success", response.message);
            onSaveBtnClick(paymentType, false);
          } else {
            renderNotification("error", response.message);
            return false;
          }
        });
      } else {
        const { id, ...restBankDetail } = data;
        dispatch(
          addUSbankDeposittodebit({
            clientId,
            bankDetail: trim(restBankDetail),
          })
        ).then((response) => {
        
            
          if (response && !response.error) {
            setDebitcardInfo({
              ...debitcardInfo,
              data: {
                ...debitcardInfo.data,
                id: response.data?.id,
              },
            });

            renderNotification("success", response.message);
            onSaveBtnClick(paymentType, false);
          } else {
            renderNotification("error", response.message);
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

  const validation = () => {
    let valid = true;
    let validation = {};

    if (!ddcSSLMerchantId || ddcSSLMerchantId.trim().length === 0) {
      validation["ddcSSLMerchantId"] = "SSL Merchant ID is required";
      valid = false;
    } else if (ddcSSLMerchantId && ddcSSLMerchantId.length > 15) {
      validation["ddcSSLMerchantId"] =
        "SSL Merchant ID must not be greater than 15 digits";

      valid = false;
    }

    if (ddcConvergeUserId && ddcConvergeUserId.length > 15) {
      validation["ddcConvergeUserId"] =
        "Merchant ID/ Converge ID should be of 15 digits";
      valid = false;
    }

    if (!ddcSSLPin || ddcSSLPin.trim().length === 0) {
      validation["ddcSSLPin"] =
        "SSL Pin is required"
      valid = false;
    } else if (ddcSSLPin && ddcSSLPin.length > 64) {
      validation["ddcSSLPin"] =
        "SSL Pin must not be greater than 64 digits"
      valid = false;
    }

    if (!ddcSSLUserId || ddcSSLUserId.trim().length === 0) {
      validation["ddcSSLUserId"] =
        "SSL User ID is required"
      valid = false;
    } else if (ddcSSLUserId && ddcSSLUserId.length > 15) {
      validation["ddcSSLUserId"] =
        "SSL User ID must not be greater than 15 digits"
      valid = false;
    }

    setDebitcardInfo({
      ...debitcardInfo,
      error: { ...validation },
    });

    return valid;
  };

  return (
    <Box>
      <Grid container>
        <>
          <Grid container item>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color="primary"
                  inputProps={{
                    maxLength: 15,
                    minLength: 1,
                  }}
                  label={"SSL Merchant ID"}
                  placeholder={"SSL Merchant ID*"}
                  required
                  error={Boolean(error.ddcSSLMerchantId)}
                  helperText={error.ddcSSLMerchantId}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{ className: classes.input }}
                  variant="outlined"
                  value={ddcSSLMerchantId}
                  name="ddcSSLMerchantId"
                  onChange={onChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
              <TextField
                  label={"SSL User ID"}
                  placeholder={"SSL User ID*"}
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  variant="outlined"
                  inputProps={{
                    maxLength: 15,
                    minLength: 1,
                  }}
                  error={Boolean(error.ddcSSLUserId)}
                  helperText={error.ddcSSLUserId} 
                  value={ddcSSLUserId}
                  name="ddcSSLUserId"
                  onChange={onChangeAlphaNum}
                  onBlur={handleBlur}
                  required
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
              <TextField
                  label={"SSL Pin"}
                  placeholder={"SSL Pin*"}
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  variant="outlined"
                  inputProps={{
                    maxLength: 64,
                    minLength: 1,
                  }}
                  error={Boolean(error.ddcSSLPin)}
                  helperText={error.ddcSSLPin}
                  value={ddcSSLPin}
                  name="ddcSSLPin"
                  onChange={onChangeAlphaNum}
                  onBlur={handleBlur}
                  required
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color="primary"
                  inputProps={{
                    maxLength: 20,
                    minLength: 1,
                  }}
                  label={"Transaction Type"}
                  required
                  disabled
                  placeholder={"Transaction Type*"}
                  error={Boolean(error.ddcTransactionType)}
                  helperText={error.ddcTransactionType}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{ className: classes.input }}
                  variant="outlined"
                  value={USBANK_TRANSACTION_TYPE}
                  name="ddcTransactionType"
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color="primary"
                  inputProps={{
                    maxLength: 15,
                    minLength: 0,
                  }}
                  label={"Merchant ID/ Converge ID"}
                  placeholder={"Merchant ID/ Converge ID"}
                  error={Boolean(error.ddcConvergeUserId)}
                  helperText={error.ddcConvergeUserId}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{ className: classes.input }}
                  variant="outlined"
                  value={ddcConvergeUserId}
                  name="ddcConvergeUserId"
                  onChange={onChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>

            <Grid container item xs={12}></Grid>
          </Grid>
          <Grid container item xs={12} justify="center">
            {saveProcessing ? (
              <CircularProgress color="primary" />
            ) : (
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={() => onSubmit()}
                style={{ color: "white" }}

                // const valid = this.validateForm("ACH") || true;
              >
                Save
              </Button>
            )}
          </Grid>
        </>
      </Grid>
    </Box>
  );
};

export default connect((state) => ({
  ...state.USbankpayment,
  ...state.b2cPayments,
}))(USbankDepositToDebitcard);
