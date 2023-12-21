import {
  Card,
  CardContent,
  IconButton,
  Paper,
  Popover,
  Step,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import React, { useRef } from "react";
import { useState } from "react";
import "./CustomFlow.css";
import { MdHttp } from "react-icons/md";
import { SiApachekafka } from "react-icons/si";
import { PiBracketsRoundBold } from "react-icons/pi";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import { LuDatabase } from "react-icons/lu";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

const CustomFlow = ({ spandata }) => {
  const [popoverAnchor, setPopoverAnchor] = useState(false);
  const [spanErrorData, setSpanErrorData] = useState({});
  const [ref,setRef]=useState(null);

  const targetElementRef = useRef(null);

  const handlePopoverClose = () => {
    setPopoverAnchor(false);
  };

  const handleButtonClick = (errorMessage, logAttributes, errorStatus) => {
    const formattedLogAttributes = {};

    logAttributes.forEach((attribute) => {
      const key = attribute.key;
      const value = attribute.value.stringValue;
      formattedLogAttributes[key] = value;
    });

    const logData = {
      errorMessage: errorMessage.stringValue,
      logAttributes: logAttributes,
      errorStatus: errorStatus,
    };
    console.log("logData", logData);
    setSpanErrorData(logData);
    // setPopoverAnchor(targetElementRef.current);
    setPopoverAnchor(true);
    setRef(targetElementRef.current)
  };

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
    const startTime = new Date(startTimeUnixNano / 1000000);
    const endTime = new Date(endTimeUnixNano / 1000000);
    const duration = endTime - startTime;

    return duration;
  };

  return (
    <div   ref={targetElementRef}>
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
            sx={{
              alignItems: "center",
              "& .MuiStep-root": {
                marginBottom: "-10px",
                marginTop: "-10px",
              },
              "& .MuiStepConnector-line": {
                borderColor: "black",
                borderWidth: "2px",
                width: "10px"
              },
            }}
          >
            {spandata.map((span, index) => {
              const spanName = span.spans.name;
              const errorStatus = span.errorStatus;

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
                <Step key={index}>
                  {spanErrorData.errorStatus ? (
                    <Popover
                      open={popoverAnchor}
                      anchorEl={ref}
                      anchorOrigin={{
                        vertical: "center",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "center",
                        horizontal: "center",
                      }}
                      style={{
                        position: "absolute",
                        height: "550px",
                        width: "500px",
                      }}
                    >
                      <Paper>
                        <div>
                          <IconButton
                            color="inherit"
                            onClick={handlePopoverClose}
                          >
                            <ClearRoundedIcon />
                          </IconButton>
                          <div>
                              {" "}
                              <TableContainer component={Paper}>
                                <Table aria-label="customized table">
                                  <TableBody>
                                    <div style={{ overflowX: "hidden" }}>
                                      <TableRow>
                                        <TableCell
                                          align="left"
                                          style={{
                                            width: "20%",
                                            fontWeight: "500",
                                          }}
                                        >
                                          Error Component
                                        </TableCell>
                                        <TableCell
                                          align="left"
                                          style={{ width: "80%" }}
                                        >
                                          {spanErrorData.errorMessage}
                                        </TableCell>
                                      </TableRow>

                                      {spanErrorData.logAttributes.length > 0
                                        ? spanErrorData.logAttributes.map(
                                            (attribute, index) => (
                                              <TableRow key={index}>
                                                <TableCell
                                                  align="left"
                                                  style={{
                                                    width: "20%",
                                                    fontWeight: "500",
                                                  }}
                                                >
                                                  {/* jey <div>{attribute.key}</div> */}

                                                  <div></div>
                                                </TableCell>
                                                <TableCell
                                                  align="left"
                                                  style={{ width: "80%" }}
                                                >
                                                  <div
                                                    className={
                                                      attribute.key ===
                                                      "exception.stacktrace"
                                                        ? "scrollable"
                                                        : ""
                                                    }
                                                  >
                                                    {attribute.key ===
                                                    "exception.stacktrace" ? (
                                                      <div className="stacktrace">
                                                        {
                                                          attribute.value
                                                            .stringValue
                                                        }
                                                      </div>
                                                    ) : (
                                                      attribute.value
                                                        .stringValue
                                                    )}
                                                  </div>
                                                </TableCell>
                                              </TableRow>
                                            )
                                          )
                                        : null}
                                    </div>
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </div>
                          </div>
                      </Paper>
                    </Popover>
                  ) : null}

                  <div className="circle" style={{ marginLeft: "-58px" }}>
                    <span style={{ width: "70px" }}>
                      <strong style={{ color: "#000" }}>
                        (
                        {calculateDurationInMs(
                          span.spans.startTimeUnixNano,
                          span.spans.endTimeUnixNano
                        )}
                        ms)
                      </strong>
                    </span>
                    {isHTTP && (
                      <>
                        {" "}
                        <div
                          onClick={
                            errorStatus
                              ? () =>
                                  handleButtonClick(
                                    span.errorMessage,
                                    span.logAttributes,
                                    span.errorStatus
                                  )
                              : null
                          }
                          style={{
                            padding: "10px",
                            backgroundColor: errorStatus ? "red" : "#4c516d",
                            borderRadius: "50px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: "5px",
                          }}
                        >
                          <MdHttp
                            onClick={
                              errorStatus
                                ? () =>
                                    handleButtonClick(
                                      span.errorMessage,
                                      span.logAttributes,
                                      span.errorStatus
                                    )
                                : null
                            }
                            style={{
                              color: "white",
                              backgroundColor: "#808080 ",
                              fontSize: "40px",
                              padding: "8px",
                              borderRadius: "50px",
                            }}
                          />
                        </div>
                        <div style={{ width: "0px", paddingLeft: "0px" }}>
                          {spanName}
                        </div>
                      </>
                    )}
                    {isDatabase && (
                      <>
                        <div
                          onClick={
                            errorStatus
                              ? () =>
                                  handleButtonClick(
                                    span.errorMessage,
                                    span.logAttributes,
                                    span.errorStatus
                                  )
                              : null
                          }
                          style={{
                            padding: "10px",
                            backgroundColor: errorStatus ? "red" : "#006a4e",
                            borderRadius: "50px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: "5px",
                          }}
                        >
                          <LuDatabase
                            onClick={
                              errorStatus
                                ? () =>
                                    handleButtonClick(
                                      span.errorMessage,
                                      span.logAttributes,
                                      span.errorStatus
                                    )
                                : null
                            }
                            style={{
                              color: "white",
                              backgroundColor: errorStatus ? "red" : "#006a4e",
                              fontSize: "40px",
                              padding: "8px",
                              borderRadius: "50px",
                            }}
                          />
                        </div>
                        <div style={{ width: "0px", paddingLeft: "0px" }}>
                          {spanName}
                        </div>
                      </>
                    )}
                    {isKafka && (
                      <>
                        <div
                          onClick={
                            errorStatus
                              ? () =>
                                  handleButtonClick(
                                    span.errorMessage,
                                    span.logAttributes,
                                    span.errorStatus
                                  )
                              : null
                          }
                          style={{
                            padding: "10px",
                            backgroundColor: errorStatus ? "red" : "#4c516d",
                            borderRadius: "50px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: "5px",
                          }}
                        >
                          <SiApachekafka
                            onClick={
                              errorStatus
                                ? () =>
                                    handleButtonClick(
                                      span.errorMessage,
                                      span.logAttributes,
                                      span.errorStatus
                                    )
                                : null
                            }
                            style={{
                              color: "white",
                              backgroundColor: "#4c516d ",
                              fontSize: "40px",
                              padding: "8px",
                              borderRadius: "50px",
                            }}
                          />
                        </div>
                        <div style={{ width: "0px", paddingLeft: "0px" }}>
                          {spanName}
                        </div>
                      </>
                    )}
                    {isFunction && (
                      <>
                        <div
                          onClick={
                            errorStatus
                              ? () =>
                                  handleButtonClick(
                                    span.errorMessage,
                                    span.logAttributes,
                                    span.errorStatus
                                  )
                              : null
                          }
                          style={{
                            padding: "10px",
                            backgroundColor: errorStatus ? "red" : "#4c516d",
                            borderRadius: "50px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: "5px",
                          }}
                        >
                          <PiBracketsRoundBold
                            onClick={
                              errorStatus
                                ? () =>
                                    handleButtonClick(
                                      span.errorMessage,
                                      span.logAttributes,
                                      span.errorStatus
                                    )
                                : null
                            }
                            style={{
                              color: "white",
                              backgroundColor: "#003153",
                              fontSize: "40px",
                              padding: "8px",
                              borderRadius: "50px",
                            }}
                          />
                        </div>
                        <div style={{ width: "0px", paddingLeft: "0px" }}>
                          {spanName}
                        </div>
                      </>
                    )}
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

export default CustomFlow;
