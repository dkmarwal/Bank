import React from 'react';
import {
  FormControlLabel,
  RadioGroup,
  Typography,
  Radio,
  Button,
  Grid,
} from '@material-ui/core';
import '../styles.css';
import { withStyles } from '@material-ui/styles';
import styles from './styles';
import USbankExpansionBar from '~/components/ExpansionBar/USbank';
import USbankACH from '~/views/Payments/Types/USbank/ACH';
import USbankDepositToDebitcard from '~/views/Payments/Types/USbank/DepositToDebitcard';
import USBankCheck from '~/views/Payments/Types/USbank/Check';
import Zelle from '~/views/Payments/Types/USbank/Zelle';
import { withRouter } from 'react-router-dom';
import Notification from '~/components/Notification';
import { paymentMethods, paymentMethodsCode } from '~/config/paymentMethods';
import { fetchUSBankCheckData,fetchUSBankPrepaidCardData } from '~/redux/actions/USbank/payments';
import { connect } from 'react-redux';
import RTP from '~/views/Payments/Types/USbank/RTP';
import FocusNonPayroll from '~/views/Payments/Types/USbank/focusNonPayroll';
import ReliaCard from '~/views/Payments/Types/USbank/reliaCard';
import CorporateRewardCard from '~/views/Payments/Types/USbank/CorporateRewardCard';

