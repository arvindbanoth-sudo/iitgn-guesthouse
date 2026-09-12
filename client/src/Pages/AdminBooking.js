import React, { useState, useEffect } from 'react';
import './newbooking.css';
import axios from 'axios';
import moment from 'moment';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Newbook = () => {

  const navigate = useNavigate();

  const [cookies] = useCookies([
    'admin_access_token'
  ]);

  const API_URL = process.env.REACT_APP_API_URL;


  // =====================================================
  // FORM STATE
  // =====================================================

  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [t, setT] = useState('');
  const [request, setRequest] = useState('');
  const [person, setPerson] = useState('');
  const [rooms, setRooms] = useState([]);
  const [rom, setRom] = useState([]);
  const [purpose, setPurpose] = useState('');
  const [meal, setMeal] = useState('');

  const [startdate, setStartDate] = useState('');
  const [enddate, setEndDate] = useState('');

  const [typerooms, setTypeRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);


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
  // FETCH AVAILABLE ROOMS
  // =====================================================

  useEffect(() => {

    const fetchAvailableRooms = async () => {

      if (
        !startdate ||
        !enddate ||
        !cookies.admin_access_token
      ) {
        return;
      }


      if (
        new Date(enddate) <=
        new Date(startdate)
      ) {

        setAvailableRooms([]);
        setRom([]);

        return;
      }


      try {

        // Get all rooms
        const roomsResponse = await axios.get(
          `${API_URL}/rooms/allfreerooms`,
          {
            headers: {
              'x-token':
                cookies.admin_access_token
            }
          }
        );


        const allRooms =
          roomsResponse.data.Rooms || [];


        // Get bookings
        const bookingsResponse =
          await axios.get(
            `${API_URL}/admibookings/bookings`,
            {
              headers: {
                'x-token':
                  cookies.admin_access_token
              }
            }
          );


        const bookings =
          bookingsResponse.data.Bookings || [];


        // Determine which rooms are occupied
        const available = allRooms.filter(
          (room) => {

            const roomNumber =
              String(room.roomnumber);


            const hasConflict =
              bookings.some((booking) => {

                // Rejected bookings don't block rooms
                if (
                  booking.status !== 'Approved' &&
                  booking.status !== 'Pending'
                ) {
                  return false;
                }


                if (
                  !Array.isArray(booking.rooms)
                ) {
                  return false;
                }


                // Check whether this room is part
                // of the existing booking
                if (
                  !booking.rooms
                    .map(String)
                    .includes(roomNumber)
                ) {
                  return false;
                }


                const bookedIn =
                  parseBookingDate(
                    booking.fromdate
                  );

                const bookedOut =
                  parseBookingDate(
                    booking.enddate
                  );


                if (
                  !bookedIn ||
                  !bookedOut
                ) {
                  return false;
                }


                const requestedIn =
                  new Date(startdate);

                const requestedOut =
                  new Date(enddate);


                /*
                 * Two date ranges overlap when:
                 *
                 * requestedIn < bookedOut
                 * AND
                 * requestedOut > bookedIn
                 */
                return (
                  requestedIn < bookedOut &&
                  requestedOut > bookedIn
                );

              });


            return !hasConflict;

          }
        );


        setAvailableRooms(available);

        // Clear selected rooms when dates change
        setRooms([]);
        setTypeRooms([]);
        setRom([]);

      } catch (error) {

        console.error(
          'Error fetching available rooms:',
          error
        );

        setAvailableRooms([]);
        setRom([]);

      }

    };


    fetchAvailableRooms();

  }, [
    startdate,
    enddate,
    API_URL,
    cookies.admin_access_token
  ]);


  // =====================================================
  // DATE PARSER
  // =====================================================

  const parseBookingDate = (dateString) => {

    if (!dateString) {
      return null;
    }


    const parts =
      String(dateString).split('-');


    if (parts.length === 3) {

      return new Date(
        Number(parts[2]),
        Number(parts[1]) - 1,
        Number(parts[0])
      );

    }


    const date =
      new Date(dateString);


    return Number.isNaN(
      date.getTime()
    )
      ? null
      : date;

  };


  // =====================================================
  // ROOM SELECTION
  // =====================================================

  const onRoomChange = (e) => {

    const roomId =
      e.target.value;

    const roomType =
      e.target.dataset.typerooms;

    const isChecked =
      e.target.checked;


    setRom((prevRooms) =>

      prevRooms.map((room) => {

        if (room._id === roomId) {

          return {
            ...room,
            checked: isChecked
          };

        }

        return room;

      })

    );


    setRooms((prevRooms) => {

      if (isChecked) {

        if (!prevRooms.includes(roomId)) {
          return [...prevRooms, roomId];
        }

        return prevRooms;

      }


      return prevRooms.filter(
        (id) => id !== roomId
      );

    });


    setTypeRooms((prevRoomTypes) => {

      if (isChecked) {

        if (
          !prevRoomTypes.includes(roomType)
        ) {

          return [
            ...prevRoomTypes,
            roomType
          ];

        }

      }


      /*
       * Only remove a room type if there are
       * no selected rooms of that type left.
       */

      const remainingRoomIds =
        isChecked
          ? rooms
          : rooms.filter(
              (id) => id !== roomId
            );


      const stillHasType =
        availableRooms.some(
          (room) =>
            remainingRoomIds.includes(room._id) &&
            room.options === roomType
        );


      if (!stillHasType) {

        return prevRoomTypes.filter(
          (type) => type !== roomType
        );

      }


      return prevRoomTypes;

    });

  };


  // =====================================================
  // MEAL SELECTION
  // =====================================================

  const onOptionChange = (e) => {

    setMeal(
      e.target.value
    );

  };


  // =====================================================
  // ROOM TYPE FILTER
  // =====================================================

  const onOtChange = (e) => {

    const selectedRoomType =
      e.target.value;

    setT(selectedRoomType);


    const filteredRooms =
      availableRooms.filter(
        (room) =>
          room.options === selectedRoomType
      );


    const updatedRooms =
      filteredRooms.map((room) => ({

        ...room,

        checked:
          rooms.includes(room._id)

      }));


    setRom(updatedRooms);

  };


  // =====================================================
  // SUBMIT BOOKING
  // =====================================================

  const handlessubmit = async (e) => {

    e.preventDefault();


    if (
      fname.trim() === '' ||
      lname.trim() === '' ||
      address.trim() === '' ||
      email.trim() === '' ||
      phonenumber.trim() === '' ||
      purpose.trim() === '' ||
      rooms.length === 0 ||
      meal === '' ||
      !startdate ||
      !enddate ||
      typerooms.length === 0 ||
      person === ''
    ) {

      alert(
        'Please fill all the required details!'
      );

      return;
    }


    if (
      new Date(enddate) <=
      new Date(startdate)
    ) {

      alert(
        'Check-out date must be after check-in date.'
      );

      return;
    }


    const formattedStartDate =
      moment(
        startdate,
        'YYYY-MM-DD'
      ).format('DD-MM-YYYY');


    const formattedEndDate =
      moment(
        enddate,
        'YYYY-MM-DD'
      ).format('DD-MM-YYYY');


    try {

      await axios.post(

        `${API_URL}/admibookings/newbook`,

        {
          fname: fname.trim(),

          lname: lname.trim(),

          email:
            email.trim().toLowerCase(),

          phonenumber:
            phonenumber.trim(),

          address:
            address.trim(),

          rooms,

          roomstype:
            typerooms,

          adults:
            person,

          fromdate:
            formattedStartDate,

          enddate:
            formattedEndDate,

          meal,

          specialrequest:
            request.trim()
        },

        {
          headers: {
            'x-token':
              cookies.admin_access_token
          }
        }

      );


      alert(
        'Booking completed successfully!'
      );


      // Reset form
      setFname('');
      setLname('');
      setEmail('');
      setPhoneNumber('');
      setAddress('');
      setRooms([]);
      setTypeRooms([]);
      setPerson('');
      setMeal('');
      setRequest('');
      setStartDate('');
      setEndDate('');
      setT('');
      setPurpose('');
      setAvailableRooms([]);
      setRom([]);


    } catch (error) {

      console.error(
        'Booking creation error:',
        error
      );


      if (
        error.response?.status === 401
      ) {

        navigate('/admin-login', {
          replace: true
        });

        return;
      }


      alert(
        error.response?.data?.message ||
        'Unable to create booking.'
      );

    }

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="admincontainer">

      <div className="adminmain-container">

        <form
          onSubmit={handlessubmit}
          className="adminbookingform"
        >

          <p className="det-1">
            Create a New Booking
          </p>


          {/* NAME */}
          <div className="labelname">

            <div className="fname">

              <label htmlFor="fname">
                First Name *
              </label>

              <input
                type="text"
                name="fname"
                value={fname}
                onChange={(e) =>
                  setFname(e.target.value)
                }
                required
              />

            </div>


            <div className="lname">

              <label htmlFor="lname">
                Last Name *
              </label>

              <input
                type="text"
                name="lname"
                value={lname}
                onChange={(e) =>
                  setLname(e.target.value)
                }
                required
              />

            </div>

          </div>


          {/* CONTACT */}
          <div className="labelname">

            <div className="fname">

              <label htmlFor="email">
                Email *
              </label>

              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>


            <div className="lname">

              <label htmlFor="phonenumber">
                Phone Number *
              </label>

              <input
                type="tel"
                name="phonenumber"
                value={phonenumber}
                onChange={(e) =>
                  setPhoneNumber(e.target.value)
                }
                required
              />

            </div>

          </div>


          {/* ADDRESS + PURPOSE */}
          <div className="labelname">

            <div className="fname">

              <label htmlFor="address">
                Address *
              </label>

              <input
                type="text"
                name="address"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                required
              />

            </div>


            <div className="lname">

              <label htmlFor="purpose">
                Purpose *
              </label>

              <input
                type="text"
                name="purpose"
                value={purpose}
                onChange={(e) =>
                  setPurpose(e.target.value)
                }
                required
              />

            </div>

          </div>


          {/* DATES */}
          <div className="labelname">

            <div className="fname">

              <label htmlFor="startdate">
                Check-in *
              </label>

              <input
                type="date"
                name="startdate"
                value={startdate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
                required
              />

            </div>


            <div className="lname">

              <label htmlFor="enddate">
                Check-out *
              </label>

              <input
                type="date"
                name="enddate"
                value={enddate}
                onChange={(e) =>
                  setEndDate(e.target.value)
                }
                required
              />

            </div>

          </div>


          {/* SPECIAL REQUEST */}
          <div className="special lname">

            <label htmlFor="req">
              Special Request
            </label>

            <textarea
              id="req"
              rows="10"
              cols="53"
              value={request}
              onChange={(e) =>
                setRequest(e.target.value)
              }
            />

          </div>


          {/* NUMBER OF PEOPLE */}
          <div className="persons">

            <label className="adult">
              Number of Persons *
            </label>

            <select
              value={person}
              onChange={(e) =>
                setPerson(e.target.value)
              }
              required
            >

              <option value="">
                Choose your option
              </option>

              <option value="1">
                1 (1 Person)
              </option>

              <option value="2">
                2 (2 Persons)
              </option>

              <option value="3">
                3 (3 Persons)
              </option>

              <option value="4">
                4 (4 Persons)
              </option>

              <option value="5">
                5 (5 Persons)
              </option>

              <option value="6">
                6 (6 Persons)
              </option>

            </select>

          </div>


          {/* ROOM TYPE */}
          <div className="lname">

            <label className="adult">
              Type of Room:
            </label>

            <select
              value={t}
              onChange={onOtChange}
            >

              <option value="">
                Choose your option
              </option>

              <option value="Single">
                Single
              </option>

              <option value="Double">
                Double
              </option>

              <option value="Deluxe">
                Deluxe
              </option>

            </select>

          </div>


          <br />


          {/* ROOMS */}
          <div className="rooms">

            <span>
              Choose rooms from below *
            </span>

            <br />


            {rom.map((room) => (

              <React.Fragment
                key={room._id}
              >

                <input
                  checked={
                    room.checked || false
                  }
                  type="checkbox"
                  id={room._id}
                  name="room"
                  value={room._id}
                  data-typerooms={
                    room.options
                  }
                  onChange={onRoomChange}
                />


                <label
                  htmlFor={room._id}
                >
                  {room.roomnumber}
                </label>

                <br />

              </React.Fragment>

            ))}


            {startdate &&
              enddate &&
              rom.length === 0 && (

                <p>
                  No rooms available for
                  this room type and dates.
                </p>

              )
            }

          </div>


          {/* MEALS */}
          <div className="rooms">

            <div className="spanad">

              <span>
                Choose your meal *
              </span>

              <br />

            </div>


            <input
              type="radio"
              id="roomonly"
              name="meal"
              value="Roomonly"
              onChange={onOptionChange}
              checked={
                meal === 'Roomonly'
              }
            />

            <label htmlFor="roomonly">
              Room Only
            </label>

            <br />


            <input
              type="radio"
              id="breakfast"
              name="meal"
              value="Breakfast"
              onChange={onOptionChange}
              checked={
                meal === 'Breakfast'
              }
            />

            <label htmlFor="breakfast">
              Breakfast
            </label>

            <br />


            <input
              type="radio"
              id="brunch"
              name="meal"
              value="Brunch"
              onChange={onOptionChange}
              checked={
                meal === 'Brunch'
              }
            />

            <label htmlFor="brunch">
              Brunch (Breakfast and Lunch)
            </label>

            <br />


            <input
              type="radio"
              id="threesquaremeals"
              name="meal"
              value="Three Square Meals"
              onChange={onOptionChange}
              checked={
                meal === 'Three Square Meals'
              }
            />

            <label htmlFor="threesquaremeals">
              Three Square Meals
            </label>

          </div>


          <button type="submit">
            Create Booking
          </button>

        </form>

      </div>

    </div>

  );

};


export default Newbook;