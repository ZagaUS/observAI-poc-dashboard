import axios from "axios";

const loginURL = process.env.REACT_APP_APIURL_AUTH;
const CLIENT_SECRET = process.env.REACT_APP_APIURL_CLIENT_SECRET;
const SSO_BASE_URL = process.env.REACT_APP_APIURL_SSO;
const CLIENT_ID = "React-auth";
const GRANT_TYPE = "password";
const openshiftLoginURL = process.env.REACT_APP_APIURL_OPENSHIFT;

export const keycloakLoginAuth = async (userAuth) => {
  const data = new URLSearchParams();
  data.append("client_id", CLIENT_ID);
  data.append("grant_type", GRANT_TYPE);
  data.append("client_secret", CLIENT_SECRET);
  data.append("username", userAuth.username);
  data.append("password", userAuth.password);

  try {
    const keycloakInstance = await axios.post(`${SSO_BASE_URL}/token`, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Credentials': true,
        // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
    });
    return { data: keycloakInstance.data, error: null }; // Return the response or perform further actions as needed
  } catch (error) {
    console.error("Token request error:", error);
    return { data: null, error: error }; // Throw the error or handle it appropriately
  }
};

export const keycloakLogoutAuth = async () => {
  const data = new URLSearchParams();
  data.append("client_id", CLIENT_ID);
  data.append("refresh_token", localStorage.getItem("refreshToken"));
  data.append("client_secret", CLIENT_SECRET);

  try {
    const keycloakInstance = await axios.post(`${SSO_BASE_URL}/logout`, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return { data: keycloakInstance.data, error: null }; // Return the response or perform further actions as needed
  } catch (error) {
    console.error("Token request error:", error);
    return { data: null, error: error }; // Throw the error or handle it appropriately
  }
};

export const loginUser = async (data) => {
  try {
    console.log("api call loginUser data", data);
    const response = await axios.post(`${loginURL}/login`, data);
    return response;
  } catch (error) {
    console.error("Error in login User:", error);
    return error;
  }
};

export const getServiceList = async (userInfo) => {
  try {
    console.log("api call getServiceList data", userInfo);
    const response = await axios.post(`${loginURL}/getServiceList`, userInfo);
    return response.data;
  } catch (error) {
    console.error("Error in getServiceList:", error);
    throw error;
  }
};

export const addRulesForService = async (addRules) => {
  try {
    console.log("api call addRulesForService data", addRules);
    const response = await axios.post(
      `${loginURL}/addServiceListNew`,
      addRules
    );
    return response.data;
  } catch (error) {
    console.error("Error in addRulesForService:", error);
    throw error;
  }
};

export const getAllRules = async (rule) => {
  try {
    console.log("Rule Details", rule);
    const response = await axios.post(`${loginURL}/getServiceList`, rule);
    return response.data;
  } catch (error) {
    console.error("Error in displaying rules:", error);
    throw error;
  }
};

export const updateServiceList = async (updateService) => {
  try {
    console.log("Updated Service Data", updateService);
    const response = await axios.put(
      `${loginURL}/updateServiceList`,
      updateService
    );
    return response.data;
  } catch (error) {
    console.error("Error in Updating Rules Data", error);
    console.error("Error Response:", error.response);
    throw error;
  }
};

export const addClusterDetails = async (Cluster) => {
  try {
    console.log("addClusterDetails api data", JSON.stringify(Cluster));
    // const data=JSON.stringify(Cluster);
    const response = await axios.post(`${loginURL}/register`, Cluster);

    return response.data;
  } catch (error) {
    console.error("Error in add Cluster User:", error);
    throw error;
  }
};

export const updateClusterDetails = async (UpdatedClusterData) => {
  try {
    console.log("updatedcluster api data", JSON.stringify(UpdatedClusterData));
    // const data=JSON.stringify(Cluster);
    const response = await axios.put(
      `${loginURL}/clusterDataUpdate`,
      UpdatedClusterData
    );

    return response.data;
  } catch (error) {
    console.error("Error in update Cluster User:", error);
    throw error;
  }
};

export const deleteClusterDetails = async (clusterId, clusterUsername) => {
  try {
    console.log("deleted api data", clusterId, clusterUsername);

    const response = await axios.delete(
      `${loginURL}/${clusterUsername}/delete-environments/${clusterId}?clusterId=${clusterId}&clusterUsername=${clusterUsername}`
    );

    return response.data;
  } catch (error) {
    console.error("Error in update Cluster User:", error);
    throw error;
  }
};

export const getClusterDetails = async () => {
  try {
    const response = await axios.get(`${loginURL}/register`);

    console.log(" getClusterDetails response", response);
    return response.data;
  } catch (error) {
    console.error("Error in get cluster User:", error);
    throw error;
  }
};

// export const openshiftClusterLogin = async (clusterUrl,password,username) => {
//   try {

//     console.log("clusterUrl",clusterUrl);
//     console.log("openshiftLoginURL",openshiftLoginURL);
//     const response = await axios.get(`${openshiftLoginURL}/login?clusterUrl=${clusterUrl}&password=${password}&username=${username}`);

//     console.log("response", response);

//     return response.data;
//   } catch (error) {
//     console.error("Error in get openshiftClusterLogin User:", error);
//     throw error;
//   }
// };

// http://localhost:8081/openshift/getAllClusters?username=admin

export const getAllClustersAPI = async (username) => {
  try {
    console.log("clusterUserName", username);
    const response = await axios.get(
      `${openshiftLoginURL}/getAllClusters?username=${username}`
    );

    console.log("response", response);

    return response.data;
  } catch (error) {
    console.error("Error in get getAllClustersAPI ", error);
    throw error;
  }
};

export const openshiftClusterLogin = async (clusterUrl, password, username) => {
  try {
    console.log("clusterUserName", username);
    console.log("clusterPassword", password);
    const response = await axios.get(
      `${openshiftLoginURL}/login?clusterUrl=${clusterUrl}&password=${password}&username=${username}`
    );

    console.log("response", response);

    return response.status;
  } catch (error) {
    console.error("Error in get openshiftClusterLogin User:", error);
    throw error;
  }
};
