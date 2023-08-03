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
Get validation list
*/
export const fetchValidationList = ({ userId, portalProfileId, portalTypeId }) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/payee-service/${config.apiVersion}/validation-types`,
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
                type: 'VALIDATION_LIST_FETCH_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'VALIDATION_LIST_FETCH_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'VALIDATION_LIST_FETCH_FAILED',
            payload: (error.response && error.response.data.message) || "An error has occurred."
        })
        return false;
    }
}

/*
Get campaign list
*/
export const fetchCampaignList = ({ payerId, userId, portalProfileId, portalTypeId }) => async (dispatch) => {
/*const data=[{
                "campaignId": "129",
                "campaignName": "My Campaign",
                "clientId": 956579174,
                "startDate": "2020-09-01T08:41:22.000Z",
                "endDate": "2020-09-01T08:41:22.000Z",
                "implementationProgram": "FULL_PMTX",
                "campaignType": 1,
                "isActive": 1,
                "totalSuppliers": 1,
                "totalEnrolled": 0
            }, {
                "campaignId": "9909",
                "campaignName": "My Campaign",
                "clientId": 956579174,
                "startDate": "2020-09-01T08:41:22.000Z",
                "endDate": "2020-09-01T08:41:22.000Z",
                "implementationProgram": "FULL_PMTX",
                "campaignType": 1,
                "isActive": 1,
                "totalSuppliers": 1,
                "totalEnrolled": 0
            }, {
                "campaignId": "409",
                "campaignName": "My Campaign",
                "clientId": 956579174,
                "startDate": "2020-09-01T08:41:22.000Z",
                "endDate": "2020-09-01T08:41:22.000Z",
                "implementationProgram": "FULL_PMTX",
                "campaignType": 1,
                "isActive": 1,
                "totalSuppliers": 1,
                "totalEnrolled": 0
            }, {
                "campaignId": "509",
                "campaignName": "My Campaign",
                "clientId": 956579174,
                "startDate": "2020-09-01T08:41:22.000Z",
                "endDate": "2020-09-01T08:41:22.000Z",
                "implementationProgram": "FULL_PMTX",
                "campaignType": 1,
                "isActive": 1,
                "totalSuppliers": 1,
                "totalEnrolled": 1
            }, {
                "campaignId": "609",
                "campaignName": "My Campaign",
                "clientId": 956579174,
                "startDate": "2020-09-01T08:41:22.000Z",
                "endDate": "2020-09-01T08:41:22.000Z",
                "implementationProgram": "FULL_PMTX",
                "campaignType": 1,
                "isActive": 1,
                "totalSuppliers": 1,
                "totalEnrolled": 1
            }, {
                "campaignId": "976",
                "campaignName": "My Campaign",
                "clientId": 956579174,
                "startDate": "2020-09-01T08:41:22.000Z",
                "endDate": "2020-09-01T08:41:22.000Z",
                "implementationProgram": "FULL_PMTX",
                "campaignType": 1,
                "isActive": 1,
                "totalSuppliers": 1,
                "totalEnrolled": 0
            }, {
                "campaignId": "604",
                "campaignName": "My Campaign",
                "clientId": 956579174,
                "startDate": "2020-09-01T08:41:22.000Z",
                "endDate": "2020-09-01T08:41:22.000Z",
                "implementationProgram": "FULL_PMTX",
                "campaignType": 1,
                "isActive": 1,
                "totalSuppliers": 1,
                "totalEnrolled": 1
            }
        ];
         dispatch({
                type: 'CAMPAIGN_LIST_FETCH_SUCCESS',
                payload: data,
            })
            return true;*/
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/payee-service/v1/campaigns?clientId=${payerId}`,
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
                type: 'CAMPAIGN_LIST_FETCH_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'CAMPAIGN_LIST_FETCH_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'CAMPAIGN_LIST_FETCH_FAILED',
            payload: (error.response && error.response.data.message) || "An error has occurred."
        })
        return false;
    }
}

