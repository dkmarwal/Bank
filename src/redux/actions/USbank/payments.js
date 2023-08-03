import Cookies from 'universal-cookie';
import axios from 'axios';
import config from '~/config';
import { getAccessToken } from '~/redux/helpers/user';

axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    // Do something with response error
    if (error.response.status === 401) {
      let cookies = new Cookies();
      cookies.remove('@accessToken', { path: `${config.baseName}/` });
      cookies.remove('@refreshToken', { path: `${config.baseName}/` });
      cookies.remove('@portalTypeId', { path: `${config.baseName}/` });
      cookies.remove('@userId', { path: `${config.baseName}/` });
      window.location.href = `${config.baseName}/sessionout`;
    }
    return error.response;
  }
);

export const getUSbankZelleData = (clientID) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v2/b2c/clients/${clientID}/zelle-account`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: 'FETCH_B2C_ZELLE_SUCCESS',
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: 'FETCH_B2C_ZELLE_FAILED',
      payload: responseBody.message || 'Oops! Something went wrong.',
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_B2C_ZELLE_FAILED',
      payload: error.message || 'An error has occurred.',
    });
    return false;
  }
};
export const addUSbankZelle = (data, clientId) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v2/b2c/clients/${clientId}/zelle-account`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        zellePayerId: data.zellePayerId.toString() || null,
        zellePayFromAccountNumber:
          data.zellePayFromAccountNumber.toString() || null,
        zellePriorityType: data.zellePriorityType || null,
        convertToCheckIfZelleExp: data.convertToCheckIfZelleExp ?? false,
        convertToCheckIfZelleFailed: data.convertToCheckIfZelleFailed ?? false,
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: 'USBANK_ADD_ZELLE_SUCCESS',
        payload: responseBody,
      });
      return true;
    }
    dispatch({
      type: 'USBANK_ADD_ZELLE_FAILED',
      payload: responseBody.message || 'Oops! Something went wrong.',
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'USBANK_ADD_ZELLE_FAILED',
      payload: error.message || 'An error has occurred.',
    });
    return false;
  }
};

export const updateUSbankZelle = (data, clientId) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v2/b2c/clients/${clientId}/zelle-account`,

      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        id: data.id || null,
        zellePayerId: data.zellePayerId.toString() || null,
        zellePayFromAccountNumber:
          data.zellePayFromAccountNumber.toString() || null,
        zellePriorityType: data.zellePriorityType || null,
        convertToCheckIfZelleExp: data.convertToCheckIfZelleExp ?? false,
        convertToCheckIfZelleFailed: data.convertToCheckIfZelleFailed ?? false,
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: 'USBANK_ADD_ZELLE_SUCCESS',
        payload: responseBody,
      });
      return true;
    }
    dispatch({
      type: 'USBANK_ADD_ZELLE_FAILED',
      payload: responseBody.message || 'Oops! Something went wrong.',
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'USBANK_ADD_ZELLE_FAILED',
      payload: error.message || 'An error has occurred.',
    });
    return false;
  }
};
export const priorityTypeList = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v2/b2c/zelle-prioritytypes`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: 'FETCH_USBANK_ZELLE_PRIORITY_SUCCESS',
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: 'FETCH_USBANK_ZELLE_PRIORITY_FAILED',
      payload: responseBody.message || 'Oops! Something went wrong.',
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_USBANK_ZELLE_PRIORITY_FAILED',
      payload: error.message || 'An error has occurred.',
    });
    return false;
  }
};

/* 

  US Bank RTP Methods

  */

export const getPreferredClientPaymentTypes =
  (clientId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const accessURL = `${config.apiBase}/client-config-service/${config.apiVersion}/payment-type/client/${clientId}`;
      const response = await axios({
        url: accessURL,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_RTP_IMPORT_SUCCESS',
          payload: responseBody.data,
        });
        return responseBody.data;
      }
      dispatch({
        type: 'FETCH_RTP_IMPORT_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_RTP_IMPORT_FAILED',
        payload: error.message || 'An error has occurred.',
      });
      return false;
    }
  };

export const updatePreferredPaymentTypes =
  (clientId, fileFormatId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const accessURL = `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/payment-type/client/${clientId}`;
      const response = await axios({
        url: accessURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({ fileFormatId }),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'UPDATE_RTP_IMPORT_SUCCESS',
        });
        return true;
      }
      dispatch({
        type: 'UPDATE_RTP_IMPORT_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'UPDATE_RTP_IMPORT_FAILED',
        payload: error.message || 'An error has occurred.',
      });
      return false;
    }
  };
export const fetchUSBankCheckData = (clientId) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const accessURL = `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/clients/${clientId}/check-account`;
    const response = await axios({
      url: accessURL,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: 'FETCH_USBANK_CHECK_DATA_SUCCESS',
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: 'FETCH_USBANK_CHECK_DATA_FAILED',
      payload: responseBody.message || 'Oops! Something went wrong.',
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_USBANK_CHECK_DATA_FAILED',
      payload: error.message || 'An error has occurred.',
    });
    return false;
  }
};

