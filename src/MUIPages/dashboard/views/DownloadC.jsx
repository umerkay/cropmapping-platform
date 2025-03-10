import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { usePolygons } from '../../../Context/PolygonsContext';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const years = [2022, 2023, 2024, 2025];
const fileFormats = ['GeoTIFF', 'PNG'];
const dataTypes = ['Land Use Data', 'Crop Type Data'];
const dataFormats = ['JSON', 'CSV'];

export default function Download() {
  const { districtGeojsonData, provinceGeojsonData } = usePolygons();
  const [districts, setDistricts] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDistrictOrProvince, setSelectedDistrictOrProvince] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedFileFormat, setSelectedFileFormat] = useState('');
  const [selectedDataTypes, setSelectedDataTypes] = useState([]);
  const [selectedDataFormat, setSelectedDataFormat] = useState('');
  const [selectedStartMonth, setSelectedStartMonth] = useState('');
  const [selectedEndMonth, setSelectedEndMonth] = useState('');
  const [selectedStartYear, setSelectedStartYear] = useState('');
  const [selectedEndYear, setSelectedEndYear] = useState('');

  useEffect(() => {
    if (districtGeojsonData) {
      setDistricts(districtGeojsonData.features.map(feature => feature.properties.NAME_3));
    }
    if (provinceGeojsonData) {
      setProvinces(provinceGeojsonData.features.map(feature => feature.properties.NAME_1));
    }
  }, [districtGeojsonData, provinceGeojsonData]);

  const handleDownloadImageData = () => {
    // Implement download logic for image data
  };

  const handleDownloadTrendsData = () => {
    // Implement download logic for trends data
  };

  return (
      <Box sx={{ p: 3, maxWidth: "80vw" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Download Image Data
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="region-select-label">Select Region</InputLabel>
                <Select
                  labelId="region-select-label"
                  value={selectedRegion}
                  label="Select Region"
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <MenuItem value="district">District</MenuItem>
                  <MenuItem value="province">Province</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="district-or-province-select-label">Select District/Province</InputLabel>
                <Select
                  labelId="district-or-province-select-label"
                  value={selectedDistrictOrProvince}
                  label="Select District/Province"
                  onChange={(e) => setSelectedDistrictOrProvince(e.target.value)}
                >
                  {(selectedRegion === 'district' ? districts : provinces).map((item) => (
                    <MenuItem key={item} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="month-select-label">Select Month</InputLabel>
                <Select
                  labelId="month-select-label"
                  value={selectedMonth}
                  label="Select Month"
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {months.map((month) => (
                    <MenuItem key={month} value={month}>{month}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="year-select-label">Select Year</InputLabel>
                <Select
                  labelId="year-select-label"
                  value={selectedYear}
                  label="Select Year"
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="file-format-select-label">Select File Format</InputLabel>
                <Select
                  labelId="file-format-select-label"
                  value={selectedFileFormat}
                  label="Select File Format"
                  onChange={(e) => setSelectedFileFormat(e.target.value)}
                >
                  {fileFormats.map((format) => (
                    <MenuItem key={format} value={format}>{format}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="contained" color="primary" onClick={handleDownloadImageData}>
                Download Image Data
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Download Trends Data
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="region-select-label">Select Region</InputLabel>
                <Select
                  labelId="region-select-label"
                  value={selectedRegion}
                  label="Select Region"
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <MenuItem value="district">District</MenuItem>
                  <MenuItem value="province">Province</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="district-or-province-select-label">Select District/Province</InputLabel>
                <Select
                  labelId="district-or-province-select-label"
                  value={selectedDistrictOrProvince}
                  label="Select District/Province"
                  onChange={(e) => setSelectedDistrictOrProvince(e.target.value)}
                >
                  {(selectedRegion === 'district' ? districts : provinces).map((item) => (
                    <MenuItem key={item} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="start-month-select-label">Select Start Month</InputLabel>
                <Select
                  labelId="start-month-select-label"
                  value={selectedStartMonth}
                  label="Select Start Month"
                  onChange={(e) => setSelectedStartMonth(e.target.value)}
                >
                  {months.map((month) => (
                    <MenuItem key={month} value={month}>{month}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="start-year-select-label">Select Start Year</InputLabel>
                <Select
                  labelId="start-year-select-label"
                  value={selectedStartYear}
                  label="Select Start Year"
                  onChange={(e) => setSelectedStartYear(e.target.value)}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="end-month-select-label">Select End Month</InputLabel>
                <Select
                  labelId="end-month-select-label"
                  value={selectedEndMonth}
                  label="Select End Month"
                  onChange={(e) => setSelectedEndMonth(e.target.value)}
                >
                  {months.map((month) => (
                    <MenuItem key={month} value={month}>{month}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="end-year-select-label">Select End Year</InputLabel>
                <Select
                  labelId="end-year-select-label"
                  value={selectedEndYear}
                  label="Select End Year"
                  onChange={(e) => setSelectedEndYear(e.target.value)}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="data-types-select-label">Select Data Types</InputLabel>
                <Select
                  labelId="data-types-select-label"
                  multiple
                  value={selectedDataTypes}
                  label="Select Data Types"
                  onChange={(e) => setSelectedDataTypes(e.target.value)}
                >
                  {dataTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="data-format-select-label">Select Data Format</InputLabel>
                <Select
                  labelId="data-format-select-label"
                  value={selectedDataFormat}
                  label="Select Data Format"
                  onChange={(e) => setSelectedDataFormat(e.target.value)}
                >
                  {dataFormats.map((format) => (
                    <MenuItem key={format} value={format}>{format}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="contained" color="primary" onClick={handleDownloadTrendsData}>
                Download Trends Data
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Explanation of Data Formats
              </Typography>
              <Typography variant="body1" gutterBottom>
                GeoTIFF is a format for encoding raster graphics data, including georeferencing information. It is commonly used for satellite imagery and other geospatial data.
              </Typography>
              <Typography variant="body1" gutterBottom>
                PNG is a raster-graphics file format that supports lossless data compression. It is commonly used for images on the web.
              </Typography>
              <Typography variant="body1" gutterBottom>
                JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write, and easy for machines to parse and generate.
              </Typography>
              <Typography variant="body1" gutterBottom>
                CSV (Comma-Separated Values) is a simple file format used to store tabular data, such as a spreadsheet or database.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Use Cases for Different Data Formats
              </Typography>
              <Typography variant="body1" gutterBottom>
                GeoTIFF is ideal for detailed geospatial analysis and is commonly used in GIS applications.
              </Typography>
              <Typography variant="body1" gutterBottom>
                PNG is suitable for web applications and visual presentations where high-quality images are required.
              </Typography>
              <Typography variant="body1" gutterBottom>
                JSON is great for web APIs and data interchange between servers and web applications.
              </Typography>
              <Typography variant="body1" gutterBottom>
                CSV is perfect for data analysis and manipulation in spreadsheet software like Microsoft Excel or Google Sheets.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
  );
}
