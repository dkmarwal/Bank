import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import '../styles.css';
import { withStyles } from '@material-ui/styles';
import styles from '../styles';
import ExpansionBar from '~/components/ExpansionBar';
import B2CPushToCard from '~/views/Payments/Types/B2C/PushToCard';
import B2CACH from '~/views/Payments/Types/B2C/ACH';
import PayPal from '~/views/Payments/Types/B2C/PayPal';
import Check from '~/views/Payments/Types/B2C/Check';
import { withRouter } from 'react-router-dom';
import Notification from '~/components/Notification';
import Zelle from '~/views/Payments/Types/B2C/Zelle';
import { paymentMethods } from '~/config/paymentMethods';
import { getZelleData, getPushToCardData } from '~/redux/actions/B2C/payments';
import { connect } from 'react-redux';

const AddAccounts = (props) => {
  const {
    classes,
    selectedPaymentTypes,
    toggleAccordian,
    expandedAccordians,
    b2cPaymentTypesList,
    handleNext,
    onPaymentMethodSave,
    showParentInfo,
    currencyList,
    parentId,
    dispatch,
  } = props;
  const [sortedSelectedMethods, setSortedSelectedMethods] =
    React.useState(selectedPaymentTypes);
  const clientId = sessionStorage.getItem('clientId') || null;
  const [alertMsg, setAlertMsg] = React.useState(null);
  const [alertType, setAlertType] = React.useState(null);
  const [errFound, setErrFound] = React.useState('');

  React.useEffect(() => {
    if (selectedPaymentTypes && b2cPaymentTypesList) {
      const sortedArr = b2cPaymentTypesList
        .filter((payType) =>
          selectedPaymentTypes.includes(payType.fileFormatId)
        )
        //.sort((a, b) => a.displayOrder - b.displayOrder);
      setSortedSelectedMethods(sortedArr);
      if (!props.getZelleData) {
        dispatch(getZelleData(clientId, false));
      }
      if (!props.getB2CPushCardData) {
        dispatch(getPushToCardData(clientId));
      }
    }
  }, [selectedPaymentTypes, b2cPaymentTypesList]);

  const addPaymentMethod = (paymentType) => {
    switch (paymentType) {
      case paymentMethods.PushToCard:
        return (
          <B2CPushToCard
            paymentType={paymentType}
            onSaveBtnClick={closePaymentToggle}
            showParentInfo={showParentInfo}
            notification={notification}
            currencyList={currencyList}
            parentId={parentId}
          />
        );
      case paymentMethods.ACH:
        return (
          <B2CACH
            paymentType={paymentType}
            onSaveBtnClick={closePaymentToggle}
            showParentInfo={showParentInfo}
            notification={notification}
            currencyList={currencyList}
          />
        );
      case paymentMethods.PayPal:
        return (
          <PayPal
            paymentType={paymentType}
            onSaveBtnClick={closePaymentToggle}
            showParentInfo={showParentInfo}
            notification={notification}
          />
        );
      case paymentMethods.Zelle:
        return (
          <Zelle
            paymentType={paymentType}
            onSaveBtnClick={closePaymentToggle}
            showParentInfo={showParentInfo}
            notification={notification}
            currencyList={currencyList}
            parentId={parentId}
          />
        );
      case paymentMethods.CHK:
        return (
          <Check
            paymentType={paymentType}
            onSaveBtnClick={closePaymentToggle}
            showParentInfo={showParentInfo}
            notification={notification}
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
      setErrFound(type);
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

  const renderExpansionBars = () => {
    return sortedSelectedMethods.map((item) => {
      return (
        <Grid item spacing={2}>
          <ExpansionBar
            className={classes.accord}
            expanded={expandedAccordians[item.paymentCode]}
            onChange={(e) => {
              e.preventDefault();
              toggleAccordian(
                item.paymentCode,
                !expandedAccordians[item.paymentCode]
              );
            }}
            label={
              item.paymentCode === paymentMethods.ACH
                ? `Please enter the Company ${item.b2cDescription} Details (Optional-Can be entered later)`
                : `Please enter the Company ${item.b2cDescription} Account Details (Optional-Can be entered later)`
            }
          >
            {addPaymentMethod(item.paymentCode)}
          </ExpansionBar>
        </Grid>
      );
    });
  };
  return (
    <Grid
      container
      item
      direction="column"
      justify="flex-start"
      className={classes.gridContainers}
    >
      {renderExpansionBars()}

      <Grid container direction="row" alignItems="center" spacing={3}>
        <Grid container item xs={12} justify="center">
          <Button
            color={selectedPaymentTypes.length > 0 ? 'primary' : 'secondary'}
            disabled={
              selectedPaymentTypes.length > 0 && errFound !== 'error'
                ? false
                : true
            }
            variant="contained"
            onClick={(event) => handleNext(event)}
            style={{ padding: '0.60rem 2.15rem', marginTop: '24px', fontSize: 14 }}
          >
            NEXT
          </Button>
        </Grid>
      </Grid>
      {alertMsg && renderSnackbar(alertType, alertMsg)}
    </Grid>
  );
};

export default connect((state) => ({ ...state.b2cPayments }))(
  withRouter(withStyles(styles)(AddAccounts))
);
