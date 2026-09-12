const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const axios = require('axios');

const usersmodel = require('../pages/usersmodel');
const adminsmodel = require('../pages/adminmodel');
const facultymodel = require('../pages/facultymodel');
const otpmodel = require('../pages/otpmodel');
const middleware = require('../middleware');

require('dotenv').config();


// =====================================================
// BREVO EMAIL CONFIGURATION
// =====================================================

const sendBrevoEmail = async ({
  to,
  subject,
  htmlContent,
  textContent = ''
}) => {

  if (
    !process.env.BREVO_API_KEY ||
    !process.env.EMAIL_FROM
  ) {
    throw new Error(
      'Brevo email configuration is missing'
    );
  }

  const response = await axios.post(
    'https://api.brevo.com/v3/smtp/email',

    {
      sender: {
        name: 'IIT Gandhinagar Guest House',
        email: process.env.EMAIL_FROM
      },

      to: [
        {
          email: to
        }
      ],

      subject,

      htmlContent,

      ...(textContent
        ? { textContent }
        : {})
    },

    {
      headers: {
        accept: 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      }
    }
  );

  return response.data;
};


// =====================================================
// TEST
// =====================================================

router.get('/test', (req, res) => {
  res.send('Users API is running!');
});


// =====================================================
// HELPER - IITGN EMAIL
// =====================================================

const isIITGNEmail = (email) => {

  if (
    !email ||
    typeof email !== 'string'
  ) {
    return false;
  }

  const normalized =
    email.trim().toLowerCase();

  return /^[^\s@]+@iitgn\.ac\.in$/.test(
    normalized
  );
};


// =====================================================
// STUDENT REGISTRATION
// =====================================================

