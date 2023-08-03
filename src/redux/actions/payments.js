import Cookies from "universal-cookie";
import axios from "axios";
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

export const achProfilesInformation = async () => {
  try {
    const accessToken = await getAccessToken()
    const accessURL = //`${config.apiBase}/client-config-service/v1/bank-account/ach-profile`
    `${config.apiBase}/client-config-service/${config.apiVersion}/bank-account/ach-profile`
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
    return
  }

}

export const B2CachProfilesInformation = async () => {
  try {
    const accessToken = await getAccessToken()
    const accessURL =//`${config.apiBase}/client-config-service/v1/b2c/bank-account/ach-profile`
    `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/bank-account/ach-profile`
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
    return
  }
}

export const B2CGetBankData = async (clientID, paymentType) => {
  try {
    const accessToken = await getAccessToken()
   
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/b2c/bank-account/client/${clientID}?type=${paymentType}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return
  }
}

export const getPurchaseType = async () => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/purchase-type/list`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return {
      error: true,
      message: "Server Expection Error",
      data: null,
    }
  }

}

export const getClientTransactionType = async (clientId, paymentType) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/transaction-type/client/${clientId}/paymentCode/${paymentType}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response;
  } catch (error) {
    return
  }

}

export const getClientPaymentTypes = (clientId) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/${config.apiVersion}/payment-type/list?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;

    if (responseBody.error === false) {
      dispatch({
        type: "FETCH_PAYMENT_TYPE_SUCCESS",
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: "FETCH_PAYMENT_TYPE_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_PAYMENT_TYPE_FAILED",
      payload: error.message || "An error has occurred.",
    });
    return false;
  }
};

export const getPreferredClientPaymentTypes = (clientId) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken()
    const accessURL = //`${config.apiBase}/client-config-service/v1/payment-type/client/${clientId}`
    `${config.apiBase}/client-config-service/${config.apiVersion}/payment-type/client/${clientId}`
    const response = await axios({
      url:accessURL,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "FETCH_PREFERRED_PAYMENT_TYPE_SUCCESS",
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: "FETCH_PREFERRED_PAYMENT_TYPE_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_PREFERRED_PAYMENT_TYPE_FAILED",
      payload: error.message || "An error has occurred.",
    });
    return false;
  }
};

export const updatePreferredPaymentTypes = (clientId, fileFormatId) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken()
    const accessURL = // `${config.apiBase}/client-config-service/v1/payment-type/client/${clientId}`
   
    `${config.apiBase}/client-config-service/${config.apiVersion}/payment-type/client/${clientId}`
    

    const response = await axios({
  
      url: accessURL,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({ fileFormatId }),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "PREFERRED_PAYMENT_TYPE_UPDATE_SUCCESS",
      });
      return true;
    }
    dispatch({
      type: "PREFERRED_PAYMENT_TYPE_UPDATE_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "PREFERRED_PAYMENT_TYPE_UPDATE_FAILED",
      payload: error.message || "An error has occurred.",
    });
    return false;
  }
};
//NR
export const getCardTypes = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client/cardType`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (responseBody.status === "SuccessFull") {
      dispatch({
        type: "FETCH_CARD_TYPE_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "FETCH_CARD_TYPE_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_CARD_TYPE_FAILED",
      payload: error.message || "An error has occurred.",
    });
    return false;
  }
};

export const getClientBankInfo = ({ clientId, paymentType }) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/bank-account/client/${clientId}?type=${paymentType}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const { error, message, data: { rows } } = await response.data;
    const { achProfile, ...restData } = rows[0] || [];
    const newData = { ...restData, ...achProfile };
    if (!error) {
      if (paymentType === 'ACH') {
        dispatch({
          type: "FETCH_BANK_DETAIL_SUCCESS",
          payload: newData || null,
        });
      } else {
        dispatch({
          type: "FETCH_EFT_DETAIL_SUCCESS",
          payload: (rows && rows[0]) || null,
        });
      }
      return true;
    }
    dispatch({
      type: "FETCH_BANK_DETAIL_FAILED",
      payload: message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_BANK_DETAIL_FAILED",
      payload: (error.response && error.response.message) || "An error has occurred.",
    });
    return false;
  }
};

export const createBankInfo = ({ clientId, paymentType, bankDetail }) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/bank-account/client/${clientId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(bankDetail)
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "BANK_DETAIL_UPDATE_SUCCESS",
        payload: {
          ...bankDetail,
          AccountID: (responseBody.data && responseBody.data.accountId) || null,
        },
      });
      // if (responseBody.data && responseBody.data.accountId) {
      //   return responseBody.data.accountId;
      // } else {
      //   return false;
      // }
    }
    dispatch({
      type: "BANK_DETAIL_UPDATE_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return responseBody;
    // return false;
  } catch (error) {
    dispatch({
      type: "BANK_DETAIL_UPDATE_FAILED",
      payload: error.message || "An error has occurred.",
    });
    return error;
  }
};

