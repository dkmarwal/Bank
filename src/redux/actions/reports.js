import Cookies from "universal-cookie";
import axios from "axios";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";

axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response;
}, function (error) {
  // Do something with response error
  if (error.response.status == 401) {
    let cookies = new Cookies();
    cookies.remove('@accessToken', { path: `${config.baseName}/` });
    cookies.remove('@refreshToken', { path: `${config.baseName}/` });
    cookies.remove('@portalTypeId', { path: `${config.baseName}/` });
    cookies.remove('@userId', { path: `${config.baseName}/` });
    window.location.href = `${config.baseName}/sessionout`;
  }
  return error.response;
});

/*
Get report list
*/
export const getReportList = ({ userId, portalProfileId, portalTypeId, selectedClient, name, dateFilter, startDate, endDate, rowsPerPage, page, sortColumn, sortOrder }) => async (dispatch) => {

  /*const data= [{
      "bankReportId": 963,
      "userId": 10671,
      "parametersCount": 17,
      "reportName": "Total Payee",
      "dataTypeId": 2,
      "dataType": "Payee Enrollment",
      "frequency": "Daily",
      "subscription": false,
      "isDynamic": false,
      "reportCode": "totalPayee",
      "isDeleted": false,
      "createdAt": "2020-12-17T02:59:33.000Z",
      "updatedAt": null,
      "deletedAt": null,
      "generatedBy": "System",
      "updatedBy": "null",
      "deletedBy": "null"
  }, {
      "bankReportId": 964,
      "userId": 10671,
      "parametersCount": 17,
      "reportName": "Enrollment Summary",
      "dataTypeId": 2,
      "dataType": "Payee Enrollment",
      "frequency": "",
      "subscription": false,
      "isDynamic": false,
      "reportCode": "enrollmentSummary",
      "isDeleted": false,
      "createdAt": "2020-12-17T02:59:33.000Z",
      "updatedAt": null,
      "deletedAt": null,
      "generatedBy": "System",
      "updatedBy": "null",
      "deletedBy": "null"
  }, {
      "bankReportId": 965,
      "userId": 10671,
      "parametersCount": 6,
      "reportName": "Payment Monthly Status",
      "dataTypeId": 1,
      "dataType": "Payment",
      "frequency": "Daily",
      "subscription": false,
      "isDynamic": false,
      "reportCode": "PaymentsMonthlyStatus",
      "isDeleted": false,
      "createdAt": "2020-12-17T02:59:33.000Z",
      "updatedAt": null,
      "deletedAt": null,
      "generatedBy": "System",
      "updatedBy": "null",
      "deletedBy": "null"
  }, {
      "bankReportId": 966,
      "userId": 10671,
      "parametersCount": 16,
      "reportName": "Daily File Total",
      "dataTypeId": 1,
      "dataType": "Payment",
      "frequency": "Daily",
      "subscription": false,
      "isDynamic": false,
      "reportCode": "DailyAllClientPayments",
      "isDeleted": false,
      "createdAt": "2020-12-17T02:59:33.000Z",
      "updatedAt": null,
      "deletedAt": null,
      "generatedBy": "System",
      "updatedBy": "null",
      "deletedBy": "null"
  }
];
  dispatch({
          type: 'REPORT_LIST_FETCH_SUCCESS',
          payload: data,
          totalCount:12,
      })
      return true;
  */
  const offset = rowsPerPage * page;
  const newSortColumn = sortColumn || "reportName";
  const newSortOrder = sortOrder || "asc";
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      //url: `${config.apiBase}/client-config-service/v1/reporting/list?clientId=${selectedClient}&limit=${rowsPerPage}&offset=${offset}&reportName=${name}`,
      url: `${config.apiBase}/client-config-service/v1/bank/reporting/list?limit=${rowsPerPage}&offset=${offset}&sortColumn=${newSortColumn}&sortOrder=${newSortOrder}&reportName=${name}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      /*data: JSON.stringify({
          name: name || "",
          pageNo: pageNo || 1,
          pageSize: pageSize || 10,
          sortColumn: sortColumn || "",
          sortOrder: sortOrder || ""
      })*/
    })
    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: 'REPORT_LIST_FETCH_SUCCESS',
        payload: responseBody.data && responseBody.data.rows,
        totalCount: responseBody.data && responseBody.data.count || 0
      })
      return true;
    }
    dispatch({
      type: 'REPORT_LIST_FETCH_FAILED',
      payload: responseBody.message || "Oops! Something went wrong."
    })
    return false;
  } catch (error) {
    dispatch({
      type: 'REPORT_LIST_FETCH_FAILED',
      payload: error.response && error.response.data.message || "An error has occurred."
    })
    return false;
  }
}

/*
Create new report
*/
export const createReport = (data) => async dispatch => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/bank-report`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        reportName: data.name,
        dataType: data.dataType,
        frequency: data.emailSubscriptionFrequency,
        frequencyId: data.frequencyId,
        datatypeId: data.dataTypeId,
        dataTypeMappingId: data.selectedPaymentParameters,
        subscription: data.isSubscriber,
        fromDate: data.startDate,
        toDate: data.endDate,
        dateFilter: data.dateFilter,
        parametersCount: data.selectedPaymentParameters && data.selectedPaymentParameters.length > 0 ?
          data.selectedPaymentParameters.length : 0
      })
    });

    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: 'CREATE_REPORT_SUCCESS',
        // payload: { ...report, reportId: responseBody.data.reportId },//add reportId from response
        payload: responseBody.data,
      })
      // return { ...report, reportId: responseBody.data.reportId };
      return responseBody.data
    }
    dispatch({
      type: 'CREATE_REPORT_FAILED',
      payload: responseBody.message || "Oops! Something went wrong."
    })
    return false;
  } catch (error) {
    dispatch({
      type: 'CREATE_REPORT_FAILED',
      payload: error.response && error.response.data.message || "An error has occurred."
    })
    return false;
  }
};

