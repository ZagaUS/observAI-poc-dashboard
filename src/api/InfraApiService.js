import axios from 'axios';

const keplerUrl = process.env.REACT_APP_APIURL_INFRA;

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
            finalUrl = `${keplerUrl}/getAllPodMetrics?from=${startDate}&page=${page}&pageSize=${pageSize}&to=${endDate}`;
        } else {
            finalUrl = `${keplerUrl}/getAllPodMetrics?from=${startDate}&minutesAgo=${minutesAgo}&page=${page}&pageSize=${pageSize}`;
        }

        console.log('Final URL:', finalUrl);

        const response = await axios.get(finalUrl);
        return response.data;
    } catch (error) {
        console.error("Error retrieving pod metric data:", error);
        throw error;
    }
};
