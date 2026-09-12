import React from 'react';
import '../Pages/admintable.css';

import MUIDataTable from 'mui-datatables';
import axios from 'axios';

import {
  ToastContainer,
  toast
} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { useCookies } from 'react-cookie';

const Table = ({ booking, setrefresh }) => {

  const [cookies] = useCookies([
    'admin_access_token'
  ]);

  const API_URL =
    process.env.REACT_APP_API_URL;


  // =====================================================
  // APPROVE BOOKING
  // =====================================================

  const handleapprove = async (id) => {

    try {

      const response = await axios.put(
        `${API_URL}/admibookings/approve`,
        { id },
        {
          headers: {
            'x-token':
              cookies.admin_access_token
          }
        }
      );

      console.log(
        'Approval response:',
        response.data
      );

      toast.success(
        response.data?.message ||
        'Booking approved successfully'
      );

      setrefresh(
        (prev) => !prev
      );

    } catch (error) {

      console.error(
        'Approval error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
        'Unable to approve booking'
      );

    }

  };


  // =====================================================
  // REJECT BOOKING
  // =====================================================

  const handlereject = async (id) => {

    try {

      const response = await axios.put(
        `${API_URL}/admibookings/reject`,
        { id },
        {
          headers: {
            'x-token':
              cookies.admin_access_token
          }
        }
      );

      console.log(
        'Rejection response:',
        response.data
      );

      toast.success(
        response.data?.message ||
        'Booking rejected successfully'
      );

      setrefresh(
        (prev) => !prev
      );

    } catch (error) {

      console.error(
        'Rejection error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
        'Unable to reject booking'
      );

    }

  };


  // =====================================================
  // COPY BOOKING ID
  // =====================================================

  const handleCopy = async (text) => {

    try {

      await navigator.clipboard.writeText(
        text
      );

      toast.success(
        'Booking ID copied to clipboard!',
        {
          autoClose: 2000
        }
      );

    } catch (error) {

      console.error(
        'Failed to copy text:',
        error
      );

      toast.error(
        'Could not copy Booking ID'
      );

    }

  };


  // =====================================================
  // TABLE DATA
  // =====================================================

  const data = [...booking]
    .reverse()
    .map((bookin) => [

      // Booking ID
      <button
        type="button"
        onClick={() =>
          handleCopy(bookin._id)
        }
        className="copy"
        title="Copy Booking ID"
      >
        {bookin._id}
      </button>,


      // Full name
      `${bookin.firstname || ''} ${bookin.lastname || ''}`.trim(),


      // Email
      bookin.email || '',


      // Booking date
      bookin.bookedon || '',


      // Check-in
      bookin.fromdate || '',


      // Check-out
      bookin.enddate || '',


      // Rooms
      Array.isArray(bookin.rooms)
        ? [...bookin.rooms]
            .sort((a, b) =>
              Number(a) - Number(b)
            )
            .join(', ')
        : '',


      // Status
      bookin.status === 'Pending' ? (

        <div className="statusbuttons">

          <button
            type="button"
            onClick={() =>
              handleapprove(
                bookin._id
              )
            }
          >
            Approve
          </button>


          <button
            type="button"
            onClick={() =>
              handlereject(
                bookin._id
              )
            }
          >
            Reject
          </button>

        </div>

      ) : (

        bookin.status || 'Unknown'

      )

    ]);


  // =====================================================
  // COLUMNS
  // =====================================================

  const columns = [

    'Booking Id',

    'Full Name',

    'Email',

    'Booked on',

    'Check In',

    'Check Out',

    'Rooms',

    'Status'

  ];


  // =====================================================
  // TABLE OPTIONS
  // =====================================================

  const options = {

    filter: false,

    search: true,

    selectableRows: 'none',

    print: false,

    download: false,

    viewColumns: false,

    pagination: true,

    rowsPerPageOptions: [
      5,
      10,
      15,
      20
    ]

  };


  return (

    <div className="maintable">

      <div className="table">

        <MUIDataTable

          className="tab"

          title="All Bookings"

          data={data}

          columns={columns}

          options={options}

        />

        <ToastContainer />

      </div>

    </div>

  );

};


export default Table;