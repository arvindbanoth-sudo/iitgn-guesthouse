import React, { useEffect, useState } from 'react';
import './detailspage.css';

import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export default function Detailspage({
  accomodation,
  details,
  setdetails
}) {

  const navigate = useNavigate();

  const [cookies] =
    useCookies(['access_token']);

  const API_URL =
    process.env.REACT_APP_API_URL;

  const [roomsToSelect, setRoomsToSelect] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // -----------------------------------------------------
  // AUTH
  // -----------------------------------------------------

  useEffect(() => {

    if (!cookies.access_token) {
      navigate('/');
    }

  }, [
    cookies.access_token,
    navigate
  ]);


  // -----------------------------------------------------
  // SAVED DATES
  // -----------------------------------------------------

  const savedCheckin =
    sessionStorage.getItem('checkin');

  const savedCheckout =
    sessionStorage.getItem('checkout');


  // -----------------------------------------------------
  // ROOM TYPE
  // -----------------------------------------------------

  let roomType = '';

  if (accomodation === 0) {
    roomType = 'Double';
  } else if (accomodation === 1) {
    roomType = 'Single';
  } else if (accomodation === 2) {
    roomType = 'Deluxe';
  }


  // -----------------------------------------------------
  // FETCH AVAILABLE ROOMS
  // -----------------------------------------------------

  useEffect(() => {

    const fetchRooms = async () => {

      if (
        !cookies.access_token ||
        !savedCheckin ||
        !savedCheckout ||
        !roomType
      ) {
        setLoading(false);
        return;
      }

      try {

        setLoading(true);

        const response = await axios.get(
          `${API_URL}/rooms/available`,
          {
            params: {
              fromdate: savedCheckin,
              enddate: savedCheckout,
              type: roomType
            },

            headers: {
              'x-token':
                cookies.access_token
            }
          }
        );


        setRoomsToSelect(
          response.data?.Rooms || []
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

          navigate('/');

          return;
        }

        alert(
          error.response?.data?.message ||
          'Unable to fetch available rooms.'
        );

      } finally {

        setLoading(false);

      }

    };


    fetchRooms();

  }, [
    API_URL,
    cookies.access_token,
    navigate,
    savedCheckin,
    savedCheckout,
    roomType
  ]);


  // -----------------------------------------------------
  // INPUT HANDLER
  // -----------------------------------------------------

  const changeHandler = (event) => {

    const {
      name,
      value
    } = event.target;

    setdetails(previous => ({
      ...previous,
      [name]: value
    }));

  };


  // -----------------------------------------------------
  // ROOM CHECKBOX
  // -----------------------------------------------------

  const roomChangeHandler = (event) => {

    const {
      checked,
      value
    } = event.target;


    setdetails(previous => {

      if (checked) {

        if (
          previous.Rooms.includes(value)
        ) {
          return previous;
        }

        return {
          ...previous,

          Rooms: [
            ...previous.Rooms,
            value
          ]

        };

      }


      return {

        ...previous,

        Rooms:
          previous.Rooms.filter(
            room => room !== value
          )

      };

    });

  };


  return (

    <div>

      <div className="details_name">
        Enter the details
      </div>


      {/* =================================================
          NUMBER OF ADULTS
      ================================================= */}

      <div className="adults">

        <label htmlFor="adults">

          Number of Adults

          <span
            style={{
              color: 'red'
            }}
          >
            *
          </span>

          :

        </label>


        <select
          id="adults"
          name="Adults"
          value={details.Adults}
          onChange={changeHandler}
        >

          {[1,2,3,4,5,6,7,8,9,10].map(
            number => (

              <option
                key={number}
                value={number}
              >
                {number}{' '}
                {number === 1
                  ? 'adult'
                  : 'adults'}
              </option>

            )
          )}

        </select>

      </div>


      {/* =================================================
          ROOMS
      ================================================= */}

      <div className="selectrooms">

        <p className="chrm">

          Choose rooms from below

          <span
            style={{
              color: 'red'
            }}
          >
            *
          </span>

          :

        </p>


        {loading ? (

          <div className="loading">

            <div className="loader"></div>

            Loading...

          </div>

        ) : roomsToSelect.length > 0 ? (

          roomsToSelect.map(room => (

            <div
              className="checkbox"
              key={room._id}
            >

              <input
                type="checkbox"
                id={room._id}
                name="Rooms"
                value={room._id}
                onChange={roomChangeHandler}
                checked={
                  details.Rooms.includes(
                    room._id
                  )
                }
              />

              <label
                htmlFor={room._id}
              >
                {room.roomnumber}
              </label>

              <br />

            </div>

          ))

        ) : (

          <div>
            No {roomType} rooms are available
            for the selected dates.
          </div>

        )}

      </div>


      {/* =================================================
          MEALS
      ================================================= */}

      <div className="radio_btns">

        <p className="plan">

          Your Meal Plan

          <span
            style={{
              color: 'red'
            }}
          >
            *
          </span>

        </p>


        <label>

          <input
            type="radio"
            name="Meals"
            value="Room Only"
            checked={
              details.Meals ===
              'Room Only'
            }
            onChange={changeHandler}
          />

          {' '}Room Only

        </label>

        <br />


        <label>

          <input
            type="radio"
            name="Meals"
            value="Breakfast"
            checked={
              details.Meals ===
              'Breakfast'
            }
            onChange={changeHandler}
          />

          {' '}Breakfast

        </label>

        <br />


        <label>

          <input
            type="radio"
            name="Meals"
            value="Brunch"
            checked={
              details.Meals ===
              'Brunch'
            }
            onChange={changeHandler}
          />

          {' '}Brunch (Breakfast and Lunch)

        </label>

        <br />


        <label>

          <input
            type="radio"
            name="Meals"
            value="Three square meals"
            checked={
              details.Meals ===
              'Three square meals'
            }
            onChange={changeHandler}
          />

          {' '}Three square meals

        </label>

      </div>

    </div>

  );
}