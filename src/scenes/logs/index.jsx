import { Box, useMediaQuery } from '@mui/material'
import React from 'react'
import Loglists from './Loglists'

const Logs = () => {
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
    const isLandscape = useMediaQuery("(max-width: 1000px) and (orientation: landscape)");

    return (
        <div style={{ overflowY: isSmallScreen ? "" : "auto", height: isSmallScreen ? "calc(40% - 10px)" : "calc(77% - 10px)" }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "normal", margin: "20px" }}>
                <Loglists />
            </Box>
        </div>
    )
}

export default Logs