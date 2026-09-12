import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Button } from '@mui/material';

const AdminallBookings = () => {
  const navigate = useNavigate();

  const [cookies, , removeCookie] = useCookies([
    'admin_access_token'
  ]);

  const [studentbooking, setStudentbooking] = useState([]);
  const [facultybookings, setFacultybookings] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [change, setChange] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  // Check admin authentication
  useEffect(() => {
    if (!cookies.admin_access_token) {
      navigate('/admin-login', { replace: true });
    }
  }, [cookies.admin_access_token, navigate]);

  // Get all student and faculty bookings
  useEffect(() => {
    const gettingBookings = async () => {
      if (!cookies.admin_access_token) {
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/admibookings/bookings`,
          {
            headers: {
              'x-token': cookies.admin_access_token
            }
          }
        );

        setStudentbooking(
          response.data.Studentbookings || []
        );

        setFacultybookings(
          response.data.Facultybookings || []
        );

      } catch (error) {
        console.error(
          'Error getting bookings:',
          error
        );

        // If the token is invalid/expired
        if (error.response?.status === 401) {
          removeCookie('admin_access_token', {
            path: '/'
          });

          navigate('/admin-login', {
            replace: true
          });
        }
      }
    };

    gettingBookings();

  }, [
    API_URL,
    cookies.admin_access_token,
    refresh,
    navigate,
    removeCookie
  ]);

  return (
    <Box
      sx={{
        paddingTop: '120px',
        width: '90%',
        margin: 'auto'
      }}
    >

      {/* STUDENT / FACULTY SWITCH */}
      <Grid
        container
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '20px',
          marginBottom: '25px'
        }}
      >

        <Button
          variant="contained"
          onClick={() => setChange(false)}
          sx={{
            backgroundColor: '#696cff',
            '&:hover': {
              backgroundColor: '#595bd9'
            }
          }}
        >
          Students
        </Button>

        <Button
          variant="contained"
          onClick={() => setChange(true)}
          sx={{
            backgroundColor: '#696cff',
            '&:hover': {
              backgroundColor: '#595bd9'
            }
          }}
        >
          Faculty
        </Button>

      </Grid>


      {/* BOOKINGS TABLE */}
      {change ? (
        <Table
          booking={facultybookings}
          setrefresh={setRefresh}
        />
      ) : (
        <Table
          booking={studentbooking}
          setrefresh={setRefresh}
        />
      )}

    </Box>
  );
};

export default AdminallBookings;