import React, { Component } from 'react';
import styles from '~/views/Payments/B2C/styles';
import { withStyles } from '@material-ui/styles';
import MaskInput from '~/components/MaskInput';
import { RadioGroup, Radio } from '@material-ui/core';
import {
  Grid,
  Box,
  MenuItem,
  Typography,
  CircularProgress,
  Button,
} from '@material-ui/core';
import TextField from '~/components/Forms/TextField';
import { connect } from 'react-redux';
import {
  getUSbankZelleData,
  priorityTypeList,
  updateUSbankZelle,
  addUSbankZelle,
  fetchUSBankCheckData
} from '~/redux/actions/USbank/payments';
import trim from 'deep-trim-node';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { paymentMethods } from '~/config/paymentMethods.js';

class USbankZelle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasSaveBtnClicked: false,
      saveProcessing: false,
      cardData: {
        clientId: null,
        zellePayerId: '',
        zellePriorityType: 1,
        convertToCheckIfZelleFailed: false,
        convertToCheckIfZelleExp: false,
        zellePayFromAccountNumber: '',
      },
      errorData: {
        zellePayerId: null,
        zellePriorityType: null,
        convertToCheckIfZelleFailed: null,
        convertToCheckIfZelleExp: null,
        zellePayFromAccountNumber: null,
      },
      clientSettlementAccountId: null,
    };
  }

  async componentDidMount() {
    const clientID = sessionStorage.getItem('clientId') || null;
    const parentId = sessionStorage.getItem('parentId');
    let Id = clientID;
    if (this.props.showParentInfo) {
      Id = parentId;
    }
    if (
      this.props.getZelleData?.data &&
      Object.keys(this.props.getZelleData.data).length
    ) {
      this.setState({
        cardData: {
          ...this.state.cardData,
          id: this.props.getZelleData.data?.id ?? null,
        },
      });
    }
    await this.getCardData();
  }

  componentDidUpdate = (prevProps) => {
    if (
      (!prevProps.getZelleData?.data?.length &&
      this.props.getZelleData?.data?.length) || 
      (prevProps.getZelleData?.data?.length &&
        this.props.getZelleData?.data?.length &&
        JSON.stringify(prevProps.getZelleData.data[0]) !==
          JSON.stringify(this.props.getZelleData.data[0]))
    ) {
      this.setState({
        cardData: this.props.getZelleData.data[0],
      });
    }
  };

  onRadiobuttonChange = (event, name) => {
    const targetVal = event.target.value === 'true' || event.target.value === true
    this.setState({
      ...this.state,
      cardData: {
        ...this.state.cardData,
        [name]: targetVal
      },
    });
  };
  onChangeselect = (event) => {
    const { name, value } = event.target;

    this.setState({
      cardData: {
        ...this.state.cardData,
        [name]: value,
      },
    });
  };

  onChange = (event) => {
    const numeric = /^[0-9]*\.?[0-9]*$/;
    const { name, value } = event.target;
    if (name === 'zellePayFromAccountNumber') {
      if (numeric.test(value)) {
        this.setState({
          cardData: {
            ...this.state.cardData,
            [name]: event.target.value,
          },
        });
      }
    } else {
      this.setState({
        cardData: {
          ...this.state.cardData,
          [name]: event.target.value.trim(),
        },
      });
    }
  };

  handleBlur = (event) => {
    const { name, value } = event.target;
    let validation = {};
    switch (name) {
      case 'zellePayerId':
        if (!value || value.trim().length === 0) {
          validation['zellePayerId'] = 'Payer ID is required';
        }
        if (value && value.length > 10) {
          validation['zellePayerId'] =
            'Payer ID must not be greater than 10 digits.';
        }
        if (value && value.length < 3) {
          validation['zellePayerId'] =
            'Payer ID must not be less than 3 digits.';
        }
        break;
      case 'zellePayFromAccountNumber':
        if (!value || value.length === 0) {
          validation['zellePayFromAccountNumber'] =
            'Account Number is required';
        } else if (value && value.length > 17) {
          validation['zellePayFromAccountNumber'] = "Account Number must not be greater than 17 digits.";
        } else if (value && value.length < 6) {
          validation['zellePayFromAccountNumber'] = "Account Number can not be less than 6 characters.";
        }
        
        break;

      default: {
        break;
      }
    }

    this.setState({
      errorData: {
        ...validation,
      },
    });
  };

  saveZelleData = () => {
    let valid = true;
    let validation = {};
    const { zellePayerId, zellePayFromAccountNumber } = this.state.cardData;

    if (!zellePayerId || zellePayerId.trim().length === 0) {
      validation['zellePayerId'] = 'Payer ID is required';
      valid = false;
    }
    if (zellePayerId && zellePayerId.length > 10) {
      validation['zellePayerId'] =
        'Payer ID must not be greater than 10 digits.';
      valid = false;
    }
    if (zellePayerId && zellePayerId.length < 3) {
      validation['zellePayerId'] = 'Payer ID must not be less than 3 digits.';
      valid = false;
    }
    if (!zellePayFromAccountNumber || zellePayFromAccountNumber.length === 0) {
      validation['zellePayFromAccountNumber'] = 'Account Number is required';
      valid = false;
    }
    
    if (zellePayFromAccountNumber && zellePayFromAccountNumber.length > 17) {
      validation['zellePayFromAccountNumber'] = "Account Number must not be greater than 17 digits.";
      valid = false;
    } else if (zellePayFromAccountNumber && zellePayFromAccountNumber.length < 6) {
      validation['zellePayFromAccountNumber'] = "Account Number can not be less than 6 characters.";
      valid = false;
    }

    this.setState({
      errorData: {
        ...validation,
      },
    });
    return valid;
  };

  onSubmit = () => {
    const valid = this.saveZelleData();
    this.setState({
      saveProcessing: true,
    });
    if (valid) {
      this.storeDataInDB();
    } else {
      this.props.notification(
        'error',
        'Validation error! Please fill the required information.'
      );
      this.setState({
        saveProcessing: false,
      });
    }
  };

  renderNotification = () => {
    this.props.notification(
      'success',
      this.props.usBankpayment.storedZelleData?.data?.message
    );
  };

  getAddedZelleData = (cardStateData) => {
    if (this.props.usBankpayment.storedZelleData?.data?.data?.id) {
      this.setState({
        cardData: {
          ...cardStateData,
          id: this.props.usBankpayment.storedZelleData?.data.data.id,
        },
      });
    }
  };

  isCheckSelected = () => {
    const checkPayment = this.props.sortedSelectedMethods.filter(
      (payMethod) => {
        return payMethod.paymentCode === paymentMethods.USBankCHK;
      }
    );
    if (checkPayment?.length) {
      return true;
    }
    return false;
  };

  storeDataInDB = () => {
    const clientID = sessionStorage.getItem('clientId') || null;
    const tempProps = this.props;
    const cardStateData = trim(this.state.cardData);
    if (cardStateData.id) {
      this.props
        .dispatch(updateUSbankZelle(cardStateData, clientID))
        .then((response) => {
          this.setState({
            ...this.state,
            saveProcessing: false,
          });
          if (response && !response.error) {
            this.renderNotification();
            const isCheckPaymentMethodSelected = this.isCheckSelected();
            if (
              isCheckPaymentMethodSelected
            ) {
              this.props.dispatch(fetchUSBankCheckData(clientID));
            }
            tempProps.onSaveBtnClick(tempProps.paymentType, false);
            this.setState({
              showParentList: false,
            });
          } else {
            tempProps.notification(
              'error',
              this.props.usBankpayment.storedZelleData?.error ??
                'Something went wrong'
            );
            tempProps.onSaveBtnClick(tempProps.paymentType, true);
            return false;
          }
        });
    } else {
      this.props
        .dispatch(addUSbankZelle(cardStateData, clientID))
        .then((response) => {
          if (response && !response.error) {
            this.getAddedZelleData(cardStateData);
            const isCheckPaymentMethodSelected = this.isCheckSelected();
            if (
              isCheckPaymentMethodSelected
            ) {
              this.props.dispatch(fetchUSBankCheckData(clientID));
            }
            this.setState(
              {
                ...this.state,
                hasSaveBtnClicked: true,
              },
              () => {
                this.renderNotification();
                tempProps.onSaveBtnClick(tempProps.paymentType, false);
                this.setState({
                  showParentList: false,
                  saveProcessing: false,
                });
              }
            );
          } else {
            tempProps.notification(
              'error',
              this.props.usBankpayment.storedZelleData.error
            );
            tempProps.onSaveBtnClick(tempProps.paymentType, true);
            return false;
          }
        });
    }
  };

  getCardData = () => {
    const { showParentInfo } = this.props;
    const clientId = sessionStorage.getItem('clientId') || null;
    const parentId = sessionStorage.getItem('parentId');
    let Id = clientId;
    if (showParentInfo && parentId) {
      Id = parentId;
    }
    const tempProps = this.props;
    this.props.dispatch(getUSbankZelleData(Id)).then((response) => {
      if (response && response.error) {
        tempProps.notification('error', this.props.getZelleData.error);
        return false;
      } else {
        this.passAPIDataOnTextField();
      }
    });
  };

  passAPIDataOnTextField = () => {
    const { showParentInfo } = this.props;
    if (this.props.getZelleData && this.props.getZelleData.data[0]) {
      let finalZelleDetails = this.props.getZelleData.data[0];
      if (showParentInfo) {
        const { id, ...restDetail } = this.props.getZelleData.data[0];
        finalZelleDetails = restDetail;
      }

      this.setState({
        ...this.state,
        cardData: {
          zellePayerId: finalZelleDetails.zellePayerId,
          zellePriorityType: finalZelleDetails.zellePriorityType,

          convertToCheckIfZelleFailed:
            finalZelleDetails.convertToCheckIfZelleFailed,
          convertToCheckIfZelleExp: finalZelleDetails.convertToCheckIfZelleExp,
          zellePayFromAccountNumber:
            finalZelleDetails.zellePayFromAccountNumber,
          id: finalZelleDetails.id,
        },
      });
    }
    this.fetchPriorityTypeList();
  };

  fetchPriorityTypeList = () => {
    const tempProps = this.props;
    this.props.dispatch(priorityTypeList()).then((response) => {
      if (response && response.error) {
        tempProps.notification(
          'error',
          this.props.usBankpayment.priorityTypeList.error
        );
        return false;
      }
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        <Box className={classes.popupInner}>
          <Grid container>
            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                name='zellePayerId'
                color='primary'
                label='Payer ID'
                placeholder={'Payer ID*'}
                required
                variant='outlined'
                value={this.state.cardData.zellePayerId}
                onChange={this.onChange}
                onBlur={this.handleBlur}
                disabled={false}
                autoComplete='off'
                inputProps={{ maxLength: 10, minLength: 3 }}
                error={Boolean(this.state.errorData.zellePayerId)}
                helperText={this.state.errorData.zellePayerId}
                // InputLabelProps={{
                //   shrink: true,
                // }}
              />
            </Grid>
            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                name='zellePriorityType'
                color='primary'
                select
                label='Priority Type'
                required
                value={this.state.cardData.zellePriorityType}
                dir='horizontal'
                // SelectProps={{
                //   native: true,
                // }}
                fullWidth={true}
                variant='outlined'
                InputLabelProps={{
                  shrink: true,
                }}
                autoComplete='off'
                onChange={this.onChangeselect}
                onBlur={this.handleBlur}
              >
                {this.props.usBankpayment.priorityTypeList.data &&
                  this.props.usBankpayment.priorityTypeList.data.map(
                    ({ description, priorityTypeId }) => (
                      <MenuItem key={priorityTypeId} value={priorityTypeId}>
                        {description}
                      </MenuItem>
                    )
                  )}
              </TextField>
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <MaskInput
                id='zellePayFromAccountNumber'
                color='primary'
                label='Account Number'
                placeholder={'Account Number*'}
                required
                error={Boolean(this.state.errorData.zellePayFromAccountNumber)}
                helperText={this.state.errorData.zellePayFromAccountNumber}
                name='zellePayFromAccountNumber'
                fullWidth={true}
                autoComplete='off'
                variant='outlined'
                inputProps={{ minLength: 1, maxLength: 17 }}
                InputLabelProps={{ className: classes.input }}
                value={this.state.cardData.zellePayFromAccountNumber}
                onBlur={this.handleBlur}
                getValue={(val) => {
                  this.setState({
                    cardData: {
                      ...this.state.cardData,
                      zellePayFromAccountNumber: val,
                    },
                  });
                }}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <Box display='flex' justifyContent='flex-start'>
                <Box width='500px' style={{ margin: 'auto' }}>
                  <Typography className={classes.panelHeading}>
                    Convert to Check if Zelle Expired
                  </Typography>
                </Box>

                <Box width='300px'>
                  <RadioGroup
                    row
                    aria-label='position'
                    name='convertToCheckIfZelleExp'
                    value={this.state.cardData.convertToCheckIfZelleExp??false}
                    onChange={(e) =>
                      this.onRadiobuttonChange(e, 'convertToCheckIfZelleExp')
                    }
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio color='primary' />}
                      label='Yes'
                      labelPlacement='end'
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio color='primary' />}
                      label='No'
                      labelPlacement='end'
                    />
                  </RadioGroup>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <Box display='flex' justifyContent='flex-start'>
                <Box width='500px' pt={1.1} style={{ margin: 'auto' }}>
                  <Typography className={classes.panelHeading}>
                    Convert to Check if Zelle Failed/Denied
                  </Typography>
                </Box>
                {/* <Box pl={4}> */}
                <Box width='300px'>
                  {/* <Box pl={4}> */}
                  <RadioGroup
                    row
                    aria-label='position'
                    name='convertToCheckIfZelleFailed'
                    value={this.state.cardData.convertToCheckIfZelleFailed??false}
                    onChange={(e) =>
                      this.onRadiobuttonChange(e, 'convertToCheckIfZelleFailed')
                    }
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio color='primary' />}
                      label='Yes'
                      labelPlacement='end'
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio color='primary' />}
                      label='No'
                      labelPlacement='end'
                    />
                  </RadioGroup>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Grid container item xs={12} justify='center'>
            {this.state.saveProcessing ? (
              <CircularProgress color='primary' />
            ) : (
              <Button
                className={classes.button}
                variant='contained'
                color='primary'
                onClick={() => this.onSubmit()}
                style={{ color: 'white' }}

                // const valid = this.validateForm("ACH") || true;
              >
                Save
              </Button>
            )}
          </Grid>
        </Box>
      </>
    );
  }
}
export default connect((state) => ({
  ...state.clientConfig,
  ...state.b2cPayments,
  ...state.user,
  ...state.payment,
  ...state.csc,
  ...state.USbankpayment,
}))(withStyles(styles)(USbankZelle));
