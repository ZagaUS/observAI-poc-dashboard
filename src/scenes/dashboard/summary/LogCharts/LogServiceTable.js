import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { tokens } from "../../../../theme";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "../../../../global/globalContext/GlobalContext";
import { spanData } from "../../../../global/MockData/SpanData";

const LogServiceTable = ({ tableData, selectedService }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);

  const selectedServiceData = tableData.find(
    (item) => item.serviceName === selectedService
  );
  // const { setSelected, setTraceData, setRecentTrace } = useContext(GlobalContext);
  // Filter the data for the selected service
  // const selectedApiCallsData = APICallsData.find(
  //   (item) => item.serviceName === selectedService
  // );

  // const tableData = spanData.find(
  //   (item) => item.serviceName === selectedService && item.traceId === "2384799a01be10b55245e99864bba516"
  // );

  // const selectedPeakLatencyData = PeakLatencyData.find(
  //   (item) => item.serviceName === selectedService
  // );
  // const selectedErrorSuccessData = ErrSuccessData.find(
  //   (item) => item.serviceName === selectedService
  // );

  // const handleOpenTrace = (trace) => {

  //   // console.log("TRACE " + JSON.stringify([trace] ));
  //   setRecentTrace([trace]);
  //   // setTraceData([trace]);
  //   localStorage.setItem("routeName", "Traces");
  //   setSelected("Traces");
  //   navigate("/mainpage/traces");
  // }

  return (
    <div style={{ margin: "30px" }}>
      {selectedService && (
        // <Card elevation={3} style={{ margin: "16px" }}>
        // <CardContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ backgroundColor: colors.primary[400] }}>
              <TableRow>
              <TableCell style={{ textAlign: "center" }}>Service Name</TableCell>
                <TableCell style={{ textAlign: "center" }}>Trace Id</TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  Operation Name
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  Method Name
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>Duration</TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  Status Code
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  created Time
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={selectedService}>
                <TableCell style={{ textAlign: "center" }}>
                  {selectedService}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {selectedServiceData.traceId}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {selectedServiceData.methodName}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {selectedServiceData.operationName}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {selectedServiceData.duration}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {selectedServiceData.statusCode}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {selectedServiceData.createdTime}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Button variant="primary">OPEN TRACE</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

// onClick={() => handleOpenTrace(selectedApiCallsData)}

export default LogServiceTable;