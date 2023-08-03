import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Grid, Paper, Typography, Button, Box } from '@material-ui/core';

import '../styles.scss';
import Style from '../styles';
import PromptImport from '~/components/Dialogs/PromptImport';
import { withStyles } from '@material-ui/styles';
import {
  getB2CRemittanceConfigRule,
  getB2CClientRemConfig,
  getB2CRemittanceParams,
  updateB2CRemittanceParams,
  updateB2CRemittanceConfig,
  postB2CClientMailCall,
  updateRemittanceSettingShow,
  getRemittanceSettingShow,saveClientRemScheme,fetchRemittanceScheme,getClientRemScheme,
} from '~/redux/helpers/B2C/remittance';
import { getClientDataActivated } from '~/redux/actions/clients';
import 'react-notifications/lib/notifications.css';
import B2CCheckboxGroup from '~/components/Forms/B2C/CheckboxGroup';
import Notification from '~/components/Notification';
import RemittanceConfig from './remittanceConfig';
import SimpleDialog from '~/components/Model/SimpleDialog';

const B2CRemittance = ({
  history,
  updateOnboardingStep,
  classes,
  isPayeeChoicePortal
}) => {
  const [configLoading, setConfigLoading] = useState(false);
  const [clientId, setClientId] = useState(sessionStorage.getItem('clientId'));
  const [email, setEmail] = useState(null);
  const [parentId, setParentId] = useState(null);
  const [remittanceConfig, setRemittanceConfig] = useState([]);
  const [clientRemittanceConfig, setClientRemittanceConfig] = useState({});
  const [isBulkRemittance, setBulkRemittances] = useState(0);
  const [mapDeliveryFormat, setMapDeliveryFormat] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [showRemittance, setShowRemittance] = useState(0);
  const [remittanceFormat, setRemittanceFormat] = React.useState([]);
  const [remittanceScheme, setRemittanceScheme] = React.useState([]);
  const [remittanceParams, setRemittanceParams] = useState({
    clientId: clientId,
    isPaymentId: 1,
    isPaymentType: 1,
    isValueDate: 1,
    isPaymentReference: 1,
    isAmount: 1,
    isAmountPaid: 1,
    isClientName: 1,
    isPayeeName: 1,
    isPaymentDate: 1,
    isNotes: 1,
    isClientPhoneNumber:1,
    isClientEmailAddress:1
  });
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  const disabledRemittance = isPayeeChoicePortal? true: false;

  useEffect(() => {
    updateOnboardingStep(6);
    const clientId = sessionStorage.getItem('clientId');
    fetchClientInformation(clientId);
    fetchRemitConfigRule();
    fetchRemittanceSettingShow(clientId);
    getRemittanceSceme(clientId);
  }, []);

  const fetchRemittanceSettingShow = (id) => {
    getRemittanceSettingShow(id).then((response) => {     
      setShowRemittance(response?.data ?? 1);
      if(response.data){
        fetchClientRemittanceParams(id);
      }
    });
  };

  const fetchClientInformation = async (clientId) => {
    const clientData = await getClientDataActivated(clientId);
    const { data = {} } = clientData;
    let parentId = null;
    let clientEmail = null;
    if (data.rows && data.rows[0]) {
      parentId = data.rows[0].parentId;
      clientEmail = data.rows[0].emailAddress;
    }
    setParentId(parentId);
    setClientId(clientId);
    setEmail(clientEmail);
  };

  const getRemittanceSceme = async (id) => {
    setConfigLoading(true);
    try {
      const resp = await fetchRemittanceScheme();
      if (resp) {
        getClientRemittanceScheme(id,resp);
      } else {
        setAlertMessage('Server Error');
        setAlertType('error');
      }
      setConfigLoading(false);
    } catch (error) {
      setConfigLoading(false);
      setAlertMessage('Server Error');
      setAlertType('error');
    }
  };
const getClientRemittanceScheme= async (id,response)=>{
  const resp = await getClientRemScheme(id);
  const { data, error, message } = resp;
  if (error) {
    setAlertMessage(message || 'Server Response Error');
    setAlertType('error');
    return;
  } else if (data) {
    const selectedRemScheme = data?.remittanceSchemeId ?? 1;
    setRemittanceScheme(response?.data?.map((field) =>
      field.schemeId === selectedRemScheme
        ? {
            id: field.schemeId,
            selected: true,
            label: field.description,
          }
        : {
            id: field.schemeId,
            selected: false,
            label: field.description,
          }
    ));
  }
}
  const fetchRemitConfigRule = async () => {
    setConfigLoading(true);
    try {
      const resp = await getB2CRemittanceConfigRule();
      if (resp) {
        fetchClientRemConfig(clientId, resp.data);
        const { data, error, message } = resp;
        if (error) {
          setAlertMessage(message || 'Server Response Error');
          setAlertType('error');
          return;
        } else if (data) {
          setRemittanceConfig(data);
          const newRemittanceFormat = [];
          // set Mapping for delivery Formats
          const mapformat = data.reduce(
            (obj, { rmtDeliveryOptionId, deliveryOptionId }) => {
              const newObj = Array.isArray(deliveryOptionId)
                ? deliveryOptionId[0]
                : {};
              newObj.rmtDeliveryOptionId = rmtDeliveryOptionId;
              newObj.selected = true;
              newRemittanceFormat.push(newObj);
              const formatIds =
                Array.isArray(deliveryOptionId) &&
                deliveryOptionId.map(({ formatId }) => formatId);
              obj[rmtDeliveryOptionId] = formatIds;
              return obj;
            },
            {}
          );
          const finalRemittanceFormat = newRemittanceFormat.filter(
            (elem, index) =>
              newRemittanceFormat.findIndex(
                (obj) => obj.formatId === elem.formatId
              ) === index
          );
          setRemittanceFormat(finalRemittanceFormat);
          setMapDeliveryFormat(mapformat);
        }
      } else {
        setAlertMessage('Server Error');
        setAlertType('error');
      }
      setConfigLoading(false);
    } catch (error) {
      setConfigLoading(false);
      setAlertMessage('Server Error');
      setAlertType('error');
    }
  };

  const fetchClientRemConfig = async (paramClientId, clientRemConstData) => {
    try {
      const resp = await getB2CClientRemConfig(parseInt(paramClientId));
      if (resp) {
        const { data, error, message } = resp;
        if (error) {
          setAlertMessage(message || 'Server Response Error');
          setAlertType('error');
          return;
        } else if (data) {
          let clientRemitConfig = {};
          if (data && Array.isArray(data.remittanceDetails)) {
            clientRemitConfig = data.remittanceDetails.reduce(
              (obj, { rmtDeliveryOptionId, remittanceFormats }) => {
                obj[rmtDeliveryOptionId] =
                  Array.isArray(remittanceFormats) &&
                  remittanceFormats.map(({ formatId }) => formatId);
                return obj;
              },
              {}
            );
          } else if (
            !clientRemittanceConfig ||
            !Object.keys(clientRemittanceConfig).length
          ) {
            const downloadFormatData = clientRemConstData.filter((item) => {
              return item.rmtDeliveryOptionId === 1;
            });
            if (downloadFormatData?.length) {
              clientRemitConfig[downloadFormatData[0].rmtDeliveryOptionId] = [
                downloadFormatData[0]?.deliveryOptionId[0]?.formatId,
              ];
            }
            const emailFormatData = clientRemConstData.filter((item) => {
              return item.rmtDeliveryOptionId === 2;
            });
            if (emailFormatData?.length) {
              clientRemitConfig[emailFormatData[0].rmtDeliveryOptionId] = [
                emailFormatData[0]?.deliveryOptionId[0]?.formatId,
              ];
            }
          }
          if (Object.keys(clientRemitConfig).length) {
            setClientRemittanceConfig(clientRemitConfig);
          }
          setBulkRemittances(
            data && data.isBulkRemittance ? data.isBulkRemittance : 0
          );
        }
      } else {
        setAlertMessage('Server Error');
        setAlertType('error');
      }
    } catch (error) {
      setAlertMessage('Client Error');
      setAlertType('error');
    }
  };

  const fetchClientRemittanceParams = async (paramClientId) => {
    try {
      const resp = await getB2CRemittanceParams(parseInt(paramClientId));
      if (resp !== undefined && resp) {
        const {
          data: { data, error },
        } = await resp;
        if (!error) {
          data.rows &&
            setRemittanceParams({
              ...remittanceParams,
              ...data.rows[0],
              clientId,
            });
        }
      }
    } catch (error) {}
  };

  const updateClientRemitParam = async () => {
    try {
      const resp = await updateB2CRemittanceParams(remittanceParams);
      if (resp) {
        const {
          data: { error, message },
        } = await resp;
        if (!error) {
          return true;
        } else {
          setAlertMessage(message || 'Server Error');
          setAlertType('error');
        }
      }
    } catch (error) {
      setAlertMessage('Server Error');
      setAlertType('error');
      return false;
    }
  };

  const updateClientRemitConfig = async (remittanceDetails) => {
    try {
      if (remittanceDetails && remittanceDetails.length) {
        const data = {
          remittanceDetails: remittanceDetails,
          isBulkRemittance: isBulkRemittance,
        };
        const resp = await updateB2CRemittanceConfig(clientId, data);
        if (resp !== undefined && resp) {
          const {
            data: { error },
          } = await resp;
          if (!error) {
            return true;
          } else {
            setAlertMessage('Server Error');
            setAlertType('error');
          }
        }
      } else {
        setAlertMessage('Please select a Remittance Format');
        setAlertType('error');
      }
    } catch (error) {
      setAlertMessage('Server Error');
      setAlertType('error');
      return false;
    }
  };

  const onChangeFormat = (deliveryId, checked, index) => {
    const newRemittanceFormat = [...remittanceFormat];
    newRemittanceFormat[index].selected = !checked;
    setRemittanceFormat(newRemittanceFormat);
  };
const onRemittanceSchemeChange = (id, checked, index) => {
  if (checked) {
    const newRemittanceScheme = remittanceScheme.map((param, i) =>
    param.id === id
        ? {
            ...param,
            selected: true,
          }
        : {
            ...param,
            selected: false,
          }
    );
    setRemittanceScheme(newRemittanceScheme);
  }
};
  const onChangeDelivery = (name, checked, event) => {
    let selectedFormat = [];
    if (checked) {
      selectedFormat = [
        ...new Set([
          ...(clientRemittanceConfig[name] || []),
          ...mapDeliveryFormat[name],
        ]),
      ];
    }
    setClientRemittanceConfig({
      ...clientRemittanceConfig,
      [name]: selectedFormat,
    });
  };

  const onChangeParameter = (name, currentValue) => {
    const newValue = currentValue ? 1 : 0;
    setRemittanceParams({ ...remittanceParams, [name]: parseInt(newValue) });
  };

  const importParentPermissions = async () => {
    try {
      if (parentId) {
        // fetchClientRemittanceParams(parentId);
        fetchClientRemConfig(parentId);
        fetchRemittanceSettingShow(parentId);
      }
    } catch (error) {}
  };

  const onNext = async () => {
    try {
      const remittanceDetails = Object.keys(clientRemittanceConfig)
        .filter(
          (key) =>
            clientRemittanceConfig[key] &&
            clientRemittanceConfig[key].length > 0
        )
        .reduce((arr, key) => {
          arr.push({
            deliveryModeId: key,
            formatIds: clientRemittanceConfig[key],
          });
          return arr;
        }, []);
        const isRemittanceSchemeSelected = remittanceScheme.filter(
          (item) => item.selected
        );
      if (showRemittance) {
        if (!remittanceDetails || !remittanceDetails.length) {
          setAlertMessage('Please select a Remittance delivery mode');
          setAlertType('error');
          return false;
        }
        const isRemittanceSelected = remittanceFormat.filter(
          (item) => item.selected
        );
        if (!isRemittanceSchemeSelected.length) {
          setAlertMessage('Please select a Remittance System');
          setAlertType('error');
          return false;
        }
        if (!isRemittanceSelected.length) {
          setAlertMessage('Please select a Remittance delivery format');
          setAlertType('error');
          return false;
        }
      }
      const saveRemittanceSettings = await updateRemittanceSettingShow({
        clientId,
        isRemittanceRequired: showRemittance,
      });
      if (saveRemittanceSettings) {
        const paramConfigResponse = showRemittance
          ? await updateClientRemitParam()
          : true;
        const configResponse = showRemittance
          ? await updateClientRemitConfig(remittanceDetails)
          : true;
          const remSchemeResponse = showRemittance
          ? await saveClientRemScheme(clientId,isRemittanceSchemeSelected[0].id)
          : true;
        if (configResponse && paramConfigResponse && saveRemittanceSettings) {
          setOpenModal(!openModal);
        }
      } else {
        setAlertMessage('Something went wrong!');
        setAlertType('error');
      }
    } catch (error) {
      setAlertMessage('Something went wrong!');
      setAlertType('error');
    }
  };

  // Modal Variable and Event Hanlders
  const title = isPayeeChoicePortal ? 'Onboarding is completed successfully':'Onboarding is completed Successfully';
  const subtitle = '';

  const cancelMOdalOperation = () => {
    setOpenModal(!openModal);
    history.push('/clients');
    postClientMail();
  };
  const onCloseModal = () => {
    setOpenModal(!openModal);
  };
  const modalActions = [
    { label: 'OK', onClickHandler: cancelMOdalOperation, variant: 'outlined' },
  ];
  const postClientMail = async () => {
    const data = {
      email: email,
      portalTypeId: 1,
      portalProfileId: clientId,
    };
    await postB2CClientMailCall(data);
  };

  const renderSnackbar = (type, message) => {
    return (
      <Notification
        variant={type}
        message={message}
        handleClose={hideAlertMessage}
      />
    );
  };

  const hideAlertMessage = () => {
    setAlertMessage(null);
    setAlertType(null);
  };
  return (
    <React.Fragment>
      <Paper className={classes.paperBg} display="flex">
        {parentId && (
          <PromptImport
            promptText="We noticed that client's parent company is registered with us. Would you like to import Remittance Settings?"
            importCb={importParentPermissions}
          />
        )}
        <Box className={classes.gridBox} p={5} m={3}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography className={classes.genralTitleBold}>
                Do you want to enable Remittances Setup?
              </Typography>
            </Grid>
            <B2CCheckboxGroup
              options={[
                {
                  label: 'Yes',
                  value: 1,
                },
                {
                  label: 'No',
                  value: 0,
                },
              ]}
              isChecked={true}
			  disabled={disabledRemittance}
              onChange={(selectedValue) => {
                setShowRemittance(selectedValue.value);
              }}
              selectedOption={showRemittance}
            />
            {showRemittance ? (
              <RemittanceConfig
                remittanceConfig={remittanceConfig}
                remittanceScheme={remittanceScheme}
                onRemittanceSchemeChange={onRemittanceSchemeChange}
                clientRemittanceConfig={clientRemittanceConfig}
                onChangeDelivery={onChangeDelivery}
                configLoading={configLoading}
                onChangeFormat={onChangeFormat}
                remittanceParams={remittanceParams}
                onChangeParameter={onChangeParameter}
                remittanceFormat={remittanceFormat}
              />
            ) : null}
          </Grid>
        </Box>
        <Button
          onClick={onNext}
          className={classes.finishButton}
          variant="outlined"
        >
          FINISH
        </Button>
      </Paper>

      {alertMessage && renderSnackbar(alertType, alertMessage)}
      {/* <DialogModel
        open={openModal}
        onConfirm={cancelMOdalOperation}
        title={title}
        subtitle={subtitle}
        confirmText={'CLOSE'}
      /> */}
      <SimpleDialog
        open={openModal}
        onCloseModal={onCloseModal}
        modalActions={modalActions}
        title={title}
        subtitle={subtitle}
      />
    </React.Fragment>
  );
};

export default connect((state) => ({ ...state.user, ...state.payment }))(
  withStyles(Style)(B2CRemittance)
);
