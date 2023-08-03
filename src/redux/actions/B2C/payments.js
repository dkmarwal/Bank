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

export const getB2CPaymentTypes = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
        // const urlVersion = config.apiVersion === 'v2' ? `/${config.apiVersion}` : ''
    const accessURL = //`${config.apiBase}/client-config-service/v1/b2c/payment-type/list`
        `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/payment-type/list`
     
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
        type: 'FETCH_B2C_PAYMENT_TYPES_SUCCESS',
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: 'FETCH_B2C_PAYMENT_TYPES_FAILED',
      payload: responseBody.message || 'Oops! Something went wrong.',
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_B2C_PAYMENT_TYPES_FAILED',
      payload: error.message || 'An error has occurred.',
    });
    return false;
  }
};

export const addPushToCard =
  (stateData, clientID, settlementAccountId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase}/client-config-service/v1/b2c/client/onboarding/push-card-account`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          clientId: clientID,
          partnerId: stateData.partnerId || null,
          masterMerchantCatCode: stateData.masterMerchantCatCode || null,
          visaMerchantCatCode: stateData.visaMerchantCatCode || null,
          visaAcceptorId: stateData.visaAcceptorId || null,
          masterCardAcceptorId: stateData.masterCardAcceptorId || null,
          paymentType: stateData.paymentType || null,
          senderAccount: stateData.senderAccount || null,
          senderFirstName: stateData.senderFirstName || null,
          senderLastName: stateData.senderLastName || null,
          senderAddressLine1: stateData.senderAddressLine1 || null,
          senderAddressLine2: stateData.senderAddressLine2 || null,
          senderCity: stateData.senderCity || null,
          senderState: stateData.senderState || null,
          senderZip:
            Boolean(stateData.senderZip) && Boolean(stateData.senderZip.trim())
              ? stateData.senderZip
              : null,
          senderCountryCode: stateData.senderCountryCode || null,
          senderContactEmail: stateData.senderContactEmail || null,
          senderPhone: stateData.senderPhone || null,
          senderPhoneExt: stateData.senderPhoneExt || null,
          clientPrefix: stateData.clientPrefix || null,
          title: stateData.title || null,
          countryPhoneCode: stateData.countryPhoneCode || null,
          settlementAccountId: settlementAccountId,
        }),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_B2C_PUSHTOCARD_SUCCESS',
          payload: responseBody.data,
        });
        return responseBody;
      }

      dispatch({
        type: 'FETCH_B2C_PUSHTOCARD_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return responseBody.error;
    } catch (error) {
      dispatch({
        type: 'FETCH_B2C_PUSHTOCARD_FAILED',
        payload: error.message || 'An error has occurred.',
      });
      return error;
    }
  };

export const getPushToCardData = (clientID) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/b2c/client/push-card-account?clientId=${clientID}`,
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
        type: 'FETCH_B2C_GETPUSHTOCARD_SUCCESS',
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: 'FETCH_B2C_GETPUSHTOCARD_FAILED',
      payload: responseBody.message || 'Oops! Something went wrong.',
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_B2C_GETPUSHTOCARD_FAILED',
      payload: error.message || 'An error has occurred.',
    });
    return false;
  }
};

