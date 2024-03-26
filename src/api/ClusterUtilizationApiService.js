import axios from 'axios';

const clusterUtilizationUrl = process.env.REACT_APP_APIURL_CLUSTER_UTILIZATION;

export const getClusterUtilization = async (
    startDate,
    endDate,
    minutesAgo,
    nodeName,
    clusterName,
    userName
) => {
    try {
        let finalUrl;
        // let clusterUtilizationUrl;
        // if(JSON.parse(localStorage.getItem("needHistoricalData"))) {
        //     console.log(`History Call + ${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&to=${endDate}`);

        //     finalUrl = `${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&to=${endDate}`
        // } else {
        //     console.log(`History Call + ${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&minutesAgo=${minutesAgo}`);

        //     finalUrl = ` ${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&minutesAgo=${minutesAgo}`
        // }

        // if(JSON.parse(localStorage.getItem("needHistoricalData"))) {
        //     console.log(`History Call + ${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&to=${endDate}&clusterName=${clusterName}`);

        //     finalUrl = `${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&to=${endDate}&clusterName=${clusterName}`
        // } else {
        //     console.log(`History Call + ${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&minutesAgo=${minutesAgo}&clusterName=${clusterName}`);

        //     finalUrl = ` ${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&minutesAgo=${minutesAgo}&clusterName=${clusterName}`
        // }
        console.log("------[CLUSTER UTILIZATION API]------ ", clusterUtilizationUrl);
        console.log("------[CLUSTER UTILIZATION NAME]------ ", clusterName[0]);
        // if(clusterName[0] === "zagaus"){
        //     console.log('---hey u are in zaga us')
        //     clusterUtilizationUrl = process.env.REACT_APP_APIURL_CLUSTER_UTILIZATION
        // }
        // else{
        //     console.log('----hey u r in india')
        //     clusterUtilizationUrl = process.env.REACT_APP_APIURL_IND_CLUSTER_UTILIZATION
        // }
        if (nodeName) {
            if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
                console.log(`History Call + ${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&to=${endDate}&clusterName=${clusterName}&nodeName=${nodeName}&userName=${userName}`);

                finalUrl = `${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&to=${endDate}&clusterName=${clusterName}&nodeName=${nodeName}&userName=${userName}`;
            } else {
                console.log(`History Call + ${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&minutesAgo=${minutesAgo}&clusterName=${clusterName}&nodeName=${nodeName}&userName=${userName}`);

                finalUrl = `${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&minutesAgo=${minutesAgo}&clusterName=${clusterName}&nodeName=${nodeName}&userName=${userName}`;
            }
        } else {
            if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
                console.log(`History Call + ${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&to=${endDate}&clusterName=${clusterName}&userName=${userName}`);

                finalUrl = `${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&to=${endDate}&clusterName=${clusterName}&userName=${userName}`;
            } else {
                console.log(`History Call + ${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&minutesAgo=${minutesAgo}&clusterName=${clusterName}&userName=${userName}`);

                finalUrl = `${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&minutesAgo=${minutesAgo}&clusterName=${clusterName}&userName=${userName}`;
            }
        }

        const response = await axios.get(finalUrl);
        console.log("Cluster Utilization Details", response);
        return response.data;
    } catch (error) {
        console.error("Error Retrieving All Cluster Utilization:", error);
        throw error;
    }
}