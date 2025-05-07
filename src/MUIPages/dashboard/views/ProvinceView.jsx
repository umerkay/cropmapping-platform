import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import DashboardMap from '../components/DashboardMap';
import { BarChart } from '@mui/x-charts/BarChart';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { usePolygons } from '../../../Context/PolygonsContext';
import { useMediaQuery } from '@mui/material';
import { fetchGraphData } from '../../../Services/GraphDataService'; // Import the fetchGraphData function
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom'; // Import useParams
import Slider from '@mui/material/Slider'; // Add this import at the top

// Color mapping for the legend
const colorMap = {
  0: "rgb(194, 81, 0)",
  13: "rgb(194, 81, 0)",
  6: "rgb(194, 81, 0)",
  7: "rgb(0, 100, 0)",
  1: "rgb(0, 100, 0)",
  2: "rgb(0, 100, 0)",
  3: "rgb(255, 166, 0)",
  4: "rgb(255, 166, 0)",
  8: "rgb(255, 166, 0)",
  9: "rgb(255, 166, 0)",
  12: "rgb(255, 166, 0)",
  10: "rgb(212, 255, 71)",
  5: "rgb(212, 255, 71)",
  11: "rgb(212, 255, 71)"
};

// Color mapping for crop and landuse groups
const groupColors = {
  "Natural": "rgb(0, 100, 0)",
  "Urban/Barren": "rgb(194, 81, 0)",
  "Wheat": "rgb(255, 166, 0)",
  "Cotton": "rgb(161, 238, 255)", // Added a color for Cotton even though it has no classes yet
  "Others": "rgb(212, 255, 71)"
};

const cropGroups = {
  "Wheat": [3, 4, 8, 9, 12],
  "Cotton": [],
  "Others": [10, 5, 11]
};

const landuseGroups = {
  "Natural": [1, 2, 7],
  "Urban/Barren": [6, 13, 0],
};

