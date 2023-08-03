import Cookies from 'universal-cookie';
import axios from 'axios';
import config from '~/config';
import { getAccessToken } from '~/redux/helpers/user';

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


export const getIPAddress = () => async (dispatch) => {
    try {
       const accessToken = await getAccessToken();             
        const response = await axios({
            url: `${config.apiBase}/user-service/${config.apiVersion}/user/security-details`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        const responseBody = await response.data;
        if(responseBody.error === false) {
            dispatch({
                type: 'GET_IP_SUCCESS',
                payload: responseBody.data
            })
            return true;
        }
        dispatch({
            type: 'GET_IP_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'GET_IP_FAILED',
            payload: error.response && error.response.data.message || "An error has occurred."
        })
        return false;
    }
}

export const updateSecurityDetail = (isIpRestrict, ipAddress) => async (dispatch) => {
    try {
       const accessToken = await getAccessToken();             
        const response = await axios({
            url: `${config.apiBase}/user-service/${config.apiVersion}/user/security-details`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({
                isIpRestriction: isIpRestrict || 0,
                ipAddresses: isIpRestrict === 0 ? [] : ipAddress || []
            }),
        })
        const responseBody = await response.data;        
        if(!responseBody.error) {
            dispatch({
                type: 'UPDATE_IP_SUCCESS',
                payload: responseBody.data
            })
            return true;
        }        
        dispatch({
            type: 'UPDATE_IP_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'UPDATE_IP_FAILED',
            payload: error.response && error.response.data.message || "An error has occurred."
        })
        return false;
    }
}