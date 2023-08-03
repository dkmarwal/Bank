import React, { Component } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
} from '@material-ui/core';
import MaskInput from '~/components/MaskInput';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {
  priorityTypeList,
  fetchUSBankCheckData,
  updateUSBankCheckData,
  createUSBankCheckData,
  getUSbankZelleData,
} from '~/redux/actions/USbank/payments';
import 'react-notifications/lib/notifications.css';
import styles from './styles.js';
import trim from 'deep-trim-node';
import { paymentMethods } from '~/config/paymentMethods.js';

class USBankCheck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkDetail: {
        data: {
          clientId: '',
          zellePayFromAccountNumber: '',
          zellePayerId: '',
          zellePriorityType: 1,
          enableCheckToZelleEnrolledPayees: false,
        },
        error: {
          clientId: '',
          zellePayFromAccountNumber: '',
          zellePayerId: '',
          zellePriorityType: '',
        },
      },
      clientCheckId: props.usBankpayment.usbankCheckData?.data?.[0]?.id,
      saveProcessing: false,
    };
  }
  componentDidMount = () => {
    this.fetchPriorityTypeList();
    this.getCheckAPIData();
  };
  componentDidUpdate = (prevProps) => {
    if (
      (!prevProps.usBankpayment.usbankCheckData?.data?.length &&
        this.props.usBankpayment.usbankCheckData?.data?.length) ||
      (prevProps.usBankpayment.usbankCheckData?.data?.length &&
        this.props.usBankpayment.usbankCheckData?.data?.length &&
        JSON.stringify(prevProps.usBankpayment.usbankCheckData.data[0]) !==
          JSON.stringify(this.props.usBankpayment.usbankCheckData.data[0]))
    ) {
      this.setState({
        checkDetail: {
          ...this.state.checkDetail,
          data: this.props.usBankpayment.usbankCheckData.data[0],
        },
      });
    }
  };
  getCheckAPIData = () => {
    const clientId = sessionStorage.getItem('clientId') || null;
    let Id = clientId;
    if (this.props.showParentInfo && this.props.parentId) {
      Id = this.props.parentId;
    }
    this.props.dispatch(fetchUSBankCheckData(Id)).then((response) => {
      if (response && response.error) {
        const errorMsg =
          this.props.usBankpayment.usbankCheckData &&
          this.props.usBankpayment.usbankCheckData.error
            ? this.props.usBankpayment.usbankCheckData.error
            : null;
        this.props.notification('error', errorMsg);
        return false;
      } else {
        this.setAPIDataInState();
      }
    });
  };
  setAPIDataInState = () => {
    if (this.props.usBankpayment.usbankCheckData?.data?.length) {
      let finalCheckDetails = this.props.usBankpayment.usbankCheckData.data[0];
      if (this.props.showParentInfo) {
        const { id, ...restDetail } =
          this.props.usBankpayment.usbankCheckData.data[0];
        finalCheckDetails = restDetail;
      }
      if (
        Object.keys(this.props.usBankpayment.usbankCheckData.data[0]).length
      ) {
        this.setState({
          checkDetail: {
            ...this.state.checkDetail,
            data: {
              ...finalCheckDetails,
              id: this.state.clientCheckId ?? undefined,
            },
          },
        });
      }
    }
  };
  fetchPriorityTypeList = () => {
    this.props.dispatch(priorityTypeList()).then((response) => {
      if (response && response.error) {
        this.props.notification(
          'error',
          this.props.usBankpayment.priorityTypeList.error
        );
        return false;
      }
    });
  };
  onChange = (event) => {
    const { name } = event.target;
    let { value } = event.target;
    if (name === 'zellePriorityType') {
      value = value === '' ? null : value;
    } else if (name === 'zellePayerId') {
    } else {
      value = value === '' ? null : value.replace(/[^0-9]/g);
    }
    this.setState({
      checkDetail: {
        ...this.state.checkDetail,
        data: { ...this.state.checkDetail.data, [name]: value },
      },
    });
  };

  handleBlur = (event) => {
    const { name, value } = event.target;
    let validation = {};
    switch (name) {
      case 'zellePayerId':
        if (!value || !value?.trim().length) {
          validation['zellePayerId'] = 'Payer ID is required';
        } else if (value && value.length > 10) {
          validation['zellePayerId'] =
            'Payer ID must not be greater than 10 digits.';
        } else if (value && value.length < 3) {
          validation['zellePayerId'] =
            'Payer ID must not be less than 3 digits.';
        } else validation['zellePayerId'] = '';
        break;
      case 'zellePayFromAccountNumber':
        if (!value || !value.length) {
          validation['zellePayFromAccountNumber'] =
            'Account Number is required';
        }
        if (value && value.length > 17) {
          validation['zellePayFromAccountNumber'] = "Account Number must not be greater than 17 digits.";
        } else if (value && value.length < 6) {
          validation['zellePayFromAccountNumber'] = "Account Number can not be less than 6 characters.";
        }
        break;
      default:
        break;
    }

    this.setState({
      checkDetail: {
        ...this.state.checkDetail,
        error: {
          ...this.state.checkDetail.error,
          ...validation,
        },
      },
    });
  };

  handleRadioButton = (event) => {
    const targetVal = event.target.value === 'true' || event.target.value === true
    this.setState({
      checkDetail: {
        ...this.state.checkDetail,
        data: {
          ...this.state.checkDetail.data,
          enableCheckToZelleEnrolledPayees: targetVal,
        },
      },
    });
  };

  renderNotification = (type) => {
    if (type) {
      this.props.notification(
        'error',
        this.props.usBankpayment.storedUSBankCheckData?.error ??
          'Something went wrong'
      );
    } else {
      this.props.notification(
        'success',
        this.props.usBankpayment.storedUSBankCheckData?.data?.message
      );
    }
  };

  getAddedCheckData = () => {
    const checkId =
      this.props.usBankpayment.storedUSBankCheckData?.data?.data?.id;
    this.setState({
      checkDetail: {
        ...this.state.checkDetail,
        data: {
          ...this.state.checkDetail.data,
          id: checkId ?? null,
        },
      },
      clientCheckId: checkId,
    });
  };

  isZelleSelected = () => {
    const zellePayment = this.props.sortedSelectedMethods.filter(
      (payMethod) => {
        return payMethod.paymentCode === paymentMethods.USBankZelle;
      }
    );
    if (zellePayment?.length) {
      return true;
    }
    return false;
  };

  onSubmit = () => {
    const valid = this.validation();
    const tempProps = this.props;
    if (valid) {
      const clientId = sessionStorage.getItem('clientId') || null;
      this.setState({
        saveProcessing: true,
      });
      const checkData = trim(this.state.checkDetail?.data);
      if (checkData.id || this.state.clientCheckId) {
        tempProps
          .dispatch(updateUSBankCheckData(checkData, clientId))
          .then((response) => {
            if (response && !response.error) {
              this.renderNotification();
              tempProps.onSaveBtnClick(tempProps.paymentType, false);
              const isZellePaymentMethodSelected = this.isZelleSelected();
              if (
                isZellePaymentMethodSelected
              ) {
                this.props.dispatch(getUSbankZelleData(clientId));
              }
              this.setState({
                saveProcessing: false,
              });
            } else {
              this.renderNotification('error');
              this.setState({
                saveProcessing: false,
              });
              return false;
            }
          });
      } else {
        tempProps
          .dispatch(createUSBankCheckData(checkData, clientId))
          .then((response) => {
            if (response && !response.error) {
              this.setState({
                saveProcessing: false,
              });
              const isZellePaymentMethodSelected = this.isZelleSelected();
              if (
                isZellePaymentMethodSelected
              ) {
                this.props.dispatch(getUSbankZelleData(clientId));
              }
              this.getAddedCheckData();
              this.renderNotification();
              tempProps.onSaveBtnClick(tempProps.paymentType, false);
            } else {
              this.renderNotification('error');
              this.setState({
                saveProcessing: false,
              });
              return false;
            }
          });
      }
    } else {
      tempProps.notification(
        'error',
        'Validation error! Please fill the required information.'
      );
    }
  };

  validation = () => {
    let valid = true;
    let validation = {};
    const { zellePayerId, zellePriorityType, zellePayFromAccountNumber } =
      this.state.checkDetail.data;
    if (!zellePayerId || !zellePayerId.trim()?.length) {
      validation['zellePayerId'] = 'Payer ID is required.';
      valid = false;
    } else if (zellePayerId.trim().length < 3) {
      validation['zellePayerId'] = 'Payer ID must not be less than 3 digits.';
      valid = false;
    } else if (zellePayerId.trim().length > 10) {
      validation['zellePayerId'] =
        'Payer ID must not be greater than 10 digits.';
      valid = false;
    }
    if (!zellePriorityType) {
      validation['zellePriorityType'] = 'Priority Type is required.';
      valid = false;
    }
    if (
      !zellePayFromAccountNumber ||
      !zellePayFromAccountNumber.trim()?.length
    ) {
      validation['zellePayFromAccountNumber'] = 'Account Number is required.';
      valid = false;
    }
    else if (zellePayFromAccountNumber && zellePayFromAccountNumber.length > 17) {
      validation['zellePayFromAccountNumber'] = "Account Number must not be greater than 17 digits.";
      valid = false;
    } else if (zellePayFromAccountNumber && zellePayFromAccountNumber.length < 6) {
      validation['zellePayFromAccountNumber'] = "Account Number can not be less than 6 characters.";
      valid = false;
    }
    this.setState({
      checkDetail: {
        ...this.state.checkDetail,
        error: { ...validation },
      },
    });
    return valid;
  };

  render() {
    const { classes } = this.props;
    const { data, error } = this.state.checkDetail;
    const {
      zellePayerId,
      zellePriorityType,
      zellePayFromAccountNumber,
      enableCheckToZelleEnrolledPayees,
    } = data;
    return (
      <Box>
        <Grid container justifyContent='center' spacing={2}>
          <Grid container justifyContent='flex-start'>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='secondary'
                  label='Payer ID'
                  placeholder='Payer ID'
                  error={Boolean(error.zellePayerId)}
                  helperText={error.zellePayerId}
                  fullWidth={true}
                  autoComplete='off'
                  variant='outlined'
                  value={zellePayerId}
                  name='zellePayerId'
                  onChange={this.onChange}
                  onBlur={this.handleBlur}
                  required
                  inputProps={{
                    maxLength: 10,
                    minLength: 3,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='secondary'
                  label='Priority Type'
                  placeholder='Priority Type'
                  error={Boolean(error.zellePriorityType)}
                  helperText={error.zellePriorityType}
                  fullWidth={true}
                  variant='outlined'
                  value={zellePriorityType}
                  name='zellePriorityType'
                  onChange={this.onChange}
                  required
                  select
                >
                  {this.props.usBankpayment?.priorityTypeList?.data?.map(
                    ({ description, priorityTypeId }) => (
                      <MenuItem key={priorityTypeId} value={priorityTypeId}>
                        {description}
                      </MenuItem>
                    )
                  )}
                </TextField>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <MaskInput
                  id='zellePayFromAccountNumber'
                  color='primary'
                  label='Account Number'
                  placeholder={'Account Number'}
                  required
                  error={Boolean(error.zellePayFromAccountNumber)}
                  helperText={error.zellePayFromAccountNumber}
                  name='zellePayFromAccountNumber'
                  fullWidth={true}
                  autoComplete='off'
                  variant='outlined'
                  inputProps={{ minLength: 1, maxLength: 17 }}
                  InputLabelProps={{ className: classes.input }}
                  value={zellePayFromAccountNumber}
                  onBlur={this.handleBlur}
                  getValue={(val) => {
                    this.setState({
                      checkDetail: {
                        ...this.state.checkDetail,
                        data: {
                          ...this.state.checkDetail.data,
                          zellePayFromAccountNumber: val,
                        },
                      },
                    });
                  }}
                />
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              className={classes.gridItem}
              style={{ display: 'flex' }}
            >
              <Box
                display={'flex'}
                alignItems='center'
                style={{ margin: 'auto', marginLeft: '10px' }}
              >
                <Typography className={classes.panelHeading}>
                  Enable Checks to Zelle Enrolled Payees
                </Typography>
                <RadioGroup
                  name='enableCheckToZelleEnrolledPayees'
                  onChange={this.handleRadioButton}
                  value={enableCheckToZelleEnrolledPayees ?? false}
                  style={{ flexDirection: 'row', paddingLeft: "15px" }}
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio color='primary' />}
                    label='Yes'
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio color='primary' />}
                    label='No'
                  />
                </RadioGroup>
              </Box>
            </Grid>
          </Grid>
          <Grid container item xs={11} justify='center'>
            {this.state.saveProcessing ? (
              <CircularProgress color='primary' />
            ) : (
              <Button
                className={classes.button}
                variant='contained'
                color='primary'
                onClick={() => this.onSubmit()}
                style={{ color: 'white' }}
              >
                Save
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default connect((state) => ({
  ...state.b2cPayments,
  ...state.USbankpayment,
}))(withStyles(styles)(USBankCheck));
