import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Box,
  useTheme,
  CardHeader,
  Pagination,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import "./TraceList.css";
import { tokens } from "../../../theme";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { useEffect } from "react";
import { useState } from "react";
import { spanData } from "../../../global/MockData/SpanData";
import { useContext } from "react";
import { GlobalContext } from "../../../global/globalContext/GlobalContext";
// import { BiSolidHandRight } from "react-icons/bi";
import { FaRegHandPointRight } from "react-icons/fa";

import {
  FindByTraceIdForSpans,
  TraceFilterOption,
  TraceFilterOptionWithDate,
  TraceListPaginationApi,
  TraceListPaginationApiWithDate,
  findLogByErrorTrace,
} from "../../../api/TraceApiService";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { useCallback } from "react";
import setupAxiosInterceptor from "../../../api/SetupAxiosInterceptors";
import Loading from "../../../global/Loading/Loading";
import { findLogByTraceId } from "../../../api/LogApiService";
import { useNavigate } from "react-router-dom";
import PaginationItem from "@mui/material/PaginationItem";
import ForwardOutlinedIcon from "@mui/icons-material/ForwardOutlined";
import ForwardRoundedIcon from "@mui/icons-material/ForwardRounded";
import TrendingFlatRoundedIcon from "@mui/icons-material/TrendingFlatRounded";
const mockTraces = [
  {
    servicename: "orderService",
    endPoint: "/order/getOrderById/{id}",
    traceID: "123456987667898767898768987984594b345679",
    createdTime: "a few seconds ago",
    statusCode: "200",
    method: "GET",
    duration: "100 ms",
  },
  {
    servicename: "Service 2",
    endPoint: "/endpoint2",
    traceID: "789012",
    createdTime: "1 min ago",
    statusCode: "404",
    method: "POST",
    duration: "200 ms",
  },
  {
    servicename: "Service 3",
    endPoint: "/endpoint3",
    traceID: "345678",
    createdTime: "2 min ago",
    statusCode: "200",
    method: "GET",
    duration: "250 ms",
  },
  {
    servicename: "Service 4",
    endPoint: "/endpoint4",
    traceID: "123456",
    createdTime: "5 min ago",
    statusCode: "200",
    method: "GET",
    duration: "200 ms",
  },
  {
    servicename: "Service 5",
    endPoint: "/endpoint5",
    traceID: "123456",
    createdTime: "10 min ago",
    statusCode: "200",
    method: "GET",
    duration: "150 ms",
  },
  {
    servicename: "vendorService",
    endPoint: "/vendor/deleteVendorById/{id}",
    traceID: "123456",
    createdTime: "15 min ago",
    statusCode: "200",
    method: "DELETE",
    duration: "200 ms",
  },
];

// const sortOrder = ['Earliest First', 'Oldest First', 'Error First', 'Peak Latency First'];
const apicall = 0;
const sortOrderOptions = [
  {
    label: "Newest",
    value: "new",
  },
  {
    label: "Oldest",
    value: "old",
  },
  {
    label: "Error",
    value: "error",
  },
  {
    label: "Peaked Latency",
    value: "peakLatency",
  },
];

