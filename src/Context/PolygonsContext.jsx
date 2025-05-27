import React, { createContext, useState, useEffect, useContext } from 'react';

const PolygonsContext = createContext();

export const usePolygons = () => {
  return useContext(PolygonsContext);
};

export const PolygonsProvider = ({ children }) => {
  const [provinceGeojsonData, setProvinceGeojsonData] = useState(null);
  const [districtGeojsonData, setDistrictGeojsonData] = useState(null);

  useEffect(() => {
    // Load provinces GeoJSON from local file
    fetch('/provinces.json')
      .then((response) => response.json())
      .then((data) => {
        setProvinceGeojsonData(data.geojson);
      })
      .catch((error) => {
        console.error("Error loading provinces GeoJSON:", error);
      });

    // Load districts GeoJSON from local file
    fetch('/districts.json')
      .then((response) => response.json())
      .then((data) => {
        setDistrictGeojsonData(data.geojson);
      })
      .catch((error) => {
        console.error("Error loading districts GeoJSON:", error);
      });
  }, []);

  return (
    <PolygonsContext.Provider value={{ provinceGeojsonData, districtGeojsonData }}>
      {children}
    </PolygonsContext.Provider>
  );
};
