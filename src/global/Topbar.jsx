import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  useMediaQuery,
  Box,
  Typography,
} from "@mui/material";
import { Brightness4, Brightness7, Person } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { ColorModeContext, tokens } from "../theme";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "./globalContext/GlobalContext";
import logo from "../assets/zaga-logedit.jpg";
import indigoLogo from "../assets/indigoNew3.jpeg"

function Topbar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { setMetricRender } = useContext(GlobalContext);

  const handleLogout = () => {
    navigate("/");
  };
  const appBarStyles = {
    height: "50px",
    // width: "768px",
    // width:isSmallScreen? "768px":"100%"
  };

  const handleColorMode = () => {
    setMetricRender(false);
    colorMode.toggleColorMode();
  };

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const user = userInfo.username;

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
              <Typography sx={{color:"#FFF"}}variant="h4" fontWeight="500" marginLeft={1}>
                OBSERVABILITY
              </Typography>
            </Box>
            <Box sx={{display:"flex"}}>
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
                <IconButton aria-label="Account" onClick={handleLogout}>
                  <LogoutIcon style={{ fontSize: "20px", color: "#FFF" }} />
                </IconButton>
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
            <img
              src={indigoLogo}
              alt="Logo"
              style={{
                // width: "180px",x
                // height: "60px",
                marginRight:"820px",
                marginTop:"5px",
                width: "180px",
                height: "60px",
              }}
            />
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
            <IconButton style={{ marginLeft: "5px" }}>
              <Person style={{ fontSize: "20px", color: "#FFF" }} />
            </IconButton>
            <span style={{ color: colors.tabColor[500] }}>User: {user}</span>
            <div style={{ marginLeft: "20px" }}>
              <IconButton aria-label="Account" onClick={handleLogout}>
                <LogoutIcon style={{ fontSize: "20px", color: "#FFF" }} />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      )}
    </div>
  );
}

export default Topbar;
