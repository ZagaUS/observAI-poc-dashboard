import React, { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  List,
  ListItem,
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

const ClusterFilter = () => {
  const { selectedCluster, setSelectedCluster, setNeedStatusCall } =
    useContext(GlobalContext);

  const [clusters, setClusters] = useState(
    JSON.parse(localStorage.getItem("clusterListData"))
  );

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

  const handleServiceToggle = (clusterURL) => () => {
    // console.log("index", clusterURL);
    // setOpenDrawer(!openDrawer)
    // if (selectedService.includes(service)) {
    //   setSelectedService(selectedService.filter((item) => item !== service));
    // } else {
    //   setSelectedService([service]);
    // }
    // setMetricRender(false);

    // console.log("services", service);
    // setClusterID(clusterID);
    // console.log(clusterID, "clusterID in services toggle");
    if (selectedCluster.includes(clusterURL)) {
      setSelectedCluster(selectedCluster.filter((item) => item !== clusterURL));
    } else {
      setSelectedCluster([clusterURL]);
    }
    setNeedStatusCall(false);
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
          <Typography variant="h5" fontWeight="500" color={"#fff"}>
            Filter Options
          </Typography>
        </ListItem>
        <Divider />

        <ListItem>
          <Accordion
            style={{
              width: "500px",
              backgroundColor: colors.primary[400],
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5" color={"#fff"}>
                List Of Clusters
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <FormControl component="fieldset">
                <RadioGroup
                  // defaultValue={ClusterList[0]}
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
                      label={clusters.slice(12, 26)}
                      sx={{
                        color: "white",
                      }}
                      onChange={handleServiceToggle(clusters)}
                    />
                  ))}

                  {/* {services.map((service) => (
                    <FormControlLabel
                      key={service}
                      value={service}
                      control={
                        <Radio sx={{ "&.Mui-checked": { color: "white" } }} />
                      }
                      label={service}
                      sx={{
                        color: "white",
                      }}
                      onChange={handleServiceToggle(service)}
                    />
                  ))} */}
                </RadioGroup>
              </FormControl>
            </AccordionDetails>
          </Accordion>
        </ListItem>
        <Divider />
      </List>
    </div>
  );
};

export default ClusterFilter;
