import React from 'react';

import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';

import Loginpage from './Pages/Loginpage';
import Registrationpage from './Pages/Registrationpage';
import Homepage from './Pages/Homepage';
import Book from './Pages/Book';
import Allrooms from './Pages/Allrooms';
import Checkavaibility from './components/Checkavaibility';
import Formsumission from './Pages/Formsumission';
import Bookings from './Pages/Bookings';

import AdminLoginpage from './Pages/Adminlogin';
import Adminwebsite from './Pages/Adminwebsite';
import AdminallBookings from './Pages/AdminallBookings';
import Detail from './Pages/Adminpagedetails';
import Roomd from './Pages/Adminnewroom';
import Newbook from './Pages/AdminBooking';

import FacultyHomepage from './Pages/FacultyHomepage';
import Facultyform from './components/Facultyform';
import Facultybookings from './components/Facultybookings';
import Facultylogin from './Pages/Facultylogin';

import GuestHouseLoginRegister from './Pages/GuestHouseLoginRegister';

import Studentlogin from './Pages/Studentlogin';

import Scrolltop from './components/Scrolltop';


function App() {

  return (

    <Router>

      <Scrolltop />

      <Routes>

        {/* =================================================
            LOGIN / ENTRY
        ================================================= */}

        <Route
          path="/"
          element={
            <GuestHouseLoginRegister />
          }
        />

        <Route
          path="/student-login"
          element={
            <Studentlogin />
          }
        />

        <Route
          path="/faculty-login"
          element={
            <Facultylogin />
          }
        />

        <Route
          path="/admin-login"
          element={
            <AdminLoginpage />
          }
        />


        {/* =================================================
            ADMIN
        ================================================= */}

        <Route
          path="/dashboard/admins"
          element={
            <Adminwebsite />
          }
        >

          <Route
            index
            element={
              <AdminallBookings />
            }
          />

          <Route
            path="details"
            element={
              <Detail />
            }
          />

          <Route
            path="rooms"
            element={
              <Roomd />
            }
          />

          <Route
            path="newbooking"
            element={
              <Newbook />
            }
          />

        </Route>


        {/* =================================================
            STUDENT HOME
        ================================================= */}

        <Route
          path="/home"
          element={
            <Homepage />
          }
        />


        {/* =================================================
            STUDENT BOOKING
        ================================================= */}

        <Route
          path="/booknow"
          element={
            <Book />
          }
        >

          <Route
            index
            element={
              <Checkavaibility />
            }
          />

          <Route
            path="rooms"
            element={
              <Allrooms />
            }
          />

          <Route
            path="bookingpage"
            element={
              <Formsumission />
            }
          />

        </Route>


        {/* =================================================
            STUDENT BOOKINGS
        ================================================= */}

        <Route
          path="/Bookings"
          element={
            <Bookings />
          }
        />


        {/* =================================================
            FACULTY HOME
        ================================================= */}

        <Route
          path="/facultyHomaPage"
          element={
            <FacultyHomepage />
          }
        />


        {/* =================================================
            FACULTY BOOKINGS
        ================================================= */}

        <Route
          path="/facultybookings"
          element={
            <Facultybookings />
          }
        />


        {/* =================================================
            FACULTY FORM
        ================================================= */}

        <Route
          path="/facultyform"
          element={
            <Facultyform />
          }
        />

      </Routes>

    </Router>

  );

}


export default App;