import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  MenuItem,
} from '@material-ui/core';
import TextField from '~/components/Forms/TextField';
import { makeStyles } from '@material-ui/core/styles';
import {
  B2CupdateBankInfo,
  B2CcreateBankInfo,
  B2CachProfilesInformation,
  B2CGetBankData,
} from '~/redux/actions/payments';
import { connect } from 'react-redux';
import 'react-notifications/lib/notifications.css';
import MaskInput from '~/components/MaskInput';
import trim from 'deep-trim-node';
import {fetchB2CBankAccountsList} from '~/redux/actions/B2C/payments'

const useStyles = makeStyles((theme) => ({
  gridItem: {
    margin: 0,
    '& .MuiOutlinedInput-notchedOutline': {
      '& legend': {
        fontSize: '0.85em',
      },
    },
  },
  b2cSaveButton: {
    fontSize: 14,
    color: 'white'
  }
}));

const B2CACH = ({
  currencyList = [],
  bankDetail,
  showParentInfo,
  paymentType,
  dispatch,
  onSaveBtnClick,
  notification,
  achB2CAccountList
}) => {
  const clientId = sessionStorage.getItem('clientId') || null;
  const parentId = sessionStorage.getItem('parentId');
  const [saveProcessing, setSaveProcessing] = useState(false);
  const [bankDetailInfo, setBankDetailInfo] = useState({
    data: {
      accountId: '',
      accountName: null,
      accountNumber: null,
      routingCode: null,
      AchProfileId: '',
      companyName: null,
      immediateOrigin: '',
      immediateOriginName: '',
      immediateDestination: '',
      immediateDestinationName: '',
      companyIdentification: null,
      companyEntryDescription: null,
      companyDiscretionaryData: null,
      originatingDFIIdentification: null,
      originatingDFIDiscretionaryData: null,
      cardAccountId: '',
      bankName: '',
      bankAddress1: '',
      bankAddress2: '',
      bankCity: '',
      bankStateRegion: '',
      bankZipPostal: '',
      BankContact: '',
      bankContactEmail: '',
      bankPhone: '',
      bankPhoneExt: '',
      accountClassification: '',
      paymentMethodId: '',
      acctClassId: '',
      formatingFlags: '',
      originatorShortName: '',
      type: paymentType,
      currencyCode: '',
    },
    error: {
      accountId: '',
      accountName: '',
      accountNumber: '',
      routingCode: '',
      AchProfileId: '',
      companyName: '',
      companyIdentification: '',
      companyEntryDescription: '',
      companyDiscretionaryData: '',
      originatingDFIIdentification: '',
      originatingDFIDiscretionaryData: '',
      cardAccountId: '',
      bankName: '',
      bankAddress1: '',
      bankAddress2: '',
      bankCity: '',
      bankStateRegion: '',
      bankZipPostal: '',
      BankContact: '',
      bankContactEmail: '',
      bankPhone: '',
      bankPhoneExt: '',
      accountClassification: '',
      paymentMethodId: '',
      acctClassId: '',
      formatingFlags: '',
      originatorShortName: '',
      type: paymentType,
      currencyCode: '',
    },
  });

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
    type,
    currencyCode,
  } = data;

  useEffect(() => {
    async function initBankInformation() {
      let ID = clientId;
      if (showParentInfo) {
        ID = parentId;
      }
      const achImmediateInfo = await B2CachProfilesInformation();
      let achImmediateInfoArr = [];
      if (achImmediateInfo && achImmediateInfo.data) {
        const { data = [] } = achImmediateInfo;
        achImmediateInfoArr = data || [];
        // const immediateOriginFields = await get
      }

      setBankDetailInfo({
        ...bankDetailInfo,
        data: {
          ...bankDetailInfo.data,
          ...bankDetail,
          ...achImmediateInfoArr,
        },
      });

      const getBankAccData = await B2CGetBankData(ID, paymentType);
      if (
        getBankAccData &&
        Boolean(getBankAccData.data.rows) &&
        getBankAccData.data.rows.length > 0
      ) {
        const isDefaultAccount = getBankAccData.data.rows.find((account)=>{
          return account.isDefault === 1
        })
        let finalBankDetails = isDefaultAccount ? isDefaultAccount :getBankAccData.data.rows[0];
        if (showParentInfo) {
          const { accountId, ...restDetail } = isDefaultAccount ? isDefaultAccount :getBankAccData.data.rows[0];
          finalBankDetails = restDetail;
        }
        setBankDetailInfo({
          ...bankDetailInfo,
          data: {
            ...bankDetailInfo.data,
            ...bankDetail,
            ...achImmediateInfoArr,
            ...finalBankDetails,
          },
        });
      }
    }

    initBankInformation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showParentInfo, bankDetail, paymentType,achB2CAccountList]);

  const onChange = (event) => {
    const { name, type } = event.target;
    let { value } = event.target;
    if (type === 'select') {
      value = value === '' ? null : value;
    }
    setBankDetailInfo({
      ...bankDetailInfo,
      data: { ...bankDetailInfo.data, [name]: value === '' ? null : value },
    });
  };

  const handleIntegerValueChange = (event) => {
    const { name, value } = event.target;
    setBankDetailInfo({
      ...bankDetailInfo,
      data: {
        ...bankDetailInfo.data,
        [name]: value === '' ? null : value.replace(/[^0-9]/g, ''),
      },
    });
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
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
        accountName,
        accountNumber: Boolean(accountNumber) ? accountNumber : null,
        routingCode,
        companyName,
        companyIdentification,
        companyEntryDescription,
        companyDiscretionaryData,
        originatingDFIIdentification,
        originatingDFIDiscretionaryData,
        type,
        currencyCode,
      };

      if (accountId) {
        dispatch(
          B2CupdateBankInfo({
            clientId,
            bankDetail: trim(data),
          })
        ).then((response) => {
          setSaveProcessing(false);
          if (response && !response.error) {
            dispatch(fetchB2CBankAccountsList(clientId, paymentType))
            notification('success', 'Bank Account data updated successfully');
            onSaveBtnClick(paymentType, false);
          } else {
            const errorMsg =
              response && response.message
                ? response.message
                : 'Oops! Something went wrong.';
            notification('error', errorMsg);
            return false;
          }
        });
      } else {
        const { accountId, ...restBankDetail } = data;
        dispatch(
          B2CcreateBankInfo({
            clientId,
            bankDetail: trim(restBankDetail),
          })
        ).then((response) => {
          dispatch(fetchB2CBankAccountsList(clientId, paymentType))
          if (response && response.data && response.data.accountId) {
            setBankDetailInfo({
              ...bankDetailInfo,
              data: {
                ...bankDetailInfo.data,
                accountId: response.data.accountId,
              },
            });
            notification('success', 'Bank Account data saved successfully');
            onSaveBtnClick(paymentType, false);
          } else {
            const errorMsg =
              response && response.message
                ? response.message
                : 'Oops! Something went wrong.';
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

    if (accountNumber && accountNumber.length > 17) {
      validation['accountNumber'] =
        'Account Number must not be greater than 17 digits.';
      valid = false;
    }
    if (accountNumber && accountNumber.length < 6) {
      validation['accountNumber'] =
        'Account Number must not be less than 6 digits.';
      valid = false;
    }
    if (accountName && accountName.length > 50) {
      validation['accountName'] =
        'Account Name must not be greater than 50 characters.';
      valid = false;
    }
    if (routingCode && routingCode.length !== 9) {
      validation['routingCode'] = 'Routing code must be of 9 digits.';
      valid = false;
    }
    if (companyName && companyName.length > 16) {
      validation['companyName'] =
        'Company Name must not be greater than 16 characters.';
      valid = false;
    }
    if (companyIdentification && companyIdentification.length !== 10) {
      validation['companyIdentification'] =
        'CompanyIdentification must be of 10 digits.';
      valid = false;
    }
    if (companyEntryDescription && companyEntryDescription.length < 2) {
      validation['companyEntryDescription'] =
        'CompanyEntryDescription must not be less than 2 characters.';
      valid = false;
    }
    if (companyEntryDescription && companyEntryDescription.length > 10) {
      validation['companyEntryDescription'] =
        'Company Entry Description must not be greater than 10 characters.';
      valid = false;
    }
    if (companyDiscretionaryData && companyDiscretionaryData.length > 20) {
      validation['companyDiscretionaryData'] =
        'Company Discretionary Data must not be greater than 20 characters.';
      valid = false;
    }
    if (
      originatingDFIIdentification &&
      originatingDFIIdentification.length !== 8
    ) {
      validation['originatingDFIIdentification'] =
        'originatingDFIIdentification must be of 8 digits.';
      valid = false;
    }
    if (
      originatingDFIDiscretionaryData &&
      originatingDFIDiscretionaryData.length > 2
    ) {
      validation['originatingDFIDiscretionaryData'] =
        'OriginatingDFIDiscretionaryData must not be greater than 2 characters.';
      valid = false;
    }

    setBankDetailInfo({
      ...bankDetailInfo,
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
                  label="Routing Code"
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
                  onChange={handleIntegerValueChange}
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
                  label="Account Number"
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
                />
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
                  label=" Company Identification"
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
                  onChange={handleIntegerValueChange}
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
                  select
                  label="Currency Code"
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
                  <MenuItem key={''} value={''}>
                    Select
                  </MenuItem>
                  {currencyList.map(({ isoNumeric, isoCode, name }) =>
                    isoCode === 'USD' ? (
                      <MenuItem key={isoCode} value={isoCode}>
                        {name}
                      </MenuItem>
                    ) : (
                      <></>
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
                  onChange={handleIntegerValueChange}
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
                    disabled
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
                    disabled
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
                    disabled
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
                    disabled
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

export default connect((state) => ({
  ...state.b2cPayments,
}))(B2CACH);
