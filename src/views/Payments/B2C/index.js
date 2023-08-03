import React from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import styles from '../styles';
import Checkbox from '~/components/Forms/Checkbox';
import {
  updatePreferredPaymentTypes,
  getPreferredClientPaymentTypes,
  getB2CPaymentTypes
} from '~/redux/actions/B2C/payments';
import { updateOnboardingStep } from '~/redux/actions/clients';
import ACHIcon from '~/assets/icons/ACH_main.svg';
import PushToCardIcon from '~/assets/icons/Push_to_Card_main.svg';
import PushToCard_selected from '~/assets/icons/PushToCard_selected.svg';
import ZelleIcon from '~/assets/icons/Zelle_main.svg';
import Zelle_selected from '~/assets/icons/Zelle_selected.svg';
import PaypalIcon from '~/assets/icons/PayPal_main.svg';
import ACH_selected from '~/assets/icons/ACH_selected.svg';
import CheckIcon from '~/assets/icons/CHK_main.svg';
import Check_selected from '~/assets/icons/check_icon_selected.svg';
import Paypal_selected from '~/assets/icons/Paypal_selected.svg';
import { getB2CClientDataActivated } from '~/redux/actions/B2C/clients';
import { NotificationContainer } from 'react-notifications';
import '../styles.css';
import { getCurrencyList } from '~/redux/actions/payments';
import AddAccounts from './addAccount';
import PromptImport from "~/components/Dialogs/PromptImport";

