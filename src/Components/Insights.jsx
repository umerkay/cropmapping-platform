import { BrainCircuit, Info } from "lucide-react";
import React from "react";

const cropColors = {
    "Natural": "#FFC0CB", // Pink
    "Forest": "#90EE90", // Light green
    "Corn": "#FFFF00", // Yellow
    "Soybeans": "#006400", // Dark green
    "Wetlands": "#66CDAA", // Medium aquamarine
    "Developed/Barren": "#808080", // Gray
    "Open Water": "#4682B4", // Steel blue
    "Wheat": "#8B4513", // Saddle brown
    "Alfalfa": "#FFC0CB", // Light pink
    "Fallow/Idle": "#BDB76B", // Dark khaki
    "Cotton": "#FF0000", // Red
    "Sorghum": "#FFA500", // Orange
    "Other": "#00CED1"  // Dark turquoise
};

function Insights() {
    return (
        <div className="insights">
            <div className="title">
                <Info />
                <h3>Insights</h3>
            </div>
            <div className="content">
                <h3>Crop Type Key</h3>
                <div className="cropKeys">
                    {
                        Object.keys(cropColors).map((crop, i) => (
                            <div key={i} className="crop">
                                <div className="color" style={{ backgroundColor: cropColors[crop] }}></div>
                                <p>{crop}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default Insights;