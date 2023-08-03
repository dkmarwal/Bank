import axios from 'axios';
import Cookies from 'universal-cookie';
import config from '~/config';
import { getAccessToken } from '~/redux/helpers/user';

axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    // Do something with response error
    if (error.response.status == 401) {
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

export const getUSbankDeposittodebitData = (clientID) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v2/b2c/clients/${clientID}/ddc-accounts`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    return response.data.data;
  } catch (error) {
    return error.response.data;
  }
};
export const addUSbankDeposittodebit = (data, clientId) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v2/b2c/clients/${data.clientId}/ddc-accounts`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        ddcSSLMerchantId: data.bankDetail.ddcSSLMerchantId || null,
        ddcTransactionType: data.bankDetail.ddcTransactionType || null,
        ddcConvergeUserId: data.bankDetail.ddcConvergeUserId || null,
        ddcSSLUserId: data.bankDetail.ddcSSLUserId || null,
        ddcSSLPin: data.bankDetail.ddcSSLPin || null,
      }),
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const updateUSbankDeposittodebit =
  (data, clientId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase}/client-config-service/v2/b2c/clients/${data.clientId}/ddc-accounts`,

        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          id: data.bankDetail.id || null,
          ddcSSLMerchantId: data.bankDetail.ddcSSLMerchantId || null,
          ddcTransactionType: data.bankDetail.ddcTransactionType || null,
          ddcConvergeUserId: data.bankDetail.ddcConvergeUserId || null,
          ddcSSLUserId: data.bankDetail.ddcSSLUserId || null,
          ddcSSLPin: data.bankDetail.ddcSSLPin || null,
        }),
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };

export const USbankGetBankData = async (clientID, paymentType) => {
  try {
    const accessToken = await getAccessToken();
    const accessURL = `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/clients/${clientID}/bank-accounts?type=${paymentType}`;
    const response = await axios({
      url: accessURL,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return;
  }
};

export const USbankupdateBankInfo =
  ({ clientId, bankDetail }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const accessURL = `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/clients/${clientId}/bank-accounts`;
      const response = await axios({
        url: accessURL,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          accountId: bankDetail?.accountId || null,
          immediateDestinationName:bankDetail?.immediateDestinationName || null,
          accountName: bankDetail?.accountName || null,
          accountNumber: bankDetail?.accountNumber || null,
          routingCode: bankDetail?.routingCode || null,
          companyName: bankDetail?.companyName || null,
          companyIdentification: bankDetail?.companyIdentification || null,
          companyEntryDescription: bankDetail?.companyEntryDescription || null,
          companyDiscretionaryData: bankDetail?.companyDiscretionaryData || null,
          originatingDFIIdentification:
            bankDetail?.originatingDFIIdentification || null,
            originatingDFIDiscretionaryData: bankDetail?.originatingDFIDiscretionaryData || null,
          type: bankDetail?.type || null,
          immediateDestination: bankDetail?.immediateDestination || null,
          immediateOrigin: bankDetail?.immediateOrigin || null,
          immediateOriginName: bankDetail?.immediateOriginName || null,
          currencyCode: bankDetail?.currencyCode || null
        }),
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };

export const USbankcreateBankInfo =
  ({ clientId, bankDetail }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const accessURL = `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/clients/${clientId}/bank-accounts`;
      const response = await axios({
        url: accessURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          immediateDestinationName:bankDetail?.immediateDestinationName || null,
          accountName: bankDetail?.accountName || null,
          accountNumber: bankDetail?.accountNumber || null,
          routingCode: bankDetail?.routingCode || null,
          companyName: bankDetail?.companyName || null,
          companyIdentification: bankDetail?.companyIdentification || null,
          companyEntryDescription: bankDetail?.companyEntryDescription || null,
          companyDiscretionaryData: bankDetail?.companyDiscretionaryData || null,
          originatingDFIIdentification:
            bankDetail?.originatingDFIIdentification || null,
            originatingDFIDiscretionaryData: bankDetail?.originatingDFIDiscretionaryData || null,
          type: bankDetail?.type || null,
          immediateDestination: bankDetail?.immediateDestination || null,
          immediateOrigin: bankDetail?.immediateOrigin || null,
          immediateOriginName: bankDetail?.immediateOriginName || null,
          currencyCode: bankDetail?.currencyCode || null
        }),
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };

/* US Bank RTP Methods */
export const UsbankachProfilesInformation = async () => {
  try {
    const accessToken = await getAccessToken()
    const accessURL =//`${config.apiBase}/client-config-service/v1/b2c/bank-account/ach-profile`
    `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/bank-account/ach-profile?bankId=2`
    const response = await axios({
      url: accessURL,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
export const USBankcreateRtpData =
  ({ bankDetail, clientId }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/clients/${clientId}/rtp-accounts`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          rtpAccountNumber: bankDetail.rtpAccountNumber || '',
          rtpRoutingCode: bankDetail.rtpRoutingCode || '',
        }),
      });

      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };

export const USBankupdatedRTPData =
  ({ id, bankDetail, clientId }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/clients/${clientId}/rtp-accounts`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          id: bankDetail.id.toString() || '',
          rtpAccountNumber: bankDetail.rtpAccountNumber || '',
          rtpRoutingCode: bankDetail.rtpRoutingCode || '',
        }),
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };

export const USBankGetRTPData = async (clientID, paymentType) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/clients/${clientID}/rtp-accounts`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const fetchUSBankRtpList =
  (clientID, paymentType) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/clients/${clientID}/rtp-accounts`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
      });

      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };

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
      return response.data;
    } catch (error) {
      return error.response.data;
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
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };

export const downloadPrepaidCardFiles = (fileName) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/download-prepaid-card-files/${fileName}`,
      method: 'GET',
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    return response;
  } catch (error) {
    return false;
  }
};
