import axios from "axios";
import Cookies from "universal-cookie";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";

axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response;
}, function (error) {
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
});

export const fetchFileType = async ({ isHippa, clientId }) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/file/types?isHippa=${isHippa}&clientId=${clientId}`,
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

export const fetchSelectedFileType = async ({ clientId }) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/file?clientId=${clientId}`,
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

export const fetchPaymentMethods = async ({ clientId }) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/payment-type/client/${clientId}`,
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

export const fetchNamingConvention = async ({ clientId }) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/file/naming/convention?clientId=${clientId}`,
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

export const fetchIncomingFileSettings = async ({ clientId }) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/file/incoming/setting?clientId=${clientId}`,
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

export const fetchResponseFileSettings = async ({ clientId }) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/file/response/setting?clientId=${clientId}`,
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

export const updateIncomingFileSettings = async ({ clientId, data }) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/file/incoming/setting?clientId=${clientId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};
export const updateResponseFileSettings = async ({ clientId, data }) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/file/response/setting?clientId=${clientId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};
export const updatePaymentFileTypes = async ({ clientId, data }) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/file/?clientId=${clientId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};


/* B2C APis */

export const b2cFetchFileTypes = async () => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/b2c/file/types`,
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

export const b2cFetchSelectedFileTypes = async (id, flag) => {
  try {
    const accessToken = await getAccessToken();
    const linkURL = flag ? `${config.apiBase}/client-config-service/v1/b2c/file?clientId=${id}&isOnboarding=1` : `${config.apiBase}/client-config-service/v1/b2c/file?clientId=${id}`;
    const response = await axios({
      url: linkURL,
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

export const b2cFetchNamingConvention = async (id, flag) => {
  try {
    const accessToken = await getAccessToken();
    const linkURL = flag ? `${config.apiBase}/client-config-service/v1/b2c/file/naming/convention?clientId=${id}&isOnboarding=1` :
      `${config.apiBase}/client-config-service/v1/b2c/file/naming/convention?clientId=${id}`;
    const response = await axios({
      url: linkURL,
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

export const b2cUpdatePaymentFileTypes = async (clientId, data) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/b2c/file?clientId=${clientId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const b2cUpdateFileTypes = async (id, data) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/b2c/file/naming/convention?clientId=${id}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const fetchCampaignInfo = async (id, flag) => {
  try {
    const accessToken = await getAccessToken();
    const linkURL = flag ? `${config.apiBase}/client-config-service/v1/b2c/campaign/getFileConfiguration?clientId=${id}&isOnboarding=1`
      : `${config.apiBase}/client-config-service/v1/b2c/campaign/getFileConfiguration?clientId=${id}`
    const response = await axios({
      url: linkURL,
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

export const addCampaignFile = async (data) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/b2c/campaign/updateFileConfiguration`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};


export const getB2CGeneralSettingConfig = async (id, flag) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/b2c/general/profile/configuration?clientId=${id}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message: error.response && error.response.data.message,
      data: { rows: [] },
      error: true
    };
  }
};

export const saveB2CPermissionsData = async (payload, clientId) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/b2c/general/profile/configuration?clientId=${clientId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(payload)
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message: error.response && error.response.data.message,
      data: { rows: [] },
      error: true
    };
  }
};