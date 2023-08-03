const initialState = {
    companyInformation: {},
    clientLegalEntityInfo: {},
    contactInformation: {},
    bankAccountInfo: {},
    virtualCardInfo: {},
    EFTAccountInfo: {},
    error: {},
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

export default function companyDetails(state = initialState, action = {}) {
    switch (action.type) {
        case 'GET_COMPANY_INFO':
            return {
                ...state,
                companyInformation: {
                    ...state.companyInformation,
                    ...action.payload
                }
            }
        case 'UPDATE_COMPANY_INFO':
            return {
                ...state,
                companyInformation: {
                    ...state.companyInformation,
                    ...action.payload
                }
            }
        case 'GET_COMPANY_INFO_FAILED':
            return {
                ...state,
                error: { ...state.error, companyInformation: action.payload }
            }
        case 'GET_CLIENT_ENTITY_INFO':
            return {
                ...state,
                clientLegalEntityInfo: {
                    ...state.clientLegalEntityInfo,
                    ...convertArrayToObject(action.payload, 'LegalEntityID')
                }
            }
        case 'UPDATE_CLIENT_ENTITY_INFO':
            const { LegalEntityID, data } = action.payload;
            const b = { ...state.clientLegalEntityInfo[LegalEntityID] };
            const a = { ...state.clientLegalEntityInfo[LegalEntityID], ...data }
            return {
                ...state,
                clientLegalEntityInfo: {
                    ...state.clientLegalEntityInfo,
                    [LegalEntityID]: {
                        ...state.clientLegalEntityInfo[LegalEntityID], ...data
                    }
                }
            }
        case 'ADD_CLIENT_ENTITY_INFO':
            return {
                ...state,
                clientLegalEntityInfo: {
                    ...state.clientLegalEntityInfo,
                    'new': action.payload
                }
            }
        case 'CREATE_CLIENT_ENTITY_SUCCESS':
            const newData = { ...state.clientLegalEntityInfo['new'], LegalEntityID: action.paylaod }
            const prevClientEntities = Object.keys(state.clientLegalEntityInfo).filter(key => key !== 'new')
                .reduce((obj, key) => {
                    obj[key] = state.clientLegalEntityInfo[key];
                    return obj;
                }, {});;
            const newclientLegalState = { ...prevClientEntities, [action.payload]: newData };
            return {
                ...state,
                clientLegalEntityInfo: {
                    ...newclientLegalState
                }
            }
        case 'GET_CLIENT_ENTITY_ERROR':
            return {
                ...state,
                error: { ...state.error, clientLegalEntityInfo: action.payload }
            }
        case 'GET_CONTACT_INFO':
            return {
                ...state,
                contactInformation: {
                    ...state.contactInformation,
                    ...convertArrayToObject(action.payload, 'ContactID')
                }
            }
        case 'UPDATE_CONTACT_INFO':
            const { ContactID, data : contactInfo } = action.payload;
            return {
                ...state,
                contactInformation: {
                    ...state.contactInformation,
                    [ContactID]: {
                        ...state.contactInformation[ContactID], ...contactInfo
                    }
                }
            }
        case 'ADD_CONTACT_INFO':
            return {
                ...state,
                contactInformation: {
                    ...state.contactInformation,
                    'new': action.payload
                }
            }
        case 'CREATE_CONTACT_INFO_SUCCESS':
            let newContact = {  ContactID: [action.paylaod],...state.contactInformation['new'] }
            const prevContactInfo = Object.keys(state.contactInformation).filter(key => key !== 'new')
                .reduce((obj, key) => {
                    obj[key] = state.contactInformation[key];
                    return obj;
                }, {});;
            const newContactInformation = { ...prevContactInfo, [action.payload]: newContact };
            return {
                ...state,
                contactInformation: {
                    ...newContactInformation
                }
            }
        case 'GET_BANK_ACCOUNT_INFO':
            return {
                ...state,
                bankAccountInfo: {
                    ...state.bankAccountInfo,
                    ...convertArrayToObject(action.payload, 'AccountID')
                }
            }
        case 'UPDATE_BANK_ACCOUNT_INFO':
            const { AccountID, data : bankAccount } = action.payload;
            return {
                ...state,
                bankAccountInfo: {
                    ...state.bankAccountInfo,
                    [AccountID]: {
                        ...state.bankAccountInfo[AccountID], ...bankAccount
                    }
                }
            }
        case 'ADD_BANK_ACCOUNT_INFO':
            return {
                ...state,
                bankAccountInfo: {
                    ...state.bankAccountInfo,
                    'new': action.payload
                }
            }
        case 'CREATE_BANK_ACCOUNT_SUCCESS':
            const newBankInfo = { AccountID: [action.paylaod], ...state.bankAccountInfo['new'] }
            const prevBankAccountInfo = Object.keys(state.bankAccountInfo).filter(key => key !== 'new')
                .reduce((obj, key) => {
                    obj[key] = state.bankAccountInfo[key];
                    return obj;
                }, {});;
            const newBankAccountInfo = { ...prevBankAccountInfo, [action.payload]: newBankInfo };
            return {
                ...state,
                bankAccountInfo: {
                    ...newBankAccountInfo
                }
            }

        case 'GET_BANK_ACCOUNT_FAILED':
            return {
                ...state,
                error: { ...state.error, bankAccountInfo: action.payload }
            }
        case 'GET_VIRTUAL_CARD_INFO':
            return {
                ...state,
                virtualCardInfo: {
                    ...state.virtualCardInfo,
                    ...convertArrayToObject(action.payload, 'AccountID')
                }
            }
        case 'UPDATE_VIRTUAL_CARD_INFO':
            const { AccountID : VirtualCardID, data : virtualCardInfo } = action.payload;
            return {
                ...state,
                virtualCardInfo: {
                    ...state.virtualCardInfo,
                    [VirtualCardID]: {
                        ...state.virtualCardInfo[VirtualCardID], ...virtualCardInfo
                    }
                }
            }
        case 'ADD_VIRTUAL_CARD_INFO':
            return {
                ...state,
                virtualCardInfo: {
                    ...state.virtualCardInfo,
                    'new': action.payload
                }
            }
        case 'CREATE_VIRTUAL_CARD_SUCCESS':
            const newCardInfo = { AccountID: [action.paylaod] , ...state.virtualCardInfo['new'] }
            const prevVirtualCardInfo = Object.keys(state.virtualCardInfo).filter(key => key !== 'new')
                .reduce((obj, key) => {
                    obj[key] = state.virtualCardInfo[key];
                    return obj;
                }, {});;
            const newVirtualCardInfo = { ...prevVirtualCardInfo, [action.payload]: newCardInfo };
            return {
                ...state,
                virtualCardInfo: {
                    ...newVirtualCardInfo
                }
            }
        case 'GET_VIRTUAL_CARD_ERROR':
            return {
                ...state,
                error: { ...state.error, virtualCardInfo: action.payload }
            }
        case 'GET_EFT_ACCOUNT_INFO':
            return {
                ...state,
                EFTAccountInfo: {
                    ...state.EFTAccountInfo,
                    ...convertArrayToObject(action.payload, 'AccountID')
                }
            }
        case 'UPDATE_EFT_ACCOUNT_INFO':
            const { AccountID:  EFTAccountID, data : EFTAccountData } = action.payload;
            return {
                ...state,
                EFTAccountInfo: {
                    ...state.EFTAccountInfo,
                    [EFTAccountID]: {
                        ...state.EFTAccountInfo[EFTAccountID], ...EFTAccountData
                    }
                }
            }
        case 'ADD_EFT_ACCOUNT_INFO':
            return {
                ...state,
                EFTAccountInfo: {
                    ...state.EFTAccountInfo,
                    'new': action.payload
                }
            }
        case 'CREATE_EFT_ACCOUNT_INFO_SUCCESS':
            const newEFTaccountData = { AccountID: action.paylaod , ...state.EFTAccountInfo['new'] }
            const prevEFTAccountInfo = Object.keys(state.EFTAccountInfo).filter(key => key !== 'new')
                .reduce((obj, key) => {
                    obj[key] = state.EFTAccountInfo[key];
                    return obj;
                }, {});;
            const newEFTAccountInfo = { ...prevEFTAccountInfo, [action.payload]: newEFTaccountData };
            return {
                ...state,
                EFTAccountInfo: {
                    ...newEFTAccountInfo
                }
            }
        case 'GET_EFT_ACCOUNT_ERROR':
            return {
                ...state,
                error: { ...state.error, EFTAccountInfo: action.payload }
            }
        default:
            return {
                ...state
            }
    }
}
