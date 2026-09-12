import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import AdminallBookings from './AdminallBookings';
import Detail from './Adminpagedetails';
import Roomd from './Adminnewroom';
import Newbook from './AdminBooking';

const drawerWidth = 240;

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),

  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),

  marginLeft: `-${drawerWidth}px`,

  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),

    marginLeft: 0
  })
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),

  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,

    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),

  ...theme.mixins.toolbar,

  justifyContent: 'flex-end'
}));

export default function PersistentDrawerLeft() {
  const navigate = useNavigate();

  const [cookies, , removeCookie] = useCookies([
    'admin_access_token'
  ]);

  const theme = useTheme();

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!cookies.admin_access_token) {
      navigate('/admin-login', { replace: true });
    }
  }, [cookies.admin_access_token, navigate]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const adminlogout = (e) => {
    e.preventDefault();

    removeCookie('admin_access_token', {
      path: '/'
    });

    navigate('/admin-login', {
      replace: true
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        backgroundColor: '#f7f7f7',
        minHeight: '100vh'
      }}
    >

      <CssBaseline />

      {/* TOP NAVIGATION BAR */}
      <AppBar
        position="fixed"
        open={open}
        sx={{
          backgroundColor: '#696cff'
        }}
      >

        <Toolbar>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              mr: 2,
              ...(open && {
                display: 'none'
              })
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
          >
            IIT GANDHINAGAR GUEST HOUSE
          </Typography>

        </Toolbar>

      </AppBar>


      {/* SIDE DRAWER */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,

          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box'
          }
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >

        <DrawerHeader>

          <IconButton onClick={handleDrawerClose}>

            {theme.direction === 'ltr'
              ? <ChevronLeftIcon />
              : <ChevronRightIcon />
            }

          </IconButton>

        </DrawerHeader>

        <Divider />


        {/* ADMIN MENU */}
        <List>

          <ListItem disablePadding>

            <ListItemButton
              component={Link}
              to=""
              onClick={handleDrawerClose}
            >
              <ListItemText
                primary="All Bookings"
              />
            </ListItemButton>

          </ListItem>


          <ListItem disablePadding>

            <ListItemButton
              component={Link}
              to="details"
              onClick={handleDrawerClose}
            >
              <ListItemText
                primary="Booking Details"
              />
            </ListItemButton>

          </ListItem>


          <ListItem disablePadding>

            <ListItemButton
              component={Link}
              to="newbooking"
              onClick={handleDrawerClose}
            >
              <ListItemText
                primary="Room Booking"
              />
            </ListItemButton>

          </ListItem>


          <ListItem disablePadding>

            <ListItemButton
              component={Link}
              to="rooms"
              onClick={handleDrawerClose}
            >
              <ListItemText
                primary="Add a Room"
              />
            </ListItemButton>

          </ListItem>

        </List>


        <Divider />


        {/* LOGOUT */}
        <ListItem disablePadding>

          <ListItemButton onClick={adminlogout}>

            <ListItemText
              primary="Logout"
            />

          </ListItemButton>

        </ListItem>

      </Drawer>


      {/* PAGE CONTENT */}
      <Main
        open={open}
        sx={{
          padding: 0,
          width: '100%'
        }}
      >

        <Routes>

          <Route
            path="/"
            element={<AdminallBookings />}
          />

          <Route
            path="/details"
            element={<Detail />}
          />

          <Route
            path="/rooms"
            element={<Roomd />}
          />

          <Route
            path="/newbooking"
            element={<Newbook />}
          />

        </Routes>

      </Main>

    </Box>
  );
}