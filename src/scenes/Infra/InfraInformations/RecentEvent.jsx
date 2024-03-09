import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';


import { GlobalContext } from "../../../global/globalContext/GlobalContext";
import { getRecentEvent, getRecentEvents } from "../../../api/InfraApiService";
import AllEvents from "./AllEvents";
import Loading from "../../../global/Loading/Loading";
import { format } from "date-fns";
import { tokens } from "../../../theme";
import { useNavigate } from "react-router-dom";
import { options } from "../../../global/MockData/MockTraces";
import { red } from "@mui/material/colors";
import { makeStyles } from '@mui/styles';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
  

const useStyles = makeStyles({
  hover: {
    '&:hover': {
      // backgroundColor: '#f5f5f5', // Set your desired hover color
      backgroundColor: "darkgray"
    },
  },
});

// const { title , children , openPopup , setOpenPopup} = useState(false);


  //Popup
  // const useStyles = (theme => ({
  //   dialogWrapper : {
  //     padding : theme.spacing(2),
  //     position : 'absolute',
  //     top : theme.spacing(20),
  
  //   }
  // }))

const tableHeader = [
  {
    id: "severityText",
    label: "Severity Text",
  },
  {
    id: "resource",
    label: "Resource",
  },
  {
    id: "resourceName",
    label: "Resource Name",
  },
  {
    id: "eventMessage",
    label: "Event Message",
  },
  {
    id: "createdTime",
    label: "Created Time",
  },
];

function createData(
  severityText,
  resource,
  resourceName,
  eventMessage,
  createdTime
) {
  return { severityText, resource, resourceName, eventMessage, createdTime };
}

const rows = [
  createData(
    "Pod",
    "collect-profiles-28474995-drkzz",
    "Created container registry-server",
    "30 mins ago"
  ),
  createData(
    "Service",
    "S3",
    'announcing from node "zagaocp-master2" with protocol "layer2"',
    "30 mins ago"
  ),
  createData(
    "Deployment",
    "oauth-openshift",
    "Scaled up replica set oauth-openshift-576f8cbd5c to 3 from 2",
    "30 mins ago"
  ),
  createData("Job", "collect-profiles-2847", "Job completed", "30 mins ago"),
  createData(
    "Open Telemetry Collector",
    "infra-telemetry",
    'failed to create objects for infra-telemetry: Service "infra-telemetry-collector" is invalid: [spec.ports[1].name: Duplicate value: "port-10250", spec.ports[2].name: Duplicate value: "port-10250", spec.ports[3].name: Duplicate value: "port-10250", spec.ports[1]: Duplicate value: core.ServicePort{Name:"", Protocol:"TCP", AppProtocol:(*string)(nil), Port:10250, TargetPort:intstr.IntOrString{Type:0, IntVal:0, StrVal:""}, NodePort:0}, spec.ports[2]: Duplicate value: core.ServicePort{Name:"", Protocol:"TCP", AppProtocol:(*string)(nil), Port:10250, TargetPort:intstr.IntOrString{Type:0, IntVal:0, StrVal:""}, NodePort:0}, spec.ports[3]: Duplicate value: core.ServicePort{Name:"", Protocol:"TCP", AppProtocol:(*string)(nil), Port:10250, TargetPort:intstr.IntOrString{Type:0, IntVal:0, StrVal:""}, NodePort:0}] Service "infra-telemetry-collector-headless" is invalid: [spec.ports[1].name: Duplicate value: "port-10250", spec.ports[2].name: Duplicate value: "port-10250", spec.ports[3].name: Duplicate value: "port-10250", spec.ports[1]: Duplicate value: core.ServicePort{Name:"", Protocol:"TCP", AppProtocol:(*string)(nil), Port:10250, TargetPort:intstr.IntOrString{Type:0, IntVal:0, StrVal:""}, NodePort:0}, spec.ports[2]: Duplicate value: core.ServicePort{Name:"", Protocol:"TCP", AppProtocol:(*string)(nil), Port:10250, TargetPort:intstr.IntOrString{Type:0, IntVal:0, StrVal:""}, NodePort:0}, spec.ports[3]: Duplicate value: core.ServicePort{Name:"", Protocol:"TCP", AppProtocol:(*string)(nil), Port:10250, TargetPort:intstr.IntOrString{Type:0, IntVal:0, StrVal:""}, NodePort:0}]',
    "30 mins ago"
  ),
  createData("Namespace", "observability-kafka", "", "30 mins ago"),
];

