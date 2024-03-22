// import { Paper, Table, TableBody, TableContainer, TableHead, TableRow, useTheme, styled, Typography, } from '@mui/material'
// import TableCell, { tableCellClasses } from "@mui/material/TableCell";
// import React from 'react'
// import { tokens } from '../../../theme';

// const EventsDialog = ({ rowData }) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   console.log("AllEvents", rowData)

//   const StyledTableCell = styled(TableCell)(() => ({
//     [`&.${tableCellClasses.head}`]: {
//       backgroundColor: colors.primary[400],
//       color: theme.palette.common.black,
//     },
//     [`&.${tableCellClasses.body}`]: {
//       fontSize: 14,
//     },
//   }));

//   return (
//     <div style={{ margin: "10px" }}>
//       <TableContainer sx={{ overflow: "auto", maxWidth: "300px" }} component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//             <StyledTableCell>
//                               <Typography
//                                 variant="h5"
//                                 style={{
//                                   fontWeight: "700",
//                                   padding: "5px",
//                                   whiteSpace: "nowrap",
//                                   overflow: "hidden",
//                                   color: "#fff",
//                                 }}
//                               >
//                                 Field
//                               </Typography>
//                             </StyledTableCell>

//                             <StyledTableCell>
//                               <Typography
//                                 variant="h5"
//                                 style={{
//                                   fontWeight: "700",
//                                   padding: "5px",
//                                   whiteSpace: "nowrap",
//                                   overflow: "hidden",
//                                   color: "#fff",
//                                 }}
//                               >
//                                 Value
//                               </Typography>
//                             </StyledTableCell>
//             </TableRow>
//           </TableHead>

//           {rowData.map((event) => (
//             <TableBody>
//               <TableRow>
//                 <TableCell>Severity Text</TableCell>
//                 <TableCell>{event.SeverityText}</TableCell>
//               </TableRow>

//               <TableRow>
//                 <TableCell>Resource</TableCell>
//                 <TableCell>{event.Resource}</TableCell>
//               </TableRow>

//               <TableRow>
//                 <TableCell>Resource Name</TableCell>
//                 <TableCell>{event.ResourceName}</TableCell>
//               </TableRow>

//               <TableRow>
//                 <TableCell>NameSpace Name</TableCell>
//                 <TableCell>{event.NameSpace}</TableCell>
//               </TableRow>

//               <TableRow>
//                 <TableCell>Event Message</TableCell>
//                 <TableCell>{event.Message}</TableCell>
//               </TableRow>

//               <TableRow>
//                 <TableCell>Created Time</TableCell>
//                 <TableCell>{event.CreatedTime}</TableCell>
//               </TableRow>
//             </TableBody>
//           ))}
//         </Table>
//       </TableContainer>
//     </div>
//   )
// }

// export default EventsDialog