const TraceList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // const [traceData, setTraceData] = useState([]);
  const {
    setIsCollapsed,
    setSelectedTrace,
    traceData,
    setTraceData,
    lookBackVal,
    needFilterCall,
    filterApiBody,
    setTraceGlobalEmpty,
    setTraceGlobalError,
    setTraceLoading,
    recentTrace,
    setGlobalLogData,
    setTraceToLogError,
    setSelected,
    logTrace,
    traceRender,
    setLogRender,
    setMetricRender,
    traceSummaryService,
    setLogSummaryService,
    setClearTraceFilter,
    selectedStartDate,
    selectedEndDate,
    needHistoricalData,
    setShowError,
    setErroredLogData,
    setNavActiveTab,
    setClearLogFilter,
    setNeedLogFilterCall,
    setSelectedLogService,
    setApmActiveTab
  } = useContext(GlobalContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [selectedSortOrder, setSelectedSortOrder] = useState("error");
  const [loading, setLoading] = useState(false);
  const [activeTraceIcon, setActiveTraceIcon] = useState(false);

  const [activeTraceId, setActiveTraceId] = useState(null);

  // const [isEmptyData, setIsEmptyData] = useState(false);
  // const [emptyMessage, setEmptyMessage] = useState(null);
  // const [error, setError] = useState(null);
  const pageLimit = 10;

  // const createTimeInWords = (data) => {
  //   const now = new Date(); // Current date and time in UTC
  
  //   const updatedData = data.map((item) => {
  //     try {
  //       const createdTimeUTC = new Date(item.createdTime); // Convert timestamp to Date object in UTC
  //       const offsetIST = 5.5 * 60 * 60 * 1000; // Offset for IST (5.5 hours ahead of UTC)
  //       const createdTimeIST = new Date(createdTimeUTC.getTime() + offsetIST);
  
  //       const timeDifference = Math.floor((now - createdTimeIST) / 1000); // Difference in seconds
  
  //       let timeAgo;
  
  //       if (timeDifference < 60) {
  //         timeAgo = `${timeDifference} seconds ago`;
  //       } else if (timeDifference < 3600) {
  //         const minutes = Math.floor(timeDifference / 60);
  //         timeAgo = minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  //       } else if (timeDifference < 86400) {
  //         const hours = Math.floor(timeDifference / 3600);
  //         timeAgo = hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  //       } else {
  //         const days = Math.floor(timeDifference / 86400);
  //         timeAgo = days === 1 ? "1 day ago" : `${days} days ago`;
  //       }
  
  //       const formattedTime = `${createdTimeIST.toLocaleDateString()} ${createdTimeIST.toLocaleTimeString()}`;
  
  //       return {
  //         ...item,
  //         createdTimeInWords: timeAgo,
  //         createdTimeInDate: formattedTime,
  //       };
  //     } catch (error) {
  //       console.error("Invalid time value:", item.createdTime);
  //       return {
  //         ...item,
  //         createdTimeInWords: "Invalid time",
  //         createdTimeInDate: "Invalid time",
  //       };
  //     }
  //   });
  
  //   return updatedData;
  // };
  
  
  const createTimeInWords = (data) => {
    const now = new Date(); // Current date and time in UTC
  
    const updatedData = data.map((item) => {
      try {
        const createdTimeUTC = new Date(item.createdTime); // Convert timestamp to Date object in UTC
        const offsetIST = 5.5 * 60 * 60 * 1000; // Offset for IST (5.5 hours ahead of UTC)
        const createdTimeIST = new Date(createdTimeUTC.getTime() + offsetIST);
  
        const timeDifference = Math.floor((now - createdTimeIST) / 1000); // Difference in seconds
  
        let timeAgo;
  
        if (timeDifference < 60) {
          timeAgo = `${timeDifference} seconds ago`;
        } else if (timeDifference < 3600) {
          const minutes = Math.floor(timeDifference / 60);
          timeAgo = minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
        } else if (timeDifference < 86400) {
          const hours = Math.floor(timeDifference / 3600);
          timeAgo = hours === 1 ? "1 hour ago" : `${hours} hours ago`;
        } else {
          const days = Math.floor(timeDifference / 86400);
          timeAgo = days === 1 ? "1 day ago" : `${days} days ago`;
        }
  
        const formattedTime = createdTimeIST.toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: true
        });
  
        return {
          ...item,
          createdTimeInWords: timeAgo,
          createdTimeInDate: formattedTime,
        };
      } catch (error) {
        console.error("Invalid time value:", item.createdTime);
        return {
          ...item,
          createdTimeInWords: "Invalid time",
          createdTimeInDate: "Invalid time",
        };
      }
    });
  
    return updatedData;
  };
  

 // setupAxiosInterceptor(setTraceLoading);
 const spanApiCall = async (traceId) => {
  try {
   // setTraceLoading(true);
    const data = await FindByTraceIdForSpans(traceId);
    // console.log("output------" + JSON.stringify(data));
    console.log("OUTPUT " + JSON.stringify(data.data.findByTraceId[0]));
    setSelectedTrace(data.data.findByTraceId[0]);
    
    setSelectedTrace(data.data.findByTraceId.data[0]);
    setActiveTraceId(traceId);
    setActiveTraceIcon(true);
   // setTraceLoading(false);
  } catch (error) {
    console.log("ERROR " + error);
    setTraceLoading(false);
  }
};


 
  const handleCardClick = (traceId, index) => {
    console.log("Clicked");
    setShowError(false);
    setTraceLoading(true);
    
    spanApiCall(traceId);
    // setActiveTraceId(traceId);
    // setActiveTraceIcon(true);
    setTraceLoading(false);
  };

  const dashboardTraceMap = useCallback(() => {
    if (recentTrace.length !== 0) {
      console.log("Trace UseEffect called!" + recentTrace);
      setTraceData(recentTrace);
    } else if (logTrace.length !== 0) {
      setTraceData(logTrace);
      // jey handleCardClick(logTrace[0].traceId);
      spanApiCall(logTrace[0].traceId);
    }
  }, [recentTrace, setTraceData, logTrace]);

  const apiCall = useCallback(async () => {
    try {
      console.log("Trace api called!");
      // Get the list of service names from localStorage and parse it
      let serviceListData = [];
      if (traceSummaryService.length === 0) {
        console.log("called default" + traceSummaryService);
        serviceListData = JSON.parse(localStorage.getItem("serviceListData"));
      } else {
        console.log("called dashboard" + traceSummaryService);
        serviceListData = traceSummaryService;
      }
      setLoading(true);
      const { data } = await TraceListPaginationApiWithDate(
        currentPage,
        pageLimit,
        selectedStartDate,
        selectedEndDate,
        lookBackVal.value,
        selectedSortOrder,
        serviceListData
      );
      const updatedData = createTimeInWords(data.sortOrderTrace.traces);
      const totalCount = data.sortOrderTrace.totalCount; 
      if (data.sortOrderTrace.traces.length === 0) {
        setTraceGlobalEmpty("No Data to Display!");
      } else {
        setTraceData(updatedData);
        // jey handleCardClick(updatedData[0].traceId);
        spanApiCall(updatedData[0].traceId);
        setTotalPageCount(Math.ceil(totalCount / pageLimit));
      }

      // setTraceLoading(false);
      setLoading(false);
    } catch (error) {
      console.log("ERROR " + error);
      setTraceGlobalError("An error occurred");
      // setTraceLoading(false);
      setLoading(false);
    }
  }, [
    pageLimit,
    traceSummaryService,
    currentPage,
    selectedStartDate,
    selectedEndDate,
    lookBackVal,
    selectedSortOrder,
    setTraceData,
    setTotalPageCount,
    setTraceGlobalEmpty,
    setTraceGlobalError,
    needHistoricalData,
  ]);

  // const filterApiCall = useCallback(async () => {
  //   try {
  //     console.log("Trace filter called!");
  //     // setTraceLoading(true);
  //     setLoading(true);
  //     const { data, totalCount } = await TraceFilterOptionWithDate(
  //       selectedStartDate,
  //       lookBackVal.value,
  //       selectedSortOrder,
  //       selectedEndDate,
  //       currentPage,
  //       pageLimit,
  //       filterApiBody
  //     );
  //     const updatedData = createTimeInWords(data);

  //     if (updatedData.length === 0) {
  //       setTraceGlobalEmpty(
  //         `No Data Matched for this filter! Please click on refresh / select different queries to filter!`
  //       );
  //     } else {
  //       setTraceData(updatedData);
  //       //jey handleCardClick(updatedData[0].traceId);
  //       spanApiCall(updatedData[0].traceId)
  //       setTotalPageCount(Math.ceil(totalCount / pageLimit));
  //     }

  //     setLoading(false);
  //     // setTraceLoading(false);
  //   } catch (error) {
  //     console.log("ERROR " + error);
  //     setTraceGlobalError("An error occurred On Filter");
  //     // setTraceLoading(false);
  //     setLoading(false);
  //   }
  // }, [
  //   pageLimit,
  //   currentPage,
  //   filterApiBody,
  //   selectedStartDate,
  //   selectedSortOrder,
  //   lookBackVal,
  //   selectedEndDate,
  //   setTraceData,
  //   setTotalPageCount,
  //   setTraceGlobalEmpty,
  //   setTraceGlobalError,
  //   needHistoricalData,
  // ]);



