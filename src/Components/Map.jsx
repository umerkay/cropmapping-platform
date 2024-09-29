import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Rectangle } from '@react-google-maps/api';
import Controls from './Controls';
import Insights from './Insights';

const containerStyle = {
    width: '100%',
    height: '100%',
    // borderRadius: '1rem',
    // border: "5px solid rgb(17, 124, 206)"
};

const center = {
    lat: 30,
    lng: 69
};

const rectangleOptions = {
    fillColor: '#FF0000',
    fillOpacity: 0,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
};

const imgs = ["/output_image.png"]
const imageBounds = [{
    north: 28.021667455423074,  // Top latitude (from conversion)
    south: 27.034136567742728,  // Bottom latitude (from conversion)
    east: 69.09840173726721,   // Right longitude (from conversion)
    west: 67.9823586865616,   // Left longitude (from conversion), 
}]

function App() {
    const [rectangleBounds, setRectangleBounds] = useState(null);
    const [rectangle, setRectangle] = useState(null);
    const mapRef = useRef(null);
    const drawingManagerRef = useRef(null);

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

        // Load image overlay
        for (let i = 0; i < imgs.length; i++) {
            const overlay = new window.google.maps.GroundOverlay(
                imgs[i],
                imageBounds[i]
            );

            overlay.setMap(map);
        }
    }, []);

    const resetRect = () => {
        setRectangleBounds(null); // Clear the rectangle bounds
        rectangle.setMap(null); // Clear the rectangle
        setRectangle(null); // Clear the rectangle state
        if (drawingManagerRef.current) {
            drawingManagerRef.current.setMap(mapRef.current); // Show drawing manager again
        }
    };

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS} libraries={['drawing']}>
            <Controls rectangleBounds={rectangleBounds} resetRect={resetRect} />
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
            <Insights />
        </LoadScript>
    );
}

export default App;