export const updatePushToCardData =
  (stateData, clientID, settlementAccountId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase}/client-config-service/v1/b2c/client/onboarding/push-card-account`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          id: stateData.id,
          clientId: clientID,
          partnerId: stateData.partnerId || null,
          masterMerchantCatCode: stateData.masterMerchantCatCode || null,
          visaMerchantCatCode: stateData.visaMerchantCatCode || null,
          visaAcceptorId: stateData.visaAcceptorId || null,
          masterCardAcceptorId: stateData.masterCardAcceptorId || null,
          paymentType: stateData.paymentType || null,
          senderAccount: stateData.senderAccount || null,
          senderFirstName: stateData.senderFirstName || null,
          senderLastName: stateData.senderLastName || null,
          senderAddressLine1: stateData.senderAddressLine1 || null,
          senderAddressLine2: stateData.senderAddressLine2 || null,
          senderCity: stateData.senderCity || null,
          senderState: stateData.senderState || null,
          senderZip:
            Boolean(stateData.senderZip) && Boolean(stateData.senderZip.trim())
              ? stateData.senderZip
              : null,
          senderCountryCode: stateData.senderCountryCode || null,
          senderContactEmail: stateData.senderContactEmail || null,
          senderPhone: stateData.senderPhone || null,
          senderPhoneExt: stateData.senderPhoneExt || null,
          clientPrefix: stateData.clientPrefix || null,
          title: stateData.title || null,
          countryPhoneCode: stateData.countryPhoneCode || null,
          settlementAccountId: settlementAccountId ,
        }),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_B2C_UPDATEPUSHTOCARD_SUCCESS',
          payload: responseBody.data,
        });
        return true;
      }
      dispatch({
        type: 'FETCH_B2C_UPDATEPUSHTOCARD_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_B2C_UPDATEPUSHTOCARD_FAILED',
        payload: error.message || 'An error has occurred.',
      });
      return false;
    }
  };

export const updatePreferredPaymentTypes =
  (clientId, fileFormatId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const accessURL =  `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/payment-type/client/${clientId}`
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
          type: 'PREFERRED_PAYMENT_TYPE_UPDATE_SUCCESS',
        });
        return true;
      }
      dispatch({
        type: 'PREFERRED_PAYMENT_TYPE_UPDATE_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'PREFERRED_PAYMENT_TYPE_UPDATE_FAILED',
        payload: error.message || 'An error has occurred.',
      });
      return false;
    }
  };
  
  export const updatePreferredUSbankPaymentTypes =
  (clientId, fileFormatId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const accessURL =`${config.apiBase}/client-config-service/${config.apiVersion}/b2c/payment-type/client/${clientId}`
      const response = await axios({
        url: accessURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({ selectedPaymentTypes:fileFormatId }),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'PREFERRED_PAYMENT_TYPE_UPDATE_SUCCESS',
        });
        return true;
      }
      dispatch({
        type: 'PREFERRED_PAYMENT_TYPE_UPDATE_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'PREFERRED_PAYMENT_TYPE_UPDATE_FAILED',
        payload: error.message || 'An error has occurred.',
      });
      return false;
    }
  };

export const getPreferredClientPaymentTypes =
  (clientId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const accessURL = //`${config.apiBase}/client-config-service/v1/b2c/payment-type/client/${clientId}`
      `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/payment-type/client/${clientId}`
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
          type: 'FETCH_PREFERRED_PAYMENT_TYPE_SUCCESS',
          payload: responseBody.data,
        });
        return responseBody.data;
      }
      dispatch({
        type: 'FETCH_PREFERRED_PAYMENT_TYPE_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_PREFERRED_PAYMENT_TYPE_FAILED',
        payload: error.message || 'An error has occurred.',
      });
      return false;
    }
  };

export const createB2CPaypalInfo =
  ({ payPalDetails }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase}/client-config-service/v1/b2c/client/b2c-onboarding/paypal-account`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          worldlinkId: payPalDetails.worldlinkId || null,
          senderAccountNumber: payPalDetails.senderAccountNumber || null,
          clientBIC: payPalDetails.clientBIC || null,
          senderName: payPalDetails.senderName || null,
          senderAddressLine1: payPalDetails.senderAddressLine1 || null,
          senderAddressLine2: payPalDetails.senderAddressLine2 || null,
          senderCity: payPalDetails.senderCity || null,
          senderState: payPalDetails.senderState || null,
          senderZIP: payPalDetails.senderZIP || null,
          senderCountryCode: payPalDetails.senderCountryCode || null,
          senderPhone: payPalDetails.senderPhone || null,
          senderPhoneExt: payPalDetails.senderPhoneExt || null,
          senderContactEmail: payPalDetails.senderContactEmail || null,
          clientId: payPalDetails.clientId || null,
          countryPhoneCode: payPalDetails.countryPhoneCode || null,
          title: payPalDetails.title || null,
        }),
      });
      const responseBody = await response.data;
      if (!responseBody.error) {
        dispatch({
          type: 'ADD_PAYPAL_DETAIL_SUCCESS',
          payload: {
            ...payPalDetails,
            accountId:
              (responseBody.data && responseBody.data.accountId) || null,
          },
        });
      }
      dispatch({
        type: 'ADD_PAYPAL_DETAIL_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return responseBody;
      // return false;
    } catch (error) {
      dispatch({
        type: 'ADD_PAYPAL_DETAIL_FAILED',
        payload: error.message || 'An error has occurred.',
      });
      return error;
    }
  };

