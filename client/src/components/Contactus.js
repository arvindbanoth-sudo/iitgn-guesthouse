import React from 'react';
import './contactus.css';
import Contactcomponent from './Contactcomponent';

import { Box } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import MailIcon from '@mui/icons-material/Mail';

export default function Contactus() {
  return (
    <div className="homecomp5">

      <Box className="contact-details">

        {/* Address */}
        <Contactcomponent
          heading="Address"
          data={
            "Indian Institute of Technology Gandhinagar, Palaj, Gandhinagar, Gujarat - 382055, India"
          }
          icon={
            <LocationOnIcon
              sx={{
                fontSize: '40px',
                fill: '#1e1e1e'
              }}
            />
          }
        />

        {/* Phone */}
        <Contactcomponent
          heading="Phone Number"
          data="+91 79 2395 1062"
          icon={
            <PhoneIcon
              sx={{
                fontSize: '40px',
                fill: '#1e1e1e'
              }}
            />
          }
        />

        {/* Email */}
        <Contactcomponent
          heading="Email"
          data="hospitality@iitgn.ac.in"
          icon={
            <MailIcon
              sx={{
                fontSize: '40px',
                fill: '#1e1e1e'
              }}
            />
          }
        />

      </Box>

    </div>
  );
}