import { Check, Download, Map, RectangleHorizontalIcon, Stars, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getTileInfo, getTimestamps } from "../Services/TileService";
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import ToggleControl from "./ToggleControl";

function Controls({ mousePosition, rectangleBounds, resetRect, setTiles, mode, setMode, setMetaData }) {

    const [timestamps, setTimestamps] = useState([]);

    const [selected, setSelected] = useState({
        timestamp: "",
        month: "",
        year: "",
        showMap: true
    });

    useEffect(() => {
        const fetchTimestamps = async () => {
            const timestamps = await getTimestamps();
            setTimestamps(timestamps);
        };

        fetchTimestamps();
    }, []);

    const fetchTiles = async () => {
        const data = await getTileInfo(selected.timestamp);
        setTiles(data.tiles);
        setMetaData(
            {
                name: data.name,
                description: data.description,
                model: data.model,
                source: data.source
            }
        )
    };

    useEffect(() => {
        setTiles([]);
        setMetaData({});
    }, [selected.timestamp]);

    const select = (e) => {
        setSelected(
            {
                ...selected,
                [e.target.name]: e.target.value
            }
        )
    }

    useEffect(() => {
        setMetaData(
            (prev) => {
                return {
                    ...prev,
                    showMap: selected.showMap
                }
            }
        )
    }, [selected.showMap]);


    return (
        <div className="controls">
            <div className="title">
                <DarkModeSwitch
                    checked={mode === "dark"}
                    onChange={() => setMode(mode === "dark" ? "light" : "dark")}
                />
                <h3>AgriData PK</h3>
            </div>
            <div className="content">
                <p>
                    Lat: {mousePosition.lat.toFixed(4)}, Lng: {mousePosition.lng.toFixed(4)}
                </p>
                <h3>Load</h3>
                <label htmlFor="timestamp" className="label">Available Maps:</label>
                <select name="timestamp" id="timestamp" onChange={select}>
                    <option value="">Select</option>
                    {
                        timestamps.map((timestamp, i) => (
                            <option key={i} value={timestamp}>{timestamp}</option>
                        ))
                    }
                </select>
                <button
                    onClick={fetchTiles}
                    disabled={!selected.timestamp}
                >
                    <Map />
                    Load Map
                </button>
                {
                    true &&
                    (
                        <ToggleControl
                            label="Show Overlay"
                            value={selected.showMap}
                            toggle={(e) => setSelected({ ...selected, showMap: !selected.showMap })}
                        />
                    )
                }
                <h3>Generate</h3>
                <label htmlFor="month" className="label">Select Month:</label>
                <select name="month" id="month" onChange={select}>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
                <label htmlFor="year" className="label">Select Year:</label>
                <select name="year" id="year" onChange={select}>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                </select>

                <button
                    disabled={true}
                >
                    <Stars />
                    Generate Map</button>
                {
                    rectangleBounds ? (<>
                        <h3>Bounding Box</h3>

                        <div className="bounds" style={{ textAlign: "left" }}>
                            <p>North East: {rectangleBounds?.north}, {rectangleBounds?.east}</p>
                            <p>South West: {rectangleBounds?.south}, {rectangleBounds?.west}</p>
                        </div>
                        <button disabled={!rectangleBounds} onClick={resetRect}>
                            <RectangleHorizontalIcon />
                            Reset Bounds</button>
                        <button disabled={!rectangleBounds}>
                            <Download />
                            Download Labels</button>

                    </>
                    ) : null
                }
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