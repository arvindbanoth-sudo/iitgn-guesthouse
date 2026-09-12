const express = require('express');
const router = express.Router();

const roommodel = require('../pages/roommodel');
const usersmodel = require('../pages/usersmodel');
const facultymodel = require('../pages/facultymodel');
const adminmodel = require('../pages/adminmodel');
const bookingmodel = require('../pages/bookingmodel');
const middleware = require('../middleware');


// =====================================================
// TEST ROUTE
// =====================================================

router.get('/', (req, res) => {
  res.send('Room route testing!');
});


// =====================================================
// ADMIN - CREATE A ROOM
// =====================================================

router.post('/enter', middleware, async (req, res) => {

  try {

    const exist = await adminmodel.findById(req.userid);

    if (!exist) {
      return res.status(403).json({
        message: 'Admin access required'
      });
    }

    const {
      roomnumber,
      options
    } = req.body;


    if (!roomnumber || !options) {
      return res.status(400).json({
        message: 'Room number and room type are required'
      });
    }


    const allowedTypes = [
      'Deluxe',
      'Single',
      'Double'
    ];


    if (!allowedTypes.includes(options)) {
      return res.status(400).json({
        message:
          'Invalid room type. Allowed types are Deluxe, Single and Double.'
      });
    }


    const existingRoom =
      await roommodel.findOne({
        roomnumber: roomnumber.trim()
      });


    if (existingRoom) {
      return res.status(400).json({
        message: 'Room already exists!'
      });
    }


    const newroom = new roommodel({
      roomnumber: roomnumber.trim(),
      options: options
    });


    await newroom.save();


    return res.status(201).json({
      message: 'Room created successfully!',
      room: newroom
    });

  } catch (error) {

    console.error(
      'Error creating room:',
      error
    );

    return res.status(500).json({
      message: 'Internal Server Error'
    });

  }

});


// =====================================================
// USERS / FACULTY - GET ALL ROOMS BY TYPE
// =====================================================

router.get('/allrooms', middleware, async (req, res) => {

  try {

    const student =
      await usersmodel.findById(req.userid);

    const faculty =
      await facultymodel.findById(req.userid);

    if (!student && !faculty) {
      return res.status(403).json({
        message: 'User not found'
      });
    }


    const deluxerooms =
      await roommodel.find({
        options: 'Deluxe'
      }).sort({
        roomnumber: 1
      });


    const singlerooms =
      await roommodel.find({
        options: 'Single'
      }).sort({
        roomnumber: 1
      });


    const doublerooms =
      await roommodel.find({
        options: 'Double'
      }).sort({
        roomnumber: 1
      });


    return res.status(200).json({

      alldeluxerooms: deluxerooms,

      allsinglerooms: singlerooms,

      alldoublerooms: doublerooms

    });

  } catch (error) {

    console.error(
      'Error fetching rooms:',
      error
    );

    return res.status(500).json({
      message: 'Internal Server Error'
    });

  }

});


// =====================================================
// GET ALL ROOMS
// Used by ADMIN
// =====================================================

router.get('/allfreerooms', middleware, async (req, res) => {

  try {

    const rooms =
      await roommodel.find({}).sort({
        roomnumber: 1
      });


    return res.status(200).json({
      Rooms: rooms
    });

  } catch (error) {

    console.error(
      'Error fetching all rooms:',
      error
    );

    return res.status(500).json({
      message: 'Internal Server Error'
    });

  }

});


// =====================================================
// GET AVAILABLE ROOMS FOR SELECTED DATES
//
// Example:
// GET /rooms/available?fromdate=12-09-2026&enddate=15-09-2026&type=Double
//
// This checks Pending and Approved bookings only.
// Rejected and Cancelled bookings do not block a room.
// =====================================================

router.get('/available', middleware, async (req, res) => {

  try {

    const {
      fromdate,
      enddate,
      type
    } = req.query;


    // -------------------------------------------------
    // Validate input
    // -------------------------------------------------

    if (!fromdate || !enddate) {

      return res.status(400).json({
        message:
          'fromdate and enddate are required'
      });

    }


    const parseDate = (value) => {

      if (
        typeof value !== 'string' ||
        !/^\d{2}-\d{2}-\d{4}$/.test(value)
      ) {
        return null;
      }


      const [
        day,
        month,
        year
      ] = value.split('-');


      const date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );


      if (
        date.getFullYear() !== Number(year) ||
        date.getMonth() !== Number(month) - 1 ||
        date.getDate() !== Number(day)
      ) {
        return null;
      }


      return date;

    };


    const requestedStart =
      parseDate(fromdate);

    const requestedEnd =
      parseDate(enddate);


    if (
      !requestedStart ||
      !requestedEnd
    ) {

      return res.status(400).json({
        message:
          'Dates must be in DD-MM-YYYY format'
      });

    }


    if (
      requestedEnd <= requestedStart
    ) {

      return res.status(400).json({
        message:
          'End date must be after start date'
      });

    }


    // -------------------------------------------------
    // Validate room type
    // -------------------------------------------------

    const allowedTypes = [
      'Deluxe',
      'Single',
      'Double'
    ];


    if (
      type &&
      !allowedTypes.includes(type)
    ) {

      return res.status(400).json({
        message: 'Invalid room type'
      });

    }


    // -------------------------------------------------
    // Find rooms
    // -------------------------------------------------

    const roomQuery = type
      ? { options: type }
      : {};


    const rooms =
      await roommodel.find(roomQuery);


    // -------------------------------------------------
    // Get bookings which can block rooms
    // -------------------------------------------------

    const bookings =
      await bookingmodel.find({
        status: {
          $in: [
            'Pending',
            'Approved'
          ]
        }
      });


    // -------------------------------------------------
    // Determine availability
    // -------------------------------------------------

    const availableRooms =
      rooms.filter(room => {

        const roomId =
          room._id.toString();


        const roomBookings =
          bookings.filter(booking => {

            return (
              booking.rooms &&
              booking.rooms.some(
                bookedRoom =>
                  bookedRoom.toString() === roomId
              )
            );

          });


        // No bookings = available

        if (
          roomBookings.length === 0
        ) {
          return true;
        }


        // Check every booking

        const hasConflict =
          roomBookings.some(booking => {

            const bookingStart =
              parseDate(
                booking.fromdate
              );

            const bookingEnd =
              parseDate(
                booking.enddate
              );


            if (
              !bookingStart ||
              !bookingEnd
            ) {
              return false;
            }


            /*
             * Date ranges overlap when:
             *
             * requestedStart < existingEnd
             * AND
             * requestedEnd > existingStart
             *
             * This allows:
             *
             * Booking A:
             * 10 Sep -> 12 Sep
             *
             * Booking B:
             * 12 Sep -> 15 Sep
             *
             * because 12 Sep is checkout/check-in.
             */

            return (
              requestedStart < bookingEnd &&
              requestedEnd > bookingStart
            );

          });


        return !hasConflict;

      });


    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(200).json({

      count:
        availableRooms.length,

      Rooms:
        availableRooms

    });

  } catch (error) {

    console.error(
      'Error checking room availability:',
      error
    );


    return res.status(500).json({
      message:
        'Unable to check room availability'
    });

  }

});


module.exports = router;