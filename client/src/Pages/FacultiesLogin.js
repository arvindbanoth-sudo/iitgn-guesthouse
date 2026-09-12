import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

import './registration.css';

import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';

export default function FacultiesLogin({
  setfacultyLogin
}) {

  const [, setCookies] =
    useCookies(['faculty_access_token']);

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
          `${API_URL}/users/facultylogin`,
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
        'faculty_access_token',
        response.data.token,
        {
          path: '/',
          sameSite: 'lax'
        }
      );


      navigate('/facultyHomaPage');


    } catch (error) {

      console.error(
        'Faculty login error:',
        error
      );


      alert(
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please check your credentials.'
      );

    }

  };


  return (

    <div className="container">

      <div className="signin-form">

        <h2 className="form-title">
          IIT GANDHINAGAR FACULTY LOGIN
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

              id="faculty-username"

              label="Username Or Email ID"

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

              id="faculty-password"

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
              className="forgotpassword"
              to="#"
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
              setfacultyLogin(1)
            }
          >
            Create an account
          </Link>

        </Typography>

      </div>

    </div>

  );

}