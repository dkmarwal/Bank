import axios from "axios";
import config from "~/config";
import Cookies from "universal-cookie";
import { getAccessToken } from "~/redux/helpers/user";

axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    // Do something with response error
    if (error.response.status == 401) {
      let cookies = new Cookies();
      cookies.remove("@accessToken", { path: `${config.baseName}/` });
      cookies.remove("@refreshToken", { path: `${config.baseName}/` });
      cookies.remove("@portalTypeId", { path: `${config.baseName}/` });
      cookies.remove("@userId", { path: `${config.baseName}/` });
      window.location.href = `${config.baseName}/sessionout`;
    }
    return error.response;
  }
);

export const fetchPaymentCounts = async (payeeId, businessType) => {
  try {
    const accessToken = await getAccessToken();
    const urlVersion = config.apiVersion === 'v2' ? `/${config.apiVersion}` : ''
    const response = await axios({
      url: `${config.apiBase}/payment-service${urlVersion}/GetTotalPayments?clientID=${payeeId}&pastNoOfDays=30&BusinessType=${businessType}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
      data: { rows: [] },
      error: true,
    };
  }
};
export const fetchOnBoardedClients = async ({
  portalProfileId,
  filter,
  limit,
  offset,
  clientName,
  appType,
  sortOrder,
  groupId,
  paymentCode,
  payerTypeId,
  ...dateFilters
}) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-service/${config.apiVersion}/bank/portal/clients/list`,
      method: "POST",
      params: {
        bankId: portalProfileId,
        filter,
        limit,
        offset,
        clientName,
        appType,
        sortOrder,
        sortColumn: "clientName",
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify({
        groupId,
        paymentCode,
        payerTypeId
      }),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
      data: { rows: [] },
      error: true,
    };
  }
};

export const getKeyContactInfos = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-service/${config.apiVersion}/contact/information?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
      data: { rows: [] },
      error: true,
    };
  }
};

export const fetchClientsFilterChips = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-service/${config.apiVersion}/clients/filter/count`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
      data: { rows: [] },
      error: true,
    };
  }
};

export const fetchClientPortalTokens = async (clientId, appType, payerTypeId = 1) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/user-service/${config.apiVersion}/clients/portal/access?clientId=${clientId}&appType=${appType}&payerTypeId=${payerTypeId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
      data: { rows: [] },
      error: true,
    };
  }
};

export const fetchClientDetails = async ({ clientId }) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-service/${config.apiVersion}/company/information?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
      data: { rows: [] },
      error: true,
    };
  }
};

export const fetchCampaignCountsDetails = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/${config.apiVersion}/client/campaign-supplier/count?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
      data: { rows: [] },
      error: true,
    };
  }
};

export const fetchB2CCampaignCountsDetails = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/consumers/count?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
      data: { rows: [] },
      error: true,
    };
  }
};

export const fetchDashboardSankeyData = async (
  clientId,
  campaignId,
  reportType
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/client-dashboard/campaign`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify({
        clientId: clientId,
        campaignId: `${campaignId}`,
        reportType: reportType,
      }),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        "An error has occured",
      data: {},
      error: true,
    };
  }
};

export const fetchAppType = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/user-service/${config.apiVersion}/client-appType`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.message) || "An error has occured",
      data: {},
      error: true,
    };
  }
};

export const fetchCCPayeeListing = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-service/v1/cc-payeeListing`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.message) || "An error has occured",
      data: {},
      error: true,
    };
  }
};

export const fetchCCAllPayeesData = async (payload) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-service/v1/cc-clientListing`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify(payload),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.message) || "An error has occured",
      data: {},
      error: true,
    };
  }
};

export const fetchCCSelectedPayeesData = async (payload) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-service/v1/cc-payeeClientListing`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify(payload),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.message) || "An error has occured",
      data: {},
      error: true,
    };
  }
};

export const fetchCCGroupList = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-service/v1/cc/group/list`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.message) || "An error has occured",
      data: {},
      error: true,
    };
  }
};

export const fetchCCStatuList = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-service/v1/cc/client/status`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.message) || "An error has occured",
      data: {},
      error: true,
    };
  }
};
