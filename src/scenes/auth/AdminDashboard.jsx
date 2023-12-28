import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  AppBar, Toolbar, Typography, Card
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
// import { AppBar, Toolbar, Typography } from '@material-ui/core';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleloginpage = () => {
    navigate("/adminlogin");
  };

  const data = [{ Custer: "Cluster 1" }, { Custer: "Cluster 2" }];
  
  return (
    <div>
      {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ marginLeft: "60px", marginTop: "40px" }}>Cluster</div>
        <div style={{ marginLeft: "30px", marginTop: "40px" }}>
          <button style={{ marginRight: "45px" }}>Add Cluster</button>
          <button style={{ marginRight: "45px" }}>Add Rule</button>
        </div>
      </div> */}


      <AppBar position="static" style={{backgroundColor:"#052954",color:"white"}}>
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4" style={{ fontWeight: 'bold' }}>Cluster</Typography>
        <div>
          <Button style={{backgroundColor:"gray",marginRight:"10px"}} color="inherit">Add Cluster</Button>
          <Button style={{backgroundColor:"gray"}} color="inherit">Add Rule</Button>
        </div>
      </Toolbar>
    </AppBar>


      {/* <Box m={5}/> */}
        {" "}
        <TableContainer
          style={{ width: "100%", alignContent: "center", marginTop: "70px" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    backgroundColor: "#052954",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  User Name
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "#052954",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  Cluster Type
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "#052954",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  Host URL
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "#052954",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell style={{ textAlign: "center" }}>
                    {row.Custer}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Button variant="primary" onClick={handleloginpage}>
                      Open
                    </Button>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {row.Custer}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Button variant="primary" onClick={handleloginpage}>
                      Open
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>{" "}
      {/* </Box> */}
    </div>
  );
};

export default AdminDashboard;
