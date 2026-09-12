import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

import './registration.css';

import {
  MuiOtpInput
} from 'mui-one-time-password-input';

import {
  Button,
  Grid,
  TextField,
  Typography
} from '@mui/material';

import SignupImage from '../images/auth/signup.jpg';


const API_URL =
  process.env.REACT_APP_API_URL;


export default function Registrationpage({
  setStudentlogin
}) {

  const navigate = useNavigate();


  // =====================================================
  // REGISTRATION / OTP STATE
  // =====================================================

  const [page, setPage] =
    useState(0);

  const [otp, setOtp] =
    useState('');

  const [resendDisabled, setResendDisabled] =
    useState(true);

  const [timer, setTimer] =
    useState(60);


  // =====================================================
  // REGISTRATION DATA
  // =====================================================

  const [Registrationinfo, setRegistrationinfo] =
    useState({

      username: '',
      email: '',
      password: '',
      confirmpassword: ''

    });


  // =====================================================
  // OTP TIMER
  // =====================================================

  useEffect(() => {

    if (timer > 0) {

      const countdown =
        setTimeout(() => {
          setTimer(
            previous => previous - 1
          );
        }, 1000);


      return () => {
        clearTimeout(countdown);
      };

    }


    setResendDisabled(false);

  }, [timer]);


  // =====================================================
  // OTP VALIDATION
  // =====================================================

  const matchIsNumeric = (text) => {

    const isNumber =
      typeof text === 'number';

    const isString =
      typeof text === 'string';


    return (
      (isNumber ||
        (isString && text !== '')) &&
      !isNaN(Number(text))
    );

  };


  const validateChar = (value) => {

    return matchIsNumeric(value);

  };


  const handleotpChange = (newValue) => {

    setOtp(newValue);

  };


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handlechange = (event) => {

    const {
      name,
      value
    } = event.target;


    setRegistrationinfo(
      previous => ({
        ...previous,
        [name]: value
      })
    );

  };


  // =====================================================
  // GO BACK FROM OTP
  // =====================================================

  const backControl = async (event) => {

    event.preventDefault();


    try {

      const {
        username,
        email
      } = Registrationinfo;


      await axios.put(

        `${API_URL}/users/clearotp`,

        {
          username,
          email
        }

      );


    } catch (error) {

      console.error(
        'Clear OTP error:',
        error
      );


      alert(
        error.response?.data?.message ||
        'Unable to go back. Please try again.'
      );

    }


    setTimer(60);

    setResendDisabled(true);

    setOtp('');

    setPage(0);

  };


  // =====================================================
  // RESEND OTP
  // =====================================================

  const resendControl = async (event) => {

    event.preventDefault();


    try {

      const {
        username,
        email
      } = Registrationinfo;


      await axios.post(

        `${API_URL}/users/resendotp`,

        {
          username,
          email
        }

      );


      setTimer(60);

      setResendDisabled(true);

      setOtp('');


    } catch (error) {

      console.error(
        'Resend OTP error:',
        error
      );


      alert(
        error.response?.data?.message ||
        'Unable to resend OTP.'
      );

    }

  };


  // =====================================================
  // CREATE ACCOUNT
  // =====================================================

  const onsubmit = async (event) => {

    event.preventDefault();


    if (
      Registrationinfo.password !==
      Registrationinfo.confirmpassword
    ) {

      alert(
        'Passwords do not match.'
      );

      return;

    }


    try {

      const {
        username,
        email,
        password,
        confirmpassword
      } = Registrationinfo;


      await axios.post(

        `${API_URL}/users/register`,

        {
          username,
          email,
          password,
          confirmpassword
        }

      );


      setPage(1);

      setTimer(60);

      setResendDisabled(true);

      setOtp('');


    } catch (error) {

      console.error(
        'Registration error:',
        error
      );


      alert(
        error.response?.data?.message ||
        'Registration failed. Please try again.'
      );

    }

  };


  // =====================================================
  // VERIFY OTP
  // =====================================================

  const handleComplete = async (event) => {

    event.preventDefault();


    if (otp.length !== 6) {

      alert(
        'Please enter the complete 6-digit OTP.'
      );

      return;

    }


    try {

      const {
        username,
        email,
        password
      } = Registrationinfo;


      await axios.post(

        `${API_URL}/users/verifyotp`,

        {
          username,
          email,
          password,
          otp
        }

      );


      alert(
        'Account created successfully!'
      );


      setOtp('');

      setStudentlogin(0);


    } catch (error) {

      console.error(
        'OTP verification error:',
        error
      );


      alert(
        error.response?.data?.message ||
        'OTP verification failed.'
      );

    }

  };


  // =====================================================
  // REGISTRATION FORM
  // =====================================================

  const reggetform = () => {

    if (page === 0) {

      return (

        <div>

          <form
            className="register-form"
            id="register-form"
            onSubmit={onsubmit}
          >

            {/* USERNAME */}

            <div className="form-group">

              <TextField
                sx={{
                  width: '100%'
                }}
                id="username"
                label="Username"
                variant="outlined"
                value={
                  Registrationinfo.username
                }
                onChange={
                  handlechange
                }
                type="text"
                placeholder="Username"
                name="username"
                className="input_res"
                autoComplete="username"
                required
              />

            </div>


            {/* EMAIL */}

            <div className="form-group">

              <TextField
                sx={{
                  width: '100%'
                }}
                id="email"
                label="IITGN Email ID"
                variant="outlined"
                value={
                  Registrationinfo.email
                }
                onChange={
                  handlechange
                }
                type="email"
                placeholder="yourname@iitgn.ac.in"
                name="email"
                className="input_res"
                autoComplete="email"
                required
              />

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <TextField
                sx={{
                  width: '100%'
                }}
                id="password"
                label="Password"
                variant="outlined"
                value={
                  Registrationinfo.password
                }
                onChange={
                  handlechange
                }
                type="password"
                placeholder="Password"
                name="password"
                className="input_res"
                autoComplete="new-password"
                required
              />

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="form-group">

              <TextField
                sx={{
                  width: '100%'
                }}
                id="confirmpassword"
                label="Confirm Password"
                variant="outlined"
                value={
                  Registrationinfo.confirmpassword
                }
                onChange={
                  handlechange
                }
                type="password"
                placeholder="Confirm Password"
                name="confirmpassword"
                className="input_res"
                autoComplete="new-password"
                required
              />

            </div>


            {/* SUBMIT */}

            <div
              className="form-group form-button"
            >

              <input
                type="submit"
                name="signup"
                id="signup"
                className="form-submit reg"
                value="Create Account"
              />

            </div>

          </form>

        </div>

      );

    }


    // ===================================================
    // OTP PAGE
    // ===================================================

    return (

      <div>

        <Typography
          variant="body1"
          style={{
            marginBottom: '10px'
          }}
        >

          Enter OTP sent to{' '}

          <span
            style={{
              fontWeight: 'bold',
              color: '#1c58d9'
            }}
          >
            {Registrationinfo.email}
          </span>

        </Typography>


        <MuiOtpInput
          length={6}
          value={otp}
          onChange={
            handleotpChange
          }
          autoFocus
          validateChar={
            validateChar
          }
          TextFieldsProps={{
            placeholder: '-',
            style: {
              borderBottom: 'none'
            }
          }}
        />


        {/* VALIDATE */}

        <div
          style={{
            width: '100%',
            textAlign: 'center',
            marginTop: '25px'
          }}
        >

          <Button
            variant="contained"
            sx={{
              backgroundColor: '#1c58d9',
              '&:hover': {
                backgroundColor:
                  '#386fe5'
              }
            }}
            onClick={
              handleComplete
            }
          >
            Validate
          </Button>

        </div>


        {/* TIMER */}

        <div
          style={{
            width: '80%',
            textAlign: 'center',
            marginTop: '5px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >

          <Typography
            sx={{
              color: '#B7B7B7',
              marginTop: '4px',
              display: 'block'
            }}
          >

            {resendDisabled
              ? `Resend verification code in ${timer}s`
              : 'You can resend the verification code'}

          </Typography>

        </div>


        {/* BACK / RESEND */}

        <Grid
          container
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: '25px'
          }}
        >

          <Grid item>

            <Button
              variant="outlined"
              sx={{
                color: '#1c58d9',
                borderColor: '#1c58d9',
                '&:hover': {
                  borderColor:
                    '#386fe5'
                }
              }}
              onClick={
                backControl
              }
            >
              Go Back
            </Button>

          </Grid>


          <Grid item>

            <Button
              disabled={
                resendDisabled
              }
              sx={{
                color: '#1c58d9',
                border:
                  '1px solid #1c58d9',
                '&:hover': {
                  borderColor:
                    '#386fe5'
                }
              }}
              onClick={
                resendControl
              }
            >
              Resend OTP
            </Button>

          </Grid>

        </Grid>

      </div>

    );

  };


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div
      className="registration-page-wrapper"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage:
          `linear-gradient(
            rgba(0, 0, 0, 0.42),
            rgba(0, 0, 0, 0.42)
          ),
          url(${SignupImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '30px'
      }}
    >

      <div className="container otpform">

        <div className="signup-form">

          <h2 className="form-title reg-title">
            IIT GANDHINAGAR STUDENT REGISTRATION
          </h2>


          {reggetform()}


          <Typography
            sx={{
              textAlign: 'center',
              color: 'grey !important'
            }}
          >

            Already have an Account?{' '}

            <Link
              to="#"
              className="signin-link"
              onClick={() =>
                setStudentlogin(0)
              }
            >
              Login
            </Link>

          </Typography>

        </div>

      </div>

    </div>

  );

}