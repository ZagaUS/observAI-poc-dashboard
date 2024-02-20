import SideNavbar from "./global/SideNavbar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Route, Routes } from "react-router";
import LoginPage from "./scenes/auth/Login";
import Topbar from "./global/Topbar";
import { GlobalContextProvider } from "./global/globalContext/GlobalContext";
import Traces from "./scenes/traces";
import Metrics from "./scenes/metrics";
import Logs from "./scenes/logs";
import TraceSummaryChart from "./scenes/dashboard/summary/TraceSummaryChart";
import LogSummaryChart from "./scenes/dashboard/summary/LogSummaryChart";
import DashboardTopBar from "./scenes/dashboard/DashboardTopBar";
import DbSummaryCharts from "./scenes/dashboard/summary/DbSummaryCharts";
import KafkaSummaryChart from "./scenes/dashboard/summary/KafkaSummaryChart";
import PodDashboardCharts from "./scenes/dashboard/sustainability/PodDashboardCharts";
import NodeDashboardCharts from "./scenes/dashboard/sustainability/NodeDashboardCharts";
import HostDashboardCharts from "./scenes/dashboard/sustainability/HostDashboardCharts";
import LandingPage from "./global/LandingPage";
import PrivateRouter from "./global/PrivateRouter";
import AdminMainPage from "./scenes/admin/AdminMainPage";
import AddCluster from "./scenes/admin/AddCluster";
import ClusterInfo from "./scenes/admin/ClusterInfo";
import AddRules from "./scenes/admin/AddRules";
import RulesDetails from "./scenes/admin/RulesDetails";
import CllusterDashboard from "./scenes/admin/CllusterDashboard";
import AdminTopBar from "./scenes/admin/AdminTopbar";
import PodCpuMetric from "./scenes/Infra/PodCpuMetric";
import { PodMemoryMetric } from "./scenes/Infra/PodMemoryMetric";
import NodeCpuMetric from "./scenes/Infra/NodeCpuMetric";
import NodeMemoryMetric from "./scenes/Infra/NodeMemoryMetric";
import Status from "./scenes/Infra/InfraInformations/Status";
import Alerts from "./scenes/Infra/InfraInformations/Alerts";
import Events from "./scenes/Infra/InfraInformations/Events";
import CpuUtilization from "./scenes/Infra/InfraInformations/CpuUtilization";
// import { useTokenExpirationCheck } from "./global/TokenExpiry";