const filterApiCall = useCallback(async () => {
  try {
    console.log("Trace filter called!" + filterApiBody);
    setLoading(true);

    const { data } = await TraceFilterOptionWithDate(
      selectedStartDate,
      lookBackVal.value,
      selectedSortOrder,
      selectedEndDate,
      currentPage,
      pageLimit,
      filterApiBody
    );

       const updatedData = createTimeInWords(data.traceFilter.traces);
       const totalCount = data.traceFilter.totalCount; 

        if (data.traceFilter.traces.length === 0) {
          setTraceGlobalEmpty(
            `No Data Matched for this filter! Please click on refresh / select different queries to filter!`
          );
        } else {
          setTraceData(updatedData);
          //jey handleCardClick(updatedData[0].traceId);
          spanApiCall(updatedData[0].traceId)
          setTotalPageCount(Math.ceil(totalCount / pageLimit));
        }
  
        setLoading(false);
        // setTraceLoading(false);
      } catch (error) {
        console.log("ERROR " + error);
        setTraceGlobalError("An error occurred On Filter");
        // setTraceLoading(false);
        setLoading(false);
      }
    }, [
      pageLimit,
      currentPage,
      filterApiBody,
      selectedStartDate,
      selectedSortOrder,
      lookBackVal,
      selectedEndDate,
      setTraceData,
      setTotalPageCount,
      setTraceGlobalEmpty,
      setTraceGlobalError,
      needHistoricalData,
    ]);




