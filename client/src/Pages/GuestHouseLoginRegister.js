import * as React from 'react';

import {
  Box,
  Button,
  Grid,
  Typography
} from '@mui/material';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';

import './login.css';

import { useNavigate } from 'react-router-dom';

import Campus1 from '../images/campus/campus-1.jpg';


export default function IitgnGuestHouseLoginRegister() {

  const navigate = useNavigate();

  const [loginType, setLoginType] =
    React.useState('');


  // =====================================================
  // USER TYPE
  // =====================================================

  const handleChange = (event) => {

    setLoginType(
      event.target.value
    );

  };


  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = () => {

    if (loginType === '') {

      alert(
        'Please select a user type'
      );

      return;

    }


    if (loginType === 1) {

      navigate('/admin-login');

    }

    else if (loginType === 2) {

      navigate('/faculty-login');

    }

    else if (loginType === 3) {

      navigate('/student-login');

    }

  };


  return (

    <Box

      sx={{

        minHeight: '100vh',

        backgroundImage:
          `linear-gradient(
            0deg,
            rgba(7,15,41,.85),
            rgba(25,34,61,.62) 20%,
            rgba(84,103,161,.39),
            rgba(0,0,0,0)
          ),
          url(${Campus1})`,

        backgroundPosition:
          'center',

        backgroundSize:
          'cover',

        backgroundRepeat:
          'no-repeat',

        backgroundAttachment:
          'fixed',

        display:
          'flex',

        justifyContent:
          'center',

        alignItems:
          'center',

        padding:
          '3%'

      }}

    >

      <Grid

        container

        sx={{

          display:
            'flex',

          flexDirection:
            'column',

          justifyContent:
            'center',

          alignItems:
            'center',

          textAlign:
            'center'

        }}

      >

        {/* =================================================
            MAIN HEADING
        ================================================= */}

        <Grid item>

          <Typography

            className="animatedtext"

            sx={{

              color: '#fff',

              fontWeight:
                'bold',

              fontSize:
                {
                  xs: '38px',
                  sm: '48px',
                  md: '60px'
                },

              borderBottom:
                '2px solid #fff',

              padding:
                '10px',

              textAlign:
                'center'

            }}

          >

            GUEST HOUSE BOOKING

          </Typography>

        </Grid>


        {/* =================================================
            INSTITUTE NAME
        ================================================= */}

        <Grid item>

          <Typography

            className="animatedtext animatedtext2"

            sx={{

              color: '#fff',

              fontWeight:
                '600',

              fontSize:
                {
                  xs: '18px',
                  sm: '23px',
                  md: '27px'
                },

              marginTop:
                '10px',

              textAlign:
                'center'

            }}

          >

            Indian Institute of Technology
            Gandhinagar

          </Typography>

        </Grid>


        {/* =================================================
            USER TYPE + LOGIN
        ================================================= */}

        <Grid

          container

          sx={{

            display:
              'flex',

            flexDirection:
              {
                xs: 'column',
                sm: 'row'
              },

            justifyContent:
              'center',

            alignItems:
              'center',

            marginTop:
              '25px',

            gap:
              '15px'

          }}

          className="logintype"

        >

          {/* USER TYPE */}

          <Grid item>

            <FormControl

              variant="filled"

              sx={{

                minWidth:
                  220,

                backgroundColor:
                  '#fff',

                borderRadius:
                  '4px'

              }}

              className="logintype-container"

            >

              <InputLabel
                id="user-type-label"
              >
                Select User Type
              </InputLabel>


              <Select

                labelId="user-type-label"

                id="user-type-select"

                value={loginType}

                onChange={
                  handleChange
                }

              >

                <MenuItem value={1}>
                  Admin
                </MenuItem>

                <MenuItem value={2}>
                  Faculty
                </MenuItem>

                <MenuItem value={3}>
                  Student
                </MenuItem>

              </Select>

            </FormControl>

          </Grid>


          {/* LOGIN BUTTON */}

          <Grid item>

            <Button

              variant="outlined"

              endIcon={
                <LoginOutlinedIcon />
              }

              onClick={
                handleLogin
              }

              className="logintype-button"

              sx={{

                borderColor:
                  '#fff',

                color:
                  '#fff',

                padding:
                  '10px 18px',

                '&:hover': {

                  borderColor:
                    '#fff',

                  backgroundColor:
                    'rgba(255,255,255,0.12)'

                }

              }}

            >

              Login

            </Button>

          </Grid>

        </Grid>

      </Grid>

    </Box>

  );

}