import Cookies from 'universal-cookie'
import axios from 'axios'
import config from '~/config'
import { getAccessToken } from '~/redux/helpers/user'

/*
Get Loggin user information
*/

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
        window.location.href = "/"
    }
    return error.response;
});

export const userInfo = () => async (dispatch) => {
    try {
        let cookies = new Cookies(window.document.cookie);
        const accessToken = await getAccessToken();
        const clientId = cookies.get('@userId');

        if (accessToken) {
            const response = await axios({
                url: `${config.apiBase}/user-service/v1/user/${clientId}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            })
            const responseBody = await response.data;
            if (responseBody.error == false) {
                const { isFirstLogin, userData } = responseBody.data;
                //const portalProfileId = userInfo && userInfo.UserRoles && userInfo.UserRoles[0].portalProfileId || null ;
                //cookies.set('@accessToken', token);
                //cookies.set('@refreshToken', refresh_token)
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: {
                        ...userData,
                        isFirstLogin: isFirstLogin,
                    }
                })
                return true;
            }
            dispatch({
                type: 'LOGIN_FAILED',
                payload: responseBody.message || "Oops! Something went wrong."
            })
            return false;
        }
    } catch (error) {
        dispatch({
            type: 'LOGIN_FAILED',
            payload: error.response && error.response.data.message || "An error has occurred."
        })
        return false;
    }
}

/*
Login
*/
export const login = (credentials) => async (dispatch) => {
    try {
        let cookies = new Cookies(window.document.cookie);
        const response = await axios({
            url: `${config.apiBase}/user-service/v1/login`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            data: JSON.stringify(credentials)
        })
        const responseBody = await response.data
        if (responseBody.error == false) {
            const { accesstoken, isFirstLogin, userData } = responseBody.data;
            //const portalProfileId = userData && userData.UserRoles && userData.UserRoles[0].portalProfileId || null ;
            cookies.set('@accessToken', accesstoken, { path: '/' });
            cookies.set('@userId', userData.userId, { path: '/' });
            cookies.set('@portalTypeId', userData.portalTypeId, { path: '/' });

            //cookies.set('@refreshToken', refresh_token)
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                    ...userData,
                    isFirstLogin: isFirstLogin,
                }
            })
            return true;
        }

        dispatch({
            type: 'LOGIN_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'LOGIN_FAILED',
            payload: error.response && error.response.data.message || "An error has occurred."
        })
        return false;
    }
}

/*
first time login user update password with security answer
*/
export const setNewPassword = (credentials) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/user-service/v1/first-time-login-info`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            data: JSON.stringify(credentials)
        })
        const responseBody = await response.data
        if (responseBody.error == false) {
            const { isFirstLogin, userData } = responseBody.data;
            // dispatch({
            //     type: 'UPDATE_PASSWORD_SUCCESS',
            //     payload: {
            //         isFirstLogin: false
            //     }
            // })
            dispatch({
                type: 'UPDATE_PASSWORD_SUCCESS',
                payload: {
                    ...userData,
                    isFirstLogin: isFirstLogin,
                }
            })
            return true;
        }
        dispatch({
            type: 'UPDATE_PASSWORD_FAILED',
            payload: responseBody.message || 'Oops! Something went wrong.'
        })
        return false;

    } catch (error) {
        dispatch({
            type: 'UPDATE_PASSWORD_FAILED',
            payload: error.response && error.response.data.message || "An error has occurred."
        })
        return false;
    }
}

/*
reset password
*/
export const resetPassword = ({ password, token }) => async (dispatch) => {
    try {
        let cookies = new Cookies(window.document.cookie);
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/user-service/v1/reset-password?passwordResetCode=${token}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            data: JSON.stringify({
                updatedPassword: password || null
            })
        })
        const responseBody = await response.data
        if (responseBody.error == false) {
            const { accesstoken, isFirstLogin, userData } = responseBody.data;
            cookies.set('@accessToken', accesstoken, { path: '/' });
            cookies.set('@portalTypeId', userData.portalTypeId, { path: '/' });
            //cookies.set('@refreshToken', refresh_token)
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                    ...userData,
                    isFirstLogin: isFirstLogin,
                }
            })
            return true;
        }
        dispatch({
            type: 'LOGIN_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'LOGIN_FAILED',
            payload: error.response && error.response.data.message || "An error has occurred."
        })
        return false;
    }
}

