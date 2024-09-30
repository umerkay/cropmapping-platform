import React, { useEffect } from "react";
import "./App.css";
import MapComponent from "./Components/Map";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  const [mode, setMode] = React.useState(localStorage.getItem("mode") || "dark");

  useEffect(() => {
    localStorage.setItem("mode", mode
    );
  }, [mode]);

  return (
    <div className={"App " 
      + (mode === "dark" ? "dark" : "light")
    }>
      <MapComponent
        mode={mode}
        setMode={setMode}
      />
      <ToastContainer/>
    </div>
  );
}

export default App;