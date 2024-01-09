import React, { createContext, useState } from "react";
import { options } from "../MockData/MockTraces";
import { format } from "date-fns";

const GlobalContext = createContext();

const GlobalContextProvider = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isCardVisible, setIsCardVisible] = useState(false)
    const [selected, setSelected] = useState(localStorage.getItem("routeName"));
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedTrace, setSelectedTrace] = useState({});
    const [selectedSpan, setSelectedSpan] = useState({ attributes: [] });
    const [traceData, setTraceData] = useState([]);


    const [openDrawer, setOpenDrawer] = useState(false);

    const defaultValue = 120;
    const defaultLabel = options.find((option) => option.value === defaultValue);
    const [lookBackVal, setLookBackVal] = useState(defaultLabel);
    const [needFilterCall, setNeedFilterCall] = useState(false);
    const [filterApiBody, setFilterApiBody] = useState({});
    const [traceGlobalEmpty, setTraceGlobalEmpty] = useState(null);
    const [traceGlobalError, setTraceGlobalError] = useState(null);
    const [traceLoading, setTraceLoading] = useState(false);
    const [recentTrace, setRecentTrace] = useState([]);
    const [traceToLogError, setTraceToLogError] = useState("");
    const [globalLogData, setGlobalLogData] = useState([]);
    const [serviceList, setServiceList] = useState([]);
    const [dashboardPage, setDashboardPage] = useState(1);
    const [dashboardPageCount, setDashboardPageCount] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const [logTrace, setLogTrace] = useState([]);

    const [logFilterApiBody, setLogFilterApiBody] = useState({});
    const [needLogFilterCall, setNeedLogFilterCall] = useState(false);
    const [MetricFilterApiBody, setMetricFilterApiBody] = useState({});
    const [needMetricFilterCall, setNeedMetricFilterCall] = useState(false)
    const [recentLogData, setRecentLogData] = useState([]);
    const [traceRender, setTraceRender] = useState(false);
    const [logRender, setLogRender] = useState(false);
    const [metricRender, setMetricRender] = useState(false);
    const [selectedTraceService, setSelectedTraceService] = useState([]);
    const [traceSummaryService, setTraceSummaryService] = useState([]);
    const [logSummaryService, setLogSummaryService] = useState([]);
    const [clearTraceFilter, setClearTraceFilter] = useState(false);
    const [clearLogFilter, setClearLogFilter] = useState(false);
    const [clearMetricFilter, setclearMetricFilter] = useState(false);
    const services = JSON.parse(localStorage.getItem("serviceListData"));
    const [selectedService, setSelectedService] = useState((services && services.length > 0) ? [services[0]] : []);
    const formattedDate = format(new Date(), 'yyyy-MM-dd');
    const [selectedStartDate, setSelectedStartDate] = useState(formattedDate);
    const [selectedEndDate, setSelectedEndDate] = useState(formattedDate);
    const [needHistoricalData, setNeedHistoricalData] = useState(false);
    const [selectedLogService, setSelectedLogService] = useState([]);
    const [traceDisplayService, setTraceDisplayService] = useState([]);
    const [showError, setShowError] = useState(false);
    const [erroredLogData, setErroredLogData] = useState([]);
    const [navActiveTab, setNavActiveTab] = useState(0);
    const [DbSummaryService, setDbSummaryService] = useState([]);

    const [traceSelectedService, setTraceSelectedService] = useState([]);
    const [minDurationValue, setMinDurationValue] = useState(0);
    const [maxDurationValue, setMaxDurationValue] = useState(10000);
    const [minMaxError, setMinMaxError] = useState("");
    const [selectedHttpMethod, setSelectedHttpMethod] = useState([]);
    const [selectedHttpCode, setSelectedHttpCode] = useState([]);

    const [logSelectedService, setLogSelectedService] = useState([]);
    const [selectedSeverity, setSelectedSeverity] = useState([]);

    const [keplerActiveTab, setKeplerActiveTab] = useState(0);
    const [apmActiveTab, setApmActiveTab] = useState(0);
    const [keplerCurrentPage, setKeplerCurrentPage] = useState(1);
    const [nodeCurrentPage, setNodeCurrentPage] = useState(1);
    const [notificationCount, setNotificationCount] = useState(0);
    const [alertResponse, setAlertResponse] = useState({
        metric: [],
        trace: [],
        log: []
    });

    const [searchQuery, setSearchQuery] = useState("");

    return (
        <GlobalContext.Provider
            value={{
                isCollapsed,
                setIsCollapsed,
                isCardVisible,
                setIsCardVisible,
                selected,
                setSelected,
                selectedOptions,
                setSelectedOptions,
                selectedTrace,
                setSelectedTrace,
                selectedSpan,
                setSelectedSpan,
                traceData,
                setTraceData,
                lookBackVal,
                setLookBackVal,
                needFilterCall,
                setNeedFilterCall,
                filterApiBody,
                setFilterApiBody,
                traceGlobalEmpty,
                setTraceGlobalEmpty,
                traceGlobalError,
                setTraceGlobalError,
                traceLoading,
                setTraceLoading,
                recentTrace,
                setRecentTrace,
                traceToLogError,
                setTraceToLogError,
                globalLogData,
                setGlobalLogData,
                serviceList,
                setServiceList,
                dashboardPage,
                setDashboardPage,
                dashboardPageCount,
                setDashboardPageCount,
                activeTab,
                setActiveTab,
                logFilterApiBody,
                setLogFilterApiBody,
                MetricFilterApiBody,
                setMetricFilterApiBody,
                needLogFilterCall,
                setNeedLogFilterCall,
                needMetricFilterCall,
                setNeedMetricFilterCall,
                recentLogData,
                setRecentLogData,
                searchQuery,
                setSearchQuery,
                logTrace,
                setLogTrace,
                setTraceRender,
                traceRender,
                logRender,
                setLogRender,
                metricRender,
                setMetricRender,
                selectedTraceService,
                setSelectedTraceService,
                traceSummaryService,
                setTraceSummaryService,
                logSummaryService,
                setLogSummaryService,
                clearTraceFilter,
                setClearTraceFilter,
                clearLogFilter,
                setClearLogFilter,
                clearMetricFilter,
                setclearMetricFilter,
                selectedService,
                setSelectedService,
                selectedStartDate,
                setSelectedStartDate,
                selectedEndDate,
                setSelectedEndDate,
                needHistoricalData,
                setNeedHistoricalData,
                selectedLogService,
                setSelectedLogService,
                traceDisplayService,
                setTraceDisplayService,
                showError,
                setShowError,
                erroredLogData,
                setErroredLogData,
                navActiveTab,
                setNavActiveTab,
                DbSummaryService,
                setDbSummaryService,
                setTraceSelectedService,
                traceSelectedService,
                minDurationValue,
                setMinDurationValue,
                maxDurationValue,
                setMaxDurationValue,
                selectedHttpCode,
                setSelectedHttpCode,
                selectedHttpMethod,
                setSelectedHttpMethod,
                logSelectedService,
                setLogSelectedService,
                selectedSeverity,
                setSelectedSeverity,
                minMaxError,
                setMinMaxError,
                openDrawer,
                setOpenDrawer,
                keplerActiveTab,
                setKeplerActiveTab,
                apmActiveTab,
                setApmActiveTab,
                keplerCurrentPage,
                setKeplerCurrentPage,
                nodeCurrentPage,
                setNodeCurrentPage,
                notificationCount,
                setNotificationCount,
                alertResponse,
                setAlertResponse
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export { GlobalContext, GlobalContextProvider };
