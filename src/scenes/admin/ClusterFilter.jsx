import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { useContext } from "react";
import { GlobalContext } from "../../global/globalContext/GlobalContext";
import { getMetricDataApi } from "../../api/MetricApiService";
import { tokens } from "../../theme";
import {
  getActiveClustersAPI,
  getAllClustersAPI,
  loginUser,
  openshiftClusterLogin,
} from "../../api/LoginApiService";
import { ClusterDetailsMock } from "../../global/MockData/ClusterDetailsMock";
import { MenuItem } from "react-pro-sidebar";
import { ListOfNodeDetails } from "../../api/ClusterApiService";
import Loading from "../../global/Loading/Loading";

const ClusterFilter = () => {
  const {
    selectedCluster,
    setSelectedCluster,
    selectedNode,
    setSelectedNode,
    username,
    setUsername,
    nodeDetails,
    setNodeDetails,
  } = useContext(GlobalContext);

  // const [clusters, setClusters] = useState(
  //   JSON.parse(localStorage.getItem("clusterListData"))
  // );
  // const [clusterListData, setClusterListData] = useState([]);

  const [clusters, setClusters] = useState([]);

  const [emptyMessage, setEmptyMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [ClusterLoading, setClusterLoading] = useState(false);

  const [Nodes, setNodes] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchNodes = useCallback(async () => {
    // setEmptyMessage("");
    setErrorMessage("");
    setLoading(true);
    try {
      const userDetails = JSON.parse(localStorage.getItem("userInfo"));
      const ClusterDetails = await getActiveClustersAPI(userDetails.username);
      console.log("--------[FILTER PAGE]-----------", ClusterDetails.length);
      if (ClusterDetails === "Technical Exception error for this action") {
        setErrorMessage("Something went wrong with the database");
        setSelectedCluster([]);
        setClusters([]);
      }
      if (ClusterDetails.length === 0) {
        console.log("-------[CLUSTER DETAILS]-----------");
        setErrorMessage("No active cluster available");
        // setSelectedCluster([]);
      }
      if (ClusterDetails.length > 0 && selectedCluster.length === 0) {
        setSelectedCluster([ClusterDetails[0].clusterName]);
        setClusters(ClusterDetails);
        const NodeResponse = await ListOfNodeDetails(
          ClusterDetails[0].clusterName,
          userDetails.username
        );
        if (NodeResponse.data == "You are unauthorized to do this action.") {
          setNodes([]);
          setNodeDetails([]);
          setEmptyMessage("Openshift is down please try again later!!!");
          console.log(NodeResponse.data, "Nodesdata");
        } else {
          console.log(NodeResponse.data, "Nodesdata");
          setNodes(NodeResponse.data);
          setNodeDetails(NodeResponse.data);
        }
      } else {
        setClusters(ClusterDetails);
        const NodeResponse = await ListOfNodeDetails(
          selectedCluster,
          userDetails.username
        );
        if (NodeResponse.data == "You are unauthorized to do this action.") {
          setNodes([]);
          setNodeDetails([]);
          setEmptyMessage("Openshift is down please try again later!!!");
          console.log(NodeResponse.data, "Nodesdata");
        } else {
          console.log(NodeResponse.data, "Nodesdata");
          setNodes(NodeResponse.data);
          setNodeDetails(NodeResponse.data);
        }
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCluster]);

  // useEffect(() => {
  //   console.log("UseEffect FilterPage-->");
  //   console.log("Selected Cluster" + selectedCluster);
  //   console.log("userName Cluster Filter Page", username);
  //   fetchNodes();
  // }, [selectedCluster]);

  const [inputValue, setInputValue] = useState(selectedCluster[0]);
  const previousInputValue = useRef(selectedCluster[0]);

  useEffect(() => {
    console.log("UseEffectCalled-->");
    console.log("Selected_Cluster" + selectedCluster);
    previousInputValue.current = inputValue;
    fetchNodes();
  }, [inputValue, fetchNodes]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isiphone = useMediaQuery((theme) => theme.breakpoints.down("iphone"));
  const isipadpro = useMediaQuery((theme) =>
    theme.breakpoints.down("isipadpro")
  );
  const largem = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  const handleNodeToggle = (node) => () => {
    setSelectedNode((prevSelected) =>
      prevSelected.includes(node) ? [] : [node]
    );
  };

  const handleServiceToggle = (clusterName) => () => {
    setSelectedNode([]);
    if (selectedCluster.includes(clusterName)) {
      setSelectedCluster(
        selectedCluster.filter((item) => item !== clusterName)
      );
      setInputValue(clusterName);
    } else {
      setSelectedCluster([clusterName]);
    }
  };

  return (
    <div
      className="custom-drawer"
      style={{
        width: "245px",
        backgroundColor: colors.primary[400],
        overflowY: "auto",
        height: "82vh",

        ...(isiphone && {
          height: "calc(450vh - 32px)",
        }),
        ...(isipadpro && {
          height: "calc(850vh - 32px)",
        }),

        ...(largem && {
          height: "calc(1200vh - 32px)",
        }),
      }}
    >
      <style>
        {`

      .custom-drawer::-webkit-scrollbar-thumb {
        background-color: ${colors.primary[400]}; /* Color of the thumb */
        border-radius: 6px; /* Roundness of the thumb */
      }

      .custom-drawer::-webkit-scrollbar-track {
        background-color: ${colors.primary[400]}; /* Color of the track */
      }
    `}
      </style>
      <List>
        <ListItem
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {window.location.pathname === "/mainpage/infraPod" ||
          window.location.pathname === "/mainpage/infraPod/podMemory" ||
          window.location.pathname === "/mainpage/infraNode" ||
          window.location.pathname === "/mainpage/infraNode/nodeMemory" ||
          window.location.pathname === "/mainpage/infraInfo" ||
          window.location.pathname === "/mainpage/infraInfo/cpuUtilization" ||
          window.location.pathname === "/mainpage/infraInfo/alerts" ||
          window.location.pathname === "/mainpage/infraInfo/events" ? (
            <Typography variant="h5" fontWeight="500" color={"#fff"}>
              List of Clusters & Nodes
            </Typography>
          ) : (
            <Typography variant="h5" fontWeight="500" color={"#fff"}>
              Filter Options
            </Typography>
          )}
        </ListItem>
        <Divider />

        <ListItem>
          <Accordion
            style={{ width: "500px", backgroundColor: colors.primary[400] }}
            defaultExpanded
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5" color={"#fff"}>
                Clusters
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <FormControl component="fieldset">
                <RadioGroup
                  value={selectedCluster}
                  sx={{
                    color: theme.palette.mode === "light" ? "#000" : "#FFF",
                  }}
                >
                  {errorMessage ? (
                    <div>
                      <Typography variant="h5" fontWeight={"600"} mt={2}>
                        {errorMessage}
                      </Typography>
                    </div>
                  ) : (
                    clusters.map((clusters) => (
                      <FormControlLabel
                        key={clusters.clusterName}
                        value={clusters.clusterName}
                        control={
                          <Radio sx={{ "&.Mui-checked": { color: "white" } }} />
                        }
                        label={clusters.clusterName}
                        sx={{
                          color: "white",
                        }}
                        onChange={handleServiceToggle(clusters.clusterName)}
                      />
                    ))
                  )}

                  {/* {clusters &&
                    clusters.map((clusters) => (
                      <FormControlLabel
                        key={clusters}
                        value={clusters}
                        control={
                          <Radio sx={{ "&.Mui-checked": { color: "white" } }} />
                        }
                        label={clusters}
                        sx={{
                          color: "white",
                        }}
                        onChange={handleServiceToggle(clusters)}
                      />
                    ))} */}
                </RadioGroup>
              </FormControl>
            </AccordionDetails>
          </Accordion>
        </ListItem>

        {loading ? (
          window.location.pathname !== "/mainpage/infraInfo/events" &&
          window.location.pathname !==
            "/mainpage/infraInfo/events/allEvents" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "20vh",
              }}
            >
              <CircularProgress
                style={{ color: colors.blueAccent[400] }}
                size={40}
                thickness={4}
              />
              <Typography variant="h5" fontWeight={"600"} mt={2}>
                LOADING.....
              </Typography>
            </div>

            // <div
            //   style={{
            //     display: "flex",
            //     flexDirection: "column",
            //     justifyContent: "center",
            //     alignItems: "center",
            //     width: "100%",
            //     height: "20vh",
            //   }}
            // >
            //   {window.location.pathname !== "/mainpage/infraInfo/events" ? (
            //     <>
            //       {" "}
            //       <CircularProgress
            //         style={{ color: colors.blueAccent[400] }}
            //         size={40}
            //         thickness={4}
            //       />
            //       <Typography variant="h5" fontWeight={"600"} mt={2}>
            //         LOADING.....
            //       </Typography>
            //     </>
            //   ) : null}
            // </div>
          )
        ) : emptyMessage ? (
          window.location.pathname !== "/mainpage/infraInfo/events" &&
          window.location.pathname !==
            "/mainpage/infraInfo/events/allEvents" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "20vh",
              }}
            >
              <Typography variant="h5" fontWeight={"600"} mt={2}>
                {emptyMessage}
              </Typography>
            </div>
            // <div
            //   style={{
            //     display: "flex",
            //     flexDirection: "column",
            //     justifyContent: "center",
            //     alignItems: "center",
            //     width: "100%",
            //     height: "20vh",
            //   }}
            // >
            //   {window.location.pathname !== "/mainpage/infraInfo/events" ? (
            //     <Typography variant="h5" fontWeight={"600"} mt={2}>
            //       {emptyMessage}
            //     </Typography>
            //   ) : null}
            // </div>
          )
        ) : window.location.pathname !== "/mainpage/infraInfo/events" &&
          window.location.pathname !==
            "/mainpage/infraInfo/events/allEvents" ? (
          <ListItem>
            <Accordion
              style={{ width: "500px", backgroundColor: colors.primary[400] }}
            >
              {nodeDetails.length > 0 ? (
                <AccordionDetails>
                  <Typography variant="h5" color={"#fff"}>
                    Nodes
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={selectedNode}
                      sx={{
                        color: theme.palette.mode === "light" ? "#000" : "#FFF",
                      }}
                    >
                      {nodeDetails.map((nodes) => (
                        <FormControlLabel
                          key={nodes}
                          value={nodes}
                          control={
                            <Radio
                              sx={{ "&.Mui-checked": { color: "white" } }}
                            />
                          }
                          label={nodes}
                          sx={{
                            color: "white",
                          }}
                          onChange={handleNodeToggle(nodes)}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </AccordionDetails>
              ) : (
                //  <AccordionDetails>
                //   <Typography variant="h5" color={"#fff"}>
                //     Nodes
                //   </Typography>
                //   <FormControl component="fieldset">
                //     <FormGroup>
                //       {Nodes.map((nodes) => (
                //         <FormControlLabel
                //           key={nodes}
                //           control={
                //             <Checkbox
                //               checked={selectedNode.includes(nodes)}
                //               onChange={() => handleNodeToggle(nodes)}
                //               sx={{ "&.Mui-checked": { color: "white" } }}
                //             />
                //           }
                //           label={nodes}
                //           sx={{
                //             color: "white",
                //           }}
                //         />
                //       ))}
                //     </FormGroup>
                //   </FormControl>
                // </AccordionDetails>
                // <AccordionDetails>

                // <AccordionDetails>
                //   <List sx={{ width: "100%", maxWidth: 360 }}>
                //     {Nodes.map((node) => (
                //       <ListItem
                //         key={node}
                //         button
                //         selected={selectedNode === node}
                //         onClick={() => handleNodeToggle(node)}
                //       >
                //         <ListItemText
                //           sx={{
                //             backgroundColor:
                //               selectedNode === node ? "blue" : "red", // Change background color for selected node
                //           }}
                //           primary={node}
                //         />
                //       </ListItem>
                //     ))}
                //   </List>
                // </AccordionDetails>
                <div>
                  <Typography variant="h5" fontWeight={"600"} mt={2}>
                    Unable to fetch node details at this time.
                  </Typography>
                </div>
              )}
            </Accordion>
          </ListItem>
        ) : null}

        <Divider />
      </List>
    </div>
  );
};

export default ClusterFilter;
