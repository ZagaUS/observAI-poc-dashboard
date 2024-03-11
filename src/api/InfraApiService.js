import axios from "axios";

// const nodeMetricUrl = process.env.REACT_APP_APIURL_NODE;
// const podMetricUrl = process.env.REACT_APP_APIURL_POD;
// const eventUrl = process.env.REACT_APP_APIURL_EVENTS;

export const getNodeMetricData = async (
    startDate,
    endDate,
    minutesAgo,
    clusterName,
    nodeName,
    userName
) => {
  try {
    var finalUrl;
    let nodeMetricUrl;

        if(clusterName[0] === "zagaus"){
            console.log('---hey u are in zaga us')
            nodeMetricUrl = process.env.REACT_APP_APIURL_NODE
        }
        else{
            console.log('----hey u r in india')
            nodeMetricUrl = process.env.REACT_APP_APIURL_IND_NODE
        }

        // if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
        //     console.log(`History Call + ${nodeMetricUrl}/getAllNodeMetricData?from=${startDate}&to=${endDate}`);

        //     finalUrl = `${nodeMetricUrl}/getAllNodeMetricData?from=${startDate}&to=${endDate}`;
        // } else {
        //     console.log(`Minutes Call + ${nodeMetricUrl}/getAllNodeMetricData?from=${startDate}&minutesAgo=${minutesAgo}`);

        //     finalUrl = `${nodeMetricUrl}/getAllNodeMetricData?from=${startDate}&minutesAgo=${minutesAgo}`;
        // }

        if(nodeName) {
            if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
                console.log(`History Call + ${nodeMetricUrl}/getAllNodeMetricData?from=${startDate}&to=${endDate}&clusterName=${clusterName}&nodeName=${nodeName}&userName=${userName}`);
    
                finalUrl = `${nodeMetricUrl}/getAllNodeMetricData?from=${startDate}&to=${endDate}&clusterName=${clusterName}&nodeName=${nodeName}&userName=${userName}`;
            } else {
                console.log(`Minutes Call + ${nodeMetricUrl}/getAllNodeMetricData?from=${startDate}&minutesAgo=${minutesAgo}&clusterName=${clusterName}&nodeName=${nodeName}&userName=${userName}`);
    
                finalUrl = `${nodeMetricUrl}/getAllNodeMetricData?from=${startDate}&minutesAgo=${minutesAgo}&clusterName=${clusterName}&nodeName=${nodeName}&userName=${userName}`;
            }
        } else {
            if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
                console.log(`History Call + ${nodeMetricUrl}/getAllNodeMetricData?from=${startDate}&to=${endDate}&clusterName=${clusterName}&userName=${userName}`);
    
                finalUrl = `${nodeMetricUrl}/getAllNodeMetricData?from=${startDate}&to=${endDate}&clusterName=${clusterName}&userName=${userName}`;
            } else {
                console.log(`Minutes Call + ${nodeMetricUrl}/getAllNodeMetricData?from=${startDate}&minutesAgo=${minutesAgo}&clusterName=${clusterName}&userName=${userName}`);
    
                finalUrl = `${nodeMetricUrl}/getAllNodeMetricData?from=${startDate}&minutesAgo=${minutesAgo}&clusterName=${clusterName}&userName=${userName}`;
            }
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
  pageSize,
  clusterName,
  userName
) => {
  try {
    let finalUrl;
    let podMetricUrl;

    if (clusterName[0] === "zagaus") {
      console.log("---hey u are in zaga us");
      podMetricUrl = process.env.REACT_APP_APIURL_POD;
    } else {
      console.log("----hey u r in india");
      podMetricUrl = process.env.REACT_APP_APIURL_IND_POD;
    }

    if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
      // console.log(`History Call + ${podMetricUrl}/getAllPodMetrics?from=${startDate}&to=${endDate}`);

      // finalUrl = `${podMetricUrl}/getAllPodMetrics?from=${startDate}&page=${page}&pageSize=${pageSize}&to=${endDate}`;
      finalUrl = `${podMetricUrl}/getAllPodMetrics?clusterName=${clusterName}&from=${startDate}&page=${page}&pageSize=${pageSize}&to=${endDate}&userName=${userName}`;
    } else {
      // console.log(`History Call + ${podMetricUrl}/getAllPodMetrics?from=${startDate}&minutesAgo=${minutesAgo}&page=${page}&pageSize=${pageSize}`);

      // finalUrl = `${podMetricUrl}/getAllPodMetrics?from=${startDate}&minutesAgo=${minutesAgo}&page=${page}&pageSize=${pageSize}`;

      // http://localhost:8081/podMetrics/getAllPodMetrics?clusterName=zagaus&from=2024-03-11&minutesAgo=240&page=1&pageSize=10&userName=admin
      finalUrl = `${podMetricUrl}/getAllPodMetrics?clusterName=${clusterName}&from=${startDate}&minutesAgo=${minutesAgo}&page=${page}&pageSize=${pageSize}&userName=${userName}`;
    }

    console.log("Final URL:", finalUrl);

    const response = await axios.get(finalUrl);
    return response.data;
  } catch (error) {
    console.error("Error retrieving pod metric data:", error);
    throw error;
  }
};

