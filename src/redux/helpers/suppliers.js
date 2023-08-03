import Cookies from "universal-cookie";
import axios from "axios";
import config from "~/config";
import { PlayCircleFilledWhiteRounded } from "@material-ui/icons";
import { getAccessToken } from "~/redux/helpers/user";

axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response;
}, function (error) {
  // Do something with response error
  if (error.response.status == 401) {
    let cookies = new Cookies();
    cookies.remove('@clientAccessToken', { path: `${config.baseName}/` });
    cookies.remove('@clientRefreshToken', { path: `${config.baseName}/` });
    cookies.remove('@clientUserId', { path: `${config.baseName}/` });
    window.location.href = `${config.baseName}/sessionout`;
  }
  return error.response;
});

export const fetchSuppliersFilterChips = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/filters?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
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
    };
  }
};

export const fetchSuppliersFilterList = async (clientId, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees?clientId=${clientId}&implementationProgram=${data.programList}&payeeId=${data.id}&state=${data.location}&companyName=${data.name}&paymentMethod=${data.paymentList}&status=${data.status}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
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
    };
  }
};

export const fetchVendorsList = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
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
    };
  }
};

export const fetchReadyForApprovalsList = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees?isApprovalPending=true&clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
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
    };
  }
};

export const disapprovePayee = async (clientId, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/disapprove?clientId=${clientId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const revokePayee = async (clientId, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/revoke?clientId=${clientId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
      data: { rows: [] },
    };
  }
};

export const fetchApprovedList = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees?isApproved=true&clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
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
    };
  }
};

export const fetchInProgressList = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees?isProfileInprogress=true&clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
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
    };
  }
};

export const fetchPendingList = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees?isValidationPending=true&clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
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
    };
  }
};

export const fetchDisapprovedList = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees?isProfileDisapproved=true&clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
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
    };
  }
};

export const fetchRevokedList = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees?isProfileRevoked=true&clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
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
    };
  }
};

export const fetchContactInfo = async (id) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/${id}/contacts`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
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
    };
  }
};

export const fetchSupplierIds = async (payeeId, clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/${payeeId}/remit-to?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
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
    };
  }
};

export const fetchDefaultSupplierIds = async (payeeId, clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/${payeeId}/default-remit-to?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
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
    };
  }
};

export const updateRemitToId = async (payeeId, clientId, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/${payeeId}/remit-to?clientId=${clientId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
      data: { rows: [] },
    };
  }
};

export const removeRemitToId = async (payeeId, clientId, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/${payeeId}/remit-To/${data}?clientId=${clientId}`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const approveSupplier = async (payeeId, clientId, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/${payeeId}/payments/approve?clientId=${clientId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const fetchCustomFilter = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/clients/${clientId}/payment-types`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
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
    };
  }
};

export const isPayeeEditable = async (payeeId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/${payeeId}/general-settings`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
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
    };
  }
};

export const fetchPayeeDetails = async (payeeId, clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/${payeeId}?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
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
    };
  }
};

export const updatePayeeDetails = async (payeeId, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/${payeeId}/company-info`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
      data: { rows: [] },
    };
  }
};

export const updatePayeeContactDetails = async (payeeId, id, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/${payeeId}/contacts/${id}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
      data: { rows: [] },
    };
  }
};

export const fetchContactTypeList = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/contact-types`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
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
    };
  }
};

export const fetchLocationsList = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/location-types`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
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
    };
  }
};

export const fetchPayeeLocationsDetails = async (payeeId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/${payeeId}/locations`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
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
    };
  }
};

export const updatePayeeLocationDetails = async (payeeId, id, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/${payeeId}/locations/${id}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
      data: { rows: [] },
    };
  }
};

export const fetchSuppliersCount = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/onboarding/count`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
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
    };
  }
};