const RecentEvent = () => {
  const {
    lookBackVal,
    selectedNode,
    selectedCluster,
    setLookBackVal,
    setSelectedStartDate,
    setInfraActiveTab, setInfraInfoActiveTab
  } = useContext(GlobalContext);
  const [eventRowsData, setEventRowsData] = useState([]);
  const [viewAllEvents, setViewAllEvents] = useState(false);
  const [loading, setLoading] = useState(true);
  const [emptyMessage, setEmptyMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const EmptyformattedDate = format(new Date(), "yyyy-MM-dd");
  const defaultValue = 30;
  const defaultLabel = options.find((option) => option.value === defaultValue);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  console.log(userInfo, "userDetails");
  const userName = userInfo.username;
  console.log(userName);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();

  const[ openPopup , setOpenPopup] = useState(false);




  console.log("recent-------", eventRowsData);

  const handleViewAllEvents = () => {
    navigate("/mainpage/infraInfo/events/allEvents");
    setViewAllEvents(true);
  };

  const handlePopoverOpen = (eventMessage, anchorEl) => {
    setSelectedEvent(eventMessage);
    setAnchorEl(anchorEl);
  };

  const handlePopoverClose = () => {
    setSelectedEvent(null);
    setAnchorEl(null);
  };

  

  const mapEventData = (eventData) => {
    const extractEventData = [];



    eventData.forEach((data) => {
      data.scopeLogs.forEach((scopeLog) => {
        scopeLog.logRecords.forEach((logRecord) => {
          const createdTimeAndDate = new Date(data.createdTime);
          const formattedTime = format(
            createdTimeAndDate,
            "MMMM dd, yyyy HH:mm:ss a"
          );
          const extractEventInfo = {
            objectKind: data.objectKind,
            objectName: data.objectName,
            stringValue: logRecord.body.stringValue,
            createdTime: formattedTime,
            // severityText: logRecord.severityText
            severityText:
              logRecord.severityText === "Normal"
                ? "Info"
                : logRecord.severityText, // Change "Normal" to "Inform"
          };

          extractEventData.push(extractEventInfo);
        });
      });
    });

    const finalData = [];

    extractEventData.forEach((eventField, index) => {
      finalData.push(
        createData(
          eventField.severityText,
          eventField.objectKind,
          eventField.objectName,
          eventField.stringValue,
          eventField.createdTime,
          index
        )
      );
    });

    return finalData;
  };
  const severityColors = {
    Warning: "#FF8C00",
    Error: "red",
    Info: theme.palette.mode === "dark" ? "#FFFFFF" : "black",
    Normal: theme.palette.mode === "dark" ? "#FFFFFF" : "black",
  };

  const handleGetRecentEvent = useCallback(async () => {
    const selectedNodestring = selectedNode[0];
    try {
      setLoading(true);
      if (lookBackVal.value > 30) {
        console.error("Only 30 mins data is allowed");
        setErrorMessage("Only 30 mins data is allowed");
        setLoading(false);
        return;
      }
      // const eventData = await getRecentEvent(lookBackVal.value);
      const eventData = await getRecentEvents(
        lookBackVal.value,
        selectedCluster,
        selectedNodestring,
        userName
      );
      if (eventData.length !== 0) {
        const finalOutputData = mapEventData(eventData);
        // setEventRowsData(eventData);
        setEventRowsData(finalOutputData);
        setLoading(false);
        console.log("RECENT DATA", eventData);
        // } else if (lookBackVal !== 30) {
        //     console.error("Only 30 mins data is allowed");
        //     setErrorMessage("Only 30 mins data is allowed");
      } else {
        setEmptyMessage("No Recent Events Data");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recent events:", error);
      setErrorMessage("Error in Displaying Events");
      setLoading(false);
    }
  }, [lookBackVal, selectedNode, selectedCluster, userName]);

  useEffect(() => {
    handleGetRecentEvent();
    setLookBackVal(defaultLabel);
    setSelectedStartDate(EmptyformattedDate);
    setInfraActiveTab(0);
    setInfraInfoActiveTab(2);
    console.log("Use Effect Recent Event");

    return () => {
      setErrorMessage("");
      setEmptyMessage("");
    };
  }, [handleGetRecentEvent, setErrorMessage, setEmptyMessage]);

  
  const classes = useStyles();


  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={18} lg={30}>
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
          ) : viewAllEvents ? (
            <AllEvents />
          ) : (
            <div>
              <Grid
                xs={12}
                sx={{
                  p: 2,
                  margin: "auto",
                  maxWidth: 1250,
                  maxHeight: 1200,
                  flexGrow: 1,
                  // backgroundColor: (theme) =>
                  //   theme.palette.mode === 'dark' ? '#000000' : 'grey',
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    marginBottom: "10px",
                  }}
                >
                  <Button color="info" onClick={handleViewAllEvents}
                  variant="contained"
                  sx={{ backgroundColor: colors.primary[400], color: '#fff',
                    fontSize: '16px', 
                    fontWeight: 'bold', 
                    fontFamily: 'Arial, sans-serif', // Set your desired font family
                  }}
                  >
                    View All Events
                  </Button>
                </div>

                <Grid item xs={12}>
                  <Card elevation={6}>
                    <TableContainer
                      component={Paper}
                      sx={{ maxHeight: "510px", overflowY: "auto" }}
                    >
                      <Table
                        sx={{ minWidth: 650 }}
                        stickyHeader
                        aria-label="sticky table"
                      >
                        <TableHead>
                          {tableHeader.map((column, index) => (
                            <TableCell
                              key={index}
                              align={column.align}
                              sx={{
                                // display: "flex",
                                // flexDirection: "row",
                                // justifyContent: "space-between",
                                height: "30px",
                                backgroundColor: colors.primary[400],
                                color: "#FFF",

                                // padding: "10px",
                              }}
                            >
                              <Typography
                                variant="h5"
                                sx={
                                  {
                                    // padding: "10px"
                                  }
                                }
                              >
                                {column.label}
                              </Typography>
                            </TableCell>
                          ))}
                        </TableHead>

                        <TableBody>
                          {/* {rows.map((row, rowIndex) => (
                            <TableRow
                              key={rowIndex}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              {Object.values(row).map((value, index) => (
                                <TableCell 
                                  key={index} 
                                  component="th"
                                  scope="row"
                                  sx={{ 
                                    maxWidth: 120, 
                                    // whiteSpace: "nowrap",
                                    // overflow: "hidden",
                                    // textOverflow: "ellipsis",
                                  }}
                                >
                                  <Typography variant="h7">
                                    {value}
                                  </Typography>
                                </TableCell>
                              ))}
                            </TableRow>
                          ))} */}
                          {eventRowsData.map((row, rowIndex) => (
                            // <TableRow key={rowIndex} onClick={(event) => handlePopoverOpen(row, event.currentTarget)}>
                            <TableRow className={classes.hover} 
                              key={rowIndex}
                              onClick={(event) =>
                                handlePopoverOpen(row, event.currentTarget)
                              }
                            >
                              {tableHeader.map((column) => (
                                <TableCell
                                  key={column.id}
                                  sx={{
                                    maxWidth: 90,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    color:
                                      column.id === "severityText"
                                        ? severityColors[row.severityText] ||
                                          "inherit"
                                        : "inherit",
                                    fontWeight:
                                      column.id === "severityText" &&
                                      row.severityText === "Warning"
                                        ? "bold"
                                        : "inherit",
                                  }}
                                >
                                  
                                  <Typography variant="h7">
                                    {row[column.id]}
                                  </Typography>
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      
                      {selectedEvent && (
                      
                      <Dialog open={Boolean(selectedEvent)} 
                      
                      maxWidth="md" // Standard width
                      fullWidth
                                            
                      >
                       
                        <DialogTitle sx={{ backgroundColor: colors.primary[400], color: '#fff' }}>
                         
                         
                          <div> 
                          {selectedEvent.severityText === "Info" ? (
                               <Alert severity="info"  sx={{ backgroundColor: "white", color: 'black',
                                fontSize: '16px', 
                                fontWeight: 'bold', 
                                fontFamily: 'Arial, sans-serif', // Set your desired font family
                              }}>
                            
                               <AlertTitle> {selectedEvent.resource} - {selectedEvent.resourceName}</AlertTitle>
                               
                             </Alert>
                            ): selectedEvent.severityText === "Warning" ? (
                              <Alert severity="warning" sx={{ backgroundColor: "white", color: 'black',
                              fontSize: '16px', 
                              fontWeight: 'bold', 
                              fontFamily: 'Arial, sans-serif', // Set your desired font family
                            }}>
                           
                              <AlertTitle>{selectedEvent.resource} - {selectedEvent.resourceName}</AlertTitle>
                              
                            </Alert>
                           )
                             : (
                              <Alert severity="success">
                            
                                <AlertTitle>{selectedEvent.resourceName}</AlertTitle>
                              
                              </Alert>
                            )}
                         
                        
                          </div>
                        </DialogTitle>
                          <IconButton
                            aria-label="close"
                            onClick={handlePopoverClose}
                            sx={{
                              position: 'absolute',
                              right: 8,
                              top: 8,
                              // color: (theme) => theme.palette.grey[500],
                              color: red,
                            }}
                          >
                          {/* <CloseIcon /> */}
                        </IconButton>
                        <DialogContent dividers >
                          <div><span style={{ fontWeight: "500" }}>
                                    {selectedEvent.eventMessage}
                                  </span>
                          </div>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handlePopoverClose} color="primary" variant="contained" style={{backgroundColor: colors.primary[400], color: '#fff'}} >Close</Button>
                      </DialogActions>
                                      
                      </Dialog>
                  

                      )}

                      
                      {/* <Popover
                        open={Boolean(selectedEvent)}
                        anchorEl={anchorEl}
                        onClose={handlePopoverClose}
                        // anchorOrigin={{
                        //   vertical: "bottom",
                        //   horizontal: "left",
                        // }}
                        // transformOrigin={{
                        //   vertical: "top",
                        //   horizontal: "left",
                        // }}
                        anchorOrigin={{
                          vertical: "center",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "center",
                          horizontal: "center",
                        }}
                      >
                        <Box p={2} sx={{ height: "150px", width: "500px" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              alignItems: "flex-end",
                            }}
                          >
                            <IconButton onClick={handlePopoverClose}>
                              <CancelIcon />
                            </IconButton>
                          </div>
                          {selectedEvent && (
                            <div>
                              <Typography>
                                <span>
                                  Severity Text:{" "}
                                  <span style={{ fontWeight: "500" }}>
                                    {selectedEvent.severityText}
                                  </span>
                                </span>
                              </Typography>
                              <Typography>
                                <span>
                                  Resource:{" "}
                                  <span style={{ fontWeight: "500" }}>
                                    {selectedEvent.resource}
                                  </span>
                                </span>
                              </Typography>
                              <Typography>
                                <span>
                                  Resource Name:{" "}
                                  <span style={{ fontWeight: "500" }}>
                                    {selectedEvent.resourceName}
                                  </span>
                                </span>
                              </Typography>
                              <Typography>
                                <span>
                                  Event Message:{" "}
                                  <span style={{ fontWeight: "500" }}>
                                    {selectedEvent.eventMessage}
                                  </span>
                                </span>
                              </Typography>
                              <Typography>
                                <span>
                                  Created Time:{" "}
                                  <span style={{ fontWeight: "500" }}>
                                    {selectedEvent.createdTime}
                                  </span>
                                </span>
                              </Typography>
                            </div>
                          )}
                        </Box>
                      </Popover> */}
                    </TableContainer>
                  </Card>
                </Grid>
              </Grid>
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default RecentEvent;
