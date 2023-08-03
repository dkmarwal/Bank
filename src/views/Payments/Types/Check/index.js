import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  CircularProgress,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { updateCheckDetail } from "~/redux/actions/payments";
import MultiCheckBoxGroup from "../../../../components/Forms/MultiCheckBoxGroup";
import {
  getTransactionType,
  getClientTransactionType,
} from "../../../../redux/actions/payments";
import Divider from "../../../../components/Divider";
import "react-notifications/lib/notifications.css";

const useStyles = makeStyles(() => ({
  gridItem: {
    margin: 0,
  },
  saveButton: {
    fontSize: 14,
    color: 'white'
  }
}));

const Check = ({
  clientId,
  parentId,
  checkDetails,
  showParentInfo,
  paymentType,
  dispatch,
  onPaymentMethodSave,
  notification,
}) => {
  const [saveProcessing, setSaveProcessing] = useState(false);
  const [AccounttransactionType, setTransactionTypes] = useState([]);
  const [checkDetail, setCheckDetail] = useState({
    data: {
      clientId: "",
      accountNumber: null,
      intSenderId: null,
      GS02: null,
      GS03: null,
      intRecvrId: null,
      transactionType: [],
    },
    error: {
      clientId: "",
      accountNumber: "",
      intSenderId: "",
      GS02: "",
      GS03: "",
      intRecvrId: "",
      transactionType: [],
    },
  });

  useEffect(() => {
    initCheckInformation();
    setCheckDetail({
      ...checkDetail,
      data: { ...checkDetail.data, ...checkDetails },
    });
    fetchTransactionType();
  }, [checkDetails]);

  const initCheckInformation = async () => {
    let ID = clientId;
    if (showParentInfo) {
      ID = parentId;
    }
    let transactionType = [];
    const response = await getClientTransactionType(ID, paymentType);
    if (response && response.data) {
      const { data = [], error, message } = response.data;
      if (!error) {
        transactionType = data.rows;
      }
    }

    setCheckDetail({
      ...checkDetail,
      data: {
        ...checkDetail.data,
        ...checkDetails,
        transactionType,
      },
    });
  };

  const { data, error } = checkDetail;
  const {
    accountNumber,
    intSenderId,
    GS02,
    GS03,
    intRecvrId,
    transactionType,
  } = data;

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
      ? [...(checkDetail.data.transactionType || []), parseInt(value)]
      : removeArrElement(parseInt(value), transactionType);
    setCheckDetail({
      ...checkDetail,
      data: { ...checkDetail.data, transactionType: newTransactionType },
    });
  };

  const onChange = (event) => {
    const { name, type } = event.target;
    let { value } = event.target;
    if (type === "select") {
      value = value === "" ? null : value;
    }
    setCheckDetail({
      ...checkDetail,
      data: { ...checkDetail.data, [name]: value },
    });
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setCheckDetail({
      ...checkDetail,
      data: { ...checkDetail.data, [name]: value?.trim() },
    });
  };

  const onSubmit = () => {
    const valid = validation();
    setSaveProcessing(true);
    if (valid) {
      const clientId = sessionStorage.getItem("clientId");
      const data = {
        intSenderId,
        intRecvrId,
        checkEdiInfo: { GS02, GS03 },
        transactionType,
      };
      dispatch(
        updateCheckDetail({ clientId: clientId, checkDetail: data })
      ).then((response) => {
        setSaveProcessing(false);
        if (response && !response.error) {
          notification("success", "Information has been Updated Successfully.");
          onPaymentMethodSave(paymentType);
        } else {
          notification("error", "Something went wrong");
          return false;
        }
      });
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

  const checkOptions = Array.isArray(AccounttransactionType)
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
    if (!intSenderId || intSenderId.trim() === "") {
      validation["intSenderId"] = "This field is required.";
      valid = false;
    }
    if (!intRecvrId || intRecvrId.trim() === "") {
      validation["intRecvrId"] = "This field is required.";
      valid = false;
    }
    if (!GS02 || GS02.trim() === "") {
      validation["GS02"] = "This field is required.";
      valid = false;
    }
    if (!GS03 || GS03.trim() === "") {
      validation["GS03"] = "This field is required.";
      valid = false;
    }
    if (intSenderId && intSenderId.length > 15) {
      validation["intSenderId"] =
        "Sender Id cannot be more than 15 characters.";
      valid = false;
    }
    if (intRecvrId && intRecvrId.length > 15) {
      validation["intRecvrId"] =
        "Receiver Id cannot be more than 15 characters.";
      valid = false;
    }
    if (GS03 && GS03.length > 15) {
      validation["GS03"] = "GS03 cannot be more than 15 characters.";
      valid = false;
    }
    if (GS02 && GS02.length > 15) {
      validation["GS02"] = "GS02 cannot be more than 15 characters.";
      valid = false;
    }

    if (intSenderId && intSenderId.length < 2) {
      validation["intSenderId"] = "Sender Id cannot be less than 2 characters.";
      valid = false;
    }
    if (intRecvrId && intRecvrId.length < 2) {
      validation["intRecvrId"] =
        "Receiver Id cannot be less than 2 characters.";
      valid = false;
    }
    if (GS03 && GS03.length < 2) {
      validation["GS03"] = "GS03 cannot be less than 2 characters.";
      valid = false;
    }
    if (GS02 && GS02.length < 2) {
      validation["GS02"] = "GS02 cannot be less than 2 characters.";
      valid = false;
    }
    setCheckDetail({
      ...checkDetail,
      error: {...validation }
    });
    return valid;
  };

  const classes = useStyles();
  return (
    <Box>
      <Grid container justify="center" spacing={2}>
        <Grid container justify="flex-start">
          <Grid item xs={12} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <MultiCheckBoxGroup
                key={"transactionType"}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                label={"Transaction Type"}
                options={checkOptions}
                onChangeCheckBox={onChangeTransactionType}
                selectedCheckbox={transactionType || []}
              />
            </Box>
            <Box pb={2}>
              <Divider />{" "}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                color="secondary"
                inputProps={{
                  maxLength: 15,
                  minLength: 2,
                }}
                label="Interchange Sender ID(ISA06)"
                error={Boolean(error.intSenderId)}
                helperText={error.intSenderId}
                fullWidth={true}
                autoComplete="off"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={intSenderId}
                name="intSenderId"
                onChange={onChange}
                onBlur={handleBlur}
                required
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                color="secondary"
                inputProps={{
                  maxLength: 15,
                  minLength: 2,
                }}
                label="Interchange Receiver ID(ISA08)"
                error={Boolean(error.intRecvrId)}
                helperText={error.intRecvrId}
                fullWidth={true}
                autoComplete="off"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={intRecvrId}
                name="intRecvrId"
                onBlur={handleBlur}
                onChange={onChange}
                required
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                color="secondary"
                inputProps={{
                  maxLength: 15,
                  minLength: 2,
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
                required
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                color="secondary"
                inputProps={{
                  maxLength: 15,
                  minLength: 2,
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
                required
              />
            </Box>
          </Grid>
        </Grid>
        <Grid container item xs={11} justify="center">
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default connect()(Check);