export const getPayPalAccountDetails =
  ({ clientId }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase}/client-config-service/v1/b2c/client/paypal-account?clientId=${clientId}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
      });
      const { error, message, data } = await response.data;
      if (!error) {
        dispatch({
          type: 'FETCH_PAYPAL_DETAIL_SUCCESS',
          payload: data || null,
        });
        return data;
      }
      dispatch({
        type: 'FETCH_PAYPAL_DETAIL_FAILED',
        payload: message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_PAYPAL_DETAIL_FAILED',
        payload:
          (error.response && error.response.message) ||
          'An error has occurred.',
      });
      return false;
    }
  };

export const updatePayPalAccountDetails =
  ({ payPalDetail }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase}/client-config-service/v1/b2c/client/b2c-onboarding/paypal-account`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          worldlinkId: payPalDetail.worldlinkId || null,
          senderAccountNumber: payPalDetail.senderAccountNumber || null,
          clientBIC: payPalDetail.clientBIC || null,
          senderName: payPalDetail.senderName || null,
          senderAddressLine1: payPalDetail.senderAddressLine1 || null,
          senderAddressLine2: payPalDetail.senderAddressLine2 || null,
          senderCity: payPalDetail.senderCity || null,
          senderState: payPalDetail.senderState || null,
          senderZIP: payPalDetail.senderZIP || null,
          senderCountryCode: payPalDetail.senderCountryCode || null,
          senderPhone: payPalDetail.senderPhone || null,
          senderPhoneExt: payPalDetail.senderPhoneExt || null,
          senderContactEmail: payPalDetail.senderContactEmail || null,
          clientId: payPalDetail.clientId || null,
          countryPhoneCode: payPalDetail.countryPhoneCode || null,
          title: payPalDetail.title || null,
          accountId: payPalDetail.accountId || null,
        }),
      });
      const responseBody = await response.data;
      if (!responseBody.error) {
        dispatch({
          type: 'PAYPAL_DETAIL_UPDATE_SUCCESS',
          payload: payPalDetail,
        });
        // return true;
      }
      dispatch({
        type: 'PAYPAL_DETAIL_UPDATE_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      // return false;
      return responseBody;
    } catch (error) {
      dispatch({
        type: 'PAYPAL_DETAIL_UPDATE_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          'An error has occurred.',
      });
      return error;
    }
  };

export const updateCheckDetail = (stateData, clientId) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/updateCheckInfo`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        clientId: clientId,
        ediInterchangeSenderId: stateData.ediInterchangeSenderId || null,
        ediInterchangeReceiverId: stateData.ediInterchangeReceiverId || null,
        ediGroupSenderId: stateData.ediGroupSenderId || null,
        ediGroupReceiverId: stateData.ediGroupReceiverId || null,
        originatingCompanyID: stateData.originatingCompanyID || null,
        originatingDFIIdentification: stateData.originatingDFIIdentification || null
      }),
    });
    const responseBody = await response.data;    
    if (responseBody.error === false) {
      dispatch({
        type: 'FETCH_B2C_UPDATECHECKDETAIL_SUCCESS',
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: 'FETCH_B2C_UPDATECHECKDETAIL_FAILED',
      payload: responseBody.message || 'Oops! Something went wrong.',
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_B2C_UPDATECHECKDETAIL_FAILED',
      payload:
        (error.response && error.response.message) ||
        error.message ||
        'An error has occurred.',
    });
    return false;
  }
};

