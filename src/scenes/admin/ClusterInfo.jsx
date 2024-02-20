import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import {
  changeToInstrument,
  changeToUninstrument,
  getClusterListAllProjects,
} from "../../api/ClusterApiService";
import Loading from "../../global/Loading/Loading";
import { useCallback } from "react";
import LoadingOverlay from "react-loading-overlay";
import { useTheme } from '@mui/material/styles';

const ClusterInfo = () => {
  const [data, setData] = useState([]);
  const [namespaceOptions, setNamespaceOptions] = useState([]);
  const [selectedApplicationType, setSelectedApplicationType] = useState("all");
  const [selectedInstrumentedStatus, setSelectedInstrumentedStatus] =
    useState("all");

  const [selectedNamespace, setSelectedNamespace] = useState("all");
  // const [selectedInstrumented, setSelectedInstrumented] = useState("all");
  const [loading, setLoading] = useState(false);
  const [InstrumentLoading, setInstrumentLoadig] = useState(false);
  const [changeInstrument, setChangeInstrument] = useState(false);
  // const [tabValue, setTabValue] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [emptyMessage, setEmptyMessage] = useState("");
  const [message, setMessage] = useState("");
  const theme = useTheme(); // Define the theme object using useTheme hook

  useEffect(() => {
    ServiceListsApiCall();
  }, []);

  const ServiceListsApiCall = useCallback(async () => {
    console.log("ServiceListsApiCall Called");
    try {
      setLoading(true);
      var response = await getClusterListAllProjects();
      if (response.length !== 0) {
        setData(response);
        console.log("response", response);
        const uniqueNamespaces = [
          ...new Set(response.map((item) => item.namespaceName)),
        ];
        setNamespaceOptions(uniqueNamespaces);
      } else {
        setEmptyMessage("No Data to show");
      }

      setLoading(false);
      setInstrumentLoadig(false);
    } catch (error) {
      setErrorMessage("An error Occurred!");
      console.error("Error fetching data:", error);
      setLoading(false);
      setInstrumentLoadig(false);
    }
    console.log("ServiceListsApiCall Ended");
  }, [changeInstrument]);

  const filteredData = data.filter((item) => {
    let namespaceFilterCondition = true;
    if (selectedApplicationType === "openshift") {
      namespaceFilterCondition = item.namespaceName.includes("openshift");
    } else if (selectedApplicationType === "normal") {
      namespaceFilterCondition = !item.namespaceName.includes("openshift");
    }

    const selectedNamespaceCondition =
      selectedNamespace === "all" || item.namespaceName === selectedNamespace;

    let instrumentedStatusFilterCondition = true;
    if (selectedInstrumentedStatus === "instrumented") {
      instrumentedStatusFilterCondition = item.instrumented === "true";
    } else if (selectedInstrumentedStatus === "non-instrumented") {
      instrumentedStatusFilterCondition = item.instrumented !== "true";
    }

    return (
      namespaceFilterCondition &&
      selectedNamespaceCondition &&
      instrumentedStatusFilterCondition
    );
  });

  const openShiftNamespaces = namespaceOptions.filter((namespace) =>
    namespace.includes("openshift")
  );
  const normalNamespaces = namespaceOptions.filter(
    (namespace) => !namespace.includes("openshift")
  );

  const handleInstrumentedStatusChange = (event) => {
    setSelectedInstrumentedStatus(event.target.value);
  };

  const handleApplicationTypeChange = (event) => {
    setSelectedApplicationType(event.target.value);
    setSelectedNamespace("all"); // Reset namespace selection
  };

  const handleNamespaceChange = (event) => {
    setSelectedNamespace(event.target.value);
  };

  const handleInstrument = async (deploymentName, namespace) => {
    const instrumentresponse = await changeToInstrument(
      namespace,
      deploymentName
    );

    if (instrumentresponse.status === 200) {
      ServiceListsApiCall();
      setChangeInstrument(!changeInstrument);
      setMessage(
        "Instrumentation in Progress: Please wait for a few minutes ..."
      );
      setInstrumentLoadig(true);
      // alert("Instrumentation in Progress: Please wait for a few minutes !!!");
    } else {
      alert(
        "Instrumentation Error: Something went wrong with the instrumentation."
      );
    }
  };

  const handleUnInstrument = async (deploymentName, namespace) => {
    const instrumentresponse = await changeToUninstrument(
      namespace,
      deploymentName
    );
    if (instrumentresponse.status === 200) {
      ServiceListsApiCall();
      setChangeInstrument(!changeInstrument);
      setMessage(
        "Uninstrumentation in Progress: Please wait for a few minutes ..."
      );
      setInstrumentLoadig(true);
      // alert("Uninstrumentation in Progress: Please wait for a few minutes !!!");
    } else {
      alert(
        "Uninstrumentation Error: Something went wrong with the Uninstrumentation."
      );
    }
  };

  return (
    <div>
      <LoadingOverlay
        active={InstrumentLoading}
        // spinner={<FadeLoader style={{marginLeft:"20px"}} color="white" />}
        spinner
        styles={{
          overlay: (base) => ({
            ...base,
            background: "black",
          }),
        }}
        text={message}
      >
        {loading ? (
          <Loading />
        ) : emptyMessage ? (
          <div
            className="empty-message"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography variant="h5" fontWeight={"600"}>
              {emptyMessage}
            </Typography>
          </div>
        ) : errorMessage ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100vh",
            }}
          >
            <Typography variant="h5" fontWeight={"600"}>
              {errorMessage}
            </Typography>
          </div>
        ) : (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ paddingTop: "25px", paddingLeft: "10px" }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  Instrument an application deployed in Openshift to collect
                  Open Telemetry data for Observabilty
                </Typography>
              </div>
              <div style={{ display: "flex" }}>
                {" "}
                <div
                  style={{
                    alignItems: "center",
                    marginTop: "5px",
                    marginRight: "10px",
                  }}
                >
                  <label
                    style={{
                      fontSize: "10px",
                    }}
                  >
                    FilterBy
                  </label>
                  <div>
                    <FormControl>
                      <Select
                        style={{
                          width: "170px",
                          backgroundColor: "#FFF",
                          // color: theme.palette.mode === 'light' ? 'white' : 'black',
                          color: 'black',
                        height: "40px",
                          marginBottom: "10px",
                        }}
                        labelId="application-type-label"
                        id="application-type"
                        value={selectedApplicationType}
                        onChange={handleApplicationTypeChange}
                      >
                        <MenuItem value="all" >APPLICATIONS</MenuItem>
                        <MenuItem value="openshift">OpenShift</MenuItem>
                        <MenuItem value="normal">Applications</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div
                  style={{
                    alignItems: "center",
                    marginTop: "5px",
                    marginRight: "10px",
                  }}
                >
                  <label
                    style={{
                      fontSize: "10px",
                    }}
                  >
                    FilterBy
                  </label>
                  <div>
                    <FormControl>
                      <Select
                        style={{
                          width: "170px",
                          backgroundColor: "#FFF",
                          // color: theme.palette.mode === 'light' ? 'white' : 'black',
                          color: 'black',
                        height: "40px",
                          marginBottom: "10px",
                        }}
                        labelId="namespace-label"
                        id="namespace"
                        value={selectedNamespace}
                        onChange={handleNamespaceChange}
                      >
                        <MenuItem value="all">NAMESPACE</MenuItem>
                        {selectedApplicationType === "openshift" &&
                          openShiftNamespaces.map((namespace, index) => (
                            <MenuItem key={index} value={namespace}>
                              {namespace}
                            </MenuItem>
                          ))}
                        {selectedApplicationType === "normal" &&
                          normalNamespaces.map((namespace, index) => (
                            <MenuItem key={index} value={namespace}>
                              {namespace}
                            </MenuItem>
                          ))}
                        {selectedApplicationType === "all" &&
                          namespaceOptions.map((namespace, index) => (
                            <MenuItem key={index} value={namespace}>
                              {namespace}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div
                  style={{
                    alignItems: "center",
                    marginTop: "5px",
                    marginRight: "10px",
                  }}
                >
                  <label
                    style={{
                      fontSize: "10px",
                    }}
                  >
                    FilterBy
                  </label>
                  <div>
                    <FormControl>
                      <Select
                        style={{
                          width: "170px",
                          backgroundColor: "#FFF",
                          // color: theme.palette.mode === 'light' ? 'white' : 'black',
                          color: 'black',
                        height: "40px",
                          marginBottom: "10px",
                        }}
                        labelId="instrumented-status-label"
                        id="instrumented-status"
                        
                      value={selectedInstrumentedStatus}
                        onChange={handleInstrumentedStatusChange}
                      >
                        <MenuItem value="all">STATUS</MenuItem>
                        <MenuItem value="instrumented">Instrumented</MenuItem>
                        <MenuItem value="non-instrumented">
                          Non-Instrumented
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>

            {filteredData.length > 0 ? (
              <div>
                <TableContainer
                  component={Paper}
                  sx={{ maxHeight: "490px", overflowY: "auto" }}
                >
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{ color: "white", backgroundColor: "#00888C" }}
                        >
                          Deployment Name
                        </TableCell>
                        <TableCell
                          sx={{ color: "white", backgroundColor: "#00888C" }}
                        >
                          Name Space
                        </TableCell>
                        <TableCell
                          sx={{ color: "white", backgroundColor: "#00888C" }}
                        >
                          Created At
                        </TableCell>
                        <TableCell
                          sx={{ color: "white", backgroundColor: "#00888C" }}
                        >
                          Service Name
                        </TableCell>
                        <TableCell
                          sx={{ color: "white", backgroundColor: "#00888C" }}
                        >
                          Instrument Status
                        </TableCell>

                        {selectedApplicationType !== "openshift" && (
                          <TableCell
                            sx={{ color: "white", backgroundColor: "#00888C" }}
                          >
                            Action
                          </TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData.length > 0 &&
                        filteredData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.deploymentName}</TableCell>
                            <TableCell>{item.namespaceName}</TableCell>
                            <TableCell>{item.createdTime}</TableCell>
                            <TableCell>{item.serviceName || "Nil"}</TableCell>
                            <TableCell>
                              {item.instrumented === "true"
                                ? "Instrumented"
                                : "Un-Instrumented"}
                            </TableCell>
                            {selectedApplicationType !== "openshift" && (
                              <TableCell>
                                <>
                                  {item.instrumented === "true" ? (
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      onClick={() =>
                                        handleUnInstrument(
                                          item.deploymentName,
                                          item.namespaceName
                                        )
                                      }
                                    >
                                      Uninstrument
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() =>
                                        handleInstrument(
                                          item.deploymentName,
                                          item.namespaceName
                                        )
                                      }
                                    >
                                      Instrument
                                    </Button>
                                  )}
                                </>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography variant="h5" fontWeight={"600"}>
                  Sorry, no data found for this filter option!!!
                </Typography>
              </div>
            )}
          </div>
        )}
      </LoadingOverlay>
    </div>
  );
};

export default ClusterInfo;
