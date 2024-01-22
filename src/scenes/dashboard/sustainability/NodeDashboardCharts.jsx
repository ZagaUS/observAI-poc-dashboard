import { Box, Button, Card, CardContent, Divider, Grid, List, ListItem, Table, TableBody, TableCell, TableRow, Typography, colors, useMediaQuery, useTheme } from '@mui/material';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import Loading from '../../../global/Loading/Loading';
import { keplerContainerInfo, keplerContainerInfoContainer, keplerContainerInfoNew } from '../../../global/MockData/KeplerMockData';
import ContainerPowerMetrics from './keplerCharts/ContainerPowerMetrics';
import { GlobalContext } from '../../../global/globalContext/GlobalContext';
import { tokens } from '../../../theme';
import { getKeplerMetricData, getKeplerMetricDataPaginated } from '../../../api/KeplerApiService';

const NodeDashboardCharts = () => {

    const [errorMessage, setErrorMessage] = useState("");
    const [emptyMessage, setEmptyMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { lookBackVal,
        setKeplerActiveTab,
        selectedStartDate,
        selectedEndDate,
        setNavActiveTab,
        needHistoricalData,
        nodeCurrentPage,
    } = useContext(GlobalContext);

    const [powerMetrics, setPowerMetrics] = useState([]);
    const [podDisplayName, setPodDisplayName] = useState([]);
    const [selectedPodName, setSelectedPodName] = useState();
    const [totalPages, setTotalPages] = useState(1);
    const [containerPowerUsage, setContainerPowerUsage] = useState([]);
    const keplerTypeList = ["DRAM", "PKG", "OTHER"];

    const processMetricData = (keplerMetricData, podName) => {

        // var parts = podName.split('/');
        var lastValue = podName;

        //FILTER DATA BY PODNAME FROM RESPONSE
        const filteredData = keplerMetricData.filter((data) => data.displayName === podName, setSelectedPodName(lastValue));

        //PROCESS THE FILTERED DATA
        const processedData = filteredData.flatMap((podData) => {
            return podData.containerPowerMetrics.map((metric) => {
                const utcDate = new Date(metric.createdTime);
                const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
                const istDate = new Date(utcDate.getTime() + istOffset);
        
                return {
                    x: istDate.getTime(), 
                    y: metric.consumptionValue
                };
            });
        });

        setContainerPowerUsage(processedData);
        // console.log("Container Usage Data: ", JSON.stringify(filteredData));
    }

    const createPodMetricData = (keplerContainerData) => {
        //SEGREGATE PODNAMES FROM RESPONSE
        let podNames = [];
        keplerContainerData.forEach((podInfo) => {
            let podObject = {
                podName: podInfo.displayName
            }
            podNames.push(podObject);
        })
        console.log("PODNAMES " + JSON.stringify(podNames));
        setPodDisplayName(podNames);

        //PROCESS THE METRIC DATA
        processMetricData(keplerContainerData, podNames[0].podName);
    }



    const keplerMetrics = [
        {
            data: containerPowerUsage,
            title: `Node Power Usage - ${selectedPodName}`,
            yaxis: "Power Usage",
            totalCount: totalPages,
            type: "node"
        }
    ];

    const fetchPowerMetrics = useCallback(async () => {
        // setPowerMetrics(keplerContainerInfo);
        try {
            setLoading(true);
            const keplerResponse = await getKeplerMetricDataPaginated(selectedStartDate, selectedEndDate, lookBackVal.value, "node",keplerTypeList,nodeCurrentPage,10);
            if (keplerResponse.data.allKeplerMetricDatas.length !== 0) {
                setPowerMetrics(keplerResponse.data.allKeplerMetricDatas);
                createPodMetricData(keplerResponse.data.allKeplerMetricDatas);
                // console.log("Response metric " + JSON.stringify(keplerResponse));
            } else {
                setEmptyMessage("No Data to show");
            }
            setLoading(false);
        } catch (error) {
            console.log("ERROR on kepler metric " + error)
            setErrorMessage("An error Occurred!");
            setLoading(false);
        }
    }, [selectedStartDate, selectedEndDate, lookBackVal, needHistoricalData,nodeCurrentPage])

    const handlePodClick = (clickedPodName) => {
        console.log("POD Name " + clickedPodName);
        setSelectedPodName(clickedPodName);
        processMetricData(powerMetrics, clickedPodName);
    }

    useEffect(() => {
        // setPowerMetrics(keplerContainerInfo);
        setKeplerActiveTab(1);
        setNavActiveTab(1);
        // createPodMetricData(keplerContainerInfoContainer);
        fetchPowerMetrics();
        return () => {
            setErrorMessage("");
            setEmptyMessage("");
            // setKeplerCurrentPage(1);
        }
    }, [setErrorMessage, setEmptyMessage, setKeplerActiveTab, setNavActiveTab, fetchPowerMetrics])

    const hasContainerPowerMetrics = powerMetrics.some((item) => item.containerPowerMetrics.length !== 0)

    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
    const isLandscape = useMediaQuery(
        "(max-width: 1000px) and (orientation: landscape)"
    );

    const isiphone = useMediaQuery((theme) => theme.breakpoints.down("iphone"));
    const istablet = useMediaQuery((theme) => theme.breakpoints.down("lg"));



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
            ) : keplerContainerInfo.containerPowerMetrics.length !== 0 ? (
                <div style={{
                    maxHeight: "73vh",
                    // overflowY: "auto",
                    minWidth: "100%"
                }}>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Card elevation={3} style={{ margin: "15px 25px 15px 25px", height: (isLandscape && isSmallScreen) ? "calc(120vh - 20px)" : "calc(75vh - 30px)",
                            
                            ...(isiphone && {
                                height: "calc(100vh - 32px)",
                              }),
                            //   ...(istablet && {
                            //     height: "calc(100vh - 32px)",
                            //     backgroundColor: "gray"
                            //   }),
                            color: 'black'
                             }}>

                                <CardContent>
                                    <Box style={{ display: "flex", flexDirection: "row", 
                                   
                                     
                                }} >
                                        {hasContainerPowerMetrics ? (
                                            <ContainerPowerMetrics containerPowerMetrics={keplerMetrics[0]} />
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
                                        {/* <List>
                                            {podNameList.map((pod, index) => (
                                                <ListItem key={index} disablePadding>
                                                    <div variant="outlined" style={{ backgroundColor: colors.primary[400] }} fullWidth >
                                                        {pod.podName}
                                                    </div>
                                                </ListItem>
                                            ))}
                                        </List> */}
                                        <div style={{ width: '35%', maxHeight: '500px', overflowY: 'auto',
                                    
                                    
                                    }}>
                                            <Table size="small" aria-label="a dense table" sx={{
                                                "& .MuiTableRow-root:hover": {
                                                    backgroundColor: 'lightgrey',
                                                }
                                            }} >
                                                <TableBody>
                                                    {podDisplayName.map((pod, index) => (
                                                        <React.Fragment key={index}>
                                                            <TableRow>
                                                                <TableCell
                                                                    style={{
                                                                        height: '20px',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                    onClick={() => handlePodClick(pod.podName)}
                                                                >
                                                                    <Typography variant='h7' >
                                                                        {pod.podName}
                                                                    </Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        </React.Fragment>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Card elevation={3} style={{ margin: "5px 25px 15px 25px", height: "calc(40vh - 40px)", color: 'black' }}>
                                <CardContent>
                                    <PeakLatencyKafka />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid> */}
                </div>
            ) : null
            }
        </div>
    )
}

export default NodeDashboardCharts;