import {
  Box,
  Card,
  CardContent,
  Grid,
  Button,
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
  Alert,
  Dialog,
  DialogTitle,
  AlertTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { red } from "@mui/material/colors";
import Events from "./Events";
import { GlobalContext } from "../../../global/globalContext/GlobalContext";
import { getAllEvent, getAllEventByDate } from "../../../api/InfraApiService";
import Loading from "../../../global/Loading/Loading";
import { format } from "date-fns";
import { tokens } from "../../../theme";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  hover: {
    "&:hover": {
      // backgroundColor: '#f5f5f5', // Set your desired hover color
      backgroundColor: "darkgray",
    },
  },
});

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
    id: "namespaceName",
    label: "Namespace Name",
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
  namespaceName,
  eventMessage,
  createdTime
) {
  return {
    severityText,
    resource,
    resourceName,
    namespaceName,
    eventMessage,
    createdTime,
  };
}

const allEventDatas = [
  {
    resource: "Pod",
    resourceName: "collect-profiles-28474995-drkzz",
    namespaceName: "observai",
    eventMessage: "Created container registry-server",
    createdTime: "30 mins ago",
  },
  {
    resource: "Service",
    resourceName: "S3",
    namespaceName: "observai-infra",
    eventMessage: `announcing from node "zagaocp-master2" with protocol "layer2"`,
    createdTime: "30 mins ago",
  },
  {
    resource: "Deployment",
    resourceName: "oauth-openshift",
    namespaceName: "observai",
    eventMessage: `Scaled up replica set oauth-openshift-576f8cbd5c to 3 from 2`,
    createdTime: "30 mins ago",
  },
];

