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
  if (error.response.status === 401) {
      cookies.remove('@accessToken', { path: `${config.baseName}/` });
      cookies.remove('@refreshToken', { path: `${config.baseName}/` });
      cookies.remove('@portalTypeId', { path: `${config.baseName}/` });
      cookies.remove('@userId', { path: `${config.baseName}/` });
      window.location.href = `${config.baseName}/sessionout`;
  }
  return error.response;
});

export const updateOnboardingCLient = data => {
  return {
    type: 'UPDATE_ONBOARDING_CLIENT',
    payload: data
  }
}

export const updateOnboardingStep = () => (dispatch, getState) => {

  let { clients: { onBoarding: { currentOnboardingStep } = { currentOnboardingStep: 1 } } } = getState();
  const newOnboardingStep = currentOnboardingStep + 1;

  dispatch({
    type: 'UPDATE_ONBOARDING_STEP',
    payload: { currentOnboardingStep: newOnboardingStep }
  })
}


export const getClientPermissions = clientId => async dispatch => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/user/permissions?clientID=${clientId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data
        dispatch({
            type: "UPDATE_ONBOARDING_CLIENT",
            payload: {
                permissions: responseBody.data
            }
        })
    } catch (error) {
        return null
    }
}

export const getClientData = async (clientId) => {
  const accessToken = cookies.get('@accessToken');
  try {
    const response = await axios({
      url: `${config.apiBase}/client-service/${config.apiVersion}/client-enrollment/${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = response.data;
    if (responseBody.error == false) {
      return responseBody;
    }
    return responseBody;
  } catch (error) {
    return false;
  }
};

export const getClientDataActivated = async (clientId) => {
  const accessToken = cookies.get('@accessToken');
  try {
    const response = await axios({
      url: `${config.apiBase}/client-service/${config.apiVersion}/client/${clientId}`,
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