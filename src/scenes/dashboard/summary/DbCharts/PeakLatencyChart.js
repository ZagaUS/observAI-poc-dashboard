import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useTheme } from "@emotion/react";
import { tokens } from "../../../../theme";
import { useContext } from "react";
import { GlobalContext } from "../../../../global/globalContext/GlobalContext";
import { Button, CircularProgress, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material";
import { sortOrderOptions } from "../../../../global/MockData/MockTraces";
import { useCallback } from "react";
import { getDBPeakLatencyFilterData } from "../../../../api/TraceApiService";
import { useEffect } from "react";

const DBCallsCount = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    isCollapsed,
    lookBackVal,
    selectedStartDate,
    selectedEndDate,
  } = useContext(GlobalContext);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emptyMessage, setEmptyMessage] = useState("");
  const [dbPeaklatencyData, setDbPeakLatencyData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("50");
  const [minDurationValue, setMinDurationValue] = useState(0);
  const [maxDurationValue, setMaxDurationValue] = useState(500);
  const [minMaxError, setMinMaxError] = useState("");

  const DBPeaklatencyFiltered = useCallback(async (minDuration,maxDuration) => {
    try {
      setLoading(true);
      var response = await getDBPeakLatencyFilterData(
        selectedStartDate,
        minDuration,
        maxDuration,
        selectedEndDate,
        lookBackVal.value
      );
      if (response.data.dBTracePeakLatencyCount.some(
        (item) => item.dbPeakLatencyCount !== 0
      )) {
        setDbPeakLatencyData(response.data.dBTracePeakLatencyCount);
      } else {
        setEmptyMessage("No Data to show");
      }

      console.log(response.data.dBTracePeakLatencyCount,"-------->")
    } catch (error) {
      console.log("ERROR on PeakLatency filter api " + error);
      setErrorMessage("An error Occurred!");
    } finally {
      setLoading(false);
    }
  }, [
    selectedStartDate,
    selectedEndDate,
    lookBackVal
  ]);


  useEffect(() => {
    DBPeaklatencyFiltered(minDurationValue,maxDurationValue);
  }, [DBPeaklatencyFiltered]);

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

  const handleApplyButtonClick = () => {
    setErrorMessage("");
    setEmptyMessage("");
    console.log("Durations " + [minDurationValue, maxDurationValue]);
    DBPeaklatencyFiltered(minDurationValue,maxDurationValue);
  }


  // const handleSortOrderChange = (event) => {
  //   setErrorMessage("");
  //   setEmptyMessage("");
  //   setSelectedOption(event.target.value);
  // };

  const options = {
    chart: {
      type: "bar",
      height: 300,
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
      categories: dbPeaklatencyData.map((item) => item.serviceName),
      title: {
        text: "List of Services",
        style: {
          color: colors.textColor[500],
          fontSize: 12,
          fontWeight: 500,
          fontFamily: "Red Hat Display",
        },
      },
      labels: {
        rotate: -45,
        style: {
          colors: colors.textColor[500],
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
    //   text: "Peak Latency > 50(ms)",
    //   align: "center",
    //   margin: 5,
    //   offsetX: 0,
    //   offsetY: 5,
    //   style: {
    //     color: colors.textColor[500],
    //     fontSize: 16,
    //     fontWeight: 500,
    //     fontFamily: "Red Hat Display",
    //   },
    // },
  };

  const series = [
    {
      name: "DB Calls",
      data: dbPeaklatencyData.map((item) => item.dbPeakLatencyCount),
      //   color: "#04700b",
    },
  ];

  const chartWidth = isCollapsed ? "calc(100% - 10px)" : "calc(103% - 70px)";

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
          // marginLeft: "250px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-start" }} >
        <Tooltip title={minMaxError} placement="top" arrow>
          <TextField
            label="Min (ms)"
            variant="outlined"
            value={minDurationValue}
            onChange={handleMinChange}
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
            size="small"
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
            error={minMaxError !== ''}
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
            size="small"
            disabled={minMaxError}
            color="primary"
            style={{ height: "30px", margin: "15px 5px 10px 5px",fontSize:"10px" }}
          >
            Apply
          </Button>
        </div>
        <p style={{marginLeft: "30px"}} >Peak Latency</p>

        {/* <div
          style={{
            display: "flex",
            flexDirection: "column",
            // justifyContent: "center",
            // marginBottom: "10px",
            marginLeft: "130px"
          }}
        >
          <label
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
              marginLeft: "50px",
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
          </Select>
        </div> */}

      </div>
      <div
        data-theme={theme.palette.mode}
        style={{ height: "calc(40vh - 30px)", width: chartWidth, marginTop: "-30px" }}
      >
        {loading ? (<div
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
        </div>) : emptyMessage ? (<div style={{ display: 'flex', justifyContent: 'center', alignItems: "center", height: "calc(30vh - 25px)" }}>
          <Typography variant="h5" fontWeight={"600"}>
            PeakLatency Count Chart - No data
          </Typography>
        </div>) : errorMessage ? (<div style={{ display: 'flex', justifyContent: 'center', alignItems: "center", height: "calc(30vh - 25px)" }}>
          <Typography variant="h5" fontWeight={"600"}>
            Error Occurred
          </Typography>
        </div>) : (<ReactApexChart
          style={{
            color: theme.palette.mode === "light" ? "#000" : "#000",
          }}
          options={options}
          series={series}
          type="bar"
          height={"80%"}
          width={"100%"}
        />)}
      </div>
    </>
  );
};

export default DBCallsCount;
