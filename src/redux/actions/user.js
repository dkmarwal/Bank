import Cookies from "universal-cookie";
import axios from "axios";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";
import { BankType } from '~/config/bankTypes';

/*
Get Loggin user information
*/
axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    // Do something with response error
    if (error.response.status == 401) {
      let cookies = new Cookies();
      cookies.remove("@accessToken", { path: `${config.baseName}/` });
      cookies.remove("@refreshToken", { path: `${config.baseName}/` });
      cookies.remove("@portalTypeId", { path: `${config.baseName}/` });
      cookies.remove("@userId", { path: `${config.baseName}/` });
      window.location.href = `${config.baseName}/sessionout`;
    }
    return error.response;
  }
);

export const userInfo = () => async (dispatch) => {
  /*dispatch({
    type: "LOGIN_SUCCESS",
    payload: {
      isFirstLogin: true,
      userId: 3928,
      title: "Mr",
      firstName: "team",
      lastName: "ui",
      userName: "divyanshu",
      email: "a@a.com",
      phone: "9999999999",
      phoneExt: null,
      fax: null,
      isLocked: false,
      isSSO: false,
      SSOUserId: null,
      isFirstUser: true,
      displayName: "team ui",
      successfullLoginAt: "2020-10-30T07:56:52.000Z",
      portalTypeId: 1,
      phoneCountryCode: "+1",
      isDfaApplied: null,
      dfaEmail: null,
      dfaPhone: null,
      dfaPhoneExt: null,
      dfaPhoneCountryCode: null,
      dfaType: null,
      dfaMobile: null,
      dfaMobileCountryCode: null,
      isActivePayee: true,
      roleId: [110],
      portalProfileId: 1,
    },
  });

  dispatch({
    type: "USER_PERMISSIONS_MINI_SUCCESS",
    payload: [56, 57, 58, 59, 60, 62, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71],
  });
  return true;*/
  try {
    let cookies = new Cookies(window.document.cookie);
    const accessToken = await getAccessToken();
    const clientId = cookies.get('@userId');

    if (accessToken) {
      const response = await axios({
        url: `${config.apiBase}/user-service/${config.apiVersion}/user/${clientId}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'pragma': 'no-cache',
        }
      })
      const responseBody = await response.data;
      if (!responseBody.error) {
        const { isFirstLogin, userData, userAccessIdList } = responseBody.data;
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            ...userData,
            isFirstLogin: isFirstLogin,
          }
        })
        dispatch({
          type: 'USER_PERMISSIONS_MINI_SUCCESS',
          payload: userAccessIdList
        })
        return true;
      }
      dispatch({
        type: 'LOGIN_FAILED',
        payload: {
          message: responseBody.message || "Oops! Something went wrong.",
          data: null
        }
      })
      return false;
    }
  } catch (error) {
    dispatch({
      type: 'LOGIN_FAILED',
      payload: {
        message: (error.response && error.response.data.message) || "An error has occurred.",
        data: null
      }
    })
    return false;
  }
};

/*
Login
*/
export const login = (credentials) => async (dispatch) => {

  /*
  dispatch({
   type: "LOGIN_SUCCESS",
   payload: {
     isFirstLogin: true,
     userId: 3928,
     title: "Mr",
     firstName: "team",
     lastName: "ui",
     userName: "divyanshu",
     email: "a@a.com",
     phone: "9999999999",
     phoneExt: null,
     fax: null,
     isLocked: false,
     isSSO: false,
     SSOUserId: null,
     isFirstUser: true,
     displayName: "team ui",
     successfullLoginAt: "2020-10-30T07:56:52.000Z",
     portalTypeId: 1,
     phoneCountryCode: "+1",
     isDfaApplied: null,
     dfaEmail: null,
     dfaPhone: null,
     dfaPhoneExt: null,
     dfaPhoneCountryCode: null,
     dfaType: null,
     dfaMobile: null,
     dfaMobileCountryCode: null,
     isActivePayee: true,
     roleId: [110],
     portalProfileId: 1,
   },
 });

 dispatch({
   type: "USER_PERMISSIONS_MINI_SUCCESS",
   payload: [56, 57, 58, 59, 60, 62, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71],
 });
 return true;*/
  try {
    let cookies = new Cookies(window.document.cookie);
    const response = await axios({
      url: `${config.apiBase}/user-service/${config.apiVersion}/login`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(credentials),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      const {
        accessToken,
        refreshToken,
        isFirstLogin,
        userData,
        userAccessIdList,
      } = responseBody.data;
      cookies.set("@accessToken", accessToken, { path: `${config.baseName}/` });
      cookies.set("@refreshToken", refreshToken, {
        path: `${config.baseName}/`,
      });
      cookies.set("@userId", userData.userId, { path: `${config.baseName}/` });
      cookies.set("@portalTypeId", userData.portalTypeId, {
        path: `${config.baseName}/`,
      });

      //cookies.set('@refreshToken', refresh_token)
      dispatch({
        type: "USER_PERMISSIONS_MINI_SUCCESS",
        payload: userAccessIdList,
      });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          ...userData,
          isFirstLogin: isFirstLogin,
        },
      });

      return true;
    }

    dispatch({
      type: 'LOGIN_FAILED',
      payload: {
        message:(responseBody && responseBody.message) || "Oops! Something went wrong.",
        data: responseBody && responseBody["data"]
      }
    })
    return false;
  } catch (error) {
    dispatch({
      type: "LOGIN_FAILED",
      payload: {
        message: (error.response && error.response.data.message) ||
          "An error has occurred.",
        data: null
      }
    });
    return false;
  }
};

/*
first time login user update password with security answer
*/
export const setNewPassword = (credentials) => async (dispatch) => {
  try {
    let cookies = new Cookies(window.document.cookie);
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/user-service/${config.apiVersion}/first-time-login-info`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(credentials),
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      // const { accessToken, refreshToken, isFirstLogin, userData} = responseBody.data;
      // cookies.set("@accessToken", accessToken, { path: `${config.baseName}/` });
      // cookies.set("@refreshToken", refreshToken, {
      //   path: `${config.baseName}/`,
      // });

      const {
        accessToken,
        refreshToken,
        userData,
        userAccessIdList,
      } = responseBody.data;
      cookies.set("@accessToken", accessToken, { path: `${config.baseName}/` });
      cookies.set("@refreshToken", refreshToken, {
        path: `${config.baseName}/`,
      });
      cookies.set("@userId", userData.userId, { path: `${config.baseName}/` });
      cookies.set("@portalTypeId", userData.portalTypeId, {
        path: `${config.baseName}/`,
      });

      // dispatch({
      //   type: "UPDATE_PASSWORD_SUCCESS",
      //   payload: {
      //     isFirstLogin: false,
      //   },
      // });
      // dispatch({
      //   type: 'UPDATE_PASSWORD_SUCCESS',
      //   payload: {
      //     ...userData,
      //     isFirstLogin: false,
      //   }
      // })
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          ...userData,
          isFirstLogin: false,
        },
      });
      dispatch({
        type: "USER_PERMISSIONS_MINI_SUCCESS",
        payload: userAccessIdList,
      });
      return true;
    }
    dispatch({
      type: "UPDATE_PASSWORD_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "UPDATE_PASSWORD_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
    });
    return false;
  }
};

