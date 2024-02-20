import { Box } from "@mui/material";
import React from "react";

const Status = () => {
  return (
    <div style={{ display: "flex" }}>
      <Box
        sx={{
          backgroundColor: "yellowgreen",
          height: "75vh",
          width: "75%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Cluster Data
      </Box>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            backgroundColor: "yellow",
            height: "40vh",
            width: "310px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Subscribtion Details
        </Box>
        <Box
          sx={{
            backgroundColor: "blue",
            height: "35vh",
            width: "310px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Cluster Inventory Data
        </Box>
      </div>
    </div>
  );
};

export default Status;
