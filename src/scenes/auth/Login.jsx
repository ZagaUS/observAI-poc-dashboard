import React, { useContext, useEffect, useState } from "react";
import "./Login.css";
import {
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { LoginInfo } from "../../global/MockData/LoginMock";
import { GlobalContext } from "../../global/globalContext/GlobalContext";
import {
  getAllClustersAPI,
  getServiceList,
  keycloakLoginAuth,
  loginUser,
} from "../../api/LoginApiService";
import Loading from "../../global/Loading/Loading";
import observai from "../../assets/observai.png";
import { green } from "@mui/material/colors";
import { getRealtimeAlertData } from "../../api/AlertApiService";
import { logout } from "../../global/AuthMechanism";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const {
    setServiceList,
    setSelected,
    setNotificationCount,
    alertResponse,
    setSelectedNode,
    setSelectedCluster,
    notificationCount,
    setAlertResponse,
    userDetails,
    setUserDetails,
    username,
    setUsername,
  } = useContext(GlobalContext);

  // const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [environments, setEnvironments] = useState([]);
  const [role, setRole] = useState("none");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [serviceListData, setServiceListData] = useState([]);
  const [clusterListData, setClusterListData] = useState([]);

  const servicePayload = (serviceData) => {
    serviceData.forEach((item) => {
      serviceListData.push(item.serviceName);
    });
    localStorage.setItem("serviceListData", JSON.stringify(serviceListData));
    console.log("ServiceName " + serviceListData);
  };

  const environmetsPayload = (clusterData) => {
    const FilterClusters = clusterData.filter(
      (env) => env.clusterStatus === "active"
    );
    FilterClusters.forEach((item) => {
      clusterListData.push(item.clusterName);
    });
    localStorage.setItem("clusterListData", JSON.stringify(clusterListData));
    // const Clusters = JSON.parse(localStorage.getItem("clusterListData"));
    console.log("clusterName " + clusterListData);
  };

  // const processWsData = (wsData) => {
  //   // console.log("output " + wsData);
  //   let metricObj = {};
  //   let traceObj = {};jwtDecode
  //   let logObj = {};
  //   if(wsData.alertType === "metric"){
  //     metricObj = {
  //       alertType:wsData.alertType,
  //       alertData: wsData.message
  //     }
  //   } else if (wsData.alertType === "trace"){
  //     traceObj = {
  //       alertType: wsData.alertType,
  //       alertData: wsData.message
  //     }
  //   } else if (wsData.alertType === "log"){
  //     logObj = {
  //       alertType: wsData.alertType,
  //       alertData: wsData.message
  //     }
  //   }
  //   console.log("output " + metricObj + " " + traceObj + " " + logObj);
  //   // console.log("output " + wsData);
  // }

  let metricAlerts = [];
  let traceAlerts = [];
  let logAlerts = [];

  // const processWsData = (wsData) => {
  //   if (wsData.alertType === "metric") {
  //     metricAlerts.push({
  //       alertType: wsData.alertType,
  //       alertData: wsData.alertMessage // Assuming the alert message is in wsData.alertMessage
  //     });
  //   } else if (wsData.alertType === "trace") {
  //     traceAlerts.push({
  //       alertType: wsData.alertType,
  //       alertData: wsData.alertMessage // Assuming the alert message is in wsData.alertMessage
  //     });
  //   } else if (wsData.alertType === "log") {
  //     logAlerts.push({
  //       alertType: wsData.alertType,
  //       alertData: wsData.alertMessage // Assuming the alert message is in wsData.alertMessage
  //     });
  //   }

  //   // Now metricAlerts, traceAlerts, and logAlerts arrays contain respective alerts
  //   console.log("Metric Alerts:", metricAlerts);
  //   console.log("Trace Alerts:", traceAlerts);
  //   console.log("Log Alerts:", logAlerts);
  //   alertResponse.push(metricAlerts);
  //   alertResponse.push(traceAlerts);
  //   alertResponse.push(logAlerts);
  // };

  const processWsData = (wsData) => {
    const { alertType, alertMessage } = wsData; // Destructure properties from wsData

    // Create an object to represent the alert
    const alert = {
      alertType,
      alertData: alertMessage, // Assuming the alert message is in wsData.alertMessage
    };

    // Push the alert to the respective array based on alertType
    alertResponse[alertType].push(alert);

    // Now alertResponse object contains alerts categorized by type
    console.log("Alerts:", alertResponse);
  };

  const fetchClusterData = async (username) => {
    try {
      const response = await getAllClustersAPI(username);
      console.log("res", response);

      if (response.length !== 0) {
        // setSelectedCluster([]);
        // setSelectedNode("");
        environmetsPayload(response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const fetchData = async (payload) => {
  //   try {
  //     const response = await loginUser(payload);
  //     console.log("res", response.data.environments);

  //     if (response.length !== 0) {
  //       localStorage.setItem(
  //         "environmetsData",
  //         JSON.stringify(response.data.environments)
  //       );
  //       environmetsPayload(response.data.environments);
  //     }

  // Do something with the fetched data
  // console.log(
  //   "localStorageCluster List",
  //   localStorage.getItem("clusterListData")
  // );
  // localStorage.setItem("clusterListData", JSON.stringify(response.data.environments));
  // setClusterData(response.data.environments);

  // openshiftClusterLogin
  // openshiftClusterLogin(ClusterData.hostUrl,ClusterData.clusterPassword,ClusterData.clusterUsername)
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const fetchAlerts = async () => {
    try {
      const socket = await getRealtimeAlertData();

      socket.onopen = () => {
        console.log("Websocket connection opened");
      };

      socket.onmessage = (event) => {
        if (event.data !== "[]") {
          console.log("Realtime data " + event.data);
          setNotificationCount((prevCount) => prevCount + 1);
          processWsData(JSON.parse(event.data));
          // alertResponse.push(JSON.parse(event.data));
        }
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed.");
        // setLoading(true);
      };
    } catch (error) {
      // Handle error
      console.log("Error occured " + error);
    }
  };

  // const getServiceListCall = async (userInfo) => {
  //   try {
  //     const serviceData = await getServiceList(userInfo);
  //     console.log("ServiceList " + JSON.stringify(serviceData));
  //     if (serviceData !== 0) {
  //       setServiceList(serviceData);
  //       servicePayload(serviceData);
  //       fetchAlerts();
  //       navigate("/mainpage/apm");
  //     } else {
  //       setErrorMessage("No Service assigned for this user");
  //     }
  //   } catch (error) {
  //     console.log("error " + error);
  //     setErrorMessage("An error occurred");
  //   }
  // };

  const getServiceListCall = async (userInfo) => {
    try {
      const serviceData = await getServiceList(userInfo);
      console.log("ServiceList " + JSON.stringify(serviceData));
      if (serviceData.length !== 0) {
        setServiceList(serviceData);
        servicePayload(serviceData);
        fetchAlerts();
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        // setUserDetails(userInfo);
        navigate("/");
        console.log("userInfo", userInfo);
        // setKeyClockRoles(userInfo.roles)
        // console.log("keycloackroles",keycloackroles);
        // Extract roles from the userInfo
        // const userRoles = userInfo.roles;

        // // Check user roles and navigate accordingly
        // if (userRoles.includes("admin")) {
        //   // If user has the 'admin' role, navigate to admin dashboard
        //   navigate("/mainpage/dashboard");
        // } else if (userRoles.includes("vendor")) {
        //   // If user has the 'vendor' role, navigate to vendor dashboard
        //   navigate("/mainpage/apm");
        // } else {
        //   // Default route for other roles
        //   navigate("/mainpage/dashboard");
        // }
        // console.log("UserDetails---------------", userDetails);
        // console.log("username", userDetails.username)
        // console.log("password", userDetails.password)
        // console.log("userrole", userDetails.roles)
        // console.log("userInfo " + JSON.stringify(userInfo));
        // console.log("serviceData " + serviceListData);
      } else {
        setErrorMessage("No Service assigned for this user");
        setLoading(false);
      }
    } catch (error) {
      console.log("error " + error);
      console.error("error------------", error);
      setErrorMessage("An error occurred");
      await logout();
    }
  };

  // useEffect(() => {
  //   console.log("UserDetails---------------", userDetails);
  // }, [userDetails]);

  const handleLogin = async () => {
    setErrorMessage("");
    // localStorage.clear("clusterListData");
    try {
      setLoading(true);

      // Validate input fields
      if (!username || !password) {
        setErrorMessage("Please fill in all fields.");
        setLoading(false);
        return;
      }

      // Prepare payload for login
      const payload = {
        username: username,
        password: password,
      };
      console.log("username", username);
      console.log("password", password);
      // Call SSO token provider URL directly
      const userAuth = await keycloakLoginAuth(payload);
      console.log("userAuth", userAuth);

      if (userAuth.error) {
        // Handle specific error scenarios
        switch (userAuth.error.response?.status) {
          case 401:
            setErrorMessage("Unauthorized. Please check your credentials.");
            break;
          case 404:
            setErrorMessage("Not found. Please try again.");
            break;
          case 403:
            setErrorMessage("Forbidden. Access denied.");
            break;
          default:
            setErrorMessage("Something went wrong. Please try again later.");
            break;
        }
        setLoading(false);
      } else {
        // Successful login
        localStorage.removeItem("loggedOut");
        localStorage.setItem("accessToken", userAuth.data.access_token);
        localStorage.setItem("refreshToken", userAuth.data.refresh_token);
        const decoded = jwtDecode(userAuth.data.access_token);
        localStorage.setItem(
          "roles",
          JSON.stringify(decoded.realm_access.roles)
        );
        const servicePayload = {
          username: username,
          password: password,
          roles: decoded.realm_access.roles,
        };
        // Call service list
        await getServiceListCall(servicePayload);

        // const Clusterpayload = {
        //   username: username,
        //   password: password,
        // };

        //call database login api

        console.log("checkGlobalUsername", username);
        // await fetchClusterData(username);
        // const ClusterApiResponse = await getAllClustersAPI(username);
        // if (ClusterApiResponse.length !== 0) {
        //   environmetsPayload(ClusterApiResponse);
        // }

        // console.log("ClusterApiResponse", ClusterApiResponse);

        setLoading(false);
        localStorage.setItem("routeName", "Dashboard");
        setSelected("Dashboard");
        localStorage.setItem("needHistoricalData", false);
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Login error:", error);
      setErrorMessage("Something went wrong. Please try again later.");
      setLoading(false);
    }
  };

  // const handleLogin = async () => {
  //   setLoading(true);
  //   localStorage.setItem("routeName", "Dashboard");
  //   setSelected("Dashboard");
  //   localStorage.setItem("needHistoricalData", false);
  //   if (!username || !password) {
  //     setErrorMessage("Please fill in all fields.");
  //     setLoading(false);
  //     return;
  //   }

  //   const payload = {
  //     username: username,
  //     password: password,
  //     // roles: [role],
  //   };
  //   console.log("Inside setTimeout");
  //   const userAuth = await loginUser(payload);

  //   if (userAuth.status === 200) {
  //     console.log("login", username, password, role);
  //     localStorage.setItem("userInfo", JSON.stringify(userAuth.data));
  //     getServiceListCall(userAuth.data);
  //     setLoading(false);
  //     console.log(payload);
  //   } else if (userAuth.response.status === 401) {
  //     setLoading(false);
  //     setErrorMessage(userAuth.response.data);
  //   } else if (userAuth.response.status === 404) {
  //     setLoading(false);
  //     setErrorMessage(userAuth.response.data);
  //   } else if (userAuth.response.status === 403) {
  //     setLoading(false);
  //     setErrorMessage(userAuth.response.data);
  //   } else {
  //     setLoading(false);
  //     setErrorMessage("Something went wrong. Please try again later.");
  //   }
  // };

  const isiphone = useMediaQuery((theme) => theme.breakpoints.down("iphone"));

  const isiphone12Pro = useMediaQuery((theme) =>
    theme.breakpoints.only("iphone12")
  );

  const isSurfacepro = useMediaQuery((theme) =>
    theme.breakpoints.down("issurfacepro")
  );

  const upto540 = useMediaQuery((theme) => theme.breakpoints.down("iphone"));

  // const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  // const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.between("md", "lg"));

  return (
    <div
      className="login-container"
      style={{
        // height: isSmallScreen ? "100vh" : "150vh" ,

        ...(upto540 && {
          height: "310vh",
          width: "140vh",
        }),
      }}
    >
      <div
        className="login-form-container"
        style={{
          // width: isSmallScreen ? "90vw" : "70vw" ,
          ...(upto540 && {
            height: "50vh",
            width: "125vh",
          }),
        }}
      >
        <div
          className="login-card"
          style={{
            width: "1000vh",

            ...(upto540 && {
              height: "calc(53vh - 32px)",
              width: "calc(110vh - 32px)",
            }),
          }}
        >
          <h1>LOGIN</h1>
          <input
            type="text"
            placeholder="USERNAME"
            value={username}
            style={{ fontFamily: "Red Hat Display", fontSize: "16px" }}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="PASSWORD"
            value={password}
            style={{ fontFamily: "Red Hat Display", fontSize: "16px" }}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 18,
                margin: 5,
              }}
            >
              <Typography
                variant="h6"
                style={{ fontFamily: "Red Hat Display, sans-serif" }}
              >
                Loading...
              </Typography>
            </div>
          ) : (
            <Button
              sx={{
                m: 2,
                width: "10%",
                backgroundColor: colors.greenAccent[500],
                color: colors.grey[100],
                "&:hover": {
                  backgroundColor: "#ffffff",
                  color: colors.primary[600],
                },
              }}
              variant="contained"
              onClick={() => handleLogin()}
            >
              LOGIN
            </Button>
          )}
        </div>
        <div className="login-card-details" style={{}}>
          <img
            src={observai}
            alt="observai"
            style={{
              width: "450px",
              height: "250px",

              ...(upto540 && {
                height: "60vh",
                width: "60vh",
              }),
            }}
          />
          <Typography
            variant="h5"
            style={{
              padding: "10px",
              textAlign: "justify",

              ...(upto540 && {
                height: "40vh",
                width: "56vh",
              }),
            }}
          >
            Three pillars of Observability . Unify Trace , Metrics, Log in one
            place with ZAGA Observability. A full-stack hybrid cloud
            Observability solution built to optimize performance, ensure
            availability, and reduce remediation time.
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Login;
