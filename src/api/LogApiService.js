import axios from "axios";
import { useContext } from "react";
import { GlobalContext } from "../global/globalContext/GlobalContext";

const logUrl = process.env.REACT_APP_APIURL_LOGS;

export const findLogByTraceId = async (traceId) => {
  try {
    const response = await axios.get(
      `${logUrl}/findByTraceId?traceId=${traceId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

export const getLogSummaryData = async (timeMinutesAgo) => {
  try {
    // Get the list of service names from localStorage and parse it
    const serviceListData = JSON.parse(localStorage.getItem("serviceListData"));

    // Construct the URL with the service names
    const serviceNameListParam = serviceListData.join("&serviceNameList=");
    console.log(
      `${logUrl}/LogSumaryChartDataCount?serviceNameList=${serviceNameListParam}&timeAgoMinutes=${timeMinutesAgo}`
    );
    const response = await axios.get(
      `${logUrl}/LogSumaryChartDataCount?serviceNameList=${serviceNameListParam}&timeAgoMinutes=${timeMinutesAgo}`
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

export const getLogSummaryDataWithDate = async (
  startDate,
  endDate,
  minutesAgo
) => {
  try {
    // Get the list of service names from localStorage and parse it
    const serviceListData = JSON.parse(localStorage.getItem("serviceListData"));

    // Construct the URL with the service names
    const serviceNameListParam = serviceListData.join("&serviceNameList=");

    var finalUrl;

    if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
      console.log(
        `History call + ${logUrl}/LogSummaryChartDataCount?endDate=${endDate}&serviceNameList=${serviceNameListParam}&startDate=${startDate}`
      );
      finalUrl = `${logUrl}/LogSummaryChartDataCount?endDate=${endDate}&serviceNameList=${serviceNameListParam}&startDate=${startDate}`;
    } else {
      console.log(
        `Minutes call + ${logUrl}/LogSummaryChartDataCount?minutesAgo=${minutesAgo}&serviceNameList=${serviceNameListParam}&startDate=${startDate}`
      );
      finalUrl = `${logUrl}/LogSummaryChartDataCount?minutesAgo=${minutesAgo}&serviceNameList=${serviceNameListParam}&startDate=${startDate}`;
    }

    // from=2023-10-18&serviceNameList=order-project&to=2023-10-19
    //minutesAgo=120&serviceNameList=order-project&to=2023-10-19

    const response = await axios.get(finalUrl);
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

export const getErroredLogDataForLastTwo = async (
  page,
  pageSize,
  serviceName
) => {
  try {
    const response = await axios.get(
      // `${logUrl}/LogSumaryChartDataCount?getErroredLogDataForLastTwo?page=${page}&pageSize=${pageSize}&serviceName=${serviceName}`
      `${logUrl}/getErroredLogDataForLastTwo?page=${page}&pageSize=${pageSize}&serviceName=${serviceName}`
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};
export const getAllLogBySorts = async (
  minutesAgo,
  page,
  pageSize,
  sortOrder,
  serviceListData
) => {
  try {
    // Get the list of service names from localStorage and parse it
    const serviceNameListParam = serviceListData.join("&serviceNameList=");
    console.log(
      "GET ALL " +
        `${logUrl}/getallLogdata-sortorder?minutesAgo=${minutesAgo}&page=${page}&pageSize=${pageSize}&serviceNameList=${serviceNameListParam}&sortOrder=${sortOrder}`
    );
    // Construct the URL with the service names

    const response = await axios.get(
      `${logUrl}/getallLogdata-sortorder?minutesAgo=${minutesAgo}&page=${page}&pageSize=${pageSize}&serviceNameList=${serviceNameListParam}&sortOrder=${sortOrder}`
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

export const GetAllLogBySortsWithDate = async (
  startDate,
  endDate,
  minutesAgo,
  page,
  pageSize,
  sortOrder,
  serviceListData
) => {
  try {
    // Get the list of service names from localStorage and parse it
    const serviceNameListParam = serviceListData.join("&serviceNameList=");
    console.log(
      "GET ALL " +
        `${logUrl}/getallLogdata-sortorder?endDate=${startDate}&page=${page}&pageSize=${pageSize}&serviceNameList=${serviceNameListParam}&sortOrder=${sortOrder}&startDate=${endDate}`
    );
    // Construct the URL with the service names
    var finalUrl;
    console.log(
      "HIST " + JSON.parse(localStorage.getItem("needHistoricalData"))
    );
    if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
      console.log(
        "History call" +
          `${logUrl}/getallLogdata-sortorder?endDate=${startDate}&page=${page}&pageSize=${pageSize}&serviceNameList=${serviceNameListParam}&sortOrder=${sortOrder}&startDate=${endDate}`
      );
      finalUrl = `${logUrl}/getallLogdata-sortorder?endDate=${startDate}&page=${page}&pageSize=${pageSize}&serviceNameList=${serviceNameListParam}&sortOrder=${sortOrder}&startDate=${endDate}`;
    } else {
      console.log(
        "Minutes call" +
          `${logUrl}/getallLogdata-sortorder?minutesAgo=${minutesAgo}&page=${page}&pageSize=${pageSize}&serviceNameList=${serviceNameListParam}&sortOrder=${sortOrder}&startDate=${startDate}`
      );
      finalUrl = `${logUrl}/getallLogdata-sortorder?minutesAgo=${minutesAgo}&page=${page}&pageSize=${pageSize}&serviceNameList=${serviceNameListParam}&sortOrder=${sortOrder}&startDate=${startDate}`;
    }

    const response = await axios.get(finalUrl);
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

// export const LogFilter = async (data) => {
//     try {
//         console.log("log filter api call", data);
//         const response = await axios.post(
//             // `/LogFilterQuery`
//             `${logUrl}/LogFilterQuery?minutesAgo=${}&page=${}&pageSize=${}`
//             );
//         return response.data;
//     } catch (error) {
//         console.error("Error retrieving users:", error);
//         return error;
//     }
// };

export const LogFilterOption = async (minutesAgo, page, pageSize, payload) => {
  try {
    console.log(
      `${logUrl}/LogFilterQuery?minutesAgo=${minutesAgo}&page=${page}&pageSize=${pageSize}` +
        JSON.stringify(payload)
    );
    const response = await axios.post(
      `${logUrl}/LogFilterQuery?minutesAgo=${minutesAgo}&page=${page}&pageSize=${pageSize}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json", // Set the Content-Type header
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

export const LogFilterOptionWithDate = async (
  startDate,
  endDate,
  minutesAgo,
  sortOrder,
  page,
  pageSize,
  payload
) => {
  try {
    console.log(
      `${logUrl}/filterLogs?endDate=${startDate}&page=${page}&pageSize=${pageSize}&startDate=${endDate}` +
        JSON.stringify(payload)
    );
    var finalUrl;

    // endDate=2023-10-25&page=1&pageSize=10&sortOrder=error&startDate=2023-10-25
    // minutesAgo=720&page=1&pageSize=10&sortOrder=error&startDate=2023-10-25

    if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
      console.log(
        `History call + ${logUrl}/filterLogs?endDate=${startDate}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}&startDate=${endDate}`
      );
      finalUrl = `${logUrl}/filterLogs?endDate=${startDate}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}&startDate=${endDate}`;
    } else {
      console.log(
        `Minutes call + ${logUrl}/filterLogs?minutesAgo=${minutesAgo}&&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}&startDate=${startDate}`
      );
      finalUrl = `${logUrl}/filterLogs?minutesAgo=${minutesAgo}&&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}&startDate=${startDate}`;
    }

    const response = await axios.post(finalUrl, payload, {
      headers: {
        "Content-Type": "application/json", // Set the Content-Type header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

export const searchLogs = async (
  keyword,
  startDate,
  endDate,
  minutesAgo,
  page,
  pageSize
) => {
  try {
    var finalUrl;

    if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
      console.log(
        `History call + ${logUrl}/filterLogs?endDate=${startDate}&page=${page}&pageSize=${pageSize}&startDate=${endDate}`
      );
      finalUrl = `${logUrl}/searchFunction?endDate=${startDate}&keyword=${keyword}&page=${page}&pageSize=${pageSize}&startDate=${endDate}`;
    } else {
      console.log(
        `Minutes call + ${logUrl}/filterLogs?minutesAgo=${minutesAgo}&&page=${page}&pageSize=${pageSize}&startDate=${startDate}`
      );
      finalUrl = `${logUrl}/filterLogs?keyword=${keyword}&minutesAgo=${minutesAgo}&&page=${page}&pageSize=${pageSize}&startDate=${startDate}`;
    }

    const response = await axios.get(finalUrl);
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

export const searchLogsWithDate = async (
  keyword,
  startDate,
  endDate,
  minutesAgo,
  page,
  pageSize
) => {
  try {
    var finalUrl;

    if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
      console.log(
        `History call + ${logUrl}/searchFunction?endDate=${startDate}&keyword=${keyword}&page=${page}&pageSize=${pageSize}&startDate=${endDate}`
      );
      finalUrl = `${logUrl}/searchFunction?endDate=${startDate}&keyword=${keyword}&page=${page}&pageSize=${pageSize}&startDate=${endDate}`;
    } else {
      console.log(
        `Minutes call + ${logUrl}/filterLogs?keyword=${keyword}&minutesAgo=${minutesAgo}&&page=${page}&pageSize=${pageSize}&startDate=${startDate}`
      );
      finalUrl = `${logUrl}/searchFunction?keyword=${keyword}&minutesAgo=${minutesAgo}&&page=${page}&pageSize=${pageSize}&startDate=${startDate}`;
    }
    const response = await axios.get(finalUrl);
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};