// Simplified Legend component to display color codes just for groups
const ColorLegend = () => {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Classification Legend</Typography>
      
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>Land Use Groups</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {Object.entries(landuseGroups).map(([groupName, _]) => (
          <Box key={groupName} sx={{ display: 'flex', alignItems: 'center', mr: 3, mb: 1 }}>
            <Box 
              sx={{ 
                width: 20, 
                height: 20, 
                backgroundColor: groupColors[groupName], 
                mr: 1,
                border: '1px solid #ccc' 
              }} 
            />
            <Typography variant="body2">{groupName}</Typography>
          </Box>
        ))}
      </Box>
      
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>Crop Groups</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {Object.entries(cropGroups).filter(([groupName, ids]) => ids.length > 0 || groupName === "Cotton").map(([groupName, _]) => (
          <Box key={groupName} sx={{ display: 'flex', alignItems: 'center', mr: 3, mb: 1 }}>
            <Box 
              sx={{ 
                width: 20, 
                height: 20, 
                backgroundColor: groupColors[groupName], 
                mr: 1,
                border: '1px solid #ccc' 
              }} 
            />
            <Typography variant="body2">{groupName}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default function ProvinceView({ setAppendMessage }) {
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState('');  // Renamed from selectedMonth
  const [selectedYear, setSelectedYear] = useState('');
  const [graphData, setGraphData] = useState(null);
  const [error, setError] = useState(null);
  const [loadRequested, setLoadRequested] = useState(false);  // New state to track load request
  const [opacity, setOpacity] = useState(0.8); // Add opacity state with initial value of 0.8
  const { provinceGeojsonData } = usePolygons();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { provinceName } = useParams(); // Get provinceName from URL params

  // Filter provinces to only include Punjab and Sindh
  const filteredProvinces = provinceGeojsonData ? 
    provinceGeojsonData.features.filter(feature => 
      feature.properties.NAME_1 === "Punjab" || feature.properties.NAME_1 === "Sindh"
    ) : [];

  // Check if the selected province is Punjab
  const isPunjabProvince = selectedPolygon?.properties?.NAME_1 === "Punjab";

  useEffect(() => {
    if (provinceName && provinceGeojsonData) {
      const selected = filteredProvinces.find(
        (feature) => feature.properties.NAME_1.toLowerCase() === provinceName.toLowerCase()
      );
      setSelectedPolygon(selected);
    }
  }, [provinceName, provinceGeojsonData]);

  useEffect(() => {
    // If selected province is not Punjab and Summer Season is selected, reset selection
    if (!isPunjabProvince && selectedSeason === 'Summer Season (June to December)') {
      setSelectedSeason('Winter Season (January to May)');
      setSelectedYear('2025');
    }
  }, [selectedPolygon]);

  const handlePolygonSelect = (event) => {
    const polygonId = event.target.value;
    const selected = filteredProvinces.find(
      (feature) => feature.properties.GID_1 === polygonId
    );
    setSelectedPolygon(selected);
  };

  const handleSeasonChange = (event) => {  // Renamed from handleMonthChange
    const newSeason = event.target.value;
    setSelectedSeason(newSeason);
    // Reset year if it's not valid for the selected season
    if (newSeason === 'Winter Season (January to May)' && selectedYear === '2024') {
      setSelectedYear('2025');
    } else if (newSeason === 'Summer Season (June to December)' && selectedYear === '2025') {
      setSelectedYear('2024');
    } else if (!selectedYear) {
      // Set default year based on season
      setSelectedYear(newSeason === 'Winter Season (January to May)' ? '2025' : '2024');
    }
    setLoadRequested(false); // Reset load request when season changes
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setLoadRequested(false); // Reset load request when year changes
  };

  const handleLoadData = () => {
    if (selectedPolygon && selectedSeason && selectedYear) {
      setLoadRequested(true);  // Set load requested to true
      
      // Map season labels to file name format
      const seasonFileFormat = selectedSeason === 'Winter Season (January to May)' ? 'Jan-Apr' : 'Jun-Dec';
      const fileName = `${seasonFileFormat}_${selectedYear}_${selectedPolygon.properties.NAME_1}.json`;
      
      fetchGraphData(fileName)
        .then((data) => {
          setGraphData(data);
          setError(null);
          setAppendMessage(`Land Use data for ${selectedSeason} ${selectedYear}: ${selectedPolygon.properties.NAME_1}`);
        })
        .catch((err) => {
          setGraphData(null);
          toast.error(`No data for ${selectedPolygon.properties.NAME_1} in ${selectedSeason} ${selectedYear}`);
        });
    }
  };

  const handleOpacityChange = (event, newValue) => {
    setOpacity(newValue);
  };

  return (
    <Box sx={{ display: 'flex', height: isMobile ? 'auto' : '90vh', width: "100%", p: 2, flexDirection: isMobile ? 'column' : 'row' }}>
      <Box sx={{ width: isMobile ? "100%": '50%', height: isMobile ? '60vh' : '100%' }}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <DashboardMap 
            selectedPolygon={selectedPolygon} 
            selectedSeason={selectedSeason} 
            selectedYear={selectedYear}
            loadRequested={loadRequested}
            opacity={opacity} // Pass opacity prop to DashboardMap
          />
        </Paper>
      </Box>
      <Box sx={{ width: isMobile ? "100%": '50%', height: '100%', overflowY: 'auto', pl: 2, pt: 1 }}>
        <FormControl sx={{ width: "100%", mb: 2 }}>
          <InputLabel id="polygon-select-label">Select Province</InputLabel>
          <Select
            labelId="polygon-select-label"
            id="polygon-select"
            value={selectedPolygon ? selectedPolygon.properties.GID_1 : ''}
            label={"Select Province"}
            onChange={handlePolygonSelect}
          >
            {filteredProvinces.map((polygon) => (
              <MenuItem key={polygon.properties.GID_1} value={polygon.properties.GID_1}>
                {polygon.properties.NAME_1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: "100%", mb: 2 }}>
          <InputLabel id="season-select-label">Select Season</InputLabel>  {/* Changed from Select Month */}
          <Select
            labelId="season-select-label"
            id="season-select"
            value={selectedSeason}
            label="Select Season"
            onChange={handleSeasonChange}
          >
            <MenuItem value="Winter Season (January to May)">Winter Season (January to May)</MenuItem>
            {/* Only show Summer Season for Punjab province */}
            {isPunjabProvince && (
              <MenuItem value="Summer Season (June to December)">Summer Season (June to December)</MenuItem>
            )}
          </Select>
        </FormControl>
        <FormControl sx={{ width: "100%", mb: 2 }}>
          <InputLabel id="year-select-label">Select Year</InputLabel>
          <Select
            labelId="year-select-label"
            id="year-select"
            value={selectedYear}
            label="Select Year"
            onChange={handleYearChange}
            disabled={!selectedSeason}
          >
            {selectedSeason === 'Winter Season (January to May)' ? (
              <MenuItem value="2025">2025</MenuItem>
            ) : selectedSeason === 'Summer Season (June to December)' ? (
              <MenuItem value="2024">2024</MenuItem>
            ) : null}
          </Select>
        </FormControl>
        <Button 
          sx={{mb: 2}} 
          variant="contained" 
          color="primary" 
          onClick={handleLoadData}
          disabled={!selectedPolygon || !selectedSeason || !selectedYear}
        >
          Load Data
        </Button>
        
        {/* Add the opacity slider when map is loaded */}
        {loadRequested && (
          <Box sx={{ mb: 2, mt: 1 }}>
            <Typography id="opacity-slider" gutterBottom>
              Map Overlay Opacity
            </Typography>
            <Slider
              aria-labelledby="opacity-slider"
              value={opacity}
              onChange={handleOpacityChange}
              min={0.1}
              max={1}
              step={0.1}
              marks
              valueLabelDisplay="auto"
              valueLabelFormat={value => `${Math.round(value * 100)}%`}
            />
          </Box>
        )}
        
        {/* Display the color legend when graph data is loaded */}
        {graphData && <ColorLegend />}
        
        {graphData && (
          <>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>Land Use Information</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Acres</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(graphData.landUseData).map(([type, data]) => (
                      <TableRow key={type}>
                        <TableCell>{type}</TableCell>
                        <TableCell>{data}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: Object.keys(graphData.landUseData),
                  },
                ]}
                series={[
                  {
                    data: Object.values(graphData.landUseData).map(
                      (item) => item
                    ),
                    label: "Acres",
                  },
                ]}
                width={400}
                height={300}
              />
            </Paper>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>Crop Type Classification</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Crop</TableCell>
                      <TableCell>Acres</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(graphData.cropTypeData).map(([crop, data]) => (
                      <TableRow key={crop}>
                        <TableCell>{crop}</TableCell>
                        <TableCell>{data}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: Object.keys(graphData.cropTypeData),
                  },
                ]}
                series={[
                  {
                    data: Object.values(graphData.cropTypeData).map(
                      (item) => item
                    ),
                    label: "Acres",
                  },
                ]}
                width={400}
                height={300}
              />
            </Paper>
            {
              graphData.expectedYieldData && (
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Expected Yield Data</Typography>
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: Object.keys(graphData.expectedYieldData),
                  },
                ]}
                series={[
                  {
                    data: Object.values(graphData.expectedYieldData).map(
                      (item) => item.expectedYield
                    ),
                    label: "Expected Yield",
                  },
                ]}
                width={400}
                height={300}
              />
            </Paper>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}