/*
Update report
*/
export const updateReport = (data) => async dispatch => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/bank-report?bankReportId=${data.bankReportId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        reportName: data.name,
        datatypeId: data.dataTypeId,
        dataTypeMappingId: data.selectedPaymentParameters,
        fromDate: data.startDate,
        toDate: data.endDate,
        dateFilter: data.dateFilter,
        parametersCount: data.selectedPaymentParameters && data.selectedPaymentParameters.length > 0 ?
          data.selectedPaymentParameters.length : 0
      })
    });

    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: 'UPDATE_REPORT_SUCCESS',
        payload: responseBody.data,
      })
      return true;
    }
    dispatch({
      type: 'UPDATE_REPORT_FAILED',
      payload: responseBody.message || "Oops! Something went wrong."
    })
    return false;
  } catch (error) {
    dispatch({
      type: 'UPDATE_REPORT_FAILED',
      payload: error.response && error.response.data.message || "An error has occurred."
    })
    return false;
  }
};

export const getDataTypes = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/reporting/data-types`,

      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;

    if (responseBody.error === false) {
      dispatch({
        type: "FETCH_DATA_TYPE_SUCCESS",
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: "FETCH_DATA_TYPE_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_DATA_TYPE_FAILED",
      payload: error.response && error.response.data.message || "An error has occurred."
    });
    return false;
  }
};

export const getPaymentParameterList = (id) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/reporting/parameters?dataTypeId=${id}`,

      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      }
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "FETCH_PAYMENT_PARAMETER_LIST_SUCCESS",
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: "FETCH_PAYMENT_PARAMETER_LIST_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_PAYMENT_PARAMETER_LIST_FAILED",
      payload: error.response && error.response.data.message || "An error has occurred."
    });
    return false;
  }
};

