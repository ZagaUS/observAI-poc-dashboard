import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import React, { useContext } from 'react'
import ReactApexChart from 'react-apexcharts';
import { tokens } from '../../../../theme';
import { GlobalContext } from '../../../../global/globalContext/GlobalContext';

const ContainerPowerMetrics = ({ containerPowerMetrics }) => {

    const theme = useTheme();
    const { isCollapsed, keplerCurrentPage, setKeplerCurrentPage, nodeCurrentPage, setNodeCurrentPage } = useContext(GlobalContext);
    const totalPages = containerPowerMetrics.totalCount;

    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
    const isLandscape = useMediaQuery(
        "(max-width: 1000px) and (orientation: landscape)"
    );

    const isiphone = useMediaQuery((theme) => theme.breakpoints.down("iphone"));

    const series = [
        {
            name: containerPowerMetrics.title,
            data: containerPowerMetrics.data,
            color: "#C40233",
        },
    ];

    const handleApplyButtonClick = (increment) => {
        if (containerPowerMetrics.type === "pod") {
            setKeplerCurrentPage((prevPage) => prevPage + increment);
        } else {
            setNodeCurrentPage((prevPage) => prevPage + increment);
        }
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
            // toolbar: {
            //     autoSelected: "zoom",
            // },

            // background: colors.primary[400],
        },

        dataLabels: {
            enabled: false,
        },
        // markers: {
        //   size: 5,
        // },
        title: {
            // text: "CPU UTILIZATION",
            // text: containerPowerMetrics.title,
            align: "middle",
            // offsetY: 10,
            style: {
                color: theme.palette.mode === "dark" ? "#FFF" : "#000",
                fontFamily: "Red Hat Display, sans-serif",
                fontWeight: 500,
            },
        },
        fill: {
            type: "gradient",
            gradient: {
                // shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.5,
                opacityTo: 0,
                stops: [0, 90, 100],
            },
        },
        yaxis: {
            min: 0,
            // max: 5,
            title: {
                // text: "USAGE",
                text: containerPowerMetrics.yaxis,
                style: {
                    color: theme.palette.mode === "dark" ? "#FFF" : "#000",
                    fontFamily: "Red Hat Display, sans-serif",
                    fontWeight: 500,
                },
            },
            // min: minValue,
            // max: maxValue,
            // tickAmount: tickAmount,
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
            // offsetY: 10,
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
            // fillSeriesColor: true,
            // theme: false,
            x: {
                format: "dd MMM yyyy HH:mm:ss", // Format the date/time in the tooltip
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
        // theme: {
        //   mode: theme.palette.mode,
        //   palette: "palette1",
        //   monochrome: {
        //     enabled: false,
        //     // color: theme.palette.mode === "dark" ? "#FFF" : "#255aee",
        //     // shadeTo: theme.palette.mode === "dark" ? "dark" : "light",
        //     // shadeIntensity: 0.65,
        //   },
        // },
    };

    const chartWidth = isCollapsed ? 'calc(70% - 10px)' : 'calc(73% - 70px)'

    const chartHeight = (isLandscape && isSmallScreen) ? "145%" : (isiphone ? "125%" : "88%");

    return (
        <Box height="calc(75vh - 30px)" width={chartWidth} padding="5px" border="1px" style={{
            transition: "width 0.3s ease-in-out",
            // ...(isiphone && {
            //     height: "calc(140vh - 32px)",
            //   }),
            //   ...(istablet && {
            //     height: "calc(50vh - 32px)",
            //   }),
        }}>
            <div style={{ display: "flex", justifyContent: "flex-start"}}>
                <Button
                    variant="contained"
                    onClick={() => handleApplyButtonClick(-1)} // Navigate to previous page
                    disabled={containerPowerMetrics.type === "pod" ? (keplerCurrentPage === 1) : (nodeCurrentPage === 1)} // Disable if on the first page
                    size="small"
                    color="primary"
                    style={{
                        height: "25px",
                        margin: "0px 5px 0px 30px",
                        fontSize: "10px",
                    }}
                >
                    Previous
                </Button>
                <Button
                    variant="contained"
                    onClick={() => handleApplyButtonClick(1)} // Navigate to next page
                    disabled={containerPowerMetrics.type === "pod" ? (keplerCurrentPage === totalPages) : (nodeCurrentPage === totalPages)} // Disable if on the last page
                    size="small"
                    color="primary"
                    style={{
                        height: "25px",
                        margin: "0px 5px 0px 5px",
                        fontSize: "10px",
                    }}
                >
                    Next
                </Button>
                {containerPowerMetrics.type === "pod" ? (<p style={{ marginTop:"0px" }} className='chart-title'>{containerPowerMetrics.title}</p>) : <p style={{ marginTop:"0px"}} className='chart-title'>{containerPowerMetrics.title}</p>}
            </div>
            <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={chartHeight}
                // width={isCollapsed?1380:1210}
                width={"100%"}
            />
        </Box>
    );
}

export default ContainerPowerMetrics