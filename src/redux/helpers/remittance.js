import axios from "axios";
import Cookies from "universal-cookie";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";

axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
}, function (error) {
    // Do something with response error
    if (error.response.status === 401) {
        let cookies = new Cookies();
        cookies.remove('@accessToken', { path: `${config.baseName}/` });
        cookies.remove('@refreshToken', { path: `${config.baseName}/` });
        cookies.remove('@portalTypeId', { path: `${config.baseName}/` });
        cookies.remove('@userId', { path: `${config.baseName}/` });
        window.location.href = `${config.baseName}/sessionout`;
    }
    return error.response;
});

export const getRemittanceConfigRule = async (id) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-config-service/${config.apiVersion}/remittance/details?clientId=${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        if (response && response.data) {
            return response.data;
        }
        return {
            error: true,
            message: 'Response format not recognized'
        }
    } catch (error) {
        return {
            error: true,
            message: 'Server Exception Error'
        };
    }

}

export const getCSVSelected = async (id) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-config-service/v1/csv/cc/client?clientId=${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        if (response && response.data) {
            return response.data;
        }
        return {
            error: true,
            message: response.message || 'Error in API'
        }
    } catch (error) {
        return {
            error: true,
            message: 'Server Exception Error'
        };
    }

}

export const getRemittanceFormat = async () => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-config-service/${config.apiVersion}/remittance/formats`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        return response;
    } catch (error) {
        return error.response;
    }

}

export const getRemittanceDeliveryMode = async () => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-config-service/${config.apiVersion}/remittance/delivery-modes`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        return response;
    } catch (error) {
        return error.response;
    }

}

export const getRemittanceParams = async (clientId) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-config-service/${config.apiVersion}/remittance/information?clientId=${clientId}&isOnboarding=1`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

export const getClientRemConfig = async (clientId) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-config-service/${config.apiVersion}/remittance/configurations?clientId=${clientId}&isOnboarding=1`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        if (response && response.data) {
            return response.data;
        }
        return {
            error: true,
            message: 'Response format not recognized'
        }
    } catch (error) {
        return {
            error: true,
            message: 'Server Exception Error'
        };
    }
}

export const updateRemittanceParams = async (data) => {

    const {
        clientId,
        isPaymentId,
        isPaymentType,
        isClientId,
        isValueDate,
        isPaymentReference,
        isInvoiceNo,
        isInvoiceDate,
        isInvoiceGrossAmount,
        isDiscountAmount,
        isPurchaseOrder,
        isAmount,
        isAmountPaid,
        isAdjustmentAmount,
        isAdjustmentCode,
        isClientName,
        isRemitToId, isPayeeName, isAchCompanyName } = data;

    const postData =
    {
        clientId,
        isPaymentId,
        isPaymentType,
        isClientId,
        isValueDate,
        isPaymentReference,
        isInvoiceNo,
        isInvoiceDate,
        isInvoiceGrossAmount,
        isDiscountAmount,
        isPurchaseOrder,
        isAmount,
        isAmountPaid,
        isAdjustmentAmount,
        isAdjustmentCode,
        isClientName,
        isRemitToId, isPayeeName, isAchCompanyName
    };

    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-config-service/${config.apiVersion}/remittance/parameters`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: postData
        })
        return response;
    } catch (error) {
        return error.response;
    }
};

export const updateRemittanceConfig = async (clientId, data) => {

    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-config-service/${config.apiVersion}/remittance/configurations?clientId=${clientId}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: data
        })
        return response;
    } catch (error) {
        return error.response;
    }
}


export const postClientMailCall = async (data) => {

    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-config-service/${config.apiVersion}/successful/onboarding`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: data
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

export const getRemittanceSettingShow = async (clientId) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/client-config-service/${config.apiVersion}/remittance/setting?clientId=${clientId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        });
        return response.data;
    } catch (error) {
        return { ...error.response.data };
    }
}

export const updateRemittanceSettingShow = async (data) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/client-config-service/${config.apiVersion}/remittance/setting`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data
        });
        return response.data;
    } catch (error) {
        return { ...error.response.data };
    }
}

