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

export const getNotifications = async (userId, portalTypeId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/notification-service/v1/notification/type/user?userId=${userId}&portalTypeId=${portalTypeId}`,
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
      error: true,
    };
  }
};
export const setNotification = async (upNotification) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/notification-service/v1/notification/type`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(upNotification),
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
