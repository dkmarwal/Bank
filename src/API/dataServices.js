import http from "./http-common";

//Client ONboarding API's

const createClient = (data) => {
  return http.post("/client/enrollment", data);
    
  };

const getParentClientList = () => {
    return http.get("/client/parent/list");
  };

  const getClientGroupList = () => {
    return http.get("/client/group/list");
  };

  const getClientPermissionsOptions = () => {
    return http.get("/user/permissions");
  };

  const getClientParentPermissions = (parentId) => {
    return http.get(`user/permissions/type?parentID=${parentId}`);
  };

const createClientPermissions = (data)=> {
  return http.post(`/user/permissions/update`,data); 
  // data =  { clientID: 1234, permissionIDs: [1,2,3,4] }
};

//Client verification API
const verifyClient = (data) => {
    return http.post(`/client/verification`,data);
};
// Company Information Screen API's
const getLocations = () => {
    return http.get(`/client/location`);
}
const getCompanyData = (data) => {
    return http.get(`/client/company/info`,data);
}
const updateCompanyData = (data) => {
    return http.put(`/client/company/update/info`, data);
}
//User Profile Screen API's
const getSecurityQuestions = () => {
    return http.get(`/user/securityQuestions`);
}
const createUser = (data) => {
    return http.post(`/user/info`, data);
}
//Client Payment API's
const getClientPaymentTypes = () => {
    return http.get(`/client/payment/types`);
};

//Client information API
const getCompanyInformation = (clientId) => {
  return http.get(`/client/company/information?clientId=${clientId}`);
};

const getContactInformation = (clientId) => {
  return http.get(`/client/contact/information?clientId=${clientId}`);
};

export {
    createClient,
    getParentClientList,
    getClientGroupList,
    getClientPermissionsOptions,
    getClientParentPermissions,
    createClientPermissions,
    verifyClient,
    getLocations,
    getCompanyData,
    updateCompanyData,
    getSecurityQuestions,
    createUser,
    getClientPaymentTypes,
    getCompanyInformation,
    getContactInformation,
};