import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { tokens } from "../../../../theme";
import { useTheme } from "@emotion/react";
import { useContext } from "react";
import { GlobalContext } from "../../../../global/globalContext/GlobalContext";
import "./PeakLatencyChart.css";
import { Button, CircularProgress, InputAdornment, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect } from "react";
import { getPeakLatencyFilterData } from "../../../../api/TraceApiService";
import { useCallback } from "react";
import Loading from "../../../../global/Loading/Loading";

const PeakLatencyChart = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    isCollapsed,
    lookBackVal,
    selectedStartDate,
    selectedEndDate,
  } = useContext(GlobalContext);

  const [errorMessage, setErrorMessage] = useState("");
  const [emptyMessage, setEmptyMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [peaklatencyData, setPeakLatencyData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("500");
  const [minDurationValue, setMinDurationValue] = useState(0);
  const [maxDurationValue, setMaxDurationValue] = useState(500);
  const [minMaxError, setMinMaxError] = useState("");

  // const [FiteredData,setFiteredData] = useState([]);

  const PeaklatencyFiltered = useCallback(async (minDuration,maxDuration) => {
    try {
      setLoading(true);
      var response = await getPeakLatencyFilterData(
        selectedStartDate,
        minDuration,
        maxDuration,
        selectedEndDate,
        lookBackVal.value
      );
      if (response.data.peakLatency.some(
        (item) => item.peakLatency !== 0
      )) {
        setPeakLatencyData(response.data.peakLatency);
      } else {
        setEmptyMessage("No Data to show");
      }
      
      console.log(response.data.peakLatency);

    } catch (error) {
      console.log("ERROR on peaklatency filter api " + error);
      setErrorMessage("An error Occurred!");
    } finally {
      setLoading(false);
    }
  }, [
    selectedStartDate,
    selectedEndDate,
    lookBackVal,
  ]);

  const handleMinChange = (event) => {
    const newValue = parseInt(event.target.value);

    if (!isNaN(newValue)) {
      if (newValue <= maxDurationValue) {
        setMinDurationValue(newValue);
        setMinMaxError('');
      } else {
        setMinDurationValue(newValue);
        setMinMaxError('Min value cannot be greater than Max value');
      }
    } else {
      setMinDurationValue(event.target.value);
      setMinMaxError('Please enter a valid number');
    }
  };

  const handleMaxChange = (event) => {
    const newValue = parseInt(event.target.value);

    if (!isNaN(newValue)) {
      if (newValue >= minDurationValue) {
        setMaxDurationValue(newValue);
        setMinMaxError('');
      } else {
        setMaxDurationValue(newValue);
        setMinMaxError('Max value cannot be less than Min value');
      }
    } else {
      setMaxDurationValue(event.target.value);
      setMinMaxError('Please enter a valid number');
    }
  };

  useEffect(() => {
    PeaklatencyFiltered(minDurationValue,maxDurationValue);
  }, [PeaklatencyFiltered]);

  // const handleSortOrderChange = (event) => {
    // setErrorMessage("");
    // setEmptyMessage("");
  //   setSelectedOption(event.target.value);
  // };

  const handleApplyButtonClick = () => {
    setErrorMessage("");
    setEmptyMessage("");
    console.log("Durations " + [minDurationValue, maxDurationValue]);
    PeaklatencyFiltered(minDurationValue,maxDurationValue);
  }

  const peakLatencyOptions = {
    chart: {
      height: 250,
      type: "bar",
      toolbar: {
        show: true,
        offsetX: -2,
        offsetY: -25,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "30px",
      },
    },

    xaxis: {
      labels: {
        rotate: -45,
        style: {
          colors: colors.textColor[500],
          fontSize: 10,
          fontWeight: 500,
          fontFamily: "Red Hat Display",
        },
      },
      categories: peaklatencyData.map((item) => item.serviceName),
      title: {
        text: "List of Services",
        style: {
          color: colors.textColor[500],
          fontSize: 12,
          fontWeight: 500,
          fontFamily: "Red Hat Display",
        },
      },
    },
    yaxis: {
      title: {
        text: "Latency(ms)",
        style: {
          color: colors.textColor[500],
          fontSize: 12,
          fontWeight: 500,
          fontFamily: "Red Hat Display",
        },
      },

      labels: {
        style: {
          colors: colors.textColor[500],
          fontSize: 12,
          fontWeight: 500,
          fontFamily: "Red Hat Display",
        },
      },
    },
    // title: {
    // text: "Peak Latency > 500(ms)",
    // align: "middle",
    // offsetX: 0,
    // offsetY: 10,
    // style: {
    //   color: colors.textColor[500],
    //   fontSize: 16,
    //   fontWeight: 500,
    //   fontFamily: "Red Hat Display",
    // },

    // },
    labels: {
      style: {
        colors: theme.palette.mode === "dark" ? "#FFF" : "#000",
      },
    },
  };
  const peakLatencySeries = [
    {
      name: "Peak Latency",
      data: peaklatencyData.map((item) => item.peakLatency),
    },
  ];

  const chartWidth = isCollapsed ? "calc(100% - 20px)" : "calc(103% - 30px)";

  return (
    <>
      <div
        className="chart-title"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: "10px",
          // marginRight:"-30px"
          // marginLeft: "50px",
        }}
      >
        {/* <div
          style={{
            display: "flex",
            flexDirection: "column",
            // marginBottom: "10px",
          }}
        > */}
        {/* <label
            style={{
              fontSize: "8px",
              fontWeight: "500",
              // marginLeft: "20px",
            }}
          >
            Filter (ms)
          </label>

          <Select
            value={selectedOption}
            onChange={handleSortOrderChange}
            style={{
              width: "95px",
              height: "32px",
              // marginLeft: "50px",
              // borderColor:"red"
            }}
          >
            <MenuItem value="" disabled>
              Sort Order
            </MenuItem>
            {sortOrderOptions.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select> */}
        <div style={{ display: "flex", justifyContent: "flex-start" }} >
        <Tooltip title={minMaxError} placement="top" arrow>
          <TextField
            label="Min (ms)"
            variant="outlined"
            value={minDurationValue}
            onChange={handleMinChange}
            error={minMaxError !== ''}
            size="small"
            InputProps={{
              classes: {
                notchedOutline: "focused-textfield"
              },
            }}
            InputLabelProps={{
              style: {
                color: colors.textColor[500],
              },
            }}
            style={{
              margin: "10px 5px 10px 5px", color: "#000", width: "75px"
            }}
          />
          </Tooltip>
          <Tooltip title={minMaxError} placement="top" arrow>
          <TextField
            label="Max (ms)"
            variant="outlined"
            size="small"
            value={maxDurationValue}
            onChange={handleMaxChange}
            error={minMaxError !== ''}
            InputProps={{
              classes: {
                notchedOutline: "focused-textfield"
              },
            }}
            InputLabelProps={{
              style: {
                color: colors.textColor[500],
              },
            }}
            color="primary"
            style={{
              margin: "10px 5px 10px 5px", color: "#000", width: "75px"
            }}
          />
          </Tooltip>
          {/* </div> */}
          <Button
            variant="contained"
            onClick={handleApplyButtonClick}
            disabled={minMaxError}
            size="small"
            color="primary"
            style={{ height: "30px", margin: "15px 5px 10px 5px",fontSize:"10px" }}
          >
            Apply
          </Button>
        </div>
        <p style={{marginLeft:"20px"}} >Peak Latency</p>
      </div>

      <div
        data-theme={theme.palette.mode}
        style={{
          height: "calc(40vh - 20px)",
          width: chartWidth,
          marginTop: "-30px",
        }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              // height: "80vh",
            }}
          >
            <CircularProgress
              style={{ color: colors.blueAccent[400], marginTop: "65px" }}
              size={30}
              thickness={7}
            />
            <Typography variant="h5" fontWeight={"500"} mt={2}>
              LOADING.....
            </Typography>
          </div>
        ) : emptyMessage ? (<div style={{ display: 'flex', justifyContent: 'center', alignItems: "center", height: "calc(30vh - 25px)" }}>
          <Typography variant="h5" fontWeight={"600"}>
            PeakLatency Count Chart - No data
          </Typography>
        </div>) : errorMessage ? (<div style={{ display: 'flex', justifyContent: 'center', alignItems: "center", height: "calc(30vh - 25px)" }}>
          <Typography variant="h5" fontWeight={"600"}>
            Error Occurred
          </Typography>
        </div>) : (
          <ReactApexChart
            style={{
              color: "#000",
            }}
            options={peakLatencyOptions}
            series={peakLatencySeries}
            type="bar"
            height={"80%"}
            width={"100%"}
          />
        )}
      </div>
    </>
  );
};

export default PeakLatencyChart;