function App() {
  const [theme, colorMode] = useMode();
  // const checkTokenExpiration = useTokenExpirationCheck();

  // useEffect(() => {
  //   checkTokenExpiration();
  // }, [checkTokenExpiration]);

  // const navigate = useNavigate();

  // useEffect(() => {
  //   const checkTokenExpiration = () => {
  //     const accessToken = localStorage.getItem("accessToken");
  //     if (accessToken) {
  //       const isExpired = isTokenExpired(accessToken);
  //       console.log("is EXPIRED---------------------------- " + isExpired);
  //       if (isExpired) {
  //         navigate("/login");
  //       } else {
  //         // Token is valid, continue with the navigation
  //         const isLogout = localStorage.getItem("loggedOut");
  //         console.log("Logout " + isLogout);
  //         if (isLogout === null && window.location.pathname === "/") {
  //           navigate("/");
  //         }
  //       }
  //     }
  //   };

  //   checkTokenExpiration();

  // }, [navigate]);

  const DashboardSection = () => {
    return (
      <div>
        <Routes>
          <Route index element={<TraceSummaryChart />} />
          <Route path="logSummary" element={<LogSummaryChart />} />
          <Route path="dbSummary" element={<DbSummaryCharts />} />
          <Route path="kafkaSummary" element={<KafkaSummaryChart />} />
        </Routes>
      </div>
    );
  };

  const SustainabilitySection = () => {
    return (
      <Routes>
        <Route index element={<PodDashboardCharts />} />
        <Route path="node" element={<NodeDashboardCharts />} />
        <Route path="host" element={<HostDashboardCharts />} />
      </Routes>
    );
  };

  const ApmSection = () => {
    return (
      <Routes>
        <Route index element={<Traces />} />
        <Route path="metrics" element={<Metrics />} />
        <Route path="logs" element={<Logs />} />
      </Routes>
    );
  };

  const ClusterAndRulesSection = () => {
    return (
      <div>
        <CllusterDashboard />
        <Routes>
          <Route index element={<ClusterInfo />} />
          <Route path="rulesInfo" element={<RulesDetails />} />
        </Routes>
      </div>
    );
  };

  const InfrastructurePodDetailsSection = () => {
    return (
      <Routes>
        <Route index element={<PodCpuMetric />} />
        <Route path="podMemory" element={<PodMemoryMetric />} />
      </Routes>
    );
  };

  const InfrastructureNodeDetailsSection = () => {
    return (
      <Routes>
        <Route index element={<NodeCpuMetric />} />
        <Route path="nodeMemory" element={<NodeMemoryMetric />} />
      </Routes>
    );
  };

  const InfrastructureInformations = () => {
    return (
      <Routes>
        <Route index element={<Status />} />
        <Route path="cpuUtilization" element={<CpuUtilization />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="events" element={<Events />} />
      </Routes>
    );
  };

  const AdminSection = () => {
    return (
      <div>
        <AdminTopBar />
        <Routes>
          <Route path="adminMainpage" element={<AdminMainPage />} />
          <Route path="addCluster" element={<AddCluster />} />
          <Route path="addRules" element={<AddRules />} />
          <Route
            path="clusterDashboard/*"
            element={<ClusterAndRulesSection />}
          />
        </Routes>
      </div>
    );
  };

  const MainPage = () => {
    return (
      <div className="app">
        <SideNavbar />
        <main className="content">
          <Topbar />
          <DashboardTopBar />
          <Routes>
            <Route path="dashboard/*" element={<DashboardSection />} />
            <Route
              path="sustainability/*"
              element={<SustainabilitySection />}
            />
            <Route path="apm/*" element={<ApmSection />} />
            <Route
              path="infraInfo/*"
              element={<InfrastructureInformations />}
            />
            <Route
              path="infraNode/*"
              element={<InfrastructureNodeDetailsSection />}
            />
            <Route
              path="infraPod/*"
              element={<InfrastructurePodDetailsSection />}
            />
          </Routes>
        </main>
      </div>
    );
  };

  return (
    <GlobalContextProvider>
      <ThemeProvider theme={theme}>
        <ColorModeContext.Provider value={colorMode}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            {/* Nested routes for /mainpage/* */}
            <Route path="/mainpage/*" element={<MainPage />} />
            <Route path="/notAuth" element={<PrivateRouter />} />
            <Route path="/admin/*" element={<AdminSection />} />
          </Routes>
          {/* {localStorage.getItem("userInfo") !== null ? (<div className="app">
            <SideNavbar />
            <main className="content">
              <Topbar />
              <DashboardTopBar />
              <Routes>
                <Route path="/dashboard/*">
                  <Route index element={<TraceSummaryChart />} />
                  <Route path="logSummary" element={<LogSummaryChart />} />
                  <Route path="dbSummary" element={<DbSummaryCharts />} />
                  <Route path="kafkaSummary" element={<KafkaSummaryChart />} />
                  <Route path="keplerDashboard" element={<KeplerPowerMetrics />} />
                </Route>
                <Route path="/traces" element={<Traces />} />
                <Route path="/metrics" element={<Metrics />} />
                <Route path="/logs" element={<Logs />} />
              </Routes>
            </main>
          </div>) : null} */}
        </ColorModeContext.Provider>
      </ThemeProvider>
    </GlobalContextProvider>
  );
}
export default App;
