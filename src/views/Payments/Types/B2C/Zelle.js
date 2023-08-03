import React, { Component } from 'react';
import styles from '~/views/Payments/B2C/styles';
import { withStyles } from '@material-ui/styles';
import {
  Grid,
  Box,
  MenuItem,
  Tooltip,
  InputAdornment,
} from '@material-ui/core';
import TextField from '~/components/Forms/TextField';
import { connect } from 'react-redux';
import {
  getZelleData,
  senderTypeList,
  senderProductType,
  addZelle,
  updateZelle,
  fetchB2CachProfilesInformation,
  fetchB2CBankAccountsList,
  fetchB2CChildBankAccountsList,
} from '~/redux/actions/B2C/payments';
import { CountryIso, CityIso, StateIso } from '~/components/CSC';
import trim from 'deep-trim-node';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ZelleSettlementAccount from './SettlementAccount/zelle';
import { getB2CGeneralSettingConfig } from '~/redux/helpers/filesettings';

class Zelle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      senderList: [],
      productTypeList: [],
      hasSaveBtnClicked: false,
      cardData: {
        clientId: null,
        senderType: 'Big-Business',
        senderName: null,
        address_line1: null,
        address_line2: null,
        city: null,
        state: null,
        zipcode: null,
        countryCode: null,
        productType: 'b2c',
        debitNetwork: 1,
        secondaryDDA: 0,
        visaIdCode: null,
        visaMerchantCategoryCode: null,
        businessIndicator: null,
        merchantCategoryCode: null,
        cardAcceptorId: null,
        customerContact: null,
        paymentType: null,
        firstNameRiskScore: '00',
        lastNameRiskScore: '00',
        combinedRiskScore: '00',
        senderPhone: null,
        senderEmail: null,
        payeeAcceptanceExpiryDays: null,
        allowRegisterViaZella: 0,
        noOfDaysBeforeEnrolmentExpire: 0,
        isAuthorizeDebit: 0,
        zelleTokenFromConsumer: 0,
      },
      errorData: {
        senderType: null,
        senderName: null,
        address_line1: null,
        address_line2: null,
        city: null,
        state: null,
        zipcode: null,
        countryCode: null,
        productType: null,
        debitNetwork: null,
        secondaryDDA: null,
        visaIdCode: null,
        visaMerchantCategoryCode: null,
        businessIndicator: null,
        merchantCategoryCode: null,
        cardAcceptorId: null,
        customerContact: null,
        paymentType: null,
        firstNameRiskScore: null,
        lastNameRiskScore: null,
        combinedRiskScore: null,
        senderEmail: null,
        payeeAcceptanceExpiryDays: null,
        noOfDaysBeforeEnrolmentExpire: null,
      },
      clientSettlementAccountId: null,
      showParentList: false,
    };
  }

  async componentDidMount() {
    const clientID = sessionStorage.getItem('clientId') || null;
    let Id = clientID;
    if (this.props.showParentInfo) {
      Id = this.props.parentId;
      this.props.dispatch(fetchB2CBankAccountsList(Id, 'ACH'));
      this.setState({
        showParentList: true,
      });
    }
    if (
      this.props.getZelleData?.data &&
      Object.keys(this.props.getZelleData.data).length
    ) {
      this.setState({
        cardData: {
          ...this.state.cardData,
          zelle_id: this.props.getZelleData.data?.zelle_id ?? null,
        },
        clientSettlementAccountId:
          this.props.getZelleData.data?.settlementAccountId ?? null,
      });
      this.props.dispatch(fetchB2CChildBankAccountsList(clientID, 'ACH'));
    }
    await this.getCardData();
    this.props.dispatch(fetchB2CachProfilesInformation());
  }

  onCheckboxChange = (event, name) => {
    event.target.checked
      ? this.setState({
          ...this.state,
          cardData: {
            ...this.state.cardData,
            [name]: 1,
          },
        })
      : this.setState({
          ...this.state,
          cardData: {
            ...this.state.cardData,
            [name]: 0,
          },
        });
  };

  onChange = (event) => {
    const numeric = /^[0-9]*\.?[0-9]*$/;
    const { name } = event.target;

    if (
      name === 'firstNameRiskScore' ||
      name === 'lastNameRiskScore' ||
      name === 'combinedRiskScore'
    ) {
      if (numeric.test(event.currentTarget.value)) {
        this.setState({
          cardData: {
            ...this.state.cardData,
            [name]: event.target.value,
          },
        });
      }
    } else if (name === 'senderPhone' && event.target.value) {
      let { value } = event.target;
      let finalValue = value || null;
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
      this.setState({
        cardData: {
          ...this.state.cardData,
          [name]: finalValue,
        },
      });
    } else if (name === 'countryCode') {
      let { value } = event.target;
      this.setState({
        cardData: {
          ...this.state.cardData,
          [name]: value,
          zipcode: '',
        },
      });
      this.saveZelleData();
    } else if (
      name === 'visaMerchantCategoryCode' ||
      name === 'merchantCategoryCode' ||
      name === 'payeeAcceptanceExpiryDays'
    ) {
      let { value } = event.target;
      this.setState({
        cardData: {
          ...this.state.cardData,
          [name]: value.replace(/[^0-9]/g, ''),
        },
      });
    } else {
      let { value } = event.target;
      this.setState({
        cardData: {
          ...this.state.cardData,
          [name]: value,
        },
      });
    }
  };

  handleBlur = (event) => {
    const { name, value } = event.target;
    this.setState({
      cardData: {
        ...this.state.cardData,
        [name]: value?.trim() ?? value,
      },
    });
  };

  saveZelleData = () => {
    let valid = true;
    let validation = {};
    const {
      visaMerchantCategoryCode,
      businessIndicator,
      merchantCategoryCode,
      paymentType,
      firstNameRiskScore,
      lastNameRiskScore,
      combinedRiskScore,
      payeeAcceptanceExpiryDays,
      senderEmail,
      noOfDaysBeforeEnrolmentExpire,
      allowRegisterViaZella,
    } = this.state.cardData;

    const reg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;

    if (visaMerchantCategoryCode && visaMerchantCategoryCode.length < 4) {
      validation.visaMerchantCategoryCode =
        'Visa Merchant Category Code should be of 4 digits';
      valid = false;
    }
    if (businessIndicator && businessIndicator.length < 2) {
      validation.businessIndicator =
        'Visa Business Application Indicator should be of 2 digits';
      valid = false;
    }
    if (merchantCategoryCode && merchantCategoryCode.length < 4) {
      validation.merchantCategoryCode =
        'MasterCard Merchant Category Code should be of 4 digits';
      valid = false;
    }
    if (paymentType && paymentType.length < 3) {
      validation.paymentType = 'MasterCard Payment Type should be of 3 digits';
      valid = false;
    }
    if (firstNameRiskScore && firstNameRiskScore.length < 2) {
      validation.firstNameRiskScore =
        'First Name Risk Score should be of 2 digits';
      valid = false;
    }
    if (lastNameRiskScore && lastNameRiskScore.length < 2) {
      validation.lastNameRiskScore =
        'Last Name Risk Score should be of 2 digits';
      valid = false;
    }
    if (combinedRiskScore && combinedRiskScore.length < 2) {
      validation.combinedRiskScore =
        'Combined Risk Score should be of 2 digits';
      valid = false;
    }
    if (senderEmail && !reg.test(senderEmail)) {
      validation.senderEmail =
        'Please enter a valid Client Sender Contact Email Address';
      valid = false;
    }
    if (payeeAcceptanceExpiryDays && payeeAcceptanceExpiryDays === 0) {
      validation.payeeAcceptanceExpiryDays =
        'Payee Payment Acceptance Expiry Days must be in range (1-99)';
      valid = false;
    }
    if (
      allowRegisterViaZella &&
      (!noOfDaysBeforeEnrolmentExpire ||
        noOfDaysBeforeEnrolmentExpire < 1 ||
        noOfDaysBeforeEnrolmentExpire > 14)
    ) {
      validation.noOfDaysBeforeEnrolmentExpire =
        'Number of Days value must be in range (1-14)';
      valid = false;
    }
    this.setState({
      errorData: {
        ...validation,
      },
    });
    return valid;
  };

  onSubmit = (settlementAccountId) => {
    const valid = this.saveZelleData();
    if (valid) {
      const { debitNetwork } = this.state.cardData;
      if (debitNetwork !== 1) {
        this.setState(
          {
            ...this.state,
            cardData: {
              ...this.state.cardData,
              visaIdCode: null,
              visaMerchantCategoryCode: null,
              businessIndicator: null,
              merchantCategoryCode: null,
              cardAcceptorId: null,
              customerContact: null,
              paymentType: null,
            },
          },
          () => this.storeDataInDB(settlementAccountId)
        );
      } else {
        this.storeDataInDB(settlementAccountId);
      }
    } else {
      this.props.notification(
        'error',
        'Validation error! Please fill the required information.'
      );
    }
  };

  storeDataInDB = (settlementAccountId) => {
    const clientID = sessionStorage.getItem('clientId') || null;
    const tempProps = this.props;
    const cardStateData = trim(this.state.cardData);

    if (cardStateData.zelle_id) {
      this.props
        .dispatch(updateZelle(cardStateData, clientID, settlementAccountId))
        .then((response) => {
          if (response && !response.error) {
            this.props.dispatch(fetchB2CChildBankAccountsList(clientID, 'ACH'));
            this.setState({
              cardData: {
                ...cardStateData,
                settlementAccountId: settlementAccountId,
              },
              clientSettlementAccountId: settlementAccountId,
            });
            tempProps.notification(
              'success',
              'Zelle data updated successfully'
            );
            tempProps.onSaveBtnClick(tempProps.paymentType, false);
            this.setState({
              showParentList: false,
            });
          } else {
            tempProps.notification('error', this.props.storedZelleData.error);
            tempProps.onSaveBtnClick(tempProps.paymentType, true);
            return false;
          }
        });
    } else {
      this.props
        .dispatch(addZelle(cardStateData, clientID, settlementAccountId))
        .then((response) => {
          if (response && !response.error) {
            if (response && response.zelle_id) {
              this.setState({
                ...this.state,
                cardData: {
                  ...cardStateData,
                  zelle_id: response.zelle_id,
                  settlementAccountId: settlementAccountId,
                },
                clientSettlementAccountId: settlementAccountId,
              });
            }
            this.props.dispatch(fetchB2CChildBankAccountsList(clientID, 'ACH'));
            this.setState(
              {
                ...this.state,
                hasSaveBtnClicked: true,
              },
              () => {
                tempProps.notification(
                  'success',
                  'Zelle data saved successfully'
                );
                tempProps.onSaveBtnClick(tempProps.paymentType, false);
                this.setState({
                  showParentList: false,
                });
              }
            );
          } else {
            tempProps.notification('error', this.props.storedZelleData.error);
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
    this.props.dispatch(getZelleData(Id, showParentInfo)).then((response) => {
      if (response && response.error) {
        tempProps.notification('error', this.props.getZelleData.error);
        return false;
      } else {
        this.passAPIDataOnTextField();
      }
    });
  };

  passAPIDataOnTextField = () => {
    if (
      Boolean(this.props.getZelleData) &&
      Object.keys(this.props.getZelleData.data).length > 0
    ) {
      const { showParentInfo } = this.props;
      let finalZelleDetails = this.props.getZelleData.data;
      if (showParentInfo) {
        const { zelle_id, ...restDetail } = this.props.getZelleData.data;
        finalZelleDetails = restDetail;
      }
      this.setState(
        {
          ...this.state,
          cardData: {
            ...finalZelleDetails,
            zelle_id: this.state.cardData.zelle_id,
          },
        },
        () => this.fetchSenderTypeList()
      );
    } else {
      const clientId = sessionStorage.getItem("clientId");
      getB2CGeneralSettingConfig(clientId).then((res) => {
        if (res?.data) {
          this.setState({
            cardData: {
              ...this.state.cardData,
              noOfDaysBeforeEnrolmentExpire:
                res.data.noOfDaysBeforeEnrolmentExpire,
              payeeAcceptanceExpiryDays:
                res.data.payeePaymentAcceptanceExpiryDays,
            },
          });
        }
      });
      this.fetchSenderTypeList();
    }
  };

  fetchSenderTypeList = () => {
    const tempProps = this.props;
    this.props.dispatch(senderTypeList()).then((response) => {
      if (response && response.error) {
        tempProps.notification('error', this.props.senderTypeList.error);
        return false;
      } else {
        this.storeSenderList();
      }
    });
  };

  storeSenderList = () => {
    if (Boolean(this.props.senderTypeList)) {
      this.setState(
        {
          ...this.state,
          senderList: this.props.senderTypeList.data,
        },
        () => this.getProductTypeList()
      );
    }
  };

  getProductTypeList = () => {
    const tempProps = this.props;
    this.props.dispatch(senderProductType()).then((response) => {
      if (response && response.error) {
        tempProps.notification('error', this.props.productTypeList.error);
        return false;
      } else {
        if (Boolean(this.props.productTypeList)) {
          this.setState({
            ...this.state,
            productTypeList: this.props.productTypeList.data,
          });
        }
      }
    });
  };

  render() {
    const { classes, csc } = this.props;
    const {
      senderName,
      address_line1,
      address_line2,
      city,
      state,
      zipcode,
      countryCode,
      visaIdCode,
      visaMerchantCategoryCode,
      businessIndicator,
      merchantCategoryCode,
      cardAcceptorId,
      customerContact,
      paymentType,
      firstNameRiskScore,
      lastNameRiskScore,
      combinedRiskScore,
      senderEmail,
      senderPhone,
      payeeAcceptanceExpiryDays,
      noOfDaysBeforeEnrolmentExpire,
    } = this.state.errorData;

    const { senderList, productTypeList } = this.state;
    let selectedCountry = '';
    if (this.state.cardData && this.state.cardData.countryCode) {
      selectedCountry = csc['countryList']?.find(
        (item) => item.isoCode3 === this.state.cardData.countryCode
      )?.isoCode;
    }

    return (
      <>
        <Box className={classes.popupInner}>
          <Grid container>
            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                select
                color="secondary"
                name={'senderType'}
                id={'senderType'}
                label="Client Sender Type"
                type={'select'}
                value={this.state.cardData.senderType}
                onChange={this.onChange}
                onBlur={this.handleBlur}
                disabled={false}
                autoComplete="off"
                inputProps={{ maxLength: 50, minLength: 1 }}
                InputLabelProps={{
                  shrink: true,
                }}
              >
                {Boolean(senderList) &&
                  senderList.map((v, i) =>
                    v.sender_description.toLowerCase() === 'big-business' ? (
                      <MenuItem key={i} value={v.sender_description}>
                        {v.sender_description}
                      </MenuItem>
                    ) : (
                      <MenuItem disabled key={i} value={v.sender_description}>
                        {v.sender_description}
                      </MenuItem>
                    )
                  )}
              </TextField>
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                color="secondary"
                name={'senderName'}
                id={'senderName'}
                label="Client Sender Name"
                value={this.state.cardData.senderName}
                error={Boolean(senderName)}
                helperText={senderName}
                onChange={this.onChange}
                onBlur={this.handleBlur}
                autoComplete="off"
                inputProps={{ maxLength: 100, minLength: 1 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label="Client Sender Address Line 1"
                variant="outlined"
                error={Boolean(address_line1)}
                helperText={address_line1}
                name="address_line1"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                autoComplete="off"
                inputProps={{ minLength: 1, maxLength: 50 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.address_line1}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label="Client Sender Address Line 2"
                variant="outlined"
                error={Boolean(address_line2)}
                helperText={address_line2}
                name="address_line2"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                autoComplete="off"
                inputProps={{ maxLength: 50, minLength: 1 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.address_line2}
              />
            </Grid>

            <Grid item xs={6} className={classes.multitBox}>
              <CountryIso
                isoCode3={true}
                error={Boolean(countryCode)}
                helperText={countryCode}
                name={'countryCode'}
                label={'Client Sender Country Code'}
                onChange={this.onChange}
                onBlur={this.saveZelleData}
                value={this.state.cardData.countryCode}
                autoComplete="off"
                inputProps={{ minLength: 2, maxLength: 2 }}
              />

              <StateIso
                error={Boolean(state)}
                helperText={state}
                onChange={this.onChange}
                onBlur={this.saveZelleData}
                selectedState={this.state.cardData.state || ''}
                selectedCountry={selectedCountry}
                label={'Client Sender State'}
                name="state"
                value={this.state.cardData.state}
                autoComplete="off"
                inputProps={{ minLength: 1, maxLength: 25 }}
              />
            </Grid>

            <Grid item xs={6} className={classes.multitBox}>
              <CityIso
                name="city"
                label="Client Sender City"
                error={Boolean(city)}
                helperText={city}
                selectedState={this.state.cardData.state || ''}
                selectedCity={this.state.cardData.city || ''}
                selectedCountry={this.state.cardData.countryCode || ''}
                onChange={this.onChange}
                onBlur={this.saveZelleData}
                value={this.state.cardData.city}
                autoComplete="off"
                inputProps={{ minLength: 1, maxLength: 25 }}
              />

              <TextField
                id="outlined-basic"
                label="Client Sender Zip"
                variant="outlined"
                error={Boolean(zipcode)}
                helperText={zipcode}
                name="zipcode"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                autoComplete="off"
                inputProps={{ minLength: 5, maxLength: 10 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.zipcode}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label={'Client Sender Contact Phone'}
                variant="outlined"
                error={Boolean(senderPhone)}
                helperText={senderPhone}
                name="senderPhone"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                autoComplete="off"
                inputProps={{
                  minLength: 1,
                  maxLength: 13,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.senderPhone}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label={'Client Sender Contact Email'}
                variant="outlined"
                error={Boolean(senderEmail)}
                helperText={senderEmail}
                name="senderEmail"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                autoComplete="off"
                inputProps={{
                  minLength: 1,
                  maxLength: 255,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.senderEmail}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                select
                color="secondary"
                name={'productType'}
                id={'productType'}
                label="Client Product Type"
                type={'select'}
                value={this.state.cardData.productType}
                onChange={this.onChange}
                onBlur={this.handleBlur}
                disabled={false}
                autoComplete="off"
                inputProps={{ maxLength: 10 }}
                InputLabelProps={{
                  shrink: true,
                }}
              >
                {Boolean(productTypeList) &&
                  productTypeList.map((v, i) =>
                    v.product_description.toLowerCase() === 'b2c' ? (
                      <MenuItem key={i} value={v.product_description}>
                        {v.product_description}
                      </MenuItem>
                    ) : (
                      <MenuItem key={i} disabled value={v.product_description}>
                        {v.product_description}
                      </MenuItem>
                    )
                  )}
              </TextField>
            </Grid>

            <Grid item xs={6} className={classes.multitBox}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.cardData.debitNetwork}
                    onChange={(e) => this.onCheckboxChange(e, 'debitNetwork')}
                    name="debitNetwork"
                    color="primary"
                  />
                }
                label="Debit Network"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.cardData.secondaryDDA}
                    onChange={(e) => this.onCheckboxChange(e, 'secondaryDDA')}
                    name="DDA"
                    color="primary"
                    disabled={true}
                  />
                }
                label="Secondary DDA"
              />
            </Grid>

            {this.state.cardData.debitNetwork === 1 && (
              <>
                <Grid item xs={6} className={classes.inputBox}>
                  <TextField
                    id="outlined-basic"
                    label="Visa ID Code"
                    variant="outlined"
                    error={Boolean(visaIdCode)}
                    helperText={visaIdCode}
                    name="visaIdCode"
                    onChange={this.onChange}
                    onBlur={this.handleBlur}
                    autoComplete="off"
                    inputProps={{ minLength: 1, maxLength: 15 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.cardData.visaIdCode}
                  />
                </Grid>

                <Grid item xs={6} className={classes.inputBox}>
                  <TextField
                    id="outlined-basic"
                    label="Visa Merchant Category Code"
                    variant="outlined"
                    error={Boolean(visaMerchantCategoryCode)}
                    helperText={visaMerchantCategoryCode}
                    name="visaMerchantCategoryCode"
                    onChange={this.onChange}
                    onBlur={this.handleBlur}
                    autoComplete="off"
                    inputProps={{ minLength: 4, maxLength: 4 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.cardData.visaMerchantCategoryCode}
                  />
                </Grid>

                <Grid item xs={6} className={classes.inputBox}>
                  <TextField
                    id="outlined-basic"
                    label="Visa Business Application Indicator"
                    variant="outlined"
                    error={Boolean(businessIndicator)}
                    helperText={businessIndicator}
                    name="businessIndicator"
                    onChange={this.onChange}
                    onBlur={this.handleBlur}
                    autoComplete="off"
                    inputProps={{ minLength: 2, maxLength: 2 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.cardData.businessIndicator}
                  />
                </Grid>

                <Grid item xs={6} className={classes.inputBox}>
                  <TextField
                    id="outlined-basic"
                    label="MasterCard Merchant Category Code"
                    variant="outlined"
                    error={Boolean(merchantCategoryCode)}
                    helperText={merchantCategoryCode}
                    name="merchantCategoryCode"
                    onChange={this.onChange}
                    onBlur={this.handleBlur}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    autoComplete="off"
                    inputProps={{ maxLength: 4, minLength: 4 }}
                    value={this.state.cardData.merchantCategoryCode}
                  />
                </Grid>

                <Grid item xs={6} className={classes.inputBox}>
                  <TextField
                    id="outlined-basic"
                    label="MasterCard Acceptor ID"
                    variant="outlined"
                    error={Boolean(cardAcceptorId)}
                    helperText={cardAcceptorId}
                    name="cardAcceptorId"
                    onChange={this.onChange}
                    onBlur={this.handleBlur}
                    autoComplete="off"
                    inputProps={{ maxLength: 15, minLength: 1 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.cardData.cardAcceptorId}
                  />
                </Grid>

                <Grid item xs={6} className={classes.inputBox}>
                  <TextField
                    id="outlined-basic"
                    label="MasterCard Sender Customer Contact Info"
                    variant="outlined"
                    error={Boolean(customerContact)}
                    helperText={customerContact}
                    name="customerContact"
                    onChange={this.onChange}
                    onBlur={this.handleBlur}
                    autoComplete="off"
                    inputProps={{ maxLength: 13, minLength: 1 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.cardData.customerContact}
                  />
                </Grid>

                <Grid item xs={6} className={classes.inputBox}>
                  <TextField
                    id="outlined-basic"
                    label="MasterCard Payment Type"
                    variant="outlined"
                    error={Boolean(paymentType)}
                    helperText={paymentType}
                    name="paymentType"
                    onChange={this.onChange}
                    onBlur={this.handleBlur}
                    autoComplete="off"
                    inputProps={{ maxLength: 3, minLength: 3 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.cardData.paymentType}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label="First Name Risk Score"
                variant="outlined"
                error={Boolean(firstNameRiskScore)}
                helperText={firstNameRiskScore}
                name="firstNameRiskScore"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                autoComplete="off"
                inputProps={{ maxLength: 2, minLength: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.firstNameRiskScore}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label="Last Name Risk Score"
                variant="outlined"
                error={Boolean(lastNameRiskScore)}
                helperText={lastNameRiskScore}
                name="lastNameRiskScore"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                autoComplete="off"
                inputProps={{ maxLength: 2, minLength: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.lastNameRiskScore}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label="Combined Risk Score"
                variant="outlined"
                error={Boolean(combinedRiskScore)}
                helperText={combinedRiskScore}
                name="combinedRiskScore"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                inputProps={{ maxLength: 2, minLength: 2 }}
                autoComplete="off"
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.combinedRiskScore}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label="Payee Payment Acceptance Expiry Days"
                variant="outlined"
                error={Boolean(payeeAcceptanceExpiryDays)}
                helperText={payeeAcceptanceExpiryDays}
                name="payeeAcceptanceExpiryDays"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                inputProps={{ maxLength: 2, minLength: 1 }}
                autoComplete="off"
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.payeeAcceptanceExpiryDays}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip
                        arrow
                        title="The number of days a Payee may take to accept the payment in case of manual acceptance mode"
                        placement="right"
                      >
                        <InfoOutlinedIcon fontSize={'small'} />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6} className={classes.singleCheckBox}>
              <Grid container>
                <Grid item xs={10}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.cardData.isAuthorizeDebit}
                        onChange={(e) =>
                          this.onCheckboxChange(e, 'isAuthorizeDebit')
                        }
                        name="isAuthorizeDebit"
                        color="primary"
                      />
                    }
                    label="Authorize Debit"
                  />
                </Grid>
                <Grid item xs={2} className={classes.tooltipInfoIcon}>
                  <Tooltip
                    arrow
                    title="If selected, the debit network will be used for processing Zelle payments. If not, the DDA account will be used"
                    placement="right"
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6} className={classes.singleCheckBox}>
              <Grid container>
                <Grid item xs={10}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.cardData.allowRegisterViaZella}
                        name="allowRegisterViaZella"
                        color="primary"
                        onChange={(e) =>
                          this.onCheckboxChange(e, 'allowRegisterViaZella')
                        }
                      />
                    }
                    label="Zelle Unknown Recipient Support"
                  />
                </Grid>
                <Grid item xs={2} className={classes.tooltipInfoIcon}>
                  <Tooltip
                    arrow
                    title="If selected, the Payees who are not registered with Zelle, will be allowed to register via Zelle/their bank services and the payment will be kept on hold until their successful registration on Zelle's end"
                    placement="right"
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6} className={classes.singleCheckBox}>
              <Grid container>
                <Grid item xs={10}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.cardData.zelleTokenFromConsumer}
                        onChange={(e) =>
                          this.onCheckboxChange(e, 'zelleTokenFromConsumer')
                        }
                        name="zelleTokenFromConsumer"
                        color="primary"
                      />
                    }
                    label="Pick Zelle token from Payee Details"
                  />
                </Grid>
                <Grid item xs={2} className={classes.tooltipInfoIcon}>
                  <Tooltip
                    arrow
                    title="If selected, for CDM payments, Payee will be required to share Zelle token during enrolment. If not selected, token details will be picked from the campaign file/payment instruction."
                    placement="right"
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
            {this.state.cardData.allowRegisterViaZella === 1 && (
              <Grid item xs={6} className={classes.inputBox}>
                <TextField
                  id="outlined-basic"
                  label="Number of Days"
                  variant="outlined"
                  error={Boolean(noOfDaysBeforeEnrolmentExpire)}
                  helperText={noOfDaysBeforeEnrolmentExpire}
                  name="noOfDaysBeforeEnrolmentExpire"
                  onChange={this.onChange}
                  onBlur={this.handleBlur}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  autoComplete="off"
                  inputProps={{ maxLength: 2, minLength: 1 }}
                  value={this.state.cardData.noOfDaysBeforeEnrolmentExpire}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip
                          arrow
                          title="The number of days the payee can register in, after the enrollment has been initiated by Zelle.Note: Max value is 14"
                          placement="right"
                        >
                          <InfoOutlinedIcon fontSize={'small'} />
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}
          </Grid>
          <ZelleSettlementAccount
            onSubmit={this.onSubmit}
            notification={this.props.notification}
            handleValidation={this.saveZelleData}
            selectedSettlementAccountId={
              this.state.cardData.settlementAccountId
            }
            achAccountsList={
              this.props.showParentInfo && this.state.showParentList
                ? this.props.achB2CAccountList
                : this.props.achB2CClientAccountList
            }
            currencyList={this.props.currencyList}
            clientSettlementAccountId={this.state.clientSettlementAccountId}
          />
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
}))(withStyles(styles)(Zelle));
