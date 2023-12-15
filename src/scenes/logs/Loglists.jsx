import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Pagination,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  styled,
  useTheme,
  Select,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import "./Loglists.css";
import React, { useContext, useState } from "react";
import { FindByTraceIdForSpans } from "../../api/TraceApiService";
import { format, formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../global/globalContext/GlobalContext";
import { useCallback } from "react";
import {
  GetAllLogBySortsWithDate,
  LogFilterOption,
  LogFilterOptionWithDate,
  getAllLogBySorts,
  getAllLogBySortsWithDate,
  searchLogsWithDate,
} from "../../api/LogApiService";
import { useEffect } from "react";
import { SearchOutlined } from "@mui/icons-material";
import { tokens } from "../../theme";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Loading from "../../global/Loading/Loading";
import { searchLogs } from "../../api/LogApiService";
import PaginationItem from "@mui/material/PaginationItem";
import CloseIcon from "@mui/icons-material/Close";
import { debounce,cancel } from 'lodash';

import "./Loglists.css";
import th from "date-fns/locale/th";

const tableHeaderData = [
  {
    id: "severity",
    label: "Severity",
  },
  {
    id: "time",
    label: "Time",
  },
  {
    id: "traceid",
    label: "Trace ID",
  },
  {
    id: "serviceName",
    label: "Service Name",
  },
  {
    id: "message",
    label: "Message",
  },
  {
    id: "action",
    label: "Action",
  },
];

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
];

