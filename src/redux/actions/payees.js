import Cookies from "universal-cookie";
import axios from "axios";
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

/*
Get payee list
*/
export const fetchPayeesList = (data) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/payee-service/v1/cc-payee-listing-info`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data:data
            //  JSON.stringify({
            //     status: data?.status || "", // Enrolled, Pending, Declined
            //     campaignVendorId: data?.campaignVendorId || "",
            //     payeeName: data?.payeeName || "",
            //     payeeId: data?.payeeId || "",
            //     payerName: data?.payerName || "",
            //     minValue:data?.minValue || "",
            //     maxValue: data?.maxValue || "",
            //     expectedResult: data?.expectedResult || "",
            //     // clientId:"22222",
            //     campaignId:data.campaignId || "",      
            //     toDate:data.toDate || "",      
            //     fromDate:data.fromDate || "",
            //     payeeStatus: data?.payeeStatus || "",
            //     selectedCurrency: data?.selectedCurrency || "",
            //     declineReason:data?.declineReason || "",
            //     limit: data?.limit || 10,
            //     offset: data?.offset || 0,
            // })
        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'PAYEES_LIST_FETCH_SUCCESS',
                payload: responseBody?.data || [],
            })
            return true;
        }
        dispatch({
            type: 'PAYEES_LIST_FETCH_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'PAYEES_LIST_FETCH_FAILED',
            payload: (error.response && error.response.data.message) || "An error has occurred."
        })
        return false;
    }
}

/*
Get Onboarding source list
*/
export const fetchColumnsList = (statusKey) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/payee-service/v1/getColumSettingInfo?status=${statusKey}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'FETCH_COLUMN_LIST_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'FETCH_COLUMN_LIST_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'FETCH_COLUMN_LIST_FAILED',
            payload: (error.response && error.response.data.message) || "An error has occurred."
        })
        return false;
    }
}

/*
Get Onboarding source list
*/
export const fetchOnboardingSrcList = () => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/payee-service/v1/getCampaignVendorList`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'ONBOARDING_SRC_LIST_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'ONBOARDING_SRC_LIST_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'ONBOARDING_SRC_LIST_FAILED',
            payload: (error.response && error.response.data.message) || "An error has occurred."
        })
        return false;
    }
}

/*
Get Expected Result list
*/
export const fetchResultsList = () => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/payee-service/v1/cc-getExpectedResultInfo`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'RESULT_LIST_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'RESULT_LIST_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'RESULT_LIST_FAILED',
            payload: (error.response && error.response.data.message) || "An error has occurred."
        })
        return false;
    }
}

/*
Get Declined Reason list
*/
export const fetchDeclinedReasonList = () => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/payee-service/v1/cc-declined-reason`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'DECLINED_LIST_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'DECLINED_LIST_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'DECLINED_LIST_FAILED',
            payload: (error.response && error.response.data.message) || "An error has occurred."
        })
        return false;
    }
}

/*
Get Substatus Reason list
*/
export const fetchSubStatusList = () => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/payee-service/v1/cc-payee-status`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'STATUS_LIST_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'STATUS_LIST_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'STATUS_LIST_FAILED',
            payload: (error.response && error.response.data.message) || "An error has occurred."
        })
        return false;
    }
}

/*
Get Campaign list
*/
export const fetchCampaignList = (selectedVendorId) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/payee-service/v1/getCampaignsByVendor?campaignVendorId=${selectedVendorId.toString().trim()}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'CAMPAIGN_LIST_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'CAMPAIGN_LIST_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'CAMPAIGN_LIST_FAILED',
            payload: (error.response && error.response.data.message) || "An error has occurred."
        })
        return false;
    }
}

/*
Get Vendor list
*/
export const fetchVendorList = () => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/payee-service/v1/getCampaignVendorList`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'VENDOR_LIST_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'VENDOR_LIST_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'VENDOR_LIST_FAILED',
            payload: (error.response && error.response.data.message) || "An error has occurred."
        })
        return false;
    }
}

/*
Get Declined Data
*/
export const fetchDeclinedData = (selectedVendorId, selectedCampaignId) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/payee-service/v1/getDeclinedPayeesGraph?campaignVendorId=${selectedVendorId.toString().trim()}&ccCampaignId=${selectedCampaignId.toString().trim()}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'DECLINED_DATA_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'DECLINED_DATA_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'DECLINED_DATA_FAILED',
            payload: (error.response && error.response.data.message) || "An error has occurred."
        })
        return false;
    }
}

/*
Get Pending Data
*/
export const fetchPendingData = (selectedVendorId, selectedCampaignId) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/payee-service/v1/getPendingPayeesGraph?campaignVendorId=${selectedVendorId.toString().trim()}&ccCampaignId=${selectedCampaignId.toString().trim()}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'PENDING_DATA_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'PENDING_DATA_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'PENDING_DATA_FAILED',
            payload: (error.response && error.response.data.message) || "An error has occurred."
        })
        return false;
    }
}