export const fetchReportView = ({ portalProfileId, portalTypeId, userId, reportType, dateFilter }) => async (
  dispatch
) => {
  const data = [
    { PaymentID: 1, PaymentReference: "PaymentID1", ClientName: "", SupplierName: "", ClientAccountNo: "", Currency: "", PaymentAmount: "", SupplierAccountNo: "", ValueDate: "2019-10-12", PaymentStatus: "", DiscountAmount: "", PurchaseOrder: "" },
    { PaymentID: 2, PaymentReference: "PaymentID2", ClientName: "", SupplierName: "", ClientAccountNo: "", Currency: "", PaymentAmount: "", SupplierAccountNo: "", ValueDate: "2019-10-11", PaymentStatus: "", DiscountAmount: "", PurchaseOrder: "" },
    { PaymentID: 3, PaymentReference: "PaymentID3", ClientName: "", SupplierName: "", ClientAccountNo: "", Currency: "", PaymentAmount: "", SupplierAccountNo: "", ValueDate: "2019-10-9", PaymentStatus: "", DiscountAmount: "", PurchaseOrder: "" },
    { PaymentID: 4, PaymentReference: "PaymentID4", ClientName: "", SupplierName: "", ClientAccountNo: "", Currency: "", PaymentAmount: "", SupplierAccountNo: "", ValueDate: "2019-10-8", PaymentStatus: "", DiscountAmount: "", PurchaseOrder: "" },
    { PaymentID: 5, PaymentReference: "PaymentID5", ClientName: "", SupplierName: "", ClientAccountNo: "", Currency: "", PaymentAmount: "", SupplierAccountNo: "", ValueDate: "2019-10-7", PaymentStatus: "", DiscountAmount: "", PurchaseOrder: "" },
    { PaymentID: 6, PaymentReference: "PaymentID4", ClientName: "", SupplierName: "", ClientAccountNo: "", Currency: "", PaymentAmount: "", SupplierAccountNo: "", ValueDate: "2019-10-6", PaymentStatus: "", DiscountAmount: "", PurchaseOrder: "" },
    { PaymentID: 7, PaymentReference: "PaymentID", ClientName: "", SupplierName: "", ClientAccountNo: "", Currency: "", PaymentAmount: "", SupplierAccountNo: "", ValueDate: "2019-10-5", PaymentStatus: "", DiscountAmount: "", PurchaseOrder: "" },
    { PaymentID: 7, PaymentReference: "PaymentID", ClientName: "", SupplierName: "", ClientAccountNo: "", Currency: "", PaymentAmount: "", SupplierAccountNo: "", ValueDate: "2019-10-5", PaymentStatus: "", DiscountAmount: "", PurchaseOrder: "" },
    { PaymentID: 9, PaymentReference: "PaymentID", ClientName: "", SupplierName: "", ClientAccountNo: "", Currency: "", PaymentAmount: "", SupplierAccountNo: "", ValueDate: "2020-11-4", PaymentStatus: "", DiscountAmount: "", PurchaseOrder: "" },
    { PaymentID: 10, PaymentReference: "PaymentID", ClientName: "", SupplierName: "", ClientAccountNo: "", Currency: "", PaymentAmount: "", SupplierAccountNo: "", ValueDate: "2020-12-3", PaymentStatus: "", DiscountAmount: "", PurchaseOrder: "" },
    { PaymentID: 11, PaymentReference: "PaymentID", ClientName: "", SupplierName: "", ClientAccountNo: "", Currency: "", PaymentAmount: "", SupplierAccountNo: "", ValueDate: "2020-12-2", PaymentStatus: "", DiscountAmount: "", PurchaseOrder: "" },
    { PaymentID: 12, PaymentReference: "PaymentID", ClientName: "", SupplierName: "", ClientAccountNo: "", Currency: "", PaymentAmount: "", SupplierAccountNo: "", ValueDate: "2020-12-1", PaymentStatus: "", DiscountAmount: "", PurchaseOrder: "" },
  ];
  dispatch({
    type: "REPORT_DATA_LIST_FETCH_SUCCESS",
    payload: data,
    totalCount: 12
  });
  return true;

  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      //url: `${config.apiBase.clientConfigService}/payment-type/client/${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "REPORT_DATA_LIST_FETCH_SUCCESS",
        payload: responseBody.data,
        totalCount: responseBody.data.TotalCount || 0
      });
      return responseBody.data;
    }
    dispatch({
      type: "REPORT_DATA_LIST_FETCH_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "REPORT_DATA_LIST_FETCH_FAILED",
      payload: error.response && error.response.data.message || "An error has occurred."
    });
    return false;
  }
};

