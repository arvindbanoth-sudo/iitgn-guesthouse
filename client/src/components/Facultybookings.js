import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import VisibilityIcon from '@mui/icons-material/Visibility';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';

import './facultybooking.css';


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '550px',
  maxWidth: '90vw',
  borderRadius: '10px',
  bgcolor: 'background.paper',
  boxShadow: 24,
};


export default function Facultybookings() {

  const navigate = useNavigate();

  const [cookies] = useCookies([
    'faculty_access_token'
  ]);

  const API_URL =
    process.env.REACT_APP_API_URL;


  const [allbookings, setbookings] =
    useState([]);

  const [userinfo, setuserinfo] =
    useState(null);

  const [open, setOpen] =
    useState(false);

  const [selectedBooking, setSelectedBooking] =
    useState(null);


  // =====================================================
  // AUTH + FETCH BOOKINGS
  // =====================================================

  useEffect(() => {

    if (!cookies.faculty_access_token) {

      navigate('/faculty-login', {
        replace: true
      });

      return;

    }


    const fetchData = async () => {

      try {

        const response =
          await axios.get(
            `${API_URL}/bookings/book`,
            {
              headers: {
                'x-token':
                  cookies.faculty_access_token
              }
            }
          );


        const bookings =
          response.data?.Bookings || [];


        setbookings(
          [...bookings].reverse()
        );


        setuserinfo(
          response.data?.User || null
        );


      } catch (error) {

        console.error(
          'Error fetching faculty bookings:',
          error
        );


        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {

          navigate('/faculty-login', {
            replace: true
          });

          return;

        }


        alert(
          error.response?.data?.message ||
          'Unable to load bookings.'
        );

      }

    };


    fetchData();

  }, [
    API_URL,
    cookies.faculty_access_token,
    navigate
  ]);


  // =====================================================
  // OPEN BOOKING MODAL
  // =====================================================

  const handleOpen = (booking) => {

    setSelectedBooking(
      booking
    );

    setOpen(true);

  };


  // =====================================================
  // CLOSE BOOKING MODAL
  // =====================================================

  const handleClose = () => {

    setOpen(false);

    setSelectedBooking(null);

  };


  // =====================================================
  // HOME
  // =====================================================

  const goHome = () => {

    navigate('/facultyHomaPage');

  };


  return (

    <Box
      sx={{
        backgroundColor: '#f2f2f2',
        minHeight: '100vh'
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <Box
        sx={{
          padding: '50px 160px 0',
          position: 'sticky',
          zIndex: 2,
          top: 0,
          backgroundColor: '#afb3ba'
        }}
        className="box1"
      >

        <Button
          sx={{
            backgroundColor: '#1976d2',
            color: '#fff',
            marginBottom: '20px'
          }}
          onClick={goHome}
        >
          Home
        </Button>


        <Grid
          container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
            borderRadius: '8px 8px 0 0',
            boxShadow:
              '0 2px 20px 0 rgba(0,0,0,.1)',
            padding: '20px 20px 30px'
          }}
        >

          <Grid
            item
            sx={{
              textAlign: 'center'
            }}
          >

            <Typography
              sx={{
                color: '#000',
                fontWeight: 500,
                fontSize: '23px'
              }}
            >
              ALL BOOKINGS
            </Typography>

          </Grid>

        </Grid>

      </Box>


      {/* =================================================
          BOOKINGS
      ================================================= */}

      <Box
        sx={{
          padding: '0 160px 40px',
          position: 'relative',
          backgroundColor: '#f2f2f2'
        }}
        className="box2"
      >

        <Grid
          container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow:
              '0 3px 30px 0 rgba(0,0,0,.1)',
            gap: '24px',
            padding: '40px 60px 30px'
          }}
          className="contcont"
        >

          {allbookings.length === 0 ? (

            <Typography
              sx={{
                textAlign: 'center',
                padding: '40px'
              }}
            >
              No bookings found.
            </Typography>

          ) : (

            allbookings.map((booking) => (

              <Grid
                item
                key={booking._id}
                sx={{
                  boxShadow:
                    '0 3px 2px -2px rgba(0,0,0,.07), 0 1px 5px 0 rgba(74,74,74,.2), 0 2px 2px 0 rgba(74,74,74,.2)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >

                {/* =================================================
                    BOOKING TOP
                ================================================= */}

                <Grid
                  container
                  sx={{
                    padding: '20px 50px',
                    boxShadow:
                      '0 1px 6px 0 rgba(0,0,0,.2)',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent:
                      'space-between',
                    gap: '20px'
                  }}
                  className="cont1"
                >

                  <Grid
                    item
                    sx={{
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >

                    <Typography
                      sx={{
                        fontWeight: 620,
                        fontSize: '21px',
                        padding: '5px 10px'
                      }}
                      className="facid"
                    >
                      #{booking._id}
                    </Typography>


                    <Grid
                      item
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        padding:
                          '10px 10px 0',
                        gap: '13px'
                      }}
                      className="hedstails"
                    >

                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 700,
                          color:
                            booking.status === 'Approved'
                              ? 'green'
                              : booking.status === 'Rejected'
                                ? 'red'
                                : 'rgb(230, 163, 17)'
                        }}
                      >
                        {booking.status}
                      </Typography>


                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 500
                        }}
                      >
                        {booking.bookedon}
                      </Typography>


                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 300
                        }}
                      >
                        {userinfo?.email || ''}
                      </Typography>

                    </Grid>

                  </Grid>


                  {/* =================================================
                      VIEW BUTTON
                  ================================================= */}

                  <Grid
                    item
                    sx={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >

                    <Button
                      startIcon={
                        <VisibilityIcon />
                      }
                      onClick={() =>
                        handleOpen(booking)
                      }
                      sx={{
                        color: '#fff',
                        opacity: '.9',
                        boxShadow:
                          '0 3px 4px 0 rgba(0,0,0,.2)',
                        backgroundColor:
                          '#1976d2',
                        padding:
                          '10px 20px',
                        borderRadius: '25px',
                        '&:hover': {
                          backgroundColor:
                            '#1976d2'
                        }
                      }}
                    >
                      View Booking
                    </Button>

                  </Grid>

                </Grid>


                {/* =================================================
                    BOOKING BOTTOM
                ================================================= */}

                <Grid
                  item
                  sx={{
                    padding:
                      '34px 55px 42px'
                  }}
                  className="cont2"
                >

                  <Grid
                    container
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent:
                        'space-between',
                      alignItems: 'center',
                      gap: '15px'
                    }}
                    className="botstails"
                  >

                    <Grid item>

                      <Typography>
                        From
                      </Typography>

                      <Typography
                        sx={{
                          color: '#000',
                          fontWeight: 500
                        }}
                      >
                        {booking.fromdate}
                      </Typography>

                    </Grid>


                    <Grid item>

                      <Typography>
                        To
                      </Typography>

                      <Typography
                        sx={{
                          color: '#000',
                          fontWeight: 500
                        }}
                      >
                        {booking.enddate}
                      </Typography>

                    </Grid>


                    <Grid item>

                      <Typography
                        sx={{
                          color: '#000',
                          textAlign: 'center',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontWeight: 500
                        }}
                      >

                        <AccountCircleIcon
                          sx={{
                            color: 'grey',
                            marginRight: '5px'
                          }}
                        />

                        {userinfo?.username || ''}
                        
                      </Typography>

                    </Grid>


                    <Grid item>

                      <Typography>
                        Rooms Allocated
                      </Typography>

                      <Typography
                        sx={{
                          color: '#000',
                          fontWeight: 500
                        }}
                      >
                        {Array.isArray(booking.rooms)
                          ? booking.rooms.join(', ')
                          : ''}
                      </Typography>

                    </Grid>

                  </Grid>

                </Grid>

              </Grid>

            ))

          )}

        </Grid>

      </Box>


      {/* =================================================
          BOOKING DETAILS MODAL
      ================================================= */}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="booking-details"
        aria-describedby="booking-description"
      >

        <Box sx={modalStyle}>

          <Grid
            className="facbookdet"
            sx={{
              backgroundColor: '#48494B',
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems: 'center'
            }}
          >

            <Typography
              id="booking-details"
              variant="h6"
              component="h1"
              sx={{
                fontWeight: 'bold',
                fontSize: '25px',
                color: 'white',
                marginLeft: '10px'
              }}
            >
              Booking Details
            </Typography>


            <CloseIcon
              onClick={handleClose}
              sx={{
                marginRight: '10px',
                color: 'white',
                cursor: 'pointer'
              }}
            />

          </Grid>


          {selectedBooking && (

            <>

              <Grid
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginLeft: '25px',
                  marginTop: '15px'
                }}
              >

                <Typography
                  variant="subtitle1"
                  sx={{
                    marginBottom: 0,
                    fontSize: '13px'
                  }}
                >
                  Name: {userinfo?.username || ''}
                </Typography>


                <Typography
                  variant="subtitle1"
                  sx={{
                    marginBottom: 0,
                    fontSize: '13px'
                  }}
                >
                  Email: {userinfo?.email || ''}
                </Typography>


                <Typography
                  variant="subtitle1"
                  sx={{
                    marginBottom: 0,
                    fontSize: '13px'
                  }}
                >
                  Phone Number: {selectedBooking.phonenumber}
                </Typography>

              </Grid>


              <Grid
                sx={{
                  backgroundColor: '#EEEEEE',
                  marginBottom: '60px',
                  marginTop: '40px',
                  padding: '25px'
                }}
              >

                <Typography
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '20px',
                    color: '#48494B'
                  }}
                >
                  Details
                </Typography>


                <Typography
                  id="booking-description"
                  sx={{
                    mt: 2
                  }}
                >

                  <Grid container>

                    <Grid item xs={6}>

                      <Typography
                        sx={{
                          color: 'black',
                          fontSize: '15px'
                        }}
                      >
                        Name:{' '}
                        {selectedBooking.firstname}{' '}
                        {selectedBooking.lastname}
                      </Typography>

                    </Grid>


                    <Grid item xs={6}>

                      <Typography
                        sx={{
                          color: 'black',
                          fontSize: '15px'
                        }}
                      >
                        Email:{' '}
                        {selectedBooking.email}
                      </Typography>

                    </Grid>

                  </Grid>


                  <Grid container>

                    <Grid item xs={6}>

                      <Typography
                        sx={{
                          color: 'black',
                          fontSize: '15px'
                        }}
                      >
                        Phone number:{' '}
                        {selectedBooking.phonenumber}
                      </Typography>

                    </Grid>


                    <Grid item xs={6}>

                      <Typography
                        sx={{
                          color: 'black',
                          fontSize: '15px'
                        }}
                      >
                        Address:{' '}
                        {selectedBooking.address}
                      </Typography>

                    </Grid>

                  </Grid>


                  <Grid container>

                    <Grid item xs={6}>

                      <Typography
                        sx={{
                          color: 'black',
                          fontSize: '15px'
                        }}
                      >
                        From Date:{' '}
                        {selectedBooking.fromdate}
                      </Typography>

                    </Grid>


                    <Grid item xs={6}>

                      <Typography
                        sx={{
                          color: 'black',
                          fontSize: '15px'
                        }}
                      >
                        End Date:{' '}
                        {selectedBooking.enddate}
                      </Typography>

                    </Grid>

                  </Grid>


                  <Grid container>

                    <Grid item xs={6}>

                      <Typography
                        sx={{
                          color: 'black',
                          fontSize: '15px'
                        }}
                      >
                        Number of rooms:{' '}
                        {selectedBooking.rooms?.length || 0}
                      </Typography>

                    </Grid>


                    <Grid item xs={6}>

                      <Typography
                        sx={{
                          color: 'black',
                          fontSize: '15px'
                        }}
                      >
                        Room number:{' '}
                        {selectedBooking.rooms?.join(', ') || ''}
                      </Typography>

                    </Grid>

                  </Grid>


                  <Grid container>

                    <Grid item xs={6}>

                      <Typography
                        sx={{
                          color: 'black',
                          fontSize: '15px'
                        }}
                      >
                        Meals:{' '}
                        {selectedBooking.meals}
                      </Typography>

                    </Grid>


                    <Grid item xs={6}>

                      <Typography
                        sx={{
                          color: 'black',
                          fontSize: '15px'
                        }}
                      >
                        Purpose:{' '}
                        {selectedBooking.purpose ||
                          'Not specified'}
                      </Typography>

                    </Grid>

                  </Grid>


                  <Grid container>

                    <Grid item xs={12}>

                      <Typography
                        sx={{
                          color: 'black',
                          fontSize: '15px'
                        }}
                      >
                        Special Request:{' '}
                        {selectedBooking.specialrequest ||
                          'None'}
                      </Typography>

                    </Grid>

                  </Grid>

                </Typography>

              </Grid>

            </>

          )}

        </Box>

      </Modal>

    </Box>

  );

}