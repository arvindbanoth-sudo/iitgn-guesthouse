import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Detail = () => {
  const navigate = useNavigate();

  const [cookies] = useCookies([
    'admin_access_token'
  ]);

  const [booking, setBooking] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL;


  // Check admin authentication
  useEffect(() => {
    if (!cookies.admin_access_token) {
      navigate('/admin-login', {
        replace: true
      });
    }
  }, [cookies.admin_access_token, navigate]);


  // Get all bookings
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

        setBooking(
          response.data.Bookings || []
        );

      } catch (error) {

        console.error(
          'Error fetching booking details:',
          error
        );

        if (error.response?.status === 401) {
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
    navigate
  ]);


  return (
    <Card booking={booking} />
  );
};

export default Detail;