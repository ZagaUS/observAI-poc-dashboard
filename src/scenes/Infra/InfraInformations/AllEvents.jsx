import { Box, Card, CardContent, IconButton, Typography, useTheme } from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import Events from "./Events";
import { GlobalContext } from "../../../global/globalContext/GlobalContext";
import { getAllEvent, getAllEventByDate } from "../../../api/InfraApiService";
import Loading from "../../../global/Loading/Loading";
import { format } from "date-fns";
import { tokens } from "../../../theme";
import { useNavigate } from "react-router-dom";

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
  const { selectedStartDate, selectedEndDate, needHistoricalData, lookBackVal } = useContext(GlobalContext);
  const [allEventData, setAllEventData] = useState([]);
  const [viewAllEvents, setViewAllEvents] = useState(false);
  const [loading, setLoading] = useState(true);
  const [emptyMessage, setEmptyMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();

  console.log("events-------------", allEventData);

  const handleCancel = () => {
    navigate("/mainpage/infraInfo/events");
    setViewAllEvents(true);
    console.log("Closed");
  };

  const mapAllEvents = (data) => {
    return data.flatMap((item) => {
      const createdTimeAndDate = new Date(item.createdTime);
      const formattedTime = format(createdTimeAndDate, "MMMM dd, yyyy HH:mm:ss a");
      
      return item.scopeLogs.flatMap((scopeLog) => {
        return scopeLog.logRecords.map((logRecord) => {
          const namespaceAttribute = logRecord.attributes.find(attr => attr.key === "k8s.namespace.name");
          const namespaceName = namespaceAttribute ? namespaceAttribute.value.stringValue : "Namespace not found";  
          
          return {
            resource: item.objectKind,
            resourceName: item.objectName,
            eventMessage: logRecord.body.stringValue,
            namespaceName: namespaceName,
            severityText: logRecord.severityText,
            createdTime: formattedTime,
          };
        });
      });
    });
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
    try {
      setLoading(true);
      const eventsData = await getAllEventByDate(selectedStartDate, selectedEndDate, lookBackVal.value);
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
  }, [selectedStartDate, selectedEndDate, needHistoricalData, lookBackVal]);

  useEffect(() => {
    handleGetAllEvents();
    
    console.log("Use Effect All Event")

    return () => {
      setErrorMessage("");
      setEmptyMessage("");
    };
  }, [handleGetAllEvents, setErrorMessage, setEmptyMessage]);

  return (
    <div>
      {
      loading ? (
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
      ) : 
      (viewAllEvents ? (
        <Events />
      ) : 
      (
        <div>
          <Box
            sx={{
              p: 2,
              margin: "auto",
              maxWidth: 1250,
              // marginTop: '10px',
              flexGrow: 1,
              // backgroundColor: (theme) =>
              //   theme.palette.mode === 'dark' ? '#000000' : 'grey',
              // overflow: "auto",
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
              <IconButton onClick={handleCancel}>
                <CancelIcon />
              </IconButton>
            </div>
            <div>
              <Box sx={{ maxHeight: "450px", overflow: "auto" }}>
                {allEventData.map((eventData, index) => (
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
                ))}
              </Box>
            </div>
          </Box>
        </div>
      )
      )}
    </div>
  );
};

export default AllEvents;
