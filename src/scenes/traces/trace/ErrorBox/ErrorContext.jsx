import { Box, Card, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled, tableCellClasses, useTheme } from '@mui/material';
import React, { useCallback, useContext, useState } from 'react'
import { tokens } from '../../../../theme';
import { errorLogs } from '../../../../global/MockData/OpenErrors';
import "./ErrorContext.css"
import { format } from 'date-fns';
import { GlobalContext } from '../../../../global/globalContext/GlobalContext';
import { useEffect } from 'react';
import Loading from '../../../../global/Loading/Loading';

const ErrorContext = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { erroredLogData, traceLoading } = useContext(GlobalContext);
    const [transformedData, setTransformedData] = useState([]);

    const createTimeInWords = (createdTime) => {
        try {
          const dateObject = new Date(createdTime);
          const formattedTime = format(dateObject, "MMMM dd, yyyy HH:mm:ss a");
          return formattedTime;
        } catch (error) {
          console.error("Invalid time value:", createdTime);
          return "Invalid time";
        }
      };

    const marshellErroredLogs = useCallback(() => {
        // const marshelledData = [];
        // erroredLogData.forEach((log) => {
        //     let logRecord = {
        //         spanId: log.spanId,
        //         severityText: log.severityText,
        //         createdTime: log.createdTime,
        //         name: log.scopeLogs[0].scope.name,
        //         messageBody: log.scopeLogs[0].logRecords[0].body.stringValue,
        //         attributes: [], // Initialize attributes as an array
        //     };

        //     // Combine attributes into an array
        //     if (log.scopeLogs[0].logRecords[0].attributes) {
        //         log.scopeLogs[0].logRecords[0].attributes.forEach((attribute) => {
        //             // Push each attribute to the attributes array
        //             logRecord.attributes.push({
        //                 key: attribute.key,
        //                 value: attribute.value.stringValue,
        //             });
        //         });
        //     }

        //     marshelledData.push(logRecord);
        // });
        // setTransformedData(marshelledData);
        // console.log("TransData " + JSON.stringify(transformedData));

        const groupedData = {};

        erroredLogData.forEach((log) => {
            const spanId = log.spanId;

            // Check if the spanId already exists in the groupedData
            if (!groupedData[spanId]) {
                groupedData[spanId] = {
                    spanId,
                    logs: [],
                };
            }

            const logRecord = {
                severityText: log.severityText,
                createdTime: createTimeInWords(log.createdTime),
                name: log.scopeLogs[0].scope.name,
                messageBody: log.scopeLogs[0].logRecords[0].body.stringValue,
                attributes: [],
            };

            if (log.scopeLogs[0].logRecords[0].attributes) {
                log.scopeLogs[0].logRecords[0].attributes.forEach((attribute) => {
                    logRecord.attributes.push({
                        key: attribute.key,
                        value: attribute.value.stringValue,
                    });
                });
            }

            groupedData[spanId].logs.push(logRecord);
        });

        // Convert the grouped data object into an array of logs
        const marshelledData = Object.values(groupedData);

        setTransformedData(marshelledData);
        console.log("TransData " + JSON.stringify(marshelledData));
    }, [erroredLogData]);


    useEffect(() => {
        marshellErroredLogs();
    }, [marshellErroredLogs])

   
   
    return (
        <>
            {traceLoading ? (
                <Loading />
            ) : (<div style={{ maxHeight: "calc(80vh - 70px)", overflowY: "auto", paddingRight: "10px", marginTop: "10px" }} >
                <div
            style={{
              backgroundColor: colors.primary[400],
              color: "white",
              height: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" fontWeight={500}>
              Error Details
            </Typography>
          </div>
                {transformedData.length > 0 ? (
                   
                   transformedData.map((log, index) => (
                       
                        
                        log.logs.map((record, subIndex) => (

                           
                            <ul key={index}>
                               <h3> <span style={{color: "red" , fontWeight: "500"  }} > Span Id: {log.spanId}</span></h3> 
                                {/* <span> {record.createdTime}</span> */}
                                <div   style={{
                              fontWeight: "500",
                              margin: "0 5px 0 0",

                            }} key={subIndex}>
                                   <h4> <span>component: </span></h4> {record.name}
                                   <h4> <span>Error: </span></h4>
                                    <p> {record.messageBody}</p>
                                <h4> <span>Exception Trace: </span></h4>   
                                {record.attributes.length > 0 ? (

                                        record.attributes.map((attribute, index) => (
                                            <p> {attribute.value}</p> 
                                        ))
                                    ) : null }
                                  
                                </div>
                          </ul>
                           //console.log("out " + JSON.stringify(subIndex))



                            // <Box key={subIndex} >
                            //     <Typography
                            //         variant="h6"
                            //         sx={{
                            //             display: "flex",
                            //             flexDirection: "row",
                            //             justifyContent: "space-between",
                            //             //jey backgroundColor: colors.redAccent[500],
                            //             backgroundColor: "#A92014",
                            //             color: "#FFF",
                            //             padding: "5px",
                            //             borderRadius: "5px",
                            //             marginTop: "10px"
                            //         }}
                            //     >
                            //         <span style={{ fontWeight: "500" }}>SpanId:{log.spanId}</span>
                            //         <span>CreatedTime: {record.createdTime}</span>
                            //     </Typography>
                            //     <TableContainer component={Paper} >
                            //         <Table aria-label="customized table">
                            //             <TableBody>
                            //                 <div style={{ overflowX: 'hidden' }}>
                            //                     <TableRow>
                            //                         <TableCell align='left' style={{ borderBottom:"none" ,width: '20%', fontWeight: "500" }}>
                            //                             Error Component
                            //                         </TableCell>
                            //                         <TableCell align='left' style={{  width: '80%' }}>
                            //                             {record.name}
                            //                         </TableCell>
                            //                     </TableRow>
                            //                     <TableRow>
                            //                         <TableCell align='left' style={{borderBottom:"none" , width: '20%', fontWeight: "500" }}>
                            //                             {/* jey error.message */}
                            //                         </TableCell>
                            //                         <TableCell align='left' style={{ borderBottom:"none" ,width: '80%' }}>
                            //                             {record.messageBody}
                            //                         </TableCell>
                            //                     </TableRow>
                            //                     {record.attributes.length > 0 ? (
                            //                         record.attributes.map((attribute, index) => (
                            //                             <TableRow key={index}>
                            //                                 <TableCell align='left' style={{ borderBottom:"none" , width: '20%', fontWeight: "500" }}>
                            //                                     {/* <div>{attribute.key}</div> */}
                            //                                     <div></div>
                            //                                 </TableCell>
                            //                                 <TableCell align='left' style={{borderBottom:"none" ,  width: '80%' }}>
                            //                                     <div className={attribute.key === "exception.stacktrace" ? "scrollable" : ""}>
                            //                                         {attribute.key === "exception.stacktrace" ? (
                            //                                             <div className="stacktrace">{attribute.value}</div>
                            //                                         ) : (
                            //                                             attribute.value
                            //                                         )}
                            //                                     </div>
                            //                                 </TableCell>
                            //                             </TableRow>
                            //                         ))
                            //                     ) : null}
                            //                 </div>
                            //             </TableBody>
                            //         </Table>
                            //     </TableContainer>
                            // </Box>
                        ))
                    ))
                ) : (<div>
                    <Typography
                        variant="h5"
                        sx={{ textAlign: "center", marginTop: "60%" }}
                    >
                        No Errors to Show!
                    </Typography>
                </div>)}
            </div>)}
        </>
    )
}

export default ErrorContext