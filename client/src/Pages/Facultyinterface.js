import React from 'react';
import Facultyheader from '../components/Facultyheader';
import Facultyform from '../components/Facultyform';
import Facultybookings from '../components/Facultybookings';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

export default function Facultyinterface() {
  return (
    <Box>
      <Facultyheader />
      <Box >
        <Routes>
          <Route path="/" element={<Facultyform />} />
          <Route path="/bookings" element={<Facultybookings />} />
        </Routes>
      </Box>
    </Box>
  );
}
