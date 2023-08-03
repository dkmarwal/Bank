import axios from "axios";
import Cookies from "universal-cookie";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";
const cookies = new Cookies(window.document.cookie);

axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response;
}, function (error) {
  // Do something with response error
  if (error.response.status == 401) {
      cookies.remove('@accessToken', { path: `${config.baseName}/` });
      cookies.remove('@refreshToken', { path: `${config.baseName}/` });
      cookies.remove('@portalTypeId', { path: `${config.baseName}/` });
      cookies.remove('@userId', { path: `${config.baseName}/` });
      window.location.href = `${config.baseName}/sessionout`;
  }
  return error.response;
});

export const fetchCompanyData = async ({ clientId }) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-service/v1/client/${clientId}/details`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const fetchParentCompanyData = async ({ clientId }) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-service/v1/client/${clientId}/details?hasParent=true`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const fetchLocationsList = async () => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-service/${config.apiVersion}/client/location/type`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const fetchSecurityQuestions = async () => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/user-service/v1/securityQuestions?portalTypeId=1`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const updateCompanyData = async ({ clientId, data }) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-service/v1/client/${clientId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
       data: JSON.stringify({
        countryCode: data.countryCode || null,
        phoneNumber: data.phoneNumber || null,
        fax: data.fax || null,
        website: data.website || null,
        duns: data.duns || null,
        locationTypeId: data.locationTypeId || null,
        phoneExt: data.phoneExt || null,
        address1: data.address1 || null,
        address2: null,
        city: data.city || null,
        countryIso: data.countryIso || null,
        stateRegion: data.stateRegion || null,
        zipPostal: data.zipPostal || null
      }),
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const createUserInfo = async ({
  portalTypeId,
  portalProfileId,
  data,
}) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-service/v1/user?portalTypeId=${portalTypeId}&portalProfileId=${portalProfileId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        title: data.title || "Mr",
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        userName: (!data.isSSO && data.userName) || undefined,
        password: (!data.isSSO && data.password) || undefined,
        isSSO: data.isSSO || false,
        SSOUserId: data.SSOUserId || undefined,
        phoneCountryCode: data.phoneCountryCode || null,
        phone: data.phone || null,
        email: data.email || null,
        isFirstUser: data.isFirstUser || false
      }),
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const fetchB2CCompanyData = async ({ clientId }) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-service/${config.apiVersion}/b2c/client/${clientId}/details`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const fetchB2CParentCompanyData = async ({ clientId }) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-service/${config.apiVersion}/b2c/client/${clientId}/details?hasParent=true`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const updateB2CCompanyData = async ({ clientId, data }) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-service/${config.apiVersion}/b2c/client/${clientId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        countryCode: data.countryCode || null,
        phoneNumber: data.phoneNumber || null,
        fax: data.fax || null,
        website: data.website || null,
        duns: data.duns || null,
        locationTypeId: data.locationTypeId || null,
        phoneExt: data.phoneExt || null,
        address1: data.address1 || null,
        address2: null,
        city: data.city || null,
        countryIso: data.countryIso || null,
        stateRegion: data.stateRegion || null,
        zipPostal: data.zipPostal || null
      }),
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const createB2CUserInfo = async ({
  portalTypeId,
  portalProfileId,
  data,
}) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-service/${config.apiVersion}/b2c/user?portalTypeId=${portalTypeId}&portalProfileId=${portalProfileId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        title: data.title || "Mr",
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        userName: !data.isSSO && data.userName || undefined,
        password: !data.isSSO && data.password || undefined,
        isSSO: data.isSSO || false,
        SSOUserId: data.SSOUserId || undefined,
        phoneCountryCode: data.phoneCountryCode || null,
        phone: data.phone || null,
        email: data.email || null,
        isFirstUser: data.isFirstUser || false
      }),
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};