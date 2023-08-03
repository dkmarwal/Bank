import Cookies from 'universal-cookie';
import axios from 'axios';
import config from '~/config';
import { getAccessToken } from '~/redux/helpers/user';
import currency from 'currency.js';
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

export const getClientsList = (bankID) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-service/${config.apiVersion}/list?bankId=${bankID}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'FETCH_CLIENTS_LIST_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'FETCH_CLIENTS_LIST_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'FETCH_CLIENTS_LIST_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

/* 
   Using in User Client Access to get client list based on filter
*/
export const getBankClientsList = ({ portalProfileId, appType, filter, payerTypeId }) => async (dispatch) =>{
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/client-service/${config.apiVersion}/bank/portal/clients/list`,
            method: "POST",
            params: {
                bankId: portalProfileId,
                appType,
                sortOrder: 'desc',
                sortColumn: "clientName",
                filter
            },
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                pragma: "no-cache",
            },
            data: JSON.stringify({
                payerTypeId
            }),
        });
        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'FETCH_CLIENTS_LIST_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'FETCH_CLIENTS_LIST_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'FETCH_CLIENTS_LIST_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const getClientsAccessList = ({ portalProfileId, userId }) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            //url: `${config.apiBase}/client/bank/portal/accesses?bankId=${portalProfileId}&userId=${userId}`,
            url: `${config.apiBase}/user-service/${config.apiVersion}/bank/portal/accesses?bankId=${portalProfileId}&userId=${userId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'CLIENTS_ACCESS_LIST_SUCCESS',
                payload: responseBody.data || [],
            })
            return true;
        }
        dispatch({
            type: 'CLIENTS_ACCESS_LIST_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'CLIENTS_ACCESS_LIST_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const updateClientsAccessList = (accessDetails) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            //url: `${config.apiBase}/client/bank/portal/accesses?bankId=${accessDetails.portalProfileId}&userId=${accessDetails.userId}`,
            url: `${config.apiBase}/user-service/${config.apiVersion}/bank/portal/accesses?bankId=${accessDetails.portalProfileId}&userId=${accessDetails.userId}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({
                "clientIds": accessDetails.clientIds
            })

        })
        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'CLIENTS_UPDATE_LIST_SUCCESS',
                payload: accessDetails.clientIds,
            })
            return true;
        }
        dispatch({
            type: 'CLIENTS_UPDATE_LIST_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;

    } catch (error) {
        dispatch({
            type: 'CLIENTS_UPDATE_LIST_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}


export const getPagiClientsAccessList = ({ portalProfileId, userId, limit, offset }) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            //url: `${config.apiBase}/client/bank/portal/accesses?bankId=${portalProfileId}&userId=${userId}`,
            url: `${config.apiBase}/user-service/${config.apiVersion}/bank/portal/accesses?bankId=${portalProfileId}&userId=${userId}&limit=${limit}&offset=${offset}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'CLIENTS_ACCESS_LIST_SUCCESS',
                payload: responseBody.data || [],
            })
            return true;
        }
        dispatch({
            type: 'CLIENTS_ACCESS_LIST_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'CLIENTS_ACCESS_LIST_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}