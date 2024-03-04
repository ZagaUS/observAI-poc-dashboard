import React, { useEffect, useState } from "react";
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

// import { Button, useTheme } from '@mui/material';
const AdminTopBar = () => {
  const navigate = useNavigate();
  const [ClusterData, setClusterData] = useState([]);
  const [editableRowId, setEditableRowId] = useState(null);
  const [editableClusterName, setEditableClusterName] = useState("");
  const [editedUserName, setEditedUserName] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [editedClusterType, setEditedClusterType] = useState("");
  const [editedHostURL, setEditedHostURL] = useState("");
  const [deleted, SetDeleted] = useState(false);
  const [Loading, setLoading] = useState(false);
  const theme = useTheme();
  const [clusterStatus, setClusterStatus] = useState("");
  const [checked, setChecked] = useState(false);
  // clusterName
  const handleDeleteRow = async (clusterId) => {
    const userDetails = JSON.parse(localStorage.getItem("userInfo"));
    await deleteClusterDetails(clusterId, userDetails.username);
    SetDeleted(!deleted);
  };

  useEffect(() => {
    console.log("Admin UseEffect Called--->");
    const userDetails = JSON.parse(localStorage.getItem("userInfo"));
    const fetchData = async () => {
      try {
        const response = await getAllClustersAPI(userDetails.username);
        setClusterData(response);
        console.log("---------- CLUSTER DATA - -------- ", response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the async function immediately
    fetchData();
  }, [editableRowId, deleted, clusterStatus]);

  const handleAddCluster = () => {
    navigate("/admin/addCluster");
  };

  const handleEditRow = (
    rowId,
    currentClusterName,
    currentUserName,
    currentclusterPassword,
    currentClusterType,
    currentHostURL
  ) => {
    setEditableRowId(rowId);
    setEditableClusterName(currentClusterName);
    setEditedUserName(currentUserName);
    setEditedPassword(currentclusterPassword);
    setEditedClusterType(currentClusterType);
    setEditedHostURL(currentHostURL);
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
          hostUrl: editedHostURL,
          userName: editedUserName,
        },
      ],
    };

    console.log("edited Row Details", updatedClusterPayload);
    // await updateClusterDetails(updatedClusterPayload);
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
  const handleClusterOpen = () => {
    navigate("/admin/clusterDashboard");
  };

  return (
    <div>
      {Loading ? (
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
                    </TableCell>

                    <TableCell align="center">
                      {editableRowId === row.clusterId ? (
                        <TextField
                          value={editedUserName}
                          onChange={(e) => setEditedUserName(e.target.value)}
                        />
                      ) : (
                        row.userName
                      )}
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
                            Cancle
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
                            onClick={() =>
                              handleClusterOpen(
                                row.hostUrl,
                                row.clusterPassword,
                                row.clusterUsername
                              )
                            }
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
                                row.userName,
                                row.clusterName,
                                row.clusterPassword,
                                row.clusterType,
                                row.hostUrl
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
  );
};

export default AdminTopBar;
