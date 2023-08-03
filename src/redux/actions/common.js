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

export const getLocationType = () => async dispatch => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/location`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data
        dispatch({
            type: "INSERT_LOCATION_TYPE",
            payload: responseBody.data
        })
    } catch (error) {
        return null
    }
}

export const getCardTypes = () => async (dispatch) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/cardType`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
               'Authorization': `Bearer ${accessToken}`,
               'pragma': 'no-cache',
            },
        })
        const {data, status, message} = response.data;
        if(status === 'SuccessFull') {
            dispatch({
                type: 'FETCH_CARD_TYPE',
                payload: data,
            })
            return true;
        }
        dispatch({
            type: 'FETCH_CARD_TYPE_FAILED',
            payload: message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'FETCH_CARD_TYPE_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const getCurrencyList = () => async (dispatch) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/bank/account/currency/list`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
               'Authorization': `Bearer ${accessToken}`,
               'pragma': 'no-cache',
            },
        })
        const {data, status, message} = await response.data;
        if(status === 'SuccessFull') {
            dispatch({
                type: 'FETCH_CURRENCY_LIST',
                payload: data || null,
            })
            return true;
        }
        dispatch({
            type: 'FETCH_CURRENCY_LIST_FAILED',
            payload: message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'FETCH_CURRENCY_LIST_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}


export const getContactTypeList = () => async (dispatch) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/contact/types/list`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
               'Authorization': `Bearer ${accessToken}`,
               'pragma': 'no-cache',
            },
        })
        const {data, status, message} = await response.data;
        if(status === 'SuccessFull') {
            dispatch({
                type: 'FETCH_CONTACT_TYPE_LIST',
                payload: data || null,
            })
            return true;
        }
        dispatch({
            type: 'FETCH_CONTACT_TYPE_LIST',
            payload: message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'FETCH_CONTACT_TYPE_LIST',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const getAccountClassifications = () => async (dispatch) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/account/classification/type`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
               'Authorization': `Bearer ${accessToken}`,
               'pragma': 'no-cache',
            },
        })
        const {data, status, message} = await response.data;
        if(status === 'SuccessFull') {
            dispatch({
                type: 'FETCH_ACCT_CLASSIFICATION_LIST',
                payload: data || null,
            })
            return true;
        }
        dispatch({
            type: 'FETCH_ACCT_CLASSIFICATION_ERROR',
            payload: message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'FETCH_ACCT_CLASSIFICATION_ERROR',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const getPurchaseTypeList = () => async (dispatch) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/virtualCard/purchase/type`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
               'Authorization': `Bearer ${accessToken}`,
               'pragma': 'no-cache',
            },
        })
        const {data, status, message} = await response.data;
        if(status === 'SuccessFull') {
            dispatch({
                type: 'FETCH_PURCHASE_TYPE_LIST',
                payload: data || null,
            })
            return true;
        }
        dispatch({
            type: 'FETCH_PURCHASE_TYPE_ERROR',
            payload: message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'FETCH_PURCHASE_TYPE_ERROR',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const getRemittanceFormatList = () => async (dispatch) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/remittance/format`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
               'Authorization': `Bearer ${accessToken}`,
               'pragma': 'no-cache',
            },
        })
        const {data, status, message} = response.data;
        if(status === 'SuccessFull') {
            dispatch({
                type: 'FETCH_REMITTANCE_FORMAT_LIST',
                payload: data || null,
            })
            return true;
        }
        dispatch({
            type: 'FETCH_REMITTANCE_FORMAT_ERROR',
            payload: message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'FETCH_REMITTANCE_FORMAT_ERROR',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const getRemittanceDeliveryMode = () => async (dispatch) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/remittance/deliveryMode`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
               'Authorization': `Bearer ${accessToken}`,
               'pragma': 'no-cache',
            },
        })
        const {data, status, message} = response.data;
        if(status === 'SuccessFull') {
            dispatch({
                type: 'FETCH_REMITTANCE_DELIVERY_MODE_LIST',
                payload: data || null,
            })
            return true;
        }
        dispatch({
            type: 'FETCH_REMITTANCE_DELIVERY_ERROR',
            payload: message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'FETCH_REMITTANCE_DELIVERY_ERROR',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}





