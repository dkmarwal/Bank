import React, { Component } from 'react';
import styles from '~/views/Payments/B2C/styles';
import { withStyles } from '@material-ui/styles';
import { Grid, Box, MenuItem } from '@material-ui/core';
import TextField from '~/components/Forms/TextField';
import { connect } from 'react-redux';
import {
  addPushToCard,
  getPushToCardData,
  updatePushToCardData,
  fetchB2CachProfilesInformation,
  fetchB2CBankAccountsList,
  fetchB2CChildBankAccountsList,
} from '~/redux/actions/B2C/payments';
import { CountryIso, CityIso, StateIso } from '~/components/CSC';
import MaskInput from '~/components/MaskInput';
import trim from 'deep-trim-node';
import PushToCardSettlementAccount from './SettlementAccount/pushToCard';

class B2CPushToCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardData: {
        id: null,
        partnerId: null,
        masterMerchantCatCode: null,
        visaMerchantCatCode: null,
        masterCardAcceptorId: null,
        visaAcceptorId: null,
        senderPhone: null,
        paymentType: null,
        senderAccount: null,
        senderFirstName: null,
        senderLastName: null,
        senderAddressLine1: null,
        senderAddressLine2: null,
        senderCity: null,
        senderState: null,
        senderZip: null,
        senderCountryCode: null,
        title: null,
        clientPrefix: null,
        senderContactEmail: null,
      },
      errorData: {
        partnerId: '',
        masterMerchantCatCode: '',
        visaMerchantCatCode: '',
        masterCardAcceptorId: '',
        visaAcceptorId: '',
        senderPhone: '',
        paymentType: '',
        senderAccount: '',
        senderFirstName: '',
        senderLastName: '',
        senderAddressLine1: '',
        senderAddressLine2: '',
        senderCity: '',
        senderState: '',
        senderZip: '',
        senderCountryCode: '',
        clientPrefix: '',
        senderContactEmail: '',
      },
      clientSettlementAccountId: null,
      showParentList: false
    };
  }

  async componentDidMount() {
    const clientID = sessionStorage.getItem('clientId') || null;
    let Id = clientID;
    if (this.props.showParentInfo) {
      Id = this.props.parentId;
      this.props.dispatch(fetchB2CBankAccountsList(Id, 'ACH'));
      this.setState({
        showParentList: true
      })
    }
    if (this.props.getB2CPushCardData?.data?.length) {
      this.setState({
        cardData: {
          ...this.state.cardData,
          id: this.props.getB2CPushCardData.data[0].id,
        },
        clientSettlementAccountId:
          this.props.getB2CPushCardData.data[0].settlementAccountId,
      });
      this.props.dispatch(fetchB2CChildBankAccountsList(clientID, 'ACH'));
    }
    await this.getCardData();
    this.props.dispatch(fetchB2CachProfilesInformation());
  }

  popupBtnClick = () => {
    const { paymentType } = this.props;
    this.props.btnClk(paymentType, true);
  };

  onChange = (event) => {
    const numeric = /^-?(0|[1-9]\d*)$/;
    const { name } = event.target;

    if (name === 'masterMerchantCatCode' || name === 'visaMerchantCatCode') {
      if (!numeric.test(event.currentTarget.value)) {
        event.currentTarget.value = null;
      }
    }
    let { value } = event.target;
    if (value === '') {
      value = null;
    }

    if (name === 'senderCountryCode') {
      this.setState({
        cardData: {
          ...this.state.cardData,
          [name]: value,
          senderZip: '',
        },
      });
      this.savePushToCardData();
    }
    if (name === 'senderPhone' && value) {
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
      this.setState({
        cardData: {
          ...this.state.cardData,
          [name]: resultStr,
        },
      });
    } else {
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

  savePushToCardData = () => {
    let valid = true;
    let validation = {};
    const {
      masterCardAcceptorId,
      masterMerchantCatCode,
      senderZip,
      visaAcceptorId,
      visaMerchantCatCode,
      senderContactEmail,
    } = this.state.cardData;
    const reg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;

    if (masterMerchantCatCode && masterMerchantCatCode.length < 4) {
      validation.masterMerchantCatCode =
        'Mastercard Merchant Category Code should be of 4 digits';
      valid = false;
    }
    if (visaMerchantCatCode && visaMerchantCatCode.length < 4) {
      validation.visaMerchantCatCode =
        'VISA Merchant Category Code should be of 4 digits';
      valid = false;
    }
    if (masterCardAcceptorId && masterCardAcceptorId.length < 10) {
      validation.masterCardAcceptorId =
        'MasterCard Acceptor ID should be of 10 to 15 characters';
      valid = false;
    }
    if (visaAcceptorId && visaAcceptorId.length < 10) {
      validation.visaAcceptorId =
        'VISA Acceptor ID should be of 10 to 15 characters';
      valid = false;
    }
    if (senderZip && senderZip.length < 5) {
      validation.senderZip = 'Sender Zip should be of 5 to 10 digits';
      valid = false;
    }
    if (senderContactEmail && !reg.test(senderContactEmail)) {
      validation.senderContactEmail = 'Please enter valid Email Address';
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
    const valid = this.savePushToCardData();
    if (valid) {
      this.storeDataInDB(settlementAccountId);
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
    if (!Boolean(cardStateData.senderAccount)) {
      cardStateData.senderAccount = null;
    }

    if (cardStateData.id) {
      this.props
        .dispatch(
          updatePushToCardData(cardStateData, clientID, settlementAccountId)
        )
        .then((response) => {
          if (response && !response.error) {
            this.setState({
              cardData: {
                ...cardStateData,
                settlementAccountId: settlementAccountId,
              },
              clientSettlementAccountId: settlementAccountId
            });
            tempProps.notification(
              'success',
              'Instant Pay (P2C) data updated successfully'
            );
            this.props.dispatch(fetchB2CChildBankAccountsList(clientID, 'ACH'));
            tempProps.onSaveBtnClick(tempProps.paymentType, false);
            this.setState({
              showParentList: false
            })
          } else {
            const { error } = this.props.updatedB2CPushCardData;
            tempProps.notification('error', error);
            return false;
          }
        });
    } else {
      this.props
        .dispatch(addPushToCard(cardStateData, clientID, settlementAccountId))
        .then((response) => {
          if (response && response.data && response.data.id) {
            this.setState({
              cardData: {
                ...cardStateData,
                id: response.data.id,
                settlementAccountId: settlementAccountId,
              },
              clientSettlementAccountId: settlementAccountId
            });
            this.props.dispatch(fetchB2CChildBankAccountsList(clientID, 'ACH'));
            tempProps.notification(
              'success',
              'Instant Pay (P2C) data saved successfully'
            );
            tempProps.onSaveBtnClick(tempProps.paymentType, false);
            this.setState({
              showParentList: false
            })
          } else {
            const { error } = this.props.b2cPushToCard;
            tempProps.notification('error', error);
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
    this.props.dispatch(getPushToCardData(Id)).then((response) => {
      if (response && response.error) {
        let { error } = this.props.getB2CPushCardData;
        tempProps.notification('error', error);
        return false;
      } else {
        this.passAPIDataOnTextField();
      }
    });
  };

  passAPIDataOnTextField = () => {
    const { showParentInfo } = this.props;
    if (
      Boolean(this.props.getB2CPushCardData) &&
      this.props.getB2CPushCardData.data?.length > 0
    ) {
      let finalDetails = this.props.getB2CPushCardData.data[0];
      if (showParentInfo) {
        const { id, ...restDetail } = this.props.getB2CPushCardData.data[0];
        finalDetails = restDetail;
      }
      this.setState({
        cardData: {
          ...finalDetails,
          id: this.state.cardData.id,
        },
      });
    }
  };

  render() {
    const { classes, csc } = this.props;
    const {
      clientPrefix,
      masterCardAcceptorId,
      masterMerchantCatCode,
      partnerId,
      senderAccount,
      senderAddressLine1,
      senderAddressLine2,
      senderCity,
      senderPhone,
      senderCountryCode,
      senderFirstName,
      senderLastName,
      senderState,
      senderZip,
      visaAcceptorId,
      visaMerchantCatCode,
      senderContactEmail,
    } = this.state.errorData;

    let selectedCountry = '';
    if (this.state.cardData && this.state.cardData.senderCountryCode) {
      selectedCountry = csc['countryList']?.find(
        (item) => item.isoCode3 === this.state.cardData.senderCountryCode
      )?.isoCode;
    }
    return (
      <>
        <Box className={classes.popupInner}>
          <Grid container>
            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label="Partner ID"
                variant="outlined"
                error={Boolean(partnerId)}
                helperText={partnerId}
                name="partnerId"
                onChange={this.onChange}
                inputProps={{ maxLength: 32 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.partnerId}
                onBlur={this.handleBlur}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <MaskInput
                inputProps={{ maxLength: 35 }}
                label="Sender Account"
                error={Boolean(senderAccount)}
                helperText={senderAccount}
                fullWidth={true}
                autoComplete="off"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={this.state.cardData.senderAccount}
                name="senderAccount"
                getValue={(val) => {
                  this.setState({
                    cardData: {
                      ...this.state.cardData,
                      senderAccount: val,
                    },
                  });
                }}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                select
                color="secondary"
                name={'paymentType'}
                id={'paymentType'}
                label={'Payment Type'}
                type={'select'}
                value={this.state.cardData.paymentType}
                onChange={this.onChange}
                onBlur={this.handleBlur}
                disabled={false}
                inputProps={{ maxLength: 3 }}
                InputLabelProps={{
                  shrink: true,
                }}
              >
                <MenuItem key={'0'} value={'BDB'}>
                  BDB – Business Disbursements
                </MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={6} className={classes.nameBox}>
              <TextField
                select
                color="secondary"
                name={'title'}
                id={'title'}
                label={'Prefix'}
                type={'select'}
                value={this.state.cardData.title}
                onChange={this.onChange}
                onBlur={this.handleBlur}
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
                id="outlined-basic"
                label="Sender First Name"
                variant="outlined"
                error={Boolean(senderFirstName)}
                helperText={senderFirstName}
                name="senderFirstName"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                inputProps={{ minLength: 1, maxLength: 40 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.senderFirstName}
              />

              <TextField
                id="outlined-basic"
                label="Sender Last Name"
                variant="outlined"
                error={Boolean(senderLastName)}
                helperText={senderLastName}
                name="senderLastName"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                inputProps={{ minLength: 1, maxLength: 40 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.senderLastName}
              />
            </Grid>

            <Grid item xs={6} className={classes.multitBox}>
              <TextField
                id="outlined-basic"
                label="Mastercard Merchant Category Code"
                variant="outlined"
                error={Boolean(masterMerchantCatCode)}
                helperText={masterMerchantCatCode}
                name="masterMerchantCatCode"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                inputProps={{ maxLength: 4 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.masterMerchantCatCode}
              />
              <TextField
                id="outlined-basic"
                label="VISA Merchant Category Code"
                variant="outlined"
                error={Boolean(visaMerchantCatCode)}
                helperText={visaMerchantCatCode}
                name="visaMerchantCatCode"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                inputProps={{ maxLength: 4 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.visaMerchantCatCode}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label="Sender Address Line 1"
                variant="outlined"
                error={Boolean(senderAddressLine1)}
                helperText={senderAddressLine1}
                name="senderAddressLine1"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                inputProps={{ minLength: 1, maxLength: 50 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.senderAddressLine1}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label="MasterCard Acceptor ID"
                variant="outlined"
                error={Boolean(masterCardAcceptorId)}
                helperText={masterCardAcceptorId}
                name="masterCardAcceptorId"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                inputProps={{ minLength: 10, maxLength: 15 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.masterCardAcceptorId}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label="Sender Address Line 2"
                variant="outlined"
                error={Boolean(senderAddressLine2)}
                helperText={senderAddressLine2}
                name="senderAddressLine2"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                inputProps={{ minLength: 1, maxLength: 50 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.senderAddressLine2}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label="VISA Acceptor ID"
                variant="outlined"
                error={Boolean(visaAcceptorId)}
                helperText={visaAcceptorId}
                name="visaAcceptorId"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                inputProps={{ minLength: 10, maxLength: 15 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.visaAcceptorId}
              />
            </Grid>

            <Grid item xs={6} className={classes.multitBox}>
              <CountryIso
                isoCode3={true}
                error={Boolean(senderCountryCode)}
                helperText={senderCountryCode}
                name={'senderCountryCode'}
                label={'Sender Country Code'}
                onChange={this.onChange}
                onBlur={this.handleBlur}
                value={this.state.cardData.senderCountryCode}
              />

              <StateIso
                error={Boolean(senderState)}
                helperText={senderState}
                onChange={this.onChange}
                onBlur={this.handleBlur}
                selectedState={this.state.cardData.senderState || ''}
                selectedCountry={selectedCountry}
                label={'Sender State'}
                name="senderState"
                value={this.state.cardData.senderState}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label={'Sender Phone Number'}
                variant="outlined"
                error={Boolean(senderPhone)}
                helperText={senderPhone}
                name="senderPhone"
                onBlur={this.handleBlur}
                inputProps={{ maxLength: 13 }}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={this.onChange}
                value={this.state.cardData.senderPhone}
              />
            </Grid>

            <Grid item xs={6} className={classes.multitBox}>
              <CityIso
                name="senderCity"
                label="Sender City"
                error={Boolean(senderCity)}
                helperText={senderCity}
                selectedState={this.state.cardData.senderState || ''}
                selectedCity={this.state.cardData.senderCity || ''}
                selectedCountry={this.state.cardData.senderCountryCode || ''}
                onChange={this.onChange}
                onBlur={this.handleBlur}
                value={this.state.cardData.senderCity}
              />

              <TextField
                id="outlined-basic"
                label="Sender Zip Code"
                variant="outlined"
                error={Boolean(senderZip)}
                helperText={senderZip}
                name="senderZip"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                inputProps={{ minLength: 5, maxLength: 10 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.senderZip}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label="Sender Contact Email"
                variant="outlined"
                error={Boolean(senderContactEmail)}
                helperText={senderContactEmail}
                name="senderContactEmail"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{ maxLength: 13 }}
                value={this.state.cardData.senderContactEmail}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label="Client Prefix"
                variant="outlined"
                error={Boolean(clientPrefix)}
                helperText={clientPrefix}
                name="clientPrefix"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                inputProps={{ maxLength: 5 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.clientPrefix}
              />
            </Grid>
          </Grid>
          <PushToCardSettlementAccount
            onSubmit={this.onSubmit}
            notification={this.props.notification}
            handleValidation={this.savePushToCardData}
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
}))(withStyles(styles)(B2CPushToCard));
