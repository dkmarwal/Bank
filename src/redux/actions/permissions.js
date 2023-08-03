import Cookies from "universal-cookie";
import axios from "axios";
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

export const fetchUserPermissionsMinified = ({ UserId }) => async dispatch => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/client/permission/list`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
               'pragma': 'no-cache',
            },
            data: JSON.stringify({
                UserId: UserId
            })
        });

        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'USER_PERMISSIONS_MINI_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'USER_PERMISSIONS_MINI_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'USER_PERMISSIONS_MINI_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
};

export const fetchClientPermissionsSpecificToUser = ({ portalProfileId, userId, clientId }) => async dispatch => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/user-service/${config.apiVersion}/bank/accesses/user?bankId=${portalProfileId}&userId=${userId}&clientId=${clientId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
               'pragma': 'no-cache',
            }
        });

        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'CLIENT_PERMISSION_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'CLIENT_PERMISSION_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'CLIENT_PERMISSION_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
};

export const updateClientPermissionsSpecificToUser = (accessDetails) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            //url: `${config.apiBase}/client/bank/portal/accesses/rights?bankId=${accessDetails.portalProfileId}&userId=${accessDetails.userId}&clientId=${accessDetails.clientId}`,
            url: `${config.apiBase}/user-service/${config.apiVersion}/bank/portal/accesses/rights?bankId=${accessDetails.portalProfileId}&userId=${accessDetails.userId}&clientId=${accessDetails.clientId}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
               'Authorization': `Bearer ${accessToken}`,
               'pragma': 'no-cache',
            },
            data: JSON.stringify({
                "accessRightMappingIds": accessDetails.permissions
            })

        })
        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'UPDATE_CLIENT_PERMISSION_SUCCESS',
                payload: accessDetails,
            })
            return {
                message: responseBody.message
            };
        }
        dispatch({
            type: 'UPDATE_CLIENT_PERMISSION_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;

    } catch (error) {
        dispatch({
            type: 'UPDATE_CLIENT_PERMISSION_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}
