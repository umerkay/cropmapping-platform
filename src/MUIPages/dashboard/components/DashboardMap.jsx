import React, { useRef, useEffect, useState } from "react";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";
import Box from "@mui/material/Box";
// import overlayImage from "../../../assets/stitched_tile.png";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "16px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
};

const polygonOptions = {
  fillColor: "#FF0000",
  fillOpacity: 0,
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  strokeDasharray: [4, 4], // Makes the border dotted (4px dash, 4px space)
};

function DashboardMap({ selectedPolygon }) {
  const mapRef = useRef(null);
  const [center, setCenter] = useState({ lat: 30, lng: 70 });
  const [overlays, setOverlays] = useState([]);

  useEffect(() => {
    if (selectedPolygon) {
      const bounds = new window.google.maps.LatLngBounds();
      const coordinates = convertCoordinates(
        selectedPolygon.geometry.coordinates
      );
      coordinates.forEach((coord) => bounds.extend(coord));
      const center = bounds.getCenter();
      setCenter({ lat: center.lat(), lng: center.lng() });

      if (mapRef.current) {
        mapRef.current.fitBounds(bounds);
      }
    }
  }, [selectedPolygon]);

  const convertCoordinates = (coordinates) => {
    return coordinates[0].map(([lon, lat]) => ({ lat, lng: lon })); // Flip coordinates
  };

  const loadOverlay = () => {
    // const bounds = {
    //   north: 30.692783115760562,
    //   south: 29.726055483658396,
    //   east: 72.23356253864947,
    //   west: 71.06736346307093,
    // };
    if(!selectedPolygon || selectedPolygon.properties.NAME_3?.toLowerCase() !== "multan") return;

    const bounds = new window.google.maps.LatLngBounds();
      const coordinates = convertCoordinates(
        selectedPolygon.geometry.coordinates
      );
      coordinates.forEach((coord) => bounds.extend(coord));

    // Create the GroundOverlay with the local image URL
    const overlay = new window.google.maps.GroundOverlay(
      "https://iili.io/3q9qfxR.png",
      bounds
    );
    overlay.setMap(mapRef.current);
    setOverlays((prev) => [...prev, overlay]);
  };

  useEffect(() => {
    if (mapRef.current) {
      loadOverlay();
    }
  }, [mapRef.current]);

  useEffect(() => {
    loadOverlay();
  }, [selectedPolygon]);

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        disabledDefaultUI="true"
      >
        {selectedPolygon && (
          <Polygon
            paths={convertCoordinates(selectedPolygon.geometry.coordinates)} // Convert coordinates
            options={polygonOptions}
          />
        )}
      </GoogleMap>
    </Box>
  );
}

export default DashboardMap;
