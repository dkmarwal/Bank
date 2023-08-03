import Cookies from 'universal-cookie';
import axios from 'axios';
import config from '~/config';
import { getAccessToken } from '~/redux/helpers/user';
import currency from 'currency.js';
import { BottomNavigationAction } from '@material-ui/core';
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

export const getGeneralConfigInfo = (clientId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/general/profile/configuration?clientId=${clientId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        const { status, message, data } = response.data;

        if (status === 'SuccessFull') {
            dispatch({
                type: 'GET_GENERAL_CONFIG_INFO',
                payload: data[0],
            })
            return true;
        }
        dispatch({
            type: 'GET_GENERAL_INFO_FAILED',
            payload: message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'GET_GENERAL_INFO_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const updateGeneralConfigInfo = (data) => async (dispatch) => {
    try {
        dispatch({
            type: 'UPDATE_GENERAL_CONFIG_INFO',
            payload: data,
        })
    } catch {
        dispatch({
            type: 'GET_COMPANY_INFO_FAILED',
            payload: data,
        })

    }
}

export const saveGeneralConfigInfo = (clientId) => async (dispatch, getState) => {
    try {
        const { clientConfig: { generalConfigInfo } } = getState();
        // const accessToken = cookies.get('@accessToken');
        const {
            GeneralProfileID,
            ClientID,
            IsAutoApproveFile,
            ReportFileFormat,
            ReconciliationReportTime,
            IsPaymentFileUploadsEnable,
            IsAcknowledgeIncomingFIle,
            PaymentDecisionEngine,
            PaymentExpieryDays,
            HonorDate,
            IsHIPAA,
            IsUpdatesSupplierProfile,
            IsApproveSupplierProfile,
            IsUploadMasterVendorfile,
            IsSupplierPlatformTnC,
            IsSuppliersDualFactorAuthentication,
        } = generalConfigInfo;
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/general/profile/configuration?clientId=${clientId}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({
                "generalProfileID": GeneralProfileID,
                "isAutoApproveFile": IsAutoApproveFile,
                "reportFileFormat": ReportFileFormat,
                "reconciliationReportTime": ReconciliationReportTime,
                "isPaymentFileUploadsEnable": IsPaymentFileUploadsEnable,
                "isAcknowledgeIncomingFIle": IsAcknowledgeIncomingFIle,
                "paymentDecisionEngine": PaymentDecisionEngine.toString(),
                "paymentExpieryDays": PaymentExpieryDays,
                "honorDate": HonorDate,
                "isHIPAA": IsHIPAA,
                "isUpdatesSupplierProfile": IsUpdatesSupplierProfile,
                "isApproveSupplierProfile": IsApproveSupplierProfile,
                "isUploadMasterVendorfile": IsUploadMasterVendorfile,
                "isSupplierPlatformTnC": IsSupplierPlatformTnC,
                "isSuppliersDualFactorAuthentication": IsSuppliersDualFactorAuthentication
            })

        })
        const { status, message, data } = response.data;
        if (status === 'SuccessFull') {
            dispatch({
                type: 'SAVE_COMPANY_INFO_SUCCESS',
            })
            return true;
        }
        dispatch({
            type: 'SAVE_COMPANY_INFO_FAILED',
            payload: message || "Oops! Something went wrong."
        })
        return false;

    } catch (error) {
        dispatch({
            type: 'SAVE_COMPANY_INFO_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const getRemittanceConfigInfo = (clientId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/remittance/information?clientId=${clientId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        const { status, message, data } = response.data;
        const { deliveryMode, parameters, format } = data

        const deliveryModeArr = deliveryMode.map(({ RemittanceDeliveryModeID }) => RemittanceDeliveryModeID);
        const formatArr = format.map(({ RemittanceFormatID }) => RemittanceFormatID);
        if (status === 'SuccessFull') {
            dispatch({
                type: 'GET_REMITTANCE_CONFIG_INFO',
                payload: { 'formatIds': formatArr, 'deliveryModeIds': deliveryModeArr, ...parameters[0] },
            })
            return true;
        }
        dispatch({
            type: 'GET_REMITTANCE_CONFIG_FAILED',
            payload: message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'GET_REMITTANCE_CONFIG_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const updateRemittanceConfigInfo = (data) => async (dispatch) => {
    try {
        dispatch({
            type: 'UPDATE_REMITTANCE_CONFIG_INFO',
            payload: data,
        })
    } catch {
        dispatch({
            type: 'GET_REMITTANCE_CONFIG_FAILED',
            payload: data,
        })

    }
}

export const saveRemittanceConfigInfo = (clientId) => async (dispatch, getState) => {
    try {
        const { clientConfig: { remittanceConfigInfo } } = getState();
        const accessToken = cookies.get('@accessToken');
        const {
            RemittanceFormatID,
            FormatName,
            RemittanceDeliveryModeID,
            DeliveryModeName,
            RemittanceParameterID,
            ClientID,
            IsPaymentID,
            IsAmount,
            IsPaymentType,
            IsClientID,
            IsValueDate,
            IsPaymentReference,
            IsInvoiceNo,
            IsInvoiceDate,
            IsInvoiceGrossAmount,
            IsDiscountAmount,
            IsPurchaseOrder,
            IsAmountPaid,
            IsAdjustmentAmount,
            IsAdjustmentCode,
        } = remittanceConfigInfo;

        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/client/remittance/parameters`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({
                clientID: ClientID,
                isPaymentID: IsPaymentID,
                isAmount: IsAmount,
                isPaymentType: IsPaymentType,
                isClientID: IsClientID,
                isValueDate: IsValueDate,
                isPaymentReference: IsPaymentReference,
                isInvoiceNo: IsInvoiceNo,
                isInvoiceDate: IsInvoiceDate,
                isInvoiceGrossAmount: IsInvoiceGrossAmount,
                isAmountPaid: IsAmountPaid,
                isDiscountAmount: IsDiscountAmount,
                isPurchaseOrder: IsPurchaseOrder,
                isAdjustmentAmount: IsAdjustmentAmount,
                isAdjustmentCode: IsAdjustmentCode,
            })
        });

        const { status, message, data } = response.data;
        if (status === 'SuccessFull') {
            dispatch({
                type: 'SAVE_REMITTANCE_CONFIG_INFO',
            })
            return true;
        }
        dispatch({
            type: 'SAVE_REMITTANCE_CONFIG_FAILED',
            payload: message || "Oops! Something went wrong."
        })
        return false;

    } catch (error) {
        dispatch({
            type: 'SAVE_REMITTANCE_CONFIG_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}



export const addClientLegalEntityInfo = (clientId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/legal/entity/information?clientId=${clientId}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({
            })
        })
        const { status, message, data } = response.data;
        if (status === 'SuccessFull') {
            dispatch({
                type: 'UPDATE_CLIENT_ENTITY_INFO',
                payload: data,
            })
            return true;
        }
        dispatch({
            type: 'UPDATE_CLIENT_ENTITY_ERROR',
            payload: message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'UPDATE_CLIENT_ENTITY_ERROR',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}