// export const getRecentEvent = async (minutesAgo) => {
//     try {
//         console.log("Minutes Ago", minutesAgo);
//         const response = await axios.get(
//             `${eventUrl}/recentevent?minutesAgo=${minutesAgo}`
//         );
//         console.log("Recent Event Response", response);
//         return response.data;
//     } catch (error) {
//         console.error("Error Retrieving Recent Event Data:", error);
//         throw error;
//     }
// };

export const getRecentEvents = async (
  minutesAgo,
  clusterName,
  nodeName,
  userName
) => {
  try {
    let finalUrl;
    let eventUrl;
    console.log("Minutes Ago", minutesAgo);
    // const response = await axios.get(
    //     `${eventUrl}/get-recent-events?minutesAgo=${minutesAgo}`
    // );

    // clusterName=zagaus&minutesAgo=30&userName=admin
    if (clusterName[0] === "zagaus") {
      eventUrl = process.env.REACT_APP_APIURL_EVENTS;
    } else {
      eventUrl = process.env.REACT_APP_APIURL_IND_EVENTS;
    }
    if (nodeName) {
      console.log(
        `History call + ${eventUrl}/get-recent-events?minutesAgo=${minutesAgo}&clusterName=${clusterName}&nodeName=${nodeName}&userName=${userName}`
      );

      finalUrl = `${eventUrl}/get-recent-events?minutesAgo=${minutesAgo}&clusterName=${clusterName}&nodeName=${nodeName}&userName=${userName}`;
    } else {
      console.log(
        `History call + ${eventUrl}/get-recent-events?minutesAgo=${minutesAgo}&clusterName=${clusterName}&userName=${userName}`
      );

      finalUrl = `${eventUrl}/get-recent-events?minutesAgo=${minutesAgo}&clusterName=${clusterName}&userName=${userName}`;
    }

    const response = await axios.get(finalUrl);
    console.log("Recent Event Response", response);
    return response.data;
  } catch (error) {
    console.error("Error Retrieving Recent Event Data:", error);
    throw error;
  }
};

// export const getAllEvent = async (minutesAgo) => {
//     try {
//         console.log("Minutes Ago - allEvent", minutesAgo);
//         const response = await axios.get(
//             `${eventUrl}/getAllEvents?minutesAgo=${minutesAgo}`
//         );
//         console.log("All Event Response", response);
//         return response.data;
//     } catch (error) {
//         console.error("Error Retrieving All Events:", error);
//         throw error;
//     }
// };

export const getAllEventByDate = async (
  startDate,
  endDate,
  minutesAgo,
  clusterName,
  nodeName,
  userName
) => {
  try {
    console.log("Minutes Ago - allEvent", startDate, endDate, minutesAgo);
    // const response = await axios.get(
    //     `${eventUrl}/getAllEvents?minutesAgo=${minutesAgo}`
    // );
    var finalUrl;
    var eventUrl;

    // if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
    //     console.log(`History Call + ${eventUrl}/getall-Events-aggregation?from=${startDate}&to=${endDate}`);

    //     finalUrl = `${eventUrl}/getall-Events-aggregation?from=${startDate}&to=${endDate}`
    // } else {
    //     console.log(`History Call + ${eventUrl}/getall-Events-aggregation?from=${startDate}&minutesAgo=${minutesAgo}`);

    //     finalUrl = `${eventUrl}/getall-Events-aggregation?from=${startDate}&minutesAgo=${minutesAgo}`
    // }
    if (clusterName[0] === "zagaus") {
      eventUrl = process.env.REACT_APP_APIURL_EVENTS;
    } else {
      eventUrl = process.env.REACT_APP_APIURL_IND_EVENTS;
    }
    if (nodeName) {
      if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
        console.log(
          `History Call + ${eventUrl}/getall-Events-aggregation?from=${startDate}&to=${endDate}&clusterName=${clusterName}&nodeName=${nodeName}&userName=${userName}`
        );

        finalUrl = `${eventUrl}/getall-Events-aggregation?from=${startDate}&to=${endDate}&clusterName=${clusterName}&nodeName=${nodeName}&userName=${userName}`;
      } else {
        console.log(
          `History Call + ${eventUrl}/getall-Events-aggregation?from=${startDate}&minutesAgo=${minutesAgo}&clusterName=${clusterName}&nodeName=${nodeName}&userName=${userName}`
        );

        finalUrl = `${eventUrl}/getall-Events-aggregation?from=${startDate}&minutesAgo=${minutesAgo}&clusterName=${clusterName}&nodeName=${nodeName}&userName=${userName}`;
      }
    } else {
      if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
        console.log(
          `History Call + ${eventUrl}/getall-Events-aggregation?from=${startDate}&to=${endDate}&clusterName=${clusterName}&userName=${userName}`
        );

        finalUrl = `${eventUrl}/getall-Events-aggregation?from=${startDate}&to=${endDate}&clusterName=${clusterName}&userName=${userName}`;
      } else {
        console.log(
          `History Call + ${eventUrl}/getall-Events-aggregation?from=${startDate}&minutesAgo=${minutesAgo}&clusterName=${clusterName}&userName=${userName}`
        );

        finalUrl = `${eventUrl}/getall-Events-aggregation?from=${startDate}&minutesAgo=${minutesAgo}&clusterName=${clusterName}&userName=${userName}`;
      }
    }

    const response = await axios.get(finalUrl);
    console.log("All Event Response", response);
    return response.data;
  } catch (error) {
    console.error("Error Retrieving All Events:", error);
    throw error;
  }
};
