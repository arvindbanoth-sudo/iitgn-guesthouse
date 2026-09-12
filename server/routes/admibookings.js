const express = require('express');
const router = express.Router();

const roommodel = require('../pages/roommodel');
const usersmodel = require('../pages/usersmodel');
const facultymodel = require('../pages/facultymodel');
const bookingsmodel = require('../pages/bookingmodel');
const adminmodel = require('../pages/adminmodel');
const middleware = require('../middleware');

const nodemailer = require('nodemailer');

require('dotenv').config();


// =====================================================
// EMAIL CONFIGURATION
// =====================================================

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


// =====================================================
// HELPERS
// =====================================================

// Convert DD-MM-YYYY into a real JavaScript Date
const parseDate = (value) => {

  if (!value) {
    return null;
  }

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

    // Protect against invalid dates such as 31-02-2026
    if (
      date.getFullYear() !== Number(year) ||
      date.getMonth() !== Number(month) - 1 ||
      date.getDate() !== Number(day)
    ) {
      return null;
    }

    return date;
  }

  // Fallback for ISO dates
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
};


// Check whether two date ranges overlap
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


// Check admin
const isAdmin = async (userid) => {

  if (!userid) {
    return null;
  }

  return await adminmodel.findById(userid);
};


// =====================================================
// TEST ROUTE
// =====================================================

router.get('/', (req, res) => {
  res.send('Admin bookings API is running');
});


// =====================================================
// GET ALL BOOKINGS
// =====================================================