router.post(
  '/register',
  async (req, res) => {

    try {

      const {
        username,
        email,
        password,
        confirmpassword
      } = req.body;


      if (
        !username ||
        !email ||
        !password ||
        !confirmpassword
      ) {

        return res.status(400).json({
          message:
            'Please fill all required fields'
        });

      }


      const normalizedEmail =
        email.trim().toLowerCase();


      if (
        !isIITGNEmail(
          normalizedEmail
        )
      ) {

        return res.status(400).json({
          message:
            'Please use your IIT Gandhinagar email address (@iitgn.ac.in)'
        });

      }


      if (
        password !==
        confirmpassword
      ) {

        return res.status(400).json({
          message:
            "Passwords don't match"
        });

      }


      // =================================================
      // CHECK USERNAME
      // =================================================

      const user =
        await usersmodel.findOne({
          username:
            username.trim()
        });


      const userOnVerification =
        await otpmodel.findOne({
          username:
            username.trim()
        });


      if (
        user ||
        userOnVerification
      ) {

        return res.status(400).json({
          message:
            'Username already exists'
        });

      }


      // =================================================
      // CHECK EMAIL
      // =================================================

      const userWithEmail =
        await usersmodel.findOne({
          email:
            normalizedEmail
        });


      const userOnVerificationWithEmail =
        await otpmodel.findOne({
          email:
            normalizedEmail
        });


      if (
        userWithEmail ||
        userOnVerificationWithEmail
      ) {

        return res.status(400).json({
          message:
            'Email already exists'
        });

      }


      // =================================================
      // GENERATE OTP
      // =================================================

      const otp =
        otpGenerator.generate(
          6,
          {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
          }
        );


      const hashedOtp =
        await bcrypt.hash(
          otp,
          10
        );


      // =================================================
      // DELETE PREVIOUS PENDING OTP
      // =================================================

      await otpmodel.deleteMany({

        $or: [

          {
            username:
              username.trim()
          },

          {
            email:
              normalizedEmail
          }

        ]

      });


      // =================================================
      // SAVE OTP
      // =================================================

      const newOtp =
        new otpmodel({

          username:
            username.trim(),

          role:
            'student',

          email:
            normalizedEmail,

          otp:
            hashedOtp

        });


      await newOtp.save();


      // =================================================
      // SEND OTP THROUGH BREVO
      // =================================================

      try {

        const result =
          await sendBrevoEmail({

            to:
              normalizedEmail,

            subject:
              'IIT Gandhinagar Guest House - Email Verification',

            htmlContent: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">

                <h2>
                  IIT Gandhinagar Guest House
                </h2>

                <p>
                  Hello ${username.trim()},
                </p>

                <p>
                  Your student account verification OTP is:
                </p>

                <h1
                  style="
                    letter-spacing: 6px;
                    color: #1c58d9;
                  "
                >
                  ${otp}
                </h1>

                <p>
                  This OTP is valid for account verification.
                </p>

                <p>
                  Please do not share this OTP with anyone.
                </p>

                <p>
                  Regards,<br>
                  IIT Gandhinagar Guest House
                </p>

              </div>
            `,

            textContent: `
IIT Gandhinagar Guest House

Hello ${username.trim()},

Your student account verification OTP is:

${otp}

This OTP is valid for account verification.

Please do not share this OTP with anyone.

Regards,
IIT Gandhinagar Guest House
            `

          });


        console.log(
          `OTP sent successfully to ${normalizedEmail}`,
          result?.messageId || ''
        );


        return res.status(200).json({

          message:
            'OTP sent successfully',

          Info: {

            username:
              username.trim(),

            email:
              normalizedEmail

          }

        });


      } catch (emailError) {

        console.error(
          'Brevo OTP email error:',
          emailError.response?.data ||
          emailError.message
        );


        // Remove OTP when email fails
        await otpmodel.deleteOne({
          _id:
            newOtp._id
        });


        return res.status(500).json({

          message:
            'Failed to send OTP email'

        });

      }


    } catch (error) {

      console.error(
        'Student registration error:',
        error
      );


      return res.status(500).json({

        message:
          'Registration failed'

      });

    }

  }
);


// =====================================================
// CLEAR OTP
// =====================================================

router.put(
  '/clearotp',
  async (req, res) => {

    try {

      const {
        username,
        email
      } = req.body;


      await otpmodel.deleteMany({

        $or: [

          {
            username
          },

          {
            email
          }

        ]

      });


      return res.status(200).json({

        message:
          'OTP cleared'

      });


    } catch (error) {

      console.error(error);


      return res.status(500).json({

        message:
          'Unable to clear OTP'

      });

    }

  }
);


// =====================================================
// RESEND OTP
// =====================================================

router.post(
  '/resendotp',
  async (req, res) => {

    try {

      const {
        username,
        email
      } = req.body;


      const normalizedEmail =
        email.trim().toLowerCase();


      if (
        !isIITGNEmail(
          normalizedEmail
        )
      ) {

        return res.status(400).json({

          message:
            'Please use your IIT Gandhinagar email address'

        });

      }


      const existingOtp =
        await otpmodel.findOne({

          username,

          email:
            normalizedEmail

        });


      if (!existingOtp) {

        return res.status(400).json({

          message:
            'Registration session expired. Please register again.'

        });

      }


      // =================================================
      // GENERATE NEW OTP
      // =================================================

      const otp =
        otpGenerator.generate(

          6,

          {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
          }

        );


      const hashedOtp =
        await bcrypt.hash(
          otp,
          10
        );


      // Save new OTP
      existingOtp.otp =
        hashedOtp;

      await existingOtp.save();


      // =================================================
      // SEND NEW OTP THROUGH BREVO
      // =================================================

      try {

        const result =
          await sendBrevoEmail({

            to:
              normalizedEmail,

            subject:
              'IIT Gandhinagar Guest House - New OTP',

            htmlContent: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">

                <h2>
                  IIT Gandhinagar Guest House
                </h2>

                <p>
                  Your new verification OTP is:
                </p>

                <h1
                  style="
                    letter-spacing: 6px;
                    color: #1c58d9;
                  "
                >
                  ${otp}
                </h1>

                <p>
                  Please do not share this OTP with anyone.
                </p>

                <p>
                  Regards,<br>
                  IIT Gandhinagar Guest House
                </p>

              </div>
            `,

            textContent: `
IIT Gandhinagar Guest House

Your new verification OTP is:

${otp}

Please do not share this OTP with anyone.

Regards,
IIT Gandhinagar Guest House
            `

          });


        console.log(
          `OTP resent successfully to ${normalizedEmail}`,
          result?.messageId || ''
        );


        return res.status(200).json({

          message:
            'OTP resent successfully'

        });


      } catch (emailError) {

        console.error(
          'Brevo resend OTP error:',
          emailError.response?.data ||
          emailError.message
        );


        return res.status(500).json({

          message:
            'Failed to send OTP email'

        });

      }


    } catch (error) {

      console.error(
        'Resend OTP error:',
        error
      );


      return res.status(500).json({

        message:
          'Failed to send OTP email'

      });

    }

  }
);


