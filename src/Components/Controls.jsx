import { DarkModeSwitch } from 'react-toggle-dark-mode';
import React, { useState } from "react";

function Controls({ polygons, onPolygonSelect, setMode }) {
    const [selected, setSelected] = useState({
        timestamp: "",
        showMap: true
    });

    const mode = "dark"; // mode is always dark

    // Sort the districts alphabetically by the district name
    const sortedPolygons = polygons.sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="controls">
            <div className="title">
                <DarkModeSwitch
                    checked={mode === "dark"}
                    onChange={() => setMode(mode === "dark" ? "light" : "dark")}
                />
                <h3>AgroData PK</h3>
            </div>
            <div className="content">
                <h3>Select District</h3>
                <select onChange={(e) => onPolygonSelect(e.target.value)}>
                    <option value="">Select a district</option>
                    {sortedPolygons.map((polygon, index) => (
                        <option key={index} value={polygon.id}>
                            {polygon.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="footer">
                <img className="machvislogo" src={mode === "dark" ? "machvislogo.png" : "machvislogolight.png"} alt="logo" />
                <p>Made available by MachVis</p>
                <p>© 2024. All rights reserved.</p>
            </div>
        </div>
    );
}

export default Controls;
