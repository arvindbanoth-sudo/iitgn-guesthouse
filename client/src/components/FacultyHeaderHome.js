import React, { useEffect, useRef, useState } from 'react';
import './header.css';

import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';

import {
  Link,
  useNavigate
} from 'react-router-dom';

import {
  Link as ScrollLink
} from 'react-scroll';

import { MdMenu } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';

import { useCookies } from 'react-cookie';

import Logo from '../images/branding/logo.jpg';


export default function FacultyHeaderHome() {

  const navigate = useNavigate();

  const [shownav, setshownav] =
    useState(false);

  const [, , removeCookie] =
    useCookies([
      'faculty_access_token'
    ]);

  const headerRef =
    useRef(null);

  const [headerHeight, setHeaderHeight] =
    useState(0);


  // =====================================================
  // HEADER HEIGHT
  // =====================================================

  useEffect(() => {

    const updateHeaderHeight = () => {

      if (headerRef.current) {

        setHeaderHeight(
          headerRef.current.offsetHeight
        );

      }

    };

    updateHeaderHeight();

    window.addEventListener(
      'resize',
      updateHeaderHeight
    );

    return () => {

      window.removeEventListener(
        'resize',
        updateHeaderHeight
      );

    };

  }, []);


  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = (event) => {

    event.preventDefault();

    sessionStorage.clear();

    removeCookie(
      'faculty_access_token',
      {
        path: '/'
      }
    );

    navigate('/faculty-login');

  };


  // =====================================================
  // HOME
  // =====================================================

  const handleHomeClick = (event) => {

    event.preventDefault();

    if (
      window.location.pathname ===
      '/facultyHomaPage'
    ) {

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    } else {

      navigate(
        '/facultyHomaPage'
      );

    }

  };


  // =====================================================
  // CLOSE DRAWER
  // =====================================================

  const closeDrawer = () => {
    setshownav(false);
  };


  return (

    <div className="nav_bar">

      <div
        className="nav_bar_all col"
        ref={headerRef}
        id="header"
        style={{
          opacity: 1
        }}
      >

        {/* MOBILE MENU */}

        <div className="nav_bar_all_res">

          <MdMenu
            className="resmenu"
            onClick={() =>
              setshownav(true)
            }
          />

        </div>


        {/* LOGO */}

        <Link
          to="/facultyHomaPage"
          className="logo"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none'
          }}
        >

          <img
            src={Logo}
            alt="IIT Gandhinagar"
            style={{
              height: '45px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />

          <span>
            IIT GANDHINAGAR
          </span>

        </Link>


        {/* MOBILE DRAWER */}

        <Drawer
          anchor="left"
          open={shownav}
          onClose={closeDrawer}
        >

          <div
            style={{
              padding: '15px',
              fontWeight: 600,
              fontSize: '18px'
            }}
          >
            IIT GANDHINAGAR
          </div>

          <Divider />

          <ul className="res_nav_links">

            <li>

              <Link
                to="/facultyHomaPage"
                className="headerlinks"
                onClick={closeDrawer}
              >
                Home
              </Link>

            </li>


            <li>

              <ScrollLink
                to="about"
                className="headerlinks"
                smooth
                spy
                offset={
                  -headerHeight
                }
                onClick={closeDrawer}
              >
                About Us
              </ScrollLink>

            </li>


            <li>

              <ScrollLink
                to="gallery"
                className="headerlinks"
                smooth
                spy
                offset={
                  -headerHeight
                }
                onClick={closeDrawer}
              >
                Gallery
              </ScrollLink>

            </li>


            <li>

              <ScrollLink
                to="availability"
                className="headerlinks"
                smooth
                spy
                offset={
                  -headerHeight
                }
                onClick={closeDrawer}
              >
                Availability
              </ScrollLink>

            </li>


            <li>

              <ScrollLink
                to="contact"
                className="headerlinks"
                smooth
                spy
                offset={
                  -headerHeight
                }
                onClick={closeDrawer}
              >
                Contact Us
              </ScrollLink>

            </li>


            <li>

              <Link
                to="/facultybookings"
                className="headerlinks"
                onClick={closeDrawer}
              >
                Bookings
              </Link>

            </li>


            <li>

              <button
                onClick={logout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Logout
                <FiLogOut />
              </button>

            </li>

          </ul>

        </Drawer>


        {/* DESKTOP NAVIGATION */}

        <div className="nav_links">

          <ul className="navitems hide">

            <li>

              <Link
                to="/facultyHomaPage"
                className="header_links"
                onClick={handleHomeClick}
              >
                Home
              </Link>

            </li>


            <li>

              <ScrollLink
                to="about"
                className="header_links"
                spy
                smooth
                offset={
                  -headerHeight
                }
              >
                About Us
              </ScrollLink>

            </li>


            <li>

              <ScrollLink
                to="gallery"
                className="header_links"
                spy
                smooth
                offset={
                  -headerHeight
                }
              >
                Gallery
              </ScrollLink>

            </li>


            <li>

              <ScrollLink
                to="availability"
                className="header_links"
                spy
                smooth
                offset={
                  -headerHeight
                }
              >
                Availability
              </ScrollLink>

            </li>


            <li>

              <ScrollLink
                to="contact"
                className="header_links"
                spy
                smooth
                offset={
                  -headerHeight
                }
              >
                Contact Us
              </ScrollLink>

            </li>


            <li>

              <Link
                to="/facultybookings"
                className="header_links"
              >
                Bookings
              </Link>

            </li>


            <li>

              <button
                onClick={logout}
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}
              >

                Logout

                <FiLogOut
                  style={{
                    marginLeft: '8px'
                  }}
                />

              </button>

            </li>

          </ul>

        </div>

      </div>

    </div>

  );

}