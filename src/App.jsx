import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import MapComponent from "./Components/Map";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Dashboard from "./MUIPages/dashboard/Dashboard";
import MarketingPage from "./MUIPages/marketing-page/MarketingPage";
import SignInSide from "./MUIPages/sign-in-side/SignInSide";

function App() {
  const [mode, setMode] = React.useState(localStorage.getItem("mode") || "dark");
  const [authenticated, setAuthenticated] = React.useState(true); // Static authenticated state

  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  return (
    <div className={"App " + (mode === "dark" ? "dark" : "light")}>
      <Router>
        <Routes>
          <Route path="/" element={<MarketingPage />} />
          <Route path="/signin" element={<SignInSide />} />
          <Route path="/dashboard" element={authenticated ? <Dashboard /> : <Navigate to="/signin" />} />
          <Route path="/map" element={authenticated ? <MapComponent mode={mode} setMode={setMode} /> : <Navigate to="/signin" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;