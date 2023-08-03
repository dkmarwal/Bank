import Cookies from 'universal-cookie';
import axios from 'axios';
import config from '~/config';
import { getAccessToken } from '~/redux/helpers/user';
import currency from 'currency.js';
import { BottomNavigationAction } from '@material-ui/core';

axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
}, function (error) {
    // Do something with response error
    if (error.response.status == 401) {
        cookies.remove('@accessToken', { path: `${config.baseName}/` });
        cookies.remove('@refreshToken', { path: `${config.baseName}/` });
        cookies.remove('@portalTypeId', { path: `${config.baseName}/` });
        cookies.remove('@userId', { path: `${config.baseName}/` });
        window.location.href = `${config.baseName}/sessionout`;
    }
    return error.response;
});

export const getCompanyInformation = (clientId) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/company/information?clientId=${clientId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        const { status, message, data } = response.data;
        const { ClientDetails, LocationDetails } = data;

        if (status === 'SuccessFull') {
            dispatch({
                type: 'GET_COMPANY_INFO',
                payload: { ...ClientDetails, ...LocationDetails },
            })
            return true;
        }
        dispatch({
            type: 'GET_COMPANY_INFO_FAILED',
            payload: message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'GET_COMPANY_INFO_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const updateCompanyInformation = (clientId, data) => async (dispatch) => {
    try {
        dispatch({
            type: 'UPDATE_COMPANY_INFO',
            payload: data,
        })
    } catch{
        dispatch({
            type: 'GET_COMPANY_INFO_FAILED',
            payload: data,
        })

    }
}

export const saveCompanyInformation = (clientId) => async (dispatch, getState) => {
    try {
        const { companyDetails: { companyInformation } } = getState();

        const { ClientName, TaxID, Fax, DUNS, Website, PhoneNumber, PhoneExt, LocationTypeID, Address1, Address2, City, StateRegion, ZipPostal, CountryISO } = companyInformation;
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/company/information?clientId=${clientId}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({
                "companyName": ClientName || null,
                "federalTaxId": TaxID || null,
                "fax": Fax || null,
                "duns": DUNS || null,
                "website": Website || null,
                "phone": PhoneNumber || null,
                "phoneExt": PhoneExt || null,
                "countryCode": CountryISO || null,
                "locationTypeID": LocationTypeID || null,
                "locationId": 1,
                "address1": Address1 || null,
                "address2": Address2 || null,
                "city": City || null,
                "stateRegion": StateRegion || null,
                "zipPostal": ZipPostal || null,
                "countryIso": CountryISO || null
            })

        })
        const { status, message, data } = response.data;
        if (status === 'SuccessFull') {
            dispatch({
                type: 'UPDATE_COMPANY_INFO_SUCCESS',
            })
            return true;
        }
        dispatch({
            type: 'UPDATE_COMPANY_INFO_FAILED',
            payload: message || "Oops! Something went wrong."
        })
        return false;

    } catch (error) {
        dispatch({
            type: 'UPDATE_COMPANY_INFO_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const getClientLegalEntityInfo = (clientId) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/legal/entity/information?clientId=${clientId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        const { status, message, data } = response.data;
        if (status === 'SuccessFull') {
            dispatch({
                type: 'GET_CLIENT_ENTITY_INFO',
                payload: data,
            })
            return true;
        }
        dispatch({
            type: 'GET_CLIENT_ENTITY_ERROR',
            payload: message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'GET_CLIENT_ENTITY_ERROR',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const updateClientLegalEntityInfo = (clientId, LegalEntityID, data) => async (dispatch) => {
    try {
        dispatch({
            type: 'UPDATE_CLIENT_ENTITY_INFO',
            payload: { LegalEntityID, data },
        })
    } catch{
        dispatch({
            type: 'UPDATE_CLIENT_ENTITY_ERROR',
            payload: data,
        })

    }
}

export const saveClientLegalEntityInfo = (clientId, entityId) => async (dispatch, getState) => {

    try {
        const { companyDetails: { clientLegalEntityInfo } } = getState();
        //console.log("----------COMPANY DETAIL -------------", clientLegalEntityInfo);

        const a = clientLegalEntityInfo[entityId];
        const accessToken = await getAccessToken()
        const { LegalEntityID, Name, TaxID, Subsidiary, OperatingUnit, MemberOfGUCO, Other } = clientLegalEntityInfo[entityId];
        const response = await axios({
            url: `${config.apiBase}/client/legal/entity/information?clientId=${clientId}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },

            data: JSON.stringify(
                {
                    "legalEntityID": LegalEntityID,
                    "name": Name,
                    "federalTaxId": TaxID,
                    "subsidiary": Subsidiary,
                    "operatingUnit": OperatingUnit,
                    "memberOfGUCO": MemberOfGUCO,
                    "other": Other
                }
            )

        })
        const { status, message, data } = response.data;
        if (status === 'SuccessFull') {
            dispatch({
                type: 'UPDATE_CLIENT_ENTITY_SUCCESS',
            })
            return true;
        }
        dispatch({
            type: 'UPDATE_CLIENT_ENTITY_FAILED',
            payload: message || "Oops! Something went wrong."
        })
        return false;

    } catch (error) {
        dispatch({
            type: 'UPDATE_CLIENT_ENTITY_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}


export const createClientLegalEntityInfo = (clientId) => async (dispatch, getState) => {

    try {
        const { companyDetails: { clientLegalEntityInfo } } = getState();
        //console.log("----------COMPANY DETAIL -------------", clientLegalEntityInfo);

        const { Name, TaxID, Subsidiary, OperatingUnit, MemberOfGUCO, Other } = clientLegalEntityInfo['new'];
        const response = await axios({
            url: `${config.apiBase}/client/legal/entity/information?clientId=${clientId}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(
                {
                    "name": Name,
                    "federalTaxId": TaxID,
                    "subsidiary": Subsidiary,
                    "operatingUnit": OperatingUnit,
                    "memberOfGUCO": MemberOfGUCO,
                    "other": Other
                }
            )

        })
        const { status, message, data } = response.data;

        if (status === 'SuccessFull') {
            dispatch({
                type: 'CREATE_CLIENT_ENTITY_SUCCESS',
                payload: data.LegalEntityID,
            })
            return true;
        }
        dispatch({
            type: 'CREATE_CLIENT_ENTITY_FAILED',
            payload: message || "Oops! Something went wrong."
        })
        return false;

    } catch (error) {
        dispatch({
            type: 'CREATE_CLIENT_ENTITY_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const addClientLegalEntityInfo = (clientId) => async (dispatch) => {
    const data =
    {
        Name: '',
        TaxID: '',
        Subsidiary: 0,
        OperatingUnit: 0,
        MemberOfGUCO: 0,
        Other: 0
    };
    try {
        dispatch({
            type: 'ADD_CLIENT_ENTITY_INFO',
            payload: data,
        })
    } catch{
        dispatch({
            type: 'ADD_CLIENT_ENTITY_FAILED',
            payload: "An error has occurred",
        })

    }
}
//----------------------------Contact Information Calls ------------------------------
// -------------------------------------------------------------------------------
// -------------------------------------------------------------

export const getContactInfo = (clientId) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/contact/information?clientId=${clientId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        const { status, message, data } = response.data;
        if (status === 'SuccessFull') {
            dispatch({
                type: 'GET_CONTACT_INFO',
                payload: data,
            })
            return true;
        }
        dispatch({
            type: 'GET_CONTACT_INFO_FAILED',
            payload: message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'GET_CONTACT_INFO_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const updateContactInfo = (clientId, ContactID, data) => async (dispatch) => {
    try {
        dispatch({
            type: 'UPDATE_CONTACT_INFO',
            payload: { ContactID, data },
        })
    } catch{
        dispatch({
            type: 'UPDATE_CONTACT_INFO_ERROR',
            payload: data,
        })

    }
}

export const saveContactInfo = (clientId, entityId) => async (dispatch, getState) => {

    try {
        const { companyDetails: { contactInformation } } = getState();

        const {
            ContactID,
            Title,
            DisplayName,
            FirstName,
            LastName,
            Phone,
            PhoneExt,
            JobTitle,
            Fax,
            Email,
            Country,
            City,
            State,
            ZipCode,
            LocationTypeID,
            ContactTypeID,
        } = contactInformation[entityId];
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/contact/information?clientId=${clientId}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(
                {
                    "contactId": ContactID,
                    "title": Title,
                    "firstName": FirstName,
                    "lastName": LastName,
                    "displayName": DisplayName,
                    "jobTitle": JobTitle,
                    "phone": Phone,
                    "phoneExt": PhoneExt,
                    "fax": Fax,
                    "email": Email,
                    "locationTypeID": LocationTypeID,
                    "country": Country,
                    "city": City,
                    "state": State,
                    "zipCode": ZipCode,
                    "contactTypeID": ContactTypeID,
                }
            )

        })
        const { status, message, data } = response.data;
        if (status === 'SuccessFull') {
            dispatch({
                type: 'UPDATE_CONTACT_INFO_SUCCESS',
            })
            return true;
        }
        dispatch({
            type: 'UPDATE_CONTACT_INFO_FAILED',
            payload: message || "Oops! Something went wrong."
        })
        return false;

    } catch (error) {
        dispatch({
            type: 'UPDATE_CONTACT_INFO_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const createContactInfo = (clientId) => async (dispatch, getState) => {

    try {
        const { companyDetails: { contactInformation } } = getState();
        //console.log("----------COMPANY DETAIL -------------", contactInformation);

        const {
            ContactTypeID,
            JobTitle,
            DisplayName,
            Title,
            FirstName,
            LastName,
            Phone,
            PhoneExt,
            Fax,
            Email,
            Country,
            City,
            State,
            ZipCode,
            LocationTypeID,
        } = contactInformation['new'];
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/contact/information?clientId=${clientId}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(
                {
                    "title": Title,
                    "firstName": FirstName,
                    "lastName": LastName,
                    "displayName": DisplayName,
                    "jobTitle": JobTitle,
                    "phone": Phone,
                    "phoneExt": PhoneExt,
                    "fax": Fax,
                    "email": Email,
                    "locationTypeID": LocationTypeID,
                    "country": Country,
                    "city": City,
                    "state": State,
                    "zipCode": ZipCode,
                    "contactTypeID": ContactTypeID,
                }
            )

        })
        const { status, message, data } = response.data;

        if (status === 'SuccessFull') {
            dispatch({
                type: 'CREATE_CONTACT_INFO_SUCCESS',
                payload: data.ContactID,
            })
            return true;
        }
        dispatch({
            type: 'CREATE_CONTACT_INFO_FAILED',
            payload: message || "Oops! Something went wrong."
        })
        return false;

    } catch (error) {
        dispatch({
            type: 'CREATE_CONTACT_INFO_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const addContactInfo = (clientId) => async (dispatch) => {
    const data =
    {
        "title": "",
        "firstName": "",
        "lastName": "",
        "displayName": "",
        "jobTitle": "",
        "phone": "",
        "phoneExt": "",
        "fax": "",
        "email": "",
        "locationTypeID": 1,
        "CreatedBy": null,
        "LastUpdatedBy": null,
        "country": "",
        "city": "",
        "state": "",
        "zipCode": "",
        "contactTypeID": 1
    }

    try {
        dispatch({
            type: 'ADD_CONTACT_INFO',
            payload: data,
        })
    } catch{
        dispatch({
            type: 'ADD_CLIENT_ENTITY_FAILED',
            payload: "An error has occurred",
        })

    }
}

export const getBankAccountInfo = (clientId) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/configure/bank/account/information?clientId=${clientId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        const { status, message, data } = response.data;
        if (status === 'SuccessFull') {
            dispatch({
                type: 'GET_BANK_ACCOUNT_INFO',
                payload: data,
            })
            return true;
        }
        dispatch({
            type: 'GET_BANK_ACCOUNT_FAILED',
            payload: message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'GET_BANK_ACCOUNT_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}


export const updateBankAccountInfo = (clientId, AccountID, data) => async (dispatch) => {
    try {
        dispatch({
            type: 'UPDATE_BANK_ACCOUNT_INFO',
            payload: { AccountID, data },
        })
    } catch{
        dispatch({
            type: 'UPDATE_BANK_ACCOUNT_ERROR',
            payload: data,
        })

    }
}

export const saveBankAccountInfo = (clientId, entityId) => async (dispatch, getState) => {

    try {
        const { companyDetails: { bankAccountInfo } } = getState();

        const {
            AccountID,
            BankName,
            AccountNumber,
            RoutingCode,
            BankCity,
            BankStateRegion,
            BankCountryISO,
            AcctTypeID,
            CurrencyCode,
        } = bankAccountInfo[entityId];
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/configure/bank/account/information`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(
                {
                    "clientId": clientId,
                    "accountId": AccountID,
                    "accountNumber": AccountNumber,
                    "routingCode": RoutingCode,
                    "bankName": BankName,
                    "bankCity": BankCity,
                    "bankStateRegion": BankStateRegion,
                    "bankCountryIso": BankCountryISO,
                    "currencyCode": CurrencyCode,
                    "accountClassificationId": AcctTypeID
                }
            )

        })
        const { status, message, data } = response.data;
        if (status === 'SuccessFull') {
            dispatch({
                type: 'UPDATE_BANK_ACCOUNT_SUCCESS',
            })
            return true;
        }
        dispatch({
            type: 'UPDATE_BANK_ACCOUNT_FAILED',
            payload: message || "Oops! Something went wrong."
        })
        return false;

    } catch (error) {
        dispatch({
            type: 'UPDATE_BANK_ACCOUNT_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const createBankAccountInfo = (clientId) => async (dispatch, getState) => {

    try {
        const { companyDetails: { bankAccountInfo } } = getState();
        //console.log("----------COMPANY DETAIL -------------", bankAccountInfo);

        const {
            AccountID,
            BankName,
            AccountNumber,
            RoutingCode,
            BankCity,
            BankStateRegion,
            BankCountryISO,
            AcctTypeID,
            CurrencyCode,
        } = bankAccountInfo['new'];
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/configure/bank/account/information`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(
                {
                    "clientId": clientId,
                    "accountId": AccountID,
                    "accountNumber": AccountNumber,
                    "routingCode": RoutingCode,
                    "bankName": BankName,
                    "bankCity": BankCity,
                    "bankStateRegion": BankStateRegion,
                    "bankCountryIso": BankCountryISO,
                    "currencyCode": CurrencyCode,
                    "accountClassificationId": AcctTypeID,
                }
            )

        })
        const { status, message, data } = response.data;

        if (status === 'SuccessFull') {
            dispatch({
                type: 'CREATE_BANK_ACCOUNT_SUCCESS',
                payload: data.insertId,
            })
            return true;
        }
        dispatch({
            type: 'CREATE_BANK_ACCOUNT_FAILED',
            payload: message || "Oops! Something went wrong."
        })
        return false;

    } catch (error) {
        dispatch({
            type: 'CREATE_BANK_ACCOUNT_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const addBankAccountInfo = (clientId) => async (dispatch) => {

    const data = {
        "BankName": "",
        "AccountNumber": "",
        "RoutingCode": "",
        "BankCity": "",
        "BankStateRegion": "",
        "BankCountryISO": "",
        "AcctTypeID": 1,
        "CurrencyCode": 1,
    };

    try {
        dispatch({
            type: 'ADD_BANK_ACCOUNT_INFO',
            payload: data,
        })
    } catch{
        dispatch({
            type: 'ADD_BANK_ACCOUNT_FAILED',
            payload: "An error has occurred",
        })

    }
}

export const getEFTAccountInfo = (clientId) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/configure/bank/account/information?clientId=${clientId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        const { status, message, data } = response.data;
        if (status === 'SuccessFull') {
            dispatch({
                type: 'GET_EFT_ACCOUNT_INFO',
                payload: data,
            })
            return true;
        }
        dispatch({
            type: 'GET_EFT_ACCOUNT_ERROR',
            payload: message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'GET_EFT_ACCOUNT_ERROR',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const updateEFTAccountInfo = (clientId, AccountID, data) => async (dispatch) => {
    try {
        dispatch({
            type: 'UPDATE_EFT_ACCOUNT_INFO',
            payload: { AccountID, data },
        })
    } catch{
        dispatch({
            type: 'UPDATE_EFT_ACCOUNT_ERROR',
            payload: data,
        })

    }
}

export const saveEFTAccountInfo = (clientId, entityId) => async (dispatch, getState) => {

    try {
        const { companyDetails: { EFTAccountInfo } } = getState();

        const {
            AccountID,
            BankName,
            AccountNumber,
            RoutingCode,
            BankCity,
            BankStateRegion,
            BankCountryISO,
            AcctTypeID,
            CurrencyCode,
        } = EFTAccountInfo[entityId];
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/configure/bank/account/information`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(
                {
                    "clientId": clientId,
                    "accountId": AccountID,
                    "accountNumber": AccountNumber,
                    "routingCode": RoutingCode,
                    "bankName": BankName,
                    "bankCity": BankCity,
                    "bankStateRegion": BankStateRegion,
                    "bankCountryIso": BankCountryISO,
                    "currencyCode": CurrencyCode,
                    "accountClassificationId": AcctTypeID
                }
            )

        })
        const { status, message, data } = response.data;
        if (status === 'SuccessFull') {
            dispatch({
                type: 'SAVE_EFT_ACCOUNT_SUCCESS',
            })
            return true;
        }
        dispatch({
            type: 'SAVE_EFT_ACCOUNT_ERROR',
            payload: message || "Oops! Something went wrong."
        })
        return false;

    } catch (error) {
        dispatch({
            type: 'SAVE_EFT_ACCOUNT_ERROR',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const createEFTAccountInfo = (clientId) => async (dispatch, getState) => {

    try {
        const { companyDetails: { EFTAccountInfo } } = getState();
        const {
            AccountID,
            BankName,
            AccountNumber,
            RoutingCode,
            BankCity,
            BankStateRegion,
            BankCountryISO,
            AcctTypeID,
            CurrencyCode,
        } = EFTAccountInfo['new'];
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/configure/bank/account/information`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(
                {
                    "clientId": clientId,
                    "accountId": AccountID,
                    "accountNumber": AccountNumber,
                    "routingCode": RoutingCode,
                    "bankName": BankName,
                    "bankCity": BankCity,
                    "bankStateRegion": BankStateRegion,
                    "bankCountryIso": BankCountryISO,
                    "currencyCode": CurrencyCode,
                    "accountClassificationId": AcctTypeID,
                }
            )

        })
        const { status, message, data } = response.data;

        if (status === 'SuccessFull') {
            dispatch({
                type: 'CREATE_EFT_ACCOUNT_INFO_SUCCESS',
                payload: data.insertId,
            })
            return true;
        }
        dispatch({
            type: 'CREATE_EFT_ACCOUNT_FAILED',
            payload: message || "Oops! Something went wrong."
        })
        return false;

    } catch (error) {
        dispatch({
            type: 'CREATE_EFT_ACCOUNT_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const addEFTAccountInfo = (clientId) => async (dispatch) => {

    const data = {
        "BankName": "",
        "AccountNumber": "",
        "RoutingCode": "",
        "BankCity": "",
        "BankStateRegion": "",
        "BankCountryISO": "",
        "AcctTypeID": 1,
        "CurrencyCode": 1,
    };

    try {
        dispatch({
            type: 'ADD_EFT_ACCOUNT_INFO',
            payload: data,
        })
    } catch{
        dispatch({
            type: 'ADD_EFT_ACCOUNT_FAILED',
            payload: "An error has occurred",
        })

    }
}


export const getVirtualCardInfo = (clientId) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/virtualCard?clientID=${clientId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        const { status, message, data } = response.data;
        if (status === 'SuccessFull') {
            dispatch({
                type: 'GET_VIRTUAL_CARD_INFO',
                payload: data,
            })
            return true;
        }
        dispatch({
            type: 'GET_VIRTUAL_CARD_ERROR',
            payload: message || "Oops! Something went wrong."
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'GET_VIRTUAL_CARD_ERROR',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const updateVirtualCardInfo = (clientId, AccountID, data) => async (dispatch) => {
    try {
        dispatch({
            type: 'UPDATE_VIRTUAL_CARD_INFO',
            payload: { AccountID, data },
        })
    } catch{
        dispatch({
            type: 'UPDATE_VIRTUAL_CARD_ERROR',
            payload: data,
        })

    }
}

export const saveVirtualCardInfo = (clientId, entityId) => async (dispatch, getState) => {

    try {
        const { companyDetails: { virtualCardInfo } } = getState();
        const {
            AccountID,
            CardAlias,
            AccountNumber,
            cardType,
            ValidFor,
            CurrencyCode,
            Currency,
            IssuerId,
            purchaseType,
        } = virtualCardInfo[entityId];
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/configure/virtualCard/update`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(
                {
                    "clientId": clientId,
                    "accountId": AccountID,
                    "accountNumber": AccountNumber,
                    "currency": Currency,
                    "currencyCode": CurrencyCode,
                    "issuerId": IssuerId,
                    "cardAlias": CardAlias,
                    "validUpto": ValidFor,
                    "cardType": cardType,
                    "purchaseType": purchaseType,
                }
            )
        })

        const { status, message, data } = response.data;
        if (status === 'SuccessFull') {
            dispatch({
                type: 'SAVE_VIRTUAL_CARD_SUCCESS',
            })
            return true;
        }
        dispatch({
            type: 'SAVE_VIRTUAL_CARD_FAILED',
            payload: message || "Oops! Something went wrong."
        })
        return false;

    } catch (error) {
        dispatch({
            type: 'SAVE_VIRTUAL_CARD_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const createVirtualCardInfo = (clientId) => async (dispatch, getState) => {

    try {
        const { companyDetails: { virtualCardInfo } } = getState();

        const {
            AccountID,
            CardAlias,
            AccountNumber,
            cardType,
            ValidFor,
            CurrencyCode,
            Currency,
            IssuerId,
            purchaseType,
        } = virtualCardInfo['new'];
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase}/client/configure/virtualCard/insert`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(
                {
                    "clientId": clientId,
                    "accountNumber": AccountNumber,
                    "currency": Currency,
                    "currencyCode": CurrencyCode,
                    "issuerId": IssuerId,
                    "cardAlias": CardAlias,
                    "validUpto": ValidFor,
                    "cardType": cardType,
                    // "purchaseType": purchaseType
                }
            )

        })
        const { status, message, data } = response.data;

        if (status === 'SuccessFull') {
            dispatch({
                type: 'CREATE_VIRTUAL_CARD_SUCCESS',
                payload: data.accountId,
            })
            return true;
        }
        dispatch({
            type: 'CREATE_VIRTUAL_CARD_FAILED',
            payload: message || "Oops! Something went wrong."
        })
        return false;

    } catch (error) {
        dispatch({
            type: 'CREATE_VIRTUAL_CARD_FAILED',
            payload: error.message || "An error has occurred."
        })
        return false;
    }
}

export const addVirtualCardInfo = (clientId) => async (dispatch) => {

    const data = {
        "clientId": clientId,
        "AccountNumber": "",
        "Currency": "",
        "CurrencyCode": "",
        "IssuerId": "",
        "CardAlias": "",
        "ValidFor": "4",    
        "cardType": 2,
        "purchaseType":1,
    };

    try {
        dispatch({
            type: 'ADD_VIRTUAL_CARD_INFO',
            payload: data,
        })
    } catch{
        dispatch({
            type: 'ADD_VIRTUAL_CARD_FAILED',
            payload: "An error has occurred",
        })

    }
}