export const createUSBankCheckData = (data, clientId) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v2/b2c/clients/${clientId}/check-account`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        zellePayFromAccountNumber:
          data.zellePayFromAccountNumber.toString() || null,
        zellePriorityType: data.zellePriorityType || null,
        zellePayerId: data.zellePayerId || null,
        enableCheckToZelleEnrolledPayees:
          data.enableCheckToZelleEnrolledPayees ?? false,
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: 'USBANK_ADD_CHECK_SUCCESS',
        payload: responseBody,
      });
      return true;
    }
    dispatch({
      type: 'USBANK_ADD_CHECK_FAILED',
      payload: responseBody.message || 'Oops! Something went wrong.',
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'USBANK_ADD_CHECK_FAILED',
      payload: error.message || 'An error has occurred.',
    });
    return false;
  }
};

export const updateUSBankCheckData = (data, clientId) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v2/b2c/clients/${clientId}/check-account`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        id: data.id,
        zellePayFromAccountNumber:
          data.zellePayFromAccountNumber.toString() || null,
        zellePriorityType: data.zellePriorityType || null,
        zellePayerId: data.zellePayerId || null,
        enableCheckToZelleEnrolledPayees:
          data.enableCheckToZelleEnrolledPayees ?? false,
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: 'USBANK_ADD_CHECK_SUCCESS',
        payload: responseBody,
      });
      return true;
    }
    dispatch({
      type: 'USBANK_ADD_CHECK_FAILED',
      payload: responseBody.message || 'Oops! Something went wrong.',
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'USBANK_ADD_CHECK_FAILED',
      payload: error.message || 'An error has occurred.',
    });
    return false;
  }
};

export const uploadPrepaidCardFiles = (formData) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    return axios
      .post(
        `${config.apiBase}/client-config-service/v2/b2c/upload-prepaid-card-files`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
            pragma: 'no-cache',
          },
        }
      )
      .then(function (response) {
        if (response.status >= 400) {
          return { error: true, message: response.statusText };
        }
        return response.data;
      })
      .catch(function () {
        console.log('FAILURE!!');
      });
  } catch (error) {
    return error;
  }
};

export const createUsBankPrepaidCard =
  (data, clientId, achAccountId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase}/client-config-service/v2/b2c/clients/${clientId}/reliafocus-card-accounts`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          paymentTypeId: data.paymentTypeId || undefined,
          transId: data.transId || undefined,
          cardType: data.cardType || null,
          certificateCardId: data.certificateCardId || undefined,
          certificateCardPasscode: data.certificateCardPasscode || undefined,
          isName: Boolean(data.isName) || false,
          isEmail: Boolean(data.isEmail) || false,
          isSsn: Boolean(data.isSsn) || false,
          isDateOfBirth: Boolean(data.isDateOfBirth) || false,
          isAddress: Boolean(data.isAddress) || false,
          isMobilePhone: Boolean(data.isMobilePhone) || false,
          isHomePhone: Boolean(data.isHomePhone) || false,
          isEmployeeState: Boolean(data.isEmployeeState) || false,
          isUniqueId: Boolean(data.isUniqueId) || false,
          isGovLocation: Boolean(data.isGovLocation) || false,
          govIdTypeId: data.govIdTypeId || null,
          addThankYouNote: data.addThankYouNote || null,
          addPredisclosureText: data.addPredisclosureText || null,
          addVerbiageText: data.addVerbiageText || null,  
          cardUploadImageName: data.cardUploadImageName || null,
          ndaFileNames: data.ndaFileNames || null,
          clientDebitAccountId: achAccountId || null,
        }),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'USBANK_ADD_PREPAID_CARD_SUCCESS',
          payload: responseBody,
        });
        return true;
      }
      dispatch({
        type: 'USBANK_ADD_PREPAID_CARD_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'USBANK_ADD_PREPAID_CARD_FAILED',
        payload: error.message || 'An error has occurred.',
      });
      return false;
    }
  };

export const updateUSBankPrepaidCard =
  (data, clientId, achAccountId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase}/client-config-service/v2/b2c/clients/${clientId}/reliafocus-card-accounts`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          reliaFocusId: data.reliaFocusId || undefined,
          registrationId: data.registrationId || undefined,
          cardType: data.cardType || null,
          paymentTypeId: data.paymentTypeId || undefined,
          certificateCardId: data.certificateCardId || undefined,
          certificateCardPasscode: data.certificateCardPasscode || undefined,
          isName: Boolean(data.isName) || false,
          isEmail: Boolean(data.isEmail) || false,
          isSsn: Boolean(data.isSsn) || false,
          isDateOfBirth: Boolean(data.isDateOfBirth) || false,
          isAddress: Boolean(data.isAddress) || false,
          isMobilePhone: Boolean(data.isMobilePhone) || false,
          isHomePhone: Boolean(data.isHomePhone) || false,
          isEmployeeState: Boolean(data.isEmployeeState) || false,
          isUniqueId: Boolean(data.isUniqueId) || false,
          isGovLocation: Boolean(data.isGovLocation) || false,
          govIdTypeId: data.govIdTypeId || null,
          addThankYouNote: data.addThankYouNote || null,
          addPredisclosureText: data.addPredisclosureText || null,
          addVerbiageText: data.addVerbiageText || null,
          cardUploadImageName: data.cardUploadImageName || null,
          ndaFileNames: data.ndaFileNames || null,
          clientDebitAccountId: achAccountId || null,
        }),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'USBANK_ADD_PREPAID_CARD_SUCCESS',
          payload: responseBody,
        });
        return true;
      }
      dispatch({
        type: 'USBANK_ADD_PREPAID_CARD_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'USBANK_ADD_PREPAID_CARD_FAILED',
        payload: error.message || 'An error has occurred.',
      });
      return false;
    }
  };

