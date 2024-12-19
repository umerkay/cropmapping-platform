import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Polygon } from '@react-google-maps/api';
import Controls from './Controls';

const containerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: 30,
    lng: 70,
};

const polygonOptions = {
    fillColor: '#FF0000',
    fillOpacity: 0,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    strokeDasharray: [4, 4] // Makes the border dotted (4px dash, 4px space)
};

function App({ mode, setMode }) {
    const [polygons, setPolygons] = useState([]);
    const [selectedPolygon, setSelectedPolygon] = useState(null);
    const [geojsonData, setGeojsonData] = useState(null);
    const mapRef = useRef(null);

    // Fetch the GeoJSON data and list of polygons
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}api/geojson`)
            .then(response => response.json())
            .then(data => {
                setPolygons(data.polygons);
                setGeojsonData(data.geojson);
            });
    }, []);

    // Handle polygon selection
    const handlePolygonSelect = (polygonId) => {
        const selected = geojsonData.features.find(feature => feature.properties.GID_3 === polygonId);
        console.log(selected.geometry.coordinates);
        setSelectedPolygon(selected);
    };

    const convertCoordinates = (coordinates) => {
        return coordinates[0].map(([lon, lat]) => ({ lat, lng: lon })); // Flip coordinates
    };

    const flattenCoordinates = (coords) => {
        return coords.reduce((acc, val) => {
          if (Array.isArray(val)) {
            // If the array is nested, recursively flatten
            return acc.concat(flattenCoordinates(val)); 
          } else if (Array.isArray(val) && val.length === 2) {
            // If it's a valid coordinate pair, push it to the result
            return acc.concat([val]);
          } else {
            // Otherwise, ignore invalid values
            console.error('Invalid coordinate structure:', val);
            return acc;
          }
        }, []);
      };

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS}>
            <Controls polygons={polygons} onPolygonSelect={handlePolygonSelect} />
            <div id='map'>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={6}
                    onLoad={(map) => { mapRef.current = map; }}
                >
                    {selectedPolygon && (
                        <Polygon
                            paths={convertCoordinates(selectedPolygon.geometry.coordinates)} // Convert coordinates
                            options={polygonOptions}
                        />
                    )}
                </GoogleMap>
            </div>
        </LoadScript>
    );
}

export default App;
