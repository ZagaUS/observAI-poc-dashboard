import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import {
  deleteClusterDetails,
  getAllClustersAPI,
  getClusterDetails,
  loginUser,
  openshiftClusterLogin,
  updateClusterDetails,
} from "../../api/LoginApiService";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/zaga-logedit.jpg";
import { useTheme } from "@mui/material/styles";
import { GlobalContext } from "../../global/globalContext/GlobalContext";
import Loading from "../../global/Loading/Loading";

const AdminTopBar = () => {
  const navigate = useNavigate();
  const [ClusterData, setClusterData] = useState([]);
  const [editableRowId, setEditableRowId] = useState(null);
  const [editableClusterName, setEditableClusterName] = useState("");
  const [editedUserName, setEditedUserName] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [editedClusterType, setEditedClusterType] = useState("");
  const [editedHostURL, setEditedHostURL] = useState("");
  const [editedInfraName, setEditedInfraName] = useState("");
  const [deleted, SetDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedClusterDetails, setSelectedClusterDetails] = useState(null);
  const theme = useTheme();
  const [clusterStatus, setClusterStatus] = useState("");
  const [checked, setChecked] = useState(false);

  const { AdminPageSelecteCluster, setAdminPageSelecteCluster } =
    useContext(GlobalContext);

  const handleDeleteRow = async (clusterId) => {
    const userDetails = JSON.parse(localStorage.getItem("userInfo"));
    await deleteClusterDetails(clusterId, userDetails.username);
    SetDeleted(!deleted);
  };

  const selectedClusterName = ClusterData.clusterName;
  console.log(selectedClusterName);

  console.log("---------Cluster Data", ClusterData);
  console.log("-----editedRules", editableRowId);

  useEffect(() => {
    console.log("Admin UseEffect Called--->");
    const userDetails = JSON.parse(localStorage.getItem("userInfo"));
    console.log("-------[USER DETAILS]------------ ", userDetails.username)
    // const payload = {
    //   username: userDetails.username,
    //   password: userDetails.password,
    // };
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getAllClustersAPI(userDetails.username);

        if (response.length > 0) {
          console.log("clusterData adminPage", response);
          setClusterData(response);
          setLoading(false);
          console.log("CLUSTER RESPONSE_-------------------", ClusterData);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [editableRowId, deleted, clusterStatus]);

  const handleAddCluster = () => {
    navigate("/admin/addCluster");
  };

  const handleEditRow = (
    rowId,
    currentClusterName,
    currentCusterUserName,
    currentclusterPassword,
    currentClusterType,
    currentHostURL,
    currentInfraName
  ) => {
    setEditableRowId(rowId);
    setEditableClusterName(currentClusterName);
    setEditedUserName(currentCusterUserName);
    setEditedPassword(currentclusterPassword);
    setEditedClusterType(currentClusterType);
    setEditedHostURL(currentHostURL);
    setEditedInfraName(currentInfraName);
  };

  const handleCancelButton = () => {
    setEditableRowId(null);
  };

  const handleSaveRow = async () => {
    const userDetails = JSON.parse(localStorage.getItem("userInfo"));

    const updatedClusterPayload = {
      username: userDetails.username,
      password: userDetails.password,
      roles: userDetails.roles,
      environments: [
        {
          clusterId: editableRowId,
          clusterName: editableClusterName,
          clusterPassword: editedPassword,
          clusterType: editedClusterType,
          clusterUsername: editedUserName,
          hostUrl: editedHostURL,
          openshiftClusterName: editedInfraName,
        },
      ],
    };

    console.log("edited Row Details", updatedClusterPayload);
    console.log("CLUSTER NAME UPDATED", updatedClusterPayload);
    console.log(
      "EDITED CLUSTER NAME+++--------------------------------------",
      editableClusterName
    );
    await updateClusterDetails(updatedClusterPayload);
    setEditableRowId(null);
  };

  const handleActiveInactiveBtn = (
    clusterValue,
    rowId,
    currentClusterName,
    currentUserName,
    currentclusterPassword,
    currentClusterType,
    currentHostURL
  ) => {
    console.log("------------> BEFORE PERSIST----------  ", clusterValue , rowId , currentClusterName, currentUserName);
    if (clusterValue == "active") {
      setClusterStatus("inactive");
    } else {
      setClusterStatus("active");
    }
    console.log("------------> AFTER PERSIST----------  ", clusterValue);
  };
  const handleClusterOpen = (clusterDetails) => {
    console.log("clusterName", clusterDetails);
    // setSelectedClusterDetails(clusterDetails);
    setAdminPageSelecteCluster(clusterDetails);
    navigate("/admin/clusterDashboard");
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "10px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCluster}
              sx={{
                backgroundColor:
                  theme.palette.mode === "light" ? "lightgray" : "darkgray",
                marginRight: "20px",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "light" ? "lightgray" : "darkgray",
                },
              }}
            >
              Add Cluster
            </Button>
          </div>
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#00888C" }}>
                <TableRow>
                  <TableCell align="center" sx={{ color: "white" }}>
                    Cluster Name
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    User Name
                  </TableCell>
                  {/* <TableCell align="center" sx={{ color: "white" }}>
                Password
              </TableCell> */}
                  <TableCell align="center" sx={{ color: "white" }}>
                    Cluster Type
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    Host URL
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {ClusterData.map((row, index) => (
                  <TableRow key={row.clusterId}>
                    <TableCell align="center">
                      {editableRowId === row.clusterId ? (
                        <TextField
                          value={editableClusterName}
                          onChange={(e) =>
                            setEditableClusterName(e.target.value)
                          }
                        />
                      ) : (
                        row.clusterName
                      )}
                      {/* {row.clusterName} */}
                    </TableCell>

                    <TableCell align="center">
                      {editableRowId === row.clusterId ? (
                        <TextField
                          value={editedUserName}
                          onChange={(e) => setEditedUserName(e.target.value)}
                        />
                      ) : (
                        row.clusterUserName
                      )}
                      {/* {row.clusterUserName} */}
                    </TableCell>
                    {/* <TableCell align="center">
                  {editableRowId === row.clusterId ? (
                    <TextField
                      type="text"
                      value={editedPassword}
                      onChange={(e) => setEditedPassword(e.target.value)}
                    />
                  ) : (
                    "*".repeat(row.clusterPassword.length)
                  )}
                </TableCell> */}

                    <TableCell align="center">
                      {editableRowId === row.clusterId ? (
                        <TextField
                          value={editedClusterType}
                          onChange={(e) => setEditedClusterType(e.target.value)}
                        />
                      ) : (
                        row.clusterType
                      )}
                      {/* {row.clusterType} */}
                    </TableCell>
                    <TableCell align="center">
                      {editableRowId === row.clusterId ? (
                        <TextField
                          value={editedHostURL}
                          onChange={(e) => setEditedHostURL(e.target.value)}
                        />
                      ) : (
                        row.hostUrl
                      )}
                      {/* {row.hostUrl} */}
                    </TableCell>
                    <TableCell align="center">
                      {editableRowId === row.clusterId ? (
                        <>
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{
                              backgroundColor:
                                theme.palette.mode === "light"
                                  ? "lightgray"
                                  : "darkgray",
                              marginRight: "20px",
                              "&:hover": {
                                backgroundColor:
                                  theme.palette.mode === "light"
                                    ? "lightgray"
                                    : "darkgray", // lighter shade for hover
                              },
                            }}
                            onClick={handleCancelButton}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{
                              backgroundColor:
                                theme.palette.mode === "light"
                                  ? "lightgray"
                                  : "darkgray",
                              marginRight: "20px",
                              "&:hover": {
                                backgroundColor:
                                  theme.palette.mode === "light"
                                    ? "lightgray"
                                    : "darkgray", // lighter shade for hover
                              },
                            }}
                            onClick={handleSaveRow}
                          >
                            Save
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{
                              backgroundColor:
                                theme.palette.mode === "light"
                                  ? "lightgray"
                                  : "darkgray",
                              marginRight: "20px",
                              "&:hover": {
                                backgroundColor:
                                  theme.palette.mode === "light"
                                    ? "lightgray"
                                    : "darkgray", // lighter shade for hover
                              },
                            }}
                            onClick={() =>
                              handleDeleteRow(row.clusterId, row.clusterName)
                            }
                          >
                            Delete
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{
                              backgroundColor:
                                theme.palette.mode === "light"
                                  ? "lightgray"
                                  : "darkgray",
                              marginRight: "20px",
                              "&:hover": {
                                backgroundColor:
                                  theme.palette.mode === "light"
                                    ? "lightgray"
                                    : "darkgray", // lighter shade for hover
                              },
                            }}
                            onClick={() => handleClusterOpen(row.clusterName)}
                          >
                            View Cluster Details
                          </Button>
                          <Button
                            sx={{
                              backgroundColor:
                                theme.palette.mode === "light"
                                  ? "lightgray"
                                  : "darkgray",
                              marginRight: "20px",
                              "&:hover": {
                                backgroundColor:
                                  theme.palette.mode === "light"
                                    ? "lightgray"
                                    : "darkgray", // lighter shade for hover
                              },
                            }}
                            variant="contained"
                            color="primary"
                            onClick={() =>
                              handleEditRow(
                                row.clusterId,
                                row.clusterName,
                                row.clusterUserName,
                                row.clusterPassword,
                                row.clusterType,
                                row.hostUrl,
                                row.openshiftClusterName
                              )
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{
                              backgroundColor:
                                theme.palette.mode === "light"
                                  ? "lightgray"
                                  : "darkgray",
                              marginRight: "20px",
                              "&:hover": {
                                backgroundColor:
                                  theme.palette.mode === "light"
                                    ? "lightgray"
                                    : "darkgray",
                              },
                            }}
                            onClick={() =>
                              handleDeleteRow(
                                row.clusterId
                                // userDetails.username
                              )
                            }
                          >
                            Delete
                          </Button>
                          {/* <FormGroup>
                            <FormControlLabel
                              // value={ClusterStatus}
                              control={<Switch 
                                checked = {row.clusterStatus}
                                onChange={() => handleActiveInactiveBtn(row.clusterStatus)}
                              />}
                              label="ClusterStatus"
                            />
                          </FormGroup> */}
                          <Switch
                            checked={
                              row.clusterStatus == "active" ? true : false
                            }
                            onChange={() =>
                              handleActiveInactiveBtn(
                                row.clusterStatus,
                                row.clusterId,
                                row.clusterUserName,
                                row.clusterName,
                                row.clusterPassword,
                                row.clusterType,
                                row.hostUrl
                              )
                            }
                          />
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
    // <></>
  );
};

export default AdminTopBar;
