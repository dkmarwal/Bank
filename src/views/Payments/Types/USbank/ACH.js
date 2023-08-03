import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  MenuItem,
} from '@material-ui/core';
import TextField from '~/components/Forms/TextField';
import {
  USbankupdateBankInfo,
  USbankcreateBankInfo,
  USbankGetBankData,
  UsbankachProfilesInformation,
} from '~/redux/helpers/USbank/payments';
import { fetchUSBankChildBankAccountsList } from '~/redux/actions/USbank/payments';
import { connect } from 'react-redux';
import 'react-notifications/lib/notifications.css';
import MaskInput from '~/components/MaskInput';
import trim from 'deep-trim-node';
import { withStyles } from '@material-ui/styles';
import styles from './styles.js';

const USbankACH = (props) => {
  const {
    showParentInfo,
    paymentType,
    dispatch,
    onSaveBtnClick,
    notification,
    achB2CAccountList,
    classes,
    currencyList = [],
    setAchFilled,
  } = props;
  const clientId = sessionStorage.getItem('clientId') || null;
  const parentId = sessionStorage.getItem('parentId');
  const [saveProcessing, setSaveProcessing] = useState(false);
  const [bankDetailInfo, setBankDetailInfo] = useState({
    data: {
      accountId: '',
      accountName: '',
      companyIdentification: '',
      accountNumber: '',
      routingCode: '',
      companyName: '',
      immediateOrigin: '',
      immediateOriginName: '',
      immediateDestination: '',
      immediateDestinationName: '',
      companyEntryDescription: '',
      companyDiscretionaryData: '',
      originatingDFIIdentification: '',
      originatingDFIDiscretionaryData: '',
      type: paymentType,
      currencyCode: '',
    },
    error: {
      accountName: '',
      accountId: '',
      companyIdentification: '',
      companyName: '',
      accountNumber: '',
      routingCode: '',
      companyEntryDescription: '',
      originatingDFIIdentification: '',
      currencyCode: '',
      originatingDFIDiscretionaryData: '',
      companyDiscretionaryData: '',
      immediateDestinationName: '',
    },
  });

  const { data, error } = bankDetailInfo;
  const {
    accountId,
    accountName,
    companyIdentification,
    accountNumber,
    routingCode,
    immediateOrigin,
    immediateOriginName,
    immediateDestination,
    companyEntryDescription,
    originatingDFIIdentification,
    companyName,
    companyDiscretionaryData,
    originatingDFIDiscretionaryData,
    immediateDestinationName,
    type,
    currencyCode,
  } = data;

  useEffect(() => {
    async function initBankInformation() {
      let ID = clientId;
      if (showParentInfo) {
        ID = parentId;
      }
      const achImmediateInfo = await UsbankachProfilesInformation();
      let achImmediateInfoArr = [];
      if (achImmediateInfo && achImmediateInfo.data) {
        const { data = [] } = achImmediateInfo;
        achImmediateInfoArr = data || [];
      }
      setBankDetailInfo({
        ...bankDetailInfo,
        data: {
          ...bankDetailInfo.data,
          ...achImmediateInfoArr,
        },
      });

      const getBankAccData = await USbankGetBankData(ID, paymentType);
      if (
        getBankAccData &&
        Boolean(getBankAccData.data.rows) &&
        getBankAccData.data.rows.length > 0
      ) {
        const isDefaultAccount = getBankAccData.data.rows.find((account) => {
          return account.isDefault === 1;
        });
        let finalBankDetails = isDefaultAccount
          ? isDefaultAccount
          : getBankAccData.data.rows[0];
        if (showParentInfo) {
          const { accountId, ...restDetail } = isDefaultAccount
            ? isDefaultAccount
            : getBankAccData.data.rows[0];
          finalBankDetails = restDetail;
        }
        setBankDetailInfo({
          ...bankDetailInfo,
          data: {
            ...bankDetailInfo.data,
            ...achImmediateInfoArr,
            ...finalBankDetails,
          },
        });
      }
    }

    initBankInformation();
  }, [showParentInfo, paymentType, achB2CAccountList]);

  const onChange = (event) => {
    const { name, type } = event.target;
    let { value } = event.target;
    if (type === 'select') {
      value = value === '' ? null : value;
    }
    setBankDetailInfo({
      ...bankDetailInfo,
      data: {
        ...bankDetailInfo.data,
        [name]: value === '' ? null : value.trim(),
      },
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
  const renderNotification = (mesg, title) => {
    notification(mesg, title);
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
    let valid = true;
    let validation = { [name]: '' };
    switch (name) {
      case 'companyIdentification':
        if (!value || value.trim().length === 0) {
          validation['companyIdentification'] = 'Company Identification is required.';
          valid = false;
        } else if (value && value.length !== 10) {
          validation['companyIdentification'] =
            'Company Identification should be of 10 digits.';
          valid = false;
        }
        break;
      case 'companyEntryDescription':
        if (!value || value.length === 0) {
          validation['companyEntryDescription'] =
            'Company Entry Description is required.';
          valid = false;
        } else if (value && value.length <2) {
          validation['companyEntryDescription'] =
            'Company Entry Description must not be less than 2 characters.';
          valid = false;
        }
        else if (value && value.length > 10) {
          validation['companyEntryDescription'] =
            'Company Entry Description must not be greater than 10 characters.';
          valid = false;
        }
        break;
      case 'accountName':
        if (!value || value.length === 0) {
          validation['accountName'] = 'Account Name is required.';
          valid = false;
        } else if (value && value.length > 50) {
          validation['accountName'] =
            'Account Name must not be greater than 50 characters.';
          valid = false;
        }
        break;

      case 'companyDiscretionaryData':
        if (value && value.length > 20) {
          validation['companyDiscretionaryData'] =
            'Company Discretionary Data must not be greater than 20 characters.';
          valid = false;
        }
        break;

      case 'accountNumber':
        if (!value || value.trim().length === 0) {
          validation['accountNumber'] = 'Bank Account Number is required.';
          valid = false;
        } else if (value && value.length > 17) {
          validation['accountNumber'] =
            'Bank Account Number must not be greater than 17 digits.';
          valid = false;
        } else if (value && value.length < 6) {
          validation['accountNumber'] =
            'Bank Account Number must not be less than 6 digits.';
          valid = false;
        }
        break;
      case 'currencyCode':
        if (!value || value.trim().length === 0) {
          validation['currencyCode'] = 'Currency Code is required.';
          valid = false;
        }
        break;

      case 'routingCode':
        if (!value || value.trim().length === 0) {
          validation['routingCode'] = 'Bank Routing Code is required.';
          valid = false;
        } else if (value && value.trim().length !== 9) {
          validation['routingCode'] = 'Bank Routing Code must be of 9 digits.';
          valid = false;
        }
        break;
      case 'companyName':
        if (!value || value.trim().length === 0) {
          validation['companyName'] = 'Company Name is required.';
          valid = false;
        } else if (value && value.trim().length > 16) {
          validation['companyName'] =
            'Company Name must not be greater than 16 characters.';
          valid = false;
        }
        break;
      case 'originatingDFIDiscretionaryData':
        if (value && value.trim().length > 2) {
          validation['originatingDFIDiscretionaryData'] =
            'Originating DFI Discretionary Data must not be greater than 2 characters.';
          valid = false;
        }
        break;

      case 'originatingDFIIdentification':
        if (!value || value.length === 0) {
          validation['originatingDFIIdentification'] =
            'Originating DFI Identification is required.';
          valid = false;
        } else if (value && value.length !== 8) {
          validation['originatingDFIIdentification'] =
            'Originating DFI Identification must be of 8 digits.';
          valid = false;
        }

        break;

      default: {
      }
    }
    setBankDetailInfo({
      ...bankDetailInfo,
      error: { ...validation },
    });
  };

  const onSubmit = () => {
    const valid = validation();
    setSaveProcessing(true);
    if (valid) {
      const data = {
        immediateDestinationName,
        accountId,
        accountName,
        companyIdentification,
        accountNumber: Boolean(accountNumber) ? accountNumber : null,
        routingCode,
        companyName,
        companyEntryDescription,
        originatingDFIIdentification,
        type,
        immediateOrigin,
        immediateOriginName,
        immediateDestination,
        currencyCode,
        originatingDFIDiscretionaryData,
        companyDiscretionaryData,
      };
      if (accountId) {
        dispatch(
          USbankupdateBankInfo({
            clientId,
            bankDetail: trim(data),
          })
        ).then((response) => {
          setSaveProcessing(false);
          if (response && !response.error) {
            renderNotification('success', response.message);
            dispatch(fetchUSBankChildBankAccountsList(clientId, 'ACH'));
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
          USbankcreateBankInfo({
            clientId,
            bankDetail: trim(restBankDetail),
          })
        ).then((response) => {
          if (response && response.data && response.data.accountId) {
            setBankDetailInfo({
              ...bankDetailInfo,
              data: {
                ...bankDetailInfo.data,
                accountId: response.data.accountId,
              },
            });
            renderNotification('success', response.message);
            setAchFilled(true);
            dispatch(fetchUSBankChildBankAccountsList(clientId, 'ACH'));
            onSaveBtnClick(paymentType, false);
          } else {
            const errorMsg =
              response && response.message
                ? response.message
                : 'Oops! Something went wrong.';
            setAchFilled(false);
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

    if (!companyIdentification || companyIdentification.trim().length === 0) {
      validation['companyIdentification'] = 'Company Identification is required.';
      valid = false;
    } else if (companyIdentification && companyIdentification.length !== 10) {
      validation['companyIdentification'] =
        'Company Identification should be of 10 digits.';

      valid = false;
    }
    if (!companyEntryDescription || companyEntryDescription.length === 0) {
      validation['companyEntryDescription'] =
        'Company Entry Description is required.';
      valid = false;
    } else if (companyEntryDescription && companyEntryDescription.length <2) {
      validation['companyEntryDescription'] =
        'Company Entry Description must not be less than 2 characters.';
      valid = false;
    }
    else if (companyEntryDescription && companyEntryDescription.length > 10) {
      validation['companyEntryDescription'] =
        'Company Entry Description must not be greater than 10 characters.';
      valid = false;
    }

    if (!accountName || accountName.length === 0) {
      validation['accountName'] = 'Account Name is required.';
      valid = false;
    } else if (accountName && accountName.length > 50) {
      validation['accountName'] =
        'Account Name must not be greater than 50 characters.';
      valid = false;
    }
    if (!routingCode || routingCode.length === 0) {
      validation['routingCode'] = 'Bank Routing Code is required.';
      valid = false;
    } else if (routingCode && routingCode.trim().length !== 9) {
      validation['routingCode'] = 'Bank Routing Code must be of 9 digits.';
      valid = false;
    }
    if (!accountNumber || accountNumber.length === 0) {
      validation['accountNumber'] = 'Bank Account Number is required.';
      valid = false;
    } else if (accountNumber && accountNumber.length > 17) {
      validation['accountNumber'] =
        'Bank Account Number must not be greater than 17 digits.';
      valid = false;
    } else if (accountNumber && accountNumber.length < 6) {
      validation['accountNumber'] =
        'Bank Account Number must not be less than 6 digits.';
      valid = false;
    }
    if (
      originatingDFIDiscretionaryData &&
      originatingDFIDiscretionaryData.length > 2
    ) {
      validation['originatingDFIDiscretionaryData'] =
        'Originating DFI Discretionary Data must not be greater than 2 characters.';
      valid = false;
    }
    if (companyDiscretionaryData && companyDiscretionaryData.length > 20) {
      validation['companyDiscretionaryData'] =
        'Company Discretionary Data must not be greater than 20 characters.';
      valid = false;
    }

    if (!currencyCode || currencyCode.length === 0) {
      validation['currencyCode'] = 'Currency Code is required.';
      valid = false;
    }
    if (
      !originatingDFIIdentification ||
      originatingDFIIdentification.length === 0
    ) {
      validation['originatingDFIIdentification'] =
        'Originating DFI Identification is required.';
      valid = false;
    } else if (
      originatingDFIIdentification &&
      originatingDFIIdentification.length !== 8
    ) {
      validation['originatingDFIIdentification'] =
        'Originating DFI Identification must be of 8 digits.';
      valid = false;
    }
    if (!companyName || companyName.trim().length === 0) {
      validation['companyName'] = 'Company Name is required.';
      valid = false;
    } else if (companyName && companyName.length > 16) {
      validation['companyName'] =
        'Company Name must not be greater than 16 characters.';
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
                  color='primary'
                  inputProps={{
                    maxLength: 50,
                    minLength: 1,
                  }}
                  InputLabelProps={{ className: classes.input }}
                  label='Account Name'
                  placeholder={'Account Name'}
                  error={Boolean(error.accountName)}
                  helperText={error.accountName}
                  fullWidth={true}
                  autoComplete='off'
                  required
                  variant='outlined'
                  value={accountName}
                  name='accountName'
                  onChange={onChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='primary'
                  label={'Originating DFI Identification'}
                  required
                  placeholder={'Originating DFI Identification'}
                  error={Boolean(error.originatingDFIIdentification)}
                  helperText={error.originatingDFIIdentification}
                  fullWidth={true}
                  autoComplete='off'
                  InputLabelProps={{ className: classes.input }}
                  inputProps={{
                    maxLength: 8,
                    minLength: 1,
                  }}
                  variant='outlined'
                  value={originatingDFIIdentification}
                  name='originatingDFIIdentification'
                  onChange={handleIntegerValueChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>
            <Grid item xs={6} sm={3} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='primary'
                  inputProps={{
                    maxLength: 9,
                    minLength: 1,
                  }}
                  required
                  InputLabelProps={{ className: classes.input }}
                  label={'Bank Routing Code'}
                  placeholder={'Bank Routing Code'}
                  error={Boolean(error.routingCode)}
                  helperText={error.routingCode}
                  fullWidth={true}
                  autoComplete='off'
                  variant='outlined'
                  value={routingCode}
                  name='routingCode'
                  onChange={handleIntegerValueChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>
            <Grid item xs={6} sm={3} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <MaskInput
                  id='accountNumber'
                  color='primary'
                  required
                  InputLabelProps={{ className: classes.input }}
                  label={'Bank Account Number'}
                  inputProps={{
                    maxLength: 17,
                    minLength: 6,
                  }}
                  placeholder={'Bank Account Number'}
                  helperText={error.accountNumber}
                  error={Boolean(error.accountNumber)}
                  fullWidth={true}
                  autoComplete='off'
                  variant='outlined'
                  value={accountNumber || ''}
                  onBlur={handleBlur}
                  name='accountNumber'
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
                  color='primary'
                  inputProps={{
                    maxLength: 2,
                    minLength: 1,
                  }}
                  placeholder={'Originating DFI Discretionary Data'}
                  label='Originating DFI Discretionary Data'
                  error={Boolean(error.originatingDFIDiscretionaryData)}
                  helperText={error.originatingDFIDiscretionaryData}
                  fullWidth={true}
                  autoComplete='off'
                  InputLabelProps={{ className: classes.input }}
                  variant='outlined'
                  value={originatingDFIDiscretionaryData}
                  name='originatingDFIDiscretionaryData'
                  onChange={onChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>
            <Grid item xs={6} sm={3} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='primary'
                  inputProps={{
                    maxLength: 16,
                    minLength: 1,
                  }}
                  required
                  label='Company Name'
                  placeholder={'Company Name'}
                  error={Boolean(error.companyName)}
                  helperText={error.companyName}
                  fullWidth={true}
                  autoComplete='off'
                  InputLabelProps={{ className: classes.input }}
                  variant='outlined'
                  value={companyName}
                  name='companyName'
                  onChange={onChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>
            <Grid item xs={6} sm={3} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='primary'
                  inputProps={{
                    maxLength: 10,
                    minLength: 1,
                  }}
                  label={'Company Identification'}
                  placeholder={'Company Identification'}
                  required
                  error={Boolean(error.companyIdentification)}
                  helperText={error.companyIdentification}
                  fullWidth={true}
                  autoComplete='off'
                  InputLabelProps={{ className: classes.input }}
                  variant='outlined'
                  value={companyIdentification}
                  name='companyIdentification'
                  onChange={handleIntegerValueChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='primary'
                  label={'Immediate Origin'}
                  required
                  placeholder={'Immediate Origin'}
                  disabled
                  fullWidth={true}
                  InputLabelProps={{ className: classes.input }}
                  variant='outlined'
                  autoComplete='off'
                  value={immediateOrigin}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='primary'
                  inputProps={{
                    maxLength: 10,
                    minLength: 1,
                  }}
                  label={'Company Entry Description'}
                  required
                  placeholder={'Company Entry Description'}
                  error={Boolean(error.companyEntryDescription)}
                  helperText={error.companyEntryDescription}
                  fullWidth={true}
                  autoComplete='off'
                  InputLabelProps={{ className: classes.input }}
                  variant='outlined'
                  value={companyEntryDescription}
                  name='companyEntryDescription'
                  onChange={onChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='primary'
                  label={'Immediate Origin Name'}
                  required
                  placeholder={'Immediate Origin Name'}
                  disabled
                  fullWidth={true}
                  autoComplete='off'
                  InputLabelProps={{ className: classes.input }}
                  inputProps={{
                    maxLength: 25,
                    minLength: 1,
                  }}
                  variant='outlined'
                  value={immediateOriginName}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='primary'
                  inputProps={{
                    maxLength: 20,
                    minLength: 1,
                  }}
                  label='Company Discretionary Data'
                  placeholder={'Company Discretionary Data'}
                  error={Boolean(error.companyDiscretionaryData)}
                  helperText={error.companyDiscretionaryData}
                  fullWidth={true}
                  autoComplete='off'
                  InputLabelProps={{ className: classes.input }}
                  variant='outlined'
                  value={companyDiscretionaryData}
                  name='companyDiscretionaryData'
                  onChange={onChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='primary'
                  label={'Immediate Destination'}
                  required
                  placeholder={'Immediate Destination'}
                  disabled
                  fullWidth={true}
                  autoComplete='off'
                  InputLabelProps={{ className: classes.input }}
                  inputProps={{
                    maxLength: 10,
                    minLength: 1,
                  }}
                  variant='outlined'
                  value={immediateDestination}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='primary'
                  select
                  required
                  label='Currency Code'
                  error={Boolean(error.currencyCode)}
                  helperText={error.currencyCode}
                  InputLabelProps={{ className: classes.input }}
                  value={currencyCode}
                  name='currencyCode'
                  onBlur={handleBlur}
                  variant='outlined'
                  onChange={onChange}
                >
                  <MenuItem key={''} value={''}>
                    Select
                  </MenuItem>
                  {currencyList?.map(({ isoCode, name }) =>
                    isoCode === 'USD' ? (
                      <MenuItem key={isoCode} value={isoCode}>
                        {isoCode}
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
                  color='primary'
                  label='Immediate Destination Name'
                  disabled
                  fullWidth={true}
                  autoComplete='off'
                  placeholder={'Immediate Destination Name'}
                  inputProps={{
                    maxLength: 23,
                    minLength: 1,
                  }}
                  variant='outlined'
                  value={immediateDestinationName}
                  required
                />
              </Box>
            </Grid>
          </Grid>
          <Grid container item xs={12} justify='center'>
            {saveProcessing ? (
              <CircularProgress color='primary' />
            ) : (
              <Button
                className={classes.button}
                variant='contained'
                color='primary'
                onClick={() => onSubmit()}
                style={{ color: 'white' }}
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
  ...state.b2cPayments,
  ...state.payment,
}))(withStyles(styles)(USbankACH));