// =====================================================
// VERIFY OTP
// =====================================================

router.post(
  '/verifyotp',
  async (req, res) => {

    try {

      const {
        username,
        email,
        password,
        otp
      } = req.body;


      const normalizedEmail =
        email.trim().toLowerCase();


      const user =
        await otpmodel.findOne({

          username,

          email:
            normalizedEmail

        });


      if (!user) {

        return res.status(400).json({

          message:
            'OTP expired. Please register again.'

        });

      }


      const isOtpValid =
        await bcrypt.compare(

          otp,

          user.otp

        );


      if (!isOtpValid) {

        return res.status(400).json({

          message:
            'Wrong OTP'

        });

      }


      const hashedPassword =
        await bcrypt.hash(

          password,

          10

        );


      const newUser =
        new usersmodel({

          username:
            username.trim(),

          email:
            normalizedEmail,

          password:
            hashedPassword,

          role:
            'student'

        });


      await newUser.save();


      await otpmodel.findByIdAndDelete(
        user._id
      );


      return res.status(200).json({

        message:
          'Student registered successfully'

      });


    } catch (error) {

      console.error(

        'OTP verification error:',

        error

      );


      return res.status(500).json({

        message:
          'Unable to verify OTP'

      });

    }

  }
);


// =====================================================
// STUDENT LOGIN
// =====================================================

router.post(
  '/login',
  async (req, res) => {

    try {

      const {
        username,
        password
      } = req.body;


      const user =
        await usersmodel.findOne({

          $or: [

            {
              username
            },

            {
              email:
                username.trim().toLowerCase()
            }

          ]

        });


      if (!user) {

        return res.status(400).json({

          message:
            'No existing student found'

        });

      }


      const valid =
        await bcrypt.compare(

          password,

          user.password

        );


      if (!valid) {

        return res.status(400).json({

          message:
            'Username or password is incorrect'

        });

      }


      const token =
        jwt.sign(

          {

            id:
              user._id,

            role:
              'student'

          },

          process.env.SECRET_KEY,

          {

            expiresIn:
              '10h'

          }

        );


      return res.status(200).json({

        token

      });


    } catch (error) {

      console.error(

        'Student login error:',

        error

      );


      return res.status(500).json({

        message:
          'Login failed'

      });

    }

  }
);


// =====================================================
// ADMIN LOGIN
// =====================================================

router.post(
  '/adminlogin',
  async (req, res) => {

    try {

      const {
        username,
        password
      } = req.body;


      const user =
        await adminsmodel.findOne({

          username

        });


      if (!user) {

        return res.status(400).json({

          message:
            'No existing admin found'

        });

      }


      const valid =
        await bcrypt.compare(

          password,

          user.password

        );


      if (!valid) {

        return res.status(400).json({

          message:
            'Password is incorrect'

        });

      }


      const token =
        jwt.sign(

          {

            id:
              user._id,

            role:
              'admin'

          },

          process.env.SECRET_KEY,

          {

            expiresIn:
              '10h'

          }

        );


      return res.status(200).json({

        token

      });


    } catch (error) {

      console.error(

        'Admin login error:',

        error

      );


      return res.status(500).json({

        message:
          'Admin login failed'

      });

    }

  }
);


