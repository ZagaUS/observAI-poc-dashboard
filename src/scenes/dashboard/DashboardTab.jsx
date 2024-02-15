import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router";

const DashboardTab = ({ onDashboardOptionSelect }) => {
    const [dashboardMenuAnchor, setDashboardMenuAnchor] = useState(null);
    const navigate = useNavigate();

    const options = [
        { label: "Trace Summary", value: "/mainpage/dashboard" },
        { label: "Log Summary", value: "/mainpage/dashboard/logSummary" },
        { label: "Db Summary", value: "/mainpage/dashboard/dbSummary" },
        { label: "Kafka Summary", value: "/mainpage/dashboard/kafkaSummary" },
    ];

    const handleDashboardTabClick = (event) => {
      setDashboardMenuAnchor(event.currentTarget);
    };

    const handleDashboardOptionSelect = (option) => {
      setDashboardMenuAnchor(null);
      onDashboardOptionSelect(option);
    //   if (option === "Trace Summary") {
    //     navigate("/mainpage/dashboard");
    //   } 
    //   else if (option === "Log Summary") {
    //     navigate("/mainpage/dashboard/logSummary");
    //   } else if (option === "Db Summary") {
    //     navigate("/mainpage/dashboard/dbSummary");
    //   } else if (option === "Kafka Summary") {
    //     navigate("/mainpage/dashboard/kafkaSummary");
    //   }
    };

    return (
      <>
        <IconButton
          onClick={handleDashboardTabClick}
          aria-label="Dashboard"
          style={{ color: "#FFF" }}
        >
          <Typography variant="h7">OBSERVABILITY</Typography>
          <ArrowDropDownIcon />
        </IconButton>
        <Menu
          anchorEl={dashboardMenuAnchor}
          open={Boolean(dashboardMenuAnchor)}
          onClose={() => setDashboardMenuAnchor(null)}
        >
          {/* <MenuItem onClick={() => handleDashboardOptionSelect("dashboard")}>
            Trace Summary
          </MenuItem>
          <MenuItem onClick={() => handleDashboardOptionSelect("logSummary")}>
            Log Summary
          </MenuItem>
          <MenuItem onClick={() => handleDashboardOUnptionSelect("dbSummary")}>
            Db Summary
          </MenuItem>
          <MenuItem onClick={() => handleDashboardOptionSelect("kafkaSummary")}>
            Kafka Summary
          </MenuItem> */}
            {options.map((option, index) => (
                <MenuItem
                key={index}
                onClick={() => handleDashboardOptionSelect(option.label)}
                >
                {option.label}
                </MenuItem>
            ))}
        </Menu>
      </>
    );
  };

export default DashboardTab;
