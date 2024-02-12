import React, { useCallback, useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FilterDialog from "./FilterDialog";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import {
  Box,
  Drawer,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "./DashboardTopBar.css";
import {
  FilterListOutlined,
  Height,
  RefreshOutlined,
} from "@mui/icons-material";
import { GlobalContext } from "../../global/globalContext/GlobalContext";
import { options } from "../../global/MockData/MockTraces";
import Logfilter from "../logs/Logfilter";
import Metricfilter from "../metrics/Metricfilter";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import DashboardTab from "./DashboardTab";
import SustainabilityTabs from "./SustainabilityTabs";
import ApmTabs from "./ApmTabs";

const DashboardTopBar = () => {
  const navigate = useNavigate();
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);

  // const {
  //   lookBackVal,
  //   setLookBackVal,
  //   setNeedFilterCall,
  //   setTraceGlobalError,
  //   setTraceGlobalEmpty,
  //   setTraceData,
  //   setSelectedTrace,
  //   setRecentTrace,
  //   activeTab,
  //   setActiveTab,
  //   setGlobalLogData,
  //   setNeedLogFilterCall,
  //   setRecentLogData,
  // } = useContext(GlobalContext);
  const [refresh, setRefresh] = useState(false);
  const {
    lookBackVal,
    setLookBackVal,
    setNeedFilterCall,
    setTraceGlobalError,
    setTraceGlobalEmpty,
    setTraceData,
    setSelectedTrace,
    setRecentTrace,
    activeTab,
    setActiveTab,
    setGlobalLogData,
    setNeedLogFilterCall,
    setRecentLogData,
    setSearchQuery,
    setLogTrace,
    setTraceRender,
    setLogRender,
    setMetricRender,
    setTraceSummaryService,
    setLogSummaryService,
    setFilterApiBody,
    setClearTraceFilter,
    setLogFilterApiBody,
    setClearLogFilter,
    selectedStartDate,
    setSelectedStartDate,
    selectedEndDate,
    setSelectedEndDate,
    setNeedHistoricalData,
    selectedService,
    selectedLogService,
    traceDisplayService,
    setTraceDisplayService,
    setSelectedLogService,
    setShowError,
    navActiveTab,
    setNavActiveTab,
    setMinMaxError,
    openDrawer,
    setOpenDrawer,
    keplerActiveTab,
    setKeplerActiveTab,
    apmActiveTab,
    setApmActiveTab,
    InfraActiveTab,
    setInfraActiveTab,
    InfraPodActiveTab,
    setInfraPodActiveTab,
    InfraNodeActiveTab,
    setInfraNodeActiveTab,
  } = useContext(GlobalContext);

  const [logFilterDialogOpen, setLogFilterDialogOpen] = useState(false);
  const [metricFilterDialogOpen, setmetricFilterDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [previousStartDate, setPreviousStartDate] = useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isLandscape = useMediaQuery(
    "(max-width: 1000px) and (orientation: landscape)"
  );

  const isiphone = useMediaQuery((theme) => theme.breakpoints.down("iphone"));
  const isipadpro = useMediaQuery((theme) =>
    theme.breakpoints.only("isipadpro")
  );

  const largem = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  // const [dashboardMenuAnchor, setDashboardMenuAnchor] = useState(null);

  const FilterbuttonStyle = {
    backgroundColor: theme.palette.mode === "light" ? "#339999" : "#A9A9A9",
  };

  const RefreshiconStyle = { fontSize: "20px", color: colors.tabColor[500] };

  // const handleDashboardTabClick = (event) => {
  //   setDashboardMenuAnchor(event.currentTarget);
  // };

  const iconStyle = {
    fontSize: "20px",
    color:
      window.location.pathname === "/mainpage/apm" ||
      window.location.pathname === "/mainpage/apm/metrics" ||
      window.location.pathname === "/mainpage/apm/logs"
        ? colors.tabColor[500]
        : "#666663",
  };

  useEffect(() => {
    // console.log("dashboard usefeecet called--->");
    // setInfraActiveTab(0);
    // setInfraNodeActiveTab(0);
    const currentDate = new Date();
    if (endDate !== null || previousStartDate) {
      console.log("HISTORY FROM USEEFFECT");
      setNeedHistoricalData(true);
      localStorage.setItem("needHistoricalData", true);
    } else {
      setNeedHistoricalData(false);
      localStorage.setItem("needHistoricalData", false);
    }
    setTraceGlobalEmpty(null);
    setTraceGlobalError(null);
  }, [endDate, setNeedHistoricalData, previousStartDate]);

  const EmptyformattedDate = format(new Date(), "yyyy-MM-dd");

  const handleRefreshClick = () => {
    const defaultValue = 120;
    const defaultLabel = options.find(
      (option) => option.value === defaultValue
    );
    setLookBackVal(defaultLabel);
    setRecentTrace([]);
    setTraceData([]);
    setSelectedTrace([]);
    setNeedFilterCall(false);
    setNeedLogFilterCall(false);
    setTraceGlobalEmpty(null);
    setTraceGlobalError(null);
    setGlobalLogData([]);
    setFilterApiBody({});
    setLogFilterApiBody({});
    setRecentLogData([]);
    setRefresh(true);
    setSearchQuery("");
    setLogTrace([]);
    setTraceRender(false);
    setLogRender(false);
    setMetricRender(false);
    setClearTraceFilter(true);
    setClearLogFilter(true);
    setTraceSummaryService([]);
    setLogSummaryService([]);
    setSelectedStartDate(EmptyformattedDate);
    setSelectedEndDate(EmptyformattedDate);
    setStartDate(new Date());
    setEndDate(null);
    setNeedHistoricalData(false);
    localStorage.setItem("needHistoricalData", false);
    setPreviousStartDate(false);
    setTraceDisplayService([]);
    setSelectedLogService([]);
    setShowError(false);
    setMinMaxError("");
  };

  const handleTabChange = (event, newValue) => {
    if (newValue === 0) {
      navigate("/mainpage/dashboard");
    } else if (newValue === 1) {
      navigate("/mainpage/dashboard/logSummary");
    } else if (newValue === 2) {
      navigate("/mainpage/dashboard/dbSummary");
    } else if (newValue === 3) {
      navigate("/mainpage/dashboard/kafkaSummary");
    }
    setActiveTab(newValue);
  };

  const handleInfraTabChange = (event, newValue) => {
    if (newValue === 0) {
      navigate("/mainpage/infraNode");
    } else if (newValue === 1) {
      navigate("/mainpage/infraPod");
    }
    setInfraActiveTab(newValue);
  };

  const handlePodTabChange = (event, newValue) => {
    if (newValue === 0) {
      navigate("/mainpage/infraPod");
    } else if (newValue === 1) {
      navigate("/mainpage/infraPod/podMemory");
    }
    setInfraPodActiveTab(newValue);
  };

  const handleNodeTabChange = (event, newValue) => {
    if (newValue === 0) {
      navigate("/mainpage/infraNode");
    } else if (newValue === 1) {
      navigate("/mainpage/infraNode/nodeMemory");
    }
    setInfraNodeActiveTab(newValue);
  };

  const handleDashboardOptionSelect = (option) => {
    console.log("Selected option:", option);
    if (option === "Trace Summary") {
      navigate("/mainpage/dashboard");
    } else if (option === "Log Summary") {
      navigate("/mainpage/dashboard/logSummary");
    } else if (option === "Db Summary") {
      navigate("/mainpage/dashboard/dbSummary");
    } else if (option === "Kafka Summary") {
      navigate("/mainpage/dashboard/kafkaSummary");
    } else if (option === "Pod Metrics") {
      navigate("/mainpage/sustainability");
    } else if (option === "Node Metrics") {
      navigate("/mainpage/sustainability/node");
    } else if (option === "Trace") {
      navigate("/mainpage/apm");
    } else if (option === "Metrics") {
      navigate("/mainpage/apm/metrics");
    } else if (option === "Logs") {
      navigate("/mainpage/apm/logs");
    }
  };

  const handleKeplerTabs = (event, newValue) => {
    if (newValue === 0) {
      navigate("/mainpage/sustainability");
    } else if (newValue === 1) {
      navigate("/mainpage/sustainability/node");
    } else if (newValue === 2) {
      navigate("/mainpage/sustainability/host");
    }
    setKeplerActiveTab(newValue);
  };

  const handleApmTabs = (event, newValue) => {
    if (newValue === 0) {
      navigate("/mainpage/apm");
    } else if (newValue === 1) {
      navigate("/mainpage/apm/metrics");
    } else if (newValue === 2) {
      navigate("/mainpage/apm/logs");
    }
    setApmActiveTab(newValue);
  };

  const handleTabChangePages = (event, newValue) => {
    if (newValue === 0) {
      navigate("/mainpage/dashboard");
    } else if (newValue === 1) {
      navigate("/mainpage/apm");
      setApmActiveTab(0);
    }
    setNavActiveTab(newValue);
  };

  const handleFilterClick = () => {
    // setFilterDialogOpen(true);
    if (window.location.pathname === "/mainpage/apm/logs") {
      setLogFilterDialogOpen(true);
    } else if (window.location.pathname === "/mainpage/apm") {
      setFilterDialogOpen(true);
    } else if (window.location.pathname === "/mainpage/apm/metrics") {
      setmetricFilterDialogOpen(true);
    }
  };

  const handleFilterDialogClose = () => {
    // setFilterDialogOpen(false);
    if (window.location.pathname === "/mainpage/apm/logs") {
      setLogFilterDialogOpen(false);
    } else if (window.location.pathname === "/mainpage/apm") {
      setFilterDialogOpen(false);
    } else if (window.location.pathname === "/mainpage/apm/metrics") {
      setmetricFilterDialogOpen(false);
    }
  };

  const handleLookbackChange = (event) => {
    console.log("VAL " + JSON.stringify(event.target.value));
    setLookBackVal(event.target.value);
    setMetricRender(false);
    setGlobalLogData([]);
    setLogRender(false);
    setLogTrace([]);
    setTraceGlobalEmpty(null);
    setTraceGlobalError(null);
  };

  const endDateClear = () => {
    console.log("On Clear");
    setEndDate(null);
    setNeedHistoricalData(false);
    // const currentDate = new Date(); // Get the current date
    // const currentDateFormatted = format(currentDate, "yyyy-MM-dd");

    // if (selectedStartDate !== currentDateFormatted) {
    //   // If startDate is not today, set endDate to today's date
    //   setSelectedStartDate(currentDateFormatted);
    //   setStartDate(currentDate);
    // }

    localStorage.setItem("needHistoricalData", false);
    if (previousStartDate) {
      setSelectedEndDate(selectedStartDate);
    } else {
      setSelectedEndDate(EmptyformattedDate);
    }
  };

  const startDateClear = () => {
    setStartDate(null);
  };

  const handleStartDateChange = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    console.log("Formatted Date " + formattedDate);
    setMetricRender(false);
    setSelectedStartDate(formattedDate);
    setGlobalLogData([]);
    setLogRender(false);
    setLogTrace([]);
    setTraceGlobalEmpty(null);
    setTraceGlobalError(null);

    const currentDate = new Date();
    const currentDateFormatted = format(currentDate, "yyyy-MM-dd");

    if (formattedDate !== currentDateFormatted && endDate === null) {
      setSelectedEndDate(formattedDate);
      setPreviousStartDate(true);
      // setEndDate(null);
    } else if (endDate === null) {
      setSelectedEndDate(EmptyformattedDate);
      setPreviousStartDate(false);
      setEndDate(null);
    }

    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    if (date !== null) {
      const formattedDate = format(date, "yyyy-MM-dd");
      console.log("Formatted Date " + formattedDate);
      setMetricRender(false);
      setGlobalLogData([]);
      setLogTrace([]);
      setLogRender(false);
      setTraceGlobalEmpty(null);
      setTraceGlobalError(null);
      setSelectedEndDate(formattedDate);
      setEndDate(date);
    }
  };

  // { window.location.pathname === "/mainpage/traces" ||
  // window.location.pathname === "/mainpage/metrics" ||
  // window.location.pathname === "/mainpage/logs" ?toggleDrawer:null}

  const toggleDrawer = () => {
    // enabling();
    setOpenDrawer(!openDrawer);
  };

  const appBarStyles = {
    height: "70px",
  };
  return (
    <>
      <AppBar
        position="static"
        elevation={3}
        style={{ backgroundColor: colors.primary[400] }}
      >
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {isSmallScreen ? (
            <div>
              {window.location.pathname === "/mainpage/dashboard" ||
              window.location.pathname === "/mainpage/sustainability" ||
              window.location.pathname === "/mainpage/sustainability/node" ||
              window.location.pathname === "/mainpage/sustainability/host" ||
              window.location.pathname === "/mainpage/apm" ||
              window.location.pathname === "/mainpage/apm/metrics" ||
              window.location.pathname === "/mainpage/apm/logs" ||
              window.location.pathname === "/mainpage/dashboard/logSummary" ||
              window.location.pathname === "/mainpage/dashboard/dbSummary" ||
              window.location.pathname ===
                "/mainpage/dashboard/kafkaSummary" ? (
                <Tabs
                  value={navActiveTab}
                  onChange={handleTabChangePages}
                  TabIndicatorProps={{
                    sx: {
                      borderRadius: 3,
                    },
                  }}
                  textColor="inherit"
                  indicatorColor="primary"
                >
                  <Tab
                    label={
                      <DashboardTab
                        onDashboardOptionSelect={handleDashboardOptionSelect}
                      />
                    }
                    sx={{ color: "#FFF" }}
                  />
                  <Tab
                    label={
                      <SustainabilityTabs
                        onDashboardOptionSelect={handleDashboardOptionSelect}
                      />
                    }
                    sx={{ color: "#FFF" }}
                  />

                  <Tab
                    label={
                      <ApmTabs
                        onDashboardOptionSelect={handleDashboardOptionSelect}
                      />
                    }
                    sx={{ color: "#FFF" }}
                  />
                </Tabs>
              ) : null}
            </div>
          ) : (
            // <div>
            //   {window.location.pathname === "/mainpage/dashboard" ||
            //   window.location.pathname === "/mainpage/apm" ||
            //   window.location.pathname === "/mainpage/sustainability" ||
            //   window.location.pathname === "/mainpage/sustainability/node" ||
            //   window.location.pathname === "/mainpage/sustainability/host" ||
            //   window.location.pathname === "/mainpage/apm" ||
            //   window.location.pathname === "/mainpage/apm/metrics" ||
            //   window.location.pathname === "/mainpage/apm/logs" ||
            //   window.location.pathname === "/mainpage/dashboard/logSummary" ||
            //   window.location.pathname === "/mainpage/dashboard/dbSummary" ||
            //   window.location.pathname ===
            //     "/mainpage/dashboard/kafkaSummary" ? (
            //     <Tabs
            //       value={navActiveTab}
            //       onChange={handleTabChangePages}
            //       TabIndicatorProps={{
            //         sx: {
            //           borderRadius: 3,
            //         },
            //       }}
            //       textColor="inherit"
            //       indicatorColor="primary"
            //     >
            //       <Tab label="Observability" sx={{ color: "#FFF" }} />
            //       <Tab label="Sustainability" sx={{ color: "#FFF" }} />

            //       <Tab label="APM" sx={{ color: "#FFF" }} />
            //     </Tabs>
            //   ) : null}
            // </div>
            <div>
              {window.location.pathname === "/mainpage/dashboard" ||
              window.location.pathname === "/mainpage/apm" ||
              window.location.pathname === "/mainpage/apm/metrics" ||
              window.location.pathname === "/mainpage/apm/logs" ||
              window.location.pathname === "/mainpage/dashboard/logSummary" ||
              window.location.pathname === "/mainpage/dashboard/dbSummary" ||
              window.location.pathname ===
                "/mainpage/dashboard/kafkaSummary" ? (
                <Tabs
                  value={navActiveTab}
                  onChange={handleTabChangePages}
                  TabIndicatorProps={{
                    sx: {
                      borderRadius: 3,
                    },
                  }}
                  textColor="inherit"
                  indicatorColor="primary"
                >
                  <Tab label="APM Dashboard" sx={{ color: "#FFF" }} />

                  <Tab label="APM Telemetry Data" sx={{ color: "#FFF" }} />
                </Tabs>
              ) : (
                <div>
                  {window.location.pathname === "/mainpage/sustainability" ||
                  window.location.pathname ===
                    "/mainpage/sustainability/node" ||
                  window.location.pathname ===
                    "/mainpage/sustainability/host" ? (
                    <Tabs
                      value={0}
                      // onChange={handleTabChangePages}
                      TabIndicatorProps={{
                        sx: {
                          borderRadius: 3,
                        },
                      }}
                      textColor="inherit"
                      indicatorColor="primary"
                    >
                      <Tab label="Sustainability" sx={{ color: "#FFF" }} />
                    </Tabs>
                  ) : (
                    <div>
                      {
                      window.location.pathname === "/mainpage/infraPod" ||
                      window.location.pathname ===
                        "/mainpage/infraPod/podMemory" ||
                      window.location.pathname === "/mainpage/infraNode" ||
                      window.location.pathname ===
                        "/mainpage/infraNode/nodeMemory" ? (
                        <Tabs
                          value={InfraActiveTab}
                          onChange={handleInfraTabChange}
                          TabIndicatorProps={{
                            sx: {
                              borderRadius: 3,
                            },
                          }}
                          textColor="inherit"
                          indicatorColor="primary"
                        >
                          <Tab
                            label="Infra Node Details"
                            sx={{ color: "#FFF" }}
                          />
                          <Tab
                            label="Infra Pod Details"
                            sx={{ color: "#FFF" }}
                          />
                        </Tabs>
                      ) : null}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                alignItems: "center",
                marginBottom: "10px",
                marginRight: "10px",
              }}
            >
              <label
                style={{
                  fontSize: "10px",
                  marginBottom: "5px",
                  color: colors.tabColor[500],
                }}
              >
                Start Date
              </label>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <DatePicker
                    value={startDate}
                    onChange={handleStartDateChange}
                    slotProps={{
                      textField: { variant: "standard" },
                    }}
                    maxDate={endDate}
                    disableFuture
                    sx={{
                      width: isipadpro ? 130 : 153,
                      marginRight: 2,
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#848482" : "#FFF",

                      "& .MuiInput-underline:before": {
                        borderBottom: "none", // Remove the default underline
                      },

                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottom: "none",
                      },

                      padding: "7px",
                      "& .MuiInputBase-input": {
                        padding: 0,
                        "&:hover": {
                          border: "none", // Remove hover border effect
                        },
                      },
                      "& .MuiInputBase-root": {
                        "&:hover": {
                          border: "none", // Remove hover border effect
                        },
                      },
                      "& .MuiSvgIcon-root": {
                        fontSize: 18, // Adjust the font size of the clearable icon
                      },
                    }}
                  />
                </Box>
              </LocalizationProvider>
            </div>
            <div
              style={{
                alignItems: "center",
                marginBottom: "10px",
                marginRight: "10px",
              }}
            >
              <label
                style={{
                  fontSize: "10px",
                  marginBottom: "5px",
                  color: colors.tabColor[500],
                }}
              >
                End Date
              </label>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <DatePicker
                    value={endDate}
                    minDate={startDate}
                    maxDate={new Date()}
                    onChange={handleEndDateChange}
                    slotProps={{
                      textField: { variant: "standard" },
                      field: { clearable: true, onClear: () => endDateClear() },
                    }}
                    disableFuture
                    className="customDatePicker"
                    sx={{
                      boxShadow: 0,
                      marginRight: 2,
                      width: isipadpro ? 130 : 150,
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#848482" : "#FFF",

                      "& .MuiInput-underline:before": {
                        borderBottom: "none",
                      },

                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottom: "none",
                      },

                      padding: "7px",
                      "& .MuiInputBase-input": {
                        padding: 0,

                        "&:hover": {
                          border: "none", // Remove hover border effect
                        },
                      },
                      "& .MuiSvgIcon-root": {
                        fontSize: 18, // Adjust the font size of the clearable icon
                      },
                    }}
                  />
                </Box>
              </LocalizationProvider>
            </div>

            {/* {endDate === null ? ( */}
            <div
              style={{
                alignItems: "center",
                marginBottom: "20px",
                marginTop: "11px",
              }}
            >
              <label
                style={{
                  fontSize: "10px",

                  color: colors.tabColor[500],
                }}
              >
                TimeBy
              </label>
              {/* <Dropdown
                        options={options}
                        placeholder="Lookback for"
                        value={lookBackVal.label}
                        onChange={(val) => handleLookbackChange(val)}
                        arrowClosed={<span className="arrow-closed" />}
                        arrowOpen={<span className="arrow-open" />}
                      /> */}

              <div>
                {" "}
                <Select
                  value={lookBackVal}
                  onChange={
                    endDate !== null || previousStartDate
                      ? null
                      : handleLookbackChange
                  }
                  sx={{
                    minWidth: isipadpro ? 130 : 153,
                    maxHeight: 35,
                    // marginTop: "10px",
                    marginRight: "25px",
                    borderRadius: 0,
                    // color:"",
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#848482" : "#FFF",
                    color:
                      theme.palette.mode === "dark"
                        ? endDate !== null || previousStartDate
                          ? "#B3B3AD"
                          : "#FFF"
                        : endDate !== null || previousStartDate
                        ? "lightgray"
                        : "#000",
                    padding: "7px 16px",
                    "& .MuiSelect-icon": {
                      color:
                        theme.palette.mode === "dark"
                          ? endDate !== null || previousStartDate
                            ? "#B3B3AD"
                            : "#FFF"
                          : endDate !== null || previousStartDate
                          ? "lightgray"
                          : "#000", // Customize the dropdown arrow color
                    },
                    "& .MuiSelect-root": {
                      color: "#000", // Customize the dropdown text color
                    },
                    "& .MuiInputBase-input": {
                      padding: 0, // Remove input padding
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Time
                  </MenuItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={index}
                      value={option}
                      sx={{
                        color:
                          theme.palette.mode === "dark"
                            ? endDate !== null || previousStartDate
                              ? "#666663"
                              : "#FFF"
                            : endDate !== null || previousStartDate
                            ? "lightgray"
                            : "#000",
                      }}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>
            {/* ) : null} */}

            <div
              style={{
                alignItems: "center",
                marginBottom: "20px",
                marginRight: "10px",
                marginTop: "9px",
              }}
            >
              <label
                style={{
                  fontSize: "10px",
                  marginBottom: "5px",
                  // marginLeft:"1px",
                  color: colors.tabColor[500],
                }}
              >
                Refresh
              </label>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Tooltip title="Refresh">
                  <IconButton
                    sx={{ mr: 2 }}
                    onClick={handleRefreshClick}
                    aria-label="Refresh"
                    style={FilterbuttonStyle}
                  >
                    <RefreshOutlined style={RefreshiconStyle} />
                  </IconButton>
                </Tooltip>
              </Box>
            </div>

            {isSmallScreen ? (
              <div
                style={{
                  alignItems: "center",
                  marginBottom: "20px",
                  // marginRight: "10px",
                  marginTop: "9px",
                }}
              >
                <label
                  style={{
                    fontSize: "10px",
                    marginBottom: "5px",
                    marginLeft: "5px",
                    color: colors.tabColor[500],
                  }}
                >
                  Filter
                </label>
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <Tooltip title="Filter">
                    <IconButton
                      sx={{ mr: 2 }}
                      onClick={toggleDrawer}
                      disabled={
                        window.location.pathname === "/mainpage/dashboard" ||
                        window.location.pathname ===
                          "/mainpage/dashboard/logSummary" ||
                        window.location.pathname ===
                          "/mainpage/dashboard/dbSummary" ||
                        window.location.pathname ===
                          "/mainpage/dashboard/kafkaSummary" ||
                        window.location.pathname ===
                          "/mainpage/sustainability" ||
                        window.location.pathname ===
                          "/mainpage/sustainability/node"
                      }
                      // aria-label="Refresh"
                      style={FilterbuttonStyle}
                    >
                      <FilterAltRoundedIcon style={RefreshiconStyle} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </div>
            ) : null}
          </Box>
        </Toolbar>
        <div style={{ marginTop: "-25px", marginLeft: "13px" }}>
          {isSmallScreen ? null : window.location.pathname ===
              "/mainpage/dashboard" ||
            window.location.pathname === "/mainpage/dashboard/logSummary" ||
            window.location.pathname === "/mainpage/dashboard/dbSummary" ||
            window.location.pathname === "/mainpage/dashboard/kafkaSummary" ? (
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              TabIndicatorProps={{
                sx: {
                  // height: 2,
                  marginTop: "-60px",
                  marginBottom: "3px",
                  borderRadius: 3,
                  backgroundColor: colors.tabIndicator[500],
                },
              }}
              textColor="inherit"
              indicatorColor="primary"
            >
              <Tab label="Trace Summary" sx={{ color: "#FFF" }} />
              <Tab label="Log Summary" sx={{ color: "#FFF" }} />
              <Tab label="Db Summary" sx={{ color: "#FFF" }} />
              <Tab label="Kafka Summary" sx={{ color: "#FFF" }} />
            </Tabs>
          ) : null}

          {isSmallScreen ? null : window.location.pathname ===
              "/mainpage/sustainability" ||
            window.location.pathname === "/mainpage/sustainability/node" ||
            window.location.pathname === "/mainpage/sustainability/host" ? (
            <Tabs
              value={keplerActiveTab}
              onChange={handleKeplerTabs}
              TabIndicatorProps={{
                sx: {
                  marginTop: "-60px",
                  borderRadius: 3,
                  backgroundColor: colors.tabIndicator[500],
                },
              }}
              style={{ marginLeft: "8px" }}
              textColor="inherit"
              indicatorColor="primary"
            >
              <Tab label="Pod Metrics" sx={{ color: "#FFF" }} />
              <Tab label="Node Metrics" sx={{ color: "#FFF" }} />
              {/* <Tab label="Host Metrics" sx={{ color: "#FFF" }} /> */}
            </Tabs>
          ) : null}

          {isSmallScreen ? null : window.location.pathname ===
              "/mainpage/apm" ||
            window.location.pathname === "/mainpage/apm/metrics" ||
            window.location.pathname === "/mainpage/apm/logs" ? (
            <Tabs
              value={apmActiveTab}
              onChange={handleApmTabs}
              TabIndicatorProps={{
                sx: {
                  marginTop: "-60px",
                  borderRadius: 3,
                  backgroundColor: colors.tabIndicator[500],
                },
              }}
              style={{ marginLeft: "8px" }}
              textColor="inherit"
              indicatorColor="primary"
            >
              <Tab label="Traces" sx={{ color: "#FFF" }} />
              <Tab label="Metrics" sx={{ color: "#FFF" }} />
              <Tab label="Logs" sx={{ color: "#FFF" }} />
              {/* <Tab label="Host Metrics" sx={{ color: "#FFF" }} /> */}
            </Tabs>
          ) : null}

          {isSmallScreen ? null : window.location.pathname ===
              "/mainpage/infraNode" ||
            window.location.pathname === "/mainpage/infraNode/nodeMemory" ? (
            <Tabs
              value={InfraNodeActiveTab}
              onChange={handleNodeTabChange}
              TabIndicatorProps={{
                sx: {
                  marginTop: "-60px",
                  borderRadius: 3,
                  backgroundColor: colors.tabIndicator[500],
                },
              }}
              textColor="inherit"
              indicatorColor="primary"
            >
              <Tab label="NodeCpuMetric" sx={{ color: "#FFF" }} />
              <Tab label="NodeMemoryMetric" sx={{ color: "#FFF" }} />
            </Tabs>
          ) : null}

          {isSmallScreen ? null : window.location.pathname ===
              "/mainpage/infraPod" ||
            window.location.pathname === "/mainpage/infraPod/podMemory" ? (
            <Tabs
              value={InfraPodActiveTab}
              onChange={handlePodTabChange}
              TabIndicatorProps={{
                sx: {
                  marginTop: "-60px",
                  borderRadius: 3,
                  backgroundColor: colors.tabIndicator[500],
                },
              }}
              textColor="inherit"
              indicatorColor="primary"
            >
              <Tab label="PodCpuMetric" sx={{ color: "#FFF" }} />
              <Tab label="PodMemoryMetric" sx={{ color: "#FFF" }} />
            </Tabs>
          ) : null}

          {window.location.pathname === "/mainpage/apm" ? (
            // <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer}>
            <Drawer
              open={openDrawer}
              onClose={toggleDrawer}
              anchor="right"
              PaperProps={{
                sx: {
                  height: "82vh",
                  // top: 150,

                  height:
                    isLandscape && isSmallScreen
                      ? "calc(90vh - 24px)"
                      : "calc(40vh - 40px)",
                  ...(isiphone && {
                    height: "calc(450vh - 32px)",
                  }),

                  height:
                    isLandscape && isSmallScreen
                      ? "calc(90vh - 24px)"
                      : "calc(40vh - 40px)",
                  ...(isipadpro && {
                    height: "calc(850vh - 32px)",
                  }),

                  height:
                    isLandscape && isSmallScreen
                      ? "calc(90vh - 24px)"
                      : "calc(40vh - 40px)",
                  ...(largem && {
                    height: "calc(1200vh - 32px)",
                  }),

                  bottom: 150,
                },
              }}
            >
              <FilterDialog />
            </Drawer>
          ) : null}

          {window.location.pathname === "/mainpage/apm/metrics" ? (
            // <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer}>
            <Drawer
              open={openDrawer}
              onClose={toggleDrawer}
              anchor="right"
              PaperProps={{
                sx: {
                  height: "80vh",
                  // top: 150,

                  height:
                    isLandscape && isSmallScreen
                      ? "calc(90vh - 24px)"
                      : "calc(40vh - 40px)",
                  ...(isiphone && {
                    height: "calc(450vh - 32px)",
                  }),

                  height:
                    isLandscape && isSmallScreen
                      ? "calc(90vh - 24px)"
                      : "calc(40vh - 40px)",
                  ...(isipadpro && {
                    height: "calc(850vh - 32px)",
                  }),

                  height:
                    isLandscape && isSmallScreen
                      ? "calc(90vh - 24px)"
                      : "calc(40vh - 40px)",
                  ...(largem && {
                    height: "calc(1200vh - 32px)",
                  }),

                  bottom: 150,
                },
              }}
            >
              <Metricfilter />
            </Drawer>
          ) : null}

          {window.location.pathname === "/mainpage/apm/logs" ? (
            // <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer}>
            <Drawer
              open={openDrawer}
              onClose={toggleDrawer}
              anchor="right"
              PaperProps={{
                sx: {
                  height: "82vh",
                  // "@media (max-width: 500px)": {
                  //   height: "400vh",
                  // },
                  // top: 150,

                  height:
                    isLandscape && isSmallScreen
                      ? "calc(90vh - 24px)"
                      : "calc(40vh - 40px)",
                  ...(isiphone && {
                    height: "calc(450vh - 32px)",
                  }),

                  height:
                    isLandscape && isSmallScreen
                      ? "calc(90vh - 24px)"
                      : "calc(40vh - 40px)",
                  ...(isipadpro && {
                    height: "calc(850vh - 32px)",
                  }),

                  height:
                    isLandscape && isSmallScreen
                      ? "calc(90vh - 24px)"
                      : "calc(40vh - 40px)",
                  ...(largem && {
                    height: "calc(1200vh - 32px)",
                  }),

                  bottom: 150,
                },
              }}
            >
              <Logfilter />
            </Drawer>
          ) : null}
          <Box
            sx={{
              alignItems: "flex-start",
              marginLeft: "25px",
              padding: "5px",
              marginTop: "5px",
            }}
          >
            {window.location.pathname === "/mainpage/traces" ? (
              <Typography variant="h5" fontWeight={500} sx={{ color: "#FFF" }}>
                TRACES{" "}
                {traceDisplayService.length > 0
                  ? `(${traceDisplayService.join(", ")})`
                  : ""}
              </Typography>
            ) : window.location.pathname === "/mainpage/metrics" ? (
              <Typography variant="h5" fontWeight={500} sx={{ color: "#FFF" }}>
                METRICS {`(${selectedService})`}
              </Typography>
            ) : window.location.pathname === "/mainpage/logs" ? (
              <Typography variant="h5" fontWeight={500} sx={{ color: "#FFF" }}>
                LOGS{" "}
                {selectedLogService.length > 0
                  ? `(${selectedLogService.join(", ")})`
                  : ""}
              </Typography>
            ) : null}
          </Box>
        </div>
      </AppBar>
    </>
  );
};

export default DashboardTopBar;
