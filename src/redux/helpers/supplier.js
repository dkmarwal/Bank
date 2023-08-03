import axios from "axios";
import { CurrencyFlag } from "react-currency-flags/dist/components";
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
    cookies.remove('@clientAccessToken', { path: `${config.baseName}/` });
    cookies.remove('@clientRefreshToken', { path: `${config.baseName}/` });
    cookies.remove('@clientUserId', { path: `${config.baseName}/` });
    window.location.href = `${config.baseName}/sessionout`;
  }
  return error.response;
});

export const getClientSupplierUpdate = async (payeeId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/review-changes?clientId=${payeeId}`,
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

export const getSupplierUpdateContact = async ({ payeeId, entityId, flag }) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/${payeeId}/contacts/${entityId}?prevDetails=${flag}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const { data = [], error = false, message = "" } = response.data;

    if (flag === true) {
      if (Object.keys(data).length > 0) {
        const { previousPayeeContact, currentPayeeContact } = data;
        const { contactTypeHistory, ...restProps } = previousPayeeContact;
        const {
          contactType,
          ...restCurrentProps
        } = currentPayeeContact;
        return {
          prevDetails: { ...contactTypeHistory, ...restProps },
          newDetails: { ...contactType, ...restCurrentProps },
        };
      }
    } else {
      if (Object.keys(data).length > 0) {
        const { contactType,
          ...restCurrentProps
        } = data;
        return {
          newDetails: { ...contactType, ...restCurrentProps },
        };
      }
    }
    return false;
  } catch (error) {
    // return error.response;
    return error && error.response ? { ...error.response.data } : {};
  }
};

export const getSupplierCompanyUpdate = async ({ payeeId, prevDetails }) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/${payeeId}?prevDetails=${prevDetails}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const { data = [], error = false, message = "" } = response.data;
    if (Object.keys(data).length > 0 && prevDetails) {
      const { previousPayee, currentPayee } = data;
      const {
        payeeLocations,
        createdAt,
        updatedAt,
        ...restPrevData
      } = previousPayee;
      const {
        payeeLocations: currentPayeeLoc,
        createdAt: currCreatedAt,
        updatedAt: currUpdatedAt,
        ...restCurrentData
      } = currentPayee;
      return { prevDetails: restPrevData, newDetails: restCurrentData };
    } else if (Object.keys(data).length > 0) {
      return data;
    }
    return false;
  } catch (error) {
    return error.response;
  }
};

export const getSupplierLocationUpdate = async ({ payeeId, entityId, flag }) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/${payeeId}/locations/${entityId}?prevDetails=${flag}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const { data = [], error = false, message = "" } = response.data;
    if (flag === true) {
      if (Object.keys(data).length > 0) {
        const { previousPayeeLocation, currentPayeeLocation } = data;
        const {
          createdAt,
          updatedAt,
          locationTypeHistory,
          ...restPrevData
        } = previousPayeeLocation;
        const {
          createdAt: currCreatedAt,
          updatedAt: currUpdatedAt,
          locationTypeHistory: currentLocationHistory,
          ...restCurrentData
        } = currentPayeeLocation;
        return { prevDetails: restPrevData, newDetails: restCurrentData };
      }
    } else {
      if (Object.keys(data).length > 0) {
        const {
          // createdAt: currCreatedAt,
          // updatedAt: currUpdatedAt,
          locationType,
          ...restCurrentData
        } = data;
        return { newDetails: restCurrentData };
      }
    }
    return false;
  } catch (error) {
    return error.response;
  }
};

export const getSupplierBankUpdate = async ({ payeeId, entityId, flag, isUnshare }) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: isUnshare ? `${config.apiBase}/payee-service/v1/payees/${payeeId}/payment/bank-accounts/${entityId}?previousDetail=${flag}&remitToIdRequired=true` :
        `${config.apiBase}/payee-service/v1/payees/${payeeId}/payment/bank-accounts/${entityId}?previousDetail=${flag}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const { data = {}, error = false, message = "" } = response.data;
    if (flag === true) {
      if (Object.keys(data).length > 0) {
        const { previousDetail, currentDetail } = data;
        const {
          payeeBankAccountLocations,
          accountType,
          accountClass,
          locationOption,
          ...restProps
        } = previousDetail;
        const {
          payeeBankAccountLocations: payeeBank,
          accountType: accnt,
          accountClass: accClas,
          locationOption: locat,
          ...restCurrProps
        } = currentDetail;
        return { prevDetails: restProps, newDetails: restCurrProps };
      }
    } else {
      if (Object.keys(data).length > 0) {
        const {
          payeeBankAccountLocations,
          accountType,
          accountClass,
          locationOption,
          ...restCurrProps
        } = data;
        return { newDetails: restCurrProps };
      }
    }

    return false;
  } catch (error) {
    return error.response;
  }
};

