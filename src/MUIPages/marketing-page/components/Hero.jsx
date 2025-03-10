import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import visuallyHidden from '@mui/utils/visuallyHidden';
import Sitemark from './SitemarkIcon';
import { styled } from '@mui/material/styles';
import Globe from 'react-globe.gl';
import imggg from '../../../assets/pexels-pixabay-87651.jpg';

const StyledBox = styled('div')(({ theme }) => ({
  alignSelf: 'center',
  height: 'auto',
  marginTop: theme.spacing(8),
  borderRadius: (theme.vars || theme).shape.borderRadius,
  outline: '6px solid',
  outlineColor: 'hsla(220, 25%, 80%, 0.2)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.grey[200],
  boxShadow: '0 0 12px 8px hsla(220, 25%, 80%, 0.2)',
  backgroundImage: `url(../../../src/assets/dashboard_light.jpg)`,
  backgroundSize: 'cover',
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(10),
    height: 600,
    width: '100%',
  },
  ...theme.applyStyles('dark', {
    boxShadow: '0 0 24px 12px hsla(210, 100%, 25%, 0.2)',
    backgroundImage: `url(../../../src/assets/dashboard_dark.jpg)`,
    outlineColor: 'hsla(220, 20%, 42%, 0.1)',
    borderColor: (theme.vars || theme).palette.grey[700],
  }),
}));

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={{
        overflowX: 'hidden'
      }}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Stack
          spacing={2}
          sx={{
            alignItems: 'flex-start',
            display: 'flex',
            paddingLeft: "15rem",
            alignContent: 'flex-start',
            position: 'relative',
            justifyContent: 'center',
            width: '99.7vw',
            minHeight: '101vh',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0)',
              zIndex: -1,
              textAlign: "left",
            }}
          />
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              fontSize: 'clamp(3rem, 10vw, 3.5rem)',
              color: 'white',
              textShadow: '0 0 12px rgba(0, 0, 0, 0.64)',
            }}
          >
            </Typography>
          <Typography
            sx={{
              textAlign: 'left',
              color: 'white',
              fontSize: '4rem',
              fontWeight: 'bold',
              width: { sm: '100%', md: '80%' },
              textShadow: '0 0 12px rgba(0, 0, 0, 0.64)',
            }}
          >
            AgroData
          </Typography>  
          <Typography
            sx={{
              textAlign: 'left',
              color: 'white',
              fontSize: 'clamp(1rem, 5vw, 1.5rem)',
              width: { sm: '100%', md: '80%' },
            }}
          >
            Precise Data. Smarter Policies. Better Agriculture
          </Typography>
          <Typography
            sx={{
              textAlign: 'left',
              color: 'white',
              width: { sm: '100%', md: '40%' },
            }}
          >
          Gain deep agricultural insights with AgroData—a powerful analytics platform for policymakers and stakeholders. Leverage AI-driven predictions with Zarai Rahnuma, your smart agriculture guide, to make informed decisions for a sustainable future. Explore production trends, district-level insights, and AI-powered analysis—all in one place.
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              right: '11rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
            }}
          >
            <img src={imggg} alt="" width={700} />
          </Box>
        </Stack>
        <StyledBox id="image" />
      </Container>
    </Box>
  );
}
