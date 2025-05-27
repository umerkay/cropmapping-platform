import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import DashboardIcon from '@mui/icons-material/Dashboard';
import DownloadingIcon from '@mui/icons-material/Downloading';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const items = [
  {
    icon: <AutoAwesomeIcon />,
    title: 'Zarai Rehnuma',
    description:
      'Leverage AI-driven predictions with Zarai Rahnuma, your smart agriculture guide, to make informed decisions for a sustainable future.',
  },
  {
    icon: <DashboardIcon />,
    title: 'Analytics Dashboard',
    description:
      'Explore production trends, district-level insights, and AI-powered analysis—all in one place.',
  },
  {
    icon: <DownloadingIcon />,
    title: 'Download Data',
    description:
      'Access high-resolution agricultural datasets for academic and research purposes. Download TIFF images, analytical reports, and AI-driven insights to support data-driven studies and policy development.',
  },
];

function MobileLayout() {
  return (
    <Box
      sx={{
        display: { xs: 'flex', sm: 'none' },
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {items.map(({ icon, title, description }, index) => (
        <Card key={index} variant="outlined">
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {icon}
              <Typography
                sx={{ color: 'text.primary', fontWeight: 'medium', ml: 1 }}
              >
                {title}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {description}
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
}

export default function Features() {
  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      <Box sx={{ width: { sm: '100%', md: '60%' } }}>
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: 'text.primary' }}
        >
          Product features
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', mb: { xs: 2, sm: 4 } }}
        >
          Provide a brief overview of the key features of the product. For example,
          you could list the number of features, their types or benefits, and
          add-ons.
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 3,
            width: '100%',
          }}
        >
          {items.map(({ icon, title, description }, index) => (
            <Box
              key={index}
              sx={{
                p: 3,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 1,
                  color: 'text.secondary',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>{title}</Typography>
                </Box>
                <Typography variant="body2">{description}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <MobileLayout />
      </Box>
    </Container>
  );
}
