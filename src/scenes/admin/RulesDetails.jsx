import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Paper,
  Button,
  Grid,
  styled,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { getAllRules, updateServiceList } from "../../api/LoginApiService";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import Loading from "../../global/Loading/Loading";
import { GlobalContext } from "../../global/globalContext/GlobalContext";
import RuleDetailsPopup from "./RulesDetailsPopup";

function createData(serviceName, rules) {
  return {
    serviceName,
    rules,
  };
}

function Row({ row }) {
  const [open, setOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const StyledTableCell = styled(TableCell)(() => ({
    borderBottom: "none",
  }));

  const handleOpenPopup = (rule) => {
    setSelectedRule(rule);
    setOpen(true);
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" }, 
                  color: theme.palette.mode === "dark" ? "white" : "black",
                  backgroundColor: theme.palette.mode === "dark" ? "#2C3539" : "#e0e0e0",
                  "&:hover": {
                  // backgroundColor: theme.palette.mode === "dark" ? "#d0d1d5" : "#ffffff",
                  backgroundColor: "#d0d1d5",
                }, }} onClick={() => setOpen(!open)} >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography variant="h5" sx={{ fontWeight: "600px" }}>{row.serviceName}</Typography>
        </TableCell>

        {/* <TableCell component="th" scope="row">
          <Button variant="contained" color="primary">
            Edit
          </Button>
        </TableCell> */}

      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h4">Rules</Typography>
              {row.rules ? (
                  <Box sx={{ marginTop: 2 }}>
                    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                      <Table size="small" aria-label="rule-details">
                        <TableHead>
                          <TableRow>
                            <TableCell>Rule Type</TableCell>
                          <TableCell>Start Date</TableCell>
                          <TableCell>Expiry Date</TableCell>
                          <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {row.rules.map((rule, index) => (
                        <TableRow key={index}>
                          <StyledTableCell>{rule.ruleType}</StyledTableCell>
                          <StyledTableCell>{rule.startDateTime}</StyledTableCell>
                          <StyledTableCell>{rule.expiryDateTime}</StyledTableCell>
                          <StyledTableCell>
                            <Button variant="contained" color="primary" onClick={() => handleOpenPopup(rule)}>
                              View
                            </Button>
                          </StyledTableCell>
                        </TableRow>
                      ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                // ))
              ) : (
                <Typography variant="body2">No rules available.</Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {selectedRule && (
        <RuleDetailsPopup rule={selectedRule} serviceName={row.serviceName} onClose={handleOpenPopup} />
      )}
    </>
  );
}

const rows = [
  createData("order-srv-1", [
    {
      ruleType: "trace",
      startDateTime: "2024-01-10T10:30:00",
      expiryDateTime: "2024-01-30T17:00:00",
      duration: 200,
      durationConstraint: "greaterThan",
      memoryLimit: 0,
      memoryConstraint: "",
      cpuLimit: 0,
      cpuConstraint: "",
      severityText: [""],
      severityConstraint: "",
    },
    {
      ruleType: "metric",
      startDateTime: "2024-01-07T10:30:00",
      expiryDateTime: "2024-01-31T17:00:00",
      duration: 0,
      durationConstraint: "",
      memoryLimit: 1300,
      memoryConstraint: "",
      cpuLimit: 1e-7,
      cpuConstraint: "greaterThan",
      severityText: [""],
      severityConstraint: "",
    },
  ]),
  createData("vendor-srv-1", [
    {
      ruleType: "trace",
      startDateTime: "2024-01-01",
      expiryDateTime: "2024-01-05",
      duration: 0,
      durationConstraint: "",
      memoryLimit: 0,
      memoryConstraint: "",
      cpuLimit: 0,
      cpuConstraint: "",
      severityText: [""],
      severityConstraint: "",
    },
  ]),
];

const RulesDetails = () => {
  const navigate = useNavigate();
  // const { serviceListData, setServiceListData } = useContext(GlobalContext)
  const [rows, setRows] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("")

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const payload = {
    username: userInfo.username,
    password: userInfo.password,
    roles: userInfo.roles,
  };

  useEffect(() => {
    const handleGetAllRules = async () => {
      try {
        setLoading(true)
        const data = await getAllRules(payload);
        const rowsData = data.map((item) =>
          createData(item.serviceName, item.rules)
        );
        setRows(rowsData);
        setLoading(false);
        // setServiceListData(data)
        console.log("Rules Lists:", data);
      } catch (error) {
        console.error("Error fetching rules:", error);
        setErrorMessage("Error in Displaying Rules")
        setLoading(false)
      }
    };
    handleGetAllRules();
  }, []);

  const handleAddRules = () => {
    navigate("/admin/addRules");
  };

  const handleServiceClick = (serviceName) => {
    setSelectedService(serviceName);
  };

  return (
    <div style={{ marginTop: "0px" }}>
      {loading ? (
        <Loading />
      ) : errorMessage ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "80vh",
          }}
        >
          <Typography variant="h5" fontWeight={"600"}>
            {errorMessage}
          </Typography>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddRules}
              sx={{
                marginTop: "15px",
                height: "35px",
                fontWeight: "bold",
                backgroundColor: "lightgray",
                marginRight: "20px",
                "&:hover": { backgroundColor: "lightgray" },
              }}
            >
              Add Rule
            </Button>
          </div>

          <TableContainer component={Paper} sx={{ maxHeight: "500px", overflowY: "auto", marginTop:"10px" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "white", backgroundColor: "#00888C" }} />
                  <TableCell sx={{ color: "white", backgroundColor: "#00888C" }}>
                    Service Name
                  </TableCell>
                  {/* <TableCell sx={{ color: "white", backgroundColor: "#00888C" }}>
                    Action
                  </TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
              <Row
                key={row.serviceName}
                row={row}
                onClick={() => handleServiceClick(row.serviceName)}
              />
            ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default RulesDetails;