export const addCheckDetail = (stateData, clientId) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/addCheckInfo`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        clientId: clientId,
        ediInterchangeSenderId: stateData.ediInterchangeSenderId || null,
        ediInterchangeReceiverId: stateData.ediInterchangeReceiverId || null,
        ediGroupSenderId: stateData.ediGroupSenderId || null,
        ediGroupReceiverId: stateData.ediGroupReceiverId || null,
        originatingCompanyID: stateData.originatingCompanyID || null,
        originatingDFIIdentification: stateData.originatingDFIIdentification || null
      }),
    });
    const responseBody = await response.data;    
    if (responseBody.error === false) {
      dispatch({
        type: 'FETCH_B2C_UPDATECHECKDETAIL_SUCCESS',
        payload: {
          ...stateData,
          checkId: (responseBody.data && responseBody.data.checkId) || null,
        },
      });
      return responseBody;
    }
    dispatch({
      type: 'FETCH_B2C_UPDATECHECKDETAIL_FAILED',
      payload: responseBody.message || 'Oops! Something went wrong.',
    });
    return responseBody.error;
  } catch (error) {
    dispatch({
      type: 'FETCH_B2C_UPDATECHECKDETAIL_FAILED',
      payload:
        (error.response && error.response.message) ||
        error.message ||
        'An error has occurred.',
    });
    return error;
  }
};

export const getCheckDetail = (clientId) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/getCheckInfo?clientId=${clientId}`,
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
        type: 'FETCH_B2C_GETCHECKDETAIL_SUCCESS',
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: 'FETCH_B2C_GETCHECKDETAIL_FAILED',
      payload: responseBody.message || 'Oops! Something went wrong.',
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_B2C_GETCHECKDETAIL_FAILED',
      payload:
        (error.response && error.response.message) ||
        error.message ||
        'An error has occurred.',
    });
    return false;
  }
};

export const getZelleData = (clientID, showParentData) => async (dispatch) => {
  try {
    const queryParamsUrl = showParentData
      ? `clientId=${clientID}&isOnboarding=1`
      : `clientId=${clientID}`;
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/b2c/zelle/information?${queryParamsUrl}`,
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

export const senderTypeList = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/b2c/zelle/sender/type`,
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
        type: 'FETCH_ZELLE_SENDER_SUCCESS',
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: 'FETCH_ZELLE_SENDER_FAILED',
      payload: responseBody.message || 'Oops! Something went wrong.',
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_ZELLE_SENDER_FAILED',
      payload: error.message || 'An error has occurred.',
    });
    return false;
  }
};

export const senderProductType = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/b2c/zelle/product/type`,
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
        type: 'FETCH_ZELLE_PRODUCT_TYPE_SUCCESS',
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: 'FETCH_ZELLE_PRODUCT_TYPE_FAILED',
      payload: responseBody.message || 'Oops! Something went wrong.',
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_ZELLE_PRODUCT_TYPE_FAILED',
      payload: error.message || 'An error has occurred.',
    });
    return false;
  }
};

export const addZelle =
  (data, clientId, settlementAccountId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase}/client-config-service/v1/b2c/zelle/addZelleInfo`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          clientId: clientId || null,
          senderType: data.senderType || null,
          senderName: data.senderName || null,
          address_line1: data.address_line1 || null,
          address_line2: data.address_line2 || null,
          city: data.city || null,
          state: data.state || null,
          zipcode: data.zipcode || null,
          countryCode: data.countryCode || null,
          productType: data.productType || null,
          debitNetwork: data.debitNetwork,
          secondaryDDA: data.secondaryDDA,
          visaIdCode: data.visaIdCode || null,
          visaMerchantCategoryCode: data.visaMerchantCategoryCode
            ? data.visaMerchantCategoryCode.toString()
            : null,
          businessIndicator: data.businessIndicator || null,
          merchantCategoryCode: data.merchantCategoryCode
            ? data.merchantCategoryCode.toString()
            : null,
          cardAcceptorId: data.cardAcceptorId || null,
          customerContact: data.customerContact || null,
          paymentType: data.paymentType || null,
          firstNameRiskScore: data.firstNameRiskScore || '00',
          lastNameRiskScore: data.lastNameRiskScore || '00',
          combinedRiskScore: data.combinedRiskScore || '00',
          senderPhone: data.senderPhone || null,
          senderEmail: data.senderEmail || null,
          payeeAcceptanceExpiryDays: data.payeeAcceptanceExpiryDays || null,
          allowRegisterViaZella: data.allowRegisterViaZella || 0,
          noOfDaysBeforeEnrolmentExpire:
            data.noOfDaysBeforeEnrolmentExpire || 0,
          isAuthorizeDebit: data.isAuthorizeDebit || 0,
          zelleTokenFromConsumer: data.zelleTokenFromConsumer || 0,
          settlementAccountId: settlementAccountId,
        }),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_ADD_ZELLE_SUCCESS',
          payload: {
            ...data,
            zelle_id: (responseBody.data && responseBody.data.zelle_id) || null,
          },
        });
        return responseBody.data;
      }
      dispatch({
        type: 'FETCH_ADD_ZELLE_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_ADD_ZELLE_FAILED',
        payload: error.message || 'An error has occurred.',
      });
      return false;
    }
  };