/*
Forgot password
*/
export const forgotPassword = ({ loginId }) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/user-service/v1/forgot-password`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,

            },
            data: JSON.stringify({
                login: loginId
            })
        })
        const responseBody = await response.data
        if (responseBody.error == false) {
            dispatch({
                type: 'FORGOT_PASSWORD_SUCCESS',
                payload: {}
            })
            return true;
        }
        dispatch({
            type: 'FORGOT_PASSWORD_FAILED',
            payload: responseBody.message || 'Oops! Something went wrong.'
        })
        return false;

    } catch (error) {
        dispatch({
            type: 'FORGOT_PASSWORD_FAILED',
            payload: error.response && error.response.data.message || "An error has occurred."
        })
        return false;
    }
}

/*
Logout
*/
export const logout = () => {
    let cookies = new Cookies(window.document.cookie)
    cookies.remove('@accessToken')
    cookies.remove('@refreshToken')
    cookies.remove('@portalTypeId')
    cookies.remove('@userId')
    return {
        type: 'LOGOUT_SUCCESS',
        payload: {}
    }
}

/*
Get user list
*/
export const fetchUserList = ({ portalProfileId, portalTypeId, name, phone, email, role, pageNo, pageSize, sortColumn, sortOrder }) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/user-service/v1/user-search?portalProfileId=${portalProfileId}&portalTypeId=${portalTypeId}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            data: JSON.stringify({
                displayName: name || "",
                email: email || "",
                phone: phone || "",
                roleId: role || null,
                pageNo: pageNo || 1,
                pageSize: pageSize || 10,
                sortColumn: sortColumn || "",
                sortOrder: sortOrder || ""
            })
        })

        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'USER_LIST_FETCH_SUCCESS',
                payload: responseBody.data.userInfo,
                totalCount: responseBody.data.TotalCount || 0
            })
            return true;
        }
        dispatch({
            type: 'USER_LIST_FETCH_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'USER_LIST_FETCH_FAILED',
            payload: error.response && error.response.data.message || "An error has occurred."
        })
        return false;
    }
}

/*
Create new user
*/
export const createUser = ({ portalProfileId, portalTypeId, user }) => async dispatch => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/user-service/v1/user?portalProfileId=${portalProfileId}&portalTypeId=${portalTypeId}`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`,
            },
            data: JSON.stringify({
                title: user.title || "",
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                userName: user.isSSO == true ? null : (user.login || ""),
                password: user.isSSO == true ? null : (user.newPassword || ""),
                isSSO: user.isSSO || false,
                SSOUserId: user.isSSO == true ? null : (user.SSOUserId || null),
                securityQuestionId: user.isSSO == true ? null : (user.securityQuestionId || null),
                securityAnswer: user.isSSO == true ? null : (user.securityAnswer || ""),
                phoneCountryCode: user.phoneCountryCode || null,
                phone: user.phone || null,
                phoneExt: user.phoneExt || null,
                email: user.email || "",
                //roleId: user.RoleID.split(',').map(Number) || []
                roleId: user.roleId || [],
                isFirstUser: false,
            })
        });

        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'CREATE_ADMIN_USER_SUCCESS',
                payload: { ...user, userId: responseBody.data.userId },//add userID from response
            })
            return true
        }
        dispatch({
            type: 'CREATE_ADMIN_USER_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'CREATE_ADMIN_USER_FAILED',
            payload: error.response && error.response.data.message || "An error has occurred."
        })
        return false;
    }
};

/*
Update user details
*/
export const updateUserDetails = ({ portalProfileId, portalTypeId, user }) => async dispatch => {

    /* dispatch({
                 type: 'UPDATE_USER_DETAILS_SUCCESS',
                 payload: user,
             })
             return true;*/
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/user-service/v1/user?portalProfileId=${portalProfileId}&portalTypeId=${portalTypeId}`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`,
            },
            data: JSON.stringify({
                userId: user.userId || 0,
                title: user.title || "",
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                userName: user.login || "",
                password: user.password != user.newPassword ? user.newPassword : null,
                isSSO: user.isSSO || false,
                SSOUserId: user.SSOUserId || null,
                securityQuestionId: user.securityQuestionId || null,
                securityAnswer: user.securityAnswer || "",
                phoneCountryCode: user.phoneCountryCode || null,
                phone: user.phone || null,
                phoneExt: user.phoneExt || null,
                email: user.email || "",
                //roleId: user.RoleID.split(',').map(Number) || []
                roleId: user.roleId || [],
                isFirstUser: false,
            })
        });

        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'UPDATE_USER_DETAILS_SUCCESS',
                payload: { ...user, pWDHash: user.NewPassword },
            })
            return true;
        }
        dispatch({
            type: 'UPDATE_USER_DETAILS_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'UPDATE_USER_DETAILS_FAILED',
            payload: error.response && error.response.data.message || "An error has occurred."
        })
        return false;
    }
};

/*
Get security questions list
*/
export const fetchSecurityQuestions = () => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/user-service/v1/securityQuestions`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        })
        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'SQ_LIST_FETCH_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'SQ_LIST_FETCH_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'SQ_LIST_FETCH_FAILED',
            payload: error.response && error.response.data.message || "An error has occurred."
        })
        return false;
    }
}

export const lockUser = ({ userId, isLocked }) => async dispatch => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/user-service/v1/user-lock?userId=${userId}&isLocked=${isLocked}`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`,
            }
        })
        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'LOCK_USER_DETAILS_SUCCESS',
                payload: { userId: userId, isLocked: isLocked },
            })
            return true;
        }
        dispatch({
            type: 'LOCK_USER_DETAILS_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'LOCK_USER_DETAILS_FAILED',
            payload: error.response && error.response.data.message || "An error has occurred."
        })
        return false;
    }
};
export const removeUser = ({ userId }) => async dispatch => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/user-service/v1/user?userId=${userId}`,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`,
            }
        });

        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'REMOVE_USER_DETAILS_SUCCESS',
                payload: { userId: userId },
            })
            return true;
        }
        dispatch({
            type: 'REMOVE_USER_DETAILS_FAILED',
            payload: responseBody.message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'REMOVE_USER_DETAILS_FAILED',
            payload: error.response && error.response.data.message || "An error has occurred."
        })
        return false;
    }
};