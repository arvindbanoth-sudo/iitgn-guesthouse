const express = require('express');
const router = express.Router();

const roommodel = require('../pages/roommodel');
const usersmodel = require('../pages/usersmodel');
const facultymodel = require('../pages/facultymodel');
const bookingsmodel = require('../pages/bookingmodel');
const middleware = require('../middleware');


// =====================================================
// HELPERS
// =====================================================

// Convert application dates such as DD-MM-YYYY
// into a valid JavaScript Date object.
const parseDate = (value) => {
  if (!value) {
    return null;
  }

  // Application stores dates as DD-MM-YYYY
  if (
    typeof value === 'string' &&
    /^\d{2}-\d{2}-\d{4}$/.test(value)
  ) {
    const [day, month, year] = value.split('-');

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    // Validate that the date actually exists
    if (
      date.getFullYear() !== Number(year) ||
      date.getMonth() !== Number(month) - 1 ||
      date.getDate() !== Number(day)
    ) {
      return null;
    }

    return date;
  }

  // Fallback for ISO/browser date formats
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
};


// Check whether two booking date ranges overlap
const datesOverlap = (
  startA,
  endA,
  startB,
  endB
) => {
  return (
    startA < endB &&
    endA > startB
  );
};


// =====================================================
// BOOKING ROUTE TEST
// =====================================================

router.get('/', (req, res) => {
  res.send('/book ---> current user bookings');
});


// =====================================================
// CREATE A BOOKING
// =====================================================

router.post('/book', middleware, async (req, res) => {

  try {

    // -------------------------------------------------
    // Find logged-in user
    // -------------------------------------------------

    let user = null;

    if (req.role === 'student') {

      user =
        await usersmodel.findById(
          req.userid
        );

    }

    if (req.role === 'faculty') {

      user =
        await facultymodel.findById(
          req.userid
        );

    }


    // Fallback for older JWT tokens which
    // may not contain a role.
    if (!user) {

      user =
        await usersmodel.findById(
          req.userid
        );

      if (!user) {

        user =
          await facultymodel.findById(
            req.userid
          );

      }

    }


    if (!user) {

      return res.status(401).json({
        message: 'User not found'
      });

    }


    // -------------------------------------------------
    // Get booking information
    // -------------------------------------------------

    const {
      Firstname,
      Lastname,
      Email,
      Phonenumber,
      Address,
      Rooms,
      Roomstype,
      Adults,
      Meals,
      Specialrequest,
      Purpose,
      Fromdate,
      Enddate
    } = req.body;


    // -------------------------------------------------
    // Validate required fields
    // -------------------------------------------------

    if (
      !Firstname ||
      !Lastname ||
      !Email ||
      !Phonenumber ||
      !Address ||
      !Rooms ||
      !Array.isArray(Rooms) ||
      Rooms.length === 0 ||
      !Adults ||
      !Meals ||
      !Fromdate ||
      !Enddate
    ) {

      return res.status(400).json({
        message:
          'Please provide all required booking details'
      });

    }


    // -------------------------------------------------
    // Validate dates
    // -------------------------------------------------

    const startDate =
      parseDate(Fromdate);

    const endDate =
      parseDate(Enddate);


    if (!startDate || !endDate) {

      return res.status(400).json({
        message:
          'Invalid booking dates'
      });

    }


    if (endDate <= startDate) {

      return res.status(400).json({
        message:
          'End date must be after start date'
      });

    }


    // -------------------------------------------------
    // Find requested rooms
    // -------------------------------------------------

    const rooms =
      await roommodel.find({
        _id: {
          $in: Rooms
        }
      });


    if (rooms.length !== Rooms.length) {

      return res.status(400).json({
        message:
          'One or more selected rooms were not found'
      });

    }


    // -------------------------------------------------
    // Check room availability
    // -------------------------------------------------

    const existingBookings =
      await bookingsmodel.find({
        rooms: {
          $in: Rooms
        },

        status: {
          $in: [
            'Pending',
            'Approved'
          ]
        }

      }).lean();


    for (
      const existingBooking
      of existingBookings
    ) {

      const existingStart =
        parseDate(
          existingBooking.fromdate
        );

      const existingEnd =
        parseDate(
          existingBooking.enddate
        );


      if (
        existingStart &&
        existingEnd &&
        datesOverlap(
          startDate,
          endDate,
          existingStart,
          existingEnd
        )
      ) {

        return res.status(409).json({
          message:
            'One or more selected rooms are already booked for the selected dates'
        });

      }

    }


    // -------------------------------------------------
    // Create booking
    // -------------------------------------------------

    const booking =
      new bookingsmodel({

        userid:
          user._id,

        firstname:
          Firstname.trim(),

        lastname:
          Lastname.trim(),

        email:
          Email.toLowerCase().trim(),

        phonenumber:
          String(
            Phonenumber
          ).trim(),

        adults:
          String(
            Adults
          ),

        address:
          Address.trim(),

        fromdate:
          Fromdate,

        enddate:
          Enddate,

        rooms:
          Rooms,

        roomstype:
          Roomstype || [],

        specialrequest:
          Specialrequest || '',

        purpose:
          Purpose || '',

        meals:
          Meals,

        usertype:
          user.role === 'faculty'
            ? 'faculty'
            : 'student',

        status:
          'Pending'

      });


    // -------------------------------------------------
    // Save booking
    // -------------------------------------------------

    const result =
      await booking.save();


    // -------------------------------------------------
    // Add booking to user
    // -------------------------------------------------

    if (!user.bookings) {
      user.bookings = [];
    }


    user.bookings.push(
      result._id
    );


    await user.save();


    // -------------------------------------------------
    // Add booking to rooms
    // -------------------------------------------------

    await Promise.all(

      rooms.map(
        async (room) => {

          if (!room.booking) {
            room.booking = [];
          }


          room.booking.push(
            result._id
          );


          await room.save();

        }
      )

    );


    // -------------------------------------------------
    // Return booking summary
    // -------------------------------------------------

    return res.status(201).json({

      message:
        'Booking created successfully',

      BookingSummary:
        result

    });

  } catch (error) {

    console.error(
      'Error creating booking:',
      error
    );


    return res.status(500).json({

      message:
        'Internal Server Error',

      error:
        error.message

    });

  }

});


