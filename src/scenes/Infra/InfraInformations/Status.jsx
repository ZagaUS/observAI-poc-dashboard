import { Box, Card, CircularProgress, Typography } from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  ListOfNodeDetails,
  viewClusterDetails,
  viewClusterIPApiCall,
  viewClusterInfoApiCall,
  viewClusterInventoryApiCall,
  viewClusterNetworkApiCall,
  viewClusterNodeIPApiCall,
  viewClusterNodeInformation,
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
    selectedCluster,
    selectedNode,
    setSelectedNode,
    setInfraNodeActiveTab,
    setInfraActiveTab,
    setInfraInfoActiveTab,
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

  const [ClusterData, setClusterData] = useState([]);
  const [NodeData, setNodeData] = useState([]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const getSelectedClusterData = useCallback(
    async (selectedCluster) => {
      setEmptyMessage("");
      setErrorMessage("");
      // setLoading(true);

      try {
        const userDetails = JSON.parse(localStorage.getItem("userInfo"));
        const response = await viewClusterDetails(
          selectedCluster,
          userDetails.username
        );
        console.log("Status Page Response", response.data);
        if (response.data[0] == "You are not logged in.") {
          setClusterData([]);
          setEmptyMessage("Openshift is down please try again later!!!");
        } else {
          setClusterData(JSON.parse(JSON.stringify(response.data)));

          console.log("Clusterdata", response.data);
        }
      } catch (error) {
        console.log("ClusterStatusPage Error " + error);
        setErrorMessage(
          "Network Error !!! Unable to fetch cluster details at this time."
        );
      } finally {
        setLoading(false);
      }
    },
    [selectedCluster]
  );

  const getSelectedNodeData = useCallback(
    async (selectedNode) => {
      setClusterData([]);
      // setLoading(true);

      try {
        const userDetails = JSON.parse(localStorage.getItem("userInfo"));
        const response = await viewClusterNodeInformation(
          selectedCluster,
          selectedNode,
          userDetails.username
        );

        if (response.data[0] === "You are not logged in.") {
          setClusterData([]);
        } else {
          setClusterData(JSON.parse(JSON.stringify(response.data)));
          console.log("NodeData", response.data);
        }
      } catch (error) {
        console.log("getSelectedNodeData Error " + error);
      } finally {
        setLoading(false);
      }
    },
    [selectedNode]
  );

  useEffect(() => {
    console.log("useEffect StatusPage----->");
    console.log("Selected Node " + selectedNode);
    console.log("Selected Cluster" + selectedCluster);
    // setInfraActiveTab(0);
    // setInfraInfoActiveTab(0);
    // if (selectedNode.length > 0 && selectedCluster.length > 0) {
    //   // getSelectedNodeData(selectedNode);
    //   console.log("Getting Nodes Data...");
    // } else if (selectedCluster !== "") {
    //   // getSelectedClusterData(selectedCluster);
    //   console.log("Getting  Clusters Data...");
    // } else {
    //   console.log("Fetch cluster Details....");
    // }
    setLoading(true);
    if (selectedCluster.length > 0 && selectedNode.length > 0) {
      getSelectedNodeData(selectedCluster);
      // setLoading(false);
    } else {
      getSelectedClusterData(selectedCluster);
    }
  }, [getSelectedClusterData, getSelectedNodeData]);
  return (
    <div>
      {loading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "75vh",
          }}
        >
          <CircularProgress
            style={{ color: colors.blueAccent[400] }}
            size={80}
            thickness={4}
          />
          <Typography variant="h5" fontWeight={"600"} mt={2}>
            LOADING.....
          </Typography>
        </div>
      ) : emptyMessage ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "75vh",
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
            height: "75vh",
          }}
        >
          <Typography variant="h5" fontWeight={"600"}>
            {errorMessage}
          </Typography>
        </div>
      ) : ClusterData[0] != "You are unauthorized to do this action." ? (
        <div style={{ display: "flex" }}>
          {ClusterData.length > 0 ? (
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

                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", marginTop: "10px" }}
                >
                  Channel:
                  <br></br>{" "}
                  <Typography variant="h5">
                    {ClusterData[0].clusterInfo[0].channel}
                  </Typography>
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", marginTop: "10px" }}
                >
                  Cluster ID: <br></br>{" "}
                  <Typography variant="h5">
                    {ClusterData[0].clusterInfo[0].clusterID}
                  </Typography>
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", marginTop: "10px" }}
                >
                  Version:
                  <br></br>{" "}
                  <Typography variant="h5">
                    {ClusterData[0].clusterInfo[0].version}
                  </Typography>
                </Typography>

                {ClusterData[0].clusterIP[0].Hostname && (
                  <>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", marginTop: "10px" }}
                    >
                      Host Name:
                      <br></br>{" "}
                      <Typography variant="h5">
                        {ClusterData[0].clusterIP[0].Hostname}
                      </Typography>
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", marginTop: "10px" }}
                    >
                      Internal IP:
                      <br></br>{" "}
                      <Typography variant="h5">
                        {ClusterData[0].clusterIP[0].InternalIP}
                      </Typography>
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", marginTop: "10px" }}
                    >
                      Node Type:
                      <br></br>{" "}
                      <Typography variant="h5">
                        {ClusterData[0].clusterIP[0].nodeType}
                      </Typography>
                    </Typography>
                  </>
                )}

                {ClusterData[0].clusterNodes && (
                  <>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", marginTop: "10px" }}
                    >
                      API IP:
                      <br></br>{" "}
                      <Typography variant="h5">
                        {ClusterData[0].clusterIP[0].apiIP ||
                          ClusterData[0].clusterIP[0].apiServerInternalIP}
                      </Typography>
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", marginTop: "10px" }}
                    >
                      Ingress IP:
                      <br></br>{" "}
                      <Typography variant="h5">
                        {ClusterData[0].clusterIP[0].ingressIP}
                      </Typography>
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", marginTop: "10px" }}
                    >
                      Worker Nodes:
                      <br></br>{" "}
                      <Typography variant="h5">
                        {ClusterData[0].clusterNodes[0].workerNodes}
                      </Typography>
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", marginTop: "10px" }}
                    >
                      Control Plane Nodes:
                      <br></br>{" "}
                      <Typography variant="h5">
                        {ClusterData[0].clusterNodes[0].controlPlaneNodes}
                      </Typography>
                    </Typography>
                  </>
                )}
              </div>
              <div style={{ marginTop: "40px" }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", marginTop: "10px" }}
                >
                  CIDIR:
                  <br></br>{" "}
                  <Typography variant="h5">
                    {ClusterData[0].clusterNetwork[0].cidr}
                  </Typography>
                </Typography>

                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", marginTop: "10px" }}
                >
                  Host Prefix:
                  <br></br>{" "}
                  <Typography variant="h5">
                    {ClusterData[0].clusterNetwork[0].hostPrefix}
                  </Typography>
                </Typography>

                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", marginTop: "10px" }}
                >
                  Network Type:
                  <br></br>{" "}
                  <Typography variant="h5">
                    {ClusterData[0].clusterNetwork[0].networkType}
                  </Typography>
                </Typography>

                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", marginTop: "10px" }}
                >
                  Service Network:
                  <br></br>{" "}
                  <Typography variant="h5">
                    {ClusterData[0].clusterNetwork[0].serviceNetwork}
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
                // backgroundColor: "red",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: "300px",
                height: "35vh",
              }}
            >
              {ClusterData.length > 0 ? (
                <Card elevation={5} sx={{ padding: "10px", height: "35vh" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", paddingBottom: "10px" }}
                  >
                    Cluster Status Data
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: "200px" }}>
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
                            <Typography variant="h5">
                              {" "}
                              Component Name
                            </Typography>
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
                        {ClusterData[0].clusterStatus.map((row, index) => (
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
              ) : (
                <>No data to show</>
              )}
            </div>

            <div
              style={{
                // backgroundColor: "blue",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: "300px",
                height: "33vh",
              }}
            >
              {ClusterData.length > 0 ? (
                <Card
                  elevation={5}
                  sx={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "33vh",
                  }}
                >
                  <div>
                    {ClusterData[0].clusterInventory && (
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", paddingBottom: "10px" }}
                      >
                        Cluster Inventory Data
                      </Typography>
                    )}
                    {ClusterData[0].nodeInventory && (
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", paddingBottom: "10px" }}
                      >
                        Node Inventory Data
                      </Typography>
                    )}
                    <TableContainer
                      component={Paper}
                      sx={{ maxHeight: "220px", width: "275px" }}
                    >
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
                              <Typography variant="h5">
                                {" "}
                                Resourse Name
                              </Typography>
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
                          {ClusterData[0].nodeInventory && (
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
                                  {ClusterData[0].nodeInventory}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}

                          {ClusterData[0].clusterInventory && (
                            <>
                              {" "}
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
                                    {ClusterData[0].clusterInventory[0].Pods}
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
                                    {ClusterData[0].clusterInventory[0].Node}
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
                                    {
                                      ClusterData[0].clusterInventory[0]
                                        .PersistentVolumeClaims
                                    }{" "}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  style={{
                                    padding: "4px 8px",
                                  }}
                                >
                                  <Typography variant="h5">
                                    StorageClass
                                  </Typography>
                                </TableCell>
                                <TableCell
                                  style={{
                                    padding: "4px 8px",
                                  }}
                                >
                                  <Typography variant="h5">
                                    {" "}
                                    {
                                      ClusterData[0].clusterInventory[0]
                                        .StorageClass
                                    }
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </Card>
              ) : (
                <>No Data To Show !!!</>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "75vh",
          }}
        >
          <Typography variant="h5" fontWeight={"600"}>
            Oops!!....Something went wrong with the openshift environment
          </Typography>
        </div>
      )}
    </div>
    // <>
    //   {loading ? (
    //     <>loading plz wait</>
    //   ) : (
    //     <>
    //       {ClusterData.length > 0 ? (
    //         <Card
    //           elevation={5}
    //           sx={{
    //             height: "70vh",
    //             width: "75%",
    //             display: "flex",
    //             justifyContent: "space-between",
    //             margin: "20px 5px 20px 20px",
    //             padding: "10px",
    //           }}
    //         >
    //           <div>
    //             <Typography
    //               variant="h3"
    //               sx={{ fontWeight: "bold", paddingBottom: "10px" }}
    //             >
    //               Cluster Data
    //             </Typography>

    //             <Typography
    //               variant="h5"
    //               sx={{ fontWeight: "bold", marginTop: "10px" }}
    //             >
    //               Channel:
    //               <br></br>{" "}
    //               <Typography variant="h5">
    //                 {ClusterData[0].clusterInfo[0].channel}
    //                 {/* {ClusterData[0].clusterInfo[0]} */}
    //               </Typography>
    //             </Typography>
    //             <Typography
    //               variant="h5"
    //               sx={{ fontWeight: "bold", marginTop: "10px" }}
    //             >
    //               Cluster ID: <br></br>{" "}
    //               <Typography variant="h5">
    //                 {ClusterData[0].clusterInfo[0].clusterID}
    //               </Typography>
    //             </Typography>
    //             <Typography
    //               variant="h5"
    //               sx={{ fontWeight: "bold", marginTop: "10px" }}
    //             >
    //               Version:
    //               <br></br>{" "}
    //               <Typography variant="h5">
    //                 {ClusterData[0].clusterInfo[0].version}
    //               </Typography>
    //             </Typography>
    //           </div>
    //         </Card>
    //       ) : (
    //         <h1>No data found</h1>
    //       )}

    //       {selectedCluster ? <h1>{selectedCluster}</h1> : <h1>no cluster</h1>}
    //       {selectedNode ? <h1>{selectedNode}</h1> : <h1>no node</h1>}
    //     </>
    //   )}
    // </>
  );
};

export default Status;