// =====================================================
// CREATE NEW ADMIN
// =====================================================

router.post(
  '/newadmin',
  middleware,
  async (req, res) => {

    try {

      const admin =
        await adminsmodel.findById(
          req.userid
        );


      if (!admin) {

        return res.status(401).json({

          message:
            'Admin access required'

        });

      }


      const {
        username,
        password
      } = req.body;


      if (!username || !password) {

        return res.status(400).json({

          message:
            'Username and password are required'

        });

      }


      const existing =
        await adminsmodel.findOne({

          username:
            username.trim()

        });


      if (existing) {

        return res.status(400).json({

          message:
            'Admin already exists'

        });

      }


      const hashedPassword =
        await bcrypt.hash(

          password,

          10

        );


      const newAdmin =
        new adminsmodel({

          username:
            username.trim(),

          password:
            hashedPassword,

          role:
            'admin'

        });


      await newAdmin.save();


      return res.status(201).json({

        message:
          'Admin added successfully'

      });


    } catch (error) {

      console.error(

        'Create admin error:',

        error

      );


      return res.status(500).json({

        message:
          'Unable to create admin'

      });

    }

  }
);


// =====================================================
// FACULTY REGISTRATION
// =====================================================

router.post(
  '/facultyregister',
  async (req, res) => {

    try {

      const {
        username,
        email,
        password,
        confirmpassword
      } = req.body;


      if (
        !username ||
        !email ||
        !password ||
        !confirmpassword
      ) {

        return res.status(400).json({

          message:
            'Please fill all required fields'

        });

      }


      const normalizedEmail =
        email.trim().toLowerCase();


      if (
        !isIITGNEmail(
          normalizedEmail
        )
      ) {

        return res.status(400).json({

          message:
            'Please use your IIT Gandhinagar email address (@iitgn.ac.in)'

        });

      }


      if (
        password !==
        confirmpassword
      ) {

        return res.status(400).json({

          message:
            "Passwords don't match"

        });

      }


      const existingUsername =
        await facultymodel.findOne({

          username:
            username.trim()

        });


      if (existingUsername) {

        return res.status(400).json({

          message:
            'Username already exists'

        });

      }


      const existingEmail =
        await facultymodel.findOne({

          email:
            normalizedEmail

        });


      if (existingEmail) {

        return res.status(400).json({

          message:
            'Email already exists'

        });

      }


      const hashedPassword =
        await bcrypt.hash(

          password,

          10

        );


      const newFaculty =
        new facultymodel({

          username:
            username.trim(),

          email:
            normalizedEmail,

          password:
            hashedPassword,

          role:
            'faculty'

        });


      await newFaculty.save();


      return res.status(201).json({

        message:
          'Faculty account created successfully'

      });


    } catch (error) {

      console.error(

        'Faculty registration error:',

        error

      );


      return res.status(500).json({

        message:
          'Faculty registration failed'

      });

    }

  }
);


// =====================================================
// FACULTY LOGIN
// =====================================================

router.post(
  '/facultylogin',
  async (req, res) => {

    try {

      const {
        username,
        password
      } = req.body;


      const user =
        await facultymodel.findOne({

          $or: [

            {
              username
            },

            {
              email:
                username.trim().toLowerCase()
            }

          ]

        });


      if (!user) {

        return res.status(400).json({

          message:
            'Faculty user not found'

        });

      }


      const valid =
        await bcrypt.compare(

          password,

          user.password

        );


      if (!valid) {

        return res.status(400).json({

          message:
            'Password is incorrect'

        });

      }


      const token =
        jwt.sign(

          {

            id:
              user._id,

            role:
              'faculty'

          },

          process.env.SECRET_KEY,

          {

            expiresIn:
              '10h'

          }

        );


      return res.status(200).json({

        token

      });


    } catch (error) {

      console.error(

        'Faculty login error:',

        error

      );


      return res.status(500).json({

        message:
          'Faculty login failed'

      });

    }

  }
);


module.exports = router;