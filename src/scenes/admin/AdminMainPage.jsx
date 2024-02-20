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
} from "@mui/material";
import {
  deleteClusterDetails,
  getClusterDetails,
  loginUser,
  openshiftClusterLogin,
  updateClusterDetails,
} from "../../api/LoginApiService";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/zaga-logedit.jpg";
import { useTheme } from '@mui/material/styles';

// import { Button, useTheme } from '@mui/material';
const AdminTopBar = () => {
  const navigate = useNavigate();
  const [ClusterData, setClusterData] = useState([]);
  const [editableRowId, setEditableRowId] = useState(null);
  const [editedUserName, setEditedUserName] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [editedClusterType, setEditedClusterType] = useState("");
  const [editedHostURL, setEditedHostURL] = useState("");
  const [deleted,SetDeleted] = useState(false);
  const theme = useTheme(); // Define the theme object using useTheme hook


  const handleDeleteRow = async(clusterId,clusterUsername) => {
 
    await deleteClusterDetails(clusterId,clusterUsername);
    SetDeleted(!deleted);
    
  };

  useEffect(() => {

    console.log("useeffet called");
    const userDetails = JSON.parse(localStorage.getItem("userInfo"));
    const payload = {
      username: userDetails.username,
      password: userDetails.password,
    };
    const fetchData = async () => {
      try {
        // Your asynchronous logic goes here
        const response = await loginUser(payload);

        // Do something with the fetched data
        console.log("clusterData adminPage", response.data.environments);
        setClusterData(response.data.environments);
      } catch (error) {
        // Handle errors
        console.error("Error fetching data:", error);
      }
    };

    // Call the async function immediately
    fetchData();
  }, [editableRowId,deleted]);

  const handleAddCluster = () => {
    navigate("/admin/addCluster");
  };

  const handleEditRow = (
    rowId,
    currentUserName,
    currentclusterPassword,
    currentClusterType,
    currentHostURL
  ) => {
    setEditableRowId(rowId);
    setEditedUserName(currentUserName);
    setEditedPassword(currentclusterPassword);
    setEditedClusterType(currentClusterType);
    setEditedHostURL(currentHostURL);
  };

 

  const handleSaveRow = async () => {
    // Implement logic to save the edited row data
    const userDetails = JSON.parse(localStorage.getItem("userInfo"));

    const updatedClusterPayload = {
      username: userDetails.username,
      password: userDetails.password,
      roles: userDetails.roles,
      environments: [
        {
          clusterId: editableRowId,
          clusterUsername: editedUserName,
          clusterPassword: editedPassword,
          hostUrl: editedHostURL,
          clusterType: editedClusterType,
        },
      ],
    };

    console.log("edited Row Details", updatedClusterPayload);
    await updateClusterDetails(updatedClusterPayload);
    setEditableRowId(null);
  };

  const data = {
    username: "mariselvam",
    password: "Selvam@3799",
  };

  const handleClusterOpen = async (clusterUrl, password, username) => {
    const ClusterLoginInfo = await openshiftClusterLogin(
      clusterUrl,
      password,
      username
    );
    console.log("infooo", ClusterLoginInfo);
    if (ClusterLoginInfo === "Login successful!") {
      navigate("/admin/clusterDashboard");
      // setTimeout(() => {
      //   alert("Login Successfull !!!");
      // }, 1000);
    } else if (ClusterLoginInfo === "Incorrect username or password.") {
      alert("Incorrect username or password.");
    } else {
      alert("Network Error !!.Please try again later.");
    }
  };

  return (
    <div>
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
            backgroundColor: theme.palette.mode === 'light' ? 'lightgray' : 'darkgray',
            marginRight: '20px',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'light' ? 'lightgray' : 'darkgray', // lighter shade for hover
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
                User Name
              </TableCell>
              <TableCell align="center" sx={{ color: "white" }}>
                Password
              </TableCell>
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
                      value={editedUserName}
                      onChange={(e) => setEditedUserName(e.target.value)}
                    />
                  ) : (
                    row.clusterUsername
                  )}
                </TableCell>
                <TableCell align="center">
                  {editableRowId === row.clusterId ? (
                    <TextField
                      type="text"
                      value={editedPassword}
                      onChange={(e) => setEditedPassword(e.target.value)}
                    />
                  ) : (
                    "*".repeat(row.clusterPassword.length)
                  )}
                </TableCell>

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
                          backgroundColor: theme.palette.mode === 'light' ? 'lightgray' : 'darkgray',
                          marginRight: '20px',
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'light' ? 'lightgray' : 'darkgray', // lighter shade for hover
                          },
                        }}
                        onClick={() =>
                          handleEditRow(
                            row.clusterId,
                            row.clusterUsername,
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
                          backgroundColor: theme.palette.mode === 'light' ? 'lightgray' : 'darkgray',
                          marginRight: '20px',
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'light' ? 'lightgray' : 'darkgray', // lighter shade for hover
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
                          backgroundColor: theme.palette.mode === 'light' ? 'lightgray' : 'darkgray',
                          marginRight: '20px',
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'light' ? 'lightgray' : 'darkgray', // lighter shade for hover
                          },
                        }}
                        onClick={() =>
                          handleDeleteRow(row.clusterId, row.clusterUsername)
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
                          backgroundColor: theme.palette.mode === 'light' ? 'lightgray' : 'darkgray',
                          marginRight: '20px',
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'light' ? 'lightgray' : 'darkgray', // lighter shade for hover
                          },
                        }}
                        onClick={
                          () =>
                            handleClusterOpen(
                              row.hostUrl,
                              row.clusterPassword,
                              row.clusterUsername
                            )
                        }
                      >
                        View
                      </Button>
                      <Button
                       sx={{
                        backgroundColor: theme.palette.mode === 'light' ? 'lightgray' : 'darkgray',
                        marginRight: '20px',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'light' ? 'lightgray' : 'darkgray', // lighter shade for hover
                        },
                      }}
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleEditRow(
                            row.clusterId,
                            row.clusterUsername,
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
                          backgroundColor: theme.palette.mode === 'light' ? 'lightgray' : 'darkgray',
                          marginRight: '20px',
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'light' ? 'lightgray' : 'darkgray', // lighter shade for hover
                          },
                        }}
                        onClick={() =>
                          handleDeleteRow(row.clusterId, row.clusterUsername)
                        }
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminTopBar;