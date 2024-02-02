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
  import React, { useEffect, useMemo, useState } from "react";
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
  
  const LandingPage = () => {
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState("")

    console.log("authenticated", authenticated);

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    console.log("userInfo", userInfo);

    // const checkTokenExpiration = useTokenExpirationCheck();

    const checkTokenExpiration = useTokenExpirationCheck();

    // Memoize the function to prevent unnecessary re-renders
    const memoizedCheckTokenExpiration = useMemo(() => checkTokenExpiration, []);

    useEffect(() => {
      const userDetails = localStorage.getItem("userInfo");
      // checkTokenExpiration();
      memoizedCheckTokenExpiration();
  
      if (userDetails) {
        const user = JSON.parse(userDetails);
        const checkRole = user.roles;
        setAuthenticated(!!checkRole);
        setUserRole(user.roles)
      }
    }, [memoizedCheckTokenExpiration]);
  
    const handlelogin = () => {
      navigate("/login");
    };

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
      setAuthenticated(false)
    };
  
    const handleobservability = () => {
      navigate(authenticated ? "/mainpage/dashboard" : "/notAuth");
    };
  
    const handleInfra = () => {
      navigate(authenticated ? "/mainpage/apm" : "/notAuth");
    }

    const handleSustainability = () => {
      navigate(authenticated ? "/mainpage/sustainability" : "/notAuth");
    }

    const handleAdminPage = () => {
      // navigate(authenticated ? "/admin" : "/notAuth");
      if (authenticated) {
        // If the user is authenticated
        if (userRole.includes("admin") ) {
          navigate("/admin");
        } else {
          navigate("/notAuth");
        }
      } else {
        navigate("/notAuth");
      }
    }  

  return (
    <div style={{ margin: "30px", display: "flex", flexDirection: "column" }}>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "110px",
        }}
      >

        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Box
            component="img"
            sx={{
              height: 60,
              width: 200,
              maxHeight: { xs: 233, md: 167 },
              maxWidth: { xs: 350, md: 250 },
            }}
            src={ZagaLogo}
          />
        </div>

        <div
          style={{ marginLeft: "10px" }}>
          {authenticated ? (
            <IconButton onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
          ) : (
            <IconButton onClick={handlelogin}>
            <LoginIcon />
          </IconButton>
          )}
          
        </div>
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
                <Card elevation={3}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image={Observai}
                    title="observability"
                  />
                  <CardContent sx={{ height: "168px" }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      Observability - APM
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "justify",
                        fontWeight: "light",
                        paddingTop: "10px",
                      }}
                    >
                      Observability is the extent to which you can understand the
                      internal state or condition of a complex system based only
                      on knowledge of its external outputs.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="info"
                      onClick={handleobservability}
                    >
                      Open Observability
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
  
            <Grid item xs={8} sm={2.6} ipadmini={4}>
              <Grid container justifyContent="center">
                <Card elevation={3}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image={Infra}
                    title="observability"
                  />
                  <CardContent sx={{ height: "168px" }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      Observability - Infra
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "justify",
                        fontWeight: "light",
                        paddingTop: "10px",
                      }}
                    >
                      Observability is the extent to which you can understand the
                      internal state or condition of a complex system based only
                      on knowledge of its external outputs.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                     size="small" 
                     color="info" 
                     onClick={handleInfra}
                    >
                      Open Observability
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
  
            <Grid item xs={8} sm={2.6} ipadmini={4}>
              <Grid container justifyContent="center">
                <Card elevation={3}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image={Sustainability}
                    title="Sustainability"
                  />
                  <CardContent sx={{ height: "168px" }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      Sustainability
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "justify",
                        fontWeight: "light",
                        paddingTop: "10px",
                      }}
                    >
                      Sustainability has become a priority in all aspects of a
                      business, and to manage energy efficiency. IT ops teams must
                      look closely at where and what is using the most energy and
                      one major offender is Kubernetes clusters.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="info" onClick={handleSustainability}>
                      Open Sustainability
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
  
            <Grid item xs={8} sm={2.6} ipadmini={4}>
              <Grid container justifyContent="center">
                <Card elevation={3}>
                  <CardMedia sx={{ height: 140 }} image={Admin} title="Admin" />
                  <CardContent sx={{ height: "168px" }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      Admin
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "justify",
                        fontWeight: "light",
                        paddingTop: "10px",
                      }}
                    >
                      Identify the specific rules and policies you want to enforce
                      within your clusters. Implement specific rules and policies
                      within clusters to govern resource allocation. Creating and
                      modifying clusters while enforcing rules.
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
    );
  };
  
  export default LandingPage;
  