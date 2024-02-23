import axios from "axios";
const openshiftLoginURL = process.env.REACT_APP_APIURL_OPENSHIFT;

export const getClusterListAllProjects = async () => {
  try {
    const response = await axios.get(`${openshiftLoginURL}/listAllProjects`);

    console.log("getClusterListAllProjects", response);

    return response.data;
  } catch (error) {
    console.error("Error in getClusterListAllProjects:", error);
    throw error;
  }
};

export const changeToInstrument = async (namespace, deploymentName) => {
  try {
    const response = await axios.post(
      `${openshiftLoginURL}/instrument/${namespace}/${deploymentName}`
    );

    console.log("response", response);

    return response;
  } catch (error) {
    console.error("Error in changeToInstrument:", error);
    throw error;
  }
};

export const changeToUninstrument = async (namespace, deploymentName) => {
  try {
    const response = await axios.post(
      `${openshiftLoginURL}/unInstrument/${namespace}/${deploymentName}`
    );

    console.log("response", response);

    return response;
  } catch (error) {
    console.error("Error in changeToUninstrument:", error);
    throw error;
  }
};

export const viewClusterInfoApiCall = async () => {
  try {
    const response = await axios.get(`${openshiftLoginURL}/viewClusterInfo`);

    console.log("viewClusterInfoApiCall response", response.data);

    return response;
  } catch (error) {
    console.error("Error in viewClusterInfoApiCall:", error);
    throw error;
  }
};

export const viewClusterIPApiCall = async () => {
  try {
    const response = await axios.get(`${openshiftLoginURL}/viewClusterIP`);

    console.log("viewClusterIPApiCall response", response.data);

    return response;
  } catch (error) {
    console.error("Error in viewClusterIPApiCall:", error);
    throw error;
  }
};

export const viewClusterInventoryApiCall = async () => {
  try {
    const response = await axios.get(
      `${openshiftLoginURL}/viewClusterInventory`
    );

    console.log("viewClusterInventoryApiCall response", response.data);

    return response;
  } catch (error) {
    console.error("Error in viewClusterInventoryApiCall:", error);
    throw error;
  }
};

export const viewClusterNetworkApiCall = async () => {
  try {
    const response = await axios.get(`${openshiftLoginURL}/viewClusterNetwork`);

    console.log("viewClusterNetworkApiCall response", response.data);

    return response;
  } catch (error) {
    console.error("Error in viewClusterNetworkApiCall:", error);
    throw error;
  }
};

export const viewClusterNodesApiCall = async () => {
  try {
    const response = await axios.get(`${openshiftLoginURL}/viewClusterNodes`);

    console.log("viewClusterNodesApiCall response", response.data);

    return response;
  } catch (error) {
    console.error("Error in viewClusterNodesApiCall:", error);
    throw error;
  }
};

export const viewClusterStatusApiCall = async () => {
  try {
    const response = await axios.get(`${openshiftLoginURL}/viewClusterStatus`);

    console.log("viewClusterStatusApiCall response", response.data);

    return response;
  } catch (error) {
    console.error("Error in viewClusterStatusApiCall:", error);
    throw error;
  }
};

export const viewClusterNodeIPApiCall = async () => {
  try {
    const response = await axios.get(`${openshiftLoginURL}/viewNodeIP`);

    console.log("viewNodeIPApiCall response", response.data);

    return response;
  } catch (error) {
    console.error("Error in viewNodeIPApiCall:", error);
    throw error;
  }
};