export const fetchReportFilter = ({ portalProfileId, portalTypeId, userId, reportType }) => async (
  dispatch
) => {
  const data = [
    /*{
      name: "All time",
      id: 0,
      value: 'AT',
    },*/
    {
      name: "Previous Year",
      id: 1,
      value: 'PY'
    },
    {
      name: "Previous Quarter",
      id: 2,
      value: 'PQ'
    },
    {
      name: "Previous Month",
      id: 3,
      value: 'PM'
    },
    {
      name: "Last 30 Days",
      id: 4,
      value: 'LM'
    },
    {
      name: "Last 7 days",
      id: 5,
      value: 'LW'
    },
    {
      name: "Custom",
      id: 6,
      value: 'CUSTOM'
    }
  ];
  dispatch({
    type: "REPORT_FILTER_LIST_FETCH_SUCCESS",
    payload: data,
  });
  return true;

  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      //url: `${config.apiBase.clientConfigService}/payment-type/client/${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "REPORT_FILTER_LIST_FETCH_SUCCESS",
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: "REPORT_FILTER_LIST_FETCH_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "REPORT_FILTER_LIST_FETCH_FAILED",
      payload: error.response && error.response.data.message || "An error has occurred."
    });
    return false;
  }
};

export const removeReport = ({ reportIds }) => async dispatch => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.userService}/user`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        reportId: reportIds || null,
      })
    });

    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: 'REMOVE_REPORT_SUCCESS',
        payload: { reportIds: reportIds },
      })
      return true;
    }
    dispatch({
      type: 'REMOVE_REPORT_FAILED',
      payload: responseBody.message || "Oops! Something went wrong."
    })
    return false;
  } catch (error) {
    dispatch({
      type: 'REMOVE_REPORT_FAILED',
      payload: error.response && error.response.data.message || "An error has occurred."
    })
    return false;
  }
};

export const deleteDynamicReport = ({ reportIds }) => async dispatch => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/bank-report`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        bankReportIds: reportIds || null,
      })
    });

    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: 'REMOVE_REPORT_SUCCESS',
        payload: { reportIds: [reportIds] },
      })
      return true;
    }
    dispatch({
      type: 'REMOVE_REPORT_FAILED',
      payload: responseBody.message || "Oops! Something went wrong."
    })
    return false;
  } catch (error) {
    dispatch({
      type: 'REMOVE_REPORT_FAILED',
      payload: error.response && error.response.data.message || "An error has occurred."
    })
    return false;
  }
};

