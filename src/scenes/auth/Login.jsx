import React, { useContext, useState } from "react";
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
import { getServiceList, keycloakLoginAuth, loginUser } from "../../api/LoginApiService";
import Loading from "../../global/Loading/Loading";
import observai from "../../assets/observai.png";
import { green } from "@mui/material/colors";
import { jwtDecode } from "jwt-decode";
import { logout } from "../../global/AuthMechanism";

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { setServiceList, setSelected } = useContext(GlobalContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("none");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [serviceListData, setServiceListData] = useState([]);

  const servicePayload = (serviceData) => {
    serviceData.forEach((item) => {
      serviceListData.push(item.serviceName);
    });
    localStorage.setItem("serviceListData", JSON.stringify(serviceListData));
    console.log("ServiceName " + serviceListData);
  };

  const getServiceListCall = async (userInfo) => {
    try {
      const serviceData = await getServiceList(userInfo);
      console.log("ServiceList " + JSON.stringify(serviceData));
      if (serviceData.length !== 0) {
        setServiceList(serviceData);
        servicePayload(serviceData);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        navigate("/mainpage/dashboard");
      } else {
        setErrorMessage("No Service assigned for this user");
      }
    } catch (error) {
      console.log("error " + error);
      setErrorMessage("An error occurred");
      await logout();
    }
  };

  const handleLogin = async () => {
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

      // Call SSO token provider URL directly
      const userAuth = await keycloakLoginAuth(payload);

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
        localStorage.setItem("roles", JSON.stringify(decoded.realm_access.roles));
        const servicePayload = {
          username: username,
          password: password,
          roles: decoded.realm_access.roles
        };
        // Call service list
        await getServiceListCall(servicePayload);

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
