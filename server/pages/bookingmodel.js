const mongoose = require('mongoose');
const moment = require('moment');

const bookingSchema = new mongoose.Schema(
  {
    // Optional because admin-created bookings may not belong
    // to a student/faculty user account.
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      required: false
    },

    bookedon: {
      type: String,
      default: () => moment().format('DD-MM-YYYY')
    },

    firstname: {
      type: String,
      required: true,
      trim: true
    },

    lastname: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    phonenumber: {
      type: String,
      required: true,
      trim: true
    },

    adults: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true,
      trim: true
    },

    fromdate: {
      type: String,
      required: true
    },

    enddate: {
      type: String,
      required: true
    },

    rooms: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      ref: 'roommodel'
    },

    roomstype: {
      type: [String],
      default: []
    },

    specialrequest: {
      type: String,
      default: '',
      trim: true
    },

    purpose: {
      type: String,
      default: '',
      trim: true
    },

    meals: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
      default: 'Pending'
    },

    usertype: {
      type: String,
      required: true,
      enum: ['student', 'faculty', 'admin']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('bookingsmodel', bookingSchema);