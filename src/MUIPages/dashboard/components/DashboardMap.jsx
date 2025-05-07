import React, { useRef, useEffect, useState } from "react";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/map`;
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
  strokeColor: "#036bfc",
  strokeOpacity: 0.5,
  strokeWeight: 4,
  strokeDasharray: [4, 4], // Makes the border dotted (4px dash, 4px space)
};

function DashboardMap({ selectedPolygon, selectedSeason, selectedYear, loadRequested, opacity = 0.8 }) {
  const mapRef = useRef(null);
  const [center, setCenter] = useState({ lat: 30, lng: 70 });
  const [overlays, setOverlays] = useState([]);
  const [overlayData, setOverayData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedPolygon) {
      // Clear previous overlays when new polygon is selected
      clearOverlays();
      
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
      
      // Only fetch overlay data if season and year are selected and load is requested
      if (selectedSeason && selectedYear && loadRequested) {
        setIsLoading(true);
        fetchOverlayData(selectedPolygon, selectedSeason, selectedYear);
      } else {
        setOverayData(null);
      }
    } else {
      // Also clear overlays when selectedPolygon becomes null
      clearOverlays();
      setOverayData(null);
    }
  }, [selectedPolygon, selectedSeason, selectedYear, loadRequested]);

  const convertCoordinates = (coordinates) => {
    return coordinates[0].map(([lon, lat]) => ({ lat, lng: lon })); // Flip coordinates
  };
  
  const clearOverlays = () => {
    overlays.forEach(overlay => overlay.setMap(null));
    setOverlays([]);
  };
  
  // Parse XML to extract GeoTransform data
  const parseXMLForBounds = (xmlText, imageWidth, imageHeight) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    
    const geoTransformText = xmlDoc.getElementsByTagName("GeoTransform")[0].textContent.trim();
    const values = geoTransformText.split(',').map(val => parseFloat(val.trim()));
    
    // GeoTransform format: [0]=top left x, [1]=w-e pixel resolution, [3]=top left y, [5]=n-s pixel resolution (negative)
    // Calculate the bounds based on the GeoTransform values
    const west = values[0];
    const north = values[3];
    const pixelWidth = values[1];
    const pixelHeight = values[5]; // This is negative
    
    // Use actual image dimensions instead of arbitrary values
    const east = west + (imageWidth * pixelWidth);
    const south = north + (imageHeight * pixelHeight); // pixelHeight is negative so south is less than north
    
    return {
      north,
      south,
      east,
      west
    };
  };
  
  // Get PNG dimensions using HTTP Range request
  const getPngDimensions = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl, {
        headers: {
          'Range': 'bytes=0-24'
        }
      });
      
      if (!response.ok) {
        console.error('Range request failed, server may not support it');
        throw new Error('Range request not supported');
      }
      
      const buffer = await response.arrayBuffer();
      const data = new DataView(buffer);
      
      // Read width and height from PNG header (bytes 16-23)
      const width = data.getUint32(16, false);  // Big-endian
      const height = data.getUint32(20, false); // Big-endian
      
      return { width, height };
    } catch (error) {
      console.error('Error getting PNG dimensions:', error);
      // Fallback to a reasonable default or try an alternative method
      return { width: 1000, height: 1000 }; 
    }
  };
  
  const fetchOverlayData = async (polygon, season, year) => {
    try {
      // Extract the district or region name from the polygon properties
      let regionName = polygon.properties.NAME_3 || polygon.properties.NAME_2 || polygon.properties.NAME_1;
      regionName = regionName.replace(/ /g, "_").replace(/,/g, "_").replace(/\./g, "_");
      if (!regionName) {
        setIsLoading(false);
        return;
      }
      
      // Map season to the correct format for file path
      const seasonFormat = season === 'Winter Season (January to May)' ? 'Jan-Apr' : 'Jun-Dec';
      
      // Construct the file path based on naming convention
      let province = polygon.properties.NAME_1;
      
      let imageUrl, xmlUrl;
      
      // Special handling for Punjab and Sind provinces
      if (regionName === "Punjab" || regionName === "Sindh") {
        // Use local public folder instead of API URL
        if (province === "Sindh") {
          province = "Sind";
        }
        imageUrl = `/${seasonFormat}_${year}_${regionName}.png`;
        xmlUrl = `${API_BASE_URL}/data/${seasonFormat}_${year}_${province}/croppedPngs/${seasonFormat}_${year}_${regionName}.png.aux.xml`;
      } else {
        // Regular path for other provinces
        const basePath = `${seasonFormat}_${year}_${province}/croppedPngs/${seasonFormat}_${year}_${regionName}`;
        imageUrl = `${API_BASE_URL}/data/${basePath}.png`;
        xmlUrl = `${API_BASE_URL}/data/${basePath}.png.aux.xml`;
      }
      
      // Fetch image dimensions first
      const { width, height } = await getPngDimensions(imageUrl);
      console.log(`Image dimensions: ${width}x${height}`);
      
      // Fetch the XML file
      const xmlResponse = await fetch(xmlUrl);
      if (!xmlResponse.ok) {
        console.error('Failed to fetch XML data');
        setIsLoading(false);
        return;
      }
      
      const xmlText = await xmlResponse.text();
      console.log('XML Text:', xmlText);
      
      // Pass actual image dimensions to the bounds calculation
      const bounds = parseXMLForBounds(xmlText, width, height);
      
      setOverayData({
        imagePath: imageUrl,
        bounds: bounds,
        dimensions: { width, height }
      });
      
      // Don't set isLoading to false here
      // We'll set it to false only when the overlay image has fully loaded
    } catch (error) {
      console.error('Error fetching overlay data:', error);
      setIsLoading(false); // Still reset on error
    }
    // Remove the finally block to keep loading until image is loaded
  };

  const loadOverlay = () => {
    if (!mapRef.current || !overlayData) return;
    
    const { imagePath, bounds } = overlayData;
    
    // Create Google Maps bounds object
    const googleMapsBounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(bounds.south, bounds.west),
      new window.google.maps.LatLng(bounds.north, bounds.east)
    );
    
    // Create the GroundOverlay with the API image URL
    const overlay = new window.google.maps.GroundOverlay(
      imagePath,
      googleMapsBounds,
      { opacity: opacity } // Apply the opacity prop here
    );
    
    // Add a listener to know when the image is fully loaded
    // Only then we'll hide the loading indicator
    window.google.maps.event.addListenerOnce(overlay, 'tilesloaded', () => {
      setIsLoading(false);
    });
    
    // If image fails to load, make sure we still hide the loading indicator
    overlay.addListener('error', () => {
      console.error('Ground overlay failed to load');
      setIsLoading(false);
    });
    
    overlay.setMap(mapRef.current);
    setOverlays((prev) => [...prev, overlay]);
  };

  // Update overlay opacity when prop changes
  useEffect(() => {
    if (overlays.length > 0 && opacity !== undefined) {
      overlays.forEach(overlay => overlay.setOpacity(opacity));
    }
  }, [opacity]);

  useEffect(() => {
    if (overlayData && mapRef.current) {
      loadOverlay();
    }
  }, [overlayData, mapRef.current]);

  // Add a timeout to hide loading indicator in case the events don't fire
  useEffect(() => {
    if (isLoading) {
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 5000); // 20 seconds timeout
      
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading]);

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        disabledDefaultUI="false"
      >
        {selectedPolygon && (
          <Polygon
            paths={convertCoordinates(selectedPolygon.geometry.coordinates)} // Convert coordinates
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
            gap: 1
          }}
        >
          <CircularProgress size={20} />
          <Typography variant="body2">
            Loading data for {selectedPolygon.properties.NAME_3 || 
                              selectedPolygon.properties.NAME_2 || 
                              selectedPolygon.properties.NAME_1}...
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default DashboardMap;
