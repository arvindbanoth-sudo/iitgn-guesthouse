import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Bookingpage from '../components/Bookingpage';
import Detailspage from '../components/Detailspage';

import axios from 'axios';
import { useCookies } from 'react-cookie';

export default function Formsumission({ accomodation }) {

  const navigate = useNavigate();

  const [cookies] = useCookies(['access_token']);

  const API_URL = process.env.REACT_APP_API_URL;


  // =====================================================
  // AUTHENTICATION
  // =====================================================

  useEffect(() => {

    if (!cookies.access_token) {
      navigate('/');
    }

  }, [cookies.access_token, navigate]);


  // =====================================================
  // SAVED SEARCH DATES
  // =====================================================

  const savedCheckin =
    sessionStorage.getItem('checkin');

  const savedCheckout =
    sessionStorage.getItem('checkout');


  // =====================================================
  // STATE
  // =====================================================

  const [page, setpage] = useState(0);

  const [errf, setdisperrf] =
    useState(false);

  const [maxlim, setmaxlim] =
    useState(false);


  const [details, setdetails] = useState({

    Firstname: '',
    Lastname: '',
    Email: '',
    Phonenumber: '',
    Purpose: '',
    Address: '',
    Specialrequest: '',
    Adults: '1',
    Meals: 'Room Only',
    Rooms: [],
    Roomstype: [],
    Fromdate: savedCheckin,
    Enddate: savedCheckout

  });


  // =====================================================
  // FORM PAGE
  // =====================================================

  const getform = () => {

    if (page === 0) {

      return (
        <Detailspage
          accomodation={accomodation}
          details={details}
          setdetails={setdetails}
        />
      );

    }

    return (
      <Bookingpage
        details={details}
        setdetails={setdetails}
      />
    );

  };


  // =====================================================
  // SUBMIT BOOKING
  // =====================================================

  const submitHandle = async (e) => {

    e.preventDefault();


    // -------------------------------------------------
    // Validate number of adults
    // -------------------------------------------------

    if (
      parseInt(details.Adults, 10) <
      details.Rooms.length
    ) {

      setmaxlim(true);

      return;

    } else {

      setmaxlim(false);

    }


    // -------------------------------------------------
    // Validate required fields
    // -------------------------------------------------

    if (
      details.Firstname === '' ||
      details.Lastname === '' ||
      details.Address === '' ||
      details.Email === '' ||
      details.Phonenumber === '' ||
      details.Purpose === '' ||
      details.Rooms.length === 0
    ) {

      setdisperrf(true);

      return;

    } else {

      setdisperrf(false);

    }


    // -------------------------------------------------
    // Determine room type
    // -------------------------------------------------

    let roomType = [];

    if (accomodation === 0) {

      roomType = ['Double'];

    } else if (accomodation === 1) {

      roomType = ['Single'];

    } else if (accomodation === 2) {

      roomType = ['Deluxe'];

    }


    // -------------------------------------------------
    // Prepare booking data
    // -------------------------------------------------

    const {

      Firstname,
      Lastname,
      Email,
      Phonenumber,
      Address,
      Rooms,
      Adults,
      Meals,
      Specialrequest,
      Fromdate,
      Enddate

    } = details;


    try {

      await axios.post(

        `${API_URL}/bookings/book`,

        {
          Firstname,
          Lastname,
          Email,
          Phonenumber,
          Address,
          Rooms,
          Roomstype: roomType,
          Adults,
          Meals,
          Specialrequest,
          Fromdate,
          Enddate
        },

        {
          headers: {
            'x-token':
              cookies.access_token
          }
        }

      );


      // -------------------------------------------------
      // Booking successful
      // -------------------------------------------------

      navigate('/Bookings');

    } catch (err) {

      console.error(
        'Booking submission error:',
        err
      );

      alert(
        err.response?.data?.message ||
        'Unable to create booking. Please try again.'
      );

    }

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="searchresultcont">

      <div>

        <p className="avaibile">
          Check Availability!
        </p>

      </div>


      {/* =================================================
          SEARCH INFORMATION
      ================================================= */}

      <div className="searchresultsinfo">

        <p>
          Check-in: {savedCheckin}
        </p>

        <p>
          Check-out: {savedCheckout}
        </p>

        <button
          onClick={() =>
            navigate('/booknow')
          }
        >
          Change Search
        </button>

      </div>


      {/* =================================================
          BOOKING FORM
      ================================================= */}

      <div className="searchresultsdesc">

        {getform()}


        {/* =================================================
            VALIDATION MESSAGES
        ================================================= */}

        <div>

          <p
            style={{
              color: 'red',
              display: errf
                ? 'block'
                : 'none',
              marginBottom: '20px'
            }}
          >
            Please fill all the required (*) details!
          </p>


          <p
            style={{
              color: 'red',
              display: maxlim
                ? 'block'
                : 'none',
              marginBottom: '20px'
            }}
          >
            Number of adults cannot be less than
            the number of rooms chosen!
          </p>


          {/* =================================================
              PREVIOUS
          ================================================= */}

          <button
            onClick={() => {

              if (page !== 0) {

                setpage(
                  (currentPage) =>
                    currentPage - 1
                );

              } else {

                navigate(
                  '/booknow/rooms'
                );

              }

            }}
            className="acbtn"
            id="prev"
          >
            Previous
          </button>


          {/* =================================================
              NEXT
          ================================================= */}

          <button
            style={{
              display:
                page === 1
                  ? 'none'
                  : 'inline-block'
            }}
            onClick={() =>
              setpage(
                (currentPage) =>
                  currentPage + 1
              )
            }
            className="acbtn"
          >
            Next
          </button>


          {/* =================================================
              BOOK NOW
          ================================================= */}

          <button
            style={{
              display:
                page !== 1
                  ? 'none'
                  : 'inline-block'
            }}
            onClick={submitHandle}
            className="acbtn"
          >
            Book Now!
          </button>

        </div>

      </div>

    </div>

  );

}