const initialState = {
  payees: {
    payeelist: [],
    columnList: [],
    count:0,
    onboardingSrcList: [],
    resultList: [],
    declinedList:[],
    statusList:[],
    error: null,
  },
};

export default function payees(state = initialState, action = {}) {
  switch (action.type) {
    case 'PAYEES_LIST_FETCH_SUCCESS':
      return {
        ...state,
        payees: {
          ...state.payees,
          payeelist: action?.payload?.rows || [],
          count:action?.payload?.count || 0,
          error: null,
        }
      }
    case 'PAYEES_LIST_FETCH_FAILED':
      return {
        ...state,
        payees: {
          ...state.payees,
          error: action.payload
        }
      }
    case 'ONBOARDING_SRC_LIST_SUCCESS':
      return {
        ...state,
        payees: {
          ...state.payees,
          onboardingSrcList: action.payload,
          error: null,
        }
      }
    case 'ONBOARDING_SRC_LIST_FAILED':
      return {
        ...state,
        payees: {
          ...state.payees,
          error: action.payload
        }
      }
    case 'RESULT_LIST_SUCCESS':
      return {
        ...state,
        payees: {
          ...state.payees,
          resultList: action.payload,
          error: null,
        }
      }
    case 'RESULT_LIST_FAILED':
      return {
        ...state,
        payees: {
          ...state.payees,
          error: action.payload
        }
      }
      case 'DECLINED_LIST_SUCCESS':
        return {
          ...state,
          payees: {
            ...state.payees,
            declinedList: action.payload,
            error: null,
          }
        }
      case 'DECLINED_LIST_FAILED':
        return {
          ...state,
          payees: {
            ...state.payees,
            error: action.payload
          }
        }
        case 'STATUS_LIST_SUCCESS':
          return {
            ...state,
            payees: {
              ...state.payees,
              statusList: action.payload,
              error: null,
            }
          }
        case 'STATUS_LIST_FAILED':
          return {
            ...state,
            payees: {
              ...state.payees,
              error: action.payload
            }
          }
    case 'FETCH_COLUMN_LIST_SUCCESS':
      return {
        ...state,
        payees: {
          ...state.payees,
          columnList: action.payload,
          error: null,
        }
      }
      case 'FETCH_COLUMN_LIST_FAILED':
        return {
          ...state,
          payees: {
            ...state.payees,
            error: action.payload
          }
        }
      case 'CAMPAIGN_LIST_SUCCESS':
        return {
          ...state,
          payees: {
            ...state.payees,
            campaignList: action.payload,
            error: null,
          }
        }
      case 'CAMPAIGN_LIST_FAILED':
        return {
          ...state,
          payees: {
            ...state.payees,
            error: action.payload
          }
        }
      case 'VENDOR_LIST_SUCCESS':
        return {
          ...state,
          payees: {
            ...state.payees,
            vendorList: action.payload,
            error: null,
          }
        }
      case 'VENDOR_LIST_FAILED':
        return {
          ...state,
          payees: {
            ...state.payees,
            error: action.payload
          }
        }
      case 'DECLINED_DATA_SUCCESS':
        return {
          ...state,
          payees: {
            ...state.payees,
            declinedStatus: action.payload.declinedStatus,
            otherReasons: action.payload.otherReasons,
            payees: action.payload.payees,
            annualSpendUSD: action.payload.annualSpendUSD, 
            annualSpendCAD: action.payload.annualSpendCAD, 
            error: null,
          }
        }
      case 'DECLINED_DATA_FAILED':
        return {
          ...state,
          payees: {
            ...state.payees,
            error: action.payload
          }
        }
      case 'PENDING_DATA_SUCCESS':
        return {
          ...state,
          payees: {
            ...state.payees,
            payees: action.payload.payees,
            annualSpendUSD: action.payload.annualSpendUSD, 
            annualSpendCAD: action.payload.annualSpendCAD, 
            error: null,
          }
        }
      case 'PENDING_DATA_FAILED':
        return {
          ...state,
          payees: {
            ...state.payees,
            error: action.payload
          }
        }
      default:
      return {
        ...state,
      };
  }
}