export const getSupplierVCAUpdate = async ({ payeeId, entityId, flag, isUnshare }) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: isUnshare ? `${config.apiBase}/payee-service/v1/payees/${payeeId}/payment/virtual-cards/${entityId}?previousDetail=${flag}&remitToIdRequired=true` :
        `${config.apiBase}/payee-service/v1/payees/${payeeId}/payment/virtual-cards/${entityId}?previousDetail=${flag}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const { data = {}, error = false, message = "" } = response.data;
    if (flag === true) {
      if (Object.keys(data).length > 0) {
        const { previousDetail, currentDetail } = data;
        const { commercialCardType, ...restProps } = previousDetail;
        const { commercialCardType: cardtype, ...restCurrProps } = currentDetail;
        return { prevDetails: restProps, newDetails: restCurrProps };
      }
    } else {
      if (Object.keys(data).length > 0) {
        const { commercialCardType, ...restCurrProps } = data;
        return { newDetails: restCurrProps };
      }
    }
    return false;
  } catch (error) {
    return error.response;
  }
};

export const getSupplierWireUpdate = async ({ payeeId, entityId }) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/${payeeId}/payment/bank-accounts/${entityId}?previousDetail=true`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const { data = {}, error = false, message = "" } = response.data;
    // if (Object.keys(data).length > 0) {
    //   const { previousDetail, currentDetail } = data;
    //   const {
    //     payeeBankAccountLocations,
    //     accountType,
    //     accountClass,
    //     locationOption,
    //     ...restProps
    //   } = previousDetail;
    //   const {
    //     payeeBankAccountLocations: payeeBank,
    //     accountType: accnt,
    //     accountClass: accClas,
    //     locationOption: locat,
    //     ...restCurrProps
    //   } = currentDetail;
    //   return { prevDetails: restProps, newDetails: restCurrProps };
    // }
    return false;
  } catch (error) {
    return error.response;
  }
};

export const getSupplierCheckUpdate = async ({ payeeId, entityId }) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/${payeeId}/payment/bank-accounts/${entityId}?previousDetail=true`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const { data = {}, error = false, message = "" } = response.data;
    // if (Object.keys(data).length > 0) {
    //   const { previousDetail, currentDetail } = data;
    //   const {
    //     payeeBankAccountLocations,
    //     accountType,
    //     accountClass,
    //     locationOption,
    //     ...restProps
    //   } = previousDetail;
    //   const {
    //     payeeBankAccountLocations: payeeBank,
    //     accountType: accnt,
    //     accountClass: accClas,
    //     locationOption: locat,
    //     ...restCurrProps
    //   } = currentDetail;
    //   return { prevDetails: restProps, newDetails: restCurrProps };
    // }
    return false;
  } catch (error) {
    return error.response;
  }
};

export const approveSupplierUpdate = async (data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/payments/approve`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    return { ...error.response.data };
  }
};
export const unshareSupplier = async (payeeId, clientId, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/unshare-accept?payeeId=${payeeId}&clientId=${clientId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    return { ...error.response.data };
  }
};
export const rejectSupplierUpdate = async (data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/payments/reject`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: data,
    });
    //console.log("------------ reject called -------------", response)
    const { data = {}, error = false, message = "" } = response;

    return true;
  } catch (error) {
    return error.response;
  }
};

export const updateNotificationRead = async (id) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payee/notification-read?payeeActionTypeId=${id}`,
      method: "POST",
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