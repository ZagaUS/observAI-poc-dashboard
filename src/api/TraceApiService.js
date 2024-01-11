import axios from "axios";

const traceURL = process.env.REACT_APP_GRAPHQLURL_TRACES;

export const TraceListPaginationApi = async (
  page,
  itemsPerPage,
  interval,
  sortOrder,
  serviceListData
) => {
  try {
    // Get the list of service names from localStorage and parse it
    // const serviceListData = JSON.parse(localStorage.getItem("serviceListData"));

    // Construct the URL with the service names
    const serviceNameListParam = serviceListData.join("&serviceNameList=");
    // console.log(`${traceURL}/getalldata-sortorder?minutesAgo=${interval}&page=${page}&pageSize=${itemsPerPage}&serviceNameList=${serviceNameListParam}&sortOrder=${sortOrder}`);
    const response = await axios.get(
      `${traceURL}/getalldata-sortorder?minutesAgo=${interval}&page=${page}&pageSize=${itemsPerPage}&serviceNameList=${serviceNameListParam}&sortOrder=${sortOrder}`
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

export const TraceListPaginationApiWithDate = async (
  page,
  itemsPerPage,
  startDate,
  endDate,
  minutesAgo,
  sortOrder,
  serviceListData
) => {
  try {
    const serviceNameListParam = serviceListData.join("&serviceNameList=");

    // const serviceNameListParam = "order-project";

    var finalUrl;

    if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
      console.log(
        `History call +${traceURL}/getalldata-sortorder?from=${endDate}&page=${page}&pageSize=${itemsPerPage}&serviceNameList=${serviceNameListParam}&sortOrder=${sortOrder}&to=${startDate}`
      );
      finalUrl = `${traceURL}/getalldata-sortorder?from=${endDate}&page=${page}&pageSize=${itemsPerPage}&serviceNameList=${serviceNameListParam}&sortOrder=${sortOrder}&to=${startDate}`;
    } else {
      console.log(
        `Minutes call + ${traceURL}/getalldata-sortorder?minutesAgo=${minutesAgo}&page=${page}&pageSize=${itemsPerPage}&serviceNameList=${serviceNameListParam}&sortOrder=${sortOrder}&to=${startDate}`
      );
      finalUrl = ` ${traceURL}/getalldata-sortorder?minutesAgo=${minutesAgo}&page=${page}&pageSize=${itemsPerPage}&serviceNameList=${serviceNameListParam}&sortOrder=${sortOrder}&to=${startDate}`;
    }

    // from=2023-10-18&page=1&pageSize=10&serviceNameList=order-project&sortOrder=new&to=2023-10-19
    // minutesAgo=120&page=1&pageSize=10&serviceNameList=order-project&sortOrder=new&to=2023-10-19
    // Get the list of service names from localStorage and parse it
    // const serviceListData = JSON.parse(localStorage.getItem("serviceListData"));

    // Construct the URL with the service names
    // const serviceNameListParam = serviceListData.join("&serviceNameList=");
    // console.log(`${traceURL}/getalldata-sortorder?minutesAgo=${interval}&page=${page}&pageSize=${itemsPerPage}&serviceNameList=${serviceNameListParam}&sortOrder=${sortOrder}`);
    const response = await axios.get(finalUrl);
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

export const TraceFilterOption = async (lookback, page, pageSize, payload) => {
  try {
    const response = await axios.post(
      `${traceURL}/TraceQueryFilter?minutesAgo=${lookback}&page=${page}&pageSize=${pageSize}`,
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

export const TraceFilterOptionWithDate = async (
  startDate,
  minutesAgo,
  sortorder,
  endDate,
  page,
  pageSize,
  payload
) => {
  try {
    var finalUrl;

    if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
      console.log(
        `History call + ${traceURL}/TraceQueryFilter?from=${endDate}&page=${page}&pageSize=${pageSize}&sortOrder=${sortorder}&to=${startDate}`
      );
      finalUrl = `${traceURL}/TraceQueryFilter?from=${endDate}&page=${page}&pageSize=${pageSize}&sortOrder=${sortorder}&to=${startDate}`;
    } else {
      console.log(
        `Minutes call + ${traceURL}/TraceQueryFilter?from=${startDate}&minutesAgo=${minutesAgo}&page=${page}&pageSize=${pageSize}&sortOrder=${sortorder}`
      );
      finalUrl = `${traceURL}/TraceQueryFilter?from=${startDate}&minutesAgo=${minutesAgo}&page=${page}&pageSize=${pageSize}&sortOrder=${sortorder}`;
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

export const FindByTraceIdForSpans = async (traceId) => {
  try {
    const response = await axios.get(
      `${traceURL}/findByTraceId?traceId=${traceId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    return error;
  }
};

export const findLogByErrorTrace = async (traceId) => {
  try {
    const response = await axios.get(
      `${traceURL}/getByErrorTraceId?traceId=${traceId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    return error;
  }
};

export const getTraceSummaryData = async (timeMinutesAgo) => {
  try {
    // Get the list of service names from localStorage and parse it
    const serviceListData = JSON.parse(localStorage.getItem("serviceListData"));

    // Construct the URL with the service names
    // const serviceNameListParam = serviceListData.join('&serviceNameList=');

    const serviceNameListParam = serviceListData.join("&serviceNameList=");

    console.log(
      `${traceURL}/TraceSumaryChartDataCount?serviceNameList=${serviceNameListParam}&timeAgoMinutes=${timeMinutesAgo}`
    );

    const response = await axios.get(
      `${traceURL}/TraceSumaryChartDataCount?serviceNameList=${serviceNameListParam}&timeAgoMinutes=${timeMinutesAgo}`
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

export const getTraceSummaryDataWithDate = async (
  startDate,
  endDate,
  minutesAgo
) => {
  try {
    // Get the list of service names from localStorage and parse it
    const serviceListData = JSON.parse(localStorage.getItem("serviceListData"));

    // Construct the URL with the service names
    // const serviceNameListParam = serviceListData.join('&serviceNameList=');

    const serviceNameListParam = serviceListData.join("&serviceNameList=");

    var finalUrl;

    if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
      console.log(
        `History call + ${traceURL}/TraceSumaryChartDataCount?from=${endDate}&serviceNameList=${serviceNameListParam}&to=${startDate}`
      );
      finalUrl = `${traceURL}/TraceSumaryChartDataCount?from=${endDate}&serviceNameList=${serviceNameListParam}&to=${startDate}`;
    } else {
      console.log(
        `Minutes call + ${traceURL}/TraceSumaryChartDataCount?minutesAgo=${minutesAgo}&serviceNameList=${serviceNameListParam}&to=${startDate}`
      );
      finalUrl = `${traceURL}/TraceSumaryChartDataCount?from=${startDate}&minutesAgo=${minutesAgo}&serviceNameList=${serviceNameListParam}`;
    }

    const response = await axios.get(finalUrl);
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

export const getRecentTraceList = async (page, pageSize, serviceName) => {
  try {
    const response = await axios.get(
      `${traceURL}/getErroredDataForLastTwo?page=${page}&pageSize=${pageSize}&serviceName=${serviceName}`
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

export const getDbSummaryDataWithDate = async (
  startDate,
  endDate,
  minutesAgo
) => {
  try {
    // Get the list of service names from localStorage and parse it
    const serviceListData = JSON.parse(localStorage.getItem("serviceListData"));


    let gqlQuery;

    if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
      gqlQuery = `
      query DBTraceMetricCount {
        dBTraceMetricCount(
            minutesAgo: 0
            from: ${JSON.stringify(startDate)}
            to: ${JSON.stringify(endDate)}
            serviceNameList: ${JSON.stringify(serviceListData)}
        ) {
            dbCallCount
            dbPeakLatencyCount
            serviceName
        }
    }
    `;
    } else {
      gqlQuery = `
      query DBTraceMetricCount {
        dBTraceMetricCount(
          minutesAgo: ${minutesAgo}
          from: ${JSON.stringify(startDate)}
          to: null
          serviceNameList: ${JSON.stringify(serviceListData)}
        ) {
            dbCallCount
            dbPeakLatencyCount
            serviceName
        }
    }
    `;
       }

       const response = await axios.post(
        traceURL,
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


// export const getKafkaSummaryData = async (startDate, endDate, minutesAgo) => {
//   try {
//     const serviceListData = JSON.parse(localStorage.getItem("serviceListData"));
//     const serviceNameListParam = serviceListData.join("&serviceNameList=");

//     var finalUrl;

//     if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
//       console.log(
//         `History call + ${traceURL}/KafkaSumaryChartDataCount?from=${startDate}&serviceNameList=${serviceNameListParam}&to=${endDate}`
//       );
//       finalUrl = `${traceURL}/KafkaSumaryChartDataCount?from=${startDate}&serviceNameList=${serviceNameListParam}&to=${endDate}`;
//     } else {
//       console.log(
//         `Minutes call + ${traceURL}/KafkaSumaryChartDataCount?minutesAgo=${minutesAgo}&serviceNameList=${serviceNameListParam}&to=${startDate}`
//       );
//       finalUrl = `${traceURL}/KafkaSumaryChartDataCount?from=${startDate}&minutesAgo=${minutesAgo}&serviceNameList=${serviceNameListParam}`;
//     }

//     const response = await axios.get(finalUrl);
//     return response.data;
//   } catch (error) {
//     console.error("Error retrieving users:", error);
//     throw error;
//   }
// };

export const getKafkaSummaryData = async (
  startDate,
   endDate, 
   minutesAgo
   ) => {
  try {
// Get the list of service names from localStorage and parse it
const serviceListData = JSON.parse(localStorage.getItem("serviceListData"));

// Construct the URL with the service names
// const serviceNameListParam = serviceListData.join('&serviceNameList=');

// const serviceNameListParam = serviceListData.join("&serviceNameList=");

let gqlQuery;

if (JSON.parse(localStorage.getItem("needHistoricalData"))) {

  gqlQuery = `
  query KafkaTraceMetricCount {
    kafkaTraceMetricCount(
        serviceNameList: ${JSON.stringify(serviceListData)}
        from: ${JSON.stringify(startDate)}
        to: ${JSON.stringify(endDate)}
        minutesAgo: 0
    ) {
        kafkaCallCount
        kafkaPeakLatency
        serviceName
    }
}
`;
} else {
  gqlQuery = `
  query KafkaTraceMetricCount {
    kafkaTraceMetricCount(
        serviceNameList: ${JSON.stringify(serviceListData)}
        minutesAgo: ${minutesAgo}
          from: ${JSON.stringify(startDate)}
          to: null
    ) {
        kafkaCallCount
        kafkaPeakLatency
        serviceName
    }
}
`;
}
const response = await axios.post(
  traceURL,
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



export const getPeakLatencyFilterData = async (
  startDate,
  minPeakLatency,
  maxPeakLatency,
  endDate,
  minutesAgo,
) => {
  try {
    const serviceListData = JSON.parse(localStorage.getItem("serviceListData"));
    const serviceNameListParam = serviceListData.join("&serviceNameList=");

    var finalUrl;

    if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
      console.log(
        `History call + ${traceURL}/TraceSumaryChartPeaKLatencyCount?from=${endDate}&maxpeakLatency=${maxPeakLatency}&minpeakLatency=${minPeakLatency}&serviceNameList=${serviceNameListParam}&to=${startDate}`
      );
      finalUrl = ` ${traceURL}/TraceSumaryChartPeaKLatencyCount?from=${endDate}&maxpeakLatency=${maxPeakLatency}&minpeakLatency=${minPeakLatency}&serviceNameList=${serviceNameListParam}&to=${startDate}`;
    } else {
      console.log(
        `Minutes call + ${traceURL}/TraceSumaryChartPeaKLatencyCount?maxpeakLatency=${maxPeakLatency}&minpeakLatency=${minPeakLatency}&minutesAgo=${minutesAgo}&serviceNameList=${serviceNameListParam}&to=${startDate}`
      );
      finalUrl = `${traceURL}/TraceSumaryChartPeaKLatencyCount?maxpeakLatency=${maxPeakLatency}&minpeakLatency=${minPeakLatency}&minutesAgo=${minutesAgo}&serviceNameList=${serviceNameListParam}&to=${startDate}`;
    }

    const response = await axios.get(finalUrl);
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

export const getDBPeakLatencyFilterData = async (
  startDate,
  minPeakLatency,
  maxPeakLatency,
  endDate,
  minutesAgo,

) => {
  try {
    const serviceListData = JSON.parse(localStorage.getItem("serviceListData"));
    // const serviceNameListParam = serviceListData.join("&serviceNameList=");

    let gqlQuery;

    if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
      gqlQuery = `
      query DBTracePeakLatencyCount {
        dBTracePeakLatencyCount(
          from: ${JSON.stringify(startDate)}
          to: ${JSON.stringify(endDate)}
            minutesAgo: 0
            serviceNameList: ${JSON.stringify(serviceListData)}
            minPeakLatency: ${JSON.stringify(minPeakLatency)}
            maxPeakLatency: ${JSON.stringify(maxPeakLatency)}
        ) {
            dbCallCount
            dbPeakLatencyCount
            serviceName
        }
    }
    
      `;

    } else {
      gqlQuery = `
      query DBTracePeakLatencyCount {
        dBTracePeakLatencyCount(
          from: ${JSON.stringify(startDate)}
          to: null
            minutesAgo:  ${minutesAgo}
            serviceNameList: ${JSON.stringify(serviceListData)}
            minPeakLatency: ${JSON.stringify(minPeakLatency)}
            maxPeakLatency: ${JSON.stringify(maxPeakLatency)}
        ) {
            dbCallCount
            dbPeakLatencyCount
            serviceName
        }
    }
     
      `;
     }

    const response = await axios.post(
      traceURL,
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
      console.log('GraphQL getDBPeakLatencyFilterData output:', response.data);
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


export const getKafkaPeakLatencyFilterData = async (
  startDate,
  minPeakLatency,
  maxPeakLatency,
  endDate,
  minutesAgo,

) => {
  try {
    const serviceListData = JSON.parse(localStorage.getItem("serviceListData"));
    const serviceNameListParam = serviceListData.join("&serviceNameList=");

    var finalUrl;

    if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
      console.log(
        `History call + ${traceURL}/KafkaSumaryChartPeakLatencyCount?from=${startDate}&maxpeakLatency=${maxPeakLatency}&minpeakLatency=${minPeakLatency}&serviceNameList=${serviceNameListParam}&to=${endDate}`
      );
      finalUrl = ` ${traceURL}/KafkaSumaryChartPeakLatencyCount?from=${startDate}&maxpeakLatency=${maxPeakLatency}&minpeakLatency=${minPeakLatency}&serviceNameList=${serviceNameListParam}&to=${endDate}`;
    } else {
      console.log(
        `Minutes call + ${traceURL}/KafkaSumaryChartPeakLatencyCount?from=${startDate}&maxpeakLatency=${maxPeakLatency}&minpeakLatency=${minPeakLatency}&minutesAgo=${minutesAgo}&serviceNameList=${serviceNameListParam}`
      );
      finalUrl = `${traceURL}/KafkaSumaryChartPeakLatencyCount?from=${startDate}&maxpeakLatency=${maxPeakLatency}&minpeakLatency=${minPeakLatency}&minutesAgo=${minutesAgo}&serviceNameList=${serviceNameListParam}`;
    }

    const response = await axios.get(finalUrl);
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};
