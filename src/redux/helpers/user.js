import Cookies from 'universal-cookie'
import axios from 'axios'
import config from '~/config'
const cookies = new Cookies(window.document.cookie)

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

export const getAccessToken = async () => {
    const refreshToken = cookies.get('@refreshToken');
    const accessToken = cookies.get('@accessToken')
    if (accessToken) {
        return accessToken
    }
    if (refreshToken) {
        try {
            const response = await axios({
                url: `${config.apiBase}/oauth/token?refreshToken=${refreshToken}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'pragma': 'no-cache',
                }
            })
            const responseBody = await response.data
            cookies.set('@accessToken', responseBody.accessToken)
            return responseBody.accessToken
        } catch (error) {
            return null
        }
    }
    return null
}

export const fetchSecurityQuestion = async (userName, portalTypeId) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/user-service/${config.apiVersion}/user/security-question`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'pragma': 'no-cache',
            },
            data: JSON.stringify({
                userName: userName,
                portalTypeId: portalTypeId
            })
        });
        const responseBody = await response.data;
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                "An error has occured.",
            data: {},
            error: true,
        };
    }
}

export const fetchUserProfileDetails = async (clientId) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/user-service/${config.apiVersion}/user-profile/${clientId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        });
        const responseBody = await response.data;
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};

export const updateUserPassword = async (payload) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/user-service/${config.apiVersion}/user-profile/password`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(payload),
        });
        const responseBody = await response.data;
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};


export const updateUserProfileDetails = async (payload) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/user-service/${config.apiVersion}/user-profile`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({
                SSOUserId: payload?.SSOUserId || null,
                email: payload?.email || null,
                firstName: payload?.firstName || null,
                isSSO: payload?.isSSO || 0,
                lastName: payload?.lastName || null,
                locale: payload?.locale || null,
                phone: payload?.phone || null,
                phoneCountryCode: payload?.phoneCountryCode || null,
                phoneExt: payload?.phoneExt || null,
                securityAnswer: payload?.securityAnswer || null,
                securityQuestionId: payload?.securityQuestionId || null,
                title: payload?.title || null,
                userId: payload?.userId || null,
                userName: payload?.userName || null
            }),
        });
        const responseBody = await response.data;
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};

export const fetchSecurityQuestions = async () => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/user-service/${config.apiVersion}/securityQuestions?portalTypeId=1`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        });
        const responseBody = await response.data;
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};


export const fetchSSODetails = async () => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/user-service/${config.apiVersion}/sso`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        });
        const responseBody = await response.data;
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};


export const fetchPortalAccessDetails = async (bankId) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/user-service/${config.apiVersion}/bank/portal/access?bankId=${bankId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        });
        const responseBody = await response.data;
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                "An error has occured.",
            data: {},
            error: true,
        };
    }
}

export const checkSessionTimout = async ({ portalTypeId }) => {
    const cookies = new Cookies(window.document.cookie);
    const refreshToken = cookies.get('@refreshToken');
    const accessToken = cookies.get('@accessToken');
    const clientId = cookies.get("@userId");

    if (accessToken) {
        try {
            const response = await axios({
                url: `${config.apiBase}/identity-service/${config.apiVersion}/session/validation?portalTypeId=${portalTypeId}`,
                //url: `${config.apiBase}/user-service/v1/user/${clientId}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'pragma': 'no-cache',
                }
            })
            const responseBody = await response.data;
            if (responseBody.error == false) {
                if (responseBody.data == true) {
                    return true;
                }
            }
            return false
        } catch (error) {
            return false
        }
    }
    return false
}

//Update token/session time
export const keepSessionLive = async () => {
    const cookies = new Cookies(window.document.cookie);
    const accessToken = cookies.get('@accessToken');
    const refreshToken = cookies.get('@refreshToken');

    if (refreshToken) {
        try {
            const response = await axios({
                url: `${config.apiBase}/user-service/${config.apiVersion}/access/token`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'refreshToken': `${refreshToken}`,
                    'pragma': 'no-cache',
                }
            })
            const responseBody = await response.data;
            if (responseBody.error == false) {
                const { accessToken, refreshToken } = responseBody.data;
                cookies.set('@accessToken', accessToken, { path: `${config.baseName}/`, });
                cookies.set('@refreshToken', refreshToken, { path: `${config.baseName}/`, });
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }
    return false;
}

export const checkLoggedIn = async () => {
    let cookies = new Cookies(window.document.cookie);
    const accessKey = cookies.get('@accessToken');

    if (accessKey) {
        return true;
    } else {
        return false;
    }
}