import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../global/globalContext/GlobalContext";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { addRulesForService } from "../../api/LoginApiService";
import "./AddRules.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AddRules = () => {
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const [serviceListDetails, setServiceListDetails] = useState(
    JSON.parse(localStorage.getItem("serviceListData"))
  );
  const [selectedService, setSelectedService] = useState(
    serviceListDetails[0] || ""
  );
  const [memoryConstraint, setMemoryConstraint] = useState("");
  const [expiryDateTime, setExpiryDateTime] = useState(new Date());
  const [duration, setDuration] = useState(0);
  const [cpuLimit, setCpuLimit] = useState(0.0);
  const [memoryLimit, setMemoryLimit] = useState(0);
  const [ruleType, setRuleType] = useState("trace");
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [cpuConstraint, setCpuConstraint] = useState("");
  const [durationConstraint, setDurationConstraint] = useState("");
  const [severityText, setSeverityText] = useState([]);
  const [severityConstraint, setSeverityConstraint] = useState("");
  const [cpuAlertSeverityText, setCpuAlertSeverityText] = useState("");
  const [memoryAlertSeverityText, setMemoryAlertSeverityText] = useState("");
  const [tracecAlertSeverityText, setTracecAlertSeverityText] = useState("");
  const [logAlertSeverityText, setLogAlertSeverityText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // const [maxEndDate, setMaxEndDate] = useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  //   const isipadpro = useMediaQuery((theme) =>
  //   theme.breakpoints.only("isipadpro")
  // );

  console.log("serviceListData:", serviceListDetails);
  console.log("userDetails:", userInfo);

  console.log("User Details", localStorage.getItem("userInfo"));
  console.log("Service List------", localStorage.getItem("serviceListData"));

  const ruleTypeList = ["trace", "metric", "log"];
  const severityChanges = ["ERROR", "SEVERE", "WARN", "INFO"];
  const constraints = [
    "greaterThan",
    "lessThan",
    "greaterThanOrEqual",
    "lessThanOrEqual",
  ];
  const constraint = ["present", "notpresent"];
  const severityTextRule = ["CRITICAL", "WARNING", "INFO"];

  const handleAddRules = async (event) => {
    try {
      event.preventDefault();
      if (userInfo && userInfo.roles) {
        if (!selectedService || !ruleType) {
          console.error("Error: Please select a service and rule type.");
          setErrorMessage("Please select a Service and Rule Type");
          return;
        }

        const dataToSend = {
          serviceName: selectedService,
          roles: userInfo.roles,
          rules: [
            {
              memoryConstraint: memoryConstraint,
              expiryDateTime: format(expiryDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
              duration: duration,
              cpuLimit: cpuLimit,
              memoryLimit: memoryLimit,
              ruleType: ruleType,
              startDateTime: format(startDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
              cpuConstraint: cpuConstraint,
              durationConstraint: durationConstraint,
              severityText: severityText,
              severityConstraint: severityConstraint,
              cpuAlertSeverityText: cpuAlertSeverityText,
              memoryAlertSeverityText: memoryAlertSeverityText,
              tracecAlertSeverityText: tracecAlertSeverityText,
              logAlertSeverityText: logAlertSeverityText,
            },
          ],
        };
        await addRulesForService(dataToSend);
        console.log("Data to send:", dataToSend);
        navigate("/admin/clusterDashboard/rulesInfo");

        // // Check for success status or handle the response accordingly
        // if (response.status === 200 && response.statusText) {
        //   // Navigate to a different route upon successful addition of rules
        //   navigate("/admin/clusterDashboard/rulesInfo");
        // } else {
        //   console.error('Error in response:', response);

        //   // Check if there is a response.data and display it, otherwise show a generic message
        //   if (response.data && response.data.rules) {
        //     // If there are rules in the response, it might be a validation error
        //     const errorMessage = response.data.rules[0].message || "Error adding rules";
        //     setErrorMessage(errorMessage);
        //   } else {
        //     setErrorMessage("Error adding rules");
        //   }
        // }
      } else {
        console.error(
          "Error: userDetails or userDetails.roles is null or undefined"
        );
        setErrorMessage(
          "userDetails or userDetails.roles is null or undefined"
        );
      }
    } catch (error) {
      console.error("Error adding rules:", error);
      setErrorMessage(error.response.data);
    }
  };

  const handleBack = () => {
    navigate("/admin/clusterDashboard/rulesInfo");
  };

  const handleStartDateChange = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss");
    console.log("Formatted Date " + formattedDate);
    console.log("Selected start date:", date);
    setStartDateTime(parseISO(formattedDate));
    // setMaxEndDate(true);
  };

  const handleEndDateChange = (date) => {
    if (date !== null) {
      const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss");
      console.log("Formatted Date " + formattedDate);
      console.log("Selected end date:", date);
      setExpiryDateTime(parseISO(formattedDate));
    }
  };

  const clearEndDate = () => {
    console.log("Clearing end date");
    setExpiryDateTime(null);
  };

  const handleSeverity = (event) => {
    const {
      target: { value },
    } = event;
    setSeverityText(typeof value === "string" ? value.split(",") : value);
  };

  const clearFields = () => {
    if (ruleType !== "trace") {
      setDuration(0);
      setDurationConstraint("");
      setTracecAlertSeverityText("");
    }

    if (ruleType !== "metric") {
      setMemoryLimit(0);
      setMemoryConstraint("");
      setCpuLimit(0.0);
      setCpuConstraint("");
      setMemoryAlertSeverityText("");
      setCpuAlertSeverityText("");
    }

    if (ruleType !== "log") {
      setSeverityText([]);
      setSeverityConstraint("");
      setLogAlertSeverityText("");
    }
  };

  useEffect(() => {
    clearFields();
  }, [ruleType]);

  const handleDelete = () => {
    console.log("Delete Icon Clicked!")
    setStartDateTime("");
    setExpiryDateTime("");
    setSelectedService("");
    setDuration(0);
    setDurationConstraint("");
    setTracecAlertSeverityText("");
    setMemoryLimit(0);
    setMemoryConstraint("");
    setCpuLimit(0.0);
    setCpuConstraint("");
    setMemoryAlertSeverityText("");
    setCpuAlertSeverityText("");
    setSeverityText([]);
    setSeverityConstraint("");
    setLogAlertSeverityText("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column"}}>
      <div>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon variant="outlined" />
          {/* <Typography style={{ textDecoration: "underline", marginLeft: "4px" }}>
            Back
          </Typography> */}
        </IconButton>
      </div>
      
      <div>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          marginBottom: "5px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "84vh",
            width: "500px",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", marginTop: "5px" }}
          >
            Add Rules
          </Typography>

          <Box
            component="form"
            onSubmit={handleAddRules}
            sx={{
              "& .MuiTextField-root": { m: 1, width: "35ch" },
              width: "500px",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "2px",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    marginLeft: "10px",
                    color: colors.tabColor[100],
                  }}
                >
                  Start Date
                </label>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <DateTimePicker
                      sx={{
                        "& .MuiInputBase-input": {
                          height: 30,
                          padding: 0.5,
                          "&:hover": {
                            border: "none",
                          },
                        },
                      }}
                      value={startDateTime}
                      onChange={handleStartDateChange}
                      disableFuture
                    />
                  </Box>
                </LocalizationProvider>
              </div>

              <div>
                <label
                  style={{
                    fontSize: "12px",
                    marginLeft: "10px",
                    color: colors.tabColor[100],
                  }}
                >
                  End Date
                </label>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <DateTimePicker
                      sx={{
                        "& .MuiInputBase-input": {
                          height: 30,
                          padding: 0.5,
                          "&:hover": {
                            border: "none",
                          },
                        },
                      }}
                      value={expiryDateTime}
                      minDate={startDateTime}
                      onChange={handleEndDateChange}
                      slotProps={{
                        field: {
                          clearable: true,
                          onClear: () => clearEndDate(),
                        },
                      }}
                      className="customDatePicker"
                    />
                  </Box>
                </LocalizationProvider>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "5px",
                }}
              >
                <label
                  style={{
                    fontSize: "12px",
                    alignItems: "normal",
                  }}
                >
                  Select Service
                </label>
                <Select
                  sx={{
                    maxHeight: 38,
                  }}
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  style={{
                    width: "320px",
                    marginBottom: "10px",
                  }}
                >
                  <MenuItem value="" disabled>
                    Select a service
                  </MenuItem>
                  {serviceListDetails.map((service, index) => (
                    <MenuItem
                      key={index}
                      value={service}
                      sx={{ color: "black" }}
                    >
                      {service}
                    </MenuItem>
                  ))}
                </Select>

                <label
                  style={{
                    fontSize: "12px",
                  }}
                >
                  Rule Type
                </label>
                <Select
                  sx={{
                    maxHeight: 38,
                  }}
                  value={ruleType}
                  onChange={(e) => setRuleType(e.target.value)}
                  style={{ width: "320px", marginBottom: "10px" }}
                >
                  <MenuItem value="" disabled>
                    Select Rule Type
                  </MenuItem>
                  {ruleTypeList.map((ruleType, index) => (
                    <MenuItem
                      key={index}
                      value={ruleType}
                      sx={{ color: "black" }}
                    >
                      {ruleType}
                    </MenuItem>
                  ))}
                </Select>
              </div>

              {ruleType === "trace" && (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "5px",
                      paddingBottom: "5px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      Duration
                    </label>
                    <input
                      className="custom-input"
                      required
                      id="filled-required"
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>

                  <div
                    style={{
                      marginTop: "3px",
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "5px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      Duration Constraint
                    </label>
                    <Select
                      sx={{
                        maxHeight: 38,
                      }}
                      value={durationConstraint}
                      onChange={(e) => setDurationConstraint(e.target.value)}
                      style={{ width: "320px", marginBottom: "10px" }}
                    >
                      <MenuItem value="" disabled>
                        Select Rule Type
                      </MenuItem>
                      {constraints.map((constraintDuration, index) => (
                        <MenuItem
                          key={index}
                          value={constraintDuration}
                          sx={{ color: "black" }}
                        >
                          {constraintDuration}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "5px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      Trace Alert Severity
                    </label>
                    <Select
                      sx={{
                        maxHeight: 38,
                      }}
                      value={tracecAlertSeverityText}
                      onChange={(e) =>
                        setTracecAlertSeverityText(e.target.value)
                      }
                      style={{ width: "320px", marginBottom: "10px" }}
                    >
                      <MenuItem value="" disabled>
                        Select Trace Alert Severity
                      </MenuItem>
                      {severityTextRule.map((traceSeverity, index) => (
                        <MenuItem
                          key={index}
                          value={traceSeverity}
                          sx={{ color: "black" }}
                        >
                          {traceSeverity}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </>
              )}

              {ruleType === "metric" && (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "5px",
                      paddingBottom: "5px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      Memory Limit
                    </label>
                    <input
                      className="custom-input"
                      required
                      id="filled-required"
                      type="number"
                      value={memoryLimit}
                      onChange={(e) => setMemoryLimit(e.target.value)}
                    />
                  </div>

                  <div
                    style={{
                      marginTop: "3px",
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "5px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      Memory Constraint
                    </label>
                    <Select
                      sx={{
                        maxHeight: 38,
                      }}
                      value={memoryConstraint}
                      onChange={(e) => setMemoryConstraint(e.target.value)}
                      style={{ width: "320px", marginBottom: "10px" }}
                    >
                      <MenuItem value="" disabled>
                        Select Memory Constraint
                      </MenuItem>
                      {constraints.map((constraintMemory, index) => (
                        <MenuItem
                          key={index}
                          value={constraintMemory}
                          sx={{ color: "black" }}
                        >
                          {constraintMemory}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>

                  <div
                    style={{
                      marginTop: "3px",
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "5px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      Memory Alert Severity
                    </label>
                    <Select
                      sx={{
                        maxHeight: 38,
                      }}
                      value={memoryAlertSeverityText}
                      onChange={(e) =>
                        setMemoryAlertSeverityText(e.target.value)
                      }
                      style={{ width: "320px", marginBottom: "10px" }}
                    >
                      <MenuItem>Select Memory Alert Severity</MenuItem>
                      {severityTextRule.map((memorySeverity, index) => (
                        <MenuItem
                          key={index}
                          value={memorySeverity}
                          sx={{ color: "black" }}
                        >
                          {memorySeverity}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "5px",
                      paddingBottom: "5px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      CPU Limit
                    </label>
                    <input
                      className="custom-input"
                      required
                      id="filled-required"
                      type="number"
                      value={cpuLimit}
                      onChange={(e) => setCpuLimit(e.target.value)}
                    />
                  </div>

                  <div
                    style={{
                      marginTop: "3px",
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "5px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      CPU Constraint
                    </label>
                    <Select
                      sx={{
                        maxHeight: 38,
                      }}
                      value={cpuConstraint}
                      onChange={(e) => setCpuConstraint(e.target.value)}
                      style={{ width: "320px", marginBottom: "10px" }}
                    >
                      <MenuItem value="" disabled>
                        Select CPU Constraint
                      </MenuItem>
                      {constraints.map((constraintCpu, index) => (
                        <MenuItem
                          key={index}
                          value={constraintCpu}
                          sx={{ color: "black" }}
                        >
                          {constraintCpu}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>

                  <div
                    style={{
                      marginTop: "3px",
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "5px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      CPU Alert Severity
                    </label>
                    <Select
                      sx={{
                        maxHeight: 38,
                      }}
                      value={cpuAlertSeverityText}
                      onChange={(e) => setCpuAlertSeverityText(e.target.value)}
                      style={{ width: "320px", marginBottom: "10px" }}
                    >
                      <MenuItem>Select CPU Alert Severity</MenuItem>
                      {severityTextRule.map((cpuSeverity, index) => (
                        <MenuItem
                          key={index}
                          value={cpuSeverity}
                          sx={{ color: "black" }}
                        >
                          {cpuSeverity}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </>
              )}

              {ruleType === "log" && (
                <>
                  <div
                    style={{
                      marginTop: "3px",
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "5px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      Severity Text
                    </label>
                    <Select
                      sx={{
                        maxHeight: 38,
                      }}
                      multiple
                      value={severityText}
                      onChange={handleSeverity}
                      style={{ width: "320px", marginBottom: "10px" }}
                    >
                      <MenuItem value="" disabled>
                        Select Severity Text
                      </MenuItem>
                      {severityChanges.map((severityTextSelect, index) => (
                        <MenuItem
                          key={index}
                          value={severityTextSelect}
                          sx={{ color: "black" }}
                        >
                          {severityTextSelect}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>

                  <div
                    style={{
                      marginTop: "3px",
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "5px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      Severity Constraint
                    </label>
                    <Select
                      sx={{
                        maxHeight: 38,
                      }}
                      value={severityConstraint}
                      onChange={(e) => setSeverityConstraint(e.target.value)}
                      style={{ width: "320px", marginBottom: "10px" }}
                    >
                      <MenuItem value="" disabled>
                        Select Severity Constraint
                      </MenuItem>
                      {constraint.map((constraintSeverity, index) => (
                        <MenuItem
                          key={index}
                          value={constraintSeverity}
                          sx={{ color: "black" }}
                        >
                          {constraintSeverity}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>

                  <div
                    style={{
                      marginTop: "3px",
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "5px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      Log Alert Severity
                    </label>
                    <Select
                      sx={{
                        maxHeight: 38,
                      }}
                      value={logAlertSeverityText}
                      onChange={(e) => setLogAlertSeverityText(e.target.value)}
                      style={{ width: "320px", marginBottom: "10px" }}
                    >
                      <MenuItem value="" disabled>Select Log Alert Severity</MenuItem>
                      {severityTextRule.map((logSeverity, index) => (
                        <MenuItem
                          key={index}
                          value={logSeverity}
                          sx={{ color: "black" }}
                        >
                          {logSeverity}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </>
              )}
              {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                <Stack sx={{ marginRight: "10px" }}>
                  <Chip label="Cancel" variant="outlined" onDelete={handleDelete} />
                </Stack>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    // marginTop: 2,
                    backgroundColor: "#091365",
                    color: "white",
                    "&:hover": { backgroundColor: "#091365" },
                  }}
                  onClick={handleAddRules}
                >
                  Submit
                </Button>
              </div>
            </div>
          </Box>
        </Paper>
      </Container>
      </div>
    </div>
  );
};

export default AddRules;
