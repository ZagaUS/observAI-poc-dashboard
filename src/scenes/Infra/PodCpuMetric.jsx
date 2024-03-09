import {
  Box,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState, useEffect, useContext, useCallback } from "react";
import Loading from "../../global/Loading/Loading";
import PodMetricDashboard from "./InfraCharts/PodMetricDashboard";
// import { PodMetricData } from '../Infra/PodStaticData';
import { getPodMetricDataPaginated } from "../../api/InfraApiService";
import { GlobalContext } from "../../global/globalContext/GlobalContext";
import { tokens } from "../../theme";

const PodCpuMetric = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [emptyMessage, setEmptyMessage] = useState("");
  const [powerMetrics, setPowerMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [podDisplayName, setPodDisplayName] = useState([]);
  const [selectedPodName, setSelectedPodName] = useState("");
  const [containerPowerUsage, setContainerPowerUsage] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const {
    setInfraPodActiveTab,
    lookBackVal,
    selectedStartDate,
    selectedEndDate,
    needHistoricalData,
    podCurrentPage,
    setInfraActiveTab,
    selectedCluster,
  } = useContext(GlobalContext);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isLandscape = useMediaQuery(
    "(max-width: 1000px) and (orientation: landscape)"
  );
  const isiphone = useMediaQuery((theme) => theme.breakpoints.down("iphone"));

  const processMetricData = (podMetrics, podName) => {
    //   console.log("Processing Metric Data",podName+ JSON.stringify(podMetrics));
    // const filteredData = podMetrics.filter((pod) => pod.podName === podName);

    const filteredData = podMetrics.filter(
      (podMet) =>
        `${podMet.namespaceName}/${podMet.pods[0]?.podName}` === podName,
      selectedPodName === "" ? setSelectedPodName(podName) : null
    );

    // const filteredData = podMetrics.filter(
    //   (podMet) =>
    //     `${podMet.namespaceName}/${podMet.pods[0]?.podName}` === podName
    // );
    // console.log("filterdata+++",filteredData)
    const processedData = filteredData.flatMap((podData) => {
      // console.log("flatMap",podData.pods[0].podName)

      if (podData.pods[0].metrics) {
        // console.log("If condtion ", podData.pods[0].metrics);
        return podData.pods[0].metrics.map((metric) => {
          // console.log("timestamp ", metric.date + " " + metric.cpuUsage);
          //   console.log("Total Count ----------", podData.totalCount);
          setTotalPages(Math.ceil(podData.totalCount / 10));
          // console.log("Total Count ----------", totalPages);
          const timestamp = new Date(metric.date).getTime();
          return { x: timestamp, y: metric.cpuUsage };
        });
      } else {
        return [];
      }
    });
    // console.log('================================',processedData)

    console.log("Total Pages ----------", totalPages);
    setContainerPowerUsage(processedData);
  };

  const createPodMetricData = (podMetrics) => {
    //   console.log("------------createdPodMetricData----------", podMetrics)
    let podNames = podMetrics.map((item) => ({
      podName: `${item.namespaceName}/${item.pods[0]?.podName}`,
    }));
    // console.log("Pods: " , podNames[0].podName);
    setPodDisplayName(podNames);
    processMetricData(podMetrics, podNames[0].podName);
  };

  const PodMetrics = [
    {
      data: containerPowerUsage,
      title: `${selectedPodName}`,
      yaxis: "CPU  USAGE",
      totalCount: totalPages,
    },
  ];

  const fetchPodMetrics = useCallback(async () => {
    // setPowerMetrics(keplerContainerInfo);
    try {
      setLoading(true);
      const podResponse = await getPodMetricDataPaginated(
        selectedStartDate,
        selectedEndDate,
        lookBackVal.value,
        podCurrentPage,
        10,
        selectedCluster
      );
      console.log("POD REESPONSE I GOT", podResponse);
      if (podResponse.length !== 0) {
        setPowerMetrics(podResponse);
        createPodMetricData(podResponse);
        // console.log("Response metric " + JSON.stringify(keplerResponse));
      } else {
        setEmptyMessage("No Data to show");
      }
      setLoading(false);
    } catch (error) {
      console.log("ERROR on kepler metric " + error);
      setErrorMessage("An error Occurred!");
      setLoading(false);
    }
  }, [
    selectedStartDate,
    selectedEndDate,
    lookBackVal,
    needHistoricalData,
    podCurrentPage,
    selectedCluster
  ]);

  // getPodMetricDataPaginated
  useEffect(() => {
    // setKeplerActiveTab(0);

    setInfraActiveTab(2);
    setInfraPodActiveTab(0);
    console.log("useeffect called------>PodMetrics");
    fetchPodMetrics();
    return () => {
      setErrorMessage("");
      setEmptyMessage("");
    };
    //   const getPodMetrics = async () => {
    //     try {
    //      const data = await getPodMetricDataPaginated(selectedStartDate, selectedEndDate, lookBackVal.value, keplerCurrentPage,10);
    //       console.log("api fetched data----------",data);
    //     } catch (error) {
    //       console.log(error);
    //     }
    // };
    // setLoading(true);

    // if (Array.isArray(PodMetricData) && PodMetricData.length > 0) {
    //   console.log("PODMETRIC_______________",PodMetricData);
    //     createPodMetricData(PodMetricData);
    // } else {
    //     setEmptyMessage("No Data to show");
    // }
    // setLoading(false);
    // getPodMetrics();
  }, [setErrorMessage, setEmptyMessage, podCurrentPage, fetchPodMetrics]);

  const handlePodClick = (clickedPodName) => {
    setSelectedPodName(clickedPodName);
    // console.log("Clicked pod name:", clickedPodName);
    // const clickedPodData = PodMetricData.find(pod => pod.pods && `${pod.namespaceName}/${pod.pods[0]?.podName}` === clickedPodName);
    // console.log("Clicked pod data:", clickedPodData);
    // if (clickedPodData) {
    // setSelectedPodData(PodMetricData);
    processMetricData(powerMetrics, clickedPodName);
    // } else {
    //     console.error("Clicked pod data not found:", clickedPodName);
    // }
  };

  const hasContainerPowerMetrics = powerMetrics.some(
    (item) => item.length !== 0
  );

  return (
    <div>
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
          <Typography variant="h6" align="center">
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
          <Typography variant="h6" align="center">
            {errorMessage}
          </Typography>
        </div>
      ) : (
        <div
          style={{
            maxHeight: "73vh",
            minWidth: "100%",
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
                      ? "calc(120vh - 20px)"
                      : "calc(75vh - 30px)",
                  color: "black",
                  ...(isiphone && {
                    height: "calc(100vh - 32px)",
                  }),
                }}
              >
                <CardContent>
                  <Box style={{ display: "flex", flexDirection: "row" }}>
                    <div style={{ width: "65%" }}>
                      {hasContainerPowerMetrics ? (
                        <PodMetricDashboard podData={PodMetrics[0]} />
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "calc(75vh - 24px)",
                            width: "100%",
                          }}
                        >
                          <Typography variant="h5" fontWeight={"600"}>
                            Container Power Metrics - No data
                          </Typography>
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        width: "35%",
                        maxHeight: "500px",
                        overflowY: "auto",
                      }}
                    >
                      <Table
                        size="small"
                        aria-label="a dense table"
                        sx={{
                          "& .MuiTableRow-root:hover": {
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? "#696969"
                                : "lightgrey",
                          },
                        }}
                      >
                        <TableBody>
                          {podDisplayName.map((pod, index) => (
                            <TableRow key={index}>
                              <TableCell
                                style={{
                                  height: "20px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handlePodClick(pod.podName)}
                              >
                                <Typography variant="body1">
                                  {pod.podName}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
};

export default PodCpuMetric;
