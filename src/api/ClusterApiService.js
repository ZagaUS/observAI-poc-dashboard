import axios from "axios";
const openshiftLoginURL = process.env.REACT_APP_APIURL_OPENSHIFT;

// http://localhost:8081/openshift/listAllProjects?clusterName=zagaind&username=admin

export const getClusterListAllProjects = async (clusterName, username) => {
  try {
    const response = await axios.get(
      `${openshiftLoginURL}/listAllProjects?clusterName=${clusterName}&username=${username}`
    );

    // console.log("getClusterListAllProjects", response);

    return response.data;
  } catch (error) {
    console.error("Error in getClusterListAllProjects:", error);
    throw error;
  }
};

// http://localhost:8081/openshift/unInstrument/order-srv-1/observai-main?clusterName=zagaind&username=admin

// http://localhost:8081/openshift/instrument/order-srv-1/observai-main?clusterName=zagaind&username=admin

export const changeToInstrument = async (
  deploymentName,
  namespace,
  clusterName,
  username
) => {
  try {
    const response = await axios.post(
      `${openshiftLoginURL}/instrument/${namespace}/${deploymentName}?clusterName=${clusterName}&username=${username}`
    );

    console.log("response", response);

    return response;
  } catch (error) {
    console.error("Error in changeToInstrument:", error);
    throw error;
  }
};

export const changeToUninstrument = async (
  deploymentName,
  namespace,
  clusterName,
  username
) => {
  try {
    const response = await axios.post(
      `${openshiftLoginURL}/unInstrument/${namespace}/${deploymentName}?clusterName=${clusterName}&username=${username}`
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

    // console.log("viewClusterInfoApiCall response", response.data);

    return response;
  } catch (error) {
    console.error("Error in viewClusterInfoApiCall:", error);
    throw error;
  }
};

export const viewClusterIPApiCall = async () => {
  try {
    const response = await axios.get(`${openshiftLoginURL}/viewClusterIP`);

    // console.log("viewClusterIPApiCall response", response.data);

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

    // console.log("viewClusterInventoryApiCall response", response.data);

    return response;
  } catch (error) {
    console.error("Error in viewClusterInventoryApiCall:", error);
    throw error;
  }
};

export const viewClusterNetworkApiCall = async () => {
  try {
    const response = await axios.get(`${openshiftLoginURL}/viewClusterNetwork`);

    // console.log("viewClusterNetworkApiCall response", response.data);

    return response;
  } catch (error) {
    console.error("Error in viewClusterNetworkApiCall:", error);
    throw error;
  }
};

export const viewClusterNodesApiCall = async () => {
  try {
    const response = await axios.get(`${openshiftLoginURL}/viewClusterNodes`);

    // console.log("viewClusterNodesApiCall response", response.data);

    return response;
  } catch (error) {
    console.error("Error in viewClusterNodesApiCall:", error);
    throw error;
  }
};

export const viewClusterStatusApiCall = async () => {
  try {
    const response = await axios.get(`${openshiftLoginURL}/viewClusterStatus`);

    // console.log("viewClusterStatusApiCall response", response.data);

    return response;
  } catch (error) {
    console.error("Error in viewClusterStatusApiCall:", error);
    throw error;
  }
};

export const viewClusterNodeIPApiCall = async () => {
  try {
    const response = await axios.get(`${openshiftLoginURL}/viewNodeIP`);

    // console.log("viewNodeIPApiCall response", response.data);

    return response;
  } catch (error) {
    console.error("Error in viewNodeIPApiCall:", error);
    throw error;
  }
};
// http://localhost:8081/openshift/getClusterInformation?clusterName=ZagaObservability&username=admin
export const viewClusterDetails = async (clusterName, username) => {
  try {
    console.log(
      "-----------[FINAL URL]------  " +
        `${openshiftLoginURL}/getClusterInformation?clusterName=${clusterName}&username=${username}`
    );
    const response = await axios.get(
      `${openshiftLoginURL}/getClusterInformation?clusterName=${clusterName}&username=${username}`
    );

    // console.log("viewClusterDetails response", response);

    return response;
  } catch (error) {
    console.error("Error in viewClusterDetails:", error);
    throw error;
  }
};

// http://localhost:8081/openshift/listAllNodes?clusterName=Zagaopenshift&username=admin

export const ListOfNodeDetails = async (clusterName, username) => {
  try {
    const response = await axios.get(
      `${openshiftLoginURL}/listAllNodes?clusterName=${clusterName}&username=${username}`
    );

    // console.log("ListOfNodeDetails response", response);

    return response;
  } catch (error) {
    console.error("Error in ListOfNodeDetails:", error);
    throw error;
  }
};

// http://localhost:8081/openshift/getClusterNodeInformation?clusterName=zagaos&nodeName=zagaocp-master1&username=admin
export const viewClusterNodeInformation = async (
  clusterName,
  nodeName,
  username
) => {
  try {
    const response = await axios.get(
      `${openshiftLoginURL}/getClusterNodeInformation?clusterName=${clusterName}&nodeName=${nodeName}&username=${username}`
    );

    // console.log("viewClusterNodeInformation response", response);

    return response;
  } catch (error) {
    console.error("Error in viewClusterNodeInformation:", error);
    throw error;
  }
};