export const B2CcreateBankInfo = ({ clientId, bankDetail }) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/b2c/bank-account/client/${clientId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        accountName: bankDetail.accountName || null,
        accountNumber: bankDetail.accountNumber || null,
        routingCode: bankDetail.routingCode || null,
        companyName: bankDetail.companyName || null,
        companyIdentification: bankDetail.companyIdentification || null,
        companyEntryDescription: bankDetail.companyEntryDescription || null,
        companyDiscretionaryData: bankDetail.companyDiscretionaryData || null,
        originatingDFIIdentification: bankDetail.originatingDFIIdentification || null,
        originatingDFIDiscretionaryData: bankDetail.originatingDFIDiscretionaryData || null,
        type: bankDetail.type || null,   
        currencyCode: bankDetail.currencyCode || null
      })
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "BANK_DETAIL_UPDATE_SUCCESS",
        payload: {
          ...bankDetail,
          AccountID: (responseBody.data && responseBody.data.accountId) || null,
        },
      });
      // if (responseBody.data && responseBody.data.accountId) {
      //   return responseBody.data.accountId;
      // } else {
      //   return false;
      // }
    }
    dispatch({
      type: "BANK_DETAIL_UPDATE_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return responseBody;
    // return false;
  } catch (error) {
    dispatch({
      type: "BANK_DETAIL_UPDATE_FAILED",
      payload: error.message || "An error has occurred.",
    });
    return error;
  }
};

export const updateBankInfo = ({ clientId, paymentType, bankDetail }) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/bank-account/client/${clientId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(bankDetail),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "BANK_DETAIL_UPDATE_SUCCESS",
        payload: bankDetail,
      });
      // return true;
    }
    dispatch({
      type: "BANK_DETAIL_UPDATE_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    // return false;
    return responseBody;
  } catch (error) {
    dispatch({
      type: "CREATE_FILESETTING_FAILED",
      payload: error.message || "An error has occurred.",
    });
    // return false;
    return error;
  }
};

export const B2CupdateBankInfo = ({ clientId, bankDetail }) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken()
    
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/b2c/bank-account/client/${clientId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        accountId: bankDetail.accountId || null,
        accountName: bankDetail.accountName || null,
        accountNumber: bankDetail.accountNumber || null,
        routingCode: bankDetail.routingCode || null,
        companyName: bankDetail.companyName || null,
        companyIdentification: bankDetail.companyIdentification || null,
        companyEntryDescription: bankDetail.companyEntryDescription || null,
        companyDiscretionaryData: bankDetail.companyDiscretionaryData || null,
        originatingDFIIdentification: bankDetail.originatingDFIIdentification || null,
        originatingDFIDiscretionaryData: bankDetail.originatingDFIDiscretionaryData || null,
        type: bankDetail.type || null,
        currencyCode: bankDetail.currencyCode || null
      }),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "BANK_DETAIL_UPDATE_SUCCESS",
        payload: bankDetail,
      });
      // return true;
    }
    dispatch({
      type: "BANK_DETAIL_UPDATE_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    // return false;
    return responseBody;
  } catch (error) {
    dispatch({
      type: "CREATE_FILESETTING_FAILED",
      payload: error.message || "An error has occurred.",
    });
    // return false;
    return error;
  }
};

export const createETFInfo = ({ clientId, paymentType, eftDetail }) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client/bank/account/information?clientId=${clientId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        accountName: (eftDetail && eftDetail.AccountName) || "",
        accountNumber: (eftDetail && eftDetail.AccountNumber) || "",
        routingCode: (eftDetail && eftDetail.RoutingCode) || "",
        bankCountryISO: (eftDetail && eftDetail.BankCountryISO) || "",
        currencyCode: (eftDetail && eftDetail.CurrencyCode) || "",
        companyName: (eftDetail && eftDetail.CompanyName) || "",
        companyIdentification:
          (eftDetail && eftDetail.CompanyIdentification) || "",
        companyEntryDescription:
          (eftDetail && eftDetail.CompanyEntryDescription) || "",
        companyDiscretionaryData:
          (eftDetail && eftDetail.CompanyDiscretionaryData) || "",
        originatingDFIIdentification:
          (eftDetail && eftDetail.OriginatingDFIIdentification) || "",
        originatingDFIDiscretionaryData:
          (eftDetail && eftDetail.OriginatingDFIDiscretionaryData) || "",
        accountType: paymentType,
      }),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "ETF_DETAIL_UPDATE_SUCCESS",
        payload: {
          ...eftDetail,
          AccountID: (responseBody.data && responseBody.data.accountId) || null,
        },
      });
      return true;
    }
    dispatch({
      type: "ETF_DETAIL_UPDATE_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "ETF_DETAIL_UPDATE_FAILED",
      payload: error.message || "An error has occurred.",
    });
    return false;
  }
};

