const initialState = {
  campaign: {
    data:{},
    validationList:[],
    campaignList:[],
    offerTypes:[],
    payerList:[],
    error: null,
  },
};

export default function campaign(state = initialState, action = {}) {
  switch (action.type) {
      case 'PAYER_LIST_FETCH_SUCCESS':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          payerList: action.payload,
          error: null,
        }
      }
    case 'PAYER_LIST_FETCH_FAILED':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          error: action.payload
        }
      }
      case 'VALIDATION_LIST_FETCH_SUCCESS':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          validationList: action.payload,
          error: null,
        }
      }
    case 'VALIDATION_LIST_FETCH_FAILED':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          error: action.payload
        }
      }
      case 'CAMPAIGN_LIST_FETCH_SUCCESS':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          campaignList: action.payload,
          error: null,
        }
      }
    case 'CAMPAIGN_LIST_FETCH_FAILED':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          error: action.payload
        }
      }
      case 'CAMPAIGN_TYPE_LIST_FETCH_SUCCESS':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          offerTypes: action.payload,
          error: null,
        }
      }
    case 'CAMPAIGN_TYPE_LIST_FETCH_FAILED':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          error: action.payload
        }
      }
    case "CREATE_CAMPAIGN_SUCCESS":
        return {
            ...state,
            campaign: {
              ...state.campaign,
              data:action.payload,
              error: null
            }
      };
    case "CREATE_CAMPAIGN_FAILED":
      return {
        ...state,
        campaign: {
          ...state.campaign,
          error: action.payload
        }
      };
    default:
      return {
        ...state,
      };
  }
}
