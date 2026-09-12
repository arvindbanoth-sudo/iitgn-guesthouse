const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomnumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    options: {
      type: String,
      required: true,
      enum: ['Deluxe', 'Single', 'Double'],
      default: 'Single'
    },

    booking: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bookingsmodel'
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('roommodel', roomSchema);