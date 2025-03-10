import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import { MapIcon } from 'lucide-react';
import { Assistant, Insights } from '@mui/icons-material';

const items = [
  {
    icon: <MapIcon sx={{ color: 'text.secondary' }} />,
    title: 'Regularly updated crop maps',
    description:
      'Regularly updated crop maps of Pakistan major areas.',
  },
  {
    icon: <Insights sx={{ color: 'text.secondary' }} />,
    title: 'Insights and predictions',
    description:
      'Insights and predictions for yield and agricultural patterns.',
  },
  {
    icon: <AutoFixHighRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Ongoing research project',
    description:
      'Part of an ongoing research project at MachVis Lab SEECS NUST.',
  },
  {
    icon: <Assistant sx={{ color: 'text.secondary' }} />,
    title: 'Zarai Rehnuma (AI)',
    description:
      'AI expert in agricultural data with tools to access data and generate insights.',
  },
];

export default function Content() {
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Agro AI
        </Typography>
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
