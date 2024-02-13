import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { updateServiceList } from "../../api/LoginApiService";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parseISO, toISOString } from 'date-fns';

const RuleDetailsPopup = ({ rule, onClose, serviceName }) => {
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedRules, setEditedRules] = useState({...rule});
    const [loading, setLoading] = useState(true);
    const severityChanges = ['ERROR', 'SEVERE', 'WARN', 'INFO']
    const constraints = ['greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual']
    const constraint = ['present', 'notpresent']
    const severityTextRule = ['CRITICAL', 'WARNING', 'INFO']

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const handleClose = () => {
        setOpen(false);
        setIsEditing(false);
        // if (onClose) {
        //   onClose();
        // }
    };

  //   const handleClose = () => {
  //     try {
  //       setLoading(true);
  //       setOpen(false);
  //       setIsEditing(false);
  //       if (onClose) {
  //         onClose();
  //       }
  //       setLoading(false);
  //     } catch (error) {
  //       setLoading(false);
  //     }      
  // };

    const handleEditClick = () => {
        setIsEditing(true);
    };
    
    const handleSaveClick = async() => {
        try {
            const updatedRule = {
                serviceName: serviceName,
                roles: userInfo.roles,
                rules: [editedRules]
            }
            await updateServiceList(updatedRule);
            handleClose();
            setIsEditing(false);
          } catch (error) {
            console.error("Error updating rule:", error);
          }
    };

    const handleFieldChange = (value, name) => {
      let newValue;

      if (name === 'startDateTime') {
        newValue = format(value, "yyyy-MM-dd'T'HH:mm:ss");
      } else if (name === 'expiryDateTime') {
        newValue = format(value, "yyyy-MM-dd'T'HH:mm:ss");
      } else {
          newValue = value;
      }
  
      setEditedRules(prevState => ({
          ...prevState,
          [name]: newValue,
      }));
    };

    useEffect(() => {
      setOpen(true);
      setIsEditing(false);
  }, [rule]);

  return (
    <Dialog open={open}>
      <DialogTitle>{`Rule Details - ${serviceName} - ${rule.ruleType}`}</DialogTitle>
      <DialogContent>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Field</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Rule Type</TableCell>
                <TableCell>{rule.ruleType}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Service Name</TableCell>
                <TableCell>{serviceName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Start Date</TableCell>
                <TableCell>
                    {isEditing ? (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                        name="startDateTime"
                        // value={editedRules.startDateTime}
                        value={editedRules.startDateTime ? new Date(editedRules.startDateTime) : null}
                        // onChange={handleFieldChange}
                        onChange={(value) => handleFieldChange(value, 'startDateTime')}
                        disableFuture
                        />
                      </LocalizationProvider>
                    ) : (
                        rule.startDateTime
                    )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Expiry Date</TableCell>
                <TableCell>
                    {isEditing ? (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            name="expiryDateTime"
                            // value={editedRules.expiryDateTime}
                            value={editedRules.expiryDateTime ? new Date(editedRules.expiryDateTime) : null}
                            minDate={editedRules.startDateTime ? new Date(editedRules.startDateTime) : null}
                            // onChange={handleFieldChange}
                            onChange={(value) => handleFieldChange(value, 'expiryDateTime')}
                        />
                      </LocalizationProvider>
                    ) : (
                        rule.expiryDateTime
                    )}
                </TableCell>
              </TableRow>

              {rule.ruleType === "trace" && (
                <>
                  <TableRow>
                    <TableCell>Duration</TableCell>
                    <TableCell>
                        {isEditing ? (
                            <TextField
                                name="duration"
                                type="number"
                                value={editedRules.duration}
                                // onChange={handleFieldChange}
                                onChange={(event) => handleFieldChange(event.target.value, 'duration')}
                            />
                        ) : (
                            rule.duration
                        )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Duration Constraint</TableCell>
                    <TableCell>
                        {isEditing ? (
                            <Select
                                name="durationConstraint"
                                value={editedRules.durationConstraint}
                                // onChange={handleFieldChange}
                                onChange={(event) => handleFieldChange(event.target.value, 'durationConstraint')}
                            >
                              <MenuItem value="" disabled>Select Rule Type</MenuItem>
                              {constraints.map((constraintDuration, index) => (
                                <MenuItem key={index} value={constraintDuration} sx={{ color: 'black' }}>
                                  {constraintDuration}
                                </MenuItem>
                              ))}
                            </Select>
                        ) : (
                            rule.durationConstraint
                        )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Trace Alert Severity</TableCell>
                    <TableCell>
                        {isEditing ? (
                            <Select
                                name="tracecAlertSeverityText"
                                value={editedRules.tracecAlertSeverityText}
                                // onChange={handleFieldChange}
                                onChange={(event) => handleFieldChange(event.target.value, 'tracecAlertSeverityText')}
                            >
                              <MenuItem value="" disabled>Select Trace Alert Severity</MenuItem>
                              {severityTextRule.map((traceSeverity, index) => (
                                <MenuItem key={index} value={traceSeverity} sx={{ color: 'black'}}>
                                  {traceSeverity}
                                </MenuItem>
                              ))}
                            </Select>
                        ) : (
                            rule.tracecAlertSeverityText
                        )}
                    </TableCell>
                  </TableRow>
                </>
              )}

              {rule.ruleType === "metric" && (
                <>
                  <TableRow>
                    <TableCell>Memory Limit</TableCell>
                    <TableCell>
                        {isEditing ? (
                            <TextField
                                name="memoryLimit"
                                type="number"
                                value={editedRules.memoryLimit}
                                // onChange={handleFieldChange}
                                onChange={(event) => handleFieldChange(event.target.value, 'memoryLimit')}
                            />
                        ) : (
                            rule.memoryLimit
                        )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Memory Constraint</TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Select
                          name="memoryConstraint"
                          value={editedRules.memoryConstraint}
                          // onChange={handleFieldChange}
                          onChange={(event) => handleFieldChange(event.target.value, 'memoryConstraint')}
                        >
                          <MenuItem value="" disabled>Select Memory Constraint</MenuItem>
                          {constraints.map((constraintMemory, index) => (
                            <MenuItem key={index} value={constraintMemory} sx={{ color: 'black'}}>
                              {constraintMemory}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        rule.memoryConstraint
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Memory Alert Severity</TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Select
                          name="memoryAlertSeverityText"
                          value={editedRules.memoryAlertSeverityText}
                          // onChange={handleFieldChange}
                          onChange={(event) => handleFieldChange(event.target.value, 'memoryAlertSeverityText')}
                        >
                          <MenuItem>Select Memory Alert Severity</MenuItem>
                          {severityTextRule.map((memorySeverity, index) => (
                            <MenuItem key={index} value={memorySeverity} sx={{ color: 'black'}}>
                              {memorySeverity}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        rule.memoryAlertSeverityText
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CPU Limit</TableCell>
                    <TableCell>
                      {isEditing ? (
                        <TextField
                          name="cpuLimit"
                          type="number"
                          value={editedRules.cpuLimit}
                          // onChange={handleFieldChange}
                          onChange={(event) => handleFieldChange(event.target.value, 'cpuLimit')}
                        />
                      ) : (
                        rule.cpuLimit
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CPU Constraint</TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Select
                          name="cpuConstraint"
                          value={editedRules.cpuConstraint}
                          // onChange={handleFieldChange}
                          onChange={(event) => handleFieldChange(event.target.value, 'cpuConstraint')}
                        >
                         <MenuItem value="" disabled>Select CPU Constraint</MenuItem>
                        {constraints.map((constraintCpu, index) => (
                          <MenuItem key={index} value={constraintCpu} sx={{ color: 'black'}}>
                            {constraintCpu}
                          </MenuItem>
                        ))} 
                        </Select>
                      ) : (
                        rule.cpuConstraint
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CPU Alert Severity</TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Select
                          name="cpuAlertSeverityText"
                          value={editedRules.cpuAlertSeverityText}
                          // onChange={handleFieldChange}
                          onChange={(event) => handleFieldChange(event.target.value, 'cpuAlertSeverityText')}
                        >
                          <MenuItem>Select CPU Alert Severity</MenuItem>
                          {severityTextRule.map((cpuSeverity, index) => (
                            <MenuItem key={index} value={cpuSeverity} sx={{ color: 'black' }}>
                              {cpuSeverity}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        rule.cpuAlertSeverityText
                      )}
                    </TableCell>
                  </TableRow>
                </>
              )}

              {rule.ruleType === "log" && (
                <>
                  <TableRow>
                    <TableCell>Severity Text</TableCell>
                    <TableCell>
                        {isEditing ? (
                            <Select
                                multiple
                                name="severityText"
                                value={editedRules.severityText}
                                // onChange={handleFieldChange}
                                onChange={(event) => handleFieldChange(event.target.value, 'severityText')}
                            >
                              <MenuItem value="" disabled>Select Severity Text</MenuItem>
                              {severityChanges.map((severityTextSelect, index) => (
                                <MenuItem key={index} value={severityTextSelect} sx={{ color: 'black' }}>
                                  {severityTextSelect}
                                </MenuItem>
                              ))}
                            </Select>
                        ) : (
                          rule.severityText.join(', ') 
                        )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Severity Constraint</TableCell>
                    <TableCell>
                        {isEditing ? (
                            <Select
                                name="severityConstraint"
                                value={editedRules.severityConstraint}
                                // onChange={handleFieldChange}
                                onChange={(event) => handleFieldChange(event.target.value, 'severityConstraint')}
                            >
                              <MenuItem value="" disabled>Select Severity Constraint</MenuItem>
                              {constraint.map((constraintSeverity, index) => (
                                <MenuItem key={index} value={constraintSeverity} sx={{ color: 'black' }}>
                                  {constraintSeverity}
                                </MenuItem>
                              ))}
                            </Select>
                        ) : (
                          rule.severityConstraint
                        )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Log Alert Severity</TableCell>
                    <TableCell>
                        {isEditing ? (
                            <Select
                                name="logAlertSeverityText"
                                value={editedRules.logAlertSeverityText}
                                // onChange={handleFieldChange}
                                onChange={(event) => handleFieldChange(event.target.value, 'logAlertSeverityText')}
                            >
                              <MenuItem value="" disabled>Select Log Alert Severity</MenuItem>
                              {severityTextRule.map((logSeverity, index) => (
                                <MenuItem key={index} value={logSeverity} sx={{ color: 'black' }}>
                                  {logSeverity}
                                </MenuItem>
                              ))}
                            </Select>
                        ) : (
                          rule.logAlertSeverityText
                        )}
                    </TableCell>
                  </TableRow>
                </>
              )}

            </TableBody>
          </Table>
        </TableContainer>

      </DialogContent>
      <DialogActions>
      {isEditing ? (
          <Button variant="contained" color="primary" onClick={handleSaveClick}>
            Save
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleEditClick}>
            Edit
          </Button>
        )}

        <Button variant="contained" color="primary" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RuleDetailsPopup;
