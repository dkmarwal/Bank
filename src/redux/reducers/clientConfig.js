const initialState = {
    generalConfigInfo: {},
    remittanceConfigInfo: {},
    error: {},
    success: {},
}

const convertArrayToObject = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
        return {
            ...obj,
            [item[key]]: item,
        };
    }, initialValue);
};

export default function clientConfig(state = initialState, action = {}) {
    switch (action.type) {
        case 'GET_GENERAL_CONFIG_INFO':
            return {
                ...state,
                generalConfigInfo: {
                    ...state.generalConfigInfo,
                    ...action.payload
                }
            }
        case 'UPDATE_GENERAL_CONFIG_INFO':
            return {
                ...state,
                generalConfigInfo: {
                    ...state.generalConfigInfo,
                    ...action.payload
                }
            }
        case 'SAVE_COMPANY_INFO_SUCCESS':
            return {
                ...state,
                success: { ...state.success, generalConfigInfo: action.payload }
            }
        case 'GET_GENERAL_INFO_FAILED':
            return {
                ...state,
                error: { ...state.error, generalConfigInfo: action.payload }
            }

        case 'SAVE_COMPANY_INFO_FAILED':
            return {
                ...state,
                error: { ...state.error, generalConfigInfo: action.payload }
            }
        case 'GET_REMITTANCE_CONFIG_INFO':
            return {
                ...state,
                remittanceConfigInfo: {
                    ...state.remittanceConfigInfo,
                    ...action.payload
                }
            }
        case 'UPDATE_REMITTANCE_CONFIG_INFO':
            return {
                ...state,
                remittanceConfigInfo: {
                    ...state.remittanceConfigInfo,
                    ...action.payload
                }
            }
        case 'SAVE_REMITTANCE_CONFIG_INFO':
            return {
                ...state,
                success: { ...state.success, remittanceConfigInfo: action.payload }
            }
        case 'GET_REMITTANCE_CONFIG_FAILED':
            return {
                ...state,
                error: { ...state.error, remittanceConfigInfo: action.payload }
            }

        case 'SAVE_REMITTANCE_CONFIG_FAILED':
            return {
                ...state,
                error: { ...state.error, remittanceConfigInfo: action.payload }
            }
        default:
            return {
                ...state
            }
    }
}