export const updateETFInfo = ({ clientId, paymentType, eftDetail }) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client/bank/account/information?clientId=${clientId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        accountName: (eftDetail && eftDetail.AccountName) || "",
        accountNumber: (eftDetail && eftDetail.AccountNumber) || "",
        routingCode: (eftDetail && eftDetail.RoutingCode) || "",
        bankCountryISO: (eftDetail && eftDetail.BankCountryISO) || "",
        currencyCode: (eftDetail && eftDetail.CurrencyCode) || "",
        companyName: (eftDetail && eftDetail.CompanyName) || "",
        companyIdentification:
          (eftDetail && eftDetail.CompanyIdentification) || "",
        companyEntryDescription:
          (eftDetail && eftDetail.CompanyEntryDescription) || "",
        companyDiscretionaryData:
          (eftDetail && eftDetail.CompanyDiscretionaryData) || "",
        originatingDFIIdentification:
          (eftDetail && eftDetail.OriginatingDFIIdentification) || "",
        originatingDFIDiscretionaryData:
          (eftDetail && eftDetail.OriginatingDFIDiscretionaryData) || "",
        accountType: paymentType,
        accountId: (eftDetail && eftDetail.AccountID) || null,
      }),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "EFT_DETAIL_UPDATE_SUCCESS",
        payload: eftDetail,
      });
      return true;
    }
    dispatch({
      type: "EFT_DETAIL_UPDATE_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "EFT_DETAIL_UPDATE_FAILED",
      payload: error.message || "An error has occurred.",
    });
    return false;
  }
};
export const getCurrencyList = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/${config.apiVersion}/currency`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "FETCH_CURRENCY_LIST_SUCCESS",
        payload: (responseBody.data) || null,
      });
      return true;
    }
    dispatch({
      type: "FETCH_CURRENCY_LIST_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_CURRENCY_LIST_FAILED",
      payload: error.message || "An error has occurred.",
    });
    return false;
  }
};

export const getVirtualCardInfo = ({ clientId }) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/virtual-card/client/${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const { error, message, data: { rows } } = await response.data;
    if (!error) {
      dispatch({
        type: "FETCH_VIRTUAL_CARD_DETAIL_SUCCESS",
        payload: (rows && rows[0]) || null,
      });
      return true;
    }
    dispatch({
      type: "FETCH_VIRTUAL_CARD_DETAIL_FAILED",
      payload: message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_VIRTUAL_CARD_DETAIL_FAILED",
      payload: (error.response && error.response.message) || "An error has occurred.",
    });
    return false;
  }
};

export const createVirtualCardInfo = ({
  clientId,
  virtualCardDetail,
}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/virtual-card`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(virtualCardDetail),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "VIRTUAL_CARD_DETAIL_UPDATE_SUCCESS",
        payload: {
          ...virtualCardDetail,
          cardAccountDetailsId: (responseBody.data && responseBody.data.cardAccountDetailsId) || null,
        },
      });
      // if (responseBody.data && responseBody.data.cardAccountDetailsId) {
      //   return responseBody.data.cardAccountDetailsId;
      // } else {
      //   return false;
      // }
    }
    dispatch({
      type: "VIRTUAL_CARD_DETAIL_UPDATE_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    // return false;
    return responseBody;
  } catch (error) {
    dispatch({
      type: "VIRTUAL_CARD_DETAIL_UPDATE_FAILED",
      payload: error.message || "An error has occurred.",
    });
    // return false;
    return error;
  }
};

