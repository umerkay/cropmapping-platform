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

export default function ProvinceView({ setAppendMessage }) {
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [graphData, setGraphData] = useState(null);
  const [error, setError] = useState(null);
  const { provinceGeojsonData } = usePolygons();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { provinceName } = useParams(); // Get provinceName from URL params

  useEffect(() => {
    if (provinceName && provinceGeojsonData) {
      const selected = provinceGeojsonData.features.find(
        (feature) => feature.properties.NAME_1.toLowerCase() === provinceName.toLowerCase()
      );
      setSelectedPolygon(selected);
    }
  }, [provinceName, provinceGeojsonData]);

  const handlePolygonSelect = (event) => {
    const polygonId = event.target.value;
    const selected = provinceGeojsonData.features.find(
      (feature) => feature.properties.GID_1 === polygonId
    );
    setSelectedPolygon(selected);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleLoadData = () => {
    if (selectedPolygon && selectedMonth && selectedYear) {
      const fileName = `${selectedPolygon.properties.NAME_1}_${selectedMonth}_${selectedYear}.json`;
      fetchGraphData(fileName)
        .then((data) => {
          setGraphData(data);
          setError(null);
          setAppendMessage(`Land Use data for ${selectedMonth} ${selectedYear}: ${selectedPolygon.properties.NAME_1}`);
        })
        .catch((err) => {
          setGraphData(null);
          toast.error(`No data for ${selectedPolygon.properties.NAME_1} in ${selectedMonth} ${selectedYear}`);
        });
    }
  };

  return (
    <Box sx={{ display: 'flex', height: isMobile ? 'auto' : '90vh', width: "100%", p: 2, flexDirection: isMobile ? 'column' : 'row' }}>
      <Box sx={{ width: isMobile ? "100%": '50%', height: isMobile ? '60vh' : '100%' }}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <DashboardMap selectedPolygon={selectedPolygon} />
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
            {provinceGeojsonData && provinceGeojsonData.features.map((polygon) => (
              <MenuItem key={polygon.properties.GID_1} value={polygon.properties.GID_1}>
                {polygon.properties.NAME_1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: "100%", mb: 2 }}>
          <InputLabel id="month-select-label">Select Month</InputLabel>
          <Select
            labelId="month-select-label"
            id="month-select"
            value={selectedMonth}
            label={"Select Month"}
            onChange={handleMonthChange}
          >
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: "100%", mb: 2 }}>
          <InputLabel id="year-select-label">Select Year</InputLabel>
          <Select
            labelId="year-select-label"
            id="year-select"
            value={selectedYear}
            label={"Select Year"}
            onChange={handleYearChange}
          >
            {[2022, 2023, 2024, 2025].map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button sx={{mb: 2}} variant="contained" color="primary" onClick={handleLoadData}>
          Load Data
        </Button>
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
                        <TableCell>{data.acres}</TableCell>
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
                      (item) => item.acres
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
                        <TableCell>{data.acres}</TableCell>
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
                      (item) => item.acres
                    ),
                    label: "Acres",
                  },
                ]}
                width={400}
                height={300}
              />
            </Paper>
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
          </>
        )}
      </Box>
    </Box>
  );
}