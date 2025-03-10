import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { LineChart } from '@mui/x-charts/LineChart';
import { Link } from 'react-router-dom';
import Chip from '@mui/material/Chip';

const provinceData = {
  Punjab: { cropLandAcres: 5123, cottonAcres: 3123, wheatAcres: 2123, expectedYieldCotton: 1512, expectedYieldWheat: 1012 },
  Sindh: { cropLandAcres: 4123, cottonAcres: 2512, wheatAcres: 1512, expectedYieldCotton: 1213, expectedYieldWheat: 812 },
  Balochistan: { cropLandAcres: 3123, cottonAcres: 2012, wheatAcres: 1012, expectedYieldCotton: 1012, expectedYieldWheat: 612 },
  KPK: { cropLandAcres: 2123, cottonAcres: 1012, wheatAcres: 1012, expectedYieldCotton: 512, expectedYieldWheat: 512 },
};

const topWheatDistricts = [
  { district: 'Faisalabad', production: '1213 kg/hectare' },
  { district: 'Multan', production: '1112 kg/hectare' },
  { district: 'Sahiwal', production: '1012 kg/hectare' },
  { district: 'Bahawalpur', production: '912 kg/hectare' },
  { district: 'Sargodha', production: '812 kg/hectare' },
  { district: 'Gujranwala', production: '712 kg/hectare' },
  { district: 'Lahore', production: '612 kg/hectare' },
  { district: 'Sheikhupura', production: '512 kg/hectare' },
  { district: 'Kasur', production: '412 kg/hectare' },
  { district: 'Okara', production: '312 kg/hectare' },
];

const topCottonDistricts = [
  { district: 'Hyderabad', production: '1512 kg/hectare' },
  { district: 'Sukkur', production: '1412 kg/hectare' },
  { district: 'Nawabshah', production: '1312 kg/hectare' },
  { district: 'Mirpur Khas', production: '1212 kg/hectare' },
  { district: 'Larkana', production: '1112 kg/hectare' },
  { district: 'Khairpur', production: '1012 kg/hectare' },
  { district: 'Dadu', production: '912 kg/hectare' },
  { district: 'Badin', production: '812 kg/hectare' },
  { district: 'Thatta', production: '712 kg/hectare' },
  { district: 'Shikarpur', production: '612 kg/hectare' },
];

const yearlyProductionData = {
  Punjab: [5248, 5021, 5634, 5762, 6023, 6091],
  Sindh: [4210, 4019, 4400, 4590, 4709, 4812],
  Balochistan: [1032, 956, 976, 1091, 1021, 902],
  KPK: [1132, 1001, 1120, 1191, 1021, 1092],
};

function getRandomValue() {
  return Math.min(Math.floor(Math.random() * 1000 + 400), 979);
}

export default function Insights() {
  return (
    <Box sx={{ p: 3, maxWidth: "80vw" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: 150 }}>
            <Typography variant="h6" gutterBottom>
              Highest Agricultural Output 2024
            </Typography>
            <Typography variant="subtitle1">
              Faisalabad District
            </Typography>
            <Chip label={getRandomValue() + " metric tonnes"} color="success" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: 150 }}>
            <Typography variant="h6" gutterBottom>
              Highest Predicted Crop Yield 2025
            </Typography>
            <Typography variant="subtitle1">
              Multan District
            </Typography>
            <Chip label={getRandomValue() + " metric tonnes"} color="success" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: 150 }}>
            <Typography variant="h6" gutterBottom>
              Highest Crop Yield 2024
            </Typography>
            <Typography variant="subtitle1">
              Sahiwal District
            </Typography>
            <Chip label={getRandomValue() + " metric tonnes"} color="success" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: 150 }}>
            <Typography variant="h6" gutterBottom>
            Highest Crop Land % 2024
            </Typography>
            <Typography variant="subtitle1">
              Bahawalpur District
            </Typography>
            <Chip label={getRandomValue()/10 + "%"} color="success" />
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Crop Land and Yield Data by Province
            </Typography>
            <BarChart
              xAxis={[{ scaleType: 'band', data: ['Punjab', 'Sindh', 'Balochistan', 'KPK'] }]}
              series={[
                { data: [provinceData.Punjab.cropLandAcres, provinceData.Sindh.cropLandAcres, provinceData.Balochistan.cropLandAcres, provinceData.KPK.cropLandAcres], label: 'Crop Land Acres' },
                { data: [provinceData.Punjab.cottonAcres, provinceData.Sindh.cottonAcres, provinceData.Balochistan.cottonAcres, provinceData.KPK.cottonAcres], label: 'Cotton Acres' },
                { data: [provinceData.Punjab.wheatAcres, provinceData.Sindh.wheatAcres, provinceData.Balochistan.wheatAcres, provinceData.KPK.wheatAcres], label: 'Wheat Acres' },
                { data: [provinceData.Punjab.expectedYieldCotton, provinceData.Sindh.expectedYieldCotton, provinceData.Balochistan.expectedYieldCotton, provinceData.KPK.expectedYieldCotton], label: 'Expected Yield Cotton' },
                { data: [provinceData.Punjab.expectedYieldWheat, provinceData.Sindh.expectedYieldWheat, provinceData.Balochistan.expectedYieldWheat, provinceData.KPK.expectedYieldWheat], label: 'Expected Yield Wheat' },
              ]}
              width={800}
              height={400}
            />
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Yearly Production by Province
            </Typography>
            <LineChart
              xAxis={[{ scaleType: 'band', data: ['2019', '2020', '2021', '2022', '2023', '2024'] }]}
              series={[
                { data: yearlyProductionData.Punjab, label: 'Punjab', style: { strokeDasharray: '0' } },
                { data: yearlyProductionData.Sindh, label: 'Sindh', style: { strokeDasharray: '0' } },
                { data: yearlyProductionData.Balochistan, label: 'Balochistan', style: { strokeDasharray: '0' } },
                { data: yearlyProductionData.KPK, label: 'KPK', style: { strokeDasharray: '0' } },
              ]}
              height={400}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top 10 Districts by Wheat Production
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>District</TableCell>
                    <TableCell>Production</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topWheatDistricts.map((district) => (
                    <TableRow key={district.district}>
                      <TableCell>
                        <Link to={`/dashboard?view=District&district=${district.district.toLowerCase()}`}>
                          {district.district}
                        </Link>
                      </TableCell>
                      <TableCell>{district.production}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top 10 Districts by Cotton Production
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>District</TableCell>
                    <TableCell>Production</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topCottonDistricts.map((district) => (
                    <TableRow key={district.district}>
                      <TableCell>
                        <Link to={`/dashboard?view=District&district=${district.district.toLowerCase()}`}>
                          {district.district}
                        </Link>
                      </TableCell>
                      <TableCell>{district.production}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
