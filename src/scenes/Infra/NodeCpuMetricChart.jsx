import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import React, { useContext } from 'react'
import ReactApexChart from 'react-apexcharts';
import { tokens } from '../../theme';
import { GlobalContext } from '../../global/globalContext/GlobalContext';

const NodeCpuMetricChart = ({ nodeMetrics }) => {
    const theme = useTheme();
    const { isCollapsed } = useContext(GlobalContext);

    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
    const isLandscape = useMediaQuery(
        "(max-width: 1000px) and (orientation: landscape)"
    );

    const isiphone = useMediaQuery((theme) => theme.breakpoints.down("iphone"));

    console.log("node metrics", nodeMetrics)

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
                text: nodeMetrics.yaxis,
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

    const series = [
        {
            name: 'CPU Usage',
            // data: nodeMetrics.data,
            data: Array.isArray(nodeMetrics.data) ? nodeMetrics.data : [],
            // data: nodeMetrics.map(item => ({ x: item.date, y: item.cpuUsage })),
            // data: nodeMetrics.map(item => [item.date, item.memoryUsage]),
            color: "#C40233",
        },
        // {
        //     name: 'Memory Usage',
        //     data: nodeMetrics.map(item => [item.date, item.memoryUsage]),
        //     color: "#C40233",
        // }
    ];

    const chartWidth = isCollapsed ? 'calc(120% - 10px)' : 'calc(130% - 70px)'

    const chartHeight = (isLandscape && isSmallScreen) ? "145%" : (isiphone ? "125%" : "88%");

  return (
    <div>
        <Box height="calc(75vh - 30px)" width={chartWidth} padding="5px" border="1px" style={{
            transition: "width 0.3s ease-in-out",
        }}>
            <div style={{ display: "flex", justifyContent: "flex-start"}}>
                <p style={{ marginTop:"0px" }} >{nodeMetrics.title}</p>
            </div>
            <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={chartHeight}
                // width={isCollapsed?1000:900}
                width={"100%"}
            />
        </Box>
    </div>
  )
}

export default NodeCpuMetricChart