// =====================================================
// GET CURRENT USER'S BOOKINGS
// =====================================================

router.get('/book', middleware, async (req, res) => {

  try {

    let user = null;


    if (req.role === 'student') {

      user =
        await usersmodel.findById(
          req.userid
        );

    }


    if (req.role === 'faculty') {

      user =
        await facultymodel.findById(
          req.userid
        );

    }


    // Fallback for older tokens
    if (!user) {

      user =
        await usersmodel.findById(
          req.userid
        );

      if (!user) {

        user =
          await facultymodel.findById(
            req.userid
          );

      }

    }


    if (!user) {

      return res.status(401).json({
        message:
          'User not found'
      });

    }


    // -------------------------------------------------
    // Get bookings belonging to current user
    // -------------------------------------------------

    const bookings =
      await bookingsmodel.find({
        userid:
          user._id
      }).lean();


    // -------------------------------------------------
    // Replace room IDs with room numbers
    // -------------------------------------------------

    await Promise.all(

      bookings.map(
        async (booking) => {

          const roomNumbers = [];


          for (
            const roomId
            of booking.rooms || []
          ) {

            const room =
              await roommodel
                .findById(roomId)
                .lean();


            if (room) {

              roomNumbers.push(
                room.roomnumber
              );

            }

          }


          roomNumbers.sort(
            (a, b) =>
              Number(a) - Number(b)
          );


          booking.rooms =
            roomNumbers;

        }
      )

    );


    // -------------------------------------------------
    // Return bookings
    // -------------------------------------------------

    return res.status(200).json({

      Bookings:
        bookings,

      User:
        user

    });

  } catch (error) {

    console.error(
      'Error fetching bookings:',
      error
    );


    return res.status(500).json({

      message:
        'Internal Server Error',

      error:
        error.message

    });

  }

});


// =====================================================
// GET INDIVIDUAL BOOKING
// =====================================================

router.get(
  '/:room',
  middleware,
  async (req, res) => {

    try {

      let user = null;


      if (req.role === 'student') {

        user =
          await usersmodel.findById(
            req.userid
          );

      }


      if (req.role === 'faculty') {

        user =
          await facultymodel.findById(
            req.userid
          );

      }


      // Fallback for older tokens
      if (!user) {

        user =
          await usersmodel.findById(
            req.userid
          );

        if (!user) {

          user =
            await facultymodel.findById(
              req.userid
            );

        }

      }


      if (!user) {

        return res.status(401).json({
          message:
            'User not found'
        });

      }


      // -------------------------------------------------
      // Find booking
      // -------------------------------------------------

      const booking =
        await bookingsmodel.findById(
          req.params.room
        );


      if (!booking) {

        return res.status(404).json({
          message:
            'Booking not found'
        });

      }


      // -------------------------------------------------
      // Security check
      // Make sure this booking belongs to
      // the logged-in user.
      // -------------------------------------------------

      if (
        !booking.userid ||
        booking.userid.toString() !==
          user._id.toString()
      ) {

        return res.status(403).json({

          message:
            'You are not authorized to view this booking'

        });

      }


      return res.status(200).json({

        bookingdetail:
          booking

      });

    } catch (error) {

      console.error(
        'Error fetching booking:',
        error
      );


      return res.status(500).json({

        message:
          'Internal Server Error'

      });

    }

  }
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;