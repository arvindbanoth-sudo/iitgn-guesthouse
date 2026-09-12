const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports = function (req, res, next) {
  try {
    const token = req.header('x-token');

    if (!token) {
      return res.status(401).json({
        message: 'Authentication token not found'
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY
    );

    req.userid = decoded.id;
    req.role = decoded.role;

    next();

  } catch (error) {

    console.error('Authentication error:', error);

    return res.status(401).json({
      message: 'Invalid or expired authentication token'
    });
  }
};