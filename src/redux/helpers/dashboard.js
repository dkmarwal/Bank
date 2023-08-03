import axios from "axios";
import Cookies from "universal-cookie";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";

let cookies = new Cookies();
let token = cookies.get("@clientAccessToken");
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
}, function (error) {
    // Do something with response error
    if (error.response.status === 401) {
        // let cookies = new Cookies();
        // cookies.remove('@accessToken', { path: `${config.baseName}/` });
        // cookies.remove('@refreshToken', { path: `${config.baseName}/` });
        // cookies.remove('@portalTypeId', { path: `${config.baseName}/` });
        // cookies.remove('@userId', { path: `${config.baseName}/` });
        // window.location.href = "/"
    }
    return error.response;
});


export const fetchDashboardPayments = async (payload) => {
    const data =  {
        "error": false,
        "message": "Success",
        "data": [
            {
                "figure": "0.0000",
                "figureFor": "1W",
                "paymentType": "VCA",
                "currency": "USD",
                "colourCode": "#6050DC",
                "description":"Virtual Card"
              },
              {
                "figure": "0.0000",
                "figureFor": "1W",
                "paymentType": "PPL",
                "currency": "USD",
                "colourCode": "#C5BBDB",
                "description":"PayPal"
              },
              {
                "figure": "0.0000",
                "figureFor": "1W",
                "paymentType": "MSC",
                "currency": "USD",
                "colourCode": "#9B7FBC",
                "description":"Instant Pay"
              },
              {
                "figure": "139300.0000",
                "figureFor": "1W",
                "paymentType": "CXC",
                "currency": "USD",
                "colourCode": "#6F459C",
                "description":"Zelle"
              },
              {
                "figure": "0.0000",
                "figureFor": "1W",
                "paymentType": "CHK",
                "currency": "USD",
                "colourCode": "#DADAEB",
                "description":"Check"
              },
              {
                "figure": "0.0000",
                "figureFor": "1W",
                "paymentType": "ACH",
                "currency": "USD",
                "colourCode": "#3F007D",
                "description":"Bank Deposit(ACH)"
              },
              {
                "figure": "0.0000",
                "figureFor": "2W",
                "paymentType": "VCA",
                "currency": "USD",
                "colourCode": "#6050DC",
                "description":"Virtual Card"
              },
              {
                "figure": "0.0000",
                "figureFor": "2W",
                "paymentType": "PPL",
                "currency": "USD",
                "colourCode": "#C5BBDB",
                "description":"PayPal"
              },
              {
                "figure": "0.0000",
                "figureFor": "2W",
                "paymentType": "MSC",
                "currency": "USD",
                "colourCode": "#9B7FBC",
                "description":"Instant Pay"
              },
              {
                "figure": "0.0000",
                "figureFor": "2W",
                "paymentType": "CXC",
                "currency": "USD",
                "colourCode": "#6F459C",
                "description":"Zelle"
              },
              {
                "figure": "150000.0000",
                "figureFor": "2W",
                "paymentType": "CHK",
                "currency": "USD",
                "colourCode": "#DADAEB",
                "description":"Check"
              },
              {
                "figure": "150500.0000",
                "figureFor": "2W",
                "paymentType": "ACH",
                "currency": "USD",
                "colourCode": "#3F007D",
                "description":"Bank Deposit(ACH)"
              },
              {
                "figure": "0.0000",
                "figureFor": "3W",
                "paymentType": "VCA",
                "currency": "USD",
                "colourCode": "#6050DC",
                "description":"Virtual Card"
              },
              {
                "figure": "0.0000",
                "figureFor": "3W",
                "paymentType": "PPL",
                "currency": "USD",
                "colourCode": "#C5BBDB",
                "description":"PayPal"
              },
              {
                "figure": "0.0000",
                "figureFor": "3W",
                "paymentType": "MSC",
                "currency": "USD",
                "colourCode": "#9B7FBC",
                "description":"Instant Pay"
              },
              {
                "figure": "0.0000",
                "figureFor": "3W",
                "paymentType": "CXC",
                "currency": "USD",
                "colourCode": "#6F459C",
                "description":"Zelle"
              },
              {
                "figure": "0.0000",
                "figureFor": "3W",
                "paymentType": "CHK",
                "currency": "USD",
                "colourCode": "#DADAEB",
                "description":"Check"
              },
              {
                "figure": "0.0000",
                "figureFor": "3W",
                "paymentType": "ACH",
                "currency": "USD",
                "colourCode": "#3F007D",
                "description":"Bank Deposit(ACH)"
              },
              {
                "figure": "0.0000",
                "figureFor": "4W",
                "paymentType": "VCA",
                "currency": "USD",
                "colourCode": "#6050DC",
                "description":"Virtual Card"
              },
              {
                "figure": "0.0000",
                "figureFor": "4W",
                "paymentType": "PPL",
                "currency": "USD",
                "colourCode": "#C5BBDB",
                "description":"PayPal"
              },
              {
                "figure": "0.0000",
                "figureFor": "4W",
                "paymentType": "MSC",
                "currency": "USD",
                "colourCode": "#9B7FBC",
                "description":"Instant Pay"
              },
              {
                "figure": "10050.0000",
                "figureFor": "4W",
                "paymentType": "CXC",
                "currency": "USD",
                "colourCode": "#6F459C",
                "description":"Zelle"
              },
              {
                "figure": "43500.0000",
                "figureFor": "4W",
                "paymentType": "CHK",
                "currency": "USD",
                "colourCode": "#DADAEB",
                "description":"Check"
              },
              {
                "figure": "0.0000",
                "figureFor": "4W",
                "paymentType": "ACH",
                "currency": "USD",
                "colourCode": "#3F007D",
                "description":"Bank Deposit(ACH)"
              },
              {
                "figure": "0.0000",
                "figureFor": "5W",
                "paymentType": "VCA",
                "currency": "USD",
                "colourCode": "#6050DC",
                "description":"Virtual Card"
              },
              {
                "figure": "0.0000",
                "figureFor": "5W",
                "paymentType": "PPL",
                "currency": "USD",
                "colourCode": "#C5BBDB",
                "description":"PayPal"
              },
              {
                "figure": "0.0000",
                "figureFor": "5W",
                "paymentType": "MSC",
                "currency": "USD",
                "colourCode": "#9B7FBC",
                "description":"Instant Pay"
              },
              {
                "figure": "200.0000",
                "figureFor": "5W",
                "paymentType": "CXC",
                "currency": "USD",
                "colourCode": "#6F459C",
                "description":"Zelle"
              },
              {
                "figure": "50000.0000",
                "figureFor": "5W",
                "paymentType": "CHK",
                "currency": "USD",
                "colourCode": "#DADAEB",
                "description":"Check"
              },
              {
                "figure": "50000.0000",
                "figureFor": "5W",
                "paymentType": "ACH",
                "currency": "USD",
                "colourCode": "#3F007D",
                "description":"Bank Deposit(ACH)"
              }
        ]
    }
    try {
        const accessToken = await getAccessToken();
        const urlVersion = config.apiVersion === 'v2' ? `/${config.apiVersion}` : ''
        const accessURL = //"https://apib2b.incedopay.com:30010/api/report-service/GetDashboardPaymentData"
        // "https://b2cusbankapi.incedopay.com:30010/api/report-service/GetDashboardPaymentData"
        `${config.apiBase}/report-service${urlVersion}/GetDashboardPaymentData`
        const response = await axios({
            url: accessURL,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(payload)
        });
        const responseBody = await response.data;
        if(response.status === 400){
          return {
            error:true,
            message:'Bad Request'
          }
        }
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};


export const fetchDashboardPaymentSummary = async (payload) => {
const data = {
  error: false,
  message: 'Success',
  data: [
    {
      totalPayments: 19720,
      totalAmount: 7799468.64,
      paymentDetails: [
        {
            "paymentCode": "CXC",
            "description": "Zelle",
            "colourCode": "#6F459C",
            "totalPaymentCount": 16340,
            "totalPaymentAmount": 682463.57,
            "percentage": 82.86
          },
          {
            "paymentCode": "CHK",
            "description": "Check",
            "colourCode": "#DADAEB",
            "totalPaymentCount": 330,
            "totalPaymentAmount": 228290.21,
            "percentage": 1.67
          },
          {
            "paymentCode": "ACH",
            "description": "Bank Deposit (ACH)",
            "colourCode": "#3F007D",
            "totalPaymentCount": 329,
            "totalPaymentAmount": 6457741.82,
            "percentage": 1.67
          },
          {
            "paymentCode": "RTP",
            "description": "RTP",
            "colourCode": "#D52DB7",
            "totalPaymentCount": 0,
            "totalPaymentAmount": 0,
            "percentage": 0
          },
          {
            "paymentCode": "DDC",
            "description": "Deposit to Debit Card",
            "colourCode": "#FF2E7E",
            "totalPaymentCount": 0,
            "totalPaymentAmount": 0,
            "percentage": 0
          },
          {
            "paymentCode": "PPD",
            "description": "Prepaid Card",
            "colourCode": "#FF6B45",
            "totalPaymentCount": 0,
            "totalPaymentAmount": 0,
            "percentage": 0
          },
          {
            "paymentCode": "PCR",
            "description": "Corporate Reward",
            "colourCode": "#FFAB05",
            "totalPaymentCount": 0,
            "totalPaymentAmount": 0,
            "percentage": 0
          },
          {
            "paymentCode": "PFB",
            "description": "Focus Non-Payroll",
            "colourCode": "#E6F69D",
            "totalPaymentCount": 0,
            "totalPaymentAmount": 0,
            "percentage": 0
          },
          {
            "paymentCode": "PRC",
            "description": "ReliaCard",
            "colourCode": "#AADEA7",
            "totalPaymentCount": 0,
            "totalPaymentAmount": 0,
            "percentage": 0
          },
          {
            "paymentCode": "CRP",
            "description": "Plastic Card",
            "colourCode": "#64C2A6",
            "totalPaymentCount": 0,
            "totalPaymentAmount": 0,
            "percentage": 0
          }
      ],
    },
  ],
};

    try {
        const accessToken = await getAccessToken();
        const urlVersion = config.apiVersion === 'v2' ? `/${config.apiVersion}` : ''
        const accessURL =//"https://apib2b.incedopay.com:30010/api/report-service/GetDashboardPaymentSummary"
        // "https://b2cusbankapi.incedopay.com:30010/api/report-service/GetDashboardPaymentSummary"
             `${config.apiBase}/report-service${urlVersion}/GetDashboardPaymentSummary`
        const response = await axios({
            url: accessURL,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(payload)
        });
        const responseBody = await response.data;
        if(response.status === 400){
          return {
            error:true,
            message:'Bad Request'
          }
        }
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};


export const fetchSupplierEnrollmentStats = async () => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/payee-service/v1/dashboard/bank/payee/count`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        });
        const responseBody = await response.data;
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                "An error has occured.",
            data: {},
            error: true,
        };
    }
}

export const fetchSupplierEnrollmentData = async (campaignId, clientId, reportType) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: clientId ? `${config.apiBase}/payee-service/v1/dashboard/payee/enroll?campaignId=${campaignId}&reportType=${reportType}&clientId=${clientId}` : 
            `${config.apiBase}/payee-service/v1/dashboard/payee/enroll?campaignId=${campaignId}&reportType=${reportType}` ,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        });
        const responseBody = await response.data;
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};


export const fetchDashboardCampaigns = async (clientIds) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/payee-service/v1/campaign-list`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({ clientId: clientIds })
        });
        const responseBody = await response.data;
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};

