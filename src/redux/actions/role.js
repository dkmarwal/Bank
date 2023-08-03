import Cookies from 'universal-cookie';
import axios from 'axios';
import config from '~/config';
import { getAccessToken } from '~/redux/helpers/user';
import currency from 'currency.js';

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

export const fetchRoles = ({portalProfileId, portalTypeId, userId}) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/user-service/${config.apiVersion}/roles`,
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
                type: 'ROLE_LIST_FETCH_SUCCESS',
                payload: responseBody.data, 
            })
            return true;
        }
        dispatch({
            type: 'ROLE_LIST_FETCH_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'ROLE_LIST_FETCH_FAILED',
            payload: error.response && error.response.data.message || "An error has occurred."
        })
        return false;
    }
}

export const fetchAccessRights = ({portalTypeId}) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/user-service/${config.apiVersion}/access-rights?portalTypeId=${portalTypeId}`,
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
                type: 'ACCESS_RIGHTS_FETCH_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'ACCESS_RIGHTS_FETCH_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'ACCESS_RIGHTS_FETCH_FAILED',
            payload: error.response && error.response.data.message || "An error has occurred."
        })
        return false;
    }
}


export const fetchClientAccessRights = ({portalTypeId, appType}) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/user-service/${config.apiVersion}/clients/access-rights?portalTypeId=${portalTypeId}&appType=${appType}`,
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
                type: 'ACCESS_RIGHTS_FETCH_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'ACCESS_RIGHTS_FETCH_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'ACCESS_RIGHTS_FETCH_FAILED',
            payload: error.response && error.response.data.message || "An error has occurred."
        })
        return false;
    }
}

export const fetchPermissions = (portalProfileId, roleId) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/user-service/${config.apiVersion}/permission?portalProfileId=${portalProfileId}&roleId=${roleId}`,
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
                type: 'ACCESS_ROLE_PERMISSIONS_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'ACCESS_ROLE_PERMISSIONS_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'ACCESS_ROLE_PERMISSIONS_FAILED',
            payload: error.response && error.response.data.message || "An error has occurred."
        })
        return false;
    }
}

export const createRole = (roleDetail) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/user-service/${config.apiVersion}/role`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
               'Authorization': `Bearer ${accessToken}`,
               'pragma': 'no-cache',
            },
            data: JSON.stringify({
                "roleName": roleDetail.roleName,
                "permission": roleDetail.permissions,
                "description": roleDetail.description
            })
        })
        const responseBody = await response.data;
         if(responseBody.error == false) {
            dispatch({
                type: 'ROLE_CREATE_SUCCESS',
                payload: {...roleDetail, roldId:responseBody.data && responseBody.data.roleId || null}
            })
            return true;
        }
        dispatch({
            type: 'ROLE_CREATE_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;

    } catch (error) {
        dispatch({
            type: 'ROLE_CREATE_FAILED',
            payload: error.response && error.response.data.message || "An error has occurred."
        })
        return false;
    }
}

export const updateRole = (roleDetail) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/user-service/${config.apiVersion}/role?roleId=${roleDetail.roleId}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
               'Authorization': `Bearer ${accessToken}`,
               'pragma': 'no-cache',
            },
             data: JSON.stringify({
                 "roleName": roleDetail.roleName,
                 "permission": roleDetail.permissions,
                 "description": roleDetail.description
            })

        })
        const responseBody = await response.data;
        if(responseBody.error == false) {
            dispatch({
                type: 'ROLE_UPDATE_SUCCESS',
                payload: roleDetail,
            })
            return true;
        }
        dispatch({
            type: 'ROLE_UPDATE_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;

    } catch (error) {
        dispatch({
            type: 'ROLE_UPDATE_FAILED',
            payload: error.response && error.response.data.message || "An error has occurred."
        })
        return false;
    }
}