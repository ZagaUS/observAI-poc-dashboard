import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  useMediaQuery,
  Box,
  Typography,
  Dialog,
  DialogContent,
  Popover,
  Divider,
  ListItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import { Brightness4, Brightness7, Person } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import Badge from "@mui/material/Badge";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import { ColorModeContext, tokens } from "../theme";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "./globalContext/GlobalContext";
import logo from "../assets/zaga-logedit.jpg";
import { useState } from "react";
import { getRealtimeAlertData } from "../api/AlertApiService";
import { useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { isTokenExpired, logout } from "./AuthMechanism";
import { useTokenExpirationCheck } from "./TokenExpiry";
import HomeIcon from "@mui/icons-material/Home";
import { GiPortal } from "react-icons/gi";
import AddToHomeScreenIcon from "@mui/icons-material/AddToHomeScreen";
import WindowIcon from "@mui/icons-material/Window";

function Topbar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const colors = tokens(theme.palette.mode);

  const colorMode = useContext(ColorModeContext);
  const {
    setMetricRender,
    alertResponse,
    setNotificationCount,
    notificationCount,
  } = useContext(GlobalContext);
  const [anchorEl, setAnchorEl] = useState(null);

  // const checkTokenExpiration = useTokenExpirationCheck();

  // useEffect(() => {
  //   checkTokenExpiration();
  // }, [checkTokenExpiration]);

  const handleIconClick = (event) => {
    setAnchorEl(event.currentTarget);
    setNotificationCount(0);
  };

  const handleCloseModal = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  // const handleLogout = () => {
  //   localStorage.setItem("loggedOut",true);
  //   logout();
  //   navigate("/");
  // };

  const handleLogout = async () => {
    // Check if the token is expired
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && isTokenExpired(accessToken)) {
      // Token is expired, clear local storage and navigate to the home page
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("roles");
      localStorage.removeItem("userInfo");
      navigate("/");
      return;
    }

    // Set a flag to indicate that the user has logged out
    localStorage.setItem("loggedOut", true);

    try {
      // Attempt to call the Keycloak logout API
      await logout();
    } catch (error) {
      // Handle errors from the logout API call
      console.error("Logout request failed:", error);
    }

    // Clear tokens from localStorage (even if Keycloak logout API fails)
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("roles");
    localStorage.removeItem("userInfo");

    // Navigate to the home page
    navigate("/");
  };

  const appBarStyles = {
    height: "50px",
  };

  const handleColorMode = () => {
    setMetricRender(false);
    colorMode.toggleColorMode();
  };

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const user = userInfo.username;

  const [selectedOption, setSelectedOption] = useState("metric"); // Initial selected option

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  // console.log("slectedoption", selectedOption);
  // console.log("alertmessage", alertResponse[selectedOption]);

  const handleHomepage = () => {
    navigate("/");
  };

  return (
    <div>
      {isSmallScreen ? (
        <AppBar position="static" style={appBarStyles}>
          <Toolbar
            sx={{
              backgroundColor: colors.primary[400],
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box style={{ margin: "15px 0px 10px 0px", display: "flex" }}>
              <img
                src={logo}
                alt="Logo"
                style={{
                  // height: "60px",
                  width: "60px",
                  height: "27px",
                  // color:"#FFF"
                }}
              />
              <Typography
                sx={{ color: "#FFF" }}
                variant="h4"
                fontWeight="500"
                marginLeft={1}
              >
                OBSERVABILITY
              </Typography>
            </Box>
            <Box sx={{ display: "flex" }}>
              {" "}
              <IconButton
                aria-label="Toggle Dark Mode"
                onClick={() => handleColorMode()}
              >
                {theme.palette.mode === "light" ? (
                  <Brightness7 style={{ fontSize: "20px", color: "#FFF" }} />
                ) : (
                  <Brightness4 style={{ fontSize: "20px" }} />
                )}
              </IconButton>
              {/* <IconButton style={{ marginLeft: "5px" }}>
              <Person style={{ fontSize: "20px", color: "#FFF" }} />
            </IconButton>
            <span style={{ color: colors.tabColor[500] }}>User: {user}</span> */}
              <div style={{ marginLeft: "20px" }}>
                {/* <IconButton aria-label="Account" onClick={handleLogout}>
                  <LogoutIcon style={{ fontSize: "20px", color: "#FFF" }} />
                </IconButton> */}

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleHomepage}
                  sx={{
                    color: "black",
                    fontWeight: "bold",
                    backgroundColor: "white",
                    marginRight: "20px",
                    "&:hover": { backgroundColor: "white" },
                  }}
                >
                  Portal Home
                </Button>
              </div>
            </Box>
          </Toolbar>
        </AppBar>
      ) : (
        <AppBar position="static" style={appBarStyles}>
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              // marginTop: "2px",
              backgroundColor: colors.primary[400],
            }}
          >
            {/* <IconButton onClick={handleIconClick} >
              <Badge badgeContent={notificationCount} color="primary">
                <NotificationImportantIcon style={{ fontSize: "20px", color: "#FFF" }} />
              </Badge>
            </IconButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleCloseModal}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
             
              <>
              
                {alertResponse.metric.length > 0 && (
                  <>
                    <Typography variant="h6" sx={{ mt: 2, textAlign:"center" }}>Metric Alerts</Typography>
                    {alertResponse.metric.map((data, index) => (
                      <div key={`metric-${index}`}>
                        <Typography sx={{ p: 2 }}>{data.alertData}</Typography>
                        {index !== alertResponse.metric.length - 1 && <Divider />}
                      </div>
                    ))}
                  </>
                )}

             
                {alertResponse.trace.length > 0 && (
                  <>
                    <Typography variant="h6" sx={{ mt: 2, textAlign:"center" }}>Trace Alerts</Typography>
                    {alertResponse.trace.map((data, index) => (
                      <div key={`trace-${index}`}>
                        <Typography sx={{ p: 2 }}>{data.alertData}</Typography>
                        {index !== alertResponse.trace.length - 1 && <Divider />}
                      </div>
                    ))}
                  </>
                )}

              
                {alertResponse.log.length > 0 && (
                  <>
                    <Typography variant="h6" sx={{ mt: 2, textAlign:"center" }}>Log Alerts</Typography>
                    {alertResponse.log.map((data, index) => (
                      <div key={`log-${index}`}>
                        <Typography sx={{ p: 2 }}>{data.alertData}</Typography>
                        {index !== alertResponse.log.length - 1 && <Divider />}
                      </div>
                    ))}
                  </>
                )}
              </>
            </Popover> */}
            <IconButton
              aria-label="Toggle Dark Mode"
              onClick={() => handleColorMode()}
              style={{ marginLeft: "10px" }}
            >
              {theme.palette.mode === "light" ? (
                <Brightness7 style={{ fontSize: "20px", color: "#FFF" }} />
              ) : (
                <Brightness4 style={{ fontSize: "20px" }} />
              )}
            </IconButton>
            <IconButton style={{ marginLeft: "5px" }}>
              <Person style={{ fontSize: "20px", color: "#FFF" }} />
            </IconButton>
            <span
              style={{
                color: colors.tabColor[500],
                marginRight: "5px",
                paddingTop: "5px",
              }}
            >
              User: {user}
            </span>
            <IconButton onClick={handleIconClick}>
              <Badge badgeContent={notificationCount} color="error">
                <NotificationImportantIcon
                  style={{ fontSize: "20px", color: "#FFF" }}
                />
              </Badge>
            </IconButton>

            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleCloseModal}
              style={{ top: "28px", right: "0%", left: "-60px" }}
              PaperProps={{
                style: {
                  borderRadius: "10px",
                },
              }}
            >
              <ListItem>
                <Accordion
                  style={{
                    width: "430px",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "gray"
                        : colors.primary[400],
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5" color={"#fff"}>
                      Metric Alerts
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    <FormGroup>
                      {alertResponse.metric.length > 0 ? (
                        <>
                          {alertResponse.metric.map((data, index) => (
                            <div key={`metric-${index}`}>
                              <Typography
                                variant="h6"
                                sx={{
                                  p: 2,
                                  lineHeight: "1",
                                  backgroundColor: "white",
                                  // color:"black"
                                  color: data.alertData.includes("CRITICAL")
                                    ? "red"
                                    : data.alertData.includes("WARNING")
                                    ? "yellow"
                                    : "black",
                                }}
                              >
                                {data.alertData}
                              </Typography>
                              {index !== alertResponse.metric.length - 1 && (
                                <Divider />
                              )}
                            </div>
                          ))}
                        </>
                      ) : (
                        <div style={{ color: "#000" }}>
                          There is no metric alert
                        </div>
                      )}
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              </ListItem>

              <ListItem>
                <Accordion
                  style={{
                    width: "430px",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "gray"
                        : colors.primary[400],
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5" color={"#fff"}>
                      Trace Alerts
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    <FormGroup>
                      {alertResponse.trace.length > 0 ? (
                        <>
                          {alertResponse.trace.map((data, index) => (
                            <div key={`trace-${index}`}>
                              <Typography
                                variant="h6"
                                sx={{
                                  p: 2,
                                  lineHeight: "1",
                                  backgroundColor: "white",
                                  // color:"red"
                                  color: data.alertData.includes("CRITICAL")
                                    ? "red"
                                    : data.alertData.includes("WARNING")
                                    ? "yellow"
                                    : "black",
                                }}
                              >
                                {data.alertData}
                              </Typography>
                              {index !== alertResponse.trace.length - 1 && (
                                <Divider />
                              )}
                            </div>
                          ))}
                        </>
                      ) : (
                        <div style={{ color: "#000" }}>
                          There is no trace alert
                        </div>
                      )}
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              </ListItem>

              <ListItem>
                <Accordion
                  style={{
                    width: "430px",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "gray"
                        : colors.primary[400],
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5" color={"#fff"}>
                      Log Alerts
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    <FormGroup>
                      {alertResponse.log.length > 0 ? (
                        <>
                          {alertResponse.log.map((data, index) => (
                            <div key={`log-${index}`}>
                              <Typography
                                variant="h6"
                                sx={{
                                  p: 2,
                                  lineHeight: "1",
                                  backgroundColor: "white",
                                  // color:"black"
                                  color: data.alertData.includes("CRITICAL")
                                    ? "red"
                                    : data.alertData.includes("WARNING")
                                    ? "yellow"
                                    : "black",
                                }}
                              >
                                {data.alertData}
                              </Typography>
                              {index !== alertResponse.log.length - 1 && (
                                <Divider />
                              )}
                            </div>
                          ))}
                        </>
                      ) : (
                        <div style={{ color: "#000" }}>
                          There is no log alert
                        </div>
                      )}
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              </ListItem>

              {/* <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginBottom: "10px",
                }}
              >
                
                {["metric", "trace", "log"].map((option) => (
                  <Typography
                    key={option}
                    variant="body1"
                    sx={{
                      cursor: "pointer",
                      textDecoration:
                        selectedOption === option ? "underline" : "none",
                    }}
                    onClick={() => handleOptionChange(option)}
                  >
                    {option}
                  </Typography>
                ))}
              </div>
              {alertResponse[selectedOption].length > 0 && (
                <>
                  {alertResponse[selectedOption].map((data, index) => (
                    <div key={`${selectedOption}-${index}`}>
                      <Typography variant="h6" sx={{ p: 2, lineHeight: "1" }}>
                        {data.alertData}
                      </Typography>
                      {index !== alertResponse[selectedOption].length - 1 && (
                        <Divider />
                      )}
                    </div>
                  ))}
                </>
              )} */}
            </Popover>

            {/* <Popover
           
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleCloseModal}
              style={{ top: '28px' ,right:"0%",left:"-60px"}}
              PaperProps={{
                style: {
                  borderRadius: '10px', // Adjust the border-radius value as needed
                },
              }}
              anchorOrigin={{
                // vertical: 'bottom',
                // horizontal: 'left',
              }}
              transformOrigin={{
                // vertical: '45px',
                // horizontal: '1305px',
              }}
            >
            
              <>
             
                {alertResponse.metric.length > 0 && (
                  <>
                    <Typography variant="h5" sx={{ lineHeight: '2',  fontWeight:"bold", backgroundColor:"#769095", textAlign:"center" ,color:"#FFF"}}>Metric Alerts</Typography>
                    {alertResponse.metric.map((data, index) => (
                      <div key={`metric-${index}`}>
                        <Typography variant="h6" sx={{ p: 2, lineHeight: '1'  }}>{data.alertData}</Typography>
                        {index !== alertResponse.metric.length - 1 && <Divider />}
                      </div>
                    ))}
                  </>
                )}

                
                {alertResponse.trace.length > 0 && (
                  <>
                    <Typography variant="h5" sx={{ lineHeight: '2',  fontWeight:"bold", backgroundColor:"#769095", textAlign:"center" ,color:"#FFF"}}>Trace Alerts</Typography>
                    {alertResponse.trace.map((data, index) => (
                      <div key={`trace-${index}`}>
                        <Typography variant="h6" sx={{ p: 2, lineHeight: '1'  }}>{data.alertData}</Typography>
                        {index !== alertResponse.trace.length - 1 && <Divider />}
                      </div>
                    ))}
                  </>
                )}

              
                {alertResponse.log.length > 0 && (
                  <>
                    <Typography variant="h5" sx={{ lineHeight: '2',  fontWeight:"bold", backgroundColor:"#769095", textAlign:"center" ,color:"#FFF"}}>Log Alerts</Typography>
                    {alertResponse.log.map((data, index) => (
                      <div key={`log-${index}`}>
                        <Typography variant="h6" sx={{ p: 2, lineHeight: '1'  }}>{data.alertData}</Typography>
                        {index !== alertResponse.log.length - 1 && <Divider />}
                      </div>
                    ))}
                  </>
                )}
              </>
            </Popover> */}
            <div style={{ marginLeft: "5px", marginTop: "5px" }}>
              <span style={{ color: "white" }}>Portal</span>
              <IconButton aria-label="Account" onClick={handleHomepage}>
                <WindowIcon
                  style={{
                    fontSize: "20px",
                    color: "#FFF",
                    marginBottom: "5px",
                  }}
                />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      )}
    </div>
  );
}

export default Topbar;
