import React, { useEffect, useState } from 'react';
import './bookings.css';
import { Link, useNavigate } from 'react-router-dom';
import { MdMenu } from 'react-icons/md';
import axios from 'axios';
import { useCookies } from 'react-cookie';

export default function Bookings() {
  const navigate = useNavigate();

  const [cookies, , removeCookie] =
    useCookies(['access_token']);

  const [shownav, setshownav] =
    useState(false);

  const [loading, setloading] =
    useState(true);

  const [nobookings, setnobookings] =
    useState(false);

  const [searchbook, setsearchbook] =
    useState('');

  const [allbookings, setbookings] =
    useState([]);

  const API_URL =
    process.env.REACT_APP_API_URL;


  // =====================================================
  // AUTHENTICATION
  // =====================================================

  useEffect(() => {
    if (!cookies.access_token) {
      navigate('/');
    }
  }, [cookies.access_token, navigate]);


  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = (e) => {
    e.preventDefault();

    sessionStorage.clear();

    removeCookie('access_token', {
      path: '/'
    });

    navigate('/');
  };


  // =====================================================
  // FETCH BOOKINGS
  // =====================================================

  useEffect(() => {

    const fetchBookings = async () => {

      if (!cookies.access_token) {
        return;
      }

      try {

        setloading(true);

        const response = await axios.get(
          `${API_URL}/bookings/book`,
          {
            headers: {
              'x-token':
                cookies.access_token
            }
          }
        );

        const bookings =
          response.data?.Bookings || [];

        if (bookings.length === 0) {
          setnobookings(true);
          setbookings([]);
        } else {
          setnobookings(false);

          setbookings(
            [...bookings].reverse()
          );
        }

      } catch (error) {

        console.error(
          'Error fetching bookings:',
          error
        );

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {

          removeCookie(
            'access_token',
            { path: '/' }
          );

          navigate('/');

          return;
        }

        alert(
          error.response?.data?.message ||
          'Unable to load bookings'
        );

      } finally {
        setloading(false);
      }
    };

    fetchBookings();

  }, [
    cookies.access_token,
    navigate,
    removeCookie,
    API_URL
  ]);


  // =====================================================
  // ROOM NUMBER DISPLAY
  // =====================================================

  const roomnumbers = (rooms = []) => {

    if (rooms.length === 0) {
      return <div>No rooms</div>;
    }

    return (
      <div>
        {rooms.join(' , ')}
      </div>
    );
  };


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredBookings =
    allbookings.filter((booking) => {

      const search =
        searchbook.toLowerCase();

      return (
        booking.bookedon
          ?.toLowerCase()
          .includes(search) ||

        booking.fromdate
          ?.toLowerCase()
          .includes(search) ||

        booking.enddate
          ?.toLowerCase()
          .includes(search) ||

        booking._id
          ?.toLowerCase()
          .includes(search) ||

        booking.status
          ?.toLowerCase()
          .includes(search) ||

        booking.purpose
          ?.toLowerCase()
          .includes(search)
      );
    });


  return (
    <div className="c">

      {/* =================================================
          NAVIGATION
      ================================================= */}

      <div className="nav_bar">

        <div
          className="nav_bar_all coln"
          style={{ opacity: 1 }}
        >

          <div className="nav_bar_all_res">

            <MdMenu
              className="resmenu"
              onClick={() =>
                setshownav(!shownav)
              }
            />

          </div>

          <div
            className="logo"
            style={{ color: '#fff' }}
          >
            IIT GANDHINAGAR
          </div>

          <div
            className="nav_links"
            style={{ color: '#fff' }}
          >

            <ul
              className={
                !shownav
                  ? 'navitems hide'
                  : 'navitems'
              }
              style={{ color: '#fff' }}
            >

              <li>
                <Link
                  to="/Home"
                  className="header_links"
                  onClick={() =>
                    setshownav(!shownav)
                  }
                  style={{ color: '#fff' }}
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/Bookings"
                  className="header_links"
                  onClick={() =>
                    setshownav(!shownav)
                  }
                  style={{ color: '#fff' }}
                >
                  Bookings
                </Link>
              </li>

              <li>
                <button
                  onClick={logout}
                  style={{ color: '#fff' }}
                >
                  Logout
                </button>
              </li>

            </ul>

          </div>

        </div>

      </div>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="main_contain">

        <div className="contain_head">
          Check your bookings
        </div>


        {/* =================================================
            SEARCH BAR
        ================================================= */}

        <div
          className="projectssearchbar"
          style={{
            display:
              nobookings
                ? 'none'
                : 'block'
          }}
        >

          <form
            onSubmit={(e) =>
              e.preventDefault()
            }
          >

            <input
              type="text"
              className="searchbar"
              placeholder="Search by booking ID, date, status..."
              value={searchbook}
              onChange={(e) =>
                setsearchbook(e.target.value)
              }
            />

            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              className="searchbaricon"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >

              <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z">
              </path>

            </svg>

          </form>

        </div>


        {/* =================================================
            BOOKINGS TABLE
        ================================================= */}

        <div
          className="contain"
          style={{
            display:
              nobookings
                ? 'none'
                : 'block'
          }}
        >

          {!loading &&
            filteredBookings.length === 0 &&
            allbookings.length > 0 && (

              <div className="contains">
                No bookings match your search.
              </div>

            )}

          {filteredBookings.length > 0 && (

            <table>

              <thead>

                <tr>
                  <th>Booking Id</th>
                  <th>Booked On</th>
                  <th>Rooms Allocated</th>
                  <th>From Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {filteredBookings.map(
                  (booking) => (

                    <tr
                      key={booking._id}
                    >

                      <td>
                        <span className="hov">
                          {booking._id}
                        </span>
                      </td>

                      <td>
                        {booking.bookedon}
                      </td>

                      <td>
                        {roomnumbers(
                          booking.rooms
                        )}
                      </td>

                      <td>
                        {booking.fromdate}
                      </td>

                      <td>
                        {booking.enddate}
                      </td>

                      <td>
                        <span className="hov">
                          {booking.status}
                        </span>
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          )}

        </div>


        {/* =================================================
            NO BOOKINGS
        ================================================= */}

        <div
          className="contains"
          style={{
            display:
              !nobookings
                ? 'none'
                : 'block'
          }}
        >
          You have no bookings yet!
        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div
            className="types"
            style={{
              color: '#fff',
              textAlign: 'center',
              marginTop: '20px'
            }}
          >

            <div
              className="loading"
              style={{
                justifyContent:
                  'center'
              }}
            >

              <div
                className="loader"
                style={{
                  borderTop:
                    '3px dotted #fff',
                  borderLeft:
                    '3px dotted #fff'
                }}
              >
              </div>

              Loading...

            </div>

          </div>

        )}

      </div>

    </div>
  );
}