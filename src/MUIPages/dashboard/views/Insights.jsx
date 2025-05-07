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
import { useTheme } from '@mui/material/styles';

const provinceData = {
  Punjab: { cropLandAcres: 11766520, wheatAcres: 6910129, cottonAcres: 1495267, otherCropsAcres: 4856391.5 },
  Sindh: { cropLandAcres: 5502436, wheatAcres: 1551068.5, cottonAcres: 448241, otherCropsAcres: 3951368.0 },
};

const topWheatDistricts = [
  { district: 'Bahawalpur', production: '1803615.00 acres' },
  { district: 'Bahawalnagar', production: '519246.50 acres' },
  { district: 'Dera Ghazi Khan', production: '471460.50 acres' },
  { district: 'Khushab', production: '469550.50 acres' },
  { district: 'Mianwali', production: '437126.00 acres' },
  { district: 'Jhang', production: '408184.00 acres' },
  { district: 'Khairpur', production: '400607.50 acres' },
  { district: 'Sargodha', production: '390001.00 acres' },
  { district: 'Bhakkar', production: '360293.00 acres' },
  { district: 'Faisalabad', production: '249359.00 acres' },
];

const topCottonDistricts = [
  { district: 'Jhang', production: '119272.00 acres' },
  { district: 'Sialkot', production: '101106.00 acres' },
  { district: 'Bahawalpur', production: '88327.00 acres' },
  { district: 'Toba Tek Singh', production: '86059.00 acres' },
  { district: 'Vehari', production: '84077.00 acres' },
  { district: 'Muzaffargarh', production: '81285.00 acres' },
  { district: 'Dera Ghazi Khan', production: '78618.00 acres' },
  { district: 'Faisalabad', production: '74265.00 acres' },
  { district: 'Gujrat', production: '73255.00 acres' },
  { district: 'Khanewal', production: '65386.00 acres' },
];

const yearlyProductionData = {
  Punjab: [5248, 5021, 5634, 5762, 6023, 6091],
  Sindh: [4210, 4019, 4400, 4590, 4709, 4812],
};

export default function Insights() {
  const theme = useTheme();
  
  return (
    <Box sx={{ p: 3, maxWidth: "80vw" }}>
    <Grid item xs={12} style={{marginBottom: "2rem"}}>
      <Paper sx={{ 
        p: 2, 
        backgroundColor: theme.palette.background.default,
        border: `1px solid ${theme.palette.divider}`, 
        mt: 2 
      }}>
        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
          <strong style={{marginRight: "1rem"}}>Note: {" "} </strong> All data is recent and updated. Data for Cotton is from the season of June to December 2024 and for Wheat is from January to May 2025
        </Typography>
      </Paper>
    </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: 150 }}>
            <Typography variant="h6" gutterBottom>
              Highest Cotton acres 2024 Summer
            </Typography>
            <Typography variant="subtitle1">
              Jhang District
            </Typography>
            <Chip label="119272.00 acres" color="success" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: 150 }}>
            <Typography variant="h6" gutterBottom>
              Highest wheat acres 2025 Winter
            </Typography>
            <Typography variant="subtitle1">
              Bahawalpur District
            </Typography>
            <Chip label="1803615.00 acres" color="success" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: 150 }}>
            <Typography variant="h6" gutterBottom>
              Highest agricultural land 2024 Summer
            </Typography>
            <Typography variant="subtitle1">
              Bahawalpur District
            </Typography>
            <Chip label="2365498 acres" color="success" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: 150 }}>
            <Typography variant="h6" gutterBottom>
              Highest agricultural land 2025 Winter
            </Typography>
            <Typography variant="subtitle1">
            Bahawalpur District
            </Typography>
            <Chip label="1852447 acres" color="success" />
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Crop Land Data by Province
            </Typography>
            <BarChart
              xAxis={[{ scaleType: 'band', data: ['Punjab', 'Sindh'] }]}
              series={[
                { data: [provinceData.Punjab.cropLandAcres, provinceData.Sindh.cropLandAcres], label: 'Crop Land Acres' },
                { data: [provinceData.Punjab.wheatAcres, provinceData.Sindh.wheatAcres], label: 'Wheat Acres' },
                { data: [provinceData.Punjab.cottonAcres, provinceData.Sindh.cottonAcres], label: 'Cotton Acres' },
                { data: [provinceData.Punjab.otherCropsAcres, provinceData.Sindh.otherCropsAcres], label: 'Other Crops Acres' },
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