/*
Get Offer type list
*/
export const fetchOfferTypes = ({ campaignType }) => async (dispatch) => {
/*
    const data= [
            {
                value: 'ACH',
                name: "ACH",
            }, {
                value: 'VCA',
                name: "VCA",
            }, 
        ];
    dispatch({
            type: 'CAMPAIGN_TYPE_LIST_FETCH_SUCCESS',
            payload: data,
        })
        return true;
 */   
 
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/payee-service/v1/offer-types?campaignType=${campaignType}`,
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
                type: 'CAMPAIGN_TYPE_LIST_FETCH_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'CAMPAIGN_TYPE_LIST_FETCH_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'CAMPAIGN_TYPE_LIST_FETCH_FAILED',
            payload: (error.response && error.response.data.message) || "An error has occurred."
        })
        return false;
    }
}

/*
Get Payer list
*/
export const fetchPayerList = ({ userId, appType, portalProfileId, portalTypeId, payerTypeId }) => async (dispatch) => {
    const newAppType = appType?`&appType=${appType}`:"";
    const newPayerTypeId = payerTypeId?`&payerTypeId=${payerTypeId}`:"";
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client-service/${config.apiVersion}/list?bankId=1&isOnboarded=true${newAppType}${newPayerTypeId}`,
            //url: `${config.apiBase}/client-service/v1/list`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'PAYER_LIST_FETCH_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'PAYER_LIST_FETCH_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'PAYER_LIST_FETCH_FAILED',
            payload: (error.response && error.response.data.message) || "An error has occurred."
        })
        return false;
    }
}

/*
Create new campaign
*/
export const createCampaign = ({ portalProfileId, portalTypeId, userId, supplierFile, selectedPayer, autoloadEnabled, micrositesEnabled, PAFEnabled, PVTEnabled, introText, validationEnabled, campaign, offers}) => async dispatch => {
    try {
        
        var formData = new FormData();
        formData.append('file', supplierFile);
        formData.append("isAutoload", autoloadEnabled === 1? true: false);
        formData.append("isMicrosite",micrositesEnabled=== 1? true: false);
        formData.append("isPafRequired",PAFEnabled === "yes"? true: false);
        formData.append("isPennyTestRequired",PVTEnabled === "yes"? true: false);
        formData.append("introductionText",introText || null);
        formData.append("isValidationRequired",validationEnabled === "yes"? true: false);
        formData.append("clientId",selectedPayer|| null);
        formData.append("campaignId", (campaign && campaign.campaignName) || null);
        formData.append("campaignType",(campaign && campaign.campaignType) || null);
        formData.append("phoneNumber", (campaign && campaign.phone) || null);
        formData.append("phoneCountryCode",(campaign && campaign.phoneCountryCode) || null);
        formData.append("phoneExt", (campaign && campaign.phoneExt) || null);
        formData.append("email", (campaign && campaign.email) || null);
        formData.append("numberOfOffers", (offers && offers.length) || 0);
        formData.append("offers", JSON.stringify(offers) || []);
        formData.append("campaignCurrency", (campaign && campaign.currency) || null);
        formData.append("campaignCountry", (campaign&&campaign.country) || null);

        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/payee-service/v1/load-campaign`,
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
             data: formData,
        });

        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'CREATE_CAMPAIGN_SUCCESS',
                payload:{ },
            })
            return true;
        }
        dispatch({
            type: 'CREATE_CAMPAIGN_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'CREATE_CAMPAIGN_FAILED',
            payload: (error.response && error.response.data.message) || "An error has occurred."
        })
        return false;
    }
};

/*
Get campaign list by client id
*/
export const fetchCampaignListByClientId = ({ userId, portalProfileId, portalTypeId }) => async (dispatch) => {

    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/payee-service/v1/campaign/detail/list`,
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
                type: 'CAMPAIGN_LIST_FETCH_SUCCESS',
                payload: {
                    campaignList: (responseBody.data && responseBody.data.campaigns) || [],
                    totalCount: (responseBody.data && responseBody.data.totalcount) || 0
                },
            })
            return true;
        }
        dispatch({
            type: 'CAMPAIGN_LIST_FETCH_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'CAMPAIGN_LIST_FETCH_FAILED',
            payload: (error.response && error.response.data.message) || "An error has occurred."
        })
        return false;
    }
}