const USbankAddAccounts = (props) => {
  const {
    classes,
    selectedPaymentTypes,
    toggleAccordian,
    expandedAccordians,
    b2cPaymentTypesList,
    handleNext,
    onPaymentMethodSave,
    showParentInfo,
    dispatch,
    parentId,
    currencyList
  } = props;
  const [sortedSelectedMethods, setSortedSelectedMethods] =
    React.useState(selectedPaymentTypes);

  const clientId = sessionStorage.getItem('clientId') || null;
  const [alertMsg, setAlertMsg] = React.useState(null);
  const [alertType, setAlertType] = React.useState(null);
  const [prepaidCardType, setPrepaidCardType] = React.useState(null);
  const [isPaymentMethodSelected, setPaymentMethodSelected] =
    React.useState(null);
  const [achFilled, setAchFilled] = React.useState(false);

  const summaryNotePaymentMethods = [
    paymentMethods.USBankACH,
    paymentMethods.USBankCHK,
  ];
 
  React.useEffect(() => {
    if (
      isPaymentMethodSelected &&
      !selectedPaymentTypes?.includes(paymentMethodsCode.PrepaidCorporateReward)
    ) {
      setPaymentMethodSelected(null);
      toggleAccordian(paymentMethodsCode.PrepaidCorporateReward);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPaymentTypes]);

  React.useEffect(() => {
    if (selectedPaymentTypes && b2cPaymentTypesList) {
      const sortedArr = b2cPaymentTypesList.filter((payType) =>
        selectedPaymentTypes.includes(payType.fileFormatId)
      );
      //.sort((a, b) => a.displayOrder - b.displayOrder);
      setSortedSelectedMethods(sortedArr);
      if (!props.usBankpayment.usbankCheckData) {
        dispatch(fetchUSBankCheckData(clientId));
      }
      if(!props.usBankpayment.storedPrepaidCardData){
        dispatch(fetchUSBankPrepaidCardData(clientId))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPaymentTypes, b2cPaymentTypesList, clientId, showParentInfo]);

  React.useEffect(() => {
    if (props.usBankpayment.storedPrepaidCardData?.data) {
      const prePaidCardData = props.usBankpayment.storedPrepaidCardData.data;
      if (!isPaymentMethodSelected) {
        if (prePaidCardData?.prepaidCardData?.length) {
          setPaymentMethodSelected(
            prePaidCardData.prepaidCardData.map((elem) => elem.paymentTypeId)
          );
        } else {
          setPaymentMethodSelected([paymentMethodsCode.PrepaidFocusNonPayroll]);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.usBankpayment.storedPrepaidCardData]);

  React.useEffect(() => {
    if (
      isPaymentMethodSelected?.includes(
        paymentMethodsCode.PlasticCorporateCard
      ) ||
      isPaymentMethodSelected?.includes(paymentMethodsCode.DigitalCorporateCard)
    ) {
      setPrepaidCardType(paymentMethods.PrepaidCorporateReward);
    } else if (
      isPaymentMethodSelected?.includes(
        paymentMethodsCode.PrepaidFocusNonPayroll
      )
    ) {
      setPrepaidCardType(paymentMethods.PrepaidFocusNonPayroll);
    } else if (
      isPaymentMethodSelected?.includes(paymentMethodsCode.PrepaidReliaCard)
    ) {
      setPrepaidCardType(paymentMethods.PrepaidReliaCard);
    }
  }, [isPaymentMethodSelected]);

  const renderPrepaidCardForms = (paymentType) => {
    switch (prepaidCardType) {
      case paymentMethods.PrepaidFocusNonPayroll:
        return (
          <FocusNonPayroll
            showParentInfo={showParentInfo}
            notification={notification}
            b2cPaymentTypesList={b2cPaymentTypesList}
            onSaveBtnClick={closePaymentToggle}
            parentId={parentId}
            currencyList={currencyList}
            paymentType={paymentType}
          />
        );
      case paymentMethods.PrepaidReliaCard:
        return (
          <ReliaCard
            showParentInfo={showParentInfo}
            notification={notification}
            b2cPaymentTypesList={b2cPaymentTypesList}
            onSaveBtnClick={closePaymentToggle}
            parentId={parentId}
            currencyList={currencyList}
            paymentType={paymentType}
          />
        );
      case paymentMethods.PrepaidCorporateReward:
        return (
          <CorporateRewardCard
            showParentInfo={showParentInfo}
            notification={notification}
            b2cPaymentTypesList={b2cPaymentTypesList}
            onSaveBtnClick={closePaymentToggle}
            parentId={parentId}
            paymentType={paymentType}
          />
        );
      default:
        return (<></>
          // <FocusNonPayroll
          //   showParentInfo={showParentInfo}
          //   notification={notification}
          //   b2cPaymentTypesList={b2cPaymentTypesList}
          //   onSaveBtnClick={closePaymentToggle}
          //   parentId={parentId}
          //   currencyList={currencyList}
          //   paymentType={paymentType}
          // />
        );
    }
  };

  const addPaymentMethod = (paymentType) => {
    switch (paymentType) {
      case paymentMethods.USBankACH:
        return (
          <USbankACH
            paymentType={paymentType}
            onSaveBtnClick={closePaymentToggle}
            showParentInfo={showParentInfo}
            notification={notification}
            currencyList={currencyList}
            setAchFilled={setAchFilled}
          />
        );
      case paymentMethods.USBankRTP:
        return (
          <RTP
            paymentType={paymentType}
            onSaveBtnClick={closePaymentToggle}
            showParentInfo={showParentInfo}
            notification={notification}
            selectedPaymentTypes={selectedPaymentTypes}
            b2cPaymentTypesList={b2cPaymentTypesList}
            achFilled={achFilled}
          />
        );

      case paymentMethods.USBankDepositToDebitcard:
        return (
          <USbankDepositToDebitcard
            paymentType={paymentType}
            onSaveBtnClick={closePaymentToggle}
            showParentInfo={showParentInfo}
            notification={notification}
          />
        );

      case paymentMethods.USBankCHK:
        return (
          <USBankCheck
            paymentType={paymentType}
            notification={notification}
            showParentInfo={showParentInfo}
            onSaveBtnClick={closePaymentToggle}
            parentId={parentId}
            sortedSelectedMethods={sortedSelectedMethods}
          />
        );
      case paymentMethods.USBankPrepaidCard:
        return renderPrepaidCardForms(paymentType);
      case paymentMethods.USBankZelle:
        return (
          <Zelle
            paymentType={paymentType}
            onSaveBtnClick={closePaymentToggle}
            showParentInfo={showParentInfo}
            notification={notification}
            sortedSelectedMethods={sortedSelectedMethods}
          />
        );

      default:
        return <></>;
    }
  };

  const closePaymentToggle = (type, bool) => {
    if (!bool) {
      onPaymentMethodSave(type, bool);
    }
  };

  const notification = (type, msg) => {
    if (msg) {
      setAlertMsg(msg);
      setAlertType(type);
    }
  };

  const renderSnackbar = (type, msg) => {
    return (
      <Notification
        variant={type}
        message={msg}
        handleClose={hideAlertMessage}
      />
    );
  };

  const hideAlertMessage = () => {
    setAlertMsg(null);
    setAlertType(null);
  };

  const handleRadioButton = ({ target }) => {
    const { value } = target;
    setPrepaidCardType(value);
  };

  const renderExpansionBars = () => {
    return sortedSelectedMethods.map((item, index) => {
      return (
        <Grid
          container
          style={{ padding: '0px 8px' }}
          item
          key={`${item.paymentCode}_${index}`}
          spacing={2}
        >
          <USbankExpansionBar
            className={classes.accord}
            expanded={expandedAccordians[item.paymentCode]}
            onChange={(e) => {
              e.preventDefault();
              toggleAccordian(
                item.paymentCode,
                !expandedAccordians[item.paymentCode]
              );
            }}
          
            label={`Payment Information for ${item.b2cDescription} Payment`}
            isPrepaidCard={
              item.paymentCode === paymentMethods.USBankPrepaidCard && (
                <RadioGroup
                  name='prepaidCardTypes'
                  value={prepaidCardType}
                  row
                  onChange={(e) => handleRadioButton(e)}
                >
                  {b2cPaymentTypesList?.map((elem) => {
                    if (elem.parentId === paymentMethodsCode.USBankPrepaidCard)
                      return (
                        <FormControlLabel
                          key={elem.paymentCode}
                          value={elem.paymentCode}
                          control={
                            <Radio
                              color='primary'
                            />
                          }
                          label={elem.description}
                        />
                      );
                    else return null;
                  })}
                </RadioGroup>
              )
            }
          >
            {addPaymentMethod(item.paymentCode)}
          </USbankExpansionBar>
        </Grid>
      );
    });
  };
  return (
    <Grid
      container
      item
      direction='column'
      justifyContent='flex-start'
      className={classes.gridContainers}
    >
      {renderExpansionBars()}

      <Grid container direction='row' alignItems='center' spacing={3}>
        <Grid container item xs={12} justifyContent='center'>
          <Button
            color={'primary'}
            disabled={false}
            variant='contained'
            onClick={(event) => handleNext(event)}
            style={{ padding: '0.60rem 2.15rem', marginTop: '24px' }}
          >
            Next
          </Button>
        </Grid>
      </Grid>
      {alertMsg && renderSnackbar(alertType, alertMsg)}
    </Grid>
  );
};

export default connect((state) => ({
  ...state.b2cPayments,
  ...state.USbankpayment,
}))(withRouter(withStyles(styles)(USbankAddAccounts)));
