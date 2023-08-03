import React from 'react';
import styles from './styles';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import {
  FormControl,
  Select,
  MenuItem,
  Grid,
  Typography,
  TextField,
  Button,
  FormHelperText,
} from '@material-ui/core';
import AddCircleIcon from '~/assets/icons/add_circle_outline.svg';
import MaskInput from '~/components/MaskInput';
import { B2CupdateBankInfo, B2CcreateBankInfo } from '~/redux/actions/payments';
import trim from 'deep-trim-node';

const settlementConstData = {
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
};
const ZelleSettlementAccount = (props) => {
  const clientId = sessionStorage.getItem('clientId') || null;
  const {
    classes,
    dispatch,
    notification,
    handleValidation,
    selectedSettlementAccountId,
    currencyList,
    achB2CProfileInfo,
    clientSettlementAccountId,
    achAccountsList,
  } = props;
  const [settlementData, setSettlementData] = React.useState({
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
  const [settlementAccountId, setSettlementAccountId] = React.useState(-1);
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
    settlementAccountId: '',
  });

  React.useEffect(() => {
    if (selectedSettlementAccountId && selectedSettlementAccountId > 0) {
      setSettlementAccountId(selectedSettlementAccountId);
      const selectedAccount = achAccountsList?.data?.rows?.find(
        (item) => item.accountId === selectedSettlementAccountId
      );
      if (selectedAccount) {
        setSettlementData({
          ...settlementData,
          ...achB2CProfileInfo?.data,
          ...selectedAccount,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSettlementAccountId, achAccountsList, achB2CProfileInfo]);

  React.useEffect(() => {
    if (achB2CProfileInfo?.data) {
      const achProfileData = achB2CProfileInfo.data;
      setSettlementData({ ...settlementData, ...achProfileData });
    }
  }, [achB2CProfileInfo]);

  const onSettlementAccountChange = ({ target }) => {
    const { value } = target;
    setSettlementAccountId(value);
    if (value !== -1) {
      setError({ ...error, settlementAccountId: '' });
    }
    if (value && value > 0) {
      const selectedAccount = achAccountsList?.data?.rows.find(
        (item) => item.accountId === value
      );
      if (selectedAccount) {
        setSettlementData({ ...settlementData, ...selectedAccount });
      }
    } else {
      setSettlementData({ ...settlementData, ...settlementConstData });
    }
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setSettlementData({
      ...settlementData,
      [name]: value.length === 0 ? null : value,
    });
  };

  const handleIntegerValueChange = (event) => {
    const { name, value } = event.target;
    setSettlementData({
      ...settlementData,
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
    } = settlementData;

    if (routingCode && routingCode.length < 9) {
      validation['routingCode'] = 'Routing code must be of 9 digits.';
      valid = false;
    }

    if (accountNumber && accountNumber.length < 6) {
      validation['accountNumber'] =
        'Account Number must not be less than 6 digits.';
      valid = false;
    }

    if (companyName && companyName.length > 16) {
      validation['companyName'] =
        'Company Name must not be greater than 16 characters.';
      valid = false;
    }

    if (companyIdentification && companyIdentification.length < 10) {
      validation['companyIdentification'] =
        'Company Identification must be of 10 digits.';
      valid = false;
    }

    if (companyEntryDescription && companyEntryDescription.length < 2) {
      validation['companyEntryDescription'] =
        'Company Entry Description must not be less than 2 characters.';
      valid = false;
    }

    if (
      originatingDFIIdentification &&
      originatingDFIIdentification.length < 8
    ) {
      validation['originatingDFIIdentification'] =
        'Originating DFI Identification must be of 8 digits.';
      valid = false;
    }

    setError(validation);
    return valid;
  };

  const onSubmit = () => {
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
    } = settlementData;
    if (valid && paymentMethodData) {
      const data = {
        accountId: settlementAccountId,
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
      };

      if (clientSettlementAccountId) {
        dispatch(
          B2CupdateBankInfo({
            clientId: clientId,
            bankDetail: { ...data, accountId: clientSettlementAccountId },
          })
        ).then((response) => {
          if (!response) {
            const errorMsg =
              response && response.message
                ? response.message
                : 'Error while saving data';
            notification('error', errorMsg);
            return false;
          } else {
            props.onSubmit(clientSettlementAccountId);
          }
        });
      } else if(settlementAccountId !== -1) {
        const { accountId, ...restBankDetail } = data;
        dispatch(
          B2CcreateBankInfo({
            clientId: clientId,
            bankDetail: trim(restBankDetail),
          })
        ).then((response) => {
          if (response && !response.error && response.data) {
            setSettlementData({
              ...restBankDetail,
              ...achB2CProfileInfo?.data,
              accountId: response.data.accountId,
            });
            setSettlementAccountId(response.data.accountId);
            props.onSubmit(response.data.accountId);
          } else {
            notification('error', 'Error while saving data');
            return false;
          }
        });
      } else {
        props.onSubmit(null)
      }
    } else {
      notification(
        'error',
        'Validation error! Please fill the required information.'
      );
      return false;
    }
  };
  let noNameAccountCount = 1;
  return (
    <>
      <Grid container>
        <Grid item xs={12} className={classes.settlementHeading}>
          <Typography>Add Settlement Account Details</Typography>
        </Grid>
        <Grid
          item
          xs={6}
          className={classes.inputBox}
          style={{ paddingTop: '0px' }}
        >
          <FormControl
            variant="outlined"
            error={Boolean(error.settlementAccountId)}
          >
            <Select
              id="demo-simple-select-outlined"
              value={settlementAccountId}
              onChange={(e) => onSettlementAccountChange(e)}
            >
              <MenuItem value={-1}>
                <em>Select</em>
              </MenuItem>
              {achAccountsList?.data?.rows?.map((item) => {
                let tempAccountName = '';
                if (!item.accountName) {
                  tempAccountName = `Settlement Account ${
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
                  alt="ADD"
                  className={classes.plusIcon}
                />
                New Bank Deposit (ACH) Account
              </MenuItem>
            </Select>
            {error.settlementAccountId && (
              <FormHelperText>{error.settlementAccountId}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
      {settlementAccountId && settlementAccountId !== -1 && (
        <Grid container>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label="Account Name"
              error={error.accountName}
              helperText={error.accountName}
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              color="secondary"
              value={settlementData.accountName || ''}
              name="accountName"
              onChange={onChange}
              inputProps={{
                maxLength: 50,
                minLength: 1,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label="Originating DFI Identification"
              error={error.originatingDFIIdentification}
              helperText={error.originatingDFIIdentification}
              fullWidth={true}
              autoComplete="off"
              color="secondary"
              variant="outlined"
              value={settlementData.originatingDFIIdentification || ''}
              name="originatingDFIIdentification"
              onChange={handleIntegerValueChange}
              inputProps={{
                maxLength: 8,
                minLength: 8,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.multitBox}>
            <TextField
              label="Bank Routing Code"
              error={error.routingCode}
              helperText={error.routingCode}
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              color="secondary"
              value={settlementData.routingCode || ''}
              name="routingCode"
              inputProps={{
                maxLength: 9,
                minLength: 9,
              }}
              onChange={handleIntegerValueChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <MaskInput
              label="Account Number"
              error={error.accountNumber}
              helperText={error.accountNumber}
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              color="secondary"
              value={settlementData.accountNumber || ''}
              name="accountNumber"
              inputProps={{
                maxLength: 17,
                minLength: 6,
              }}
              getValue={(val) => {
                setSettlementData({
                  ...settlementData,
                  accountNumber: val,
                });
              }}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ paddingLeft: '5px', paddingRight: '0px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label="Originating DFI Discretionary Data"
              fullWidth={true}
              autoComplete="off"
              color="secondary"
              variant="outlined"
              value={settlementData.originatingDFIDiscretionaryData || ''}
              name="originatingDFIDiscretionaryData"
              onChange={onChange}
              inputProps={{
                maxLength: 2,
                minLength: 1,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} className={classes.multitBox}>
            <TextField
              label="Company Name"
              error={error.companyName}
              helperText={error.companyName}
              fullWidth={true}
              autoComplete="off"
              color="secondary"
              variant="outlined"
              value={settlementData.companyName || ''}
              name="companyName"
              onChange={onChange}
              inputProps={{
                minLength: 1,
                maxLength: 16,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Company Identification"
              error={error.companyIdentification}
              helperText={error.companyIdentification}
              fullWidth={true}
              autoComplete="off"
              color="secondary"
              variant="outlined"
              value={settlementData.companyIdentification || ''}
              name="companyIdentification"
              onChange={handleIntegerValueChange}
              inputProps={{
                maxLength: 10,
                minLength: 10,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.multitBox}>
            <TextField
              label="Immediate Destination"
              color="secondary"
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              value={settlementData.immediateDestination || ''}
              name="immediateDestination"
              inputProps={{
                maxLength: 9,
                minLength: 9,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              disabled
            />
            <TextField
              label="Immediate Origin"
              fullWidth={true}
              autoComplete="off"
              color="secondary"
              variant="outlined"
              value={settlementData.immediateOrigin || ''}
              name="immediateOrigin"
              inputProps={{
                maxLength: 10,
                minLength: 10,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label="Company Entry Description"
              error={error.companyEntryDescription}
              helperText={error.companyEntryDescription}
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              variant="outlined"
              value={settlementData.companyEntryDescription || ''}
              name="companyEntryDescription"
              onChange={onChange}
              inputProps={{
                maxLength: 10,
                minLength: 2,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label="Immediate Destination Name"
              color="secondary"
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              value={settlementData.immediateDestinationName || ''}
              name="immediateDestinationName"
              inputProps={{
                maxLength: 23,
                minLength: 1,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label="Company Discretionary Data"
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              variant="outlined"
              value={settlementData.companyDiscretionaryData || ''}
              name="companyDiscretionaryData"
              onChange={onChange}
              inputProps={{
                maxLength: 20,
                minLength: 1,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label="Immediate Origin Name"
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              variant="outlined"
              value={settlementData.immediateOriginName || ''}
              name="immediateOriginName"
              inputProps={{
                maxLength: 23,
                minLength: 1,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              select
              fullWidth={true}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              autoComplete="off"
              value={settlementData.currencyCode}
              name="currencyCode"
              label="Currency Code"
              onChange={onChange}
              dir="horizontal"
              inputProps={{
                maxLength: 100,
              }}
              error={error.currencyCode}
              helperText={error.currencyCode}
            >
              {currencyList &&
                currencyList
                  .filter((item) => item.isoCode === 'USD')
                  .map((code) => (
                    <MenuItem key={code.isoCode} value={code.isoCode}>
                      {code.isoCode}
                    </MenuItem>
                  ))}
            </TextField>
          </Grid>
        </Grid>
      )}
      <Grid container>
        <Grid item xs={12} className={classes.btnHolder}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onSubmit()}
          >
            SAVE
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default connect((state) => ({
  ...state.user,
  ...state.b2cPayments,
}))(withStyles(styles)(ZelleSettlementAccount));
