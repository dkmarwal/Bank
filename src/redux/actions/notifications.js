import Cookies from 'universal-cookie'
import axios from 'axios'
import config from '~/config'
import { getAccessToken } from '~/redux/helpers/user'

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

/*
Get Payee Notification
*/
export const getNotifications = ({userId, portalTypeId}) => async (dispatch) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/notification-service/v1/notification/type/user?userId=${userId}&portalTypeId=${portalTypeId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        const responseBody = await response.data;
        if(responseBody.error == false) {
            dispatch({
                type: 'NOTIFICATION_FETCH_SUCCESS',
                payload: responseBody.data
            })
            return true;
        }
        dispatch({
            type: 'NOTIFICATION_FETCH_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'NOTIFICATION_FETCH_FAILED',
            payload: error.response && error.response.data.message || "An error has occurred."
        })
        return false;
    }
}

/*
set payee notification
*/
export const setNotification = ({ userId, portalProfileId, portalTypeId, notificationData }) => async dispatch => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
        url: `${config.apiBase}/notification-service/v1/notification/type`,
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${accessToken}`,
            'pragma': 'no-cache',
        },
        data: JSON.stringify({
            userId: userId,
            portalTypeId: portalTypeId,
            portalProfileId: portalProfileId,
            notificationData: notificationData
        })
    });

        const responseBody = await response.data;
        if(responseBody.error == false) {
            return true;
        }
        dispatch({
            type: 'NOTIFICATION_SET_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'NOTIFICATION_SET_FAILED',
            payload: error.response && error.response.data.message || "An error has occurred."
        })
        return false;
    }
};