export const fetchUSBankPrepaidCardData = (clientId) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const accessURL = `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/clients/${clientId}/prepaid-card-accounts`;
    const response = await axios({
      url: accessURL,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: 'FETCH_USBANK_PREPAID_CARD_DATA_SUCCESS',
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: 'FETCH_USBANK_PREPAID_CARD_DATA_FAILED',
      payload: responseBody.message || 'Oops! Something went wrong.',
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_USBANK_PREPAID_CARD_DATA_FAILED',
      payload: error.message || 'An error has occurred.',
    });
    return false;
  }
};

export const fetchReliaFocusCardParams = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v2/b2c/reliafocus-card-params`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: 'FETCH_RELIA_FOCUS_CARD_PARAMS_SUCCESS',
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: 'FETCH_RELIA_FOCUS_CARD_PARAMS_FAILED',
      payload: responseBody.message || 'Oops! Something went wrong.',
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_RELIA_FOCUS_CARD_PARAMS_FAILED',
      payload: error.message || 'An error has occurred.',
    });
    return false;
  }
};

export const createUsBankCorporateCard =
  (data, clientId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase}/client-config-service/v2/b2c/clients/${clientId}/corporate-reward-card-accounts`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify(data),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'USBANK_ADD_CORPORATE_CARD_SUCCESS',
          payload: responseBody,
        });
        return true;
      }
      dispatch({
        type: 'USBANK_ADD_CORPORATE_CARD_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'USBANK_ADD_CORPORATE_CARD_FAILED',
        payload: error.message || 'An error has occurred.',
      });
      return false;
    }
  };

export const updateUsBankCorporateCard =
  (data, clientId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase}/client-config-service/v2/b2c/clients/${clientId}/corporate-reward-card-accounts`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify(data),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'USBANK_ADD_CORPORATE_CARD_SUCCESS',
          payload: responseBody,
        });
        return true;
      }
      dispatch({
        type: 'USBANK_ADD_CORPORATE_CARD_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'USBANK_ADD_CORPORATE_CARD_FAILED',
        payload: error.message || 'An error has occurred.',
      });
      return false;
    }
  };

export const fetchUSBankChildBankAccountsList =
  (clientID, paymentType) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/clients/${clientID}/bank-accounts?type=${paymentType}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_US_BANK_CHILD_ACH_ACCOUNT_LIST_SUCCESS',
          payload: responseBody.data,
        });
        return true;
      }
      dispatch({
        type: 'FETCH_US_BANK_CHILD_ACH_ACCOUNT_LIST_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_US_BANK_CHILD_ACH_ACCOUNT_LIST_FAILED',
        payload: error.message || 'An error has occurred.',
      });
      return false;
    }
  };

export const fetchUSBankBankAccountsList =
  (clientID, paymentType) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/clients/${clientID}/bank-accounts?type=${paymentType}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_US_BANK_ACH_ACCOUNT_LIST_SUCCESS',
          payload: responseBody.data,
        });
        return true;
      }
      dispatch({
        type: 'FETCH_US_BANK_ACH_ACCOUNT_LIST_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_US_BANK_CHILD_ACH_ACCOUNT_LIST_FAILED',
        payload: error.message || 'An error has occurred.',
      });
      return false;
    }
  };

export const fetchUSBankAchProfilesInformation = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/bank-account/ach-profile?bankId=2`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: 'FETCH_US_BANK_ACH_PROFILE_INFO_SUCCESS',
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: 'FETCH_US_BANK_ACH_PROFILE_INFO_FAILED',
      payload: responseBody.message || 'Oops! Something went wrong.',
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_US_BANK_ACH_PROFILE_INFO_FAILED',
      payload: error.message || 'An error has occurred.',
    });
    return false;
  }
};
