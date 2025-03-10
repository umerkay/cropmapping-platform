import * as React from "react";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "./components/AppNavbar";
import Header from "./components/Header";
import MainGrid from "./components/MainGrid";
import AppTheme from "../shared-theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "./theme/customizations";
import { useLocation, Link } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";
import InsightsIcon from "@mui/icons-material/Insights";
import DownloadIcon from "@mui/icons-material/Download";
import AiIcon from "@mui/icons-material/Assistant";
import Logo from "./components/Logo"; // Assuming you have a Logo component
import ListItemButton from "@mui/material/ListItemButton";
import DashboardMap from "./components/DashboardMap";
import DistrictView from "./views/DistrictView";
import ProvinceView from "./views/ProvinceView";
import AIExplain from "./views/AIExplain";
import Insights from './views/Insights';
import { PolygonsProvider } from "../../Context/PolygonsContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Download from "./views/DownloadC";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const menuItems = [
  // { text: "Overview", icon: <HomeIcon />, path: "Overview" },
  { text: "Insights", icon: <InsightsIcon />, path: "Insights" },
  { text: "District View", icon: <MapIcon />, path: "District" },
  { text: "Province View", icon: <MapIcon />, path: "Province" },
  { text: "Download", icon: <DownloadIcon />, path: "Download" },
  { text: "Zarai Rehnuma (AI)", icon: <AiIcon />, path: "AgroAI" },
];

export default function Dashboard(props) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const view = params.get("view") || "Insights";
  const [appendMessage, setAppendMessage] = React.useState("");

  const renderContent = () => {
    switch (view) {
      case "District":
        return <DistrictView setAppendMessage={setAppendMessage} />;
      case "Province":
        return <ProvinceView setAppendMessage={setAppendMessage} />;
      case "Insights":
        return <Insights />;
      case "Download":
        return <Download />;
      case "AgroAI":
        return <AIExplain />;
      default:
        return <Overview />;
    }
  };

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <PolygonsProvider>
        <Box sx={{ display: "flex", height: "100vh" }}>
          {<SideMenu selectedPath={view}/>}
          <AppNavbar view={view} />
          {/* Main content */}
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: theme.vars
                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                : alpha(theme.palette.background.default, 1),
              overflow: "auto",
            })}
          >
            <Stack
              spacing={2}
              sx={{
                alignItems: "center",
                mx: 3,
                pb: 5,
                mt: { xs: 8, md: 0 },
              }}
            >
              <Header view={view} appendMessage={appendMessage}/>
              {renderContent()}
            </Stack>
          </Box>
        </Box>
      </PolygonsProvider>
    </AppTheme>
  );
}

function SideMenu({selectedPath}) {

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const theme = useTheme();
  const mode = theme.palette.mode;

  if (isMobile) {
    return null;
  }

  return (
    <Box sx={{ width: 250, bgcolor: "background.paper", display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'space-between' }}>
      <div>
        <Logo />
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              component={Link}
              to={`/dashboard?view=${item.path}`}
              selected={item.path === selectedPath}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </div>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <img
          className="machvislogo"
          src={mode === "dark" ? "machvislogo.png" : "machvislogolight.png"}
          alt="logo"
          style={{ width: '100px', marginBottom: '8px' }}
        />
        <Typography variant="body2">Made available by MachVis</Typography>
        <Typography variant="body2">© 2024. All rights reserved.</Typography>
      </Box>
    </Box>
  );
}

// Placeholder components for routing
function Overview() {
  return <DashboardMap mapType="overview" />;
}
