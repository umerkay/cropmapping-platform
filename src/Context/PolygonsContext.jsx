import React, { createContext, useState, useEffect, useContext } from 'react';

const PolygonsContext = createContext();

export const usePolygons = () => {
  return useContext(PolygonsContext);
};

export const PolygonsProvider = ({ children }) => {
  const [provinceGeojsonData, setProvinceGeojsonData] = useState(null);
  const [districtGeojsonData, setDistrictGeojsonData] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}api/geojson?level=provinces`)
      .then((response) => response.json())
      .then((data) => {
        setProvinceGeojsonData(data.geojson);
      });

    fetch(`${import.meta.env.VITE_API_URL}api/geojson`)
      .then((response) => response.json())
      .then((data) => {
        setDistrictGeojsonData(data.geojson);
      });
  }, []);

  return (
    <PolygonsContext.Provider value={{ provinceGeojsonData, districtGeojsonData }}>
      {children}
    </PolygonsContext.Provider>
  );
};
