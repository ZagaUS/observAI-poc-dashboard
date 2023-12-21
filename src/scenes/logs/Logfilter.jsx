import React, { useEffect, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, Divider, Drawer, FormControlLabel, FormGroup, IconButton, List, ListItem, Typography, useTheme } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { useContext } from 'react';
import { GlobalContext } from '../../global/globalContext/GlobalContext';
import { tokens } from "../../theme";

const Logfilter = () => {
  // const [logSelectedService, setLogSelectedService] = useState([]);
  // const [selectedSeverity, setSelectedSeverity] = useState([]);
  const { setLogFilterApiBody, setNeedLogFilterCall, clearLogFilter, setClearLogFilter, setSelectedLogService, logSelectedService,
    setLogSelectedService, selectedSeverity,
    setSelectedSeverity } = useContext(GlobalContext);
  const [services, setServices] = useState(JSON.parse(localStorage.getItem("serviceListData")));

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // const services = ['order-project', 'vendor-project', 'ProviderService', 'DeliveryService'];

  const severity = ['ERROR', 'SEVERE', 'WARN', 'INFO'];

  const handleServiceToggle = (service) => () => {
    if (logSelectedService.includes(service)) {
      setLogSelectedService(logSelectedService.filter((item) => item !== service));
      setSelectedLogService(logSelectedService.filter((item) => item !== service));
    } else {
      setLogSelectedService([...logSelectedService, service]);
      setSelectedLogService([...logSelectedService, service]);
    }
  };

  const clearSelectedOptions = () => {
    setLogSelectedService([]);
    setSelectedSeverity([]);
    setSelectedLogService([]);
  }

  const handleSeverityToggle = (severity) => () => {
    if (selectedSeverity.includes(severity)) {
      setSelectedSeverity(selectedSeverity.filter((item) => item !== severity));
    } else {
      setSelectedSeverity([...selectedSeverity, severity]);
    }
  }

  useEffect(() => {
    if (clearLogFilter) {
      clearSelectedOptions();
    }
  }, [clearLogFilter])

  const handleApplyButtonClick = () => {
    const payload = {
      service: logSelectedService,
      severityText: selectedSeverity
    }

    // const apiBody = {};

    // if (payload.service !== null && Array.isArray(payload.service) && payload.service.length > 0) {
    //   apiBody.serviceName = payload.service;
    // }

    // if (payload.severityText !== null && Array.isArray(payload.severityText) && payload.severityText.length > 0) {
    //   apiBody.severityText = payload.severityText;
    // }


    console.log('API Body:', payload);

    if (Object.keys(payload).length !== 0) {
      setLogFilterApiBody(payload);
      setNeedLogFilterCall(true);
    } else {
      setClearLogFilter(false);
      setNeedLogFilterCall(false);
    }


    // onClose();

  }


  return (
    <div className="custom-drawer" style={{ width: "245px", backgroundColor: colors.primary[400], overflowY: "auto", height: "82vh" }}>
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
          <ListItem sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
            <Typography variant="h5" fontWeight="500" color={"#FFF"}>Filter Options</Typography>
            <Button variant="contained" color='primary' onClick={clearSelectedOptions} sx={{
                color: window.location.pathname === "/mainpage/dashboard" ||
                window.location.pathname === "/mainpage/dashboard/logSummary" ||
                window.location.pathname === "/mainpage/dashboard/dbSummary" ||
                window.location.pathname === "/mainpage/dashboard/kafkaSummary"
                  ? "lightgrey"
                  : colors.primary[100],
              }}>Clear</Button>
            {/* <Button variant="contained" color='primary' onClick={clearSelectedOptions}>Clear</Button> */}
          </ListItem>
          <Divider />

        <ListItem>
          <Accordion style={{ width: "500px", backgroundColor: colors.primary[400] }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5" color={"#FFF"}>Service</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <FormGroup>
                {services.map((service) => (
                  <FormControlLabel
                    key={service}
                    control={<Checkbox
                      checked={logSelectedService.includes(service)}
                      onChange={handleServiceToggle(service)}
                      sx={{
                        // color: '#696969',
                        // color: '#F2F3F4',
                        color: '#17202A',

                        '&.Mui-checked': {
                          // color: "blue",
                          color: "white",
                        },
                      }}
                    />
                    }
                    label={service}
                    sx={{
                      color: 'white',
                    }}
                  />))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

        </ListItem>
        <Divider />

        <ListItem>
          <Accordion style={{ width: "500px", backgroundColor: colors.primary[400] }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5" color={"#FFF"}>Severity Changes</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <FormGroup>
                {severity.map((severity) => (
                  <FormControlLabel
                    key={severity}
                    control={<Checkbox
                      checked={selectedSeverity.includes(severity)}
                      onChange={handleSeverityToggle(severity)}
                      sx={{
                        // color: '#696969',
                        // color: '#F2F3F4',
                        color: '#17202A',

                        '&.Mui-checked': {
                          // color: "blue",
                          color: "white",
                        },
                      }}
                    />
                    }
                    label={severity}
                    sx={{
                      color: 'white',
                    }}
                  />))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        </ListItem>

      </List>

      <div style={{ padding: "16px" }}>
        <Button variant="contained" onClick={handleApplyButtonClick} color="primary">
          Apply
        </Button>
      </div>
    </div>
  )
}

export default Logfilter