router.get('/bookings', middleware, async (req, res) => {

  try {

    const admin = await isAdmin(req.userid);

    if (!admin) {
      return res.status(401).json({
        message: 'Admin not found'
      });
    }


    const studentbookings =
      await bookingsmodel
        .find({ usertype: 'student' })
        .lean();


    const facultybookings =
      await bookingsmodel
        .find({ usertype: 'faculty' })
        .lean();


    const bookings =
      await bookingsmodel
        .find({})
        .lean();


    // Convert room IDs to room numbers
    const changeRoomsByNumber = async (booking) => {

      const roomNumbers = [];

      for (const roomId of booking.rooms || []) {

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

      booking.rooms = roomNumbers;
    };


    await Promise.all(
      studentbookings.map(changeRoomsByNumber)
    );

    await Promise.all(
      facultybookings.map(changeRoomsByNumber)
    );

    await Promise.all(
      bookings.map(changeRoomsByNumber)
    );


    return res.status(200).json({

      Studentbookings:
        studentbookings,

      Facultybookings:
        facultybookings,

      Bookings:
        bookings

    });

  } catch (error) {

    console.error(
      'Error fetching admin bookings:',
      error
    );

    return res.status(500).json({
      message:
        'Unable to fetch bookings',
      error:
        error.message
    });

  }

});


// =====================================================
// APPROVE BOOKING
// =====================================================

router.put(
  '/approve',
  middleware,
  async (req, res) => {

    try {

      const { id } = req.body;


      if (!id) {
        return res.status(400).json({
          message:
            'Booking ID is required'
        });
      }


      // -------------------------------------------------
      // Verify admin
      // -------------------------------------------------

      const admin =
        await isAdmin(req.userid);


      if (!admin) {
        return res.status(401).json({
          message:
            'Admin not found'
        });
      }


      // -------------------------------------------------
      // Get booking
      // -------------------------------------------------

      const booking =
        await bookingsmodel.findById(id);


      if (!booking) {
        return res.status(404).json({
          message:
            'Booking not found'
        });
      }


      if (
        booking.status ===
        'Approved'
      ) {

        return res.status(400).json({
          message:
            'Booking is already approved'
        });

      }


      if (
        booking.status ===
        'Rejected'
      ) {

        return res.status(400).json({
          message:
            'Rejected bookings cannot be approved'
        });

      }


      // -------------------------------------------------
      // Parse booking dates
      // -------------------------------------------------

      const checkIn =
        parseDate(
          booking.fromdate
        );

      const checkOut =
        parseDate(
          booking.enddate
        );


      if (
        !checkIn ||
        !checkOut ||
        checkOut <= checkIn
      ) {

        return res.status(400).json({
          message:
            'Invalid booking dates'
        });

      }


      // -------------------------------------------------
      // Check conflicting approved bookings
      // -------------------------------------------------

      const conflictingBookings =
        await bookingsmodel.find({

          _id: {
            $ne: booking._id
          },

          status:
            'Approved',

          rooms: {
            $in:
              booking.rooms
          }

        }).lean();


      for (
        const existing
        of conflictingBookings
      ) {

        const existingStart =
          parseDate(
            existing.fromdate
          );

        const existingEnd =
          parseDate(
            existing.enddate
          );


        if (
          existingStart &&
          existingEnd &&
          datesOverlap(
            checkIn,
            checkOut,
            existingStart,
            existingEnd
          )
        ) {

          return res.status(409).json({
            message:
              'One or more selected rooms are already booked for these dates'
          });

        }

      }


      // -------------------------------------------------
      // Approve booking
      // -------------------------------------------------

      booking.status =
        'Approved';

      await booking.save();


      // -------------------------------------------------
      // Find actual user
      // -------------------------------------------------

      let user = null;


      if (
        booking.usertype ===
          'student' &&
        booking.userid
      ) {

        user =
          await usersmodel.findById(
            booking.userid
          );

      }


      if (
        booking.usertype ===
          'faculty' &&
        booking.userid
      ) {

        user =
          await facultymodel.findById(
            booking.userid
          );

      }


      // -------------------------------------------------
      // Get room numbers
      // -------------------------------------------------

      const roomNumbers = [];


      for (
        const roomId
        of booking.rooms || []
      ) {

        const room =
          await roommodel.findById(
            roomId
          );


        if (room) {

          roomNumbers.push(
            parseInt(
              room.roomnumber,
              10
            )
          );

        }

      }


      roomNumbers.sort(
        (a, b) => a - b
      );


      // -------------------------------------------------
      // SEND APPROVAL EMAIL
      // -------------------------------------------------

      if (
        user?.email &&
        process.env.EMAIL_USER &&
        process.env.EMAIL_PASS
      ) {

        const mailOptions = {

          from:
            process.env.EMAIL_USER,

          to:
            user.email,

          subject:
            `IIT Gandhinagar Guest House Booking Approved - ${booking._id}`,

          text: `
Congratulations!

Your IIT Gandhinagar Guest House booking has been approved.

Booking ID:
${booking._id}

Booking Date:
${booking.bookedon}

Name:
${booking.firstname} ${booking.lastname}

Email:
${booking.email}

Number of Adults:
${booking.adults}

Purpose:
${booking.purpose || 'Not specified'}

Check-in:
${booking.fromdate}

Check-out:
${booking.enddate}

Rooms Allocated:
${roomNumbers.join(', ')}

Room Type:
${(booking.roomstype || []).join(', ')}

Meal Plan:
${booking.meals || 'Not specified'}

Special Request:
${booking.specialrequest || 'None'}

We hope you have a pleasant stay at IIT Gandhinagar Guest House.

Regards,
IIT Gandhinagar Guest House
          `
        };


        try {

          await transporter.sendMail(
            mailOptions
          );

          console.log(
            'Approval email sent to:',
            user.email
          );

        } catch (emailError) {

          console.error(
            'Approval email failed:',
            emailError.message
          );

        }

      }


      return res.status(200).json({

        message:
          'Booking approved successfully',

        Bookingdetail: {
          ...booking.toObject(),
          rooms:
            roomNumbers
        }

      });

    } catch (error) {

      console.error(
        'Approve booking error:',
        error
      );

      return res.status(500).json({

        message:
          'Unable to approve booking',

        error:
          error.message

      });

    }

  }
);


// =====================================================
// REJECT BOOKING
// =====================================================

router.put(
  '/reject',
  middleware,
  async (req, res) => {

    try {

      const { id } = req.body;


      if (!id) {
        return res.status(400).json({
          message:
            'Booking ID is required'
        });
      }


      const admin =
        await isAdmin(
          req.userid
        );


      if (!admin) {
        return res.status(401).json({
          message:
            'Admin not found'
        });
      }


      const booking =
        await bookingsmodel.findById(id);


      if (!booking) {
        return res.status(404).json({
          message:
            'Booking not found'
        });
      }


      if (
        booking.status ===
        'Rejected'
      ) {

        return res.status(400).json({
          message:
            'Booking is already rejected'
        });

      }


      if (
        booking.status ===
        'Approved'
      ) {

        return res.status(400).json({
          message:
            'Approved bookings cannot be rejected'
        });

      }


      booking.status =
        'Rejected';

      await booking.save();


      // Find user
      let user = null;


      if (
        booking.usertype ===
          'student' &&
        booking.userid
      ) {

        user =
          await usersmodel.findById(
            booking.userid
          );

      }


      if (
        booking.usertype ===
          'faculty' &&
        booking.userid
      ) {

        user =
          await facultymodel.findById(
            booking.userid
          );

      }


      // -------------------------------------------------
      // SEND REJECTION EMAIL
      // -------------------------------------------------

      if (
        user?.email &&
        process.env.EMAIL_USER &&
        process.env.EMAIL_PASS
      ) {

        const mailOptions = {

          from:
            process.env.EMAIL_USER,

          to:
            user.email,

          subject:
            `IIT Gandhinagar Guest House Booking Rejected - ${booking._id}`,

          text: `
Dear ${booking.firstname},

We are sorry to inform you that your IIT Gandhinagar Guest House booking has been rejected.

Booking ID:
${booking._id}

Booking Date:
${booking.bookedon}

Check-in:
${booking.fromdate}

Check-out:
${booking.enddate}

Purpose:
${booking.purpose || 'Not specified'}

Please contact the IIT Gandhinagar Guest House administration for further information.

Regards,
IIT Gandhinagar Guest House
          `
        };


        try {

          await transporter.sendMail(
            mailOptions
          );

          console.log(
            'Rejection email sent to:',
            user.email
          );

        } catch (emailError) {

          console.error(
            'Rejection email failed:',
            emailError.message
          );

        }

      }


      return res.status(200).json({

        message:
          'Booking rejected successfully',

        Bookingdetail:
          booking

      });

    } catch (error) {

      console.error(
        'Reject booking error:',
        error
      );

      return res.status(500).json({

        message:
          'Unable to reject booking',

        error:
          error.message

      });

    }

  }
);


// =====================================================
// ADMIN CREATES A BOOKING
// =====================================================

router.post(
  '/newbook',
  middleware,
  async (req, res) => {

    try {

      const admin =
        await isAdmin(
          req.userid
        );


      if (!admin) {
        return res.status(401).json({
          message:
            'Admin not found'
        });
      }


      const {
        fname,
        lname,
        email,
        phonenumber,
        address,
        fromdate,
        enddate,
        adults,
        rooms,
        roomstype,
        specialrequest,
        purpose,
        meal
      } = req.body;


      // -------------------------------------------------
      // Validate fields
      // -------------------------------------------------

      if (
        !fname ||
        !lname ||
        !email ||
        !phonenumber ||
        !address ||
        !fromdate ||
        !enddate ||
        !adults ||
        !rooms ||
        !Array.isArray(rooms) ||
        rooms.length === 0
      ) {

        return res.status(400).json({
          message:
            'Please provide all required booking details'
        });

      }


      // -------------------------------------------------
      // Validate dates
      // -------------------------------------------------

      const checkIn =
        parseDate(fromdate);

      const checkOut =
        parseDate(enddate);


      if (
        !checkIn ||
        !checkOut
      ) {

        return res.status(400).json({
          message:
            'Invalid booking dates'
        });

      }


      if (
        checkOut <= checkIn
      ) {

        return res.status(400).json({
          message:
            'Check-out date must be after check-in date'
        });

      }


      // -------------------------------------------------
      // Find requested rooms
      // -------------------------------------------------

      const selectedRooms =
        await roommodel.find({
          _id: {
            $in: rooms
          }
        });


      if (
        selectedRooms.length !==
        rooms.length
      ) {

        return res.status(400).json({
          message:
            'One or more selected rooms do not exist'
        });

      }


      // -------------------------------------------------
      // Check room conflicts
      // -------------------------------------------------

      const existingBookings =
        await bookingsmodel.find({

          status: {
            $in: [
              'Pending',
              'Approved'
            ]
          },

          rooms: {
            $in: rooms
          }

        }).lean();


      for (
        const existing
        of existingBookings
      ) {

        const existingStart =
          parseDate(
            existing.fromdate
          );

        const existingEnd =
          parseDate(
            existing.enddate
          );


        if (
          existingStart &&
          existingEnd &&
          datesOverlap(
            checkIn,
            checkOut,
            existingStart,
            existingEnd
          )
        ) {

          return res.status(409).json({

            message:
              'One or more selected rooms are unavailable for the selected dates'

          });

        }

      }


      // -------------------------------------------------
      // Create booking
      // -------------------------------------------------

      const booked =
        new bookingsmodel({

          firstname:
            fname.trim(),

          lastname:
            lname.trim(),

          email:
            email.toLowerCase().trim(),

          phonenumber:
            String(phonenumber).trim(),

          fromdate,

          enddate,

          adults:
            String(adults),

          address:
            address.trim(),

          rooms,

          roomstype:
            roomstype || [],

          specialrequest:
            specialrequest || '',

          purpose:
            purpose || '',

          meals:
            meal || 'Not specified',

          status:
            'Approved',

          usertype:
            'admin'

        });


      const result =
        await booked.save();


      // -------------------------------------------------
      // Add booking to rooms
      // -------------------------------------------------

      await Promise.all(

        selectedRooms.map(
          async (room) => {

            room.booking.push(
              result._id
            );

            await room.save();

          }
        )

      );


      return res.status(201).json({

        message:
          'Booking created successfully',

        Bookingdetail:
          result

      });

    } catch (error) {

      console.error(
        'Admin booking creation error:',
        error
      );


      return res.status(500).json({

        message:
          'Unable to create booking',

        error:
          error.message

      });

    }

  }
);


module.exports = router;