import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  MenuItem,
} from '@material-ui/core';
import TextField from '~/components/Forms/TextField';
import { makeStyles } from '@material-ui/core/styles';
import {
  USBankupdatedRTPData,
  USBankcreateRtpData,
  USBankGetRTPData,
  fetchUSBankRtpList
} from '~/redux/helpers/USbank/payments';
import { connect } from 'react-redux';
import 'react-notifications/lib/notifications.css';
import MaskInput from '~/components/MaskInput';
import trim from 'deep-trim-node';
import {fetchB2CBankAccountsList} from '~/redux/actions/B2C/payments' 
import { AlertDialog } from "~/components/Dialogs";
import { paymentMethods } from '~/config/paymentMethods';

const useStyles = makeStyles((theme) => ({
  gridItem: {
    margin: 0,
    '& .MuiOutlinedInput-notchedOutline': {
      '& legend': {
        fontSize: '0.85em',
      },
    },
  },
  textinputLabel: {
    color: "black"
  },
  selectLimit: {
    fontSize: '0.85em',
  },
}));

const RTP = ({
  currencyList = [],
  bankDetail,
  showParentInfo,
  paymentType,
  dispatch,
  onSaveBtnClick,
  notification,
  achB2CAccountList,
  selectedPaymentTypes,
  b2cPaymentTypesList,
  achFilled,
}) => {
  const clientId = sessionStorage.getItem('clientId') || null;
  const parentId = sessionStorage.getItem('parentId');
  const [rtpDialogFlag, setRtpDialogFlag] = useState(false);
  const [titleFlag, settitleFlag] = useState(false);
  const [saveProcessing, setSaveProcessing] = useState(false);
  const [rtpDetailInfo, setRtpDetailInfo] = useState({
    data: {
      id: '',
      clientId: '',
      rtpRoutingCode: '',
      rtpaccountnumber: '',
    },
    error: {
      id: '',
      clientId: '',
      rtpRoutingCode: '',
      rtpAccountNumber: '',
    },
  });

  const classes = useStyles();
  const { data, error } = rtpDetailInfo;
  const {
    id,
    rtpRoutingCode,
    rtpAccountNumber,
  } = data;

  useEffect(() => {
    async function initBankInformation() {
      let ID = clientId;
      if (showParentInfo) {
        ID = parentId;
      }
      setRtpDetailInfo({
        ...rtpDetailInfo,
        data: {
          ...rtpDetailInfo.data,
          ...bankDetail,
        },
      });

      const getUSBankRtpData = await USBankGetRTPData(ID, paymentType);
      if (
        getUSBankRtpData &&
        getUSBankRtpData.data.length > 0
      ) {
        let finalBankDetails = getUSBankRtpData.data[0];
        if (showParentInfo) {
          const { ID, ...restDetail } = getUSBankRtpData.data[0];
          finalBankDetails = restDetail;
        }
        setRtpDetailInfo({
          ...rtpDetailInfo,
          data: {
            ...rtpDetailInfo.data,
            ...bankDetail,
            ...finalBankDetails,
          },
        });
      }
    }

    initBankInformation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showParentInfo, bankDetail, paymentType]);



  const handleIntegerValueChange = (event) => {
    const { name, value } = event.target;
    setRtpDetailInfo({
      ...rtpDetailInfo,
      data: {
        ...rtpDetailInfo.data,
        [name]: value === '' ? null : value.replace(/[^0-9]/g, ''),
      },
    });
  };

  const renderNotification = (mesg, title) => {
    notification(
      mesg,
       title
    );
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setRtpDetailInfo({
      ...rtpDetailInfo,
      data: {
        ...rtpDetailInfo.data,
        [name]: value === '' ? null : value.trim(),
      },
    });
  };

  const onSubmit = () => {
    let achID;
    b2cPaymentTypesList.map((item) => {
      if(item.paymentCode === paymentMethods.USBankACH) {
        achID = item.fileFormatId;
      }
    })

    // let RTPErrorMessage = false;
    // RTPErrorMessage = selectedPaymentTypes.includes(achID);
    // if(!RTPErrorMessage) {
    //   setRtpDialogFlag(true);
    //   return;
    // }

    if(!achFilled) {
      const valid = validation();
      valid?settitleFlag(true):settitleFlag(false);
      setRtpDialogFlag(true);
      return;
    }

    const valid = validation();
    setSaveProcessing(true);

    if (valid) {
      const data = {
        id,
        clientId,
        rtpRoutingCode,
        rtpAccountNumber,
      };

      if (id) {
        dispatch(
          USBankupdatedRTPData({
            id,
            clientId,
            bankDetail: trim(data),
          })
        ).then((response) => {
          setSaveProcessing(false);
          if (response && !response.error) {
            //dispatch(fetchUSBankRtpList(id, paymentType))
            //notification('success', 'RTP Account data updated successfully');
            renderNotification("success", response.message);
            onSaveBtnClick(paymentType, false);
          } else {
            const errorMsg =
              response && response.message
                ? response.message
                : 'Oops! Something went wrong.';
            notification('error', errorMsg);
            return false;
          }
        });
      } else {
        const { id, ...restRtpDetail } = data;
        dispatch(
          USBankcreateRtpData({
            id,
            clientId,
            bankDetail: trim(restRtpDetail),
          })
        ).then((response) => {
          dispatch(fetchUSBankRtpList(clientId, paymentType))
          if (response && response.data && response.data.id) {
            setRtpDetailInfo({
              ...rtpDetailInfo,
              data: {
                ...rtpDetailInfo.data,
                id: response.data.id,
              },
            });
            renderNotification("success", response.message);
            onSaveBtnClick(paymentType, false);
          } else {
            const errorMsg =
              response && response.message
                ? response.message
                : 'Oops! Something went wrong.';
            notification('error', errorMsg);
          }
          setSaveProcessing(false);
        });
      }
    } else {
      notification(
        'error',
        'Validation error! Please fill the required information.'
      );
      setSaveProcessing(false);
    }

  };

  const validation = () => {
    let valid = true;
    let validation = {};
    if (!rtpRoutingCode || (rtpRoutingCode && rtpRoutingCode.trim().length === 0)) {
      validation['rtpRoutingCode'] =
        'RTP Routing Number is required';
      valid = false;
    }

    if (rtpRoutingCode && rtpRoutingCode.trim().length !== 9) {
      validation['rtpRoutingCode'] =
        'RTP Routing Number must be of 9 digits';
      valid = false;
    }

    if (!rtpAccountNumber || (rtpAccountNumber && rtpAccountNumber.trim().length === 0)) {
      validation['rtpAccountNumber'] =
        'RTP Account Number is required';
      valid = false;
    }

    if (rtpAccountNumber && rtpAccountNumber.trim().length < 6) {
      validation['rtpAccountNumber'] =
        'RTP Account Number must be 6 digits and less than of 17 digits';
      valid = false;
    }

    setRtpDetailInfo({
      ...rtpDetailInfo,
      error: { ...validation },
    });
    return valid;
  };

  const rtpDialogMessage = () => {
    setRtpDialogFlag(false);
  }

  return (
    <Box>
      <Grid container>
          <Grid container item>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color="primary"
                  inputProps={{
                    maxLength: 9,
                    minLength: 1,
                  }}
                  label="RTP Routing Number *"
                  placeholder={rtpRoutingCode === null && "RTP Routing Number *"}
                  error={Boolean(error.rtpRoutingCode)}
                  helperText={error.rtpRoutingCode}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    //shrink: false,
                    className: classes.inputBox
                  }}
                  variant="outlined"
                  value={rtpRoutingCode}
                  name="rtpRoutingCode"
                  onChange={handleIntegerValueChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <MaskInput
                  color="primary"
                  inputProps={{
                    maxLength: 17,
                    minLength: 6,
                  }}
                  label={"RTP Account Number *"}
                  placeholder="RTP Account Number *"
                  error={Boolean(error.rtpAccountNumber)}
                  helperText={error.rtpAccountNumber}
                  fullWidth={true}
                  autoComplete="off"
                  variant="outlined"
                  value={rtpAccountNumber || ''}
                  name="rtpAccountNumber"
                  getValue={(val) => {
                    setRtpDetailInfo({
                      ...rtpDetailInfo,
                      data: { ...rtpDetailInfo.data, rtpAccountNumber: val },
                    });
                  }}
                  InputLabelProps={{
                    className: classes.inputBox
                  }}
                />
              </Box>
            </Grid>
          </Grid>
          <Grid container item xs={12} justify="center">
            {saveProcessing ? (
              <CircularProgress color="primary" />
            ) : (
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={() => onSubmit()}
                style={{ color: 'white' }}
              >
                Save
              </Button>
            )}
          </Grid>
      </Grid>
      {rtpDialogFlag && (
          <AlertDialog
            title={titleFlag?"Please fill mandatory ACH information with RTP payment":"ACH is Mandatory with RTP Payment"}
            open={rtpDialogFlag}
            onConfirm={() => rtpDialogMessage()}
          />
        )}
    </Box>
  );
};


export default connect((state) => ({
  ...state.b2cPayments,
}))(RTP);