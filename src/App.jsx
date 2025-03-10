import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import MapComponent from "./Components/Map";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Dashboard from "./MUIPages/dashboard/Dashboard";
import MarketingPage from "./MUIPages/marketing-page/MarketingPage";
import SignInSide from "./MUIPages/sign-in-side/SignInSide";
import { useColorScheme } from '@mui/material/styles';
import { LoadScript } from "@react-google-maps/api";
import SignUpSide from "./MUIPages/sign-up-side/SignUpSide";

function App() {
  const { mode, setMode } = useColorScheme();
  const [authenticated, setAuthenticated] = React.useState(true); // Static authenticated state

  // useEffect(() => {
  //   localStorage.setItem("mode", mode);
  // }, [mode]);

  return (
    <div className={"App " + (mode === "dark" ? "dark" : "light")}>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS}>

      <Router>
        <Routes>
          <Route path="/" element={<MarketingPage />} />
          <Route path="/signin" element={<SignInSide />} />
          <Route path="/signup" element={<SignUpSide />} />
          <Route path="/dashboard" element={authenticated ? <Dashboard /> : <Navigate to="/signin" />} />
          <Route path="/map" element={authenticated ? <MapComponent mode={mode} setMode={setMode} /> : <Navigate to="/signin" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <ToastContainer />
      </LoadScript>
    </div>
  );
}

export default App;