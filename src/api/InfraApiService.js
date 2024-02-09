import axios from 'axios';

const nodeMetricsUrl = process.env.REACT_APP_APIURL_NODE;

export const getNodeMetricData = async (
    startDate,
    endDate,
    minutesAgo
) => {
    try {
        var finalUrl;

        if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
            console.log(`History Call + ${nodeMetricsUrl}/getAllNodeMetricData?from=${startDate}&to=${endDate}`);

            finalUrl = `${nodeMetricsUrl}/getAllNodeMetricData?from=${startDate}&to=${endDate}`;
        } else {
            console.log(`Minutes Call + ${nodeMetricsUrl}/getAllNodeMetricData?from=${startDate}&minutesAgo=${minutesAgo}`);

            finalUrl = `${nodeMetricsUrl}/getAllNodeMetricData?from=${startDate}&minutesAgo=${minutesAgo}`;
        }
        
        const response = await axios.get(finalUrl);
        return response.data;
    } catch (error) {
        console.error("Error retrieving Data:", error);
        throw error;
    }
}
