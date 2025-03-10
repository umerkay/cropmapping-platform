import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { display, useTheme } from '@mui/system';

const whiteLogos = [
  '../../../src/assets/tum-logo.png',
  '../../../src/assets/rptu logo.gif',
  '../../../src/assets/MachVis Logo.png',
  '../../../src/assets/NUST.png',
];

const darkLogos = [
  '../../../src/assets/tum-logo.png',
  '../../../src/assets/rptu logo.gif',
  '../../../src/assets/MachVis Logo.png',
  '../../../src/assets/NUST.png',
];

const logoStyle = {
  width: '100px',
  height: 'auto',
  margin: '0 32px',
  opacity: 0.7,
};

export default function LogoCollection() {
  const theme = useTheme();
  const logos = theme.palette.mode === 'light' ? darkLogos : whiteLogos;

  return (
    <Box id="logoCollection" sx={{ py: 4 }}>
      <Typography
        component="p"
        variant="subtitle2"
        align="center"
        sx={{ color: 'text.secondary' }}
      >
        Trusted by the best companies
      </Typography>
      <Grid container sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 'auto',
        padding: '0 16px',
        margin: '20px 0'
      }}>

        {logos.map((logo, index) => (
          <span key={index}>
            <img
              src={logo}
              alt={`Fake company number ${index + 1}`}
              style={logoStyle}
            />
          </span>
        ))}
      </Grid>
    </Box>
  );
}
