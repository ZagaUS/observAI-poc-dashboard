import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Observai from "../assets/observai.png";
import Infra from "../assets/Infra.jpeg";
import Sustainability from "../assets/sustainability.jpeg";
import Admin from "../assets/admin.jpeg";
import ZagaLogo from "../assets/zaga-logedit.jpg";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useTokenExpirationCheck } from "./TokenExpiry";
import { isTokenExpired, logout } from "./AuthMechanism";
import "./LandingPage.css";
import { GlobalContext } from "./globalContext/GlobalContext";
import { getRealtimeAlertData } from "../api/AlertApiService";

const LandingPage = () => {
  const navigate = useNavigate();
  // const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");

  // console.log("authenticated", authenticated);

  const {
    setSelectedCluster,
    authenticated,
    setAuthenticated,
    socketInstance,
    setSocketInstance,
  } = useContext(GlobalContext);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // console.log("userInfo", userInfo);

  // const checkTokenExpiration = useTokenExpirationCheck();

  const checkTokenExpiration = useTokenExpirationCheck();

  // Memoize the function to prevent unnecessary re-renders
  const memoizedCheckTokenExpiration = useMemo(() => checkTokenExpiration, []);

  // let socketInstance = null;

  const closeWebSocket = async () => {
    // if (socketInstance) {
    //   socketInstance.close();
    //   console.log("WebSocket connection closed.");
    //   setSocketInstance(null);
    // }
    // try {
    // Initialize WebSocket connection
    // const socketInstance = await getRealtimeAlertData();
    // socketInstance.close();
  };

  // Function to close the WebSocket connection
  // const closeWebSocket = () => {
  //   const socket = await getRealtimeAlertData();
  //   if (!!socket && socket.readyState === socket.OPEN) {
  //     socket.close();
  //   } else {
  //     console.log("Unable to close websocket as it is not open");
  //   }
  // };

  useEffect(() => {
    const userDetails = localStorage.getItem("userInfo");
    // checkTokenExpiration();
    memoizedCheckTokenExpiration();

    if (userDetails) {
      const user = JSON.parse(userDetails);
      const checkRole = user.roles;
      console.log("----[AUTHCHECK IN LANDING PAGE]------", !!checkRole);
      setAuthenticated(!!checkRole);
      localStorage.setItem("authendicate", !!checkRole);
      setUserRole(user.roles);
    }
  }, [memoizedCheckTokenExpiration]);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    console.log("logout---->");
    // Check if the token is expired
    // setSelectedCluster([]);
    // localStorage.getItem("authendicate");
    closeWebSocket();
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
    // localStorage.setItem("authendicate", false);
    setAuthenticated(false);
  };

  const handleObservability = () => {
    if (authenticated) {
      if (
        userRole.includes("admin") ||
        userRole.includes("vendor") ||
        userRole.includes("apm")
      ) {
        navigate("/mainpage/dashboard");
      } else {
        navigate("/notAuth");
      }
    } else {
      navigate("/login");
    }
  };

  const handleInfra = () => {
    if (authenticated) {
      if (userRole.includes("admin") || userRole.includes("infra")) {
        navigate("/mainpage/infraInfo");
      } else {
        navigate("/notAuth");
      }
    } else {
      navigate("/login");
    }
  };

  const handleSustainability = () => {
    if (authenticated) {
      if (userRole.includes("admin") || userRole.includes("sustainability")) {
        navigate("/mainpage/sustainability");
      } else {
        navigate("/notAuth");
      }
    } else {
      navigate("/login");
    }
  };

  const handleAdminPage = () => {
    // navigate(authenticated ? "/admin" : "/notAuth");
    if (authenticated) {
      // If the user is authenticated
      if (userRole.includes("admin")) {
        navigate("/admin/adminMainpage");
      } else {
        navigate("/notAuth");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="container">
      {" "}
      <div
        style={{ paddingTop: "30px", display: "flex", flexDirection: "column" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "70px",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              paddingLeft: "75px",
            }}
          >
            <Box
              component="img"
              sx={{
                height: 60,
                width: 230,
                maxHeight: { xs: 233, md: 167 },
                maxWidth: { xs: 350, md: 250 },
              }}
              src={ZagaLogo}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              width: "140px",
              // marginRight:"10px"
            }}
          >
            <div style={{ marginTop: "8px" }}>
              {authenticated && userInfo ? (
                // Display username only when authenticated
                <Typography sx={{ color: "#FFF" }} variant="h6">
                  {userInfo.username}
                </Typography>
              ) : (
                <Typography sx={{ color: "#FFF" }} variant="h6">
                  Login
                </Typography>
              )}
            </div>

            {authenticated ? (
              <IconButton onClick={handleLogout}>
                <LogoutIcon
                  style={{
                    fontSize: "20px",
                    color: "#FFF",
                    marginRight: "15px",
                  }}
                />
              </IconButton>
            ) : (
              <IconButton onClick={handleLogin}>
                <LoginIcon
                  style={{
                    fontSize: "20px",
                    color: "#FFF",
                    marginRight: "15px",
                  }}
                />
              </IconButton>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: "70px",
            paddingRight: "15px",
            marginTop: "-50px",
          }}
        >
          <Typography
            variant="h4"
            style={{ color: "#FFF", fontWeight: "bold" }}
          >
            Knative Observability Platform - One Place where you can observe
            both Application and Infrastructure
          </Typography>
        </div>

        <Box
          sx={{
            marginBottom: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            container
            spacing={6}
            justifyContent="center"
            textAlign="center"
            alignItems="center"
          >
            <Grid item xs={8} sm={2.6} ipadmini={4}>
              <Grid container justifyContent="center">
                <Card elevation={3} sx={{ backgroundColor: "#1e1f21 " }}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image={Observai}
                    title="observability"
                  />
                  <CardContent sx={{ height: "168px" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#FFF" }}
                    >
                      Observability - APM
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "white",
                        textAlign: "justify",
                        fontWeight: "light",
                        paddingTop: "10px",
                      }}
                    >
                      Observability is the extent to which you can understand
                      the internal state or condition of a complex system based
                      only on knowledge of its external outputs.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="info"
                      onClick={handleObservability}
                    >
                      Open Observability
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>

            <Grid item xs={8} sm={2.6} ipadmini={4}>
              <Grid container justifyContent="center">
                <Card elevation={3} sx={{ backgroundColor: "#1e1f21 " }}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image={Infra}
                    title="observability"
                  />
                  <CardContent sx={{ height: "168px" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#FFF" }}
                    >
                      Observability - Infra
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "white",
                        textAlign: "justify",
                        fontWeight: "light",
                        paddingTop: "10px",
                      }}
                    >
                      Observability is the extent to which you can understand
                      the internal state or condition of a complex system based
                      only on knowledge of its external outputs.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="info" onClick={handleInfra}>
                      Open Infrastructure
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>

            <Grid item xs={8} sm={2.6} ipadmini={4}>
              <Grid container justifyContent="center">
                <Card elevation={3} sx={{ backgroundColor: "#1e1f21 " }}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image={Sustainability}
                    title="Sustainability"
                  />
                  <CardContent sx={{ height: "168px" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#FFF" }}
                    >
                      Sustainability
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "white",
                        textAlign: "justify",
                        fontWeight: "light",
                        paddingTop: "10px",
                      }}
                    >
                      Sustainability has become a priority in all aspects of a
                      business, and to manage energy efficiency. IT ops teams
                      must look closely at where and what is using the most
                      energy and one major offender is Kubernetes clusters.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="info"
                      onClick={handleSustainability}
                    >
                      Open Sustainability
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>

            <Grid item xs={8} sm={2.6} ipadmini={4}>
              <Grid container justifyContent="center">
                <Card elevation={3} sx={{ backgroundColor: "#1e1f21 " }}>
                  <CardMedia sx={{ height: 140 }} image={Admin} title="Admin" />
                  <CardContent sx={{ height: "168px" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#FFF" }}
                    >
                      Admin
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "white",
                        textAlign: "justify",
                        fontWeight: "light",
                        paddingTop: "10px",
                      }}
                    >
                      Identify the specific rules and policies you want to
                      enforce within your clusters. Implement specific rules and
                      policies within clusters to govern resource allocation.
                      Creating and modifying clusters while enforcing rules.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="info" onClick={handleAdminPage}>
                      Open Admin Dashboard
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </div>
    </div>
  );
};

export default LandingPage;
