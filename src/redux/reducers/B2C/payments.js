const initial_state = {
  b2cPaymentTypes: undefined,
  b2cPushToCard: null,
  payPalDetails: null,
  addPayPalDetail: null,
  getB2CPushCardData: null,
  updatedB2CPushCardData: null,
  updateCheckDetail: null,
  getCheckData: null,
  getZelleData: null,
  senderTypeList: null,
  productTypeList: null,
  storedZelleData: null,
  achB2CProfileInfo: null,
  achB2CAccountList: null,
  achB2CClientAccountList: null,
};

export default function b2cPayments(state = initial_state, action = {}) {
  switch (action.type) {
    case 'FETCH_B2C_PAYMENT_TYPES_SUCCESS':
      return {
        ...state,
        b2cPaymentTypes: { data: action.payload, error: null },
      };
    case 'FETCH_B2C_PAYMENT_TYPES_FAILED':
      return {
        ...state,
        b2cPaymentTypes: {
          data: state.b2cPaymentTypes?.data ?? [],
          error: true,
        },
      };
    case 'FETCH_B2C_PUSHTOCARD_SUCCESS':
      return {
        ...state,
        b2cPushToCard: { data: action.payload, error: null },
      };
    case 'FETCH_B2C_PUSHTOCARD_FAILED':
      return {
        ...state,
        b2cPushToCard: {
          error: action.payload,
        },
      };
    case 'FETCH_PAYPAL_DETAIL_SUCCESS':
      return {
        ...state,
        payPalDetails: action.payload,
        error: null,
      };
    case 'FETCH_PAYPAL_DETAIL_FAILED':
      return {
        ...state,
        error: action.payload,
      };
    case 'ADD_PAYPAL_DETAIL_SUCCESS':
      return {
        ...state,
        addPayPalDetail: action.payload,
        error: null,
      };
    case 'ADD_PAYPAL_DETAIL_FAILED':
      return {
        ...state,
        error: action.payload,
      };
    case 'PAYPAL_DETAIL_UPDATE_SUCCESS':
      return {
        ...state,
        addPayPalDetail: action.payload,
        error: null,
      };
    case 'PAYPAL_DETAIL_UPDATE_FAILED':
      return {
        ...state,
        error: action.payload,
      };
    case 'FETCH_B2C_GETPUSHTOCARD_SUCCESS':
      return {
        ...state,
        getB2CPushCardData: { data: action.payload, error: null },
      };
    case 'FETCH_B2C_GETPUSHTOCARD_FAILED':
      return {
        ...state,
        getB2CPushCardData: { error: action.payload },
      };
    case 'FETCH_B2C_UPDATEPUSHTOCARD_SUCCESS':
      return {
        ...state,
        updatedB2CPushCardData: { data: action.payload, error: null },
      };
    case 'FETCH_B2C_UPDATEPUSHTOCARD_FAILED':
      return {
        ...state,
        updatedB2CPushCardData: { error: action.payload },
      };
    case 'FETCH_B2C_UPDATECHECKDETAIL_SUCCESS':
      return {
        ...state,
        updateCheckDetail: { data: action.payload, error: null },
      };
    case 'FETCH_B2C_UPDATECHECKDETAIL_FAILED':
      return {
        ...state,
        updateCheckDetail: {
          data: state.updateCheckDetail?.data ?? [],
          error: action.payload,
        },
      };
    case 'FETCH_B2C_GETCHECKDETAIL_SUCCESS':
      return {
        ...state,
        getCheckData: { data: action.payload, error: null },
      };
    case 'FETCH_B2C_GETCHECKDETAIL_FAILED':
      return {
        ...state,
        getCheckData: {
          data: state.getCheckData?.data ?? [],
          error: action.payload,
        },
      };
    case 'FETCH_B2C_ZELLE_SUCCESS':
      return {
        ...state,
        getZelleData: { data: action.payload, error: null },
      };
    case 'FETCH_B2C_ZELLE_FAILED':
      return {
        ...state,
        getZelleData: { error: action.payload },
      };
    case 'FETCH_ZELLE_SENDER_SUCCESS':
      return {
        ...state,
        senderTypeList: { data: action.payload, error: null },
      };
    case 'FETCH_ZELLE_SENDER_FAILED':
      return {
        ...state,
        senderTypeList: { error: action.payload },
      };
    case 'FETCH_ZELLE_PRODUCT_TYPE_SUCCESS':
      return {
        ...state,
        productTypeList: { data: action.payload, error: null },
      };
    case 'FETCH_ZELLE_PRODUCT_TYPE_FAILED':
      return {
        ...state,
        productTypeList: { error: action.payload },
      };
    case 'FETCH_ADD_ZELLE_SUCCESS':
      return {
        ...state,
        storedZelleData: { data: action.payload, error: null },
      };
    case 'FETCH_ADD_ZELLE_FAILED':
      return {
        ...state,
        storedZelleData: { error: action.payload },
      };
    case 'FETCH_B2C_ACH_PROFILE_INFO_SUCCESS':
      return {
        ...state,
        achB2CProfileInfo: { data: action.payload, error: null },
      };
    case 'FETCH_B2C_ACH_PROFILE_INFO_FAILED':
      return {
        ...state,
        achB2CProfileInfo: {
          ...state.achB2CProfileInfo,
          error: action.payload,
        },
      };
    case 'FETCH_B2C_ACH_ACCOUNT_LIST_SUCCESS':
      return {
        ...state,
        achB2CAccountList: {
          data: action.payload,
          error: null,
        },
      };
    case 'FETCH_B2C_ACH_ACCOUNT_LIST_FAILED':
      return {
        ...state,
        achB2CAccountList: {
          ...state.achB2CAccountList,
          error: action.payload,
        },
      };
    case 'FETCH_B2C_CHILD_ACH_ACCOUNT_LIST_SUCCESS':
      return {
        ...state,
        achB2CClientAccountList: {
          data: action.payload,
          error: null,
        },
      };
    case 'FETCH_B2C_CHILD_ACH_ACCOUNT_LIST_FAILED':
      return {
        ...state,
        achB2CClientAccountList: {
          ...state.achB2CClientAccountList,
          error: action.payload,
        },
      };
    default:
      return { ...state };
  }
}
