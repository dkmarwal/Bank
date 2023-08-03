import axios from "axios";
import Cookies from "universal-cookie";
import config from "~/config";
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
      cookies.remove("@clientAccessToken", { path: `${config.baseName}/` });
      cookies.remove("@clientRefreshToken", { path: `${config.baseName}/` });
      cookies.remove("@clientUserId", { path: `${config.baseName}/` });
      window.location.href = `${config.baseName}/sessionout`;
    }
    return error.response;
  }
);

export const fetchFileList = async (data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payment-service/v1/GetPaymentFileDetail`,
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
    return error && error.response ? { ...error.response.data } : "";
  }
};

export const fetchFileStatus = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payment-service/v1/GetAllPaymentFileStatus`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const fetchFileFigureStatus = async (id) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payment-service/v1/GetPaymentFileFigureStatus?ClientID=${id}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const fetchFileByFileId = async (fileId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payment-service/v1/GetPaymentFileByFileID?fileID=${fileId}`,
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
};

export const GetIsPaymentFileExist = async (id, name) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payment-service/v1/GetIsPaymentFileExist?clientID=${id}&fileName=${name}&fileFormatId=10`,
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
};

export const updatePaymentFileAction = async (data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payment-service/v1/PaymentFileAction`,
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
    return {
      ...error.response.data,
    };
  }
};
export const downloadBankFile = async (id) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/bank-account/file/download/${id}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response;
  } catch (error) {
    return { ...error.response.data };
  }
};

export const downloadPaymentFile = async (id) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/payment/file/download/${id}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response;
  } catch (error) {
    return { ...error.response.data };
  }
};

export const downloadRemittanceFile = async (paymentId, clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/remittance/file/download?paymentId=${paymentId}&clientId=${clientId}`,
      method: "GET",
      responseType: 'arraybuffer',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response;
  } catch (error) {
    return { ...error.response.data };
  }
};

export const uploadFile = async (data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/payment/file/upload`,
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: data,
    });
    return response;
  } catch (error) {
    return { ...error.response.data };
  }
};

export const fetchPaymentFileStatus = async (id) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payment-service/v1/GetPaymentFileStatusByFileID?FileID=${id}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response;
  } catch (error) {
    return error && error.response ? { ...error.response.data } : "";
  }
};
