import axios from "axios";
import Cookies from "universal-cookie";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";

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

export const getPayeeAuthenticationSettingsData = async (clientId) => {
    const url = clientId ? `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/clients/${clientId}/verification-settings` : 
    `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/clients/verification-settings`;
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: url,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const savePayeeAuthenticationSettingsData = async (clientId, data) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/clients/${clientId}/verification-settings`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(data),
        });
        return await response.data;
    } catch (error) {
        return {
            ...error.response.data,
        };
    }
};

export const getFileSettingsData = async (clientId,flag) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/file-settings?clientId=${clientId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const saveFileSettingsData = async (clientId, data) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/clients/${clientId}/verification-settings`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(data),
        });
        return await response.data;
    } catch (error) {
        return {
            ...error.response.data,
        };
    }
};

export const updateFileSettingsData= async (clientId, data) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/file-settings?clientId=${clientId}`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(data),
        });
        return await response.data;
    } catch (error) {
        return {
            ...error.response.data,
        };
    }
  };

