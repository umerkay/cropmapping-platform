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
import CircularProgress from '@mui/material/CircularProgress';
import { usePolygons } from '../../../Context/PolygonsContext';
import { toast } from 'react-toastify';

// Constants
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const years = [2022, 2023, 2024, 2025];
const dataTypes = ['Land Use Data', 'Crop Type Data'];
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/map`;

export default function Download() {
  const { districtGeojsonData, provinceGeojsonData } = usePolygons();
  const [districts, setDistricts] = useState([]);
  const [provinces, setProvinces] = useState([]);
  
  // Image data form states
  const [selectedRegionImg, setSelectedRegionImg] = useState('');
  const [selectedDistrictOrProvinceImg, setSelectedDistrictOrProvinceImg] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loadingImg, setLoadingImg] = useState(false);
  
  // Trends data form states
  const [selectedRegionTrend, setSelectedRegionTrend] = useState('');
  const [selectedDistrictOrProvinceTrend, setSelectedDistrictOrProvinceTrend] = useState('');
  const [selectedDataTypes, setSelectedDataTypes] = useState([]);
  const [selectedStartMonth, setSelectedStartMonth] = useState('');
  const [selectedEndMonth, setSelectedEndMonth] = useState('');
  const [selectedStartYear, setSelectedStartYear] = useState('');
  const [selectedEndYear, setSelectedEndYear] = useState('');
  const [loadingTrend, setLoadingTrend] = useState(false);

  // When data is loaded, populate districts and provinces
  useEffect(() => {
    if (districtGeojsonData) {
      // Filter districts to only include Punjab and Sindh
      const filteredDistricts = districtGeojsonData.features
        .filter(feature => feature.properties.NAME_1 === "Punjab" || feature.properties.NAME_1 === "Sindh")
        .map(feature => ({
          name: feature.properties.NAME_3,
          province: feature.properties.NAME_1
        }));
      setDistricts(filteredDistricts);
    }
    
    if (provinceGeojsonData) {
      // Filter provinces to only include Punjab and Sindh
      const filteredProvinces = provinceGeojsonData.features
        .filter(feature => feature.properties.NAME_1 === "Punjab" || feature.properties.NAME_1 === "Sindh")
        .map(feature => feature.properties.NAME_1);
      setProvinces(filteredProvinces);
    }
  }, [districtGeojsonData, provinceGeojsonData]);

  // Handle season change based on selected region for image data
  const handleSeasonChangeImg = (e) => {
    const season = e.target.value;
    setSelectedSeason(season);
    
    // Reset year if needed based on season
    if (season === 'Winter Season (January to May)') {
      setSelectedYear('2025');
    } else if (season === 'Summer Season (June to December)') {
      setSelectedYear('2024');
    } else {
      setSelectedYear('');
    }
  };

  // Handle district/province selection for image data
  const handleRegionChangeImg = (e) => {
    const region = e.target.value;
    setSelectedRegionImg(region);
    setSelectedDistrictOrProvinceImg('');
    
    // Reset season and year if Sindh is selected (only winter season is available for Sindh)
    if (region === 'province' && provinces.includes('Sindh')) {
      setSelectedSeason('Winter Season (January to May)');
      setSelectedYear('2025');
    }
  };

  // Handle district/province selection change for image data
  const handleDistrictOrProvinceChangeImg = (e) => {
    const selection = e.target.value;
    setSelectedDistrictOrProvinceImg(selection);
    
    // Check if Sindh district/province is selected
    const isSindh = selectedRegionImg === 'province' 
      ? selection === 'Sindh'
      : districts.find(d => d.name === selection)?.province === 'Sindh';
    
    // Reset season and year for Sindh
    if (isSindh) {
      setSelectedSeason('Winter Season (January to May)');
      setSelectedYear('2025');
    }
  };

  // Handle region change for trends data
  const handleRegionChangeTrend = (e) => {
    const region = e.target.value;
    setSelectedRegionTrend(region);
    setSelectedDistrictOrProvinceTrend('');
    
    // Reset date range if Sindh is selected
    if (region === 'province' && provinces.includes('Sindh')) {
      setSelectedStartMonth('January');
      setSelectedEndMonth('April');
      setSelectedStartYear('2025');
      setSelectedEndYear('2025');
    }
  };

  // Handle district/province selection change for trends data
  const handleDistrictOrProvinceChangeTrend = (e) => {
    const selection = e.target.value;
    setSelectedDistrictOrProvinceTrend(selection);
    
    // Check if Sindh district/province is selected
    const isSindh = selectedRegionTrend === 'province' 
      ? selection === 'Sindh'
      : districts.find(d => d.name === selection)?.province === 'Sindh';
    
    // Reset date range for Sindh
    if (isSindh) {
      setSelectedStartMonth('January');
      setSelectedEndMonth('April');
      setSelectedStartYear('2025');
      setSelectedEndYear('2025');
    }
  };

  const handleDownloadImageData = async () => {
    if (!validateImageForm()) return;
    
    setLoadingImg(true);
    
    try {
      let regionName = selectedDistrictOrProvinceImg;
      let province;
      
      // Format the region name and get province
      if (selectedRegionImg === 'district') {
        const district = districts.find(d => d.name === regionName);
        province = district.province;
        regionName = regionName.replace(/ /g, "_").replace(/,/g, "_").replace(/\./g, "_");
      } else {
        province = regionName;
        if (province === 'Sindh') province = 'Sind'; // Match the naming convention in the API
      }
      
      // Map season to file format
      const seasonFormat = selectedSeason === 'Winter Season (January to May)' ? 'Jan-Apr' : 'Jun-Dec';
      const year = selectedYear;
      
      // Construct the file URL for PNG
      let fileUrl;
      if (province === "Sindh" || province === "Sind" || province === "Punjab") {
        fileUrl = `${API_BASE_URL}/data/${seasonFormat}_${year}_${province}/croppedPngs/${seasonFormat}_${year}_${regionName}.png`;
      }
      
      if (!fileUrl) {
        toast.error('Unable to construct download URL');
        setLoadingImg(false);
        return;
      }
      
      // Attempt to download the file
      const response = await fetch(fileUrl);
      
      if (!response.ok) {
        toast.error(`File not available: ${response.statusText}`);
        setLoadingImg(false);
        return;
      }
      
      // Create a blob from the response
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${seasonFormat}_${year}_${regionName}.png`;
      
      // Trigger the download
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Download started successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Error during download: ' + (error.message || 'Unknown error'));
    } finally {
      setLoadingImg(false);
    }
  };

  const handleDownloadTrendsData = async () => {
    if (!validateTrendsForm()) return;
    
    setLoadingTrend(true);
    
    try {
      let regionName = selectedDistrictOrProvinceTrend;
      let province;
      
      // Format the region name and get province
      if (selectedRegionTrend === 'district') {
        const district = districts.find(d => d.name === regionName);
        province = district.province;
        regionName = regionName.replace(/ /g, "_")
      } else {
        province = regionName;
      }
      
      // Map month ranges to seasons for file naming
      const isWinterSeason = selectedStartMonth === 'January' && selectedEndMonth === 'April';
      const isSummerSeason = selectedStartMonth === 'June' && selectedEndMonth === 'December';
      
      if (!isWinterSeason && !isSummerSeason) {
        toast.error('Only January-April and June-December date ranges are supported');
        setLoadingTrend(false);
        return;
      }
      
      const seasonFormat = isWinterSeason ? 'Jan-Apr' : 'Jun-Dec';
      const year = selectedStartYear;
      
      // Check if selected date range is available
      if (province === 'Sindh' && !isWinterSeason) {
        toast.error('Only Winter Season (January to April) data is available for Sindh');
        setLoadingTrend(false);
        return;
      }
      
      if (isWinterSeason && year !== '2025') {
        toast.error('Only 2025 data is available for Winter Season');
        setLoadingTrend(false);
        return;
      }
      
      if (isSummerSeason && year !== '2024') {
        toast.error('Only 2024 data is available for Summer Season');
        setLoadingTrend(false);
        return;
      }
      
      // Construct the file URL for JSON
      // const fileUrl = `${API_BASE_URL}/data/${seasonFormat}_${year}_${regionName}.json`;
      const fileUrl = `http://localhost:8000/files/json/${seasonFormat}_${year}_${regionName}.json`;
      
      // Attempt to download the file
      const response = await fetch(fileUrl);
      
      if (!response.ok) {
        toast.error(`File not available: ${response.statusText}`);
        setLoadingTrend(false);
        return;
      }
      
      let data = await response.json();
      
      // Filter data based on selected data types
      if (selectedDataTypes.length > 0) {
        const filteredData = {};
        
        if (selectedDataTypes.includes('Land Use Data') && data.landUseData) {
          filteredData.landUseData = data.landUseData;
        }
        
        if (selectedDataTypes.includes('Crop Type Data') && data.cropTypeData) {
          filteredData.cropTypeData = data.cropTypeData;
          filteredData.expectedYieldData = data.expectedYieldData;
        }
        
        data = filteredData;
      }
      
      // Create JSON file for download
      const fileContent = JSON.stringify(data, null, 2);
      const fileName = `${seasonFormat}_${year}_${regionName}.json`;
      
      // Create a blob from the content
      const blob = new Blob([fileContent], { type: 'application/json' });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      
      // Trigger the download
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Download started successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Error during download: ' + (error.message || 'Unknown error'));
    } finally {
      setLoadingTrend(false);
    }
  };

  // Form validation functions
  const validateImageForm = () => {
    if (!selectedRegionImg) {
      toast.error('Please select a region type (District or Province)');
      return false;
    }
    
    if (!selectedDistrictOrProvinceImg) {
      toast.error('Please select a district or province');
      return false;
    }
    
    if (!selectedSeason) {
      toast.error('Please select a season');
      return false;
    }
    
    if (!selectedYear) {
      toast.error('Please select a year');
      return false;
    }
    
    // Check if valid combination
    const selectedProvince = selectedRegionImg === 'province' 
      ? selectedDistrictOrProvinceImg 
      : districts.find(d => d.name === selectedDistrictOrProvinceImg)?.province;
    
    if (selectedProvince === 'Sindh' && selectedSeason === 'Summer Season (June to December)') {
      toast.error('Summer Season data is not available for Sindh');
      return false;
    }
    
    if (selectedSeason === 'Winter Season (January to May)' && selectedYear !== '2025') {
      toast.error('Only 2025 data is available for Winter Season');
      return false;
    }
    
    if (selectedSeason === 'Summer Season (June to December)' && selectedYear !== '2024') {
      toast.error('Only 2024 data is available for Summer Season');
      return false;
    }
    
    return true;
  };

  const validateTrendsForm = () => {
    if (!selectedRegionTrend) {
      toast.error('Please select a region type (District or Province)');
      return false;
    }
    
    if (!selectedDistrictOrProvinceTrend) {
      toast.error('Please select a district or province');
      return false;
    }
    
    if (!selectedStartMonth || !selectedStartYear || !selectedEndMonth || !selectedEndYear) {
      toast.error('Please select start and end dates');
      return false;
    }
    
    if (selectedDataTypes.length === 0) {
      toast.error('Please select at least one data type');
      return false;
    }
    
    // Validate time range
    const startMonthIndex = months.indexOf(selectedStartMonth);
    const endMonthIndex = months.indexOf(selectedEndMonth);
    const startDate = new Date(selectedStartYear, startMonthIndex);
    const endDate = new Date(selectedEndYear, endMonthIndex);
    
    if (startDate > endDate) {
      toast.error('Start date must be before end date');
      return false;
    }
    
    // Check if valid combination
    const selectedProvince = selectedRegionTrend === 'province' 
      ? selectedDistrictOrProvinceTrend 
      : districts.find(d => d.name === selectedDistrictOrProvinceTrend)?.province;
    
    if (selectedProvince === 'Sindh' && 
        !(selectedStartMonth === 'January' && selectedEndMonth === 'April' && selectedStartYear === '2025' && selectedEndYear === '2025')) {
      toast.error('Only January-April 2025 data is available for Sindh');
      return false;
    }
    
    // Validate date ranges
    const isWinterRange = selectedStartMonth === 'January' && selectedEndMonth === 'April';
    const isSummerRange = selectedStartMonth === 'June' && selectedEndMonth === 'December';
    
    if (!isWinterRange && !isSummerRange) {
      toast.error('Only January-April and June-December date ranges are supported');
      return false;
    }
    
    if (isWinterRange && (selectedStartYear !== '2025' || selectedEndYear !== '2025')) {
      toast.error('Winter Season data is only available for 2025');
      return false;
    }
    
    if (isSummerRange && (selectedStartYear !== '2024' || selectedEndYear !== '2024')) {
      toast.error('Summer Season data is only available for 2024');
      return false;
    }
    
    return true;
  };

  // Can the district/province select summer season?
  const canSelectSummerSeason = (regionType, selection) => {
    if (!selection) return false;
    
    if (regionType === 'province') {
      return selection === 'Punjab';
    } else {
      const district = districts.find(d => d.name === selection);
      return district && district.province === 'Punjab';
    }
  };

  return (
      <Box sx={{ p: 3, maxWidth: "80vw" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Download Image Data (PNG)
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="region-img-select-label">Select Region</InputLabel>
                <Select
                  labelId="region-img-select-label"
                  value={selectedRegionImg}
                  label="Select Region"
                  onChange={handleRegionChangeImg}
                >
                  <MenuItem value="district">District</MenuItem>
                  <MenuItem value="province">Province</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="district-or-province-img-select-label">Select District/Province</InputLabel>
                <Select
                  labelId="district-or-province-img-select-label"
                  value={selectedDistrictOrProvinceImg}
                  label="Select District/Province"
                  onChange={handleDistrictOrProvinceChangeImg}
                  disabled={!selectedRegionImg}
                >
                  {selectedRegionImg === 'district' ? 
                    districts.map((item) => (
                      <MenuItem key={item.name} value={item.name}>{item.province} - {item.name}</MenuItem>
                    )) : 
                    provinces.map((province) => (
                      <MenuItem key={province} value={province}>{province}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="season-img-select-label">Select Season</InputLabel>
                <Select
                  labelId="season-img-select-label"
                  value={selectedSeason}
                  label="Select Season"
                  onChange={handleSeasonChangeImg}
                  disabled={!selectedDistrictOrProvinceImg}
                >
                  <MenuItem value="Winter Season (January to May)">Winter Season (January to May)</MenuItem>
                  {canSelectSummerSeason(selectedRegionImg, selectedDistrictOrProvinceImg) && (
                    <MenuItem value="Summer Season (June to December)">Summer Season (June to December)</MenuItem>
                  )}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="year-img-select-label">Select Year</InputLabel>
                <Select
                  labelId="year-img-select-label"
                  value={selectedYear}
                  label="Select Year"
                  onChange={(e) => setSelectedYear(e.target.value)}
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
                variant="contained" 
                color="primary" 
                onClick={handleDownloadImageData}
                disabled={loadingImg}
                startIcon={loadingImg ? <CircularProgress size={20} /> : null}
              >
                {loadingImg ? 'Downloading...' : 'Download PNG Image'}
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Download Trends Data (JSON)
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="region-trend-select-label">Select Region</InputLabel>
                <Select
                  labelId="region-trend-select-label"
                  value={selectedRegionTrend}
                  label="Select Region"
                  onChange={handleRegionChangeTrend}
                >
                  <MenuItem value="district">District</MenuItem>
                  <MenuItem value="province">Province</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="district-or-province-trend-select-label">Select District/Province</InputLabel>
                <Select
                  labelId="district-or-province-trend-select-label"
                  value={selectedDistrictOrProvinceTrend}
                  label="Select District/Province"
                  onChange={handleDistrictOrProvinceChangeTrend}
                  disabled={!selectedRegionTrend}
                >
                  {selectedRegionTrend === 'district' ? 
                    districts.map((item) => (
                      <MenuItem key={item.name} value={item.name}>{item.province} - {item.name}</MenuItem>
                    )) : 
                    provinces.map((province) => (
                      <MenuItem key={province} value={province}>{province}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="start-month-select-label">Select Start Month</InputLabel>
                <Select
                  labelId="start-month-select-label"
                  value={selectedStartMonth}
                  label="Select Start Month"
                  onChange={(e) => setSelectedStartMonth(e.target.value)}
                  disabled={!selectedDistrictOrProvinceTrend}
                >
                  <MenuItem value="January">January</MenuItem>
                  {canSelectSummerSeason(selectedRegionTrend, selectedDistrictOrProvinceTrend) && (
                    <MenuItem value="June">June</MenuItem>
                  )}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="start-year-select-label">Select Start Year</InputLabel>
                <Select
                  labelId="start-year-select-label"
                  value={selectedStartYear}
                  label="Select Start Year"
                  onChange={(e) => setSelectedStartYear(e.target.value)}
                  disabled={!selectedStartMonth}
                >
                  {selectedStartMonth === 'January' ? (
                    <MenuItem value="2025">2025</MenuItem>
                  ) : selectedStartMonth === 'June' ? (
                    <MenuItem value="2024">2024</MenuItem>
                  ) : null}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="end-month-select-label">Select End Month</InputLabel>
                <Select
                  labelId="end-month-select-label"
                  value={selectedEndMonth}
                  label="Select End Month"
                  onChange={(e) => setSelectedEndMonth(e.target.value)}
                  disabled={!selectedStartYear}
                >
                  {selectedStartMonth === 'January' ? (
                    <MenuItem value="April">April</MenuItem>
                  ) : selectedStartMonth === 'June' ? (
                    <MenuItem value="December">December</MenuItem>
                  ) : null}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="end-year-select-label">Select End Year</InputLabel>
                <Select
                  labelId="end-year-select-label"
                  value={selectedEndYear}
                  label="Select End Year"
                  onChange={(e) => setSelectedEndYear(e.target.value)}
                  disabled={!selectedEndMonth}
                >
                  {selectedEndMonth === 'April' ? (
                    <MenuItem value="2025">2025</MenuItem>
                  ) : selectedEndMonth === 'December' ? (
                    <MenuItem value="2024">2024</MenuItem>
                  ) : null}
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
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleDownloadTrendsData}
                disabled={loadingTrend}
                startIcon={loadingTrend ? <CircularProgress size={20} /> : null}
              >
                {loadingTrend ? 'Downloading...' : 'Download JSON Data'}
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                About the Data Files
              </Typography>
              <Typography variant="body1" gutterBottom>
                <b>PNG Files:</b> Satellite imagery showing crop and land usage patterns. These can be opened in any image viewer or editing software.
              </Typography>
              <Typography variant="body1" gutterBottom>
                <b>JSON Files:</b> Structured data containing detailed land use and crop type information, which can be imported into data analysis tools or opened in text editors.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Available Data
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1 }}>Punjab:</Typography>
              <Typography variant="body1" gutterBottom>
                • Winter Season (January to April) 2025
              </Typography>
              <Typography variant="body1" gutterBottom>
                • Summer Season (June to December) 2024
              </Typography>
              
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>Sindh:</Typography>
              <Typography variant="body1" gutterBottom>
                • Winter Season (January to April) 2025 only
              </Typography>
              
              <Typography variant="body1" sx={{ mt: 2, fontStyle: 'italic' }}>
                Note: The system will automatically adjust available options based on your region selection.
                Data is limited to specific time periods for each region.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
  );
}
