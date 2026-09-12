import React, { useEffect, useState } from 'react';
import './allrooms.css';

import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Roomcard from '../components/Roomcard';
import axios from 'axios';

// =====================================================
// ROOM IMAGES
// =====================================================

import DoubleRoomImage from '../images/rooms/double-room.jpg';
import SingleRoomImage from '../images/rooms/single-room.jpg';
import DeluxeRoomImage from '../images/rooms/deluxe-room.jpg';


export default function Allrooms({ setaccomodation }) {

  const navigate = useNavigate();

  const [cookies] = useCookies([
    'access_token'
  ]);

  const API_URL =
    process.env.REACT_APP_API_URL;

  const savedCheckin =
    sessionStorage.getItem('checkin');

  const savedCheckout =
    sessionStorage.getItem('checkout');

  const [totaltypes, setTotalTypes] =
    useState(0);

  const [rooms, setRooms] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // CHECK LOGIN
  // =====================================================

  useEffect(() => {

    if (!cookies.access_token) {

      navigate('/', {
        replace: true
      });

    }

  }, [
    cookies.access_token,
    navigate
  ]);


  // =====================================================
  // GET AVAILABLE ROOMS
  // =====================================================

  useEffect(() => {

    const fetchAvailableRooms = async () => {

      if (
        !cookies.access_token ||
        !savedCheckin ||
        !savedCheckout
      ) {

        setLoading(false);
        return;

      }


      try {

        setLoading(true);


        const [
          doubleResponse,
          singleResponse,
          deluxeResponse
        ] = await Promise.all([

          axios.get(
            `${API_URL}/rooms/available`,
            {
              params: {
                fromdate: savedCheckin,
                enddate: savedCheckout,
                type: 'Double'
              },

              headers: {
                'x-token':
                  cookies.access_token
              }
            }
          ),

          axios.get(
            `${API_URL}/rooms/available`,
            {
              params: {
                fromdate: savedCheckin,
                enddate: savedCheckout,
                type: 'Single'
              },

              headers: {
                'x-token':
                  cookies.access_token
              }
            }
          ),

          axios.get(
            `${API_URL}/rooms/available`,
            {
              params: {
                fromdate: savedCheckin,
                enddate: savedCheckout,
                type: 'Deluxe'
              },

              headers: {
                'x-token':
                  cookies.access_token
              }
            }
          )

        ]);


        const doubleRooms =
          doubleResponse.data?.Rooms || [];

        const singleRooms =
          singleResponse.data?.Rooms || [];

        const deluxeRooms =
          deluxeResponse.data?.Rooms || [];


        // =================================================
        // ROOM CARDS
        // =================================================

        const updatedRooms = [

          {
            roomtype:
              'Double Room',

            roomdescription:
              'Our Double rooms provide comfortable accommodation for guests travelling together. The room is thoughtfully furnished and equipped with essential facilities for a pleasant stay.',

            roomimgsrc:
              DoubleRoomImage,

            fromdate:
              savedCheckin,

            enddate:
              savedCheckout,

            roomsleft:
              doubleRooms.length,

            isavaible:
              doubleRooms.length > 0,

            unique:
              0
          },


          {
            roomtype:
              'Single Room',

            roomdescription:
              'Our Single rooms provide comfortable and private accommodation for individual guests. The room is thoughtfully furnished for a convenient and pleasant stay.',

            roomimgsrc:
              SingleRoomImage,

            fromdate:
              savedCheckin,

            enddate:
              savedCheckout,

            roomsleft:
              singleRooms.length,

            isavaible:
              singleRooms.length > 0,

            unique:
              1
          },


          {
            roomtype:
              'Deluxe Room',

            roomdescription:
              'Our Deluxe rooms provide a spacious and comfortable accommodation experience for guests looking for additional convenience during their stay.',

            roomimgsrc:
              DeluxeRoomImage,

            fromdate:
              savedCheckin,

            enddate:
              savedCheckout,

            roomsleft:
              deluxeRooms.length,

            isavaible:
              deluxeRooms.length > 0,

            unique:
              2
          }

        ];


        const availableTypes =
          updatedRooms.filter(
            room =>
              room.isavaible
          );


        if (
          availableTypes.length === 0
        ) {

          setTotalTypes(-1);

        } else {

          setTotalTypes(
            availableTypes.length
          );

        }


        setRooms(
          updatedRooms
        );


      } catch (error) {

        console.error(
          'Error fetching available rooms:',
          error
        );


        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {

          navigate('/', {
            replace: true
          });

          return;

        }


        alert(
          error.response?.data?.message ||
          'Unable to load room availability.'
        );

        setTotalTypes(-1);

      } finally {

        setLoading(false);

      }

    };


    fetchAvailableRooms();

  }, [
    API_URL,
    cookies.access_token,
    navigate,
    savedCheckin,
    savedCheckout
  ]);


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="searchresultcont">

      <div>

        <p className="avaibile">
          Check Availability!
        </p>

      </div>


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


      <div className="searchresultsdesc">

        {loading && (

          <div className="types">

            <div className="loading">

              <div className="loader"></div>

              Loading...

            </div>

          </div>

        )}


        {!loading &&
          totaltypes > 0 && (

          <p className="types">

            We have found{' '}

            <strong>
              {totaltypes}
            </strong>{' '}

            types of accommodation
            that suit your needs.

          </p>

        )}


        {!loading &&
          totaltypes === -1 && (

          <div
            className="choosetype"
            style={{
              textAlign: 'center'
            }}
          >
            Sorry! No rooms are available
            for the selected dates.
          </div>

        )}


        {!loading &&
          totaltypes > 0 && (

          <p className="choosetype">
            Select your accommodation
          </p>

        )}


        <div className="roomcardsdiv">

          {rooms.map((room) => {

            if (!room.isavaible) {
              return null;
            }

            return (

              <Roomcard
                key={room.unique}
                selectroom={room}
                setaccomodation={
                  setaccomodation
                }
              />

            );

          })}

        </div>

      </div>

    </div>

  );

}