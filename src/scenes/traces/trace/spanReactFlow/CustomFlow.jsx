import { Card, CardContent, Step, Stepper, useTheme } from "@mui/material";
import React from "react";
import { useState } from "react";
import "./CustomFlow.css";
import { MdHttp } from "react-icons/md";
import { FaDatabase } from "react-icons/fa";
import { SiApachekafka } from "react-icons/si";
import { PiBracketsRoundBold } from "react-icons/pi";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";

import Check from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { LuDatabase } from "react-icons/lu";
import { tokens } from "../../../../theme";

const CustomFlow = ({ spandata }) => {
  const [spanName, setspanname] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  console.log("spandata", spandata);
  console.log("spandnames", spanName);

  const searchString = "GET";

  // const spandata = [
  //   { spans: { name: "GET /orders/getOrders" } },
  //   { spans: { name: "SELECT * FROM orders" } },
  //   { spans: { name: "observability-demo-tables" } },

  // ];

  const arr = ["GET", "SELECT", "ORDER", "PUT"];


  const CustomConnector = () => {
    const connectorStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      // Add any additional styling properties as needed
    };
  
    return (
      <StepConnector
        style={connectorStyle}
      >
        <div>Additional Content</div>
      </StepConnector>
    );
  };

  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    padding: "10px",
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 30,
    },
    // [`&.${stepConnectorClasses.active}`]: {
    //   [`& .${stepConnectorClasses.line}`]: {
    //     backgroundImage:
    //       'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    //   },
    // },
    // [`&.${stepConnectorClasses.completed}`]: {
    //   [`& .${stepConnectorClasses.line}`]: {
    //     backgroundImage:
    //       'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    //   },
    // },
    [`& .${stepConnectorClasses.line}`]: {
      // height: 3,
      // border: 0,
      backgroundColor:
        theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
      // borderRadius: 1,
    },
  }));

  const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    // ...(ownerState.active && {
    //   backgroundImage:
    //     'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    //   boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    // }),
    // ...(ownerState.completed && {
    //   backgroundImage:
    //     'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    // }),
  }));

  function ColorlibStepIcon(props) {
    const { active, completed, className } = props;

    const icons = {
      1: <SettingsIcon />,
      2: <GroupAddIcon />,
      3: <VideoLabelIcon />,
    };

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }

  ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
  };

  const calculateDurationInMs = (startTimeUnix, endTimeUnix) => {
    const startTimeUnixNano = parseInt(startTimeUnix, 10);
    const endTimeUnixNano = parseInt(endTimeUnix, 10);
    const startTime = new Date(startTimeUnixNano / 1000000); // Convert nanoseconds to milliseconds
    const endTime = new Date(endTimeUnixNano / 1000000); // Convert nanoseconds to milliseconds

    // Calculate the duration in milliseconds
    const duration = endTime - startTime;

    return duration;
  };

  return (
    <div>
      <Card
        sx={{
          height: "calc(60vh - 32px)",
          padding: "10px",
          overflow: "scroll",
          width: "560px",
        }}
      >
        <CardContent>
          {/* <Stepper activeStep={1} alternativeLabel connector={<ColorlibConnector />} style={{ marginTop: "130px"}}> */}
          <Stepper
            orientation="vertical"
            // connector={<CustomConnector />}
            sx={{
              alignItems: "center",
              "& .MuiStep-root": {
                marginBottom: "-10px",
                marginTop: "-10px",
              },
              "& .MuiStepConnector-line": {
                borderColor: theme.palette.mode==="dark"? "#fff" : "#000",
                borderWidth: "2px",
                width: "10px"
              },
            }}
          >
            {spandata.map((span, index) => {
              const spanName = span.spans.name;
              const errorStatus = span.errorStatus;

              // Display Kafka icon only if both "thread.id" and "thread.name" are present

              const attributes = span.spans.attributes || [];

              const hasThreadID = attributes.some(
                (attr) => attr.key === "thread.id"
              );
              const hasThreadName = attributes.some(
                (attr) => attr.key === "thread.name"
              );
              const hasCodenamspace = attributes.some(
                (attr) => attr.key === "code.namespace"
              );
              const hasCodefunction = attributes.some(
                (attr) => attr.key === "code.function"
              );
              const hasCodeuser = attributes.some(
                (attr) => attr.key === "user-id"
              );

              // const isFunction =
              //   (hasThreadID && hasThreadName && attributes.length === 2) ||  (hasThreadID &&
              //   hasCodenamspace &&
              //   hasCodefunction &&
              //   hasThreadName &&
              //   attributes.length === 4) ||  (hasThreadID &&
              //   hasCodenamspace &&
              //   hasCodefunction &&
              //   hasThreadName &&
              //   hasCodeuser&&
              //   attributes.length ===5) ||
              //   (hasCodeuser&&
              //   hasThreadName &&
              //   hasThreadID&&
              //   attributes.length ===3)

              // const isFunction2 =
              //   hasThreadID &&
              //   hasCodenamspace &&
              //   hasCodefunction &&
              //   hasThreadName &&
              //   attributes.length === 4;

              const isHTTP = attributes.some((attr) =>
                attr.key.includes("http.method")
              );
              const isKafka = attributes.some((attr) =>
                attr.key.includes("message")
              );
              const isDatabase = attributes.some((attr) =>
                attr.key.includes("db")
              );

              const isFunction = !isHTTP && !isKafka && !isDatabase;

              return (
                <Step key={index} >
                  <div className="circle" style={{ marginLeft: "-58px" }}>
                    {/* {isHTTP && (
                // Render HTTP icon
                <MdHttp
                  style={{
                    color: "white",
                    backgroundColor: "gray",
                    fontSize: "40px",
                    padding: "8px",
                    borderRadius: "50px",
                  }}
                />
              )} */}

                    <span style={{width:"70px"}}>
                      <strong style={{ color: theme.palette.mode==="dark"? "#fff" : "#000" }}>
                        (
                        {calculateDurationInMs(
                          span.spans.startTimeUnixNano,
                          span.spans.endTimeUnixNano
                        )}
                        ms)
                      </strong>
                    </span>
                    {isHTTP && (
                      <>  <div
                      style={{
                        padding: "10px",
                        backgroundColor: errorStatus ? "red" : "#4c516d",
                        borderRadius: "50px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight:"5px"
                      }}
                    >
                      <MdHttp
                        style={{
                          color: "white",
                          backgroundColor: "#808080 ",
                          fontSize: "40px",
                          padding: "8px",
                          borderRadius: "50px",
                        }}
                      />
                    </div><div style={{width: "0px", paddingLeft: "0px", fontSize: "12px"}}>{spanName}</div></>
                    
                    )}

                    {/* {isDatabase && (
                // Render Database icon
                <FaDatabase
                  style={{
                    color: "white",
                    backgroundColor: "gray",
                    fontSize: "40px",
                    padding: "8px",
                    borderRadius: "50px",
                  }}
                />
              )} */}
                    {isDatabase && (<>
                      <div
                        style={{
                          padding: "10px",
                          backgroundColor: errorStatus ? "red" : "#006a4e",
                          borderRadius: "50px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight:"5px"
                        }}
                      >
                        <LuDatabase
                          style={{
                            color: "white",
                            backgroundColor: errorStatus ? "red" : "#006a4e",
                            fontSize: "40px",
                            padding: "8px",
                            borderRadius: "50px",
                          }}
                        />
                      </div>
                      <div style={{width: "0px", paddingLeft: "0px", display: "flex", fontSize: "12px"}}>{spanName}</div></>
                    )}

                    {/* {isKafka && (
                // Render Database icon
                <SiApachekafka
                  style={{
                    color: "white",
                    backgroundColor: "gray",
                    fontSize: "40px",
                    padding: "8px",
                    borderRadius: "50px",
                  }}
                />
              )} */}
                    {isKafka && (<>
                      <div
                        style={{
                          padding: "10px",
                          backgroundColor: errorStatus ? "red" : "#4c516d",
                          borderRadius: "50px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight:"5px"
                        }}
                      >
                        <SiApachekafka
                          style={{
                            color: "white",
                            backgroundColor: "#4c516d ",
                            fontSize: "40px",
                            padding: "8px",
                            borderRadius: "50px",
                          }}
                        />
                      </div>
                      <div style={{width: "0px", paddingLeft: "0px", fontSize: "12px"}}>{spanName}</div></>
                    )}

                    {/* {isFunction && (
                // Render Database icon
                <PiBracketsRoundBold
                  style={{
                    color: "white",
                    backgroundColor: "gray",
                    fontSize: "40px",
                    padding: "8px",
                    borderRadius: "50px",
                  }}
                />
              )} */}
                    {isFunction && (<>
                      <div
                        style={{
                          padding: "10px",
                          backgroundColor: errorStatus ? "red" : "#4c516d",
                          borderRadius: "50px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight:"5px"
                        }}
                      >
                        <PiBracketsRoundBold
                          style={{
                            color: "white",
                            backgroundColor: "#003153",
                            fontSize: "40px",
                            padding: "8px",
                            borderRadius: "50px",
                          }}
                        />
                      </div>
                      <div style={{width: "0px", paddingLeft: "0px", fontSize: "12px"}}>{spanName}</div></>
                    )}

                    {/* {isFunction2 && (
                // Render Database icon
                <PiBracketsRoundBold
                  style={{
                    color: "white",
                    backgroundColor: "gray",
                    fontSize: "40px",
                    padding: "8px",
                    borderRadius: "50px",
                  }}
                />
              )} */}

                    {/* <p>{spanName}</p> */}
                  </div>
                </Step>
              );
            })}
          </Stepper>
        </CardContent>
      </Card>
    </div>
  );
};

//   return (
//     <div>
//       <Card sx={{ height: "calc(60vh - 32px)", padding: "10px" }}>
//         {spandata.map((span, index) => {
//           // setspanname(span.spans.name)
//           // setspanname(span.spans.name);

//         })}

//       </Card>
//     </div>
//   );
// };

export default CustomFlow;
