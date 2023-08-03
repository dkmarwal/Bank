import axios from "axios";
import Cookies from "universal-cookie";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";
import { EntityType } from "../../config/entityTypes";

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

export const sendActivationCode = async(data) =>{
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-service/v1/client/onboarding/activation`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(data)
        })
        return response;
    } catch (error) {
        return error.response.data;
    }
}

export const getPermissionOptions = async (portalTypeID = 2) => {
    const selectedEntityType = sessionStorage.getItem("selectedEntityType");
    const appType = selectedEntityType === 'B2B' ? EntityType.B2B : EntityType.B2C
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/user-service/v1/clients/access-rights?portalTypeId=${portalTypeID}&appType=${appType}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })

        const { data: { data = [] } } = response;
        return data;
    } catch (error) {
        return [];
    }
}

export const getClientPermissions = async (clientId) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/user-service/v1/client/portal/2/onboarding/permission?clientId=${clientId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })

        const { error, data: { data } } = response;

        if (!error) {
            // successfull post 
            // dispatch({
            //     type: 'GET_COMPANY_INFO',
            //     payload: { ...ClientDetails, ...LocationDetails },
            // });
            return data.rows || [];
        } else {
            // error post
            // dispatch({
            //     type: 'GET_COMPANY_INFO',
            //     payload: { ...ClientDetails, ...LocationDetails },
            // });
            return false;
        }
    } catch (error) {
        return [];
    }

}


export const updateClientPermissions = async (data) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/user-service/v1/client/onboarding/permission`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(data)
        })

        return response.data;
    } catch (error) {
        return error.response.data;
    }

}

export const sendB2CActivationCode = async(data) =>{
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-service/${config.apiVersion}/b2c/client/B2C-onboarding/activation`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(data)
        })
        return response;
    } catch (error) {
        return error.response.data;
    }
}

export const getB2CPermissionOptions = async (portalTypeID = 2) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/user-service/${config.apiVersion}/b2c/access-rights?portalTypeId=${portalTypeID}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })

        const { data: { data = [] } } = response;
        return data;
    } catch (error) {
        return [];
    }
}

export const getB2CClientPermissions = async (clientId) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/user-service/${config.apiVersion}/b2c/client/portal/2/onboarding/permission?clientId=${clientId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })

        const { error, data: { data } } = response;

        if (!error) {
            // successfull post 
            // dispatch({
            //     type: 'GET_COMPANY_INFO',
            //     payload: { ...ClientDetails, ...LocationDetails },
            // });
            return data.rows || [];
        } else {
            // error post
            // dispatch({
            //     type: 'GET_COMPANY_INFO',
            //     payload: { ...ClientDetails, ...LocationDetails },
            // });
            return false;
        }
    } catch (error) {
        return [];
    }

}

export const b2cUpdateClientPermissions = async (data) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/user-service/${config.apiVersion}/b2c/client/onboarding/permission`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(data)
        })

        return response.data;
    } catch (error) {
        return error.response.data;
    }

}