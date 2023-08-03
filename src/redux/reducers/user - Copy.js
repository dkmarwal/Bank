const initialState = {
  user: {
    isLoggedIn: false,
    error: null,
    updatePasswordError: null,
    info: {},
    list: [],
    roles: [],
    securityQuestionList: [],
    totalCount: 0,
  },
};

export default function user(state = initialState, action = {}) {
    switch (action.type) {
        case "LOGIN_SUCCESS":
          return {
            ...state,
            user: {
              ...state.user,
              roles: action.payload.userRoles,
              info: {
                ...state.user.info,
                ...action.payload,
              },
              error: null,
              isLoggedIn: true,
            },
          };
        case "LOGIN_FAILED":
          return {
            ...state,
            user: {
              error: action.payload,
              info: {},
              isLoggedIn: false,
            },
          };
        case "UPDATE_PASSWORD_SUCCESS":
          return {
            ...state,
            user: {
              ...state.user,
              info: {
                ...state.user.info,
                ...action.payload,
              },
              error: null,
            },
          };
        case "UPDATE_PASSWORD_FAILED":
          return {
            ...state,
            user: {
              ...state.user,
              error: action.payload,
            },
          };
        case "LOGOUT_SUCCESS":
          return {
            ...state,
            user: {
              isLoggedIn: false,
              info: {},
              error: null,
            },
          };
        case 'LOGOUT_FAILED':
            return {
                ...state,
                user: {
                    ...state.user,
                    error: action.payload,
                }
            }
        case 'FORGOT_PASSWORD_SUCCESS':
            return {
                ...state,
                user: {
                    ...state.user,
                }
            }
        case 'FORGOT_PASSWORD_FAILED':
            return {
                ...state,
                user: {
                    error: action.payload,
                }
            }
        case 'USER_LIST_FETCH_SUCCESS':
			return {
                ...state,
                user: {
                    ...state.user,
                    list: action.payload,
                    totalCount:action.totalCount,
                    error: null,
                }
            }
        case 'USER_LIST_FETCH_FAILED':
			return {
                ...state,
                user: {
                    ...state.user,
                    error: action.payload
                }
            }
        case "CREATE_ADMIN_USER_SUCCESS":
          return {
            ...state,
            user: {
              ...state.user,
              list: [...state.user.list, action.payload],
              totalCount: state.user.totalCount + 1,
              error: null
            }
          };
        case "CREATE_ADMIN_USER_FAILED":
          return {
            ...state,
            user: {
              ...state.user,
              error: action.payload
            }
          };

        case "UPDATE_USER_DETAILS_SUCCESS":
          return {
            ...state,
            user: {
              ...state.user,
              list:[...state.user.list.map(item => {
                    return parseInt(item.userId) === parseInt(action.payload.userId) ? action.payload : item;
                })],
              error: null
            }
          };

        case "UPDATE_USER_DETAILS_FAILED":
          return {
            ...state,
            user: {
              ...state.user,
              error: action.payload
            }
          };
        case "LOCK_USER_DETAILS_SUCCESS":
          return {
            ...state,
            user: {
              ...state.user,
              list:[...state.user.list.map(item => {
                    return parseInt(item.userId) === parseInt(action.payload.userId) ? {...item, isLocked:action.payload.isLocked} : item;
                })],
              error: null
            }
          };
        case "LOCK_USER_DETAILS_FAILED":
          return {
            ...state,
            user: {
              ...state.user,
              error: action.payload
            }
          };
        case "REMOVE_USER_DETAILS_SUCCESS":
          return {
            ...state,
            user: {
              ...state.user,
              list:[...state.user.list.filter((item, i) => parseInt(item.userId) !== parseInt(action.payload.userId))],
              totalCount:state.user.totalCount - 1,
              error: null
            }
          };
        case "REMOVE_USER_DETAILS_FAILED":
            return {
                ...state,
                user: {
                  ...state.user,
                  error: action.payload
                }
            };
        case 'SQ_LIST_FETCH_SUCCESS':
			return {
                ...state,
                user: {
                    ...state.user,
                    securityQuestionList: action.payload,
                    error: null,
                }
            }
        case 'SQ_LIST_FETCH_FAILED':
			return {
                ...state,
                user: {
                    ...state.user,
                    error: action.payload
                }
            }
    default:
      return {
        ...state,
      };
  }
}