const AllEvents = () => {
  const {
    selectedStartDate,
    selectedEndDate,
    needHistoricalData,
    lookBackVal,
    selectedNode,
    selectedCluster,
  } = useContext(GlobalContext);
  const [allEventData, setAllEventData] = useState([]);
  const [viewAllEvents, setViewAllEvents] = useState(false);
  const [loading, setLoading] = useState(true);
  const [emptyMessage, setEmptyMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  console.log("Selected Event", selectedEvent);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  console.log(userInfo, "userDetails");
  const userName = userInfo.username;
  console.log(userName);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();

  console.log("events-------------", allEventData);

  const handleCancel = () => {
    navigate("/mainpage/infraInfo/events");
    setViewAllEvents(true);
    console.log("Closed");
  };

  const handlePopoverOpen = (rowData, anchorEl) => {
    console.log("Popover Function", rowData);
    console.log("Popover", anchorEl);
    setSelectedEvent(rowData);
    setAnchorEl(anchorEl);
  };

  const handlePopoverClose = () => {
    setSelectedEvent(null);
    setAnchorEl(null);
  };

  // const mapAllEvents = (data) => {
  //   return data.flatMap((item) => {
  //     const createdTimeAndDate = new Date(item.createdTime);
  //     const formattedTime = format(createdTimeAndDate, "MMMM dd, yyyy HH:mm:ss a");

  //     return item.scopeLogs.flatMap((scopeLog) => {
  //       return scopeLog.logRecords.map((logRecord) => {
  //         const namespaceAttribute = logRecord.attributes.find(attr => attr.key === "k8s.namespace.name");
  //         const namespaceName = namespaceAttribute ? namespaceAttribute.value.stringValue : "Namespace not found";

  //         return {
  //           resource: item.objectKind,
  //           resourceName: item.objectName,
  //           eventMessage: logRecord.body.stringValue,
  //           namespaceName: namespaceName,
  //           severityText: logRecord.severityText,
  //           createdTime: formattedTime,
  //         };
  //       });
  //     });
  //   });
  // };

  const mapAllEvents = (eventData) => {
    const extractEventData = [];

    eventData.forEach((data) => {
      data.scopeLogs.forEach((scopeLog) => {
        scopeLog.logRecords.forEach((logRecord) => {
          const createdTimeAndDate = new Date(data.createdTime);
          const formattedTime = format(
            createdTimeAndDate,
            "MMMM dd, yyyy HH:mm:ss a"
          );
          const namespaceAttribute = logRecord.attributes.find(
            (attr) => attr.key === "k8s.namespace.name"
          );
          const namespaceName = namespaceAttribute
            ? namespaceAttribute.value.stringValue
            : "Namespace not found";
          const extractEventInfo = {
            objectKind: data.objectKind,
            objectName: data.objectName,
            stringValue: logRecord.body.stringValue,
            createdTime: formattedTime,
            // severityText: logRecord.severityText,
            severityText:
              logRecord.severityText === "Normal"
                ? "Info"
                : logRecord.severityText, // Change "Normal" to "Inform"

            namespaceName: namespaceName,
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
          eventField.namespaceName,
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

  // const handleGetAllEvents = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const eventsData = await getAllEvent(lookBackVal.value);
  //     if (eventsData.length !== 0) {
  //       console.log("All Events Data", eventsData);
  //       const finalData = mapAllEvents(eventsData);
  //       // setAllEventData(eventsData);
  //       setAllEventData(finalData);
  //       setLoading(false);
  //       console.log("ALL EVENTS", eventsData);
  //     } else {
  //       console.log("No Events data");
  //       setEmptyMessage("No Events Data to show!");
  //     }
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching All Events:", error);
  //     setErrorMessage("An Error Occurred!");
  //     setLoading(false);
  //   }
  // }, [lookBackVal]);

  const handleGetAllEvents = useCallback(async () => {
    const selectedNodestring = selectedNode[0];
    try {
      setLoading(true);
      const eventsData = await getAllEventByDate(
        selectedStartDate,
        selectedEndDate,
        lookBackVal.value,
        selectedCluster,
        selectedNodestring,
        userName
      );
      if (eventsData.length !== 0) {
        console.log("All Events Data", eventsData);
        const finalData = mapAllEvents(eventsData);
        // setAllEventData(eventsData);
        setAllEventData(finalData);
        setLoading(false);
        console.log("ALL EVENTS", eventsData);
      } else {
        console.log("No Events data");
        setEmptyMessage("No Events Data to show!");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching All Events:", error);
      setErrorMessage("An Error Occurred!");
      setLoading(false);
    }
  }, [
    selectedStartDate,
    selectedEndDate,
    needHistoricalData,
    lookBackVal,
    selectedCluster,
    selectedNode,
    userName,
  ]);

  useEffect(() => {
    handleGetAllEvents();
    handlePopoverOpen();

    console.log("Use Effect All Event");

    return () => {
      setErrorMessage("");
      setEmptyMessage("");
    };
  }, [handleGetAllEvents, setErrorMessage, setEmptyMessage]);

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
            <Events />
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
                }}
                
              >
                
                {/* <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    marginBottom: "10px",
                  }}
                >
                 
                <Button color="info" onClick={handleCancel}
                  variant="contained"
                  sx={{ backgroundColor: colors.primary[400], color: '#fff',
                    fontSize: '16px', 
                    fontWeight: 'bold', 
                    fontFamily: 'Arial, sans-serif', // Set your desired font family
                  }}
                  >
                    Back to current events
                  </Button> */}
                  {/* <IconButton onClick={handleCancel}>
                    <CancelIcon />
                  </IconButton> */}
                {/* </div> */}
                {/* <div>
                <Box sx={{ maxHeight: "450px", overflow: "auto" }}> */}
                {/* {allEventData.map((eventData, index) => (
                  <Card
                    elevation={4}
                    key={index}
                    sx={{
                      margin: "10px 10px 15px 10px",
                      height: "fit-content",
                      // border: eventData.severityText === 'Warning' ? "3px solid #f0ab00": "none",
                      // borderRadius: "8px",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          backgroundColor: colors.primary[400],
                          // color: "#FFF",
                          padding: "5px",
                          color: eventData.severityText === 'Warning' ? "#f0ab00": "#FFF",
                        }}
                      >
                        {eventData.resource}
                      </Typography>
                    </Box>
                    <CardContent>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <span style={{ fontWeight: "500", width: "150px" }}>
                            {eventData.resourceName}
                          </span>
                          <span style={{ fontWeight: "500", width: "190px" }}>
                            {eventData.namespaceName}
                          </span>
                          <span style={{ fontWeight: "500", width: "200px" }}>
                            {eventData.createdTime}
                          </span>
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="h7" sx={{ marginTop: "20px" }}>
                          <span>{eventData.eventMessage}</span>
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))} */}

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Card elevation={6}>
                      <TableContainer
                        component={Paper}
                        sx={{ maxHeight: "490px", overflowY: "auto" }}
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
                                  height: "30px",
                                  backgroundColor: colors.primary[400],
                                  color: "#FFF",
                                }}
                              >
                                <Typography variant="h5">
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
                            {allEventData.map((row, rowIndex) => (
                              <TableRow
                                className={classes.hover}
                                key={rowIndex}
                                onClick={(event) =>
                                  handlePopoverOpen(row, event.currentTarget)
                                }
                              >
                                {/* <TableRow key={rowIndex}> */}
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
                          <Dialog
                            open={Boolean(selectedEvent)}
                            maxWidth="md" // Standard width
                            fullWidth
                          >
                            <DialogTitle
                              sx={{
                                backgroundColor: colors.primary[400],
                                color: "#fff",
                              }}
                            >
                              <div>
                                {selectedEvent.severityText === "Info" ? (
                                  <Alert
                                    severity="info"
                                    sx={{
                                      backgroundColor: "white",
                                      color: "black",
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                      fontFamily: "Arial, sans-serif", // Set your desired font family
                                    }}
                                  >
                                    <AlertTitle>
                                      {" "}
                                      {selectedEvent.resource} -{" "}
                                      {selectedEvent.resourceName}
                                    </AlertTitle>
                                  </Alert>
                                ) : selectedEvent.severityText === "Warning" ? (
                                  <Alert
                                    severity="warning"
                                    sx={{
                                      backgroundColor: "white",
                                      color: "black",
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                      fontFamily: "Arial, sans-serif", // Set your desired font family
                                    }}
                                  >
                                    <AlertTitle>
                                      {selectedEvent.resource} -{" "}
                                      {selectedEvent.resourceName}
                                    </AlertTitle>
                                  </Alert>
                                ) : (
                                  <Alert severity="success">
                                    <AlertTitle>
                                      {selectedEvent.resourceName}
                                    </AlertTitle>
                                  </Alert>
                                )}
                              </div>
                            </DialogTitle>
                            <IconButton
                              aria-label="close"
                              onClick={handlePopoverClose}
                              sx={{
                                position: "absolute",
                                right: 8,
                                top: 8,
                                // color: (theme) => theme.palette.grey[500],
                                color: red,
                              }}
                            >
                              {/* <CloseIcon /> */}
                            </IconButton>
                            <DialogContent dividers>
                              <div>
                                <span style={{ fontWeight: "500" }}>
                                  {selectedEvent.eventMessage}
                                </span>
                              </div>
                            </DialogContent>
                            <DialogActions>
                              <Button
                                onClick={handlePopoverClose}
                                color="primary"
                                variant="contained"
                                style={{
                                  backgroundColor: colors.primary[400],
                                  color: "#fff",
                                }}
                              >
                                Close
                              </Button>
                            </DialogActions>
                          </Dialog>
                        )}
                        {/* <Popover
                          open={Boolean(selectedEvent)}
                          anchorEl={anchorEl}
                          onClose={handlePopoverClose}
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
                                    Namespace Name:{" "}
                                    <span style={{ fontWeight: "500" }}>
                                      {selectedEvent.namespaceName}
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
                {/* </Box>
                </div> */}
              </Grid>
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default AllEvents;
