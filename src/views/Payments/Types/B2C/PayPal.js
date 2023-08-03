import React, { useState, useEffect } from 'react';
import styles from '~/views/Payments/B2C/styles';
import { withStyles } from '@material-ui/styles';
import { Box, Grid, Button, CircularProgress } from '@material-ui/core';
import TextField from '~/components/Forms/TextField';
import {
  createB2CPaypalInfo,
  getPayPalAccountDetails,
  updatePayPalAccountDetails,
} from '~/redux/actions/B2C/payments';
import { connect } from 'react-redux';
import 'react-notifications/lib/notifications.css';
import StringMaskInput from '~/components/MaskInput/stringMaskInput';
import { CountryIso, CityIso, StateIso } from '~/components/CSC';
import MenuItem from '@material-ui/core/MenuItem';
import trim from 'deep-trim-node';

const PayPal = ({
  dispatch,
  classes,
  paymentType,
  onSaveBtnClick,
  showParentInfo,
  notification,
}) => {
  const clientId = sessionStorage.getItem('clientId');
  const parentId = sessionStorage.getItem('parentId');
  const [saveProcessing, setSaveProcessing] = useState(false);
  const [bankDetailInfo, setBankDetailInfo] = useState({
    data: {
      accountId: '',
      worldlinkId: null,
      senderAccountNumber: null,
      clientBIC: null,
      senderName: null,
      senderAddressLine1: null,
      senderAddressLine2: null,
      senderCity: null,
      senderState: null,
      senderZIP: null,
      senderCountryCode: null,
      senderPhone: null,
      senderContactEmail: null,
      countryPhoneCode: null,
      title: null,
    },
    error: {
      accountId: '',
      worldlinkId: '',
      senderAccountNumber: '',
      clientBIC: '',
      senderName: '',
      senderAddressLine1: '',
      senderAddressLine2: '',
      senderCity: '',
      senderState: '',
      senderZIP: '',
      senderCountryCode: '',
      senderPhone: '',
      senderContactEmail: '',
      countryPhoneCode: '',
      title: null,
    },
  });

  const { data, error } = bankDetailInfo;
  const {
    accountId,
    worldlinkId,
    senderAccountNumber,
    clientBIC,
    senderName,
    senderAddressLine1,
    senderAddressLine2,
    senderCity,
    senderState,
    senderZIP,
    senderCountryCode,
    senderPhone,
    senderContactEmail,
    countryPhoneCode,
    title,
  } = data;
  useEffect(() => {
    async function initBankInformation() {
      let paramId = clientId;
      if (showParentInfo && parentId) {
        paramId = parentId;
      }
      const payPalDetails = await dispatch(
        getPayPalAccountDetails({ clientId: paramId })
      );

      let finalPaypalDetails = payPalDetails;
      if (showParentInfo) {
        const { accountId, ...restDetail } = payPalDetails;
        finalPaypalDetails = restDetail;
      }
      setBankDetailInfo({
        ...bankDetailInfo,
        data: {
          ...bankDetailInfo.data,
          ...finalPaypalDetails,
        },
      });
    }

    initBankInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (event) => {
    const { name, type } = event.target;
    let { value } = event.target;
    let finalValue = value || null;
    if (type === 'select') {
      value = value === '' ? null : value;
    } else if (name === 'senderPhone' && value) {
      const intiVal = value.replace(/[^+{1}0-9]/g, '');
      let firstOccuranceIndex = intiVal.search(/\+/) + 1;
      let resultStr = '';
      if (firstOccuranceIndex === 1) {
        resultStr =
          intiVal.substr(0, firstOccuranceIndex) +
          intiVal.slice(firstOccuranceIndex).replace(/\+/g, '');
      } else {
        resultStr = intiVal.slice(0).replace(/\+/g, '');
      }
      finalValue = resultStr;
    }
    setBankDetailInfo({
      ...bankDetailInfo,
      data: { ...bankDetailInfo.data, [name]: finalValue ?? null },
    });
  };

  const handleBlur = (event) => {
    let { value, name } = event.target;
    setBankDetailInfo({
      ...bankDetailInfo,
      data: {
        ...bankDetailInfo.data,
        [name]: value === '' ? null : value.trim(),
      },
    });
  };

  const onSubmit = () => {
    const valid = validation();
    setSaveProcessing(true);
    if (valid) {
      const data = {
        accountId,
        worldlinkId,
        senderAccountNumber: Boolean(senderAccountNumber)
          ? senderAccountNumber
          : null,
        clientBIC,
        senderName,
        senderAddressLine1,
        senderAddressLine2,
        senderCity,
        senderState,
        senderZIP,
        senderCountryCode,
        senderPhone,
        senderContactEmail,
        clientId,
        countryPhoneCode,
        title,
      };

      if (accountId) {
        dispatch(
          updatePayPalAccountDetails({
            payPalDetail: trim(data),
          })
        ).then((response) => {
          setSaveProcessing(false);
          if (response && !response.error) {
            notification(
              'success',
              'PayPal data updated successfully'
            );
            onSaveBtnClick(paymentType, false);
          } else {
            const errorMsg = response && response.message ? response.message : 'Oops! Something went wrong.';
            notification('error', errorMsg);
            return false;
          }
        });
      } else {
        const { accountId, ...restBankDetail } = data;
        dispatch(
          createB2CPaypalInfo({
            payPalDetails: trim({ ...restBankDetail }),
          })
        ).then(async (response) => {
          if (response && !response.error) {
            const payPalDetails = await dispatch(
              getPayPalAccountDetails({ clientId })
            );
            if (payPalDetails) {
              setBankDetailInfo({
                ...bankDetailInfo,
                data: {
                  ...bankDetailInfo.data,
                  accountId: payPalDetails.accountId,
                },
                error: {}
              });
            }
            notification(
              'success',
              'PayPal data saved successfully'
            );
            onSaveBtnClick(paymentType, false);
          } else {
            const errorMsg = response && response.message ? response.message : 'Oops! Something went wrong.';
            notification('error', errorMsg);
          }
          setSaveProcessing(false);
        });
      }
    } else {
      notification(
        'error',
        'Validation error! Please fill the required information.'
      );
      setSaveProcessing(false);
    }
  };

  const validation = () => {
    let valid = true;
    let validation = {};

    if (senderAccountNumber && senderAccountNumber.length > 16) {
      validation['senderAccountNumber'] =
        'Sender Account Number must not be greater than 16 digits.';
      valid = false;
    } else if (senderAccountNumber && senderAccountNumber.length < 1) {
      validation['senderAccountNumber'] =
        'Sender Account Number must not be less than 1 digit.';
      valid = false;
    }
    if (worldlinkId && worldlinkId.length < 9) {
      validation['worldlinkId'] = 'Worldlink ID must be of 9 characters.';
      valid = false;
    }
    if (clientBIC && clientBIC.length < 11) {
      validation['clientBIC'] = 'Client BIC must be of 11 characters.';
      valid = false;
    }
    if (senderName && senderName.length > 140) {
      validation['senderName'] =
        'Sender Name must not be greater than 140 characters.';
      valid = false;
    }
    if (senderAddressLine1 && senderAddressLine1.length < 1) {
      validation['senderAddressLine1'] =
        'Sender Address Line 1 must not be less than 1 characters.';
      valid = false;
    } else if (senderAddressLine1 && senderAddressLine1.length > 35) {
      validation['senderAddressLine1'] =
        'Sender Address Line 1 must not be greater than 35 characters.';
      valid = false;
    }
    if (senderAddressLine2 && senderAddressLine2.length < 1) {
      validation['senderAddressLine2'] =
        'Sender Address Line 2 must not be less than 1 characters.';
      valid = false;
    } else if (senderAddressLine2 && senderAddressLine2.length > 16) {
      validation['senderAddressLine2'] =
        'Sender Address Line 2 must not be greater than 16 characters.';
      valid = false;
    }
    if (senderCity && senderCity.length < 1) {
      validation['senderCity'] =
        'Sender City must not be less than 1 characters.';
      valid = false;
    } else if (senderCity && senderCity.length > 35) {
      validation['senderCity'] =
        'Sender City must not be greater than 35 characters.';
      valid = false;
    }
    if (senderState && senderState.length < 1) {
      validation['senderState'] =
        'Sender State must not be less than 1 characters.';
      valid = false;
    } else if (senderState && senderState.length > 35) {
      validation['senderState'] =
        'Sender State must not be greater than 35 characters.';
      valid = false;
    }

    if (senderZIP && senderZIP.length < 1) {
      validation['senderZIP'] =
        'Sender ZIP must not be less than 1 characters.';
      valid = false;
    } else if (senderZIP && senderZIP.length > 16) {
      validation['senderZIP'] =
        'Sender ZIP must not be greater than 16 characters.';
      valid = false;
    }

    if (senderCountryCode && senderCountryCode.length !== 2) {
      validation['senderCountryCode'] =
        'Sender Country Code must be of 2 characters.';
      valid = false;
    }
    if (senderContactEmail && senderContactEmail.length) {
      const reg =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;
      if (!reg.test(senderContactEmail)) {
        validation['senderContactEmail'] =
          'Sender Contact Email should be valid.';
        valid = false;
      }
    }

    setBankDetailInfo({
      ...bankDetailInfo,
      error: { ...validation }
    });
    return valid;
  };

  return (
    <Box className={classes.popupInner}>
      <Grid container>
        <>
          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              color="secondary"
              inputProps={{
                maxLength: 9,
                minLength: 9,
              }}
              label="Worldlink ID"
              error={Boolean(error.worldlinkId)}
              helperText={error.worldlinkId}
              fullWidth={true}
              autoComplete="off"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={worldlinkId}
              name="worldlinkId"
              onChange={onChange}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={6} className={classes.inputBox}>
            <StringMaskInput
              inputProps={{
                maxLength: 16,
                minLength: 6,
              }}
              label="Sender Account Number"
              error={Boolean(error.senderAccountNumber)}
              helperText={error.senderAccountNumber}
              fullWidth={true}
              autoComplete="off"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={senderAccountNumber}
              name="senderAccountNumber"
              getValue={(val) => {
                setBankDetailInfo({
                  ...bankDetailInfo,
                  data: {
                    ...bankDetailInfo.data,
                    senderAccountNumber: val ?? null,
                  },
                });
              }}
            />
          </Grid>
          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              color="secondary"
              inputProps={{
                maxLength: 11,
                minLength: 11,
              }}
              label="Client BIC"
              error={Boolean(error.clientBIC)}
              helperText={error.clientBIC}
              fullWidth={true}
              autoComplete="off"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={clientBIC}
              name="clientBIC"
              onChange={onChange}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={6} className={classes.paypalNameBox}>
            <TextField
              select
              color="secondary"
              name={'title'}
              id={'title'}
              label={'Prefix'}
              type={'select'}
              value={title}
              onChange={onChange}
              disabled={false}
              inputProps={{ maxLength: 3 }}
              InputLabelProps={{
                shrink: true,
              }}
            >
              <MenuItem key={'0'} value={'Mr.'}>
                Mr.
              </MenuItem>
              <MenuItem key={'1'} value={'Ms.'}>
                Ms.
              </MenuItem>
            </TextField>
            <TextField
              color="secondary"
              inputProps={{
                maxLength: 140,
                minLength: 1,
              }}
              label="Sender Name"
              error={Boolean(error.senderName)}
              helperText={error.senderName}
              fullWidth={true}
              autoComplete="off"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={senderName}
              name="senderName"
              onChange={onChange}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              color="secondary"
              inputProps={{
                maxLength: 35,
                minLength: 1,
              }}
              label="Sender Address Line 1"
              error={Boolean(error.senderAddressLine1)}
              helperText={error.senderAddressLine1}
              fullWidth={true}
              autoComplete="off"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={senderAddressLine1}
              name="senderAddressLine1"
              onChange={onChange}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              color="secondary"
              inputProps={{
                maxLength: 16,
                minLength: 1,
              }}
              label="Sender Address Line 2"
              error={Boolean(error.senderAddressLine2)}
              helperText={error.senderAddressLine2}
              fullWidth={true}
              autoComplete="off"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={senderAddressLine2}
              name="senderAddressLine2"
              onChange={onChange}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={6} className={classes.multitBox}>
            <CountryIso
              selectedCountry={senderCountryCode || ''}
              error={Boolean(error.senderCountryCode)}
              helperText={error.senderCountryCode}
              name={'senderCountryCode'}
              label={'Sender Country Code'}
              onChange={onChange}
              value={senderCountryCode}
            />

            <StateIso
              error={Boolean(error.senderState)}
              helperText={error.senderState}
              onChange={onChange}
              selectedState={senderState || ''}
              selectedCountry={senderCountryCode || ''}
              label={'Sender State'}
              name="senderState"
              value={senderState}
            />
          </Grid>
          <Grid item xs={6} className={classes.multitBox}>
            <CityIso
              name="senderCity"
              label="Sender City"
              error={Boolean(error.senderCity)}
              helperText={error.senderCity}
              selectedState={senderState || ''}
              selectedCity={senderCity || ''}
              selectedCountry={senderCountryCode || ''}
              onChange={onChange}
              value={senderCity}
            />
            <TextField
              color="secondary"
              inputProps={{
                maxLength: 16,
                minLength: 1,
              }}
              label="Sender ZIP"
              error={Boolean(error.senderZIP)}
              helperText={error.senderZIP}
              fullWidth={true}
              autoComplete="off"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={senderZIP}
              name="senderZIP"
              onChange={onChange}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              color="secondary"
              label="Sender Contact Email"
              error={Boolean(error.senderContactEmail)}
              helperText={error.senderContactEmail}
              fullWidth={true}
              autoComplete="off"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={senderContactEmail}
              name="senderContactEmail"
              onChange={onChange}
              onBlur={handleBlur}
              inputProps={{
                maxLength: 127,
              }}
            />
          </Grid>
          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              color="secondary"
              label={'Sender Phone Number'}
              variant="outlined"
              fullWidth={true}
              error={Boolean(error.senderPhone)}
              helperText={error.senderPhone}
              name="senderPhone"
              inputProps={{ maxLength: 13 }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={onChange}
              onBlur={handleBlur}
              value={senderPhone}
            />
          </Grid>
          <Grid container item xs={12} justify="center">
            {saveProcessing ? (
              <CircularProgress color="primary" />
            ) : (
              <Button
                className={classes.b2cSaveButton}
                variant="contained"
                color="primary"
                onClick={() => onSubmit()}
              >
                SAVE
              </Button>
            )}
          </Grid>
        </>
      </Grid>
    </Box>
  );
};

export default connect()(withStyles(styles)(PayPal));
