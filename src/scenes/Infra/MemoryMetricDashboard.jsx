import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../global/globalContext/GlobalContext";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import ReactApexChart from "react-apexcharts";

const MemoryMetricDashboard = ({ podData }) => {
  // console.log("podData------------", podData);
  const [filteredData, setFilteredData] = useState([]);
  const { isCollapsed, podCurrentPage, setPodCurrentPage } =
    useContext(GlobalContext);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isLandscape = useMediaQuery(
    "(max-width: 1000px) and (orientation: landscape)"
  );
  const isiphone = useMediaQuery((theme) => theme.breakpoints.down("iphone"));
  const totalPages = podData.totalCount;


  console.log("totalPages",totalPages);
  console.log("podCurrentPage",podCurrentPage);

  useEffect(() => {

    console.log("memory metric useeffect caleed ----->>>");
    console.log(podData.data,"podData");
    if (podData) {
      setFilteredData(podData.data); // Set filtered data to the metrics of selected pod
    }
  }, [podData]);

  const handleApplyButtonClick = (increment) => {
    // if (containerPowerMetrics.type === "pod") {
    setPodCurrentPage((prevPage) => prevPage + increment);
    // } else {
    //     setNodeCurrentPage((prevPage) => prevPage + increment);
    // }
  };

  const options = {
    chart: {
      type: "area",
      stacked: true,
      toolbar: {
        show: true,
        offsetX: -2,
        offsetY: -25,
      },
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    title: {
      align: "middle",
      style: {
        color: theme.palette.mode === "dark" ? "#FFF" : "#000",
        fontFamily: "Red Hat Display, sans-serif",
        fontWeight: 500,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    yaxis: {
      min: 0,
      title: {
        text: filteredData.length > 0 ? podData.yaxis : "", // Access yaxis property of the first element
        style: {
          color: theme.palette.mode === "dark" ? "#FFF" : "#000",
          fontFamily: "Red Hat Display, sans-serif",
          fontWeight: 500,
        },
      },
      labels: {
        formatter: function (val) {
          return ((val / 1000) * 1000).toFixed(2);
        },
        style: {
          colors: theme.palette.mode === "dark" ? "#FFF" : "#000",
        },
      },
    },
    xaxis: {
      type: "datetime",
      title: {
        text: "TIME RANGE",
        style: {
          color: theme.palette.mode === "dark" ? "#FFF" : "#000",
          fontWeight: 500,
          fontFamily: "Red Hat Display, sans-serif",
        },
      },
      labels: {
        style: {
          colors: theme.palette.mode === "dark" ? "#FFF" : "#000",
        },
        datetimeUTC: false,
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "dd MMM",
          hour: "HH:mm",
        },
      },
    },
    tooltip: {
      enabled: true,
      shared: true,
      x: {
        format: "dd MMM yyyy HH:mm:ss",
      },
      y: {
        formatter: function (val) {
          return val;
        },
      },
      style: {
        fontSize: "12px",
      },
    },
  };

  //   const handleApplyButtonClick = (increment) => {
  //     if (containerPowerMetrics.type === "pod") {
  //         setKeplerCurrentPage((prevPage) => prevPage + increment);
  //     } else {
  //         setNodeCurrentPage((prevPage) => prevPage + increment);
  //     }
  // };

  const chartWidth = isCollapsed ? "calc(100% - 10px)" : "calc(100% - 10px)";
  const chartHeight =
    isLandscape && isSmallScreen ? "145%" : isiphone ? "125%" : "88%";

  return (
    <Box
      height="calc(75vh - 30px)"
      width={chartWidth}
      padding="5px"
      border="1px"
      style={{ transition: "width 0.3s ease-in-out" }}
    >
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <Button
          variant="contained"
          size="small"
          color="primary"
          style={{
            height: "25px",
            margin: "0px 5px 0px 30px",
            fontSize: "10px",
          }}
          onClick={() => handleApplyButtonClick(-1)} // Navigate to previous page
          disabled={podCurrentPage === 1} // Disable if on the first page
        >
          Previous
        </Button>
        <Button
          variant="contained"
          size="small"
          color="primary"
          style={{
            height: "25px",
            margin: "0px 5px 0px 5px",
            fontSize: "10px",
          }}
          onClick={() => handleApplyButtonClick(1)} // Navigate to next page
          disabled={podCurrentPage === totalPages} // Disable if on the last page
        >
          Next
        </Button>
        {podData.title ? (
          <p style={{ marginTop: "0px" }} className="chart-title">
            {podData.title}
          </p>
        ) : (
          <p style={{ marginTop: "0px" }} className="chart-title">
            {podData.title}
          </p>
        )}
      </div>
      <ReactApexChart
        options={options}
        series={[
          { name: "MEMORY USAGE", data: filteredData, color: "#C40233" },
        ]}
        type="area"
        height={chartHeight}
        width={"100%"}
      />
    </Box>
  );
};

export default MemoryMetricDashboard;
