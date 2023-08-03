import Cookies from 'universal-cookie';
import axios from 'axios';
import config from '~/config';
import { getAccessToken } from '~/redux/helpers/user';
// import i18n from '~/i18n';

const cookies = new Cookies();

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

export const getAllCountries = () => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-service/${config.apiVersion}/countries-list`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'COUNTRY_LIST_FETCH_SUCCESS',
                payload: responseBody.data && responseBody.data.rows,
            })
            return true;
        }
        dispatch({
            type: 'COUNTRY_LIST_FETCH_FAILED',
            payload: responseBody.message || "Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'COUNTRY_LIST_FETCH_FAILED',
            payload: error.response && error.response.data.message || "Something went wrong."
        })
        return false;
    }
}

export const getStatesOfCountry = (isoCode) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-service/${config.apiVersion}/states-list?countryISOCode=${isoCode}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'STATE_LIST_FETCH_SUCCESS',
                payload: responseBody.data && responseBody.data.rows,
            })
            return true;
        }
        dispatch({
            type: 'STATE_LIST_FETCH_FAILED',
            payload: responseBody.message || "Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'STATE_LIST_FETCH_FAILED',
            payload: error.response && error.response.data.message || "Something went wrong."
        })
        return false;
    }
}

export const getCitiesOfState = (stateName) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-service/${config.apiVersion}/cities-list?stateName=${stateName}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'CITY_LIST_FETCH_SUCCESS',
                payload: responseBody.data && responseBody.data.rows,
            })
            return true;
        }
        dispatch({
            type: 'CITY_LIST_FETCH_FAILED',
            payload: responseBody.message || "Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'CITY_LIST_FETCH_FAILED',
            payload: error.response && error.response.data.message || "Something went wrong."
        })
        return false;
    }
}

export const getCitiesOfStateByISO = (stateCode) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-service/${config.apiVersion}/cities-list?stateCode=${stateCode}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'CITY_LIST_FETCH_SUCCESS',
                payload: responseBody.data && responseBody.data.rows,
            })
            return true;
        }
        dispatch({
            type: 'CITY_LIST_FETCH_FAILED',
            payload: responseBody.message || "Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'CITY_LIST_FETCH_FAILED',
            payload: error.response && error.response.data.message || "Something went wrong."
        })
        return false;
    }
}