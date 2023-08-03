const initialState = {
  report: {
    filterList: [],
    dataTypeList: [],
    paymentParameterList: [],
    selectedPaymentParameters: [],
    data: {},
    list: [],
    reportData: [],
    reportDataCount: 0,
    totalCount: 0,
    error: null,
    freuencyList: [],
    clientList: [],
    campaignList: [],
    payeeList: []
  },
};

export default function report(state = initialState, action = {}) {
  switch (action.type) {
    case 'REPORT_FILTER_LIST_FETCH_SUCCESS':
      return {
        ...state,
        report: {
          ...state.report,
          filterList: action.payload,
          error: null,
        }
      }
    case 'REPORT_FILTER_LIST_FETCH_FAILED':
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      }
    case 'REPORT_LIST_FETCH_SUCCESS':
      return {
        ...state,
        report: {
          ...state.report,
          list: action.payload,
          totalCount: action.totalCount,
          error: null,
        }
      }
    case 'REPORT_LIST_FETCH_FAILED':
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      }
    case 'REPORT_DATA_LIST_FETCH_SUCCESS':
      return {
        ...state,
        report: {
          ...state.report,
          reportData: action.payload,
          reportDataCount: action.totalCount,
          error: null,
        }
      }
    case 'REPORT_DATA_LIST_FETCH_FAILED':
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      }
    case "CREATE_REPORT_SUCCESS":
      return {
        ...state,
        report: {
          ...state.report,
          list: [...state.report.list, action.payload],
          totalCount: state.report.totalCount + 1,
          error: null
        }
      };
    case "CREATE_REPORT_FAILED":
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      };

    case "UPDATE_REPORT_SUCCESS":
      return {
        ...state,
        report: {
          ...state.report,
          list: [...state.report.list.map(item => {
            return parseInt(item.clientReportId) === parseInt(action.payload.clientReportId) ? action.payload : item;
          })],
          error: null
        }
      };

    case "UPDATE_REPORT_FAILED":
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      };
    case "REMOVE_REPORT_SUCCESS":
      return {
        ...state,
        report: {
          ...state.report,
          list: [...state.report.list.filter((item, i) => action.payload.reportIds.indexOf(item.bankReportId) == -1)],
          totalCount: state.report.totalCount - action.payload.reportIds.length,
          error: null
        }
      };
    case "REMOVE_REPORT_FAILED":
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      };
    case "FETCH_DATA_TYPE_SUCCESS":
      return {
        ...state,
        report: {
          ...state.report,
          dataTypeList: action.payload,
          error: null,
        },
      };
    case "FETCH_DATA_TYPE_FAILED":
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload,
        },
      };
    case "FETCH_PAYMENT_PARAMETER_LIST_SUCCESS":
      return {
        ...state,
        report: {
          ...state.report,
          paymentParameterList: action.payload,
          error: null,
        },
      };
    case "FETCH_PAYMENT_PARAMETER_LIST_FAILED":
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload,
        },
      };
    case 'FETCH_FREQUENCY_LIST_SUCCESS':
      return {
        ...state,
        report: {
          ...state.report,
          frequencyList: action.payload,
          error: null,
        }
      }
    case 'FETCH_FREQUENCY_LIST_FAILED':
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      }
    case 'FETCH_REPORT_SUBSCRIPTION_SUCCESS':
      return {
        ...state,
        report: {
          ...state.report,
          list: [...state.report.list.map(item => {
            return parseInt(item.clientReportId) === parseInt(action.payload.clientReportId) ? { ...item, subscription: action.payload.subscription, frequency: action.payload.frequency } : item;
          })],
          error: null,
        }
      }
    case 'FETCH_REPORT_SUBSCRIPTION_FAILED':
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      }
    case 'FETCH_REPORT_DOWNLOAD_FAILED':
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      }
    case 'FETCH_PAYEE_AUDIT_REPORT_DOWNLOAD_FAILED':
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      }
    case 'FETCH_PAYEE_AUDIT_REPORT_DOWNLOAD_SUCCESS"':
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      }
    case 'DYNAMIC_REPORT_DOWNLOAD_SUCCESS':
      return {
        ...state,
        report: {
          ...state.report,
          error: null
        }
      }
    case 'DYNAMIC_REPORT_DOWNLOAD_FAILED':
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      }
    case 'PAYMENT_REPORT_DOWNLOAD_SUCCESS':
      return {
        ...state,
        report: {
          ...state.report,
          error: null
        }
      }
    case 'PAYMENT_REPORT_DOWNLOAD_FAILED':
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      }
    case 'FETCH_REPORT_CLIENTS_LIST_SUCCESS':
      return {
        ...state,
        report: {
          ...state.report,
          clientList: action.payload,
          error: null,
        }
      }
    case 'FETCH_REPORT_CLIENTS_LIST_FAILED':
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      }
    case 'FETCH_REPORT_PAYEE_LIST_SUCCESS':
      return {
        ...state,
        report: {
          ...state.report,
          payeeList: action.payload,
          error: null,
        }
      }
    case 'FETCH_REPORT_PAYEE_LIST_FAILED':
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      }
    case 'FETCH_CAMPAIGN_LIST_SUCCESS':
      return {
        ...state,
        report: {
          ...state.report,
          campaignList: action.payload,
          error: null,
        }
      }
    case 'FETCH_CAMPAIGN_LIST_FAILED':
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      }
    default:
      return {
        ...state,
      };
  }
}