import React, { useState, memo } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import ApiCallCount from "./TraceCharts/ApiCallCount";
import PeakLatencyChart from "./TraceCharts/PeakLatencyChart";
import ErrSucssCallCountChart from "./TraceCharts/ErrSucssCallCountChart";
import ServiceDetails from "./TraceCharts/ServiceDetails";
import ServiceTable from "./TraceCharts/ServiceTable";
import {
  getRecentTraceList,
  getTraceSummaryData,
  getTraceSummaryDataWithDate,
} from "../../../api/TraceApiService";
import { GlobalContext } from "../../../global/globalContext/GlobalContext";
import { useEffect } from "react";
import { useContext } from "react";
import Loading from "../../../global/Loading/Loading";
import { formatDistanceToNow } from "date-fns";
import { useCallback } from "react";
import { tokens } from "../../../theme";
import { useNavigate } from "react-router-dom";
import "./TraceSummaryChart.css";

const TraceBarChart = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [errorCalls, setErrorCalls] = useState(null);
  const [successCalls, setSuccessCalls] = useState(null);
  const {
    lookBackVal,
    setActiveTab,
    setTraceRender,
    setLogRender,
    setSelected,
    traceSummaryService,
    setMetricRender,
    setTraceSummaryService,
    setLogSummaryService,
    selectedStartDate,
    selectedEndDate,
    needHistoricalData,
    setNavActiveTab,
    setClearTraceFilter,
    setApmActiveTab,
  } = useContext(GlobalContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [emptyMessage, setEmptyMessage] = useState("");

  const [integrationdata, setintegrationdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isLandscape = useMediaQuery(
    "(max-width: 1000px) and (orientation: landscape)"
  );

  const isiphone = useMediaQuery((theme) => theme.breakpoints.down("iphone"));
  const issurfacepro = useMediaQuery((theme) =>
    theme.breakpoints.only("issurfacepro")
  );

  const isipadmini = useMediaQuery((theme) =>
    theme.breakpoints.up("ipadminiwidth")
  );

  const isipadpro = useMediaQuery((theme) =>
    theme.breakpoints.only("isipadpro")
  );

  console.log("isipadmini", isipadmini);
  console.log("isipadmax", isipadpro);

  const traceSummaryApiCall = useCallback(async () => {
    try {
      setLoading(true);
      var response = await getTraceSummaryDataWithDate(selectedStartDate, selectedEndDate, lookBackVal.value);
      if (response.data.traceMetricCount.length !== 0) {
        setintegrationdata(response.data.traceMetricCount);
      } else {  
        setEmptyMessage("No Data to show");
      }
       console.log(response.data.traceMetricCount,"----->---traceSummaryChart");
      // console.log("Trace summary data " + JSON.stringify(response));
      setLoading(false);

    } catch (error) {
      // console.log("error " + error);
      setErrorMessage("An error Occurred!");
      setLoading(false);
    }
  }, [selectedStartDate, selectedEndDate, lookBackVal, needHistoricalData]);

  useEffect(() => {
    setErrorMessage("");
    setEmptyMessage("");
    setTraceSummaryService([]);
    setLogSummaryService([]);
    setMetricRender(false);
    traceSummaryApiCall();
    setClearTraceFilter(true);
    setActiveTab(0);
    setNavActiveTab(0);
    setTraceRender(false);
    setLogRender(false);
  }, [
    traceSummaryApiCall,
    setActiveTab,
    setTraceRender,
    setNavActiveTab,
    setLogRender,
    setMetricRender,
    setTraceSummaryService,
    setLogSummaryService,
  ]);

  const handleBarClick = (selectedDataPointIndex, selectedSeriesName) => {
    ///DONT REMOVE THIS CODE-----------------//
    const serviceName = integrationdata[selectedDataPointIndex].serviceName;
    console.log("ServiceName from Trace summary" + serviceName);
    // const clickedBarData = integrationdata[selectedDataPointIndex];
    // console.log("serviceName " + serviceName);

    // const peakLatency = integrationdata.find(
    //   (item) => item.serviceName === serviceName
    // ).peakLatency;
    // const errorCalls = integrationdata.find(
    //   (item) => item.serviceName === serviceName
    // ).totalErrorCalls;
    // const successCalls = integrationdata.find(
    //   (item) => item.serviceName === serviceName
    // ).totalSuccessCalls;

    // setSelectedService(serviceName, peakLatency, errorCalls, successCalls);

    // if (selectedSeriesName === "Error Calls") {
    //   setErrorCalls(clickedBarData.totalErrorCalls);
    //   setSuccessCalls(null);
    // } else if (selectedSeriesName === "Success Calls") {
    //   setSuccessCalls(clickedBarData.totalSuccessCalls);
    //   setErrorCalls(null);
    // }
    // const apiBody = {
    //   serviceName: [serviceName]
    // }
    // setNeedFilterCall(true);
    // setFilterApiBody(apiBody);
    traceSummaryService.push(serviceName);
    localStorage.setItem("routeName", "Traces");
    setSelected("Traces");
    setApmActiveTab(0);
    navigate("/mainpage/apm");
    // setNavActiveTab(1);
  };

  const hasErrChartData = integrationdata.some(
    (item) => item.totalErrorCalls !== 0
  );
  const hasSuccChartData = integrationdata.some(
    (item) => item.totalSuccessCalls !== 0
  );
  const hasApiChartData = integrationdata.some(
    (item) => item.apiCallCount !== 0
  );
  const hasPeakChartData = integrationdata.some(
    (item) => item.peakLatency !== 0
  );

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // const chartWidth = isCollapsed ? 'calc(175vh - 10px)' : 'calc(155vh - 15px)'
  // const chartWidth2 = isCollapsed ? 'calc(90vh - 20px)' : 'calc(80vh - 10px)'
  // const chartWidth3 = isCollapsed ? 'calc(85vh - 20px)' : 'calc(75vh - 15px)'

  return (
    <div className="main-content" style={{ height: isLandscape ? "" : "77vh" }}>
      {loading ? (
        <Loading />
      ) : emptyMessage ? (
        <div
          className="empty-message"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "73vh",
          }}
        >
          <Typography variant="h5" fontWeight={"600"}>
            {emptyMessage}
          </Typography>
        </div>
      ) : errorMessage ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "80vh",
          }}
        >
          <Typography variant="h5" fontWeight={"600"}>
            {errorMessage}
          </Typography>
        </div>
      ) : integrationdata.length !== 0 ? (
        <div>
          <div
            className="content"
            style={{
              // maxHeight: "82.5vh",
              maxHeight: isSmallScreen ? "" : "73vh",
              // ...(theme.breakpoints.down("sm") && {
              //   backgroundColor: "grey",
              // }),
              // overflowY: "auto",
              width: "100%",
            }}
          >
            <div className="dashboards">
              {" "}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card
                    elevation={3}
                    style={{
                      margin: "15px 25px 15px 25px",
                      //  height: isSmallScreen ? "calc(41vh - 40px)" : "calc(40vh - 40px)",
                      height:
                        isLandscape && isSmallScreen
                          ? "calc(90vh - 24px)"
                          : "calc(40vh - 40px)",
                      width: isSmallScreen ? "calc(1000px - 40px)" : "",
                      color: theme.palette.mode === "dark" ? "white" : "black",

                      ...(isiphone && {
                        height: "calc(80vh - 32px)",
                      }),
                      ...(isipadpro && {
                        height: "calc(28vh - 32px)",
                      }),
                      ...(issurfacepro && {
                        height: "calc(35vh - 32px)",
                      }),

                      //       ...((isipadmini) && {
                      //         height:  "calc(50vh - 32px)",
                      // }),

                      //       ...((isipadmini&&isipadpro) && {
                      //         height:  "calc(30vh - 32px)",
                      // }),
                    }}
                  >
                    <CardContent>
                      {hasErrChartData || hasSuccChartData ? (
                        <ErrSucssCallCountChart
                          ErrSuccessData={integrationdata}
                          onBarClick={handleBarClick}
                        />
                      ) : (
                        // <div>Error and Success Call Count Chart - No Data</div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "calc(40vh - 24px)",
                            width: "100%",
                          }}
                        >
                          <Typography variant="h5" fontWeight={"600"}>
                            Error and Success Count Chart - No Data
                          </Typography>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              {/* {hasErrChartData ? (
                <ServiceDetails
                  selectedService={selectedService}
                  APICallsData={
                    selectedService
                      ? integrationdata.find(
                        (item) => item.serviceName === selectedService
                      ).apiCallCount
                      : null
                  }
                  PeakLatencyData={
                    selectedService
                      ? integrationdata.find(
                        (item) => item.serviceName === selectedService
                      ).peakLatency
                      : null
                  }
                  ErrorData={errorCalls}
                  SuccessData={successCalls}
                />
              ) : null}
              <ServiceTable selectedService={selectedService} /> */}
              <div>
                <Grid container spacing={2}>
                  {" "}
                  <Grid item xs={12} sm={6}>
                    <Card
                      elevation={4}
                      style={{
                        margin: "5px 15px 5px 25px",
                        // height: "calc(40vh - 32px)",
                        //           height: isLandscape
                        // ? "calc(41vh - 40px)"
                        // : isSmallScreen
                        // ? "calc(90vh - 24px)"
                        // : "calc(42vh - 32px)",
                        height:
                          isLandscape && isSmallScreen
                            ? "calc(90vh - 24px)"
                            : "calc(40vh - 32px)",
                        // height: isLandscape ? "calc(90vh - 24px)" : "calc(40vh - 32px)",
                        width: isSmallScreen ? "calc(1000px - 40px)" : "",
                        color:
                          theme.palette.mode === "dark" ? "white" : "black",
                        ...(isiphone && {
                          height: "calc(80vh - 32px)",
                        }),
                        ...(isipadpro && {
                          height: "calc(28vh - 32px)",
                        }),
                        ...(issurfacepro && {
                          height: "calc(35vh - 32px)",
                        }),

                        // ...(isipadmini &&
                        //   isipadpro && {
                        //     height: "calc(30vh - 32px)",
                        //   }),
                      }}
                    >
                      <CardContent>
                        {/* {integrationdata.map((items) =>
                        items.apiCallCount !== 0 ? (
                          <ApiCallCount data={integrationdata} />
                        ) : (
                          <div>No Data</div>
                        )
                      )} */}

                        {hasApiChartData ? (
                          <ApiCallCount data={integrationdata} />
                        ) : (
                          // <div>Api Call Count Chart - No data</div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              height: "calc(40vh - 25px)",
                            }}
                          >
                            <Typography variant="h5" fontWeight={"600"}>
                              Api Count Chart - No data
                            </Typography>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card
                      elevation={3}
                      style={{
                        margin: isSmallScreen
                          ? "5px 15px 5px 25px"
                          : "5px 25px 5px 15px",
                        // height: isSmallScreen ? "calc(41vh - 40px)" : "calc(40vh - 32px)",
                        height:
                          isLandscape && isSmallScreen
                            ? "calc(90vh - 24px)"
                            : "calc(40vh - 32px)",
                        width: isSmallScreen ? "calc(1000px - 40px)" : "",
                        color:
                          theme.palette.mode === "dark" ? "white" : "black",
                        ...(isiphone && {
                          height: "calc(80vh - 32px)",
                        }),
                        ...(isipadpro && {
                          height: "calc(28vh - 32px)",
                        }),
                        ...(issurfacepro && {
                          height: "calc(35vh - 32px)",
                        }),
                      }}
                    >
                      <CardContent>
                        <PeakLatencyChart />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default TraceBarChart;
