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
import Checkbox from '~/components/Forms/Checkbox';
import Checkbox2 from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import {
  updatePreferredUSbankPaymentTypes,
  getPreferredClientPaymentTypes,
  getB2CPaymentTypes,
} from '~/redux/actions/B2C/payments';
import { updateOnboardingStep } from '~/redux/actions/clients';
import ACHIcon from '~/assets/icons/USbank/ACH_main.svg';
import DepositToDebitIcon from '~/assets/icons/USbank/Deposit_to_Card_main.svg';
import DepositToDebit_selected from '~/assets/icons/USbank/DepositToCard_selected.svg';
import ZelleIcon from '~/assets/icons/USbank/Zelle_main.svg';
import Zelle_selected from '~/assets/icons/USbank/Zelle_selected.svg';
import ACH_selected from '~/assets/icons/USbank/ACH_selected.svg';
import CheckIcon from '~/assets/icons/USbank/CHK_main.svg';
import Check_selected from '~/assets/icons/USbank/check_icon_selected.svg';
import RTPIcon from '~/assets/icons/USbank/RTP.svg';
import RTP_selected from '~/assets/icons/USbank/RTPselected.svg';
import prepaidIcon from '~/assets/icons/USbank/Prepaidcard.svg';
import Prepaid_selected from '~/assets/icons/USbank/Prepaidcardselected.svg';
import { getB2CClientDataActivated } from '~/redux/actions/B2C/clients';
import { NotificationContainer } from 'react-notifications';
import '../styles.css';
import USbankAddAccounts from './addAccount';
import PromptImport from '~/components/Dialogs/PromptImport';
import Notification from '~/components/Notification';
import { AlertDialog } from '~/components/Dialogs';
import { paymentMethods, paymentFileFormatId } from '~/config/paymentMethods';
import { getCurrencyList } from '~/redux/actions/payments';
const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    textAlign: 'left',
    '& .MuiTextField-root': {
      width: '100%',
    },
    padding: '32px 30px',
  },
  paymentListBox: {
    boxShadow:
      '0px 6px 10px rgba(0, 0, 0, 0.14), 0px 1px 18px rgba(0, 0, 0, 0.12), 0px 3px 5px -1px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
  },
  genralTitleBold: {
    fontSize: 16,
    color: '#0B1941',
  },
  titleContainer: {},
  formControlCheckbox: {
    display: 'flex',
    '& .MuiFormControlLabel-label': {
      display: 'flex',
    },
    '&:hover': {
      background: '#F4F4F4',
      borderRadius: 6,
      padding: '8px',
    },
  },
  checkboxLabel: {
    display: 'flex',
  },
  paymentMethod: {
    padding: '18px 0px',
    display: 'inline-block',
    marginLeft: '-5px',
    '& .MuiFormControlLabel-root': {
      marginLeft: '-1px',
      padding: '6px 5px',
    },
  },
  payMethodCheckbox: {
    padding: 0,
    paddingRight: 24,
  },
  addButton: {
    marginLeft: 50,
    textTransform: 'uppercase',
    border: '2px solid #0B1941',
    borderRadius: '6px',
    color: '#0B1941',
    fontSize: 16,
    letterSpacing: '0.5px',
    '&.Mui-disabled': {
      border: '2px solid #CCCCCC',
      color: '#CCCCCC',
    },
    '& .MuiButton-label': {
      lineHeight: '18px',
    },
    display: 'flex',
  },
  optionalText: {
    marginLeft: '50px',
    paddingTop: '8px',
    fontSize: '16px',
    color: '#9E9E9E',
    lineHeight: '18px',
    letterSpacing: '0.5px',
  },
  nextButton: {
    lineHeight: '18px',
    background: '#0B1941',
    color: '#fff',
    letterSpacing: '0.5px',
    minWidth: '140px',
    borderRadius: '6px',
    '&.Mui-disabled': {
      background: '#CCCCCC',
      color: '#ffffff',
    },
    '&:hover': {
      background: '#0B1941',
    },
  },
  editAccount: {
    marginLeft: 50,
    border: '1px solid #9E9E9E',
    borderRadius: '6px',
    color: '#4C4C4C',
    fontSize: 16,
    letterSpacing: '0.5px',
    lineHeight: '18px',
    display: 'flex',
    marginBottom: '24px',
    height: 62,
    width: 507,
    justifyContent: 'space-between',
    padding: '5px 19px 5px 29px',
  },
  overlapDiv: {
    position: 'fixed',
    left: 0,
    top: 0,
    width: '100%',
    height: '100vh',
    zIndex: '5',
    background: '#000000',
    opacity: '0.45',
  },
  paymentPopup: {
    zIndex: '6',
    position: 'fixed',
    background: '#FFFFFF',
    borderRadius: '8px',
    top: '53%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
  },
  popupHeading: {
    float: 'left',
    width: '100%',
    background: '#CCE4FF',
    borderRadius: '8px 8px 0px 0px',
    padding: '10px 25px',
    margin: '0',
    boxSizing: 'border-box',
    '& h2': {
      color: '#0B1941',
      fontSize: '16px',
      float: 'left',
      padding: '4px 0 0',
    },
  },

  popupClose: {
    float: 'right',
    cursor: 'pointer',
    fontSize: '20px',
    margin: '2px 0 0',
  },

  popupInner: {
    float: 'left',
    width: '100%',
    padding: '0',
    boxSizing: 'border-box',
  },

  inputBox: {
    float: 'left',
    padding: '10px 10px 0',
    minHeight: '80px',
    '& .MuiTextField-root': {
      width: '100%',
    },
    '& legend': {
      fontSize: '0.85em',
    },
    '& .MuiFormControl-root': {
      width: '100%',
    },
    '& input': {
      color: '#2B2D30',
      fontSize: '16px',
      boxSizing: 'border-box',
      borderRadius: '4px',
      height: '56px',
    },
    '& .MuiFormLabel-root': {
      fontSize: '16px',
    },
  },

  multitBox: {
    float: 'left',
    padding: '10px 10px 0',
    minHeight: '80px',
    '& legend': {
      fontSize: '0.85em',
    },
    '& input': {
      color: '#2B2D30',
      fontSize: '16px',
      boxSizing: 'border-box',
      borderRadius: '4px',
      height: '56px',
    },
    '& .MuiTextField-root': {
      width: '50%!important',
      padding: '0 5px',
      boxSizing: 'border-box',
      '&:nth-child(2n+0)': {
        float: 'right',
        paddingRight: '0',
      },
      '&:first-child': {
        float: 'left',
        paddingLeft: '0',
      },
    },
    '& .MuiFormLabel-root': {
      fontSize: '16px',
    },
  },

  nameBox: {
    float: 'left',
    padding: '10px 10px 0',
    minHeight: '80px',
    '& .MuiTextField-root': {
      width: '100%',
    },
    '& legend': {
      fontSize: '0.85em',
    },
    '& input': {
      color: '#2B2D30',
      fontSize: '16px',
      boxSizing: 'border-box',
      borderRadius: '4px',
      height: '56px',
    },
    '& >': {
      width: '40%!important',
      padding: '0 5px',
      boxSizing: 'border-box',
      float: 'left',
      '&:nth-child(3n+0)': {
        paddingRight: '0',
        width: '40%!important',
        padding: '0 5px',
        boxSizing: 'border-box',
        float: 'left',
      },
      '&:nth-child(3n+2)': {
        float: 'left',
        paddingRight: '0',
        width: '40%!important',
        padding: '0 5px',
        boxSizing: 'border-box',
      },
      '&:first-child': {
        float: 'left',
        paddingLeft: '0',
        width: '20%!important',
      },
    },
    '& .MuiFormLabel-root': {
      fontSize: '16px',
    },
  },

  paypalNameBox: {
    float: 'left',
    padding: '10px 10px 0',
    minHeight: '80px',
    '& .MuiTextField-root': {
      width: '100%',
    },
    '& legend': {
      fontSize: '0.85em',
    },
    '& input': {
      color: '#2B2D30',
      fontSize: '16px',
      boxSizing: 'border-box',
      borderRadius: '4px',
      height: '56px',
    },
    '& >': {
      width: '40%!important',
      padding: '0 5px',
      boxSizing: 'border-box',
      float: 'left',
      '&:nth-child(3n+0)': {
        paddingRight: '0',
        width: '80%!important',
        padding: '0 5px',
        boxSizing: 'border-box',
        float: 'left',
      },
      '&:nth-child(3n+2)': {
        float: 'left',
        paddingRight: '0',
        width: '80%!important',
        padding: '0 5px',
        boxSizing: 'border-box',
      },
      '&:first-child': {
        float: 'left',
        paddingLeft: '0',
        width: '20%!important',
      },
    },
    '& .MuiFormLabel-root': {
      fontSize: '16px',
    },
  },

  btnHolder: {
    float: 'left',
    textAlign: 'center',
    margin: '10px 0 0',
    '& button': {
      display: 'inline-block',
      margin: '0 10px',
      minWidth: '93px',
      textTransform: 'uppercase',
      fontSize: '14px',
      '&.MuiButton-outlinedPrimary': {
        border: '1px solid #008CE6',
        color: '#008CE6',
      },
      '&.MuiButton-containedPrimary': {
        background: '#008CE6',
      },
    },
  },

  phoneBox: {
    float: 'left',
    padding: '10px 10px 0',
    minHeight: '80px',
    '& legend': {
      fontSize: '0.85em',
    },
    '& input': {
      color: '#2B2D30',
      fontSize: '16px',
      boxSizing: 'border-box',
      borderRadius: '4px',
      height: '56px',
    },
    '& .MuiTextField-root': {
      padding: '0 5px',
      boxSizing: 'border-box',
      width: '100%',
      '&.extinput': {
        float: 'right',
        paddingRight: '0',
        width: '25%!important',
      },
      '&.phoneinput': {
        float: 'left',
        paddingLeft: '0',
        width: '45%!important',
      },
      '&.countryPhoneCode': {
        float: 'left',
        paddingLeft: '0',
        width: '30%!important',
      },
    },
    '& .MuiFormLabel-root': {
      fontSize: '16px',
    },
  },
  singleCheckBox: {
    padding: '10px',
    alignItems: 'center',
    display: 'flex',
  },
  tooltipInfoIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '12px',
  },
  noteTxt: {
    fontSize: '14px',

    fontWeight: 'normal',

    lineHeight: '20px',
  },
  formControl: {
    margin: theme.spacing(3),
  },
  formLabel: {
    color: '#0b0c0c',
    padding: '2px',
    paddingTop: '5px',
    fontSize: '12px',
  },
});
class USbankPayments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: sessionStorage.getItem('clientId'),
      paymentTypes: [],
      selectedPaymentTypes: [],
      selectedPayees: [],
      paymentModeIcons: {
        ACH: ACHIcon,
        ACH_selected: ACH_selected,
        CXC: ZelleIcon,
        CXC_selected: Zelle_selected,
        ZEL: ZelleIcon,
        ZEL_selected: Zelle_selected,
        RTP: RTPIcon,
        RTP_selected: RTP_selected,
        CHK: CheckIcon,
        CHK_selected: Check_selected,
        DDC: DepositToDebitIcon,
        DDC_selected: DepositToDebit_selected,
        PPD: prepaidIcon,
        PPD_selected: Prepaid_selected,
      },
      expandedAccordians: {
        CHK: false,
        ACH: false,
        CXC: false,
        RTP: false,
        DDC: false,
        PPD: false,
      },
      parentId: null,
      showParentInfo: false,
      rtpDialogFlag: false,
      alertMsg: null,
      alertType: null,
      errFound: '',
      ACHB2B: false,
      ACHB2C: false,
      CHKB2B: false,
      CHKB2C: false,
      RTPB2B: false,
      RTPB2C: false,
    };
  }
  notification = (type, msg) => {
    if (msg) {
      this.setState({
        alertMsg: msg,
        alertType: type,
        errFound: type,
      });
    }
  };

  renderSnackbar = (type, msg) => {
    return (
      <Notification
        variant={type}
        message={msg}
        handleClose={this.hideAlertMessage}
      />
    );
  };

  hideAlertMessage = () => {
    this.setState({
      alertMsg: null,
      alertType: null,
    });
  };

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
    if (!isChecked) {
      switch (fileFormatId) {
        case paymentFileFormatId.USBankACH:
          this.setState({
            ACHB2B: false,
            ACHB2C: false,
          });
          break;
        case paymentFileFormatId.USBankCHK:
          this.setState({
            CHKB2B: false,
            CHKB2C: false,
          });
          break;
        case paymentFileFormatId.USBankRTP:
          this.setState({
            RTPB2B: false,
            RTPB2C: false,
          });
          break;

        default:
          break;
      }
    }
  };
  checkedB2B = (paymentCode) => {
    switch (paymentCode) {
      case paymentMethods.USBankACH:
        return this.state.ACHB2B ? true : false;
      case paymentMethods.USBankCHK:
        return this.state.CHKB2B ? true : false;
      case paymentMethods.USBankRTP:
        return this.state.RTPB2B ? true : false;
      default:
        return false;
    }
  };
  checkedB2C = (paymentCode) => {
    switch (paymentCode) {
      case paymentMethods.USBankACH:
        return this.state.ACHB2C ? true : false
      case paymentMethods.USBankCHK:
        return this.state.CHKB2C ? true : false
      case paymentMethods.USBankRTP:
        return this.state.RTPB2C ? true : false

      default:
        return false
    }
  };
  payloadger = () => {
    let obj = {};
    const {
      selectedPayees,
      selectedPaymentTypes,
      ACHB2B,
      ACHB2C,
      CHKB2B,
      CHKB2C,
      RTPB2B,
      RTPB2C,
    } = this.state;
    selectedPaymentTypes.map((id) => {
      switch (id) {
        case paymentFileFormatId.USBankACH:
          obj = {
            fileFormatId: id,
            isB2c: ACHB2C ? 1 : 0,
            isB2b: ACHB2B ? 1 : 0,
          };
          selectedPayees.push(obj);
          break;
        case paymentFileFormatId.USBankCHK:
          obj = {
            fileFormatId: id,
            isB2c: CHKB2C ? 1 : 0,
            isB2b: CHKB2B ? 1 : 0,
          };
          selectedPayees.push(obj);
          break;
        case paymentFileFormatId.USBankRTP:
          obj = {
            fileFormatId: id,
            isB2c: RTPB2C ? 1 : 0,
            isB2b: RTPB2B ? 1 : 0,
          };
          selectedPayees.push(obj);
          break;
        case paymentFileFormatId.USBankDepositToDebitcard:
        case paymentFileFormatId.USBankPrepaidCard:
        case paymentFileFormatId.USBankZelle:
          obj = { fileFormatId: id };
          selectedPayees.push(obj);
          break;
        default:
          break;
      }
    });
  };
  slectedB2CCheck = () => {
    let flag = false;
    let flagACH = false;
    let flagCHK = false;
    let flagRTP = false;
    const { selectedPaymentTypes } = this.state;
    if (selectedPaymentTypes.includes(paymentFileFormatId.USBankACH)) {
      flagACH = this.state.ACHB2B || this.state.ACHB2C;
    }
    if (selectedPaymentTypes.includes(paymentFileFormatId.USBankCHK)) {
      flagCHK = this.state.CHKB2B || this.state.CHKB2C;
    }
    if (selectedPaymentTypes.includes(paymentFileFormatId.USBankRTP)) {
      flagRTP = this.state.RTPB2B || this.state.RTPB2C;
    }

    flag =
      (selectedPaymentTypes.includes(paymentFileFormatId.USBankACH)
        ? flagACH
        : true) &&
      (selectedPaymentTypes.includes(paymentFileFormatId.USBankCHK)
        ? flagCHK
        : true) &&
      (selectedPaymentTypes.includes(paymentFileFormatId.USBankRTP)
        ? flagRTP
        : true);
    return flag;
  };
  handleChange = (event) => {
    this.setState({ ...this.state, [event.target.name]: event.target.checked });
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
        let selectedPaymentMethodb2c = response.rows2 ? response.rows2 : [];
        selectedPaymentMethodb2c.map((item) => {
          switch (item.fileFormatId) {
            case paymentFileFormatId.USBankACH:
              this.setState({
                ACHB2C: item.isB2c,
                ACHB2B: item.isB2b,
              });
              break;
            case paymentFileFormatId.USBankCHK:
              this.setState({
                CHKB2C: item.isB2c,
                CHKB2B: item.isB2b,
              });
              break;
            case paymentFileFormatId.USBankRTP:
              this.setState({
                RTPB2C: item.isB2c,
                RTPB2B: item.isB2b,
              });
              break;

            default:
              break;
          }
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
    const { selectedPaymentTypes, clientId, paymentTypes } = this.state;
    let achID;
    let rtpID;
    paymentTypes.forEach((item) => {
      if (item.paymentCode === paymentMethods.USBankACH) {
        achID = item.fileFormatId;
      } else if (item.paymentCode === paymentMethods.USBankRTP) {
        rtpID = item.fileFormatId;
      }
    });
    if (
      selectedPaymentTypes.includes(rtpID) &&
      !selectedPaymentTypes.includes(achID)
    ) {
      this.setState({
        rtpDialogFlag: true,
      });
      return;
    }

    if (selectedPaymentTypes.length > 0) {
      if (this.slectedB2CCheck()) {
        this.payloadger();
        this.props
          // .dispatch(updatePreferredPaymentTypes(clientId, selectedPaymentTypes))
          .dispatch(
            updatePreferredUSbankPaymentTypes(
              clientId,
              this.state.selectedPayees
            )
          )
          .then((response) => {
            if (!response) {
              return false;
            }
            this.props.dispatch(updateOnboardingStep());
            this.props.history.push({
              pathname: '/clientOnboard/b2c/fileSettings',
            });
          });
      } else {
        this.notification('error', 'Selection of B2B / B2C is Mandatory');
      }
    } else {
      this.notification('error', 'Atleast one payment type must be selected');
    }
  };

  importParentInformation = () => {
    const importParentId = sessionStorage.getItem('parentId');
    this.setState({
      isLoading: true,
      selectedPaymentTypes: [],
    });
    this.fetchPreferredPaymentTypes(importParentId);
    this.setState({
      isLoading: false,
      paymentTypes: this.props.b2cPaymentTypes?.data?.rows ?? [],
      showParentInfo: true,
    });
  };

  toggleAccordian = (type, isExpand = false) => {
    this.setState({
      expandedAccordians: {
        ...this.state.expandedAccordians,
        [type]: isExpand,
      },
    });
  };

  rtpDialogMessage = () => {
    this.setState({
      rtpDialogFlag: false,
    });
  };

  render() {
    const {
      selectedPaymentTypes,
      paymentModeIcons,
      parentId,
      rtpDialogFlag,
      currencyList,
    } = this.state;
    const { classes, b2cPaymentTypes } = this.props;
    return (
      <>
        {Boolean(parentId) && (
          <Grid
            container
            direction='row'
            spacing={2}
            justifyContent='center'
            alignItems='center'
          >
            <Box m={2} width='100%'>
              <PromptImport
                promptText="We noticed that client's parent company is registered with us. Would you like to import the payment information?"
                importCb={this.importParentInformation}
              />
            </Box>
          </Grid>
        )}
        <Box mx={6} my={4}>
          <Paper display='flex' className={classes.root} elevation={3}>
            <Box p={3}>
              <Grid
                container
                direction='row'
                justifyContent='flex-start'
                className={classes.gridContainers}
              >
                <Grid container item direction='row' spacing={2}>
                  <Grid item xs={12}>
                    <Box py={2}>
                      <Typography className={classes.genralTitleBold}>
                        Select Preferred Payment Method
                      </Typography>
                    </Box>
                  </Grid>
                  {!b2cPaymentTypes ? (
                    <Grid
                      item
                      container
                      justifyContent='center'
                      alignItems='center'
                    >
                      <CircularProgress color='primary' />
                    </Grid>
                  ) : (
                    !!b2cPaymentTypes?.data &&
                    b2cPaymentTypes?.data?.rows?.map(
                      (
                        { b2cDescription, paymentCode, fileFormatId, parentId },
                        index
                      ) => {
                        const checked = Boolean(
                          selectedPaymentTypes.includes(fileFormatId)
                        );

                        const payeeTypeB2B = `${paymentCode}B2B`;
                        const payeeTypeB2C = `${paymentCode}B2C`;
                        //if it is not a parent
                        if (!parentId) {
                          return (
                            <Grid
                              className='checkboxContainer'
                              key={`payment-mode-${index}`}
                              item
                              xs
                              sm
                              style={{ marginBottom: '16px' }}
                            >
                              <Checkbox
                                color='primary'
                                checked={checked}
                                label={b2cDescription}
                                index={index}
                                icon={
                                  <Box display='flex' justifyContent='center'>
                                    <img
                                      src={
                                        paymentModeIcons[
                                          `${paymentCode}${
                                            checked ? '_selected' : ''
                                          }`
                                        ]
                                      }
                                      alt={paymentCode}
                                      width='24'
                                      height='24'
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
                              {paymentCode === paymentMethods.USBankACH ||
                              paymentCode === paymentMethods.USBankCHK ||
                              paymentCode === paymentMethods.USBankRTP ? (
                                <div>
                                  <FormControl
                                    component='fieldset'
                                    className={classes.formLabel}
                                  >
                                    Applicable for :*
                                    <FormGroup>
                                      <FormControlLabel
                                        control={
                                          <Checkbox2
                                            name={payeeTypeB2B}
                                            checked={
                                              selectedPaymentTypes.includes(
                                                fileFormatId
                                              )
                                                ? this.checkedB2B(paymentCode)
                                                : false
                                            }
                                            onChange={this.handleChange}
                                          />
                                        }
                                        label='B2B'
                                        disabled={
                                          selectedPaymentTypes.includes(
                                            fileFormatId
                                          )
                                            ? false
                                            : true
                                        }
                                      />
                                      <FormControlLabel
                                        control={
                                          <Checkbox2
                                            name={payeeTypeB2C}
                                            checked={
                                              selectedPaymentTypes.includes(
                                                fileFormatId
                                              )
                                                ? this.checkedB2C(paymentCode)
                                                : false
                                            }
                                            onChange={this.handleChange}
                                          />
                                        }
                                        label='B2C'
                                        disabled={
                                          selectedPaymentTypes.includes(
                                            fileFormatId
                                          )
                                            ? false
                                            : true
                                        }
                                      />
                                    </FormGroup>
                                  </FormControl>
                                </div>
                              ) : (
                                <FormControl
                                  component='fieldset'
                                  className={classes.formLabel}
                                >
                                  Applicable for B2C payments only
                                </FormControl>
                              )}
                            </Grid>
                          );
                        } else {
                          return <></>;
                        }
                      }
                    )
                  )}
                </Grid>
                {!!b2cPaymentTypes?.data && b2cPaymentTypes.data.count ? (
                  <USbankAddAccounts
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
        {this.state.alertMsg &&
          this.renderSnackbar(this.state.alertType, this.state.alertMsg)}
        <NotificationContainer />
        {rtpDialogFlag && (
          <AlertDialog
            title='ACH is Mandatory with RTP Payment'
            open={rtpDialogFlag}
            onConfirm={() => this.rtpDialogMessage()}
          />
        )}
      </>
    );
  }
}

export default connect((state) => ({
  ...state.user,
  ...state.payment,
  ...state.b2cPayments,
}))(withStyles(styles)(USbankPayments));
