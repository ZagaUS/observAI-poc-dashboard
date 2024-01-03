import axios from "axios";

const metricURL = process.env.REACT_APP_APIURL_METRICS;

// export const getMetricDataApi = async (service,startDate,endDate) => {
//     console.log("Start---------",startDate);
//     console.log("End-------------",endDate);
//     try {                                       // ?serviceName=order-project&timeAgoMinutes=60
//         console.log("Metric url " , `${metricURL}/getByserviceNameAndMinutesAgo?from=${endDate}&serviceName=${service}&to=${startDate}`);
//         const response = await axios.get(`${metricURL}/getByserviceNameAndMinutesAgo?from=${endDate}&serviceName=${service}&to=${startDate}`);
//         return response.data;
//     } catch (error) {
//         console.error("Error retrieving users:", error);
//         return error;
//     }
// };

// export const getMetricDataApi = async (
//   service,
//   startDate,
//   endDate,
//   minutesAgo
// ) => {
//   console.log("Start---------", startDate);
//   console.log("End-------------", endDate);

//   try {
//     var finalUrl;

//     if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
//       console.log(
//         `History call + ${metricURL}/getByserviceNameAndMinutesAgo?from=${endDate}&serviceName=${service}&to=${startDate}`
//       );
//       finalUrl = `${metricURL}/getByserviceNameAndMinutesAgo?from=${endDate}&serviceName=${service}&to=${startDate}`;
//     } else {
//       console.log(
//         `Minutes call + ${metricURL}/getByserviceNameAndMinutesAgo?minutesAgo=${minutesAgo}&serviceName=${service}&to=${startDate}`
//       );
//       finalUrl = `${metricURL}/getByserviceNameAndMinutesAgo?minutesAgo=${minutesAgo}&serviceName=${service}&to=${startDate}`;
//     }
//     const response = await axios.get(finalUrl);
//     return response.data;
//   } catch (error) {
//     console.error("Error retrieving users:", error);
//     return error;
//   }
// };

export const getMetricDataApi = async (
  service,
  startDate,
  endDate,
  minutesAgo
) => {
  try {
    const serviceListData = JSON.parse(localStorage.getItem("serviceListData"));
    // const serviceNameListParam = serviceListData.join("&serviceNameList=");

    let gqlQuery;

    if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
      gqlQuery = `
      query MetricDataByServiceName {
        metricDataByServiceName(
            serviceName: "order-srv-1"
            from: ${JSON.stringify(startDate)}
          to: ${JSON.stringify(endDate)}
            minutesAgo: null
        ) {
            cpuUsage
            date
            memoryUsage
            serviceName
        }
    }
    `;

    } else {
      gqlQuery = `
      query MetricDataByServiceName {
        metricDataByServiceName(
            serviceName: "order-srv-1"
            from: ${JSON.stringify(startDate)}
          to: null
            minutesAgo:  ${minutesAgo}
        ) {
            cpuUsage
            date
            memoryUsage
            serviceName
        }
    }
     
      `;
     }

    const response = await axios.post(
      'http://localhost:7890/graphql',
      {
        query: gqlQuery
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(response.data);
    if (response.data) {
      console.log('GraphQL output:', response.data);
      return response.data;
    } else {
      console.error('GraphQL response is null:', response.data);
      throw new Error('Null response received');
    }

  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};