import { Box, Card, Typography } from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  viewClusterIPApiCall,
  viewClusterInfoApiCall,
  viewClusterInventoryApiCall,
  viewClusterNetworkApiCall,
  viewClusterNodeIPApiCall,
  viewClusterNodesApiCall,
  viewClusterStatusApiCall,
} from "../../../api/ClusterApiService";
import { GlobalContext } from "../../../global/globalContext/GlobalContext";
import Loading from "../../../global/Loading/Loading";
import { openshiftClusterLogin } from "../../../api/LoginApiService";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { tokens } from "../../../theme";
import { useTheme } from "@emotion/react";

const Status = () => {
  const {
    needStatusCall,
    setNeedStatusCall,
    selectedCluster,
    services,
    selectedService,
  } = useContext(GlobalContext);

  const [loading, setLoading] = useState(false);
  const [emptyMessage, setEmptyMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [clusterInfo, setClusterInfo] = useState([]);
  const [clusterInventory, setClusterInventory] = useState([]);
  const [clusterStatus, setClusterStatus] = useState([]);
  const [NodeLists, setNodeList] = useState([]);
  const [NodeIP, setNodeIPD] = useState([]);
  const [IpTableData, setIpTableData] = useState([]);
  const [NetworkData, setNetworkData] = useState([]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const getSelectedClusterData = useCallback(async (selectedCluster) => {
    setLoading(true);

    try {
      const Environments = JSON.parse(localStorage.getItem("environmetsData"));

      const SelectedEnvironment = Environments.filter((items) => {
        return items.hostUrl == selectedCluster;
      });

      const ClusterUrl = SelectedEnvironment[0].hostUrl;
      const ClusterPassword = SelectedEnvironment[0].clusterPassword;
      const ClusterUsername = SelectedEnvironment[0].clusterUsername;

      const response = await openshiftClusterLogin(
        ClusterUrl,
        ClusterPassword,
        ClusterUsername
      );
      if (response === "Login successful!") {
        const ClusterInfoResponse = await viewClusterInfoApiCall();
        const ClusterIPResponse = await viewClusterIPApiCall();
        const ClusterInventoryResponse = await viewClusterInventoryApiCall();
        const ClusterNetworkResponse = await viewClusterNetworkApiCall();
        const ClusterNodesResponse = await viewClusterNodesApiCall();
        const ClusterStatusResponse = await viewClusterStatusApiCall();
        const ClusterNodeIPResponse = await viewClusterNodeIPApiCall();

        console.log("ClusterInfoResponse", ClusterInfoResponse.data);
        console.log("ClusterIPResponse", ClusterIPResponse.data);
        console.log("ClusterInventoryResponse", ClusterInventoryResponse.data);
        console.log("ClusterNetworkResponse", ClusterNetworkResponse.data);
        console.log("ClusterNodesResponse", ClusterNodesResponse.data);
        console.log("ClusterStatusResponse", ClusterStatusResponse.data);
        console.log("ClusterNodeIPResponse", ClusterNodeIPResponse.data);

        setClusterInfo(ClusterInfoResponse.data);
        setNetworkData(ClusterNetworkResponse.data);
        setClusterInventory(ClusterInventoryResponse.data);
        setClusterStatus(ClusterStatusResponse.data);
        setNodeList(ClusterNodesResponse.data);
        setIpTableData(ClusterIPResponse.data);
        setNodeIPD(ClusterNodeIPResponse.data);
      } else if (response === "Incorrect username or password.") {
        alert("Incorrect username or password.");
      } else {
        alert("Network Error !!.Please try again later.");
      }
    } catch {}
    setLoading(false);

    //   const fetchData = async () => {
    //     try {

    //     } catch (error) {
    //       console.error("Error fetching data:", error);
    //     }
    //   };

    //   fetchData();

    // try {
    //   const response = await viewClusterInfoApiCall();
    //   if (response.length !== 0) {
    //     setData(JSON.parse(JSON.stringify(response.data)));
    //     console.log(response.data, "data");

    //     // handleMetricData(metricData);
    //     // setErrorMessage("");
    //     // setEmptyMessage("");
    //   } else {
    //     // console.log("No metric data");
    //     // handleMetricData(metricData);
    //     // setEmptyMessage("No Metric Data to show!");
    //   }
    // } catch (error) {
    //   console.log("metric data Error " + error);
    //   // setErrorMessage("An error occurred!");
    // } finally {
    //   setNeedStatusCall(true);
    //   setLoading(false);
    // }
  }, []);

  useEffect(() => {
    console.log("useEffect STATUS");
    // console.log("Selected Service " + selectedService);
    console.log("Selected selectedCluster " + selectedCluster);
    // if (!needStatusCall) {
    getSelectedClusterData(selectedCluster);
    // }
  }, [selectedCluster]);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div style={{ display: "flex" }}>
          {clusterInfo.length > 0 &&
          NetworkData.length > 0 &&
          IpTableData.length > 0 &&
          NodeIP.length > 0 ? (
            // NodeLists.length > 0
            <Card
              elevation={5}
              sx={{
                height: "70vh",
                width: "75%",
                display: "flex",
                justifyContent: "space-between",
                margin: "20px 5px 20px 20px",
                padding: "10px",
              }}
            >
              <div>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: "bold", paddingBottom: "10px" }}
                >
                  Cluster Data
                </Typography>
                {/* <p>Channel: {clusterInfo[0].channel}</p>
                <p>Cluster ID: {clusterInfo[0].clusterID}</p>
                <p>Version: {clusterInfo[0].version}</p>
                <p>Hostname: {IpTableData[0].Hostname}</p>
                <p>InternalIP: {IpTableData[0].InternalIP}</p> */}
                <>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", marginTop: "10px" }}
                  >
                    Channel:
                    <br></br>{" "}
                    <Typography variant="h5">
                      {clusterInfo[0].channel}
                    </Typography>
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", marginTop: "10px" }}
                  >
                    Cluster ID: <br></br>{" "}
                    <Typography variant="h5">
                      {clusterInfo[0].clusterID}
                    </Typography>
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", marginTop: "10px" }}
                  >
                    Version:
                    <br></br>{" "}
                    <Typography variant="h5">
                      {clusterInfo[0].version}
                    </Typography>
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", marginTop: "10px" }}
                  >
                    Host Name:
                    <br></br>{" "}
                    <Typography variant="h5">{NodeIP[0].Hostname}</Typography>
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", marginTop: "10px" }}
                  >
                    Internal IP:
                    <br></br>{" "}
                    <Typography variant="h5">{NodeIP[0].InternalIP}</Typography>
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", marginTop: "10px" }}
                  >
                    Node Type:
                    <br></br>{" "}
                    <Typography variant="h5">{NodeIP[0].nodeType}</Typography>
                  </Typography>

                  {/* <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", marginTop: "10px" }}
                  >
                    ControlPanalNodes:
                    <br></br>{" "}
                    <Typography variant="h5">
                      {NodeLists[0].controlPlaneNodes}
                    </Typography>
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", marginTop: "10px" }}
                  >
                    WorkerNodes:
                    <br></br>{" "}
                    <Typography variant="h5">
                      {NodeLists[0].workerNodes}
                    </Typography>
                  </Typography> */}
                </>
              </div>
              <div style={{ marginTop: "40px" }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", marginTop: "10px" }}
                >
                  CIDIR:
                  <br></br>{" "}
                  <Typography variant="h5">{NetworkData[0].cidr}</Typography>
                </Typography>

                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", marginTop: "10px" }}
                >
                  Host Prefix:
                  <br></br>{" "}
                  <Typography variant="h5">
                    {NetworkData[0].hostPrefix}
                  </Typography>
                </Typography>

                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", marginTop: "10px" }}
                >
                  Network Type:
                  <br></br>{" "}
                  <Typography variant="h5">
                    {NetworkData[0].networkType}
                  </Typography>
                </Typography>

                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", marginTop: "10px" }}
                >
                  Service Network:
                  <br></br>{" "}
                  <Typography variant="h5">
                    {NetworkData[0].serviceNetwork}
                  </Typography>
                </Typography>
              </div>
            </Card>
          ) : (
            <h4>No data to show</h4>
          )}

          <div
            style={{
              // backgroundColor: "green",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              maxHeight: "70vh",
              width: "310px",
              margin: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "300px",
                maxheight: "38vh",
              }}
            >
              <Card elevation={5} sx={{ padding: "10px", maxheight: "38vh" }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", paddingBottom: "10px" }}
                >
                  Cluster Status Data
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: "220px" }}>
                  <Table>
                    <TableHead
                      style={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: colors.primary[400],
                      }}
                    >
                      <TableRow>
                        <TableCell
                          style={{
                            fontSize: "12px",
                            padding: "4px 8px",
                          }}
                        >
                          <Typography variant="h5"> Component Name</Typography>
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "12px",
                            padding: "0px 0px 0px 25px",
                          }}
                        >
                          <Typography variant="h5">Status</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {clusterStatus.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell
                            style={{ fontSize: "12px", padding: "4px 8px" }}
                          >
                            <Typography variant="h5"> {row.name} </Typography>
                          </TableCell>
                          <TableCell
                            style={{
                              fontSize: "12px",
                              padding: "4px 8px",
                            }}
                          >
                            <TableCell
                              style={{
                                fontSize: "12px",
                                padding: "4px 8px",
                                paddingBottom: 0,
                              }}
                            >
                              {row.condition === "Healthy" && (
                                <FiberManualRecordIcon
                                  style={{ color: "green" }}
                                />
                              )}
                            </TableCell>
                            <TableCell
                              style={{
                                fontSize: "12px",
                                padding: "4px 8px",
                                paddingBottom: 0,
                              }}
                            >
                              <Typography variant="h5">
                                {row.condition}
                              </Typography>
                            </TableCell>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </div>

            {/* --------------------------------------------------------------------------------------------------------------------------------------- */}

            <div
              style={{
                // backgroundColor: "blue",
                display: "flex",
                flexDirection: "column",
                width: "300px",
                maxheight: "30vh",
              }}
            >
              {clusterInventory.length > 0 ? (
                <Card elevation={5} sx={{ padding: "10px", maxheight: "30vh" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", paddingBottom: "10px" }}
                  >
                    Cluster Inventory Data
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: "210px" }}>
                    <Table>
                      <TableHead
                        style={{
                          position: "sticky",
                          top: 0,
                          backgroundColor: colors.primary[400],
                        }}
                      >
                        <TableRow>
                          <TableCell
                            style={{
                              fontSize: "12px",
                              padding: "4px 8px",
                            }}
                          >
                            <Typography variant="h5"> Resourse Name</Typography>
                          </TableCell>
                          <TableCell
                            style={{
                              fontSize: "12px",
                              padding: "0px 0px 0px 0px",
                            }}
                          >
                            <Typography variant="h5">Count</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow
                          style={{
                            padding: "4px 8px",
                          }}
                        >
                          <TableCell
                            style={{
                              padding: "4px 8px",
                            }}
                          >
                            <Typography variant="h5">Pods</Typography>
                          </TableCell>
                          <TableCell
                            style={{
                              padding: "4px 8px",
                            }}
                          >
                            <Typography variant="h5">
                              {clusterInventory[0].Pods}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow
                          style={{
                            padding: "4px 8px",
                          }}
                        >
                          <TableCell
                            style={{
                              padding: "4px 8px",
                            }}
                          >
                            <Typography variant="h5">Node</Typography>
                          </TableCell>
                          <TableCell
                            style={{
                              padding: "4px 8px",
                            }}
                          >
                            <Typography variant="h5">
                              {" "}
                              {clusterInventory[0].Node}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow
                          style={{
                            padding: "4px 8px",
                          }}
                        >
                          <TableCell
                            style={{
                              padding: "4px 8px",
                            }}
                          >
                            <Typography variant="h5">
                              PersistentVolumeClaims
                            </Typography>
                          </TableCell>
                          <TableCell
                            style={{
                              padding: "4px 8px",
                            }}
                          >
                            <Typography variant="h5">
                              {" "}
                              {clusterInventory[0].PersistentVolumeClaims}{" "}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            style={{
                              padding: "4px 8px",
                            }}
                          >
                            <Typography variant="h5">StorageClass</Typography>
                          </TableCell>
                          <TableCell
                            style={{
                              padding: "4px 8px",
                            }}
                          >
                            <Typography variant="h5">
                              {" "}
                              {clusterInventory[0].StorageClass}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              ) : (
                <>No Data To Show !!!</>
              )}
            </div>

            {/* {clusterInventory.length > 0 ? (
              <div
                style={{
                  width: "300px",
                  minHeight: "30vh",
                  maxHeight: "30vh",
                }}
              >
                <Card
                  elevation={5}
                  sx={{ padding: "10px", minHeight: "30vh", maxHeight: "30vh" }}
                >
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    Cluster Inventory Data
                  </Typography>
                  <p>Pods: {clusterInventory[0].Pods}</p>
                  <p>Node: {clusterInventory[0].Node}</p>
                  <p>
                    PersistentVolumeClaims :{" "}
                    {clusterInventory[0].PersistentVolumeClaims}
                  </p>
                  <p>StorageClass: {clusterInventory[0].StorageClass}</p>
                </Card>
              </div>
            ) : (
              <>No data to show</>
            )} */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Status;
