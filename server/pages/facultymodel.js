const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bookingsmodel'
      }
    ],

    role: {
      type: String,
      enum: ['faculty'],
      default: 'faculty'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('facultymodel', facultySchema);