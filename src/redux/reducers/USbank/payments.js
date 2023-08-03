const initialState = {
  usBankpayment: {
    error: null,
    bankDetail: null,
    achB2CAccountList: null,
    priorityTypeList: [],
    storedZelleData: null,
    rtpDetails: null,
    preferredTypes: [],
    usbankCheckData: null,
    storedUSBankCheckData: null,
    usBankPrepaidCard: null,
    storedPrepaidCardData: null,
    reliaFocusCardParams: null,
    usBankCorporateCard: null,
    achUSBankClientAccountList: null,
    achUSBankAccountList: null,
    achUSBankProfileInfo: null,
  },
};

export default function USbankpayment(state = initialState, action = {}) {
  switch (action.type) {
    case 'FETCH_USBANK_ACH_ACCOUNT_LIST_SUCCESS':
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          achB2CAccountList: action.payload,
          error: null,
        },
      };

    case 'FETCH_USBANK_ACH_ACCOUNT_LIST_FAILED':
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          error: action.payload,
        },
      };
    case 'FETCH_RTP_IMPORT_SUCCESS':
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          preferredTypes: action.payload,
          error: null,
        },
      };
    case 'FETCH_RTP_IMPORT_FAILED':
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          error: action.payload,
        },
      };
    case 'UPDATE_RTP_IMPORT_SUCCESS':
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          preferredTypes: action.payload,
          error: null,
        },
      };
    case 'UPDATE_RTP_IMPORT_FAILED':
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          error: action.payload,
        },
      };
    case 'FETCH_USBANK_ZELLE_PRIORITY_SUCCESS':
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          priorityTypeList: { data: action.payload, error: null },
        },
      };

    case 'FETCH_USBANK_ZELLE_PRIORITY_FAILED':
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          error: { error: action.payload },
        },
      };
    case 'USBANK_ADD_ZELLE_SUCCESS':
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          storedZelleData: { data: action.payload, error: null },
        },
      };
    case 'USBANK_ADD_ZELLE_FAILED':
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          storedZelleData: {
            ...state.usBankpayment.storedZelleData,
            error: action.payload,
          },
        },
      };
    case 'FETCH_USBANK_CHECK_DATA_SUCCESS':
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          usbankCheckData: {
            data: action.payload,
            error: null,
          },
        },
      };
    case 'FETCH_USBANK_CHECK_DATA_FAILED':
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          usbankCheckData: {
            ...state.usBankpayment.usbankCheckData,
            error: action.payload,
          },
        },
      };
    case 'USBANK_ADD_CHECK_SUCCESS': {
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          storedUSBankCheckData: {
            data: action.payload,
            error: null,
          },
        },
      };
    }
    case 'USBANK_ADD_CHECK_FAILED': {
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          storedUSBankCheckData: {
            ...state.usBankpayment.storedUSBankCheckData,
            error: action.payload,
          },
        },
      };
    }
    case 'USBANK_ADD_PREPAID_CARD_SUCCESS': {
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          usBankPrepaidCard: {
            data: action.payload,
            error: null,
          },
        },
      };
    }
    case 'USBANK_ADD_PREPAID_CARD_FAILED': {
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          usBankPrepaidCard: {
            ...state.usBankpayment.usBankPrepaidCard,
            error: action.payload,
          },
        },
      };
    }
    case 'FETCH_USBANK_PREPAID_CARD_DATA_SUCCESS': {
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          storedPrepaidCardData: {
            data: action.payload,
            error: null,
          },
        },
      };
    }
    case 'FETCH_USBANK_PREPAID_CARD_DATA_FAILED': {
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          storedPrepaidCardData: {
            ...state.usBankpayment.storedPrepaidCardData,
            error: action.payload,
          },
        },
      };
    }
    case 'FETCH_RELIA_FOCUS_CARD_PARAMS_SUCCESS': {
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          reliaFocusCardParams: {
            data: action.payload,
            error: null,
          },
        },
      };
    }
    case 'FETCH_RELIA_FOCUS_CARD_PARAMS_FAILED': {
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          reliaFocusCardParams: {
            ...state.usBankpayment.reliaFocusCardParams,
            error: action.payload,
          },
        },
      };
    }
    case 'USBANK_ADD_CORPORATE_CARD_SUCCESS': {
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          usBankCorporateCard: {
            data: action.payload,
            error: null,
          },
        },
      };
    }
    case 'USBANK_ADD_CORPORATE_CARD_FAILED': {
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          usBankCorporateCard: {
            ...state.usBankpayment.usBankCorporateCard,
            error: action.payload,
          },
        },
      };
    }
    case 'FETCH_US_BANK_CHILD_ACH_ACCOUNT_LIST_SUCCESS':
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          achUSBankClientAccountList: {
            data: action.payload,
            error: null,
          },
        },
      };
    case 'FETCH_US_BANK_CHILD_ACH_ACCOUNT_LIST_FAILED':
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          achUSBankClientAccountList: {
            ...state.usBankpayment.achUSBankClientAccountList,
            error: action.payload,
          },
        },
      };
    case 'FETCH_US_BANK_ACH_ACCOUNT_LIST_SUCCESS':
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          achUSBankAccountList: {
            data: action.payload,
            error: null,
          },
        },
      };
    case 'FETCH_US_BANK_ACH_ACCOUNT_LIST_FAILED':
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          achUSBankAccountList: {
            ...state.usBankpayment.achUSBankAccountList,
            error: action.payload,
          },
        },
      };
    case 'FETCH_US_BANK_ACH_PROFILE_INFO_SUCCESS':
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          achUSBankProfileInfo: {
            data: action.payload,
            error: null,
          },
        },
      };
    case 'FETCH_US_BANK_ACH_PROFILE_INFO_FAILED':
      return {
        ...state,
        usBankpayment: {
          ...state.usBankpayment,
          achUSBankProfileInfo: {
            ...state.usBankpayment.achUSBankProfileInfo,
            error: action.payload,
          },
        },
      };
    default:
      return {
        ...state,
      };
  }
}
