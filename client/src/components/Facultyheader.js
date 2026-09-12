import * as React from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const pages = ['Bookings'];

const pageLinks = [
  {
    label: 'Bookings',
    route: '/facultybookings'
  }
];

const settings = ['Logout'];


function Facultyheader() {

  const [anchorElNav, setAnchorElNav] =
    React.useState(null);

  const [anchorElUser, setAnchorElUser] =
    React.useState(null);

  const navigate = useNavigate();

  const [, , removeCookie] =
    useCookies(['faculty_access_token']);


  // =====================================================
  // NAVIGATION MENU
  // =====================================================

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };


  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };


  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };


  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  // =====================================================
  // PAGE LINK
  // =====================================================

  const handlePageLinkClick = (route) => {

    handleCloseNavMenu();

    navigate(route);

  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    sessionStorage.clear();

    removeCookie(
      'faculty_access_token',
      {
        path: '/'
      }
    );

    handleCloseUserMenu();

    navigate('/faculty-login');

  };


  return (

    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#fff'
      }}
    >

      <Container maxWidth="xl">

        <Toolbar disableGutters>

          {/* =================================================
              DESKTOP LOGO
          ================================================= */}

          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/facultyHomaPage"
            sx={{
              mr: 6,
              display: {
                xs: 'none',
                md: 'flex'
              },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.17rem',
              color: '#000',
              textDecoration: 'none',
              fontSize: '25px'
            }}
          >
            IIT GANDHINAGAR
          </Typography>


          {/* =================================================
              MOBILE MENU
          ================================================= */}

          <Box
            sx={{
              flexGrow: 1,
              display: {
                xs: 'flex',
                md: 'none'
              }
            }}
          >

            <IconButton
              size="large"
              aria-label="open navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{
                color: '#000'
              }}
            >

              <MenuIcon />

            </IconButton>


            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: {
                  xs: 'block',
                  md: 'none'
                }
              }}
            >

              {pages.map((page) => (

                <MenuItem
                  key={page}
                  onClick={() =>
                    handlePageLinkClick(
                      '/facultybookings'
                    )
                  }
                >

                  <Typography
                    textAlign="center"
                  >
                    {page}
                  </Typography>

                </MenuItem>

              ))}

            </Menu>

          </Box>


          {/* =================================================
              MOBILE LOGO
          ================================================= */}

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/facultyHomaPage"
            sx={{
              mr: 2,
              display: {
                xs: 'flex',
                md: 'none'
              },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: '#000',
              textDecoration: 'none'
            }}
          >
            IIT GANDHINAGAR
          </Typography>


          {/* =================================================
              DESKTOP LINKS
          ================================================= */}

          <Box
            sx={{
              flexGrow: 1,
              display: {
                xs: 'none',
                md: 'flex'
              }
            }}
          >

            {pageLinks.map((pageLink) => (

              <Button
                key={pageLink.label}
                onClick={() =>
                  handlePageLinkClick(
                    pageLink.route
                  )
                }
                sx={{
                  my: 2,
                  color: '#333',
                  display: 'block'
                }}
              >
                {pageLink.label}
              </Button>

            ))}

          </Box>


          {/* =================================================
              USER MENU
          ================================================= */}

          <Box sx={{ flexGrow: 0 }}>

            <Tooltip title="Open settings">

              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0 }}
              >

                <Avatar
                  alt="IIT Gandhinagar Faculty"
                  src="/static/images/avatar/2.jpg"
                />

              </IconButton>

            </Tooltip>


            <Menu
              sx={{
                mt: '45px'
              }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >

              {settings.map((setting) => (

                <MenuItem
                  key={setting}
                  onClick={
                    setting === 'Logout'
                      ? handleLogout
                      : handleCloseUserMenu
                  }
                >

                  <Typography
                    textAlign="center"
                  >
                    {setting}
                  </Typography>

                </MenuItem>

              ))}

            </Menu>

          </Box>

        </Toolbar>

      </Container>

    </AppBar>

  );

}

export default Facultyheader;