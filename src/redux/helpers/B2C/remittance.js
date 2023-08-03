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

export const getB2CRemittanceConfigRule = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/remittance/details`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    if (response && response.data) {
      return response.data;
    }
    return {
      error: true,
      message: 'Response format not recognized',
    };
  } catch (error) {
    return {
      error: true,
      message: 'Server Exception Error',
    };
  }
};

export const getB2CRemittanceParams = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/remittance/information?clientId=${clientId}&isOnboarding=1`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getB2CClientRemConfig = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/remittance/configurations?clientId=${clientId}&isOnboarding=1`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    if (response && response.data) {
      return response.data;
    }
    return {
      error: true,
      message: 'Response format not recognized',
    };
  } catch (error) {
    return {
      error: true,
      message: 'Server Exception Error',
    };
  }
};

export const updateB2CRemittanceParams = async (data) => {
  const {
    clientId,
    isPaymentId,
    isPaymentType,
    isValueDate,
    isPaymentReference,
    isAmount,
    isAmountPaid,
    isClientName,
    isPayeeName,
    isPaymentDate,
    isNotes,
    isClientPhoneNumber,
    isClientEmailAddress
  } = data;

  const postData = {
    clientId,
    isPaymentId,
    isPaymentType,
    isValueDate,
    isPaymentReference,
    isAmount,
    isAmountPaid,
    isClientName,
    isPayeeName,
    isPaymentDate,
    isNotes,
    isClientPhoneNumber,
    isClientEmailAddress
  };

  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/remittance/parameters`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: postData,
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const updateB2CRemittanceConfig = async (clientId, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/remittance/configurations?clientId=${clientId}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: data,
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

/*Onboarded API */

export const postB2CClientMailCall = async (data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/successful/onboardingEmail`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: data,
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getRemittanceSettingShow = async(clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/remittance/setting?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return { ...error.response.data };
  }
}

export const updateRemittanceSettingShow = async(data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/remittance/setting`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data
    });
    return response.data;
  } catch (error) {
    return { ...error.response.data };
  }
}


/* Remiitance systems api */

export const fetchRemittanceScheme = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/${config.apiVersion}/remittance/scheme`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const getClientRemScheme = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/${config.apiVersion}/clients/remittance/scheme?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const saveClientRemScheme = async (clientId,data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/${config.apiVersion}/clients/remittance/scheme?clientId=${clientId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data:{
        remittanceSchemeId :data
      }
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};