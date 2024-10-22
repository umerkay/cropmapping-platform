import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Rectangle } from '@react-google-maps/api';
import Controls from './Controls';
import Insights from './Insights';
import { getTimestamps } from '../Services/TileService';

const containerStyle = {
    width: '100%',
    height: '100%',
    // borderRadius: '1rem',
    // border: "5px solid rgb(17, 124, 206)"
};

const center = {
    lat: 30,
    lng: 70,
};

const rectangleOptions = {
    fillColor: '#FF0000',
    fillOpacity: 0,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
};

// const imgs = ["/output_image.png"]
// const imageBounds = [{
//     north: 28.021667455423074,  // Top latitude (from conversion)
//     south: 27.034136567742728,  // Bottom latitude (from conversion)
//     east: 69.09840173726721,   // Right longitude (from conversion)
//     west: 67.9823586865616,   // Left longitude (from conversion), 
// }]

const libraries = ['drawing'];

function App({ mode, setMode }) {
    const [rectangleBounds, setRectangleBounds] = useState(null);
    const [rectangle, setRectangle] = useState(null);
    const mapRef = useRef(null);
    const drawingManagerRef = useRef(null);
    const [tiles, setTiles] = useState([]);
    const [metaData, setMetaData] = useState({});
    const [overlays, setOverlays] = useState([]);
    const [mousePosition, setMousePosition] = useState({ lat: 0, lng: 0 });

    const onLoad = useCallback((map) => {
        mapRef.current = map;

        drawingManagerRef.current = new window.google.maps.drawing.DrawingManager({
            drawingMode: null,
            drawingControl: true,
            drawingControlOptions: {
                drawingModes: [
                    window.google.maps.drawing.OverlayType.RECTANGLE,
                ],
                position: window.google.maps.ControlPosition.TOP_CENTER,
            },
            rectangleOptions: rectangleOptions,
        });

        drawingManagerRef.current.setMap(map);

        // Handle rectangle drawing
        window.google.maps.event.addListener(drawingManagerRef.current, 'rectanglecomplete', (rectangle) => {
            setRectangle(rectangle);
            const bounds = rectangle.getBounds();
            setRectangleBounds(bounds.toJSON());
            drawingManagerRef.current.setMap(null); // Hide drawing manager after drawing
        });

        window.google.maps.event.addListener(map, "mousemove", function (event) {
            // Get latitude and longitude of the mouse position
            var lat = event.latLng.lat();
            var lng = event.latLng.lng();
            setMousePosition({ lat, lng });
        });

    }, []);

    const resetRect = () => {
        setRectangleBounds(null); // Clear the rectangle bounds
        rectangle.setMap(null); // Clear the rectangle
        setRectangle(null); // Clear the rectangle state
        if (drawingManagerRef.current) {
            drawingManagerRef.current.setMap(mapRef.current); // Show drawing manager again
        }
    };

    useEffect(() => {
        if (overlays.length > 0) {
            overlays.forEach((overlay) => {
                overlay.setMap(null);
            });
        }
        setOverlays([]);

        // Load image overlay
        const loadOverlay = async () => {
            for (let tile of tiles) {
                const imageUrl = `${import.meta.env.VITE_API_URL}map/data/${metaData.name}/${tile[0]}`;

                // Fetch the image with custom header
                const response = await fetch(imageUrl, {
                    method: 'GET',
                    headers: {
                        'ngrok-skip-browser-warning': 'true' // Custom header to bypass the warning
                    }
                });

                if (response.ok) {
                    // Create blob URL from response
                    const imageBlob = await response.blob();
                    const imageObjectURL = URL.createObjectURL(imageBlob);

                    console.log('Image loaded:', imageObjectURL);

                    // Create the GroundOverlay with the blob URL
                    const overlay = new window.google.maps.GroundOverlay(
                        imageObjectURL, // Use blob URL
                        {
                            north: tile[1],
                            south: tile[2],
                            east: tile[3],
                            west: tile[4]
                        }
                    );
                    overlay.setMap(mapRef.current);
                    setOverlays((prev) => [...prev, overlay]);
                } else {
                    console.error('Failed to load image overlay');
                }
            }
        };

        loadOverlay();
    }, [tiles]);


    useEffect(() => {
        if (metaData.showMap === false) {
            if (overlays.length > 0) {
                overlays.forEach((overlay) => {
                    overlay.setMap(null);
                });
            }
        } else if (metaData.showMap === true) {
            if (overlays.length > 0) {
                overlays.forEach((overlay) => {
                    overlay.setMap(mapRef.current);
                });
            }
        }
    }, [metaData.showMap]);

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS} libraries={libraries}>
            <Controls mousePosition={mousePosition} setMetaData={setMetaData} mode={mode} setMode={setMode} setTiles={setTiles} rectangleBounds={rectangleBounds} resetRect={resetRect} />
            <div id='map'>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={6}
                    onLoad={onLoad}
                    options={{ streetViewControl: false }}
                >
                    {/* Render the rectangle only if bounds exist */}
                    {rectangleBounds && (
                        <Rectangle
                            bounds={rectangleBounds}
                            options={rectangleOptions}
                        />
                    )}
                </GoogleMap>
            </div>
            <Insights metaData={metaData} />
        </LoadScript>
    );
}

export default App;