export const fetchDashboardSankeyData = async (clientId, campaignId, reportType) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/payee-service/v1/client-dashboard/campaign`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({
                clientId: clientId,
                campaignId: JSON.stringify(campaignId),
                reportType: reportType
            })
        });
        const responseBody = await response.data;
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};

export const B2CEnrollGraph = async (payloadData) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/consumer-service/${config.apiVersion}/enrollment-graph`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(payloadData)
        });
        const responseBody = await response.data;
        return responseBody
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};


export const fetchCCYearList = async () => {    
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/mastercard-service/1/yearList`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },            
        });
        const responseBody = await response.data;
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};

export const fetchCCGraphData = async (payload) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/mastercard-service/1/cumulativeSpendGraph`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache'                
            }, 
            data: JSON.stringify(payload)           
        });
        const responseBody = await response.data;
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};

export const fetchCCEnrollVendorsList = async () => {    
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/mastercard-service/1/venders`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },            
        });
        const responseBody = await response.data;
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};

export const fetchCCEnrollPayersList = async (Id) => {    
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/mastercard-service/1/payers?CampaignVendorId=${Id}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },            
        });
        const responseBody = await response.data;
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};

export const fetchCCEnrollCampaignsList = async (vendorId, payerId) => {    
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/mastercard-service/1/Campaigns?CampaignVendorId=${vendorId}&ClientId=${payerId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },            
        });
        const responseBody = await response.data;
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};

export const fetchCCEnrollGraphs = async ({vendorId, payerId, campaignsId, period, currency, fromDate, toDate, gType}) => { 
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/mastercard-service/1/EnrollmentOverTimeReport?VendorId=${vendorId}&PayerId=${payerId}&CampaignId=${campaignsId}&ModeOfPeriod=${period}&CurrencyType=${currency}&FromDate=${fromDate}&EndDate=${toDate}&GraphType=${gType}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },            
        });
        const responseBody = await response.data;
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};

export const fetchCCRiskAnalysisGraph = async ({ClientID, PayeeRegInfoId, LineOfRisk, AboveThreshhold, UserID}) => { 
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase}/mastercard-service/1/RiskAnalysisGraph?ClientID=${ClientID}&PayeeRegInfoId=${PayeeRegInfoId}&LineOfRisk=${LineOfRisk}&AboveThreshhold=${AboveThreshhold}&UserID=${UserID}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },            
        });
        const responseBody = await response.data;
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};