/*
reset password
*/
export const resetPassword = ({
  password,
  securityQuestionId,
  securityAnswer,
  token,
}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/user-service/${config.apiVersion}/reset-password?passwordResetCode=${token}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        updatedPassword: password || null,
        securityQuestionId: securityQuestionId || null,
        securityAnswer: securityAnswer || "",
      }),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      // cookies.set("@accessToken", accessToken, { path: `${config.baseName}/` });
      // cookies.set("@refreshToken", refreshToken, {
      //   path: `${config.baseName}/`,
      // });
      // cookies.set("@portalTypeId", userData.portalTypeId, {
      //   path: `${config.baseName}/`,
      // });
      dispatch({
        type: "LOGIN_FAILED",
        payload: {
          message: responseBody.message,
          data: null
        },
      });
      return { error: false };
    }
    if (response.status == 403) {
      return { error: true, message: responseBody.message, data: "redirect" };
    }
    dispatch({
      type: "LOGIN_FAILED",
      payload: {
        message: responseBody.message || "Oops! Something went wrong.",
        data: null
      }
    });
    return { error: true, message: responseBody.message, data: "" };
  } catch (error) {
    dispatch({
      type: "LOGIN_FAILED",
      payload: {
        message: (error.response && error.response.data.message) ||
          "An error has occurred.",
        data: null
      }
    });
    return { error: true, message: (error.response && error.response.data.message) || "An error has occurred.", data: "" };
  }
};


