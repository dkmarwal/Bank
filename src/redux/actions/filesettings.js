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

export const fetchFilesettings = ({clientId}) => async (dispatch) => {
    try {
    const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/api`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
              'pragma': 'no-cache',
            },
        })
        const responseBody = await response.data;
        if(!responseBody.error) {
            dispatch({
                type: 'FETCH_FILESETTING_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'FETCH_FILESETTING_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'FETCH_FILESETTING_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const createFilesettings = ({ clientId, filesettings }) => async (dispatch) => {
    try {
    const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/api/`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
              'pragma': 'no-cache',
            },
            data: JSON.stringify({
                clientId : clientId || null,
                Filesettings: filesettings,
            })

        })
        const responseBody = await response.data
        if (!responseBody.error) {
            dispatch({
                type: 'CREATE_FILESETTING_SUCCESS',
                payload: filesettings
            })
            return true;
        } else {
            dispatch({
                type: 'CREATE_FILESETTING_FAILED',
                payload: responseBody.message || "Oops! Something went wrong."
            })
            return false;
        }
    } catch (error) {
        dispatch({
            type: 'CREATE_FILESETTING_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const updateFilesettings = ({ clientId, filesettings }) => async (dispatch) => {
    try {
    const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/api`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
              'pragma': 'no-cache',
            },
            data: JSON.stringify({
                clientId : clientId || null,
                Filesettings: filesettings,
                
            })

        })
        const responseBody = await response.data
        if (!responseBody.error) {
            dispatch({
                type: 'UPDATE_FILESETTING_SUCCESS',
                payload: filesettings
            })
            return true;
        } else {
            dispatch({
                type: 'UPDATE_FILESETTING_FAILED',
                payload: responseBody.message || "Oops! Something went wrong."
            })
            return false;
        }
    } catch (error) {
        dispatch({
            type: 'UPDATE_FILESETTING_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}