//     // Add a console log to inspect the API response
//     console.log("API Response:", data);

//     if (data && data.traceFilter.totalCount.traces) {
//       const totalCount = data.traceFilter.totalCount;
//       const updatedData = createTimeInWords(data.traceFilter.traces);

//       if (data.traceFilter.traces.length === 0) {
//         setTraceData(updatedData);
//         spanApiCall(updatedData[0].traceId);
//         setTotalPageCount(Math.ceil(totalCount / pageLimit));
//       } else {
//         setTraceGlobalEmpty(
//           `No Data Matched for this filter! Please click on refresh / select different queries to filter!`
//         );
//       }

//       setLoading(false);
//     } else {
//       console.log("Invalid data structure:", data);
//       setTraceGlobalEmpty(
//         `No Data Matched for this filter! Please click on refresh / select different queries to filter!`
//       );
//       setLoading(false);
//     }
//   } catch (error) {
//     console.log("ERROR " + error);
//     setTraceGlobalError("An error occurred On Filter");
//     setLoading(false);
//   }
// }, [
//   pageLimit,
//   currentPage,
//   filterApiBody,
//   selectedStartDate,
//   selectedSortOrder,
//   lookBackVal,
//   selectedEndDate,
//   setTraceData,
//   setTotalPageCount,
//   setTraceGlobalEmpty,
//   setTraceGlobalError,
//   needHistoricalData,
// ]);



  // useEffect(() => {
  //   console.log("Trace UseEffect called!");
  //   setSelectedTrace([]);
  //   if (needFilterCall) {
  //     filterApiCall(currentPage, filterApiBody);
  //   } else {
  //     if (recentTrace.length === 0 && logTrace.length === 0) {
  //       apiCall(currentPage);
  //     } else {
  //       dashboardTraceMap();
  //     }
  //   }

  //   // return () => {
  //   //   setRecentTrace([]);
  //   //   setLogTrace([]);
  //   // };
  // }, [
  //   currentPage,
  //   needFilterCall,
  //   apiCall,
  //   filterApiCall,
  //   filterApiBody,
  //   recentTrace,
  //   dashboardTraceMap,
  //   setSelectedTrace,
  //   logTrace
  // ]);

  useEffect(() => {
    setSelectedTrace([]);
    setLogRender(false);
    setMetricRender(false);
    setLogSummaryService([]);
    setNavActiveTab(2);
    setApmActiveTab(0);
    if (needFilterCall) {
      filterApiCall();
    } else if (logTrace.length === 0 || !traceRender) {
      setClearTraceFilter(false);
      apiCall();
    } else {
      setClearTraceFilter(false);
      dashboardTraceMap();
      setIsCollapsed(false);
    }

    return () => {
      setShowError(false);
    }
  }, [
    apiCall,
    filterApiCall,
    needFilterCall,
    dashboardTraceMap,
    traceRender,
    setLogRender,
    logTrace,
    setSelectedTrace,
    setMetricRender,
    setLogSummaryService,
    setNavActiveTab,
  ]);

  const handlePageChange = (event, newPage) => {
    console.log("PAGE " + newPage);
    setCurrentPage(newPage);
  };

  const handleLogRoute = async (traceId) => {
    console.log("TraceId " + traceId);
    try {
      const logData = await findLogByTraceId(traceId);
      console.log("Log Data " + JSON.stringify(logData));
      if (logData.data.findLogsByTraceId.length !== 0) {
        setLogRender(true);
        setGlobalLogData(logData.data.findLogsByTraceId);
        // localStorage.setItem("routeName", "Logs");
        // setSelected("Logs");
        setApmActiveTab(2);
        navigate("/mainpage/apm/logs");
        setClearLogFilter(true);
        setNeedLogFilterCall(false);
        setSelectedLogService([]);
        setNavActiveTab(3);
      } else {
        setTraceToLogError("No Log for this TraceId!");
      }
    } catch (error) {
      setTraceToLogError("An error occurred!");
    }
  };

  // const handleSortOrderChange = (selectedValue) => {
  //   console.log("SORT " + selectedValue.value);
  //   setSelectedSortOrder(selectedValue.value);
  // };

  const handleSortOrderChange = (event) => {
    console.log("SORT " + event);
    setSelectedSortOrder(event.target.value);
    setCurrentPage(1);
  };

  const getErroredLogsByTraceId = async (traceId) => {
    console.log("its enteered")
    try {
      setTraceLoading(true);
      const data = await findLogByErrorTrace(traceId);
        console.log("error ++++++++++++   response OUTPUT ", JSON.stringify(data.data.findByTraceErrorTraceId));
      setErroredLogData(data.data.findByTraceErrorTraceId);
      setTraceLoading(false);
    } catch (error) {
      console.log("ERROR " + error);
      setTraceLoading(false);
    }
  };

  const handleOpenErrors = (traceId, index) => {
    console.log("Error Opened! " + traceId);
    getErroredLogsByTraceId(traceId);
    //jey added for hand icon for view erro
    setActiveTraceId(traceId);
    setActiveTraceIcon(true);
    setShowError(true);
  };

  const customPageStyles = {
    backgroundColor: colors.greenAccent[500], // Change 'blue' to your desired background color for the page numbers
    color: colors.textColor[500], // Change 'black' to your desired text color for the page numbers
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            overflowX="auto"
          >
            <Typography
              variant="h4"
              // fontWeight="500"
              style={{ margin: "10px 10px 8px 5px" }}
            >
              Traces ({traceData.length})
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                margin: "10px 0 8px 0",
              }}
            >
              {/* <Pagination
                  count={totalPageCount}
                  variant="outlined"
                  size="small"
                  shape="rounded"
                  page={currentPage}
                  onChange={handlePageChange}
                /> */}
              <Pagination
                count={totalPageCount}
                page={currentPage}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                size="small"
                renderItem={(item) => (
                  <PaginationItem
                    component="div"
                    {...item}
                    style={{
                      backgroundColor:
                        item.type === "page" && item.page !== currentPage
                          ? null
                          // jey : colors.blueAccent[400],
                          : colors.primary[400],
                      color:
                        // item.type === "page" && item.page === currentPage
                        //   ? "#FFF"
                        //   : null,
                        item.type === "page"
                          ? item.page === currentPage
                            ? "#FFF" // Set the color for the current page number
                            : colors.primary[100] // Set the color for other page numbers
                          : "#FFF",
                      // backgroundColor:colors.primary[]
                    }}
                  />
                )}
              />
            </Box>

            {/* {!needFilterCall ? ( */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  margin: "5px 0 8px 0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: "15px",
                  }}
                >
                  <label style={{ fontSize: "10px", marginBottom: "5px" }}>
                    SortBy
                  </label>
                  {/* <Dropdown
                      options={sortOrderOptions}
                      placeholder="Sort Order"
                      arrowClosed={<span className="arrow-closed" />}
                      arrowOpen={<span className="arrow-open" />}
                      value={selectedSortOrder}
                      onChange={handleSortOrderChange}
                    /> */}
                  <Select
                    value={selectedSortOrder}
                    onChange={handleSortOrderChange}
                    sx={{ width: "150px", height: "30px",marginRight:"5px" }}
                  >
                    <MenuItem value="" disabled>
                      Sort Order
                    </MenuItem>
                    {sortOrderOptions.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </Box>
            {/* ) : null} */}
          </Box>
          <div
            className="scrollable-div"
            style={{
              maxHeight: "calc(71vh - 85px)",
              overflowY: "auto",
              overflowX: "auto",
            }}
          >
            {" "}
            <Box
              sx={{
                marginRight: "8px",
              }}
            >
              {traceData.map((trace, index) => (
                <Card
                  elevation={4}
                  className="tracelist-card"
                  key={index}
                  sx={{
                    margin: "10px 0 15px 0",
                    width: "calc(560px-10px)",
                    height: "fit-content",
                  }}
                >
                  {/* <CardActionArea> */}
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        // backgroundColor:
                        //   trace.statusCode >= 400 && trace.statusCode <= 500
                        //     ?colors.redAccent[500]
                        //     : colors.blueAccent[400],
                        // jey backgroundColor: colors.blueAccent[400],
                        backgroundColor: colors.primary[400],
                        color: "#FFF",

                        padding: "5px",
                      }}
                    >
                      <span>
                        {" "}
                        <span style={{ fontWeight: "500" }}>
                          {trace.serviceName}:
                        </span>{" "}
                        {trace.operationName}
                      </span>
                      <span>
                        {trace.duration}ms{" "}
                        {/* {trace.traceId === activeTraceId ? activeTraceIcon ? <KeyboardDoubleArrowRightRoundedIcon style={{ color: "#000", backgroundColor:"white"}} /> : null : null} */}
                      </span>
                    </Typography>
                  </Box>
                  <div>
                    <CardContent>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="h7"
                          sx={{
                            color:
                              trace.statusCode >= 400 && trace.statusCode <= 500
                                ? colors.redAccent[500]
                                : colors.primary[100],
                          }}
                        >
                          <span
                            style={{
                              fontWeight: "500",
                              color:
                                trace.statusCode >= 400 &&
                                  trace.statusCode <= 500
                                  ? colors.redAccent[500]
                                  : colors.primary[100],
                            }}
                          >
                            TraceID:
                          </span>{" "}
                          {trace.traceId}
                        </Typography>
                        <Typography variant="h7">
                          {/* <span style={{ fontWeight: "500" }}>TraceID:</span>{" "} */}
                         {trace.createdTimeInDate}
                        </Typography>
                      </div>

                      <div
                        style={{
                          marginTop: "10px",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >

                        <Button
                          sx={{
                            // backgroundColor:
                            // trace.statusCode >= 400 && trace.statusCode <= 500
                            //   ?colors.redAccent[500]
                            //   : colors.blueAccent[400],
                               
                            // backgroundColor:
                            //   trace.statusCode >= 400 && trace.statusCode <= 500
                            //     ? "#b89b6d"
                            //     : "#E0E0E0",
                            // backgroundColor: colors.grey[400],
                            //backgroundColor:"#906652",
                            // backgroundColor:"#b89b6d",
                            // backgroundColor:"#ab9d85",

                            // backgroundColor:"#E0E0E0",
                            // color: "#000",
                            color: theme.palette.mode === "dark" ? "white" : "black",
                            backgroundColor: theme.palette.mode === "dark" ? "#2C3539" : "#e0e0e0", 
                            // color:
                            //   trace.statusCode >= 400 && trace.statusCode <= 500
                            //     ? "#FFF"
                            //     : "#000",

                            "&:hover": {
                              backgroundColor: "#ffffff",
                              color: colors.primary[600],
                            },
                          }}
                          // component={Link}
                          // to={`/mainpage/logs`}
                          disabled={(trace.statusCode === "" || trace.statusCode === null)}
                          variant="contained"
                          onClick={() => handleLogRoute(trace.traceId)}
                        >  
                          <Typography variant="h8" >View Log</Typography>
                        </Button>
                        <Button
                          sx={{
                            // backgroundColor:
                            //   trace.statusCode >= 400 && trace.statusCode <= 500
                            //     ? "#eb0000"
                            //     : "#808080",
                            // backgroundColor: colors.grey[400],
                            color: "#000",
                            color: theme.palette.mode === "dark" ? "white" : "black",
                            backgroundColor: theme.palette.mode === "dark" ? "#2C3539" : "#e0e0e0",
                            "&:hover": {
                              backgroundColor: "#ffffff",
                              color: colors.primary[600],
                            },
                          }}
                          // component={Link}
                          // to={`/mainpage/logs`}
                          variant="contained"
                          onClick={() => handleCardClick(trace.traceId, index)}
                        >
                          <Typography variant="h8">View Spans</Typography>
                        </Button>{" "}
                        <Button
                          sx={{
                            // backgroundColor:
                            //   trace.statusCode >= 400 && trace.statusCode <= 500
                            //     ? "#eb0000"
                            //     : "#808080",
                            // backgroundColor: colors.grey[400],
                            color: "#000",
                            color: theme.palette.mode === "dark" ? "white" : "black",
                            backgroundColor: theme.palette.mode === "dark" ? "#2C3539" : "#e0e0e0",
                            "&:hover": {
                              backgroundColor: "#ffffff",
                              color: colors.primary[600],
                            },
                          }}
                          // component={Link}
                          // to={`/mainpage/logs`}
                          disabled={!(trace.statusCode >= 400 && trace.statusCode <= 600)}
                          variant="contained"
                          onClick={() => handleOpenErrors(trace.traceId, index)}
                        >
                          <Typography variant="h8">View Errors</Typography>
                        </Button>
                        <div style={{ display: "flex", justifyContent: "flex-end" }} >
                          {trace.traceId === activeTraceId ? (
                            activeTraceIcon ? (
                              <FaRegHandPointRight
                                style={{
                                  fontSize: "15px",
                                  color: "#A92014",
                                  // color:trace.statusCode >= 400 && trace.statusCode <= 500
                                  // ? colors.redAccent[500]
                                  // : theme.palette.mode==="dark"?"#FFF":"#00888C",
                                  // color: "#606060",
                                }}
                              />
                            ) : null
                          ) : null}
                        </div>
                      </div>


                      <Typography
                        variant="h7"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          margin: "15px 0 0 0 ",
                        }}
                      >
                        <span style={{ width: "150px" }}>
                          Age : {trace.createdTimeInWords}
                        </span>

                        <span style={{
                          width: "200px", color:
                            trace.statusCode >= 400 &&
                              trace.statusCode <= 500
                              ? colors.redAccent[500]
                              : colors.primary[100],
                        }}>
                          {" "}
                          <span
                            style={{
                              fontWeight: "500",
                              margin: "0 5px 0 0",

                            }}
                          >
                            StatusCode:
                          </span>
                          {/* <Typography
                            sx={{
                              color:
                                trace.statusCode >= 400 &&
                                trace.statusCode <= 500
                                  ? colors.redAccent[500]
                                  : "#000",
                            }}
                          >
                            {trace.statusCode}
                          </Typography> */}
                          {trace.statusCode}
                        </span>
                        <span style={{ width: "100px" }}>
                          {" "}
                          <span
                            style={{ fontWeight: "500", margin: "0 2px 0 0" }}
                          >
                            Method:
                          </span>
                          {trace.methodName}
                        </span>
                      </Typography>
                    </CardContent>
                  </div>

                  {/* </CardActionArea> */}
                </Card>
              ))}
            </Box>
          </div>
        </div>
      )}
    </div>
  );
};

export default TraceList;
