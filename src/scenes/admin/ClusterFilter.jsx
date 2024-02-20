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

const ClusterFilter = () => {
  const {
    selectedService,
    setSelectedService,
    setMetricRender,
    openDrawer,
    setOpenDrawer,
  } = useContext(GlobalContext);
  //   const [services, setServices] = useState(
  //     JSON.parse(localStorage.getItem("serviceListData"))
  //   );

  const services = [
    "Cluster 1",
    "Cluster 2",
    "Cluster 3",
    "Cluster 4",
    "Cluster 5",
  ];
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isiphone = useMediaQuery((theme) => theme.breakpoints.down("iphone"));
  const isipadpro = useMediaQuery((theme) =>
    theme.breakpoints.down("isipadpro")
  );
  const largem = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  const clearSelectedOptions = () => {
    setSelectedService([]);
  };

  console.log(openDrawer, "openDrawer");

  const handleServiceToggle = (service) => () => {
    // setOpenDrawer(!openDrawer)
    if (selectedService.includes(service)) {
      setSelectedService(selectedService.filter((item) => item !== service));
    } else {
      setSelectedService([service]);
    }
    setMetricRender(false);
    // onClose();
  };

  const handleApplyButtonClick = () => {};

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
          {/* <Button
              variant="outlined"
              color="inherit"
              onClick={clearSelectedOptions}
            >
              Clear
            </Button> */}
        </ListItem>
        <Divider />

        <ListItem>
          <Accordion
            style={{ width: "500px", backgroundColor: colors.primary[400] }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5" color={"#fff"}>
                List Of Clusters
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <FormControl component="fieldset">
                <RadioGroup
                  value={selectedService}
                  sx={{
                    color: theme.palette.mode === "light" ? "#000" : "#FFF",
                  }}
                >
                  {services.map((service) => (
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
                  ))}
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
