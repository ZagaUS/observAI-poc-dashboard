import React, { useCallback, useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../../global/globalContext/GlobalContext';
import NodeCpuMetricChart from './NodeCpuMetricChart';
import { nodeCpuMetricMock, nodeMetrics} from '../../global/MockData/NodeCpuMetricMockData';
import { getNodeMetricData } from '../../api/InfraApiService';
import { Box, Card, CardContent, Grid, Table, TableBody, TableCell, TableRow, Typography, useMediaQuery } from '@mui/material';
import Loading from '../../global/Loading/Loading';

const NodeCpuMetric = () => {

  const { setInfraActiveTab, setInfraNodeActiveTab, setNavActiveTab, selectedStartDate, selectedEndDate, needHistoricalData, lookBackVal } = useContext(GlobalContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [emptyMessage, setEmptyMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [nodeMetric, setNodeMetric] = useState([]);
  const [nodeDisplayName, setNodeDisplayName] = useState([]);
  const [selectedNodeName, setSelectedNodeName] = useState();
  const [containerPowerUsage, setContainerPowerUsage] = useState([]);

    const processNodeData = (nodeMetricData, nodeName) => {
    // var lastValue = nodeName;
    // const node = nodeMetricData.find(node => node.nodeName === nodeName);

    // const filteredData = nodeMetricData.filter((data) => data.displayName === nodeName, selectedNodeName === "" ? setSelectedNodeName(lastValue) : null);

    // const filteredData = nodeMetricData.filter((data) => data === nodeName, setSelectedNodeName(lastValue));

    // const filteredData = nodeMetricData.filter((data) => 
    // data === nodeName, selectedNodeName === "" ? 
    // setSelectedNodeName(lastValue) 
    // : 
    // null);
    // setSelectedNodeName(nodeName);

    console.log("NODE METRIC DATA", nodeMetricData)

    // const processedData = filteredData.flatMap((nodeData) => {
    //   return nodeData.nodeMetrics.map((metric) => {
    //     const timestamp = new Date(metric.date).getTime();
    //     return {
    //       x: timestamp,
    //       y: metric.cpuUsage
    //     }
    //   })
    // })
    // const processedData = filteredData.map((metric) => {
    //   const timestamp = new Date(metric.date).getTime();
    //   return {
    //     x: timestamp,
    //     y: metric.cpuUsage
    //   }
    // })
    // setContainerPowerUsage(processedData);
    // console.log("Container---------", JSON.stringify(filteredData))
    // console.log("Processed Data", processedData)
      // Process nodeMetrics data
      const processedData = nodeMetricData.map(metric => ({
          x: new Date(metric.date).getTime(),
          y: metric.cpuUsage
      }));

      // Update state with processed data
      setContainerPowerUsage(processedData);
  }

  const createNodeMetricData = (nodeCpuContainerData) => {
    let nodeNames = [];
    nodeCpuContainerData.forEach((nodeInfo) => {
      let nodeObject = {
        nodeName: nodeInfo.nodeName
      }
      nodeNames.push(nodeObject);
    })
    console.log("NODENAMES" + JSON.stringify(nodeNames));
    console.log(nodeNames)
    setNodeDisplayName(nodeNames);

    // Set the initial selected node name to the first node name
    if (nodeNames.length > 0) {
      setSelectedNodeName(nodeNames[0].nodeName);
    }

    processNodeData(nodeCpuContainerData, nodeNames[0].nodeName);
    console.log("node data", nodeCpuContainerData)
  }

  const nodeMetricsData = [
    {
      data: containerPowerUsage,
      title: `Node Container Data - ${selectedNodeName}`,
      yaxis: "CPU Usage"
    }
  ]

  console.log("Node Data-------", containerPowerUsage)
  console.log("node metric", nodeMetric)

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isLandscape = useMediaQuery(
      "(max-width: 1000px) and (orientation: landscape)"
  );

  const isiphone = useMediaQuery((theme) => theme.breakpoints.down("iphone"));

  const getNodeCpuMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNodeMetricData(selectedStartDate, selectedEndDate, lookBackVal.value);
      if (data.length !== 0) {
        setNodeMetric(data);
        createNodeMetricData(data);
        console.log("data---------", data)
      } else {
        setEmptyMessage("No Data to show");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error retrieving node metrics data:", error);
      setErrorMessage("An Error Occurred!");
      setLoading(false);
    }
  }, [selectedStartDate, selectedEndDate, lookBackVal, needHistoricalData]);

  const handleNodeClick = (clickedNodeName) => {
    console.log("NODE Name" + clickedNodeName);
    setSelectedNodeName(clickedNodeName);
    processNodeData(nodeMetric, clickedNodeName);
  }

    useEffect(() => {
        setInfraActiveTab(1);
        setInfraNodeActiveTab(0);
        
        getNodeCpuMetrics();
        return () => {
          setErrorMessage("");
          setEmptyMessage("");
        }
    }, [setErrorMessage, setEmptyMessage, setNavActiveTab, getNodeCpuMetrics])

    // const hasContainerNodeMetrics = nodeMetric.some((item) => item.nodeMetrics.length !== 0)

    const hasContainerNodeMetrics = nodeMetric?.some((item) => item.nodeMetrics?.length !== 0);

    // const hasContainerNodeMetrics = nodeMetric.some((item) => item.nodeMetrics && item.nodeMetrics.length !== 0);

    // const hasContainerNodeMetrics = nodeMetric && nodeMetric.some((item) => item.nodeMetrics && item.nodeMetrics.length !== 0);

    console.log("RENDER", hasContainerNodeMetrics)
    const node = nodeCpuMetricMock.nodeMetrics.length !== 0;
    console.log("METRIC DATA", node);


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
      ) : nodeCpuMetricMock.nodeMetrics.length !== 0 ? (
        <div style={{
          maxHeight: "73vh",
          minWidth: "100%"
        }}>

          <Grid container spacing={2}>
              <Grid item xs={12}>
                  <Card elevation={3} style={{ margin: "15px 25px 15px 25px", height: (isLandscape && isSmallScreen) ? "calc(120vh - 20px)" : "calc(75vh - 30px)",
                            ...(isiphone && {
                                height: "calc(100vh - 32px)",
                              }),
                             }}>
                      <CardContent>
                          <Box style={{ display: "flex", flexDirection: "row", }} >
                                  {hasContainerNodeMetrics ? (
                                    <Box style={{ width: "85%", paddingRight: "10px" }}>
                                      <NodeCpuMetricChart nodeMetrics={nodeMetricsData[0]} />
                                    </Box>
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

                              <div style={{ width: '35%', maxHeight: '490px', overflowY: 'auto' }}>
                                 <Table size="small" aria-label="a dense table" sx={{
                                                "& .MuiTableRow-root:hover": {
                                                    backgroundColor: 'lightgrey',
                                                }
                                            }} >
                                    <TableBody>
                                      <Typography>{selectedNodeName}</Typography>
                                    </TableBody>
                                  </Table>
                              </div>
                          </Box>
                      </CardContent>
                  </Card>
              </Grid>
          </Grid>

      </div>
      ) : null}
    </div>
  )
}

export default NodeCpuMetric