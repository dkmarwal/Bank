import React from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Grid,
  Typography,
  TextField,
  FormHelperText,
  InputLabel,
} from '@material-ui/core';
import {
  USbankupdateBankInfo,
  USbankcreateBankInfo,
} from '~/redux/helpers/USbank/payments';
import MaskInput from '~/components/MaskInput';
import AddCircleIcon from '~/assets/icons/add_circle_outline.svg';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import styles from './styles.js';
import trim from 'deep-trim-node';

const achAccountConstData = {
  accountName: null,
  accountNumber: null,
  routingCode: null,
  companyName: null,
  companyIdentification: null,
  companyDiscretionaryData: null,
  originatingDFIDiscretionaryData: null,
  originatingDFIIdentification: null,
  companyEntryDescription: null,
  currencyCode: null,
  accountId: null,
};

const FocusNonPayrollACHAccount = (props) => {
  const {
    classes,
    selectedSettlementAccountId,
    achAccountsList,
    reliaFocusParams,
    currencyList,
    handleValidation,
    clientACHAccountId,
    dispatch,
    notification,
    achUSBankProfileInfo,
    handleSaveProcessing,
    showParentInfo,
    isSubmitClicked,
    handleIsSubmitClicked,
  } = props;
  const clientId = sessionStorage.getItem('clientId') || null;
  const [achAccountData, setAchAccountData] = React.useState({
    accountName: null,
    accountNumber: null,
    routingCode: null,
    companyName: null,
    companyIdentification: null,
    companyEntryDescription: null,
    companyDiscretionaryData: null,
    originatingDFIIdentification: null,
    originatingDFIDiscretionaryData: null,
    currencyCode: null,
    accountId: null,
  });
  const [error, setError] = React.useState({
    accountName: '',
    accountNumber: '',
    routingCode: '',
    companyName: '',
    companyIdentification: '',
    companyEntryDescription: '',
    companyDiscretionaryData: '',
    originatingDFIIdentification: '',
    immediateOrigin: '',
    immediateOriginName: '',
    immediateDestination: '',
    immediateDestinationName: '',
    currencyCode: '',
    achAccountId: '',
  });
  const [achAccountId, setAchAccountId] = React.useState(-1);

  React.useEffect(()=>{
    // for triggering submit function of this component when 
    // click is triggered from parent component
    if(isSubmitClicked) {
      onSubmit();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isSubmitClicked]);

  React.useEffect(() => {
    if (achUSBankProfileInfo?.data) {
      const achProfileData = achUSBankProfileInfo.data;
      setAchAccountData({ ...achAccountData, ...achProfileData });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [achUSBankProfileInfo]);

  React.useEffect(() => {
    if (selectedSettlementAccountId && selectedSettlementAccountId > 0) {
      setAchAccountId(selectedSettlementAccountId);
      const selectedAccount = achAccountsList?.data?.rows?.find(
        (item) => item.accountId === selectedSettlementAccountId
      );
      if (selectedAccount) {
        setAchAccountData({
          ...achAccountData,
          ...selectedAccount,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSettlementAccountId, achAccountsList, reliaFocusParams]);

  const onACHAccountChange = ({ target }) => {
    const { value } = target;
    setAchAccountId(value);
    if (value !== -1) {
      setError({ ...error, achAccountId: '' });
    }
    if (value && value > 0) {
      const selectedAccount = achAccountsList?.data?.rows.find(
        (item) => item.accountId === value
      );
      if (selectedAccount) {
        setAchAccountData({ ...achAccountData, ...selectedAccount });
      }
    } else {
      setAchAccountData({ ...achAccountData, ...achAccountConstData });
    }
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setAchAccountData({
      ...achAccountData,
      [name]: value.length === 0 ? null : value,
    });
  };

  const handleIntegerValueChange = (event) => {
    const { name, value } = event.target;
    setAchAccountData({
      ...achAccountData,
      [name]: value === '' ? null : value.replace(/[^0-9]/g, ''),
    });
  };

  const validation = () => {
    let valid = true;
    let validation = {};
    const {
      routingCode,
      accountNumber,
      companyName,
      companyIdentification,
      companyEntryDescription,
      originatingDFIIdentification,
      accountName,
      currencyCode,
      immediateDestination,
      immediateDestinationName,
      immediateOrigin,
      immediateOriginName,
    } = achAccountData;
    if (achAccountId === -1) {
      validation['achAccountId'] = 'Bank Account (ACH) is required.';
      valid = false;
    } else {
      if (!accountName) {
        validation['accountName'] = 'Account Name is required.';
        valid = false;
      }
      if (!routingCode) {
        validation['routingCode'] = 'Bank Routing Code is required.';
        valid = false;
      } else if (routingCode && routingCode.length !== 9) {
        validation['routingCode'] = 'Bank Routing Code must be of 9 digits.';
        valid = false;
      }
      if (!accountNumber) {
        validation['accountNumber'] = 'Bank Account Number is required.';
        valid = false;
      } else if (accountNumber && accountNumber.length < 6) {
        validation['accountNumber'] =
          'Bank Account Number must not be less than 6 digits.';
        valid = false;
      }
      if (!companyName) {
        validation['companyName'] = 'Company Name is required.';
        valid = false;
      } else if (companyName && companyName.length > 16) {
        validation['companyName'] =
          'Company Name must not be greater than 16 characters.';
        valid = false;
      }

      if (!companyIdentification) {
        validation['companyIdentification'] =
          'Company Identificationis required.';
        valid = false;
      } else if (companyIdentification && companyIdentification.length < 10) {
        validation['companyIdentification'] =
          'Company Identification must be of 10 digits.';
        valid = false;
      }

      if (!companyEntryDescription) {
        validation['companyEntryDescription'] =
          'Company Entry Description is required.';
        valid = false;
      } else if (
        companyEntryDescription &&
        companyEntryDescription.length < 2
      ) {
        validation['companyEntryDescription'] =
          'Company Entry Description must not be less than 2 characters.';
        valid = false;
      }
      if (!currencyCode) {
        validation['currencyCode'] = 'Currency Code is required.';
        valid = false;
      }
      if (!originatingDFIIdentification) {
        validation['originatingDFIIdentification'] =
          'Originating DFI Identification is required.';
        valid = false;
      } else if (
        originatingDFIIdentification &&
        originatingDFIIdentification.length < 8
      ) {
        validation['originatingDFIIdentification'] =
          'Originating DFI Identification must be of 8 digits.';
        valid = false;
      }
      if (!immediateOrigin) {
        validation['immediateOrigin'] = 'Immediate Origin is required.';
        valid = false;
      }
      if (!immediateDestination) {
        validation['immediateDestination'] =
          'Immediate Destination is required.';
        valid = false;
      }
      if (!immediateOriginName) {
        validation['immediateOriginName'] =
          'Immediate Origin Name is required.';
        valid = false;
      }
      if (!immediateDestinationName) {
        validation['immediateDestinationName'] =
          'Immediate Destination Name is required.';
        valid = false;
      }
    }

    setError(validation);
    return valid;
  };

  const onSubmit = () => {
    handleIsSubmitClicked(false)
    const valid = validation();
    const paymentMethodData = handleValidation();
    const {
      currencyCode,
      accountName,
      routingCode,
      accountNumber,
      companyName,
      companyIdentification,
      companyEntryDescription,
      originatingDFIIdentification,
      originatingDFIDiscretionaryData,
      companyDiscretionaryData,
      immediateDestination,
      immediateDestinationName,
      immediateOrigin,
      immediateOriginName,
    } = achAccountData;
    if (valid && paymentMethodData) {
      handleSaveProcessing(true);
      const data = {
        accountId: achAccountId,
        accountName,
        accountNumber: Boolean(accountNumber) ? accountNumber : null,
        routingCode,
        companyName,
        companyIdentification,
        companyEntryDescription,
        companyDiscretionaryData,
        originatingDFIIdentification,
        originatingDFIDiscretionaryData,
        currencyCode,
        type: 'ACH',
        immediateDestination,
        immediateDestinationName,
        immediateOrigin,
        immediateOriginName,
      };

      if (clientACHAccountId || (!showParentInfo && achAccountId > -1)) {
        const clientAccountId = clientACHAccountId
          ? clientACHAccountId
          : !showParentInfo && achAccountId > -1
          ? achAccountId
          : null;
        dispatch(
          USbankupdateBankInfo({
            clientId: clientId,
            bankDetail: {
              ...data,
              accountId: clientAccountId,
            },
          })
        ).then((response) => {
          if (!response || response.error) {
            const errorMsg =
              response && response.message
                ? response.message
                : 'Error while saving data';
            notification('error', errorMsg);
            handleSaveProcessing(false);
            return false;
          } else {
            props.onSubmit(clientAccountId);
          }
        });
      } else if (achAccountId !== -1) {
        const { accountId, ...restBankDetail } = data;
        dispatch(
          USbankcreateBankInfo({
            clientId: clientId,
            bankDetail: trim(restBankDetail),
          })
        ).then((response) => {
          if (response && !response.error && response.data) {
            setAchAccountData({
              ...restBankDetail,
              accountId: response.data.accountId,
            });
            setAchAccountId(response.data.accountId);
            props.onSubmit(response.data.accountId);
          } else {
            handleSaveProcessing(false);
            notification('error', 'Error while saving data');
            return false;
          }
        });
      } else {
        props.onSubmit(null);
      }
    } else {
      notification(
        'error',
        'Validation error! Please fill the required information.'
      );
      handleSaveProcessing(false);
      return false;
    }
  };

  let noNameAccountCount = 1;
  return (
    <>
      <Grid container>
        <Grid item xs={12} className={classes.settlementHeading}>
          <Typography>Add Bank Account (ACH) Details</Typography>
        </Grid>
        <Grid
          item
          xs={6}
          className={classes.inputBox}
          style={{ paddingTop: '0px' }}
        >
          <FormControl variant='outlined' error={Boolean(error.achAccountId)}>
            <InputLabel id='demo-simple-select-required-label'>
              Bank Account (ACH)*
            </InputLabel>
            <Select
              labelId='demo-simple-select-required-label'
              id='demo-simple-select-outlined'
              value={achAccountId}
              onChange={(e) => onACHAccountChange(e)}
              required
              label='Bank Deposit(ACH)*'
            >
              <MenuItem value={-1}>
                <em>Select</em>
              </MenuItem>
              {achAccountsList?.data?.rows?.map((item) => {
                let tempAccountName = '';
                if (!item.accountName) {
                  tempAccountName = `Bank Deposit(ACH) Account ${
                    noNameAccountCount < 10 ? '0' : ''
                  }${noNameAccountCount}`;
                  noNameAccountCount++;
                }
                return (
                  <MenuItem
                    value={item.accountId}
                    className={classes.accountsMenuList}
                  >
                    <Grid
                      container
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Grid item>
                        {tempAccountName ? tempAccountName : item.accountName}
                      </Grid>
                      <Grid
                        item
                        style={{ color: '#9E9E9E', paddingRight: '8px' }}
                      >
                        {item.accountNumber}
                      </Grid>
                    </Grid>
                  </MenuItem>
                );
              })}
              <MenuItem value={'-2'} className={classes.newAccountMenu}>
                <img
                  src={AddCircleIcon}
                  alt='ADD'
                  className={classes.plusIcon}
                />
                New Bank Account (ACH)
              </MenuItem>
            </Select>
            {error.achAccountId && (
              <FormHelperText>{error.achAccountId}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
      {achAccountId && achAccountId !== -1 && (
        <Grid container>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label='Account Name'
              error={error.accountName}
              helperText={error.accountName}
              fullWidth={true}
              autoComplete='off'
              variant='outlined'
              color='secondary'
              value={achAccountData.accountName || ''}
              name='accountName'
              onChange={onChange}
              inputProps={{
                maxLength: 50,
                minLength: 1,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label='Originating DFI Identification'
              error={error.originatingDFIIdentification}
              helperText={error.originatingDFIIdentification}
              fullWidth={true}
              autoComplete='off'
              color='secondary'
              variant='outlined'
              value={achAccountData.originatingDFIIdentification || ''}
              name='originatingDFIIdentification'
              onChange={handleIntegerValueChange}
              inputProps={{
                maxLength: 8,
                minLength: 8,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.multitBox}>
            <TextField
              label='Bank Routing Code'
              error={error.routingCode}
              helperText={error.routingCode}
              fullWidth={true}
              autoComplete='off'
              variant='outlined'
              color='secondary'
              value={achAccountData.routingCode || ''}
              name='routingCode'
              inputProps={{
                maxLength: 9,
                minLength: 9,
              }}
              onChange={handleIntegerValueChange}
              required
            />
            <MaskInput
              id='accountNumber'
              color='secondary'
              required
              InputLabelProps={{ className: classes.input }}
              label={'Bank Account Number'}
              inputProps={{
                maxLength: 17,
                minLength: 6,
              }}
              helperText={error.accountNumber}
              error={Boolean(error.accountNumber)}
              fullWidth={true}
              autoComplete='off'
              variant='outlined'
              value={achAccountData.accountNumber || ''}
              name='accountNumber'
              getValue={(val) => {
                setAchAccountData({
                  ...achAccountData,
                  accountNumber: val,
                });
              }}
              style={{ paddingLeft: '5px', paddingRight: '0px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label='Originating DFI Discretionary Data'
              fullWidth={true}
              autoComplete='off'
              color='secondary'
              variant='outlined'
              value={achAccountData.originatingDFIDiscretionaryData || ''}
              name='originatingDFIDiscretionaryData'
              onChange={onChange}
              inputProps={{
                maxLength: 2,
                minLength: 1,
              }}
              // required
            />
          </Grid>

          <Grid item xs={12} sm={6} className={classes.multitBox}>
            <TextField
              label='Company Name'
              error={error.companyName}
              helperText={error.companyName}
              fullWidth={true}
              autoComplete='off'
              color='secondary'
              variant='outlined'
              value={achAccountData.companyName || ''}
              name='companyName'
              onChange={onChange}
              inputProps={{
                minLength: 1,
                maxLength: 16,
              }}
              required
            />
            <TextField
              label='Company Identification'
              error={error.companyIdentification}
              helperText={error.companyIdentification}
              fullWidth={true}
              autoComplete='off'
              color='secondary'
              variant='outlined'
              value={achAccountData.companyIdentification || ''}
              name='companyIdentification'
              onChange={handleIntegerValueChange}
              inputProps={{
                maxLength: 10,
                minLength: 10,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label='Immediate Origin'
              fullWidth={true}
              error={error.immediateOrigin}
              helperText={error.immediateOrigin}
              autoComplete='off'
              color='secondary'
              variant='outlined'
              value={achAccountData.immediateOrigin || ''}
              name='immediateOrigin'
              inputProps={{
                maxLength: 10,
                minLength: 10,
              }}
              disabled
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label='Company Entry Description'
              error={error.companyEntryDescription}
              helperText={error.companyEntryDescription}
              fullWidth={true}
              color='secondary'
              autoComplete='off'
              variant='outlined'
              value={achAccountData.companyEntryDescription || ''}
              name='companyEntryDescription'
              onChange={onChange}
              inputProps={{
                maxLength: 10,
                minLength: 2,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label='Immediate Origin Name'
              fullWidth={true}
              error={error.immediateOriginName}
              helperText={error.immediateOriginName}
              color='secondary'
              autoComplete='off'
              variant='outlined'
              value={achAccountData.immediateOriginName || ''}
              name='immediateOriginName'
              inputProps={{
                maxLength: 23,
                minLength: 1,
              }}
              disabled
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label='Company Discretionary Data'
              fullWidth={true}
              color='secondary'
              autoComplete='off'
              variant='outlined'
              value={achAccountData.companyDiscretionaryData || ''}
              name='companyDiscretionaryData'
              onChange={onChange}
              inputProps={{
                maxLength: 20,
                minLength: 1,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label='Immediate Destination'
              color='secondary'
              fullWidth={true}
              error={error.immediateDestination}
              helperText={error.immediateDestination}
              autoComplete='off'
              variant='outlined'
              value={achAccountData.immediateDestination || ''}
              name='immediateDestination'
              inputProps={{
                maxLength: 9,
                minLength: 9,
              }}
              disabled
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              select
              fullWidth={true}
              variant='outlined'
              autoComplete='off'
              value={achAccountData.currencyCode ?? ''}
              name='currencyCode'
              label='Currency Code'
              onChange={onChange}
              dir='horizontal'
              inputProps={{
                maxLength: 100,
              }}
              required
              error={error.currencyCode}
              helperText={error.currencyCode}
            >
              {currencyList &&
                currencyList
                  .filter((item) => item.isoCode === 'USD')
                  .map((code) => (
                    <MenuItem key={code.isoCode} value={code.isoCode}>
                      {code.name}
                    </MenuItem>
                  ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label='Immediate Destination Name'
              color='secondary'
              fullWidth={true}
              error={error.immediateDestinationName}
              helperText={error.immediateDestinationName}
              autoComplete='off'
              variant='outlined'
              value={achAccountData.immediateDestinationName || ''}
              name='immediateDestinationName'
              inputProps={{
                maxLength: 23,
                minLength: 1,
              }}
              disabled
              required
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default connect((state) => ({
  ...state.user,
  ...state.b2cPayments,
  ...state.USbankpayment,
}))(withStyles(styles)(FocusNonPayrollACHAccount));
