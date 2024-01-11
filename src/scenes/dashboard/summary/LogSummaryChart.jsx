import React, { useCallback, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import DebugBarChart from "./LogCharts/DebugBarChart";
import WarnBarChart from "./LogCharts/WarnBarChart";
import LogServiceDetails from "./LogCharts/LogServiceDetails";
import LogServiceTable from "./LogCharts/LogServiceTable";
import ErrorBarChart from "./LogCharts/ErrorBarChart";
import Loading from "../../../global/Loading/Loading";
import {
  getErroredLogDataForLastTwo,
  getLogSummaryData,
  getLogSummaryDataWithDate,
} from "../../../api/LogApiService";
import { useEffect } from "react";
import { GlobalContext } from "../../../global/globalContext/GlobalContext";
import { useContext } from "react";
import { async } from "q";
import { useNavigate } from "react-router-dom";
import "./LogSummaryChart.css";

const LogBarChart = () => {
  const [selectedService, setSelectedService] = useState(null);
  const {
    lookBackVal,
    setSelected,
    logSummaryService,
    setLogSummaryService,
    selectedStartDate,
    selectedEndDate,
    needHistoricalData,
    setActiveTab,
    setNavActiveTab,
    setApmActiveTab,
  } = useContext(GlobalContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [emptyMessage, setEmptyMessage] = useState("");

  const [integrationdata, setintegrationdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  // const colors = tokens(theme.palette.mode);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isLandscape = useMediaQuery(
    "(max-width: 1000px) and (orientation: landscape)"
  );

  const isiphone = useMediaQuery((theme) => theme.breakpoints.down("iphone"));
  const isipadpro = useMediaQuery((theme) =>
    theme.breakpoints.only("isipadpro")
  );

  const issurfacepro = useMediaQuery((theme) =>
    theme.breakpoints.only("issurfacepro")
  );

  const logSummaryApiCall = useCallback(async () => {
    try {
      setLoading(true);
      var response = await getLogSummaryDataWithDate(
        selectedStartDate,
        selectedEndDate,
        lookBackVal.value,
        needHistoricalData
      );
      // const traceSummaryData = JSON.parse(JSON.stringify(response));
      if (response.data.logMetricsCount.length !== 0) {
        setintegrationdata(response.data.logMetricsCount);
      } else {
        setEmptyMessage("No Data to Show");
      }

      console.log("log summary data " + JSON.stringify(response));
      setLoading(false);
    } catch (error) {
      // console.log("ERROR on Log summary " + error);
      setErrorMessage("An Error Occurred!");
      setLoading(false);
    }
  }, [selectedStartDate, selectedEndDate, lookBackVal, needHistoricalData]);

  // const errordataforlasttwo =async ()=>{
  //   const response = await getErroredLogDataForLastTwo(page,pageSize,serviceName);
  // }

  useEffect(() => {
    setErrorMessage("");
    setEmptyMessage("");
    logSummaryApiCall();
    setLogSummaryService([]);
    setActiveTab(1);
    setNavActiveTab(0);
    // errordataforlasttwo();
  }, [
    logSummaryApiCall,
    setErrorMessage,
    setEmptyMessage,
    setLogSummaryService,
  ]);

  const handleBarClick = (selectedDataPointIndex) => {
    const serviceName = integrationdata[selectedDataPointIndex].serviceName;
    // const clickedBarData = errorSuccessData[selectedDataPointIndex];
    // const LogWarn = integrationdata.find(
    //   (item) => item.serviceName === serviceName
    // ).warnCallCount;
    // const LogErrorCount = integrationdata.find(
    //   (item) => item.serviceName === serviceName
    // ).errorCallCount;
    // const LogDebugCount = integrationdata.find(
    //   (item) => item.serviceName === serviceName
    // ).debugCallCount;

    // setSelectedService(serviceName, LogWarn, LogErrorCount, LogDebugCount);
    // const logApiBody = {
    //   serviceName: [serviceName]
    // }
    // setNeedLogFilterCall(true);
    // setLogFilterApiBody(logApiBody);
    logSummaryService.push(serviceName);
    localStorage.setItem("routeName", "Logs");
    setSelected("Logs");
    setApmActiveTab(2);
    navigate("/mainpage/apm/logs");
    // setNavActiveTab(3);
  };

  const hasErrChartData = integrationdata.some(
    (item) => item.errorCallCount !== 0
  );
  const hasDebugChartData = integrationdata.some(
    (item) => item.debugCallCount !== 0
  );
  const hasWarnChartData = integrationdata.some(
    (item) => item.warnCallCount !== 0
  );

  return (
    <div className="log-content" style={{ height: isLandscape ? "" : "77vh" }}>
      {loading ? (
        <Loading />
      ) : emptyMessage ? (
        <div
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
        <div
          style={{
            // maxHeight: "82.5vh",
            maxHeight: isSmallScreen ? "" : "73vh",
            // overflowY: "auto",
            width: "100%",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card
                elevation={3}
                style={{
                  margin: "15px 25px 15px 25px",
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
                }}
              >
                <CardContent>
                  {hasErrChartData ? (
                    <ErrorBarChart
                      data={integrationdata}
                      onBarClick={handleBarClick}
                    />
                  ) : (
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
                        Error Count Chart - No data
                      </Typography>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* {hasErrChartData ? (
            <LogServiceDetails
              selectedService={selectedService}
              DebugCountData={
                selectedService
                  ? integrationdata.find(
                    (item) => item.serviceName === selectedService
                  ).debugCallCount
                  : null
              }
              WarnCountData={
                selectedService
                  ? integrationdata.find(
                    (item) => item.serviceName === selectedService
                  ).warnCallCount
                  : null
              }
              ErrCountData={
                selectedService
                  ? integrationdata.find(
                    (item) => item.serviceName === selectedService
                  ).errorCallCount
                  : null
              }
            />
          ) : null}


          <LogServiceTable
            tableData={integrationdata}
            selectedService={selectedService} // Pass selected service to ServiceTable
          /> */}
          <Grid container spacing={2}>
            {" "}
            <Grid item xs={12} sm={6}>
              <Card
                elevation={3}
                style={{
                  margin: "5px 15px 5px 25px",
                  height:
                    isLandscape && isSmallScreen
                      ? "calc(90vh - 24px)"
                      : "calc(40vh - 32px)",
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
                }}
              >
                <CardContent>
                  {hasDebugChartData ? (
                    // If any item has debugCallCount !== 0, display the chart
                    <DebugBarChart data={integrationdata} />
                  ) : (
                    // If no item has debugCallCount !== 0, display "No Data" once
                    // <div>Debug Call Count Chart - No data</div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "calc(40vh - 20px)",
                      }}
                    >
                      <Typography variant="h5" fontWeight={"600"}>
                        Debug Count Chart - No data
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
                  height:
                    isLandscape && isSmallScreen
                      ? "calc(90vh - 24px)"
                      : "calc(40vh - 32px)",
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
                }}
              >
                <CardContent>
                  {hasWarnChartData ? (
                    <WarnBarChart data={integrationdata} />
                  ) : (
                    // <div>Warn Call Count Chart - No Data</div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "calc(40vh - 20px)",
                      }}
                    >
                      <Typography variant="h5" fontWeight={"600"}>
                        Warn Count Chart - No Data
                      </Typography>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      ) : null}
    </div>
  );
};
export default LogBarChart;
