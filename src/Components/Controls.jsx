import { Download, Map, RectangleHorizontalIcon, Stars } from "lucide-react";
import React from "react";

function Controls({ rectangleBounds, resetRect }) {
    return (
        <div className="controls">
            <div className="title">
                <h3>AgriData PK</h3>
            </div>
            <div className="content">
                <h3>Crop Map</h3>
                <label htmlFor="month" className="label">Select Month:</label>
                <select name="month" id="month">
                    <option value="january">January</option>
                    <option value="february">February</option>
                    <option value="march">March</option>
                    <option value="april">April</option>
                    <option value="may">May</option>
                    <option value="june">June</option>
                    <option value="july">July</option>
                    <option value="august">August</option>
                    <option value="september">September</option>
                    <option value="october">October</option>
                    <option value="november">November</option>
                    <option value="december">December</option>
                </select>
                
                <label htmlFor="year" className="label">Select Year:</label>
                <select name="year" id="year">
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                </select>
                <button>
                    <Map />
                    Load Map</button>
                <button>
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
                <img className="machvislogo" src="machvislogo.png" alt="logo" />
                <p>Made available by MachVis</p>
                <p>© 2024. All rights reserved.</p>
            </div>
        </div>
    );
}

export default Controls;