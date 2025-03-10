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
        overflowX:'hidden'
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
            alignItems: 'center',
            display: 'flex',
            alignContent: 'center',
            position: 'relative',
            justifyContent: 'center',
            width: { xs: '100%', sm: '70%' },
              width: '99.7vw',
              minHeight: '101vh',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center', 
              overflow:'hidden'
          }}
        >

          <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url('https://img.freepik.com/free-photo/glowing-liquid-waves-illuminate-dark-stratosphere-sphere-generated-by-ai_188544-37230.jpg?t=st=1741633674~exp=1741637274~hmac=79e2132f29700ae11a45cd664f7dbbe214cb3b350d168974b871a94880da30c3&w=2000')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: 'blur(0px)', // Apply blur only to this Box
                zIndex: -1, // Keeps background behind content
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
              textAlign: 'center',
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
              textAlign: 'center',
              color: 'white',
              fontSize: 'clamp(1rem, 5vw, 1.5rem)',
              width: { sm: '100%', md: '80%' },
            }}
          >
            Precise Data. Smarter Policies. Better Agriculture
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: 'white',
              width: { sm: '100%', md: '80%' },
            }}
          >
          Gain deep agricultural insights with AgroData—a powerful analytics platform for policymakers and stakeholders. Leverage AI-driven predictions with Kisan Rahnuma, your smart agriculture guide, to make informed decisions for a sustainable future. Explore production trends, district-level insights, and AI-powered analysis—all in one place.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            useFlexGap
            display={{ xs: 'flex', sm: 'grid' }}
            sx={{ pt: 2, width: { xs: '120px', sm: '120px' } }}
          >
            
            <Button
              width="100px"
              size="small"

              sx={{ minWidth: 'fit-content', 
                backgroundColor: '#f2b558',
                color: "black!important",
                ":hover":{
                  backgroundColor: 'rgb(218, 156, 63)',
                  color: "black!important"
                }
              }}
            >
              Get Started
            </Button>
          </Stack>
        </Stack>
        <StyledBox id="image" />
      </Container>
    </Box>
  );
}
