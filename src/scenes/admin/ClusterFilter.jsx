import React, { useCallback, useEffect, useState } from "react";
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
import { loginUser, openshiftClusterLogin } from "../../api/LoginApiService";
import { ClusterDetailsMock } from "../../global/MockData/ClusterDetailsMock";
import { MenuItem } from "react-pro-sidebar";
import { ListOfNodeDetails } from "../../api/ClusterApiService";
import Loading from "../../global/Loading/Loading";

const ClusterFilter = () => {
  const { selectedCluster, setSelectedCluster, selectedNode, setSelectedNode } =
    useContext(GlobalContext);

  const [clusters, setClusters] = useState(
    JSON.parse(localStorage.getItem("clusterListData"))
  );
  const [emptyMessage, setEmptyMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [Nodes, setNodes] = useState([]);

  const [loading, setLoading] = useState(false);

  // console.log("selectedCluster", selectedCluster);
  // console.log("ClustersCollection", clusters);

  const fetchNodes = useCallback(async () => {
    setEmptyMessage("");
    setLoading(true);
    try {
      const userDetails = JSON.parse(localStorage.getItem("userInfo"));

      const NodeResponse = await ListOfNodeDetails(
        selectedCluster,
        userDetails.username
      );
      if (NodeResponse.data == "You are unauthorized to do this action.") {
        setNodes([]);
        setEmptyMessage("Openshift is down please try again later!!!");
        console.log(NodeResponse.data, "Nodesdata");
      } else {
        setNodes(NodeResponse.data);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCluster]);

  useEffect(() => {
    console.log("UseEffect FilterPage-->");
    console.log("Selected Cluster" + selectedCluster);
    fetchNodes();
  }, [fetchNodes]);

  // const [clusters, setClusters] = useState(
  //   JSON.parse(localStorage.getItem("ListOfClusterDetails"))
  // );

  // const ClusterInformations = ClusterDetailsMock;
  // console.log("ClusterInformations", ClusterInformations);

  // useEffect(() => {
  //   console.log("useeffet called");

  //   const fetchData = async () => {
  //     try {
  //       const ClusterUrl = Environments[0].hostUrl;
  //       const ClusterPassword = Environments[0].clusterPassword;
  //       const ClusterUsername = Environments[0].clusterUsername;

  //       const response = await openshiftClusterLogin(
  //         ClusterUrl,
  //         ClusterPassword,
  //         ClusterUsername
  //       );

  //       // console.log("clusterData filter Page", response);

  //       if (response === "Login successful!") {
  //         setNeedStatusCall(true);
  //       } else if (response === "Incorrect username or password.") {
  //         alert("Incorrect username or password.");
  //       } else {
  //         alert("Network Error !!.Please try again later.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [selectedCluster]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isiphone = useMediaQuery((theme) => theme.breakpoints.down("iphone"));
  const isipadpro = useMediaQuery((theme) =>
    theme.breakpoints.down("isipadpro")
  );
  const largem = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  // const handleNodeToggle = (node) => () => {
  //   setSelectedNode([node]);
  // };

  const handleNodeToggle = (node) => () => {
    // setSelectedNode([node]);
    setSelectedNode((prevSelected) =>
      prevSelected.includes(node) ? [] : [node]
    );
    // You can update the setSelectedNode here if you want to set the value after the checkbox is clicked
    // setSelectedNode((prevSelected) => {
    //   if (prevSelected.includes(node)) {
    //     // If node is already selected, remove it
    //     return prevSelected.filter((selected) => selected !== node);
    //   } else {
    //     // If node is not selected, add it
    //     return [...prevSelected, node];
    //   }
    // });
  };

  const handleServiceToggle = (clusterName) => () => {
    setSelectedNode([]);
    if (selectedCluster.includes(clusterName)) {
      setSelectedCluster(
        selectedCluster.filter((item) => item !== clusterName)
      );
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

        // height: (isLandscape && isSmallScreen) ? "calc(90vh - 24px)" :"calc(850vh - 40px)",
        ...(isipadpro && {
          height: "calc(850vh - 32px)",
        }),

        // height: (isLandscape && isSmallScreen) ? "calc(90vh - 24px)" :"calc(850vh - 40px)",
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
                  {clusters.map((clusters) => (
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
                  ))}
                </RadioGroup>
              </FormControl>
            </AccordionDetails>
          </Accordion>
        </ListItem>

        {loading ? (
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
        ) : emptyMessage ? (
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
        ) : (
          <ListItem>
            <Accordion
              style={{ width: "500px", backgroundColor: colors.primary[400] }}
            >
              {Nodes.length > 0 ? (
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
                      {Nodes.map((nodes) => (
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
        )}

        <Divider />
      </List>
    </div>
  );
};

export default ClusterFilter;
