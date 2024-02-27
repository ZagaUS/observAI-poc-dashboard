import axios from 'axios';

const clusterUtilizationUrl = process.env.REACT_APP_APIURL_CLUSTER_UTILIZATION;

export const getClusterUtilization = async (
    startDate,
    endDate,
    minutesAgo,
    nodeName,
    clusterName
) => {
    try {
        let finalUrl;

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

        if (nodeName) {
            if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
                console.log(`History Call + ${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&to=${endDate}&clusterName=${clusterName}&nodeName=${nodeName}`);

                finalUrl = `${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&to=${endDate}&clusterName=${clusterName}&nodeName=${nodeName}`;
            } else {
                console.log(`History Call + ${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&minutesAgo=${minutesAgo}&clusterName=${clusterName}&nodeName=${nodeName}`);

                finalUrl = `${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&minutesAgo=${minutesAgo}&clusterName=${clusterName}&nodeName=${nodeName}`;
            }
        } else {
            if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
                console.log(`History Call + ${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&to=${endDate}&clusterName=${clusterName}`);

                finalUrl = `${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&to=${endDate}&clusterName=${clusterName}`;
            } else {
                console.log(`History Call + ${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&minutesAgo=${minutesAgo}&clusterName=${clusterName}`);

                finalUrl = `${clusterUtilizationUrl}/multi-level_nodeInfo?from=${startDate}&minutesAgo=${minutesAgo}&clusterName=${clusterName}`;
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