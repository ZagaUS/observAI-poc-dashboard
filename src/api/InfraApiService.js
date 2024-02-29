import axios from 'axios';

const nodeMetricUrl = process.env.REACT_APP_APIURL_NODE;
const podMetricUrl = process.env.REACT_APP_APIURL_POD;
const eventUrl = process.env.REACT_APP_APIURL_EVENTS;

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
        console.error("Error retrieving Node Metric Data:", error);
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

export const getRecentEvent = async (minutesAgo) => {
    try {
        console.log("Minutes Ago", minutesAgo);
        const response = await axios.get(
            `${eventUrl}/recentevent?minutesAgo=${minutesAgo}`
        );
        console.log("Recent Event Response", response);
        return response.data;
    } catch (error) {
        console.error("Error Retrieving Recent Event Data:", error);
        throw error;
    }
};

export const getAllEvent = async (minutesAgo) => {
    try {
        console.log("Minutes Ago - allEvent", minutesAgo);
        const response = await axios.get(
            `${eventUrl}/getAllEvents?minutesAgo=${minutesAgo}`
        );
        console.log("All Event Response", response);
        return response.data;
    } catch (error) {
        console.error("Error Retrieving All Events:", error);
        throw error;
    }
};

export const getAllEventByDate = async (startDate, endDate, minutesAgo) => {
    try {
        console.log("Minutes Ago - allEvent", startDate, endDate, minutesAgo);
        // const response = await axios.get(
        //     `${eventUrl}/getAllEvents?minutesAgo=${minutesAgo}`
        // );
        var finalUrl;

        if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
            console.log(`History Call + ${eventUrl}/getall-Events-aggregation?from=${startDate}&to=${endDate}`);

            finalUrl = `${eventUrl}/getall-Events-aggregation?from=${startDate}&to=${endDate}`
        } else {
            console.log(`History Call + ${eventUrl}/getall-Events-aggregation?from=${startDate}&minutesAgo=${minutesAgo}`);

            finalUrl = `${eventUrl}/getall-Events-aggregation?from=${startDate}&minutesAgo=${minutesAgo}`
        }

        const response = await axios.get(finalUrl);
        console.log("All Event Response", response);
        return response.data;
    } catch (error) {
        console.error("Error Retrieving All Events:", error);
        throw error;
    }
};
