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

export const getIndustryGroupList = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-service/v1/group/list`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getParentClientList = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-service/v1/parent/list`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getCardTypeList = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/payer/type/list`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getB2CIndustryGroupList = async () => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-service/${config.apiVersion}/b2c/group/list`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        return response.data;
    } catch (error) {
        return [];
    }
}

export const getB2CParentClientList = async () => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-service/${config.apiVersion}/b2c/parent/list`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        return response.data;
    } catch (error) {
        return [];
    }
}

export const createClientProfile = async (data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-service/v1/enrollment`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        clientName: data.clientName || null,
        countryCode: data.countryCode || null,
        deletePreviousRecord: data.deletePreviousRecord,
        emailAddress:data.emailAddress || null,
        groupId: data.groupId,
        isHippa:data.isHippa,
        parentId: data.parentId || null,
        phoneExt: data.phoneExt || null,
        phoneNumber: data.phoneNumber || null,
        taxId: data.taxId || null,
        taxIdIsSSN:data.taxIdIsSSN,
        payerTypeId: data.payerTypeId,
        identificationType: data.identificationType || null
      }),
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const createB2CClientProfile = async (data) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-service/${config.apiVersion}/b2c/enrollment`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data)
    })
    return response.data;
  } catch (error) {
    return error.response.data;
  }

}