export const resetExpiredPassword = ({ userName, oldPassword, updatedPassword, securityQuestionId, securityAnswer }) => async (dispatch) => {
  try {
    let cookies = new Cookies(window.document.cookie);
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase}/user-service/${config.apiVersion}/user/update-exp-pwd`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      data: JSON.stringify({
        "userName": userName || null,
        "portalTypeId": 1,
        "oldPassword": oldPassword || null,
        "updatedPassword": updatedPassword || null,
        "securityQuestionId": securityQuestionId || null,
        "securityAnswer": securityAnswer || null
      })
    })
    const responseBody = await response.data
    if (!responseBody.error) {
      const { accessToken, refreshToken, isFirstLogin, userData, userAccessIdList } = responseBody.data;
      // cookies.set('@clientAccessToken', accessToken, { path: `${config.baseName}/` });
      // cookies.set('@clientRefreshToken', refreshToken, { path: `${config.baseName}/` });
      cookies.set("@accessToken", accessToken, { path: `${config.baseName}/` });
      cookies.set("@refreshToken", refreshToken, {
        path: `${config.baseName}/`,
      });
      cookies.set("@userId", userData.userId, { path: `${config.baseName}/` });
      cookies.set("@portalTypeId", userData.portalTypeId, {
        path: `${config.baseName}/`,
      });
      // dispatch({
      //   type: 'LOGIN_SUCCESS',
      //   payload: {
      //     userData,
      //     isFirstLogin: isFirstLogin,
      //     userRoles: userAccessIdList || [],
      //   }
      // })
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          ...userData,
          isFirstLogin: isFirstLogin,
        },
      });
      dispatch({
        type: "USER_PERMISSIONS_MINI_SUCCESS",
        payload: userAccessIdList,
      });
      return true;
    }
    dispatch({
      type: 'LOGIN_FAILED',
      payload: {
        message: (responseBody && responseBody.message) || "Oops! Something went wrong.",
        data: responseBody && responseBody["data"]
      }
    })
    return false;
  } catch (error) {
    dispatch({
      type: 'LOGIN_FAILED',
      payload: {
        message: (error.response && error.response.data.message) || "An error has occurred.",
        data: null
      }
    })
    return false;
  }
}

export const updateUserInfo = (userData) => async (dispatch) => {
  try {
    dispatch({
      type: 'UPDATE_USER_INFO',
      payload: userData
    })
  }
  catch (error) {
    throw "An error occured."
  }
}

/*
Forgot password
*/
export const forgotPassword = ({ loginId }) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/user-service/${config.apiVersion}/forgot-password`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        login: loginId
      })
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "FORGOT_PASSWORD_SUCCESS",
        payload: {},
      });
      return true;
    }
    dispatch({
      type: "FORGOT_PASSWORD_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FORGOT_PASSWORD_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
    });
    return false;
  }
};

/*
Logout
*/
/*
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
*/

