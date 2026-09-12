import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Typography, TextField } from '@mui/material';

import './registration.css';

export default function Facultyregistration({ setfacultyLogin }) {

  const API_URL = process.env.REACT_APP_API_URL;

  const [registrationInfo, setRegistrationInfo] = useState({
    username: '',
    email: '',
    password: '',
    confirmpassword: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setRegistrationInfo({
      ...registrationInfo,
      [name]: value
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const {
      username,
      email,
      password,
      confirmpassword
    } = registrationInfo;

    // Check IIT Gandhinagar email
    if (!email.toLowerCase().endsWith('@iitgn.ac.in')) {
      alert('Please use your IIT Gandhinagar email address (@iitgn.ac.in).');
      return;
    }

    // Check password match
    if (password !== confirmpassword) {
      alert('Passwords do not match.');
      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(
        `${API_URL}/users/facultyregister`,
        {
          username,
          email,
          password,
          confirmpassword
        }
      );

      console.log(response.data);

      alert(
        response.data.message ||
        'Faculty account created successfully!'
      );

      // Return to faculty login
      setfacultyLogin(0);

    } catch (error) {

      console.error('Faculty registration error:', error);

      alert(
        error.response?.data?.message ||
        'Registration failed. Please try again.'
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="container otpform">

      <div className="signup-form">

        <h2 className="form-title reg-title">
          IIT GANDHINAGAR FACULTY REGISTRATION
        </h2>

        <form
          className="register-form"
          id="register-form"
          onSubmit={onSubmit}
        >

          {/* Username */}

          <div className="form-group">

            <TextField
              sx={{ width: '100%' }}
              id="faculty-username"
              label="Username"
              variant="outlined"
              value={registrationInfo.username}
              onChange={handleChange}
              type="text"
              placeholder="Username"
              name="username"
              className="input_res"
              autoComplete="off"
              required
            />

          </div>


          {/* IITGN Email */}

          <div className="form-group">

            <TextField
              sx={{ width: '100%' }}
              id="faculty-email"
              label="IITGN Email ID"
              variant="outlined"
              value={registrationInfo.email}
              onChange={handleChange}
              type="email"
              placeholder="yourname@iitgn.ac.in"
              name="email"
              className="input_res"
              autoComplete="email"
              required
            />

          </div>


          {/* Password */}

          <div className="form-group">

            <TextField
              sx={{ width: '100%' }}
              id="faculty-password"
              label="Password"
              variant="outlined"
              value={registrationInfo.password}
              onChange={handleChange}
              type="password"
              placeholder="Password"
              name="password"
              className="input_res"
              autoComplete="new-password"
              required
            />

          </div>


          {/* Confirm Password */}

          <div className="form-group">

            <TextField
              sx={{ width: '100%' }}
              id="faculty-confirm-password"
              label="Confirm Password"
              variant="outlined"
              value={registrationInfo.confirmpassword}
              onChange={handleChange}
              type="password"
              placeholder="Confirm Password"
              name="confirmpassword"
              className="input_res"
              autoComplete="new-password"
              required
            />

          </div>


          {/* Submit */}

          <div className="form-group form-button">

            <input
              type="submit"
              name="signup"
              id="signup"
              className="form-submit reg"
              value={loading ? 'Creating Account...' : 'Create Account'}
              disabled={loading}
            />

          </div>

        </form>


        {/* Login */}

        <Typography
          sx={{
            textAlign: 'center',
            color: 'grey !important'
          }}
        >

          Already have an Account?

          <Link
            to="#"
            className="signin-link"
            onClick={() => setfacultyLogin(0)}
          >
            Login
          </Link>

        </Typography>

      </div>

    </div>
  );
}