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

export const fetchAllPaymentMethods = async () => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/payment-type/filter-list?appType=3`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        return response.data;
    }
    catch (error) {
        return [];
    }
}

export const fetchB2CPaymentMethods = async () => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/client-config-service/${config.apiVersion}/b2c/payment-type/list`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        return response.data;
    }
    catch (error) {
        return [];
    }
}

export const fetchB2CIndustryGroupList = async () => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-service/${config.apiVersion}/b2c/group/list`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        return response.data;
    } catch (error) {
        return [];
    }
}

export const fetchB2CParentClientList = async () => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-service/v1/b2c/parent/list`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        return response.data;
    } catch (error) {
        return [];
    }
}

export const createB2CClientProfile = async (data) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-service/v1/b2c/enrollment`,
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