/*
Logout
*/
export const logout = () => async (dispatch) => {
  let cookies = new Cookies(window.document.cookie);

  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/user-service/${config.apiVersion}/logout`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    //if (responseBody.error == false) {
    cookies.remove("@accessToken", { path: `${config.baseName}/` });
    cookies.remove("@refreshToken", { path: `${config.baseName}/` });
    cookies.remove("@portalTypeId", { path: `${config.baseName}/` });
    cookies.remove("@userId", { path: `${config.baseName}/` });
    dispatch({
      type: "LOGOUT_SUCCESS",
      payload: {},
    });
    //} else {
    /*
          dispatch({
              type: 'LOGOUT_FAILED',
              payload: responseBody.message || 'Oops! Something went wrong.'
          })*/
    //}
  } catch (error) {
    /*
        dispatch({
            type: 'LOGOUT_FAILED',
            payload: error.response && error.response.data.message || "An error has occurred."
        })*/
    cookies.remove("@accessToken", { path: `${config.baseName}/` });
    cookies.remove("@refreshToken", { path: `${config.baseName}/` });
    cookies.remove("@portalTypeId", { path: `${config.baseName}/` });
    cookies.remove("@userId", { path: `${config.baseName}/` });
    dispatch({
      type: "LOGOUT_SUCCESS",
      payload: {},
    });
  }
};

/*
Get user list
*/
export const fetchUserList = ({
  portalProfileId,
  portalTypeId,
  name,
  phone,
  email,
  role,
  pageNo,
  pageSize,
  sortColumn,
  sortOrder,
}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/user-service/${config.apiVersion}/user-search?portalProfileId=${portalProfileId}&portalTypeId=${portalTypeId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        displayName: name || "",
       // email: email || "",
        //phone: phone || "",
        roleId: role.roleId || null,
        isLocked: role.roleName === "Locked Users" ? true : false,
        isNewUsers: role.roleName === "New Users" ? true : false,
        isActiveUsers: role.roleName === "Active Users" ? true : false,
        pageNo: pageNo || 1,
        pageSize: pageSize || 10,
        sortColumn: sortColumn || "",
        sortOrder: sortOrder || "",
      }),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "USER_LIST_FETCH_SUCCESS",
        payload: responseBody.data.userInfo,
        totalCount: responseBody.data.TotalCount || 0,
      });
      return true;
    }
    dispatch({
      type: "USER_LIST_FETCH_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "USER_LIST_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
    });
    return false;
  }
};

/*
Create new user
*/
export const createUser = ({ portalProfileId, portalTypeId, user }) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/user-service/${config.apiVersion}/user?portalProfileId=${portalProfileId}&portalTypeId=${portalTypeId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        title: user.title || "Mr",
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        userName: user.isSSO == true ? null : user.userName || null,
        password: user.isSSO == true ? null : user.newPassword || null,
        isSSO: user.isSSO || false,
        SSOUserId: user.isSSO == true ? (user.SSOUserId || null) : null,
        //securityQuestionId: user.isSSO ==true ? null :(user.securityQuestionId || null),
        //securityAnswer: user.isSSO ==true ? null :(user.securityAnswer || ""),
        phoneCountryCode: user.phoneCountryCode || null,
        phone: user.phone || null,
        phoneExt: user.phoneExt || null,
        email: user.email || null,
        //roleId: user.RoleID.split(',').map(Number) || []
        roleId: user.roleId || [],
        isFirstUser: false,
      }),
    });

    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "CREATE_ADMIN_USER_SUCCESS",
        payload: { ...user, userId: responseBody.data.userId }, //add userID from response
      });
      return { ...user, userId: responseBody.data.userId };
    }
    dispatch({
      type: "CREATE_ADMIN_USER_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "CREATE_ADMIN_USER_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
    });
    return false;
  }
};

/*
Update user details
*/
export const updateUserDetails = ({
  portalProfileId,
  portalTypeId,
  user,
}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/user-service/${config.apiVersion}/user?portalProfileId=${portalProfileId}&portalTypeId=${portalTypeId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        userId: user.userId || 0,
        title: user.title || "Mr",
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        userName: user.userName || null,
        password: (user.newPassword && user.newPassword.trim()) || null,
        isSSO: (user.isSSO == 1 || user.isSSO == true) ? true : false,
        SSOUserId: user.SSOUserId || null,
        ///securityQuestionId: user.securityQuestionId || null,
        //securityAnswer: user.securityAnswer || "",
        phoneCountryCode: user.phoneCountryCode || null,
        phone: user.phone || null,
        phoneExt: user.phoneExt || null,
        email: user.email || null,
        //roleId: user.RoleID.split(',').map(Number) || []
        roleId: user.roleId || [],
        isFirstUser: false,
      }),
    });

    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "UPDATE_USER_DETAILS_SUCCESS",
        payload: { ...user },
      });
      return true;
    }
    dispatch({
      type: "UPDATE_USER_DETAILS_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "UPDATE_USER_DETAILS_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
    });
    return false;
  }
};

/*
Get security question ID selected by user
*/
export const fetchSecurityQuestion = (resetCode) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/user-service/${config.apiVersion}/user/get-question`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
	  data: JSON.stringify({
        passwordResetCode: resetCode || null,
      }),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "SQ_ID_FETCH_SUCCESS",
        payload: responseBody?.data?.securityQuestionId || null,
      });
      return true;
    }
    dispatch({
      type: "SQ_ID_FETCH_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "SQ_ID_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
    });
    return false;
  }
};

