import React from "react";
import ReactApexChart from "react-apexcharts";
import { tokens } from "../../../../theme";
import { useTheme } from "@emotion/react";
import { useContext } from "react";
import { GlobalContext } from "../../../../global/globalContext/GlobalContext";

const ApiCallCount = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { isCollapsed } = useContext(GlobalContext);

  const apiCallsOptions = {
    chart: {
      height: 250,
      type: "bar",
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
      categories: data.map((item) => item.serviceName),
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
        text: "Count",
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
          fontSize: 10,
          fontWeight: 500,
          fontFamily: "Red Hat Display",
        },
      },
    },
    title: {
      text: "API Counts",
      align: "middle",
      offsetX: 0,
      offsetY: 10,
      style: {
        color: colors.textColor[500],
        fontSize: 16,
        fontWeight: 500,
        fontFamily: "Red Hat Display",
      },
    },
    labels: {
      style: {
        colors: theme.palette.mode === "dark" ? "#FFF" : "#000",
      },
    },
    scrollbar: {
      enabled: true,
      offsetY: -2,
      height: 6,
      trackBorderWidth: 5,
      thumbBorderWidth: 0,
    },
  };

  const apiCallsSeries = [
    {
      name: "API Count",
      data: data.map((item) => item.apiCallCount),
    },
  ];

  const chartWidth = isCollapsed ? 'calc(100% - 20px)' : 'calc(103% - 20px)'

  return (
    <div data-theme={theme.palette.mode} style={{height:"calc(40vh - 20px)",width:chartWidth}} >
      <ReactApexChart
      style={{
        color: "#000",
      }}
        options={apiCallsOptions}
        series={apiCallsSeries}
        type="bar"
        height={"90%"}
        width={"100%"}
      />
    </div>
  );
};

export default ApiCallCount;