export const getFrequencyList = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/notification-service/v1/notification/report/subscription`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;

    if (responseBody.error === false) {
      dispatch({
        type: "FETCH_FREQUENCY_LIST_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "FETCH_FREQUENCY_LIST_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_FREQUENCY_LIST_FAILED",
      payload: error.response && error.response.data.message || "An error has occurred."
    });
    return false;
  }
};

export const downloadPayeeAuditReport = ({ clientIds, campaignIds, startDate, endDate, payeeId }) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/campaign/payee/report?reportStartDate=${startDate}&reportEndDate=${endDate}`,
      method: "POST",
      responseType: 'blob',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        clientId: clientIds,
        campaignId: campaignIds,
        payeeIds : payeeId
      }),
    });

    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "FETCH_PAYEE_AUDIT_REPORT_DOWNLOAD_SUCCESS",
        payload: responseBody.data,
      });
      return response;
    }
    if (response.status == 404) {
      dispatch({
        type: "FETCH_PAYEE_AUDIT_REPORT_DOWNLOAD_FAILED",
        payload: "Report data not found.",
      });
      return false;
    }
    if (response.status === 416 || response.status === 504) {
      dispatch({
        type: "FETCH_PAYEE_AUDIT_REPORT_DOWNLOAD_FAILED",
        payload: "The selected report exceeds the download size limit. Please reduce the filtered timeframe and try again.",
      });
      return false;
    }
    if (response.status >= 500) {
      dispatch({
        type: "FETCH_PAYEE_AUDIT_REPORT_DOWNLOAD_FAILED",
        payload: response.statusText || "An error has occurred",
      });
      return false;
    }
    if (response.status == 400) {
      dispatch({
        type: "FETCH_PAYEE_AUDIT_REPORT_DOWNLOAD_FAILED",
        payload: response.statusText || "An error has occurred",
      });
      return false;
    }
    return response;
  } catch (error) {
    dispatch({
      type: "FETCH_PAYEE_AUDIT_REPORT_DOWNLOAD_FAILED",
      payload: error.response && error.response.data.message || "An error has occurred."
    });
    return false;
  }
};

export const downloadStaticReport = ({ portalProfileId, clientIds, campaignIds, startDate, endDate, reportCode, campaignId, format }) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    //const campaignFilter = reportCode == "enrollmentSummary"?`&campaignId=${campaignId}`:`&reportStartDate=${startDate}`;
    const campaignFilter = reportCode == "enrollmentSummary" ? `` : `&reportStartDate=${startDate}`;
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/download/static/report?reportCode=${reportCode}&format=${format}${campaignFilter}`,
      method: "POST",
      responseType: 'blob',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        clientId: clientIds || [],
        campaignId: campaignIds || [],
      }),
    });

    const responseBody = await response.data;
    if (response.status == 404) {
      dispatch({
        type: "FETCH_REPORT_DOWNLOAD_FAILED",
        payload: "Report data not found.",
      });
      return false;
    }
    return response;
  } catch (error) {
    dispatch({
      type: "FETCH_REPORT_DOWNLOAD_FAILED",
      payload: error.response && error.response.data.message || "An error has occurred."
    });
    return false;
  }
};

export const downloadDynamicReport = (data) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/download-report`,
      method: "POST",
      responseType: 'blob',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });

    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "DYNAMIC_REPORT_DOWNLOAD_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    if (response.status == 404) {
      dispatch({
        type: "DYNAMIC_REPORT_DOWNLOAD_FAILED",
        payload: "Report data not found.",
      });
      return false;
    }
    if (response.status === 416 || response.status === 504) {
      dispatch({
        type: "DYNAMIC_REPORT_DOWNLOAD_FAILED",
        payload: "The selected report exceeds the download size limit. Please reduce the filtered timeframe and try again.",
      });
      return false;
    }

    if (response.status >= 500) {
      dispatch({
        type: "DYNAMIC_REPORT_DOWNLOAD_FAILED",
        payload: response.statusText || "An error has occurred",
      });
      return false;
    }
    return response;
  } catch (error) {
    dispatch({
      type: "DYNAMIC_REPORT_DOWNLOAD_FAILED",
      payload: error.response && error.response.data.message || "An error has occurred."
    });
    return false;
  }
};

