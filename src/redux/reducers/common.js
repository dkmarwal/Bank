const initialState = {
    locationTypeList: [],
    contactTypeList: [],
    cardTypeList: [],
    currrencyList: [],
    accountClassificationList: [],
    purchaseTypeList: [],
    stateList: [],
    countryList: [],
    cityList: [],
    remittanceDeliveryModeList:[],
    remittanceFormatList:[]


}

export default function common(state = initialState, action = {}) {
    switch (action.type) {
        case 'INSERT_LOCATION_TYPE':
            return {
                ...state,
                locationTypeList: action.payload
            };
        case 'FETCH_CONTACT_TYPE_LIST':
            return {
                ...state,
                contactTypeList: action.payload
            }
        case 'FETCH_CARD_TYPE':
            return {
                ...state,
                cardTypeList: action.payload
            };
        case 'FETCH_CURRENCY_LIST':
            return {
                ...state,
                currrencyList: action.payload
            }
        case 'FETCH_ACCT_CLASSIFICATION_LIST':
            return {
                ...state,
                accountClassificationList: action.payload
            }
        case 'FETCH_PURCHASE_TYPE_LIST':
            return {
                ...state,
                purchaseTypeList: action.payload
            }
        case 'FETCH_REMITTANCE_FORMAT_LIST':
            return {
                ...state,
                remittanceFormatList: action.payload
            }
        case 'FETCH_REMITTANCE_DELIVERY_MODE_LIST':
            return {
                ...state,
                remittanceDeliveryModeList: action.payload
            }
        default:
            return {
                ...state
            }
    }
}