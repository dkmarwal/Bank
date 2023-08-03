import Cookies from 'universal-cookie'
import axios from 'axios'
import config from '~/config'
import { getAccessToken } from '~/redux/helpers/user'
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

export const getB2CClientDataActivated = async (clientId) => {
    const accessToken = await getAccessToken()
    try {
      const response = await axios({
        url: `${config.apiBase}/client-service/${config.apiVersion}/b2c/client/${clientId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`,
          'pragma': 'no-cache',
        },
      });
      const responseBody = response.data;
      if (!responseBody.error) {
        return responseBody;
      }
      return responseBody;
    } catch (error) {
      return false;
    }
  };