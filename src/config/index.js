import _ from 'lodash';
import { BankType } from './bankTypes';
const config = {
  all: {
    env: process.env.REACT_APP_STAGE || 'USBANK_DEV',
    baseName: process.env.PUBLIC_URL,
    sessionTimeout: 1000 * 5 * 12 * 20, //20 min
    showPopupTime: 1000 * 5 * 12 * 1, //1 min
  },
  uat: {
    showCaptcha: false,
    apiBase: 'https://apib2b.incedopay.com:30010/api',
    clientPortalBase: 'https://b2bclient.incedopay.com/',
    bankTypeId: BankType.CITIBANK,
    apiVersion: 'v1',
  },
  CITI_UAT: {
    showCaptcha: false,
    apiBase: 'https://citib2bapi.incedopay.com/api',
    clientPortalBase: 'https://citib2bclient.incedopay.com/',
    bankTypeId: BankType.CITIBANK,
    apiVersion: 'v1',
  },
  CITI_CTE: {
    showCaptcha: true,
    apiBase:'https://b2bapi.paymentexchange.cte.transactionservices.citi.com/api',
    clientPortalBase:'https://b2bclient.paymentexchange.cte.transactionservices.citi.com/',
    bankTypeId: BankType.CITIBANK,
    apiVersion: 'v1',
  },
  CITI_PROD: {
    showCaptcha: true,
    apiBase: 'https://b2bapi.citipaymentexchange.citi.com/api',
    clientPortalBase: 'https://b2bclient.citipaymentexchange.citi.com/',
    bankTypeId: BankType.CITIBANK,
    apiVersion: 'v1',
  },
  CITI_DR: {
    showCaptcha: true,
    apiBase: 'https://b2bapi.citipaymentexchange.citi.com/api',
    clientPortalBase: 'https://b2bclient.citipaymentexchange.citi.com/',
    bankTypeId: BankType.CITIBANK,
    apiVersion: 'v1',
  },
  AWS_CC_DEV: {
    showCaptcha: true,
    apiBase: 'https://b2bapicards.incedopay.com:30010/api',
    clientPortalBase: 'https://b2bclientcards.incedopay.com/',
    bankTypeId: BankType.CITIBANK,
    apiVersion: 'v1',
  },
  AWS_CC_UAT: {
    showCaptcha: false,
    apiBase: 'https://b2bapicardsdemo.incedopay.com:30010/api',
    clientPortalBase: ' https://b2bclientcardsdemo.incedopay.com/',
    bankTypeId: BankType.CITIBANK,
    apiVersion: 'v1',
  },
  CITI_UAT_CC: {
    showCaptcha: false,
    apiBase: "https://citib2bapicards.incedopay.com/api",
    clientPortalBase: "https://citib2bclientcards.incedopay.com/",
    bankTypeId: BankType.CITIBANK,
    apiVersion: 'v1',
  },
  USBANK_DEV: {
    showCaptcha: true,
    apiBase: 'https://b2cusbankapi.incedopay.com:30010/api',
    clientPortalBase: 'https://b2cusbankclient.incedopay.com/',
    bankTypeId: BankType.USBANK,
    apiVersion: 'v2',
  },
  US_UAT: {
    showCaptcha: true,
    apiBase: 'https://b2cusbankapiuat.incedopay.com:30010/api',
    clientPortalBase: 'https://b2cusbankclientuat.incedopay.com/',
    bankTypeId: BankType.USBANK,
    apiVersion: 'v2',
  },
  US_QC:{
    showCaptcha: true,
    apiBase: 'https://b2cusbankapiqc.incedopay.com:30010/api',
    clientPortalBase: 'https://b2cusbankclientqc.incedopay.com/',
    bankTypeId: BankType.USBANK,
    apiVersion: 'v2',
  },
  US_PREPROD:{
    showCaptcha: true,
    apiBase: 'https://b2cusbankapipreprod.incedopay.com:30010/api',
    clientPortalBase: 'https://b2cusbankclientpreprod.incedopay.com:30010/',
    bankTypeId: BankType.USBANK,
    apiVersion: 'v2',
  }
};

export default _.merge(config.all, config[config.all.env]);
