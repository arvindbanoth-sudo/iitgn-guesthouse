import { Box } from '@mui/material';
import React, { useState } from 'react';
import Loginpage from './Loginpage';
import Registrationpage from './Registrationpage';

export default function Studentlogin() {
  const [studentLogin, setStudentlogin] = useState(0);

  const renderLoginform = (loginPage) => {
    switch (loginPage) {
      case 0:
        return (
          <Loginpage setStudentlogin={setStudentlogin} />
        );

      case 1:
        return (
          <Registrationpage setStudentlogin={setStudentlogin} />
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',

        backgroundImage: `
          linear-gradient(
            0deg,
            rgba(7, 15, 41, 0.85),
            rgba(25, 34, 61, 0.62) 20%,
            rgba(84, 103, 161, 0.39),
            rgba(255, 255, 255, 0)
          ),
          url('/images/iitgn-campus.jpg')
        `,

        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',

        padding: '3%',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        boxSizing: 'border-box'
      }}
    >
      {renderLoginform(studentLogin)}
    </Box>
  );
}