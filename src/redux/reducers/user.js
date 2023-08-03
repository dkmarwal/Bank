const initialState = {
  user: {
    isLoggedIn: false,
    error: null,
    updatePasswordError: null,
    info: {},
    list: [],
    isPayeeChoicePortal:false,
    securityQuestionList: [],
    totalCount: 0,
    chipFilterList: [],
	securityQuestionId: null
  },
}

export default function user(state = initialState, action = {}) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: {
          ...state.user,
          info: {
            ...state.user.info,
            ...action.payload
          },
          error: null,
          isLoggedIn: true,
        }
      }
    case 'LOGIN_FAILED':
      return {
        ...state,
        user: {
          error: action.payload && action.payload.message,
          data: action.payload && action.payload.data,
          info: {},
          isPayeeChoicePortal:state.user.isPayeeChoicePortal ?? false,
          isLoggedIn: false,
        }
      }
    case 'UPDATE_USER_INFO':
      return {
        ...state,
        user: {
          ...state.user,
          info: {
            ...state.user.info,
            ...action.payload
          },
          error: null,
        }
      }

    case 'UPDATE_PASSWORD_SUCCESS':
      return {
        ...state,
        user: {
          ...state.user,
          info: {
            ...state.user.info,
            ...action.payload
          },
          error: null,
        }
      }
    case 'UPDATE_PASSWORD_FAILED':
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload,
        }
      }
    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        user: {
          isLoggedIn: false,
          info: {},
          isPayeeChoicePortal:state.user.isPayeeChoicePortal ?? false,
          error: action.payload,
        }
      }
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
          isPayeeChoicePortal:state.user.isPayeeChoicePortal ?? false,
        }
      }
    case 'USER_LIST_FETCH_SUCCESS':
      return {
        ...state,
        user: {
          ...state.user,
          list: action.payload,
          totalCount: action.totalCount,
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
          list: [...state.user.list.map(item => {
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
          list: [...state.user.list.map(item => {
            return action.payload.userIds.indexOf(item.userId) == -1 ? item : { ...item, isLocked: action.payload.isLocked };
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
          list: [...state.user.list.filter((item, i) => action.payload.userIds.indexOf(item.userId) == -1)],
          totalCount: state.user.totalCount - action.payload.userIds.length,
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
	case 'SQ_ID_FETCH_SUCCESS':
      return {
        ...state,
        user: {
          ...state.user,
          securityQuestionId: action.payload,
          error: null,
        }
      }
    case 'SQ_ID_FETCH_FAILED':
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload
        }
      }  
    case 'DFA_UPDATE_SUCCESS':
      return {
        ...state,
        user: {
          ...state.user,
          info: {
            ...state.user.info,
            ...action.payload
          },
          error: null
        }
      }
    case 'DFA_UPDATE_FAILED':
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload
        }
      }
    case 'CHIPS_FILTER_LIST_FETCH_SUCCESS':
      return {
        ...state,
        user: {
          ...state.user,
          chipFilterList: action.payload,
          error: null,
        }
      }
    case 'CHIPS_FILTER_LIST_FETCH_FAILED':
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload
        }
      }
  case 'UPDATE_TOKEN_TIME_SUCCESS':
    return {
        ...state,
        user: {
            ...state.user,
            info: {
                ...state.user.info,
                ...action.payload
            },
            error: null
        }
    }
    case 'IS_PAYEE_CHOICE_PORTAL':
      return {
        ...state,
        user:{
          ...state.user,
          isPayeeChoicePortal:action.payload
        }
      }
    default:
      return {
        ...state
      }
  }
}