export const updateVirtualCardInfo = ({
  clientId,
  virtualCardDetail,
}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/virtual-card`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(virtualCardDetail),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "VIRTUAL_CARD_DETAIL_UPDATE_SUCCESS",
        payload: virtualCardDetail,
      });
      // return true;
    }
    dispatch({
      type: "VIRTUAL_CARD_DETAIL_UPDATE_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return responseBody;
    // return false;
  } catch (error) {
    dispatch({
      type: "VIRTUAL_CARD_DETAIL_UPDATE_FAILED",
      payload: error.message || "An error has occurred.",
    });
    // return false;
    return error;
  }
};


export const getCheckDetailInfo = ({ clientId }) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/check-payment/client/${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const { error, message, data } = await response.data;
    if (!error) {
      dispatch({
        type: "FETCH_CHECK_DETAIL_SUCCESS",
        payload: data || null,
      });
      return true;
    }
    dispatch({
      type: "FETCH_CHECK_DETAIL_FAILED",
      payload: message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_CHECK_DETAIL_FAILED",
      payload: (error.response && error.response.message) || "An error has occurred.",
    });
    return false;
  }
};

export const updateCheckDetail = ({
  clientId,
  checkDetail,
}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/check-payment/client/${clientId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(checkDetail),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "FETCH_CHECK_DETAIL_UPDATE_SUCCESS",
        payload: checkDetail,
      });
      // return true;
    }
    dispatch({
      type: "FETCH_CHECK_DETAIL_UPDATE_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    // return false;
    return responseBody;
  } catch (error) {
    dispatch({
      type: "FETCH_CHECK_DETAIL_UPDATE_FAILED",
      payload: error.message || "An error has occurred.",
    });
    // return false;
    return error;
  }
};

export const getTransactionType = async () => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/transaction-type`,
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


export const createMasterCardInfo = ({ clientId, masterCardDetail }) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/client/master/card/create`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache'
      },
      data: JSON.stringify({
        data: masterCardDetail,
        clientId: clientId || null
      })
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "MASTER_CARD_DETAIL_UPDATE_SUCCESS",
        payload: {
          ...masterCardDetail,
          cardAccountDetailsId: (responseBody.data && responseBody.data.Id) || null
        }
      });
    }
    dispatch({
      type: "MASTER_CARD_DETAIL_UPDATE_FAILED",
      payload: responseBody.message || "Oops! Something went wrong."
    });
    return responseBody;
  } catch (error) {
    dispatch({
      type: "MASTER_CARD_DETAIL_UPDATE_FAILED",
      payload: error.message || "An error has occurred."
    });
    return error;
  }
};

export const updateMasterCardInfo = ({ clientId, masterCardDetail }) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/update/client/master/card/details`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache'
      },
      data: JSON.stringify({
        data: masterCardDetail,
        clientId: clientId || null
      })
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "MASTER_CARD_DETAIL_UPDATE_SUCCESS",
        payload: masterCardDetail
      });
    }
    dispatch({
      type: "MASTER_CARD_DETAIL_UPDATE_FAILED",
      payload: responseBody.message || "Oops! Something went wrong."
    });
    return responseBody;
  } catch (error) {
    dispatch({
      type: "MASTER_CARD_DETAIL_UPDATE_FAILED",
      payload: error.message || "An error has occurred."
    });
    return error;
  }
};

export const getMasterCardInfo = ({ clientId }) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/client/master/card/list?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache'
      }
    });

    const { error, message, data } = await response.data;
    if (!error) {
      dispatch({
        type: "FETCH_MASTER_CARD_DETAIL_SUCCESS",
        payload: data.length ? data : null
      });
      return true;
    }
    dispatch({
      type: "FETCH_MASTER_CARD_DETAIL_FAILED",
      payload: message || "Oops! Something went wrong."
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_MASTER_CARD_DETAIL_FAILED",
      payload: (error.response && error.response.message) || "An error has occurred."
    });
    return false;
  }
};

export const getVirtualCardType = async (clientId) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/virtual/card/type/list`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache'
      }
    });
    return response.data;
  } catch (error) {
    return {
      error: true,
      message: "Server Expection Error",
      data: null
    }
  }
}

export const getCardSelectionType = async (clientId) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/client/virtual/card/type/list?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache'
      }
    });
    return response.data;
  } catch (error) {
    return {
      error: true,
      message: "Server Expection Error",
      data: null
    }
  }
}

export const savePaymentCardtype = ({ clientId, cardTypeId }) => async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/add/client/virtual/card/type`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache'
      },
      data: JSON.stringify({
        clientId: clientId,
        cardTypeId: cardTypeId
      })
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        "An error has occured",
      data: {},
      error: true
    };
  }
}

export const getTemplateList = async (values) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/mastercard-service/1/gettemplatedetail`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache'
      },
      data: JSON.stringify(values)
    });
    const responseBody = await response.data && response.data;
    return responseBody;
  } catch (error) {
    return {
      error: true,
      message: "Server Expection Error",
      data: null
    }
  }
}

export const deleteProgramDetails = ({ clientId, programId }) => async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/delete/master/card/details?clientId=${clientId}&programDetailsId=${programId}`,
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
}

export const getTimeZoneList = async () => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/timezone/list`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache'
      }
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      error: true,
      message: "Server Expection Error",
      data: null
    }
  }
}
