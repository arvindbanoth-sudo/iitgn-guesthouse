import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import './registration.css';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';

import LoginImage from '../images/auth/login.jpg';


export default function Loginpage({ setStudentlogin }) {

  const [, setCookies] =
    useCookies(['access_token']);

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
  // LOGIN
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
          `${API_URL}/users/login`,
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
        'access_token',
        response.data.token,
        {
          path: '/',
          sameSite: 'lax'
        }
      );


      navigate('/home');

    } catch (error) {

      console.error(
        'Student login error:',
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

    <div
      className="login-page-wrapper"
      style={{
        minHeight: '100vh',
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
        padding: '30px'
      }}
    >

      <div className="container">

        <div className="signin-form">

          <h2 className="form-title">
            IIT GANDHINAGAR STUDENT LOGIN
          </h2>


          <form
            onSubmit={onsubmit}
            className="login-form"
          >

            {/* =================================================
                USERNAME
            ================================================= */}

            <div className="form-group">

              <TextField

                sx={{
                  width: '100%'
                }}

                id="student-username"

                label="Username or Email ID"

                variant="outlined"

                value={
                  logininfo.username
                }

                onChange={
                  handlechange
                }

                autoComplete="username"

                required

                placeholder="Username or Email"

                name="username"

                className="input_res"

              />

            </div>


            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="form-group">

              <TextField

                sx={{
                  width: '100%'
                }}

                id="student-password"

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


            {/* =================================================
                FORGOT PASSWORD
            ================================================= */}

            <div>

              <Link
                to="#"
                className="forgotpassword"
                onClick={(event) =>
                  event.preventDefault()
                }
              >
                Forgot your password?
              </Link>

            </div>


            {/* =================================================
                LOGIN BUTTON
            ================================================= */}

            <div className="form-group form-button">

              <input
                type="submit"
                name="signin"
                id="signin"
                className="form-submit"
                value="Log in"
              />

            </div>

          </form>


          {/* =================================================
              REGISTRATION
          ================================================= */}

          <Typography
            sx={{
              textAlign: 'center',
              color: 'grey'
            }}
          >

            Don't have an Account?{' '}

            <Link
              to="#"
              className="signup-link"
              onClick={() =>
                setStudentlogin(1)
              }
            >
              Create an account
            </Link>

          </Typography>

        </div>

      </div>

    </div>

  );

}