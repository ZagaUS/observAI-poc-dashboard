import {
  Box,
  Card,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { getClusterUtilization } from "../../../api/ClusterUtilizationApiService";
import { GlobalContext } from "../../../global/globalContext/GlobalContext";
import Loading from "../../../global/Loading/Loading";

function createData(resources, availability, capacity, usage) {
  return { resources, availability, capacity, usage };
}

const rows = [
  createData("CPU", "43.35", "50", "8.85"),
  createData("Memory Usage", "38.77", "48", "57.74 GiB"),
  createData("File System", "38.77", "48", "57.74 GiB"),
  createData("Network Transfer", "38.77", "48", "8.85"),
  createData("Pod Count", "38.77", "48", "8.85"),
];

const ClusterUtilization = () => {
  const {
    selectedStartDate,
    selectedEndDate,
    needHistoricalData,
    lookBackVal,
    nodeName, clusterName, setNodeName, setClusterName
  } = useContext(GlobalContext);
  const [clusterUtilization, setClusterUtilization] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emptyMessage, setEmptyMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleGetClusterUtilization = useCallback(async () => {
    try {
      setLoading(true);
      const clusterUtilData = await getClusterUtilization(
        selectedStartDate,
        selectedEndDate,
        lookBackVal.value,
        nodeName, clusterName
      );
      if (clusterUtilData.length !== 0) {
        const mappedData = clusterUtilData.flatMap((item) => [
          {
            resources: "CPU",
            // availability: ``,
            // capacity: ``,
            // usage: `${item.cpuUsage}`,
            usage: `${parseFloat((item.cpuUsage).toFixed(2))}`
          },
          {
            resources: "Memory",
            // availability: `${item.memoryAvailable} GB`,
            availability: `${parseFloat((item.memoryAvailable).toFixed(2))} GB`,
            // capacity: ``,
            // usage: `${item.memoryUsage} GB`,
            usage: `${parseFloat((item.memoryUsage).toFixed(2))} GB`
          },
          {
            resources: "FileSystem",
            // availability: `${item.fileSystemAvailable} GB`,
            availability: `${parseFloat((item.fileSystemAvailable).toFixed(2))} GB`,
            // capacity: `${item.fileSystemCapacity} GB`,
            capacity: `${parseFloat((item.fileSystemCapacity).toFixed(2))} GB`,
            // usage: `${item.fileSystemUsage} GB`,
            usage: `${parseFloat((item.fileSystemUsage).toFixed(2))} GB`
          },
        ]);

        const rowClusterData = mappedData.map((item) =>
          createData(
            item.resources,
            item.availability,
            item.capacity,
            item.usage
          )
        );
        setClusterUtilization(rowClusterData);
        setLoading(false);
      } else {
        setEmptyMessage("No Cluster Utilization Data");
      }
      setLoading(false);
      // setClusterUtilization(mappedData);
      // setClusterUtilization(clusterUtilData);
    } catch (error) {
      console.error("Error fetching Cluster Utilization Data:", error);
      setErrorMessage("Error in Displaying Cluster Utilization Data");
      setLoading(false);
    }
  }, [selectedStartDate, selectedEndDate, needHistoricalData, lookBackVal, 
    clusterName, nodeName
  ]);

  useEffect(() => {
    handleGetClusterUtilization();
    // console.log("------------cluster name------ " , clusterName)
    return () => {
      setErrorMessage("");
      setEmptyMessage("");
      
    };
  }, [handleGetClusterUtilization, setErrorMessage, setEmptyMessage]);

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
          <Typography variant="h5" fontWeight={"600"}>
            {errorMessage}
          </Typography>
        </div>
      ) : (
        <Box sx={{ p: 2, margin: "auto", maxWidth: 1250, flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card elevation={6}>
                <TableContainer component={Paper} sx={{ maxHeight: "350px" }}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Resource Name</TableCell>
                        <TableCell>Availability</TableCell>
                        <TableCell>Capacity</TableCell>
                        <TableCell>Usage</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {/* {rows.map((row) => (
                      <TableRow
                        key={row.resources}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        
                        <TableCell component="th" scope="row">{row.resources}</TableCell>
                        <TableCell component="th" scope="row">{row.availability} available of {row.capacity}</TableCell>
                        <TableCell component="th" scope="row">{row.usage}</TableCell>
                      </TableRow>
                    ))} */}
                      {clusterUtilization.map((row) => (
                        <TableRow
                          key={row.resources}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {row.resources}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.availability}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.capacity}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.usage}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </div>
  );
};

export default ClusterUtilization;