const Loglists = () => {
  const [selectedOption, setSelectedOption] = useState("error");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [selectedLogData, setSelectedLogData] = useState([]);
  const [logData, setLogData] = useState([]);
  const [loading, setLoading] = useState(false);
  const pageLimit = 10;
  const {
    setLogTrace,
    setSelected,
    setTraceGlobalEmpty,
    setTraceGlobalError,
    lookBackVal,
    globalLogData,
    logFilterApiBody,
    needLogFilterCall,
    logSummaryService,
    logRender,
    setTraceRender,
    isCollapsed,
    setIsCollapsed,
    isCardVisible,
    setIsCardVisible,
    setMetricRender,
    setLogRender,
    setTraceSummaryService,
    setClearLogFilter,
    selectedStartDate,
    selectedEndDate,
    needHistoricalData,
    setNavActiveTab,
    setNeedFilterCall,
    setTraceDisplayService,
    setClearTraceFilter,
    setApmActiveTab
  } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);
  const [noMatchMessage, setNoMatchMessage] = useState("");
  const [filterMessage, setFilterMessage] = useState("");
  const [getAllMessage, setGetAllMessage] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const isSize1280 = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isLandscape = useMediaQuery("(orientation: landscape)");

  const isiphone = useMediaQuery((theme) => theme.breakpoints.down("iphone"));

  const isWidth430 = useMediaQuery("(min-width: 400px) and (max-width: 431px)");

  const isWidth400 = useMediaQuery("(min-width: 370px) and (max-width: 395px)");

  const handlecardclose = () => {
    setIsCardVisible(false);
    setSelectedRowIndex(null);
  };

  const handleViewButtonClick = (
    severity,
    time,
    traceid,
    serviceName,
    message,
    index
  ) => {
    setSelectedRowIndex(index);
    // Toggle the right drawer's open state
    setIsRightDrawerOpen(true);
    const selectedLogDataObj = {
      SeverityText: severity,
      CreatedTime: time,
      Traceid: traceid,
      ServiceName: serviceName,
      Message: message,
    };
    setSelectedLogData([selectedLogDataObj]);
    // setIsCollapsed(true);
    setIsCardVisible(true);
    console.log(severity);
  };

  const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: colors.primary[400],
      color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(() => ({
    "&:nth-of-type(odd)": {
      // backgroundColor: colors.hoverColor[500],
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const createTimeInWords = (data) => {
    // Iterate through data and update createdTime
    const updatedData = data.map((item) => {
      const createdTime = new Date(item.createdTime); // Convert timestamp to Date object
      const timeAgo = formatDistanceToNow(createdTime, { addSuffix: true });
      const formattedTime = format(createdTime, "MMMM dd, yyyy HH:mm:ss a");
      return {
        ...item,
        createdTimeInWords: timeAgo,
        createdTimeInDate: formattedTime,
      };
    });
    return updatedData;
  };

  const handleLogToTrace = async (traceId) => {
    console.log("TraceId " + JSON.stringify(traceId));
    try {
      const correlatedTraceData = await FindByTraceIdForSpans(traceId);
      console.log("TraceData " + JSON.stringify(correlatedTraceData));
      if (correlatedTraceData.data.length !== 0) {
        const updatedData = createTimeInWords(correlatedTraceData.data);
        setTraceRender(true);
        setLogTrace(updatedData);
        localStorage.setItem("routeName", "Traces");
        setSelected("Traces");
        setApmActiveTab(0);
        navigate("/mainpage/apm");
        setClearTraceFilter(true);
        setNeedFilterCall(false);
        setTraceDisplayService([]);
        setNavActiveTab(1);
      } else {
        setTraceGlobalEmpty("No Trace Data for this TraceId from Log!");
      }
    } catch (error) {
      console.log("error " + error);
      setTraceGlobalError("An error occured on log to trace correlation");
    }
  };

  const handleNoTrace = () => {
    alert("No TraceId for this Log!");
  };

  function createData(severity, time, traceid, serviceName, message, index) {
    traceid = traceid === "" ? "No Trace ID" : traceid;

    // const actionButton = (
    //   <div>
    //     <Box sx={{ display: "flex", flexDirection: "row" }}>
    //       <Tooltip>
    //         <span>
    //           <Button
    //             sx={{
    //               m: "8px",
    //               backgroundColor: colors.primary[400],
    //               color: colors.textColor[500],
    //               "&:hover": {
    //                 backgroundColor: "#ffffff",
    //                 color: "black",
    //               },
    //             }}
    //             variant="contained"
    //             disabled={traceid === "No Trace ID"}
    //             onClick={() =>
    //               traceid !== "" ? handleLogToTrace(traceid) : handleNoTrace()
    //             }
    //           >
    //             Trace
    //           </Button>
    //         </span>
    //       </Tooltip>

    //       <Tooltip>
    //         <Button
    //           sx={{
    //             m: "8px",
    //             backgroundColor: colors.primary[400],
    //             color: colors.textColor[500],
    //             "&:hover": {
    //               backgroundColor: "#ffffff",
    //               color: "black",
    //             },
    //           }}
    //           variant="contained"
    //           onClick={() =>
    //             handleViewButtonClick(
    //               severity,
    //               time,
    //               traceid,
    //               serviceName,
    //               message
    //             )
    //           }
    //         >
    //           View
    //         </Button>
    //       </Tooltip>
    //     </Box>
    //   </div>
    // );

    const actionButton = (
      <div>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Tooltip>
            <Button
              sx={{
                m: "8px",
                backgroundColor: colors.primary[400],
                color: "#ffffff", // Set white text color for default state
                "&:hover": {
                  backgroundColor: "#ffffff",
                  color: "black",
                },
              }}
              variant="contained"
              disabled={traceid === "No Trace ID"}
              onClick={() =>
                traceid !== "" ? handleLogToTrace(traceid) : handleNoTrace()
              }
            >
              Trace
            </Button>
          </Tooltip>

          <Tooltip>
            <Button
              sx={{
                m: "8px",
                backgroundColor: colors.primary[400],
                color: "#ffffff", // Set white text color for default state
                "&:hover": {
                  backgroundColor: "#ffffff",
                  color: "black",
                },
              }}
              variant="contained"
              onClick={() =>
                handleViewButtonClick(
                  severity,
                  time,
                  traceid,
                  serviceName,
                  message,
                  index
                )
              }
            >
              View
            </Button>
          </Tooltip>
        </Box>
      </div>
    );

    return {
      severity,
      time,
      traceid,
      serviceName,
      message,
      action: actionButton,
    };
  }

  const mapLogData = (logData) => {
    // Initialize an empty array to store the extracted data
    const extractedData = [];

    // Loop through the sample data
    logData.forEach((data) => {
      // Extract the relevant information from logRecords
      data.scopeLogs.forEach((scopeLog) => {
        scopeLog.logRecords.forEach((logRecord) => {
          // Extract the desired fields
          const extractedInfo = {
            severityText: logRecord.severityText,
            createdTime: data.createdTimeInWords,
            traceId: data.traceId,
            serviceName: data.serviceName,
            bodyValue: logRecord.body.stringValue,
          };

          // Add the extracted information to the array
          extractedData.push(extractedInfo);
        });
      });
    });

    const finalData = [];

    extractedData.forEach((log, index) => {
      finalData.push(
        createData(
          log.severityText,
          log.createdTime,
          log.traceId,
          log.serviceName,
          log.bodyValue,
          index
        )
      );
    });

    return finalData;
  };

  const handleGetAllLogData = useCallback(
    async (newpage) => {
      setLoading(true);
      try {
        setLogData([]);
        let serviceListData = [];
        if (logSummaryService.length === 0) {
          serviceListData = JSON.parse(localStorage.getItem("serviceListData"));
        } else {
          serviceListData = logSummaryService;
        }
        const { data, totalCount } = await GetAllLogBySortsWithDate(
          selectedStartDate,
          selectedEndDate,
          lookBackVal.value,
          newpage,
          pageLimit,
          selectedOption,
          serviceListData
        );
        if (data.length !== 0) {
          console.log("DATA " + JSON.stringify(data));
          const updatedData = createTimeInWords(data);
          const finalOutput = mapLogData(updatedData);
          setLogData(finalOutput);
          setTotalPageCount(Math.ceil(totalCount / pageLimit));
        } else {
          setGetAllMessage("No Log Data found!");
        }
      } catch (error) {
        console.log("error " + error);
      }
      setLoading(false);
    },
    [
      selectedStartDate,
      selectedEndDate,
      lookBackVal,
      selectedOption,
      logSummaryService,
      needHistoricalData,
    ]
  );

  const logFilterApiCall = useCallback(async () => {
    // setLoading(true);
    console.log("Filter Body " + logFilterApiBody);
    try {
      console.log("Filter callback ");
      const { data, totalCount } = await LogFilterOptionWithDate(
        selectedStartDate,
        selectedEndDate,
        lookBackVal.value,
        selectedOption,
        currentPage,
        pageLimit,
        logFilterApiBody
      );
      if (data.length !== 0) {
        const updatedData = createTimeInWords(data);
        const finalOutput = mapLogData(updatedData);
        setLogData(finalOutput);
        console.log("finalOutput filter body", finalOutput);
        setTotalPageCount(Math.ceil(totalCount / pageLimit));
      } else {
        setFilterMessage("No Matched data for this filter!");
      }
    } catch (error) {
      console.log("ERROR from log " + error);
    } finally {
      setLoading(false);
    }
  }, [
    selectedStartDate,
    selectedEndDate,
    lookBackVal,
    selectedOption,
    setLogData,
    setTotalPageCount,
    pageLimit,
    currentPage,
    logFilterApiBody,
    needHistoricalData,
  ]);

  // const [searchQuery, setSearchQuery] = useState("");
  const { searchQuery, setSearchQuery } = useContext(GlobalContext);
  const [searchResults, setSearchResults] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);

  const handlePageChange = async (event, selectedPage) => {
    setCurrentPage(Number(selectedPage));
  };




  const handleSearch= async () => {
    setLoading(true);
    try {
      const { data, totalCount } = await searchLogsWithDate(
        searchQuery,
        selectedStartDate,
        selectedEndDate,
        lookBackVal.value,
        currentPage,
        pageLimit
      );
      // Process and set the search results
      console.log("datalength", data.length);
      if (data.length > 0) {
        const updatedData = createTimeInWords(data);
        const finalOutput = mapLogData(updatedData);
        setSearchResults(finalOutput);
        // setLogData(finalOutput)
        setTotalPageCount(Math.ceil(totalCount / pageLimit));
        // console.log("Search RESULTS" + JSON.stringify(data));
        console.log(" sEARCH API BODY", finalOutput);
      } else {
        setSearchResults([]);
        // setLogData([]);
        setNoMatchMessage("No result matched for this search");
      }
    } catch (error) {
      console.error("Error searching logs:", error);
    } finally {
      setLoading(false);
    }
  }



  const handleSearchChange = (event) => {
    const searchQuery = event.target.value;
    console.log("searchQuery", searchQuery);
    setLogRender(true);
    setSearchQuery(searchQuery);
    const inputValueLength = searchQuery.length;
    console.log(inputValueLength);
    if (inputValueLength === 0) {
      setSearchResults([]);
    }
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    } else {
    }
  };

  const createFilterData = () => {
    const filteredData = [];
    Object.entries(logFilterApiBody).map(([key, value], index) => {
      value.forEach((val, index) => {
        filteredData.push(val);
      });
    });
    console.log("Filtered Data " + filteredData);
    return filteredData;
  };

  useEffect(() => {
    setTraceSummaryService([]);
    setTraceRender(false);
    setMetricRender(false);
    // setTraceDisplayService([]);
    setNavActiveTab(2);
    console.log("Filtered Data useEffect" + filteredOptions);
    if (needLogFilterCall) {
      setFilteredOptions(createFilterData());
      console.log("From Filter");
      setSearchResults([]);
      setIsCardVisible(false);
      // setIsCollapsed(false);
      logFilterApiCall();
    } else if (globalLogData.length !== 0 && logRender) {
      setClearLogFilter(false);
      console.log("From Trace");
      setIsCardVisible(false);
      // setIsCollapsed(false);
      const updatedData = createTimeInWords(globalLogData);
      const finalOutput = mapLogData(updatedData);
      setLogData(finalOutput);
      // logFilterApiCall();
    } else if (searchQuery   !== "" && logRender) {
      setClearLogFilter(false);
      console.log("SEARCH WORD ---------------" + searchQuery);
      // setSearchResults([]);
      setIsCardVisible(false);
      // setIsCollapsed(false);
      // handleSearch()
    } else {
      setClearLogFilter(false);
      console.log("From get ALL");
      setIsCardVisible(false);
      console.log("SEARCH --------------- " + searchQuery);
      setSearchQuery("");
      setSearchResults([]);
      // setIsCollapsed(false);
      handleGetAllLogData(currentPage);
    }

    return () => {
      setFilterMessage("");
      setGetAllMessage("");
      setNoMatchMessage("");
    };
  }, [
    needLogFilterCall,
    logFilterApiCall,
    globalLogData,
    setTraceRender,
    handleGetAllLogData,
    logRender,
    // searchQuery,
    currentPage,
    setMetricRender,
    setTraceSummaryService,
    setNavActiveTab,
    // needHistoricalData,
  ]);

  // const handleSortOrderChange = (selectedValue) => {
  //   console.log("SORT " + selectedValue.value);
  //   setSelectedOption(selectedValue.value);
  // };

  const handleSortOrderChange = (event) => {
    setSelectedOption(event.target.value);
    setCurrentPage(1);
  };

  const tableBodyData = [
    createData(
      "Error",
      "2021-10-10 10:10:10",
      "6adf9876fg786548ghtrws899rb425435",
      "order-project",
      "No order found with id 123"
    ),
    createData(
      "Info",
      "2021-10-10 10:10:20",
      "6adf9876fg786548ghtrws900",
      "order-project",
      "No order found with id 123"
    ),
    createData(
      "Error",
      "2021-10-10 10:10:21",
      "6adf9876fg786548ghtrws901",
      "order-project",
      "No order found with id 123"
    ),
    createData(
      "Warn",
      "2021-10-10 10:10:24",
      "6adf9876fg786548ghtrws902",
      "order-project",
      "id is not used inside"
    ),
    createData(
      "Error",
      "2021-10-10 10:10:25",
      "6adf9876fg786548ghtrws903",
      "order-project",
      "No order found with id 123"
    ),
    createData(
      "Error",
      "2021-10-10 10:10:26",
      "6adf9876fg786548ghtrws904",
      "order-project",
      "No order found with id 123"
    ),
  ];

  // useEffect(() => {
  //   if (globalLogData.length !== 0 && !searchQuery) {
  //     const finalOutput = mapLogData(globalLogData);
  //     setLogData(finalOutput);
  //   } else if (needLogFilterCall) {
  //     logFilterApiCall(currentPage, logFilterApiBody);
  //   } else if (searchQuery) {
  //     setSearchResults([]); // Clear previous search results
  //     handleSearch();
  //   } else {
  //     handleGetAllLogData(currentPage);
  //   }
  // }, [currentPage, handleGetAllLogData, globalLogData, logFilterApiBody, logFilterApiCall, needLogFilterCall, searchQuery]);

  function highlightSearchQuery(message) {
    if (typeof searchQuery !== "string") {
      return message;
    }

    const parts = message.split(new RegExp(`(${searchQuery})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: "yellow" }}>
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={isCardVisible ? 9 : 12}>
          {" "}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: needLogFilterCall ? "flex-start" : "space-around",
              // backgroundColor: "yellow"
            }}
          >
            <TextField
              placeholder="Search for message"
              size="small"
              style={{ marginBottom: "5px", width: "80%", marginTop: "6px" }}
              InputProps={
                // {style: { fontsize: '1.8rem', height: 40 } }
                {
                  endAdornment: (
                    <IconButton
                      type="button"
                      sx={{ p: "10px" }}
                      aria-label="search"
                      onClick={handleSearch}
                    >
                      <SearchOutlined />
                    </IconButton>
                  ),
                }
              }
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
            />
            {/* {!needLogFilterCall ? ( */}

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                // backgroundColor: "limegreen",
                // marginBottom: "20px",
                // padding: "-20px",
                height: "57px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "25px",
                }}
              >
                <label
                  style={{
                    fontSize: "12px",
                    marginLeft: needLogFilterCall ? "50px" : "0px",
                  }}
                >
                  SortBy
                </label>
                {/* <Dropdown
                    options={sortOrderOptions}
                    placeholder="Sort Order"
                    arrowClosed={<span className="arrow-closed" />}
                    arrowOpen={<span className="arrow-open" />}
                    value={selectedOption}
                    onChange={handleSortOrderChange}
                    // style={{ marginTop: "5px"}}
                  /> */}
                <Select
                  value={selectedOption}
                  onChange={handleSortOrderChange}
                  size="small"
                  // displayEmpty
                  // inputProps={{ "aria-label": "Select Sort Order" }}
                  style={{
                    width: "150px",
                    marginLeft: needLogFilterCall ? "50px" : "0px",
                  }}
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
          {needLogFilterCall ? (
            <div style={{ marginBottom: "5px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                }}
              >
                <Typography variant="h6" fontWeight={"600"}>
                  Filtered By:
                </Typography>
                {filteredOptions.map((option, index) => (
                  <React.Fragment key={index}>
                    <Typography
                      style={{ marginLeft: "5px" }}
                      variant="h6"
                      fontWeight={"600"}
                    >
                      {option}
                    </Typography>
                    {index < filteredOptions.length - 1 && <span>, </span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : null}
          <Card
            elevation={6}
            sx={{
              padding: "20px",
              marginTop: "10px",
              height: isLandscape && isSize1280 ? "calc(90vh - 72px)" : "calc(73vh - 72px)",
              // height: isSize1280 ? "calc(90vh - 72px)" : "calc(73vh - 72px)",
              [theme.breakpoints.down('sm')]: {
                height: "calc(100vh - 85px)"
              },
              [theme.breakpoints.down('lg')]: {
                height: "calc(100vh - 85px)"
              },
              // ...(isiphone && {
              //   height: "calc(100vh - 72px)",
              // }),
              // ...(isSmallScreen && {
              //   height: "calc(90vh - 72px)",
              // })
              // [theme.breakpoints.down('iphoneSE')]: {
              //   height: "calc(120vh - 85px)"
              // },
              // ...isWidth430 && {
              //   height: "calc(100vh - 85px)"
              // },
              // ...isWidth400 && {
              //   height: "calc(110vh - 85px)"
              // },
              [theme.breakpoints.only('iphoneXR')]: {
                height: "calc(102vh - 85px)"
              },
              [theme.breakpoints.only('surfDuo')]: {
                height: "calc(110vh - 85px)"
              },
              [theme.breakpoints.only('isipadpro')]: {
                height: "calc(67vh - 85px)"
              },
              [theme.breakpoints.only('issurfacepro')]: {
                height: "calc(68vh - 85px)"
              },
              [theme.breakpoints.only('ipadAir')]: {
                height: "calc(77vh - 85px)"
              }
            }}
          >
            <div>
              {loading ? (
                <Loading />
              ) : noMatchMessage ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    // height: "80vh",
                  }}
                >
                  <Typography variant="h5" fontWeight={"600"}>
                    {noMatchMessage}
                  </Typography>
                </div>
              ) : filterMessage ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    // height: "80vh",
                  }}
                >
                  <Typography variant="h5" fontWeight={"600"}>
                    {filterMessage}
                  </Typography>
                </div>
              ) : getAllMessage ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    // height: "80vh",
                  }}
                >
                  <Typography variant="h5" fontWeight={"600"}>
                    {getAllMessage}
                  </Typography>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {" "}
                  <TableContainer
                    sx={{
                      maxHeight: isSize1280
                        ? "calc(86vh - 85px)"
                        : "calc(66vh - 85px)",
                      [theme.breakpoints.down("sm")]: {
                        maxHeight: "calc(100vh - 85px)",
                      },
                      [theme.breakpoints.down("iphoneSE")]: {
                        // height: "calc(120vh - 85px)"
                        maxHeight: "calc(110vh - 85px)",
                      },
                      // [theme.breakpoints.only('iphoneSE')]: {
                      //   // height: "calc(120vh - 85px)"
                      //   maxHeight: "calc(110vh - 85px)"
                      // },
                      overflowY: "auto",
                    }}
                  >
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow style={{ height: "20px" }}>
                          {tableHeaderData.map((column, index) => (
                            <TableCell
                              key={index}
                              align={column.align}
                              style={{
                                backgroundColor: colors.primary[400],
                                color: colors.tabColor[500],
                              }}
                            >
                              <Typography
                                variant="h5"
                                style={{
                                  width: "130px",
                                  fontWeight: "800",
                                  padding: "5px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {column.label}
                              </Typography>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {searchResults.length > 0
                          ? searchResults.map((row, index) => (
                              <StyledTableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={index}
                                // className={index === selectedRowIndex ? "selected-row" : ""}
                                className={
                                  index === selectedRowIndex &&
                                  theme.palette.mode === "light"
                                    ? "selected-row-light"
                                    : index === selectedRowIndex &&
                                      theme.palette.mode === "dark"
                                    ? "selected-row-dark"
                                    : ""
                                }
                              >
                                {tableHeaderData.map((column, index) => {
                                  const value = row[column.id];
                                  if (column.id === "action") {
                                    return (
                                      <TableCell
                                        key={index}
                                        align={column.align}
                                        style={{
                                          padding: "10px",
                                          color:
                                            column.id === "severity" &&
                                            (row.severity === "SEVERE" ||
                                              row.severity === "ERROR")
                                              ? "red"
                                              : "inherit",
                                        }}
                                      >
                                        <Typography
                                          variant="h6"
                                          style={{
                                            width: "150px",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                          }}
                                        >
                                          {value}
                                        </Typography>
                                      </TableCell>
                                    );
                                  } else if (column.id === "message") {
                                    return (
                                      <TableCell
                                        key={index}
                                        align={column.align}
                                        style={{
                                          padding: "10px",
                                          color:
                                            column.id === "severity" &&
                                            (row.severity === "SEVERE" ||
                                              row.severity === "ERROR")
                                              ? "red"
                                              : "inherit",
                                        }}
                                      >
                                        <Typography
                                          variant="h6"
                                          style={{
                                            width: "150px",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                          }}
                                        >
                                          {highlightSearchQuery(
                                            value,
                                            searchQuery
                                          )}
                                        </Typography>
                                      </TableCell>
                                    );
                                  } else {
                                    return (
                                      <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{
                                          padding: "10px",
                                          color:
                                            column.id === "severity" &&
                                            (row.severity === "SEVERE" ||
                                              row.severity === "ERROR")
                                              ? "red"
                                              : "inherit",
                                        }}
                                      >
                                        <Typography
                                          variant="h6"
                                          style={{
                                            width: "150px",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                          }}
                                        >
                                          {value}
                                        </Typography>
                                      </TableCell>
                                    );
                                  }
                                })}
                              </StyledTableRow>
                            ))
                          : logData.map((row, index) => (
                              <StyledTableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={index}
                                // className={index === selectedRowIndex ? "selected-row" : ""}
                                className={
                                  index === selectedRowIndex &&
                                  theme.palette.mode === "light"
                                    ? "selected-row-light"
                                    : index === selectedRowIndex &&
                                      theme.palette.mode === "dark"
                                    ? "selected-row-dark"
                                    : ""
                                }
                              >
                                {tableHeaderData.map((column, index) => {
                                  const value = row[column.id];
                                  if (column.id === "action") {
                                    return (
                                      <TableCell
                                        key={index}
                                        align={column.align}
                                        style={{
                                          padding: "10px",
                                          color:
                                            column.id === "severity" &&
                                            (row.severity === "SEVERE" ||
                                              row.severity === "ERROR")
                                              ? "red"
                                              : "inherit",
                                        }}
                                      >
                                        <Typography
                                          variant="h6"
                                          style={{
                                            width: "180px",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                          }}
                                        >
                                          {value}
                                        </Typography>
                                      </TableCell>
                                    );
                                  } else {
                                    return (
                                      <TableCell
                                        key={index}
                                        align={column.align}
                                        style={{
                                          padding: "10px",
                                          color:
                                            column.id === "severity" &&
                                            (row.severity === "SEVERE" ||
                                              row.severity === "ERROR")
                                              ? "red"
                                              : "inherit",
                                        }}
                                      >
                                        <Typography
                                          variant="h6"
                                          style={{
                                            width: "150px",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                          }}
                                        >
                                          {value}
                                        </Typography>
                                      </TableCell>
                                    );
                                  }
                                })}
                              </StyledTableRow>
                            ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Stack
                    spacing={2}
                    direction="row"
                    justifyContent="center"
                    style={{ marginTop: "10px" }}
                  >
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
                                : //jey : colors.blueAccent[400],
                                  colors.primary[400],
                            color:
                              // item.type === "page" && item.page === currentPage
                              //   ? "#FFF"
                              //   : null,
                              item.type === "page"
                                ? item.page === currentPage
                                  ? "#FFF" // Set the color for the current page number
                                  : colors.primary[100] // Set the color for other page numbers
                                : "#FFF",
                          }}
                        />
                      )}
                    />
                  </Stack>
                </div>
              )}
            </div>
          </Card>
        </Grid>
        {isCardVisible && (
          <Grid item xs={3}>
            {" "}
            <Card
              sx={{
                // height: isSize1280 ? "90vh" : "79.5vh",
                height: isLandscape ? "79.5vh" : "90vh",
                [theme.breakpoints.down("sm")]: {
                  height: "90vh",
                },
                paddingBottom: "30px",
                overflowY: "auto",
              }}
            >
              <CardContent>
                {" "}
                <div style={{ display: "flex", padding: "15px" }}>
                  <Typography variant="h5">Log Metadata</Typography>
                  <IconButton
                    aria-label="close"
                    onClick={handlecardclose}
                    style={{
                      bottom: isSize1280 ? 10 : 10,
                      left: isSize1280 ? 70 : 100,
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
                <div style={{ paddingBottom: "30px" }}>
                  {selectedLogData && selectedLogData[0] ? (
                    <TableContainer component={Paper}>
                      <Table
                        sx={{ minHeight: "50vh", overflowX: "hidden" }}
                        aria-label="customized table"
                      >
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>
                              {" "}
                              <Typography
                                variant="h5"
                                style={{
                                  fontWeight: "700",
                                  padding: "5px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  color: "#fff",
                                }}
                              >
                                Field
                              </Typography>
                            </StyledTableCell>

                            <StyledTableCell>
                              <Typography
                                variant="h5"
                                style={{
                                  fontWeight: "700",
                                  padding: "5px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  color: "#fff",
                                }}
                              >
                                Value
                              </Typography>
                            </StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(selectedLogData[0]).map(
                            ([key, value], index) => (
                              <StyledTableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={index}
                                // className={index === selectedRowIndex ? "selected-row" : ""}
                              >
                                <StyledTableCell style={{ minWidth: "10px" }}>
                                  {key}
                                </StyledTableCell>
                                <StyledTableCell style={{ minWidth: "10px" }}>
                                  {value}
                                </StyledTableCell>
                              </StyledTableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="h5" fontWeight={"600"}>
                      No log metadata available.
                    </Typography>
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default Loglists;
