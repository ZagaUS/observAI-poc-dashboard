import axios from 'axios';

const keplerUrl = process.env.REACT_APP_GRAPHQLURL_KEPLER;


export const getKeplerMetricData = async (
  startDate,
  endDate,
  minutesAgo,
  type,
  keplerTypeList
) => {
  try {
    var finalUrl;

    const keplerTypeParam = keplerTypeList.join("&keplerType=");

    if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
      console.log(
        `History call + ${keplerUrl}/getAllKepler-MetricData?from=${startDate}&keplerType=${keplerTypeParam}&to=${endDate}&type=${type}`
      );
      finalUrl = `${keplerUrl}/getAllKepler-MetricData?from=${startDate}&keplerType=${keplerTypeParam}&to=${endDate}&type=${type}`;
    } else {
      console.log(
        `Minutes call + ${keplerUrl}/getAllKepler-MetricData?from=${startDate}&keplerType=${keplerTypeParam}&minutesAgo=${minutesAgo}&type=${type}`
      );
      finalUrl = `${keplerUrl}/getAllKepler-MetricData?from=${startDate}&keplerType=${keplerTypeParam}&minutesAgo=${minutesAgo}&type=${type}`;
    }

    const response = await axios.get(finalUrl);
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

// export const getKeplerMetricDataPaginated = async (
//     startDate,
//     endDate,
//     minutesAgo,
//     type,
//     keplerTypeList,
//     page,
//     pageSize
// ) => {
//     try {
//         var finalUrl;

//         const keplerTypeParam = keplerTypeList.join("&keplerType=");

//         if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
//             console.log(
//                 `History call + ${keplerUrl}/getAllKepler-MetricData?from=${startDate}&keplerType=${keplerTypeParam}&page=${page}&pageSize=${pageSize}&to=${endDate}&type=${type}`
//             );
//             finalUrl = `${keplerUrl}/getAllKepler-MetricData?from=${startDate}&keplerType=${keplerTypeParam}&page=${page}&pageSize=${pageSize}&to=${endDate}&type=${type}`;
//         } else {
//             console.log(
//                 `Minutes call + ${keplerUrl}/getAllKepler-MetricData?from=${startDate}&keplerType=${keplerTypeParam}&minutesAgo=${minutesAgo}&page=${page}&pageSize=${pageSize}&type=${type}`
//             );
//             finalUrl = `${keplerUrl}/getAllKepler-MetricData?from=${startDate}&keplerType=${keplerTypeParam}&minutesAgo=${minutesAgo}&page=${page}&pageSize=${pageSize}&type=${type}`;
//         }

//         const response = await axios.get(finalUrl);
//         return response.data;
//     } catch (error) {
//         console.error("Error retrieving users:", error);
//         throw error;
//     }
// };

export const getKeplerMetricDataPaginated = async (
  startDate,
  endDate,
  minutesAgo,
  type,
  keplerTypeList,
  page,
  pageSize
) => {
  try {
    let gqlQuery;

    if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
      gqlQuery = `
          query AllKeplerMetricDatas {
            allKeplerMetricDatas(
                minutesAgo: 0
                page: ${page}
            pageSize: ${pageSize}
                from: ${JSON.stringify(startDate)}
                 to: ${JSON.stringify(endDate)}
                type: ${JSON.stringify(type)}
                keplerType: ${JSON.stringify(keplerTypeList)}
            ) {
                displayName
                totalCount
                containerPowerMetrics {
                    createdTime
                    consumptionValue
                }
            }
        }        
          `;
    } else {
      gqlQuery = `
          query AllKeplerMetricDatas {
            allKeplerMetricDatas(
                minutesAgo: ${minutesAgo}
                page: ${page}
            pageSize: ${pageSize}
                from: ${JSON.stringify(startDate)}
                to: null
                type: ${JSON.stringify(type)}
                keplerType: ${JSON.stringify(keplerTypeList)}
            ) {
                displayName
                totalCount
                containerPowerMetrics {
                    createdTime
                    consumptionValue
                }
            }
        }
        
          `;
    }

    console.log("---------->", gqlQuery);


    const response = await axios.post(
      keplerUrl,

      {
        query: gqlQuery,
        variables: {},
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("GraphQL Response:", response.data);

    if (response.data) {
      console.log('GraphQL Filter option output:', response.data.data);
      return response.data;
    } else {
      console.error('GraphQL response is null:', response);
      throw new Error('Null response received');
    }
  } catch (error) {
    console.error('Error retrieving logs:', error);
    throw error;
  }
};