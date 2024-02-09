import axios from 'axios';

const nodeMetricUrl = process.env.REACT_APP_APIURL_NODE;
const podMetricUrl = process.env.REACT_APP_APIURL_POD;

export const getNodeMetricData = async (
    startDate,
    endDate,
    minutesAgo
) => {
    try {
        var finalUrl;

        if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
            console.log(`History Call + ${nodeMetricUrl}/getAllNodeMetricData?from=${startDate}&to=${endDate}`);

            finalUrl = `${nodeMetricUrl}/getAllNodeMetricData?from=${startDate}&to=${endDate}`;
        } else {
            console.log(`Minutes Call + ${nodeMetricUrl}/getAllNodeMetricData?from=${startDate}&minutesAgo=${minutesAgo}`);

            finalUrl = `${nodeMetricUrl}/getAllNodeMetricData?from=${startDate}&minutesAgo=${minutesAgo}`;
        }
        
        const response = await axios.get(finalUrl);
        return response.data;
    } catch (error) {
        console.error("Error retrieving Data:", error);
        throw error;
    }
}

export const getPodMetricDataPaginated = async (
    startDate,
    endDate,
    minutesAgo,
    page,
    pageSize
) => {
    try {
        let finalUrl;

        if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
            finalUrl = `${podMetricUrl}/getAllPodMetrics?from=${startDate}&page=${page}&pageSize=${pageSize}&to=${endDate}`;
        } else {
            finalUrl = `${podMetricUrl}/getAllPodMetrics?from=${startDate}&minutesAgo=${minutesAgo}&page=${page}&pageSize=${pageSize}`;
        }

        console.log('Final URL:', finalUrl);

        const response = await axios.get(finalUrl);
        return response.data;
    } catch (error) {
        console.error("Error retrieving pod metric data:", error);
        throw error;
    }
};
