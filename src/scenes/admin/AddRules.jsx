import { Box, Button, Container, MenuItem, Paper, Select, TextField, Typography, useMediaQuery } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../../global/globalContext/GlobalContext';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';
import { format, parseISO } from 'date-fns';
import { useNavigate } from "react-router-dom";
import { addRulesForService } from '../../api/LoginApiService';

const AddRules = () => {
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")))
  const [serviceListDetails, setServiceListDetails] = useState(JSON.parse(localStorage.getItem("serviceListData")))
  const [selectedService, setSelectedService] = useState(serviceListDetails[0] || "");
  const [memoryConstraint, setMemoryConstraint] = useState("");
  const [expiryDateTime, setExpiryDateTime] = useState(new Date());
  const [duration, setDuration] = useState(0);
  const [cpuLimit, setCpuLimit] = useState(0.0);
  const [memoryLimit, setMemoryLimit] = useState(0);
  const [ruleType, setRuleType] = useState("trace");
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [cpuConstraint, setCpuConstraint] = useState('');
  const [durationConstraint, setDurationConstraint] = useState('');
  const [severityText, setSeverityText] = useState([]);
  const [severityConstraint, setSeverityConstraint] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  // const [maxEndDate, setMaxEndDate] = useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

//   const isipadpro = useMediaQuery((theme) =>
//   theme.breakpoints.only("isipadpro")
// );

  console.log('serviceListData:', serviceListDetails);
  console.log('userDetails:', userInfo);

  console.log("User Details", localStorage.getItem("userInfo"))
  console.log("Service List------", localStorage.getItem("serviceListData"))

  const ruleTypeList = ['trace', 'metric', 'log']
  const severityChanges = ['ERROR', 'SEVERE', 'WARN', 'INFO']
  const constraints = ['greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual']
  const constraint = ['present', 'notpresent']

  // const handleAddRules = async (event) => {
  //   try {
  //     event.preventDefault();
  //     if (userInfo && userInfo.roles) {
  //       if (!selectedService || !ruleType) {
  //         console.error('Error: Please select a service and rule type.');
  //         setErrorMessage("Please select a Service and Rule Type");
  //         return;
  //       }

  //       switch (ruleType) {
  //         case 'trace':
  //           if (!duration || !durationConstraint) {
  //             console.error('Error: Please enter duration and duration constraint for trace rule.');
  //             setErrorMessage("Please enter Duration and Duration Constraint for Trace rule");
  //             return;
  //           }
  //           break;
  //         case 'metric':
  //           if (!memoryLimit || !memoryConstraint || !cpuLimit || !cpuConstraint) {
  //             console.error('Error: Please enter memory limit, memory constraint, CPU limit, and CPU constraint for metric rule.');
  //             setErrorMessage("Please enter Memory Limit, Memory Constraint, CPU Limit, and CPU Constraint for Metric rule");
  //             return;
  //           }
  //           break;
  //         case 'log':
  //           if (!severityText.length || !severityConstraint) {
  //             console.error('Error: Please select severity text and severity constraint for log rule.');
  //             setErrorMessage("Please select Severity Text and Severity Constraint for Log rule");
  //             return;
  //           }
  //           break;
  //         default:
  //           console.error('Error: Invalid rule type.');
  //           setErrorMessage("Invalid Rule Type");
  //           return;
  //       }

  //       const dataToSend = {
  //         serviceName: selectedService,
  //         roles: userInfo.roles,
  //         rules: [{
  //           memoryConstraint: memoryConstraint,
  //           expiryDateTime: format(expiryDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
  //           duration: duration,
  //           cpuLimit: cpuLimit,
  //           memoryLimit: memoryLimit,
  //           ruleType: ruleType,
  //           startDateTime: format(startDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
  //           cpuConstraint: cpuConstraint,
  //           durationConstraint: durationConstraint,
  //           severityText: severityText,
  //           severityConstraint: severityConstraint
  //         }]
  //       }

  //       console.log('Data to send:', dataToSend);

  //     //   await addRulesForService(dataToSend)
  //     //   .catch(error => {
  //     //     console.error('Error in response:', error.response);
  //     //     setErrorMessage(error.response.data)
  //     //  });
  //     const response = await addRulesForService(dataToSend);

  //     // Check for success status or handle the response accordingly
  //     if (response.status === 200 && response.statusText) {
  //       // Navigate to a different route upon successful addition of rules
  //       navigate("/admin/clusterDashboard/rulesInfo");
  //     } else {
  //       console.error('Error in response:', response);
  
  //       // Check if there is a response.data and display it, otherwise show a generic message
  //       if (response.data && response.data.rules) {
  //         // If there are rules in the response, it might be a validation error
  //         const errorMessage = response.data.rules[0].message || "Error adding rules";
  //         setErrorMessage(errorMessage);
  //       } else {
  //         setErrorMessage("Error adding rules");
  //       }
  //     }
  
  //     } else {
  //       console.error('Error: userDetails or userDetails.roles is null or undefined');
  //       setErrorMessage("userDetails or userDetails.roles is null or undefined")
  //     }
  //   } catch (error) {
  //     console.error('Error adding rules:', error);
  //     setErrorMessage(error.response.data)
  //   }
  // } 

  const handleAddRules = async (event) => {
    try {
      event.preventDefault();
      if (userInfo && userInfo.roles) {
        if (!selectedService || !ruleType) {
          console.error('Error: Please select a service and rule type.');
          setErrorMessage("Please select a Service and Rule Type");
          return;
        }

        const dataToSend = {
          serviceName: selectedService,
          roles: userInfo.roles,
          rules: [{
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
            severityConstraint: severityConstraint
          }]
        }
        await addRulesForService(dataToSend);
        console.log('Data to send:', dataToSend);
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
        console.error('Error: userDetails or userDetails.roles is null or undefined');
        setErrorMessage("userDetails or userDetails.roles is null or undefined")
      }
    } catch (error) {
      console.error('Error adding rules:', error);
      setErrorMessage(error.response.data)
    }
  }   

  const handleStartDateChange = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss");
    console.log("Formatted Date " + formattedDate); 
    console.log('Selected start date:', date);
    setStartDateTime(parseISO(formattedDate));
    // setMaxEndDate(true);
  }

  const handleEndDateChange = (date) => {
    if (date !== null) {
      const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss");
      console.log("Formatted Date " + formattedDate); 
      console.log('Selected end date:', date);
      setExpiryDateTime(parseISO(formattedDate));
    }
  }

  const clearEndDate = () => {
    console.log('Clearing end date');
    setExpiryDateTime(null);
  }

  const handleSeverity = (event) => {
    const {
      target: { value },
    } = event;
    setSeverityText(
      typeof value === 'string' ? value.split(',') : value,
    );
  }

  const clearFields = () => {
    if (ruleType !== 'trace') {
      setDuration(0);
      setDurationConstraint('');
    }

    if (ruleType !== 'metric') {
      setMemoryLimit(0);
      setMemoryConstraint('');
      setCpuLimit(0.0);
      setCpuConstraint('');
    }

    if (ruleType !== 'log') {
      setSeverityText([""]);
      setSeverityConstraint('');
    }
  };

  useEffect(() => {
    clearFields();
  }, [ruleType]);

  return (
    <div>
      <Container component="main" maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center',height: "90vh", width: "600px" }}>
          <Typography variant="h5" gutterBottom sx={{fontWeight:"bold"}}>
            Add Rules
          </Typography>

          <Box
            component="form"
            onSubmit={handleAddRules}
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
              width: '100%', marginTop: 2, overflowY: "auto"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: "5px" }}>
                <div
                  // style={{
                  //   alignItems: "center",
                  //   marginBottom: "10px",
                  //   marginRight: "10px",
                  // }}
                >
                  <label
                    style={{
                      fontSize: "12px",
                      marginLeft: "10px",
                      color: colors.tabColor[100],
                    }}
                  >
                    Start Date
                  </label>
                  <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  >
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
                        value={startDateTime}
                        onChange={handleStartDateChange}
                        // slotProps={{
                        //   textField: { variant: "standard" },
                        // }}
                        disableFuture
                      />
                    </Box>
                  </LocalizationProvider>
                </div>

                <div
                  // style={{
                  //   alignItems: "center",
                  //   marginBottom: "10px",
                  //   marginRight: "10px",
                  // }}
                >
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
                        value={expiryDateTime}
                        minDate={startDateTime}
                        onChange={handleEndDateChange}
                        slotProps={{
                          field: { clearable: true, onClear: () => clearEndDate() },
                        }}
                        className="customDatePicker"
                      />
                    </Box>
                  </LocalizationProvider>
                </div>

            <div style={{ display: "flex", flexDirection: "column", marginLeft: "5px" }}>
              <label 
                style={{
                  fontSize: "12px",
                  alignItems: "normal"
                }}>
                  Select Service
              </label>
              <Select
                value={selectedService}
                // onChange={handleSelectedServiceChange}
                onChange={(e) => setSelectedService(e.target.value)}
                style={{ width: "226px", height: "40px", marginBottom: '10px' }}
              >
                <MenuItem value="" disabled>Select a service</MenuItem>
                {serviceListDetails.map((service, index) => (
                  <MenuItem key={index} value={service} sx={{ color: 'black'}}>
                    {service}
                  </MenuItem>
                ))}
              </Select>
            
              <label 
                style={{
                  fontSize: "12px",
                }}>
                  Rule Type
              </label>
              <Select
                value={ruleType}
                onChange={(e) => setRuleType(e.target.value)}
                style={{ width: "226px", marginBottom: '10px' }}
              >
                <MenuItem value="" disabled>Select Rule Type</MenuItem>
                {ruleTypeList.map((ruleType, index) => (
                  <MenuItem key={index} value={ruleType} sx={{ color: 'black'}}>
                    {ruleType}
                  </MenuItem>
                ))}
              </Select>
            </div>

              {ruleType === 'trace' && (
                <>
                <TextField
                  required
                  id="filled-required"
                  label="Duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  variant="outlined"
                />

                <div style={{ display: "flex", flexDirection: "column", marginLeft: "5px" }}>
                  <label
                    style={{
                      fontSize: "12px"
                    }}>
                      Duration Constraint
                  </label>
                  <Select
                    value={durationConstraint}
                    onChange={(e) => setDurationConstraint(e.target.value)}
                    style={{ width: "226px", marginBottom: '10px' }}
                  >
                    <MenuItem value="" disabled>Select Rule Type</MenuItem>
                    {constraints.map((constraintDuration, index) => (
                      <MenuItem key={index} value={constraintDuration} sx={{ color: 'black' }}>
                        {constraintDuration}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                </>
              )}

              {ruleType === 'metric' && (
                <>
                <TextField
                  required
                  id="filled-required"
                  label="Memory Limit"
                  value={memoryLimit}
                  onChange={(e) => setMemoryLimit(e.target.value)}
                  variant="outlined"
                />

                <div style={{ display: "flex", flexDirection: "column", marginLeft: "5px" }}>
                  <label
                    style={{
                      fontSize: "12px"
                    }}>
                      Memory Constraint
                  </label>
                  <Select
                    value={memoryConstraint}
                    onChange={(e) => setMemoryConstraint(e.target.value)}
                    style={{ width: "226px", marginBottom: '10px' }}
                  >
                    <MenuItem value="" disabled>Select Memory Constraint</MenuItem>
                    {constraints.map((constraintMemory, index) => (
                      <MenuItem key={index} value={constraintMemory} sx={{ color: 'black'}}>
                        {constraintMemory}
                      </MenuItem>
                    ))}
                  </Select>
                </div>

                <TextField
                  required
                  id="filled-required"
                  label="CPU Limit"
                  value={cpuLimit}
                  onChange={(e) => setCpuLimit(e.target.value)}
                  variant="outlined"
                />

                <div style={{ display: "flex", flexDirection: "column", marginLeft: "5px" }}>
                  <label
                    style={{
                      fontSize: "12px"
                    }}>
                      CPU Constraint
                  </label>
                  <Select
                    value={cpuConstraint}
                    onChange={(e) => setCpuConstraint(e.target.value)}
                    style={{ width: "226px", marginBottom: '10px' }}
                  >
                    <MenuItem value="" disabled>Select CPU Constraint</MenuItem>
                    {constraints.map((constraintCpu, index) => (
                      <MenuItem key={index} value={constraintCpu} sx={{ color: 'black'}}>
                        {constraintCpu}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                </>
              )}

              {ruleType === 'log' && (
                <>
                <div style={{ display: "flex", flexDirection: "column", marginLeft: "5px" }}>
                  <label 
                    style={{
                      fontSize: "12px"
                    }}>
                      Severity Text
                  </label>
                  <Select
                    multiple
                    value={severityText}
                    onChange={handleSeverity}
                    style={{ width: "226px", marginBottom: '10px' }}
                  >
                    <MenuItem value="" disabled>Select Severity Text</MenuItem>
                    {severityChanges.map((severityTextSelect, index) => (
                      <MenuItem key={index} value={severityTextSelect} sx={{ color: 'black' }}>
                        {severityTextSelect}
                      </MenuItem>
                    ))}
                  </Select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", marginLeft: "5px" }}>
                  <label 
                    style={{
                      fontSize: "12px"
                    }}>
                      Severity Constraint
                  </label>
                  <Select
                    value={severityConstraint}
                    onChange={(e) => setSeverityConstraint(e.target.value)}
                    style={{ width: "226px", marginBottom: '10px' }}
                  >
                    <MenuItem value="" disabled>Select Severity Constraint</MenuItem>
                    {constraint.map((constraintSeverity, index) => (
                      <MenuItem key={index} value={constraintSeverity} sx={{ color: 'black' }}>
                        {constraintSeverity}
                      </MenuItem>
                    ))}
                  </Select>  
                </div>
                </>
              )}
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2,backgroundColor:"#091365",color:"white", "&:hover": { backgroundColor: "#091365" } }} onClick={handleAddRules}>Submit</Button>
            </div>
          </Box>
        </Paper>
      </Container>
      
    </div>
  )
}

export default AddRules