/*
Get security questions list
*/
export const fetchSecurityQuestions = () => async (dispatch) => {
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
    if (!responseBody.error) {
      dispatch({
        type: "SQ_LIST_FETCH_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "SQ_LIST_FETCH_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "SQ_LIST_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
    });
    return false;
  }
};

export const lockUser = ({ userIds, isLocked }) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      //url: `${config.apiBase}/user-service/v1/user-lock?userId=${userId}&isLocked=${isLocked}`,
      url: `${config.apiBase}/user-service/${config.apiVersion}/user-lock`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        userId: userIds || null,
        isLocked: isLocked,
      }),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "LOCK_USER_DETAILS_SUCCESS",
        payload: { userIds: userIds, isLocked: isLocked },
      });
      return true;
    }
    dispatch({
      type: "LOCK_USER_DETAILS_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "LOCK_USER_DETAILS_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
    });
    return false;
  }
};
export const removeUser = ({ userIds }) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      //url: `${config.apiBase}/user-service/v1/user?userId=${userId}`,
      url: `${config.apiBase}/user-service/${config.apiVersion}/user`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        userId: userIds || null,
      }),
    });

    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "REMOVE_USER_DETAILS_SUCCESS",
        payload: { userIds: userIds },
      });
      return true;
    }
    dispatch({
      type: "REMOVE_USER_DETAILS_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "REMOVE_USER_DETAILS_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
    });
    return false;
  }
};

/*
Update user clients
*/
export const updateUserClients = (accessDetails) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/user-service/${config.apiVersion}/bank/portal/accesses?bankId=${accessDetails.portalProfileId}&userId=${accessDetails.userId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        clientIds: accessDetails.clientIds,
      }),
    });

    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "UPDATE_USER_DETAILS_SUCCESS",
        payload: { ...accessDetails.user },
      });
      return true;
    }
    dispatch({
      type: "UPDATE_USER_DETAILS_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "UPDATE_USER_DETAILS_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
    });
    return false;
  }
};

/*
Get Chip filter list
*/
export const fetchFilterList = ({ portalProfileId, portalTypeId }) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      //url: `${config.apiBase}/user-service/v1/user-search?portalProfileId=${portalProfileId}&portalTypeId=${portalTypeId}`,
      url: `${config.apiBase}/user-service/${config.apiVersion}/filters/portalTypeId/${portalTypeId}/portalProfileId/${portalProfileId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "CHIPS_FILTER_LIST_FETCH_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "CHIPS_FILTER_LIST_FETCH_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "USER_LIST_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
    });
    return false;
  }
};
//Update token/session time
export const keepSessionLive = () => async (dispatch) => {
  let cookies = new Cookies(window.document.cookie);
  const refreshToken = cookies.get('@refreshToken');
    //const currentTime = Math.floor(Date.now() / 1000); //convert to seconds
    //console.log("API current time", moment(currentTime * 1000).format("DD-MM-YYYY h:mm:ss") );
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
      if (!responseBody.error) {
        const { accessToken, refreshToken, exp } = responseBody.data;
        cookies.set('@accessToken', accessToken, { path: `${config.baseName}/`, });
        cookies.set('@refreshToken', refreshToken, { path: `${config.baseName}/`, });
        //const tokenExpirationTime = Math.floor((Date.now() + config.sessionTimeout) / 1000); //in seconds
        //console.log("APItokenExpiryTime", moment(exp * 1000).format("DD-MM-YYYY h:mm:ss"));
        dispatch({
          type: "UPDATE_TOKEN_TIME_SUCCESS",
          payload: { exp: exp },
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  return false;
}

export const fetchIsPayeeChoicePortal = ()=> async(dispatch) =>{
 dispatch({
    type:'IS_PAYEE_CHOICE_PORTAL',
    payload:config.bankTypeId === BankType.USBANK
  })
  return config.bankTypeId === BankType.USBANK
}