import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import { spanData } from "../../../../global/MockData/SpanData";
import "./SpanFlow.css";
import {
  Box,
  Card,
  FormControlLabel,
  FormGroup,
  IconButton,
  Paper,
  Popover,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  ToggleButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { tokens } from "../../../../theme";
import { useContext } from "react";
import { GlobalContext } from "../../../../global/globalContext/GlobalContext";
import SpanInfo from "./SpanInfo";
import { useRef } from "react";
import Loading from "../../../../global/Loading/Loading";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import CustomFlow from "./CustomFlow";

const SpanFlow = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [orderedSpans, setOrderedSpans] = useState([]);
  // const [CustomFlow,setCustomflow] =useState([]);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [spanflowErrStatus, setSpanflowErrStatus] = useState(false);
  const isiphone = useMediaQuery((theme) => theme.breakpoints.down("iphone"));
  const isipadmini = useMediaQuery((theme) => theme.breakpoints.only("ipadmini"));
  const isipadpro = useMediaQuery((theme) => theme.breakpoints.only("isipadpro"));
  const issurfacepro = useMediaQuery((theme) => theme.breakpoints.only("issurfacepro"));

  orderedSpans.forEach((status) => {});

  // console.log("isCardVisible", isCardVisible);
  // console.log("cutom flow",CustomFlow);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { selectedTrace, setSelectedSpan, traceLoading } =
    useContext(GlobalContext);
  // console.log("stscode", selectedTrace);
  console.log("order-span", orderedSpans);
  const [loading, setLoading] = useState(false);

  const [checked, setChecked] = useState(true);
  const [showCard, setShowCard] = useState(true);

  const switchHandler = (event) => {
    setChecked(event.target.checked);
    setShowCard(!showCard);
  };

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const sectionRef = useRef(null);

  // Function to scroll to the section
  const scrollToSection = () => {
    // Use the ref to access the target element
    if (sectionRef.current) {
      // Scroll to the target element
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // const onNodeClick = useCallback((event, node) => {
  //   // Find the selected span data based on the clicked node
  //   const spanId = node.id.replace("span-", "");
  //   const selectedSpanData = orderedSpans.find((span) => span.spanId === spanId);

  //   // Find child spans count
  //   const childSpansCount = orderedSpans.filter(
  //     (span) => span.parentSpanId === spanId
  //   ).length;

  //   // Append childSpansCount to selected span data
  //   const updatedSelectedSpanData = {
  //     ...selectedSpanData,
  //     childSpansCount,
  //   };

  //   // Update the selected span in state
  //   setSelectedSpan(updatedSelectedSpanData);
  //   scrollToSection();
  // }, [setSelectedSpan, orderedSpans]);

  const calculateDurationInMs = (startTimeUnix, endTimeUnix) => {
    const startTimeUnixNano = parseInt(startTimeUnix, 10);
    const endTimeUnixNano = parseInt(endTimeUnix, 10);
    const startTime = new Date(startTimeUnixNano / 1000000); // Convert nanoseconds to milliseconds
    const endTime = new Date(endTimeUnixNano / 1000000); // Convert nanoseconds to milliseconds

    // Calculate the duration in milliseconds
    const duration = endTime - startTime;

    return duration;
  };

  const onNodeClick = useCallback(
    (event, node) => {
      // Find the selected span data based on the clicked node
      const spanId = node.id.replace("span-", "");
      // const selectedSpanData = orderedSpans.find(
      //   (span) => span.spans.spanId === spanId
      // );

      // const selectedSpanData = orderedSpans.map((spanData) => {
      //   return spanData.spans;
      // });
      const spanSpans = orderedSpans.find(
        (span) => span.spans.spanId === spanId
      );
      const selectedSpanData = spanSpans ? spanSpans.spans : null;

      console.log("default span flow", selectedSpanData);

      const startTimeUnixNano = parseInt(
        selectedSpanData.startTimeUnixNano,
        10
      );
      const endTimeUnixNano = parseInt(selectedSpanData.endTimeUnixNano, 10);

      const startTime = new Date(startTimeUnixNano / 1000000); // Convert nanoseconds to milliseconds
      const endTime = new Date(endTimeUnixNano / 1000000); // Convert nanoseconds to milliseconds

      // Calculate the duration in milliseconds
      const duration = endTime - startTime;

      // Append childSpansCount and duration to selected span data
      const updatedSelectedSpanData = {
        ...selectedSpanData,
        childSpansCount: orderedSpans.filter(
          (span) => span.spans.parentSpanId === spanId
        ).length,
        duration,
      };

      // Update the selected span in state
      setSelectedSpan(updatedSelectedSpanData);
      scrollToSection();
    },
    [setSelectedSpan, orderedSpans]
  );

  const edgeOptions = {
    // animated: true,
    // backgroundColor:colors.primary[400]
  };

  const sortingParentChildOrder = (spanData) => {
    // Parse the provided span data
    const spans = spanData;

    // Create a dictionary to map parent spans to their child spans
    const spanTree = {};

    // Create a function to recursively build the parent-child relationship
    const buildSpanTree = (span) => {
      const spanId = span.spanId;
      const parentId = span.parentSpanId;
      if (parentId) {
        if (!spanTree[parentId]) {
          spanTree[parentId] = [];
        }
        spanTree[parentId].push(span);
      } else {
        if (!spanTree[spanId]) {
          spanTree[spanId] = [];
        }
        for (const child of spanTree[spanId]) {
          buildSpanTree(child);
        }
      }
    };

    // Build the parent-child relationship
    for (const span of spans) {
      buildSpanTree(span);
    }

    // Sort the spans based on "spanId" and "parentSpanId"
    const sortedSpans = [];

    const sortSpans = (spanId) => {
      sortedSpans.push(spanId);
      for (const childSpan of spanTree[spanId] || []) {
        sortSpans(childSpan.spanId);
      }
    };

    // Find the root spans (spans without parent)
    const rootSpans = spans.filter((span) => !span.parentSpanId);

    // Sort the spans for each root span
    for (const rootSpan of rootSpans) {
      sortSpans(rootSpan.spanId);
    }

    // Create the ordered span data
    const orderedSpanData = [];

    // Helper function to add spans in parent-child order
    const addSpansInOrder = (spanId) => {
      orderedSpanData.push(spans.find((span) => span.spanId === spanId));
      for (const childSpan of spanTree[spanId] || []) {
        addSpansInOrder(childSpan.spanId);
      }
    };

    // Add spans to the orderedSpanData in parent-child order
    for (const rootSpan of rootSpans) {
      addSpansInOrder(rootSpan.spanId);
    }

    // Set the ordered spans in the state
    return orderedSpanData;
  };
  //jey changed coor conditionally based error status
  const rightSideButtonStyle =  (statusCode) =>  {
    return {
    position: "absolute",
    top: "50%",
    right: "-90px",
    transform: "translate(-50%, -50%)",
    transform: "translateY(-50%)",
    height: "50px",
    border: "none",
    borderRadius: "5px",
    // jey color: "#000",
    color: "#FFF",
    fontSize:"13px",
    // backgroundColor: colors.grey[400],
    backgroundColor: statusCode ?  colors.grey[400] : colors.redAccent[500]
  }
};
  

  const targetElementRef = useRef(null);
  //********************************************************************************************************************************************************* */

  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [spanErrorData, setSpanErrorData] = useState({});

  const handleButtonClick = (errorMessage, logAttributes) => {
    const formattedLogAttributes = {};

    logAttributes.forEach((attribute) => {
      const key = attribute.key;
      const value = attribute.value.stringValue;
      formattedLogAttributes[key] = value;
    });

    const logData = {
      errorMessage: errorMessage.stringValue,
      logAttributes: logAttributes,
    };
    console.log("logData", logData);
    setSpanErrorData(logData);
    setPopoverAnchor(targetElementRef.current);
  };

  // console.log("spanErrorData", spanErrorData);
  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };

  const dynamicNodeCreation = (orderedSpans) => {
    // Process the span data and generate nodes and edges
    const spanIdToNodeId = {};
    const newNodes = [];
    const newEdges = [];

    // Calculate the node positions dynamically
    let nodeSpacingX = 100; // Adjust this value to control horizontal spacing
    let nodeSpacingY = 100; // Adjust this value to control vertical spacing

    orderedSpans.forEach((span, index) => {
      const nodeId = `span-${span.spans.spanId}`;
      console.log(nodeId, "nodeid");
      let nodeX = index * nodeSpacingX; // Adjust x position based on index
      let nodeY = index * nodeSpacingY; // Set a fixed y position
      // const spanflowErrStatus = span.errorStatus;
      //  console.log("spanflowErrStatus",spanflowErrStatus);

      const node = {
        id: nodeId,
        type:
          index === 0
            ? "input"
            : index === orderedSpans.length - 1
            ? "output"
            : "default",
        data: {
          label: (
            //   <div style={{ display: 'flex', alignItems: 'center' }}>
            //   <span>
            //     {span.name} <strong style={{ color: colors.textColor[500] }}>({calculateDurationInMs(span.startTimeUnixNano, span.endTimeUnixNano)}ms)</strong>
            //   </span>
            //   <button style={{marginLeft:"20px",backgroundColor:"blue",width:"80px"}}>Your Button</button>
            // </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
             
              {/* jey <span style={{ marginBottom: "3px" }}> */}
              <span >
                {span.spans.name}{" "}
                <strong style={{ color: "#FFF"  }}>
                  (
                  {calculateDurationInMs(
                    span.spans.startTimeUnixNano,
                    span.spans.endTimeUnixNano
                  )}
                  ms)
                </strong>
              </span>
              <button
                disabled={!span.errorStatus}
                style={rightSideButtonStyle(!span.errorStatus)}
                onClick={() =>
                  handleButtonClick(span.errorMessage, span.logAttributes)
                }
              >
                View Error
              </button>
            </div>
          ),
        },
        position: { x: nodeX, y: nodeY },
        style: {
          backgroundColor: span.errorStatus
           // jey ? colors.blueAccent[400]
           ? "#1391C8"
           // ? "1F8ED8"
            // : "#D4D4D4",
            : "#617881",
          width: "550px",
          height: "60px",
          color: "#FFF",
          //jey
          fontSize:"18px",
          // fontWeight:"50px",
        },
        // className: "nodeStyle",
      };

      newNodes.push(node);
      spanIdToNodeId[span.spans.spanId] = nodeId;

      if (span.spans.parentSpanId) {
        const edge = {
          id: `edge-${span.spans.spanId}`,
          source: spanIdToNodeId[span.spans.parentSpanId],
          target: nodeId,
        };

        newEdges.push(edge);
      }
    });

    // Update the React Flow nodes and edges
    setNodes((prevNodes) => [...prevNodes, ...newNodes]);
    setEdges((prevEdges) => [...prevEdges, ...newEdges]);
  };

  useEffect(() => {
    // setLoading(true);
    setNodes([]);
    setEdges([]);
    setSelectedSpan({ attributes: [] });
    if (Object.keys(selectedTrace).length !== 0) {
      // const orderedSpansData = sortingParentChildOrder(selectedTrace.spans);
      setOrderedSpans(selectedTrace.spanDTOs);
      dynamicNodeCreation(selectedTrace.spanDTOs);
      // setCustomflow(selectedTrace.spanDTOs);
    }
    // setLoading(false);
  }, [selectedTrace, setSelectedSpan]);

  var flowBoxColor;

  // orderedSpans.forEach((spanErr) => {
  //   console.log("Status " + spanErr.errorStatus);
  //   var color = "";
  //   if(spanErr.errorStatus){
  //     color = colors.primary[400]
  //   } else {
  //     color = colors.blueAccent[400]
  //   }
  //   flowBoxColor = {
  //     "--primary-color": color,
  //     "--text-color": "#FFF",
  //   };
  // });

  return (
    <>
      {traceLoading ? (
        <Loading />
      ) : (
        <div
          ref={targetElementRef}
          style={{
            maxHeight: Object.keys(selectedTrace).length
              ? "calc(93vh - 70px)"
              : null,
          }}
        >
          {Object.keys(selectedTrace).length === 0 ? (
            <div>
              <Typography
                variant="h5"
                sx={{ textAlign: "center", marginTop: "60%" }}
              >
                Please Select any one of the Trace from the list to visualize!
              </Typography>
            </div>
          ) : (
            <div>
              <div style={{ padding: "5px" }}>
                {/* <Typography variant="h5" fontWeight="600" >Details for Selected Trace </Typography> */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    textAlign: "center",
                    margin: "0px",
                  }}
                >
                  <Typography variant="h6">
                    ServiceName <br />
                    <Typography variant="h7">
                      {selectedTrace.serviceName}
                    </Typography>
                  </Typography>

                  <FormGroup>
                    <FormControlLabel
                    // labelPlacement="top"
                      control={<Switch size="small"
                      checked={checked} 
                      onClick={switchHandler} 
                      />}
                      label="Custom Flow"
                    />
                  </FormGroup>

                  <Typography variant="h6">
                    SpanCount <br />
                    <Typography variant="h7">
                      {selectedTrace.spanCount}
                    </Typography>
                  </Typography>

                  {popoverAnchor ? (
                    <Popover
                      open={Boolean(popoverAnchor)}
                      anchorEl={popoverAnchor}
                      onClose={handlePopoverClose}
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
                        // marginRight: "100px",
                      }}
                    >
                      <Paper>
                        <div
                          style={
                            {
                              // maxHeight: "calc(100vh - 70px)",
                              // overflowY: "auto",
                              // paddingRight: "10px",
                              // marginTop: "10px",
                            }
                          }
                        >
                          <IconButton
                            color="inherit"
                            onClick={handlePopoverClose}
                          >
                            <ClearRoundedIcon />
                          </IconButton>
                          {/* <div
                            style={{
                              marginLeft: "10px",
                              backgroundColor: colors.blueAccent[400],
                              color: "white",
                            }}
                          >
                            {spanErrorData.errorMessage}
                          </div>
                          <div>
                            {spanErrorData.logAttributes.map((att, index) => {
                              console.log("strrrr", att.key);
                              console.log("strrrrvalue", att.value);
                              return (
                                <>
                                  <div
                                    key={index}
                                    style={{
                                      backgroundColor: "red",
                                      color: "white",
                                    }}
                                  >
                                    {att.key}
                                  </div>
                                  <div key={index}>{att.value.stringValue}</div>
                                </>
                              );
                            })}
                          </div> */}


                          <TableContainer component={Paper} >
                                <Table aria-label="customized table">
                                    <TableBody>
                                        <div style={{ overflowX: 'hidden' }}>
                                            <TableRow>
                                                <TableCell align='left' style={{ width: '20%' , fontWeight: "500" }}>
                                                    Error Component
                                                </TableCell>
                                                <TableCell align='left' style={{ width: '80%' }}>
                                                {spanErrorData.errorMessage}
                                                </TableCell>
                                            </TableRow>
                                            
                                            {spanErrorData.logAttributes.length > 0 ? (
                                                spanErrorData.logAttributes.map((attribute, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell align='left' style={{ width: '20%' ,fontWeight: "500" }}>
                                                            {/* jey <div>{attribute.key}</div> */}
                                                            
                                                            <div></div>
                                                        </TableCell>
                                                        <TableCell align='left' style={{ width: '80%' }}>
                                                            <div className={attribute.key === "exception.stacktrace" ? "scrollable" : ""}>
                                                                {attribute.key === "exception.stacktrace" ? (
                                                                    <div className="stacktrace">{attribute.value.stringValue}</div>
                                                                ) : (
                                                                    attribute.value.stringValue
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : null}
                                        </div>
                                    </TableBody>
                                </Table>
                            </TableContainer>

                          {/* <TableContainer component={Paper}>
                            <Table aria-label="customized table"></Table>
                            <TableBody>
                          
                            
                               
                                  {spanErrorData.logAttributes.map(
                                    (att, index) => {
                                      return (
                                        <TableRow>
                                          <TableCell>Error Key</TableCell>
                                          <TableCell>{att.key}</TableCell>
                                          <TableCell>Error value</TableCell>
                                          <TableCell>{att.values}</TableCell>
                                        </TableRow>
                                      );
                                    }
                                  )}
                             
                            </TableBody>
                          </TableContainer> */}
                        </div>
                      </Paper>
                    </Popover>
                  ) : null}
                </div>
                <Card
                  sx={{
                    overflowX: "auto",
                    width: "100%",
                    color: "#FFF",
                    backgroundColor:
                      selectedTrace.statusCode >= 400 &&
                      selectedTrace.statusCode <= 500
                        // ? colors.redAccent[500]
                        ? colors.primary[400]
                        : "#808080",
                    display: "flex",
                    justifyContent: "space-between",
                    textAlign: "center",
                    margin: "10px 20px 10px 0px",
                  }}
                >
                  {orderedSpans.map((span) => (
                    <div key={span.spans.spanId}>
                      <div
                        style={{
                          width: "fit-content",
                          margin: "5px",
                          overflowX: "auto",
                        }}
                      >
                        {calculateDurationInMs(
                          span.spans.startTimeUnixNano,
                          span.spans.endTimeUnixNano
                        )}
                        ms
                      </div>
                    </div>
                  ))}
                </Card>
                {/* <Typography variant="h6" >SpanCount <br /><Typography variant="h7" >{selectedTrace.spanCount}</Typography></Typography> */}
              </div>

              {/* maxHeight: "calc(145vh - 50px)" */}
              {showCard ? <div>
                <CustomFlow spandata={orderedSpans}/>
              </div> : (
              <div
                style={{ maxHeight: "calc(69vh - 85px)",
                ...(
                  isiphone && {
                    maxHeight:  "125vh",
                  }),
                  ...(
                      isipadmini && {
                        maxHeight: "105vh",
                      }),


                      // ...(
                      //   isipadpro && {
                      //     maxHeight: "130vh",
                      //   }),

                         ...(
                      issurfacepro && {
                        maxHeight: "100vh",
                      }),




                   overflowY: "auto" }}
              >
                <div
                  style={{
                    height: "450px",
                    width: "100%",
                    border: "solid #000 1px",
                  }}
                >
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodeClick={onNodeClick}
                    defaultEdgeOptions={edgeOptions}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    //jey
                    fitView="true"
                    style={{
                      ...flowBoxColor,
                    }}
                    // style={{backgroundColor:colors.primary[400]}}
                  >
                    <Background
                      style={{ backgroundColor: colors.spanBackground[500] }}
                    />
                    <Controls />
                  </ReactFlow>
                </div>
                <div id="span-info" ref={sectionRef}>
                  <SpanInfo />
                </div>
              </div>
              )}
            </div>
              
          )}
        </div>
      )}
    </>
  );
};

export default SpanFlow;