class B2CPayments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: sessionStorage.getItem('clientId'),
      paymentTypes: [],
      selectedPaymentTypes: [],
      paymentModeIcons: {
        ACH: ACHIcon,
        ACH_selected: ACH_selected,
        CXC: ZelleIcon,
        CXC_selected: Zelle_selected,
        PPL: PaypalIcon,
        PPL_selected: Paypal_selected,
        CHK: CheckIcon,
        CHK_selected: Check_selected,
        MSC: PushToCardIcon,
        MSC_selected: PushToCard_selected,
      },
      expandedAccordians: {
        CHK: false,
        ACH: false,
        CXC: false,
        PPL: false,
        MSC: false,
      },
      parentId: null,
      showParentInfo: false,
    };
  }

  handlePaymentModeChange = (fileFormatId, isChecked) => {
  
    const { selectedPaymentTypes } = this.state;
    if (isChecked) {
      this.setState({
        selectedPaymentTypes: [...selectedPaymentTypes, fileFormatId],
      });
    } else {
      const newState = selectedPaymentTypes.filter((id) => id !== fileFormatId);
      this.setState({
        selectedPaymentTypes: newState || [],
      });
    }
  };

  async componentDidMount() {
    this.props.updateOnboardingStep(4);
    const clientId = sessionStorage.getItem('clientId');
    await this.fetchClientInformation(clientId);
    this.fetchCurrencyList();
    this.fetchPaymentTypes();
  }

  fetchCurrencyList = () => {
    this.props.dispatch(getCurrencyList()).then((response) => {
      if (!response) {
        return false;
      }
      this.setState({
        currencyList: this.props.payment.currencyList.rows,
      });
    });
  };

  fetchClientInformation = async (clientId) => {
    const clientData = await getB2CClientDataActivated(clientId);
    let parentId = null;
    const { data = {} } = clientData;
    if (data.rows && data.rows[0]) {
      clientId = data.rows[0].clientId;
      parentId = data.rows[0].parentId;
    }
    this.setState({
      clientId: clientId,
      parentId,
    });
  };

  fetchPaymentTypes = () => {
    const { dispatch } = this.props;
    dispatch(getB2CPaymentTypes())
      .then((response) => {
        if (!response) {
          return false;
        }
        const paymentTypes = response.rows || [];
        const clientId = sessionStorage.getItem('clientId');
        this.setState(
          {
            isLoading: false,
            paymentTypes,
          },
          () => this.fetchPreferredPaymentTypes(clientId)
        );
      })
      .catch((error) => {});
  };

  fetchPreferredPaymentTypes = (clientId) => {
    this.props
      .dispatch(getPreferredClientPaymentTypes(clientId))
      .then((response) => {
        if (!response) {
          return false;
        }
        let selectedPaymentMethod = response.rows ? response.rows : [];
        
        this.setState({
          selectedPaymentTypes: selectedPaymentMethod,
        });
        const { paymentTypes } = this.state;
        this.setState({
          ...this.state,
          paymentTypes: paymentTypes.map((paymentType) => ({
            ...paymentType,
            selected: Boolean(
              selectedPaymentMethod.includes(paymentType.paymentTypeId)
            ),
          })),
        });
     
      });
  };

  handleNext = () => {
    const { selectedPaymentTypes, clientId } = this.state;
    if (selectedPaymentTypes.length > 0) {
      this.props
        .dispatch(updatePreferredPaymentTypes(clientId, selectedPaymentTypes))
        .then((response) => {
          if (!response) {
            return false;
          }
          this.props.dispatch(updateOnboardingStep());
          this.props.history.push({
            pathname: '/clientOnboard/b2c/fileSettings',
          });
        });
    }
  };

  importParentInformation = () => {
    const importParentId = sessionStorage.getItem('parentId');
    this.setState({
      isLoading: true,
    });
    this.fetchPreferredPaymentTypes(importParentId);
    this.setState({
      isLoading: false,
      paymentTypes: this.props.b2cPaymentTypes?.data?.rows??[],
      showParentInfo: true,
    });
  };

  isPaymentTypeSelected = (paymentTypeCode) => {
    const { paymentTypes, selectedPaymentTypes } = this.state;
    if (Array.isArray(paymentTypes) && paymentTypes.length > 0) {
      const paymentTypeDetail = paymentTypes.filter(
        ({ paymentCode }) => paymentCode === paymentTypeCode
      );
      const currentPaymentTypeID =
        paymentTypeDetail.length && paymentTypeDetail[0].fileFormatId;
      return selectedPaymentTypes.includes(currentPaymentTypeID);
    }
    return false;
  };

  toggleAccordian = (type, isExpand = false) => {    
    this.setState({
      expandedAccordians: {
        ...this.state.expandedAccordians,
        [type]: isExpand,
      },
    });
  };

  render() {
    const { selectedPaymentTypes, paymentModeIcons, parentId, currencyList } = this.state;
    const { classes, b2cPaymentTypes } = this.props;
    return (
      <>
      
        {Boolean(parentId) && (
          <Grid
            container
            direction="row"
            spacing={2}
            justify="center"
            alignItems="center"
          >
            <Box m={2} width="100%">
              <PromptImport
                promptText="We noticed that client's parent company is registered with us. Would you like to import the payment information?"
                importCb={this.importParentInformation}
              />
            </Box>
          </Grid>
        )}
        <Box mx={6} my={4}>
          <Paper display="flex" className={classes.root} elevation={3}>
            <Box p={3}>
              <Grid
                container
                direction="row"
                justify="flex-start"
                className={classes.gridContainers}
              >
                <Grid container item direction="row" spacing={2}>
                  <Grid item xs={12}>
                    <Box py={2}>
                      <Typography className={classes.genralTitleBold}>
                        Please select modes of payment*:
                      </Typography>
                    </Box>
                  </Grid>
                  {!b2cPaymentTypes ? (
                    <Grid item container justify="center" alignItems="center">
                      <CircularProgress color="primary" />
                    </Grid>
                  ) : (
                    !!b2cPaymentTypes?.data &&
                    b2cPaymentTypes?.data?.rows?.map(
                      ({ b2cDescription, paymentCode, fileFormatId }, index) => {
                        const checked = Boolean(
                          selectedPaymentTypes.includes(fileFormatId)
                        );
                        return (
                          <Grid
                            className="checkboxContainer"
                            key={`payment-mode-${index}`}
                            item
                            xs
                            sm
                            style={{ marginBottom: '16px' }}
                          >
                            <Box className={classes.paymentcheckedBox}>
                            <Checkbox
                              color="primary"
                              checked={checked}
                              label={b2cDescription}
                              index={index}
                              icon={
                                <Box display="flex" justifyContent="center">
                                  {' '}
                                  <img
                                    src={
                                      paymentModeIcons[
                                        `${paymentCode}${
                                          checked ? '_selected' : ''
                                        }`
                                      ]
                                    }
                                    alt={paymentCode}
                                    width="24"
                                    height="24"
                                  />
                                </Box>
                              }
                              onChange={(e, index, isChecked) =>
                                this.handlePaymentModeChange(
                                  fileFormatId,
                                  isChecked
                                )
                              }
                            />
                            </Box>
                          </Grid>
                        );
                      }
                    )
                  )}
                </Grid>
                {!!b2cPaymentTypes?.data && b2cPaymentTypes.data.count ? (
                  <AddAccounts
                    toggleAccordian={this.toggleAccordian}
                    selectedPaymentTypes={this.state.selectedPaymentTypes}
                    expandedAccordians={this.state.expandedAccordians}
                    b2cPaymentTypesList={b2cPaymentTypes?.data?.rows ?? []}
                    handleNext={this.handleNext}
                    onPaymentMethodSave={this.toggleAccordian}
                    showParentInfo={this.state.showParentInfo}
                    parentId={parentId}
                    currencyList={currencyList}
                  />
                ) : null}
              </Grid>
            </Box>
          </Paper>
        </Box>
        <NotificationContainer />
      </>
    );
  }
}

export default connect((state) => ({ ...state.user, ...state.payment,...state.b2cPayments }))(
  withStyles(styles)(B2CPayments)
);
