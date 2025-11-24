import React, { useRef, useEffect, useState } from "react";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/map`;

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "16px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
};

const polygonOptions = {
  fillColor: "#FF0000",
  fillOpacity: 0,
  strokeColor: "#036bfc",
  strokeOpacity: 0.5,
  strokeWeight: 4,
  strokeDasharray: [4, 4],
};

function DashboardMap({ selectedPolygon, selectedSeason, selectedYear, loadRequested, opacity = 0.8 }) {
  const mapRef = useRef(null);
  const [center, setCenter] = useState({ lat: 30, lng: 70 });
  const [overlays, setOverlays] = useState([]);
  const [overlayData, setOverayData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedPolygon) {
      clearOverlays();
      const bounds = new window.google.maps.LatLngBounds();
      const coordinates = convertCoordinates(selectedPolygon.geometry.coordinates);
      coordinates.forEach((coord) => bounds.extend(coord));
      const center = bounds.getCenter();
      setCenter({ lat: center.lat(), lng: center.lng() });

      if (mapRef.current) {
        mapRef.current.fitBounds(bounds);
      }

      if (selectedSeason && selectedYear && loadRequested) {
        setIsLoading(true);
        fetchOverlayData(selectedPolygon, selectedSeason, selectedYear);
      } else {
        setOverayData(null);
      }
    } else {
      clearOverlays();
      setOverayData(null);
    }
  }, [selectedPolygon, selectedSeason, selectedYear, loadRequested]);

  const convertCoordinates = (coordinates) => {
    return coordinates[0].map(([lon, lat]) => ({ lat, lng: lon }));
  };

  const clearOverlays = () => {
    overlays.forEach((overlay) => overlay.setMap(null));
    setOverlays([]);
  };

  const parseXMLForBounds = (xmlText, imageWidth, imageHeight) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const geoTransformText = xmlDoc.getElementsByTagName("GeoTransform")[0].textContent.trim();
    const values = geoTransformText.split(',').map(val => parseFloat(val.trim()));
    const west = values[0];
    const north = values[3];
    const pixelWidth = values[1];
    const pixelHeight = values[5];
    const east = west + (imageWidth * pixelWidth);
    const south = north + (imageHeight * pixelHeight);

    return { north, south, east, west };
  };

  const getPngDimensions = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl, { headers: { Range: 'bytes=0-24' }});
      if (!response.ok) throw new Error('Range request not supported');

      const buffer = await response.arrayBuffer();
      const data = new DataView(buffer);
      const width = data.getUint32(16, false);
      const height = data.getUint32(20, false);
      return { width, height };
    } catch {
      return { width: 1000, height: 1000 };
    }
  };

  const fetchOverlayData = async (polygon, season, year) => {
    try {
      let regionName = polygon.properties.NAME_3 || polygon.properties.NAME_2 || polygon.properties.NAME_1;
      regionName = regionName.replace(/ /g, "_").replace(/,/g, "_").replace(/\./g, "_");
      if (!regionName) return setIsLoading(false);

      const seasonFormat = season === 'Winter Season (January to May)' ? 'Jan-Apr' : 'Jun-Dec';
      let province = polygon.properties.NAME_1;

      let imageUrl, xmlUrl;
      if (regionName === "Punjab" || regionName === "Sindh") {
        if (province === "Sindh") province = "Sind";
        imageUrl = `/${seasonFormat}_${year}_${regionName}.png`;
        xmlUrl = `${API_BASE_URL}/data/${seasonFormat}_${year}_${province}/croppedPngs/${seasonFormat}_${year}_${regionName}.png.aux.xml`;
      } else {
        const basePath = `${seasonFormat}_${year}_${province}/croppedPngs/${seasonFormat}_${year}_${regionName}`;
        imageUrl = `${API_BASE_URL}/data/${basePath}.png`;
        xmlUrl = `${API_BASE_URL}/data/${basePath}.png.aux.xml`;
      }

      const { width, height } = await getPngDimensions(imageUrl);
      const xmlResponse = await fetch(xmlUrl);
      if (!xmlResponse.ok) return setIsLoading(false);

      const xmlText = await xmlResponse.text();
      const bounds = parseXMLForBounds(xmlText, width, height);

      setOverayData({ imagePath: imageUrl, bounds, dimensions: { width, height }});
    } catch {
      setIsLoading(false);
    }
  };

  const loadOverlay = () => {
    if (!mapRef.current || !overlayData) return;
    const { imagePath, bounds } = overlayData;

    const googleMapsBounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(bounds.south, bounds.west),
      new window.google.maps.LatLng(bounds.north, bounds.east)
    );

    const overlay = new window.google.maps.GroundOverlay(imagePath, googleMapsBounds, { opacity });

    window.google.maps.event.addListenerOnce(overlay, "tilesloaded", () => setIsLoading(false));
    overlay.addListener("error", () => setIsLoading(false));

    overlay.setMap(mapRef.current);
    setOverlays((prev) => [...prev, overlay]);
  };

  useEffect(() => {
    if (overlays.length > 0) overlays.forEach((overlay) => overlay.setOpacity(opacity));
  }, [opacity]);

  useEffect(() => {
    if (overlayData && mapRef.current) loadOverlay();
  }, [overlayData, mapRef.current]);

  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => setIsLoading(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Disclaimer */}
      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 10,
          background: "rgba(255,255,255,0.9)",
          padding: "8px 12px",
          borderRadius: "6px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500, color: "black" }}>
          ⚠ Labels are large files and may take 1–2 minutes to load after selecting season and location.
        </Typography>
      </Box>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
        onLoad={(map) => (mapRef.current = map)}
        disabledDefaultUI="false"
      >
        {selectedPolygon && (
          <Polygon
            paths={convertCoordinates(selectedPolygon.geometry.coordinates)}
            options={polygonOptions}
          />
        )}
      </GoogleMap>

      {isLoading && selectedPolygon && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "8px 12px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CircularProgress size={20} />
          <Typography variant="body2">
            Loading data for {selectedPolygon.properties.NAME_3 || selectedPolygon.properties.NAME_2 || selectedPolygon.properties.NAME_1}...
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default DashboardMap;
