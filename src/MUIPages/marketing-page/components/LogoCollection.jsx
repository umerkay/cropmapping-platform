import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { display, useTheme } from '@mui/system';

import tumLogo from '../../../assets/tum-logo.png';
import rptuLogo from '../../../assets/rptu logo.gif';
import machVisLogo from '../../../assets/MachVis Logo.png';
import nustLogo from '../../../assets/NUST.png';

const whiteLogos = [
  tumLogo,
  rptuLogo,
  machVisLogo,
  nustLogo,
];

const darkLogos = [
  tumLogo,
  rptuLogo,
  machVisLogo,
  nustLogo,
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
    <Box id="logoCollection" sx={{ py: 4, backgroundColor: "white", width: 800, margin: "auto", marginTop: "5rem", borderRadius: 1 }}>
      <Typography
        component="p"
        variant="subtitle1"
        align="center"
        sx={{ color: 'text.secondary', fontWeight: 600 }}
      >
        In Collaboration With
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
