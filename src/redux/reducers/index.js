import { combineReducers } from 'redux'
import user from './user';
import role from './role';
import permissions from './permissions';
import filesettings from './filesettings';
import payment from './payment';
import USbankpayment from './USbank/payments'
import clients from './clients';
import bankClients from './bankClients';
import companyDetails from './companyDetails'
import clientConfig from './clientConfig'
import campaign from './campaign'
import common from './common';
import report from "./report";
import notification from './notification';
import csc from "./csc";
import IPSecurity from './security'
import b2cPayments from './B2C/payments'
import payees from './payees'
const reducer = combineReducers({
    user,
    role,
    permissions,
    filesettings,
    payment,
    USbankpayment,
    clients,
    companyDetails,
    common,
    clientConfig,
    bankClients,
    report,
    campaign,
    notification,
    csc,
    IPSecurity,
    b2cPayments,
    payees
})

export default reducer