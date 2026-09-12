import React, { useEffect, useState } from 'react';

import '../Pages/admintable.css';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import axios from 'axios';
import MUIDataTable from 'mui-datatables';

import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';


const Card = ({ booking }) => {

  const navigate = useNavigate();

  const [cookies] = useCookies([
    'admin_access_token'
  ]);

  const API_URL = process.env.REACT_APP_API_URL;


  const [search, setSearch] = useState('');

  const [details, setDetails] = useState(false);

  const [filtering, setFiltering] = useState([]);

  const [checkin, setCheckin] = useState(null);

  const [checkout, setCheckout] = useState(null);

  const [emptyrooms, setEmptyRooms] = useState([]);

  const [rooms, setRooms] = useState([]);


  // =====================================================
  // ADMIN AUTHENTICATION
  // =====================================================

  useEffect(() => {

    if (!cookies.admin_access_token) {

      navigate('/admin-login', {
        replace: true
      });

    }

  }, [
    cookies.admin_access_token,
    navigate
  ]);


  // =====================================================
  // GET ROOMS
  // =====================================================

  useEffect(() => {

    const gettingRooms = async () => {

      if (!cookies.admin_access_token) {
        return;
      }

      try {

        const response = await axios.get(
          `${API_URL}/rooms/allfreerooms`,
          {
            headers: {
              'x-token':
                cookies.admin_access_token
            }
          }
        );


        const fetchedRooms =
          response.data.Rooms || [];


        setEmptyRooms(fetchedRooms);

        setRooms(fetchedRooms);


      } catch (error) {

        console.error(
          'Failed to fetch rooms:',
          error
        );


        if (
          error.response?.status === 401
        ) {

          navigate('/admin-login', {
            replace: true
          });

        }

      }

    };


    gettingRooms();

  }, [
    API_URL,
    cookies.admin_access_token,
    navigate
  ]);


  // =====================================================
  // DATE PARSER
  // =====================================================

  const parseBookingDate = (dateString) => {

    if (!dateString) {
      return null;
    }


    // Existing project stores dates as DD-MM-YYYY
    const parts = dateString.split('-');


    if (parts.length === 3) {

      const day = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const year = Number(parts[2]);


      return new Date(
        year,
        month,
        day
      );

    }


    const parsed =
      new Date(dateString);


    return Number.isNaN(
      parsed.getTime()
    )
      ? null
      : parsed;

  };


  // =====================================================
  // SEARCH AVAILABLE ROOMS
  // =====================================================

  const handleSearchRooms = () => {

    if (!checkin || !checkout) {

      alert(
        'Please select both check-in and check-out dates.'
      );

      return;
    }


    if (checkout <= checkin) {

      alert(
        'Check-out date must be after check-in date.'
      );

      return;
    }


    const availableRooms = rooms.filter(
      (room) => {

        const roomNumber =
          String(room.roomnumber);


        const hasConflict =
          booking.some((bookin) => {

            if (
              !Array.isArray(bookin.rooms)
            ) {
              return false;
            }


            // Only approved/pending bookings
            // should block a room.
            if (
              bookin.status !== 'Approved' &&
              bookin.status !== 'Pending'
            ) {

              return false;

            }


            // Check whether this booking
            // contains this room.
            if (
              !bookin.rooms
                .map(String)
                .includes(roomNumber)
            ) {

              return false;

            }


            const bookedIn =
              parseBookingDate(
                bookin.fromdate
              );

            const bookedOut =
              parseBookingDate(
                bookin.enddate
              );


            if (
              !bookedIn ||
              !bookedOut
            ) {

              return false;

            }


            /*
             * Date ranges overlap when:
             *
             * requested check-in < existing check-out
             * AND
             * requested check-out > existing check-in
             *
             * This allows a new guest to check in
             * on the same day another guest checks out.
             */

            return (
              checkin < bookedOut &&
              checkout > bookedIn
            );

          });


        return !hasConflict;

      }
    );


    setEmptyRooms(
      availableRooms
    );

  };


  // =====================================================
  // SEARCH BOOKING BY ID
  // =====================================================

  const handleSearch = () => {

    const searchValue =
      search.trim().toLowerCase();


    if (!searchValue) {

      setFiltering([]);

      return;

    }


    const results =
      booking.filter((bookin) => {

        const id =
          String(bookin._id || '')
            .toLowerCase();


        return id === searchValue;

      });


    setFiltering(results);

  };


  const handleClick = () => {

    handleSearch();

    setDetails(true);

  };


  // =====================================================
  // AVAILABLE ROOM TABLE
  // =====================================================

  const columns = [
    'Rooms',
    'Room Type'
  ];


  const data = emptyrooms.map(
    (roomin) => [

      roomin.roomnumber,

      roomin.options

    ]
  );


  const options = {

    filter: false,

    search: true,

    selectableRows: 'none',

    print: false,

    download: false,

    delete: false,

    viewColumns: false,

    pagination: true

  };


  return (

    <div>

      <div className="main1">


        {/* =================================================
            BOOKING DETAILS
        ================================================= */}

        <div className="table1">

          <div className="shh1">

            <input
              className="ashd1"

              type="text"

              value={search}

              onChange={(e) =>
                setSearch(e.target.value)
              }

              placeholder="Booking ID"

              onKeyDown={(e) => {

                if (e.key === 'Enter') {
                  handleClick();
                }

              }}
            />


            <button
              className="butt"
              onClick={handleClick}
            >
              Show details
            </button>

          </div>


          {details &&
            filtering.length === 0 && (

              <div className="sf">

                <p>
                  No booking found with this ID.
                </p>

              </div>

            )
          }


          {details &&

            filtering.map((bookin) => (

              <div
                className="sf"
                key={bookin._id}
              >

                <p>
                  <strong>First Name:</strong>{' '}
                  {bookin.firstname}
                </p>

                <p>
                  <strong>Last Name:</strong>{' '}
                  {bookin.lastname}
                </p>

                <p>
                  <strong>Booking ID:</strong>{' '}
                  {bookin._id}
                </p>

                <p>
                  <strong>Booked On:</strong>{' '}
                  {bookin.bookedon}
                </p>

                <p>
                  <strong>From Date:</strong>{' '}
                  {bookin.fromdate}
                </p>

                <p>
                  <strong>End Date:</strong>{' '}
                  {bookin.enddate}
                </p>

                <p>
                  <strong>Address:</strong>{' '}
                  {bookin.address}
                </p>

                <p>
                  <strong>Rooms:</strong>{' '}
                  {Array.isArray(bookin.rooms)
                    ? [...bookin.rooms]
                        .join(', ')
                    : ''}
                </p>

                <p>
                  <strong>Rooms Type:</strong>{' '}
                  {Array.isArray(bookin.roomstype)
                    ? bookin.roomstype.join(', ')
                    : bookin.roomstype || ''}
                </p>

                <p>
                  <strong>Meals:</strong>{' '}
                  {bookin.meals || 'Not specified'}
                </p>

                <p>

                  <strong>Status:</strong>{' '}

                  <span
                    style={{
                      fontWeight: '550',

                      color:
                        bookin.status === 'Rejected'
                          ? 'red'
                          : bookin.status === 'Approved'
                            ? 'green'
                            : 'rgb(230, 163, 17)'
                    }}
                  >
                    {bookin.status}
                  </span>

                </p>

                <p>
                  <strong>Email:</strong>{' '}
                  {bookin.email}
                </p>

                {bookin.specialrequest && (

                  <p>
                    <strong>
                      Special Request:
                    </strong>{' '}
                    {bookin.specialrequest}
                  </p>

                )}

                <p>
                  <strong>Adults:</strong>{' '}
                  {bookin.adults}
                </p>

                <p>
                  <strong>Phone Number:</strong>{' '}
                  {bookin.phonenumber}
                </p>

              </div>

            ))
          }

        </div>


        {/* =================================================
            AVAILABLE ROOMS
        ================================================= */}

        <div className="table2">

          <div className="datespickers">

            <DatePicker
              selected={checkin}
              onChange={(date) =>
                setCheckin(date)
              }
              dateFormat="dd-MM-yyyy"
              className="datepicker"
              placeholderText="Check-in"
            />


            <DatePicker
              selected={checkout}
              onChange={(date) =>
                setCheckout(date)
              }
              dateFormat="dd-MM-yyyy"
              className="datepicker"
              placeholderText="Check-out"
            />


            <button
              onClick={handleSearchRooms}
              className="bu"
            >
              Search
            </button>

          </div>


          <MUIDataTable
            title="Available Rooms"

            data={data}

            options={options}

            columns={columns}

            className="MUITABLE"
          />

        </div>

      </div>

    </div>

  );

};


export default Card;