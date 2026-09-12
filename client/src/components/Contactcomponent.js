import React from 'react';
import Paper from '@mui/material/Paper';
import './contactus.css'
import { Box, Grid, Link, Typography } from '@mui/material';

export default function Contactcomponent({ heading, data, icon }) {
  return (
    <Box className='contactcomponent'>
        <Grid
          container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Grid item style={{ textAlign: 'center', }}>
              {icon}
          </Grid>
          <Grid item style={{ textAlign: 'center' }}>
            <Typography sx={{ fontWeight: '600', fontSize: '20px',color:'rgb(113, 42, 42)' }}>
              {heading}
            </Typography>
          </Grid>
          <Grid item style={{ textAlign: 'center' }}>
            <Link sx={{ textDecoration: 'none', color: '#333' }}>{data}</Link>
          </Grid>
        </Grid>
      </Box>
  );
}
