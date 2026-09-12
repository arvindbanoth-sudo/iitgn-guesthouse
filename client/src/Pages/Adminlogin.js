import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

import './registration.css';

import { Box, TextField, Typography } from '@mui/material';

import LoginImage from '../images/auth/login.jpg';


export default function AdminLoginpage() {

  const [, setCookies] =
    useCookies(['admin_access_token']);

  const [logininfo, setLogininfo] =
    useState({
      username: '',
      password: ''
    });

  const navigate = useNavigate();

  const API_URL =
    process.env.REACT_APP_API_URL;


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handlechange = (event) => {

    const {
      name,
      value
    } = event.target;

    setLogininfo(previous => ({
      ...previous,
      [name]: value
    }));

  };


  // =====================================================
  // ADMIN LOGIN
  // =====================================================

  const onsubmit = async (event) => {

    event.preventDefault();

    try {

      const {
        username,
        password
      } = logininfo;


      const response =
        await axios.post(
          `${API_URL}/users/adminlogin`,
          {
            username,
            password
          }
        );


      if (!response.data?.token) {

        throw new Error(
          'Authentication token not received'
        );

      }


      setCookies(
        'admin_access_token',
        response.data.token,
        {
          path: '/',
          sameSite: 'lax'
        }
      );


      navigate(
        '/dashboard/admins'
      );


    } catch (error) {

      console.error(
        'Admin login error:',
        error
      );


      alert(
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please check your username and password.'
      );

    }

  };


  return (

    <Box
      className="login-page-wrapper"

      sx={{
        minHeight: '100vh',
        width: '100%',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        backgroundImage:
          `linear-gradient(
            rgba(0, 0, 0, 0.45),
            rgba(0, 0, 0, 0.45)
          ),
          url(${LoginImage})`,

        backgroundSize: 'cover',

        backgroundPosition: 'center',

        backgroundRepeat: 'no-repeat',

        padding: '30px',

        boxSizing: 'border-box'
      }}
    >

      <div className="container">

        <div className="signin-form">

          <h2 className="form-title">
            IIT GANDHINAGAR ADMIN LOGIN
          </h2>


          <form
            className="login-form"
            onSubmit={onsubmit}
          >

            {/* USERNAME */}

            <div className="form-group">

              <TextField

                sx={{
                  width: '100%'
                }}

                id="admin-username"

                label="Username"

                variant="outlined"

                value={
                  logininfo.username
                }

                onChange={
                  handlechange
                }

                autoComplete="username"

                required

                placeholder="Username"

                name="username"

                className="input_res"

              />

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <TextField

                sx={{
                  width: '100%'
                }}

                id="admin-password"

                label="Password"

                variant="outlined"

                value={
                  logininfo.password
                }

                onChange={
                  handlechange
                }

                type="password"

                placeholder="Password"

                name="password"

                autoComplete="current-password"

                required

                className="input_res"

              />

            </div>


            {/* LOGIN BUTTON */}

            <div
              className="form-group form-button"
            >

              <input
                type="submit"
                name="signin"
                id="signin"
                className="form-submit"
                value="Log in"
              />

            </div>

          </form>

        </div>

      </div>

    </Box>

  );

}