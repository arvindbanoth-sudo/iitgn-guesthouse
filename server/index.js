const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();


// =====================================================
// ROUTES
// =====================================================

const usersRouter = require('./routes/users.js');
const roomsRouter = require('./routes/rooms.js');
const bookingsRouter = require('./routes/booking.js');
const adminbookingsRouter = require('./routes/admibookings.js');


// =====================================================
// CORS
// =====================================================

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS'
  ],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-token'
  ]
};

app.use(cors(corsOptions));


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(express.json());


// =====================================================
// ROOT ROUTE
// =====================================================

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'IIT Gandhinagar Guest House Booking API is running',
    endpoints: {
      users: '/users',
      rooms: '/rooms',
      bookings: '/bookings',
      adminBookings: '/admibookings'
    }
  });
});


// =====================================================
// API ROUTES
// =====================================================

app.use('/users', usersRouter);

app.use('/rooms', roomsRouter);

app.use('/bookings', bookingsRouter);

app.use('/admibookings', adminbookingsRouter);


// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    message: 'API route not found',
    path: req.originalUrl
  });
});


// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {

  console.error('Server error:', err);

  res.status(500).json({
    message: 'Internal Server Error'
  });

});


// =====================================================
// MONGODB CONNECTION
// =====================================================

if (!process.env.MONGODB_URI) {

  console.error(
    'ERROR: MONGODB_URI is missing from server/.env'
  );

  process.exit(1);
}

if (!process.env.SECRET_KEY) {

  console.error(
    'ERROR: SECRET_KEY is missing from server/.env'
  );

  process.exit(1);
}


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {

    console.log(
      'Connected to MongoDB'
    );

  })
  .catch((error) => {

    console.error(
      'Error connecting to MongoDB:',
      error
    );

  });


// =====================================================
// START SERVER
// =====================================================

const port = process.env.PORT || 8082;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});