export const downloadPaymentReport = (data) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/report-service/getdynamicpaymentreport`,
      method: "POST",
      responseType: 'blob',
      timeout: 180000,//3 min waiting time
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });

    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "PAYMENT_REPORT_DOWNLOAD_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    if (response.status == 404) {
      dispatch({
        type: "PAYMENT_REPORT_DOWNLOAD_FAILED",
        payload: "Report data not found.",
      });
      return false;
    }
    if (response.status === 416 || response.status === 504) {
      dispatch({
        type: "PAYMENT_REPORT_DOWNLOAD_FAILED",
        payload: "The selected report exceeds the download size limit. Please reduce the filtered timeframe and try again.",
      });
      return false;
    }
    if (response.status >= 500) {
      dispatch({
        type: "PAYMENT_REPORT_DOWNLOAD_FAILED",
        payload: response.statusText || "An error has occurred",
      });
      return false;
    }
    return response;
  } catch (error) {
    dispatch({
      type: "PAYMENT_REPORT_DOWNLOAD_FAILED",
      payload: error.response && error.response.data.message || "An error has occurred."
    });
    return false;
  }
};

export const downloadFileProcessingStaticReport = ({ portalProfileId, startDate, endDate, reportCode, format, clientIds }) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/report-service/downloadpaymentreport`,
      method: "POST",
      responseType: 'blob',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        reportCode: reportCode || null,
        //clientID: portalProfileId || null,
        reportDate: startDate || null,
        format: format,
        //reportCode: "DailyPaymentStatusReport",
        //clientID: 956579174,
        //reportDate: "2020-10-12",
        //format: "xlsx",
        clientIds: clientIds || null
      })
    });

    const responseBody = await response.data;
    //console.log(responseBody);
    if (response.status == 404) {
      dispatch({
        type: "FETCH_REPORT_DOWNLOAD_FAILED",
        payload: "Report data not found.",
      });
      return false;
    }
    return response;

  } catch (error) {
    dispatch({
      type: "FETCH_REPORT_DOWNLOAD_FAILED",
      payload: error.response && error.response.data.message || "An error has occurred."
    });
    return false;
  }
};

export const updateReportSubscription = (data) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/client-config-service/v1/bank/reporting/subscription`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data)
    });
    const responseBody = await response.data;

    if (responseBody.error === false) {
      dispatch({
        type: "FETCH_REPORT_SUBSCRIPTION_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "FETCH_REPORT_SUBSCRIPTION_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_REPORT_SUBSCRIPTION_FAILED",
      payload: error.response && error.response.data.message || "An error has occurred."
    });
    return false;
  }
};

export const getClientsList = ({ appType, reportCode}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/user-service/${config.apiVersion}/bank/reporting/clients/list`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      params: {
        appType,
        reportCode:reportCode
      },
    });
    const responseBody = await response.data;

    if (responseBody.error === false) {
      dispatch({
        type: "FETCH_REPORT_CLIENTS_LIST_SUCCESS",
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: "FETCH_REPORT_CLIENTS_LIST_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_REPORT_CLIENTS_LIST_FAILED",
      payload: error.response && error.response.data.message || "An error has occurred."
    });
    return false;
  }
};

export const getPayeeList = ({clientIds, campaignIds, companyName}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/payee-service/v1/payees/companyname`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        clientId: clientIds,
        campaignId: campaignIds,
        companyName: companyName
      })
    });
    const responseBody = await response.data;

    if (responseBody.error === false) {
      dispatch({
        type: "FETCH_REPORT_PAYEE_LIST_SUCCESS",
        payload: responseBody?.data?.rows || [],
      });
      return true
    }
    dispatch({
      type: "FETCH_REPORT_PAYEE_LIST_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_REPORT_PAYEE_LIST_FAILED",
      payload: error.response && error.response.data.message || "An error has occurred."
    });
    return false;
  }
};

export const getCampaignList = ({ selectedClient }) => async (dispatch) => {
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
      data: JSON.stringify({
        clientId: selectedClient,
      })
    });
    const responseBody = await response.data;

    if (responseBody.error === false) {
      dispatch({
        type: "FETCH_CAMPAIGN_LIST_SUCCESS",
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: "FETCH_CAMPAIGN_LIST_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_CAMPAIGN_LIST_FAILED",
      payload: error.response && error.response.data.message || "An error has occurred."
    });
    return false;
  }
};