export const updateZelle =
  (data, clientId, settlementAccountId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase}/client-config-service/v1/b2c/zelle/updateZelleDetails`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          clientId: clientId || null,
          senderType: data.senderType || null,
          senderName: data.senderName || null,
          address_line1: data.address_line1 || null,
          address_line2: data.address_line2 || null,
          city: data.city || null,
          state: data.state || null,
          zipcode: data.zipcode || null,
          countryCode: data.countryCode || null,
          productType: data.productType || null,
          debitNetwork: data.debitNetwork,
          secondaryDDA: data.secondaryDDA,
          visaIdCode: data.visaIdCode || null,
          visaMerchantCategoryCode: data.visaMerchantCategoryCode
            ? data.visaMerchantCategoryCode.toString()
            : null,
          businessIndicator: data.businessIndicator || null,
          merchantCategoryCode: data.merchantCategoryCode
            ? data.merchantCategoryCode.toString()
            : null,
          cardAcceptorId: data.cardAcceptorId || null,
          customerContact: data.customerContact || null,
          paymentType: data.paymentType || null,
          firstNameRiskScore: data.firstNameRiskScore || '00',
          lastNameRiskScore: data.lastNameRiskScore || '00',
          combinedRiskScore: data.combinedRiskScore || '00',
          senderPhone: data.senderPhone || null,
          senderEmail: data.senderEmail || null,
          payeeAcceptanceExpiryDays: data.payeeAcceptanceExpiryDays || null,
          allowRegisterViaZella: data.allowRegisterViaZella || 0,
          noOfDaysBeforeEnrolmentExpire:
            data.noOfDaysBeforeEnrolmentExpire || 0,
          isAuthorizeDebit: data.isAuthorizeDebit || 0,
          zelleTokenFromConsumer: data.zelleTokenFromConsumer || 0,
          settlementAccountId: settlementAccountId,
        }),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_ADD_ZELLE_SUCCESS',
        });
        return true;
      }
      dispatch({
        type: 'FETCH_ADD_ZELLE_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_ADD_ZELLE_FAILED',
        payload: error.message || 'An error has occurred.',
      });
      return false;
    }
  };

export const fetchB2CachProfilesInformation = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/b2c/bank-account/ach-profile`,
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
        type: 'FETCH_B2C_ACH_PROFILE_INFO_SUCCESS',
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: 'FETCH_B2C_ACH_PROFILE_INFO_FAILED',
      payload: responseBody.message || 'Oops! Something went wrong.',
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_B2C_ACH_PROFILE_INFO_FAILED',
      payload: error.message || 'An error has occurred.',
    });
    return false;
  }
};

export const fetchB2CBankAccountsList =
  (clientID, paymentType) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const accessURL =//`${config.apiBase}/client-config-service/v1/b2c/bank-account/client/${clientID}?type=${paymentType}`
      `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/bank-account/client/${clientID}?type=${paymentType}`
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
          type: 'FETCH_B2C_ACH_ACCOUNT_LIST_SUCCESS',
          payload: responseBody.data,
        });
        return true;
      }
      dispatch({
        type: 'FETCH_B2C_ACH_ACCOUNT_LIST_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_B2C_ACH_ACCOUNT_LIST_FAILED',
        payload: error.message || 'An error has occurred.',
      });
      return false;
    }
  };

  export const fetchB2CChildBankAccountsList =   (clientID, paymentType) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      
      const response = await axios({
        url: `${config.apiBase}/client-config-service/v1/b2c/bank-account/client/${clientID}?type=${paymentType}`,
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
          type: 'FETCH_B2C_CHILD_ACH_ACCOUNT_LIST_SUCCESS',
          payload: responseBody.data,
        });
        return true;
      }
      dispatch({
        type: 'FETCH_B2C_CHILD_ACH_ACCOUNT_LIST_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_B2C_CHILD_ACH_ACCOUNT_LIST_FAILED',
        payload: error.message || 'An error has occurred.',
      });
      return false;
    }

  }
