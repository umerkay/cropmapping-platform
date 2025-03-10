import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import Box from '@mui/material/Box';
import LogoIMG from '../../../assets/AGRO.png'
import { Link } from 'react-router-dom';


function AgricultureIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 3.87 3.13 7 7 7s7-3.13 7-7c0-3.87-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm-1-9h2v6h-2zm-1 8h4v2h-4z" />
    </SvgIcon>
  );
}

export default function Logo() {
  return (
    <Link to={"/"} style={{ textDecoration: 'none' }}>
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <img src={LogoIMG} alt="AGRO" style={{ maxWidth: '200px' }} />
    </Box>
    </Link>
  );
}
