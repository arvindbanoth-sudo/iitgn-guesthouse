import React from 'react';
import './features.css';

export default function Features() {
  return (
    <div className="homecomp2" id="about">

      {/* =================================================
          ABOUT IIT GANDHINAGAR
      ================================================= */}

      <div className="about">

        <div className="about_desc">

          <div>

            <p className="abouttop">
              Welcome to the IIT Gandhinagar Guest House
            </p>

            <h2 className="aboutushead">
              About IIT Gandhinagar
            </h2>

            <p className="textabout">
              The Indian Institute of Technology Gandhinagar
              is a premier institute dedicated to excellence
              in education, research, innovation and
              interdisciplinary learning.
            </p>

            <p className="textabout">
              Located on the IIT Gandhinagar campus in Palaj,
              the Guest House provides comfortable accommodation
              for institute guests, visiting faculty, students,
              researchers, officials and other authorized
              visitors.
            </p>

            <p className="textabout">
              Our guest house booking system makes it convenient
              to check room availability, submit accommodation
              requests and keep track of booking status from
              one place.
            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          FEATURES
      ================================================= */}

      <div className="features">

        <div>

          <h2
            className="aboutushead"
            style={{
              textAlign: 'center',
              marginBottom: '80px'
            }}
          >
            Explore the facilities we provide
          </h2>

        </div>


        <div className="facilities">

          {/* =================================================
              COMFORT
          ================================================= */}

          <div>

            <h1>
              Comfortable Accommodation
            </h1>

            <p>
              Designed to provide guests with a comfortable
              and convenient stay on campus.
            </p>

            <ul>
              <li>Well-maintained rooms</li>
              <li>Air-conditioned accommodation</li>
              <li>Comfortable beds</li>
              <li>Work and study space</li>
              <li>Clean washrooms</li>
              <li>Dining facilities</li>
            </ul>

          </div>


          {/* =================================================
              CONNECTIVITY
          ================================================= */}

          <div>

            <h1>
              Modern Facilities
            </h1>

            <p>
              Essential facilities to make your stay convenient
              and productive.
            </p>

            <ul>
              <li>Wi-Fi connectivity</li>
              <li>Dining facilities</li>
              <li>Drinking water</li>
              <li>Housekeeping support</li>
              <li>Telephone facilities</li>
              <li>Essential guest services</li>
            </ul>

          </div>


          {/* =================================================
              CAMPUS
          ================================================= */}

          <div>

            <h1>
              Campus Convenience
            </h1>

            <p>
              Stay close to the academic and residential
              facilities of IIT Gandhinagar.
            </p>

            <ul>
              <li>Located on the IIT Gandhinagar campus</li>
              <li>Parking facilities</li>
              <li>Green campus surroundings</li>
              <li>Easy access to campus facilities</li>
              <li>Guest assistance</li>
              <li>Secure campus environment</li>
            </ul>

          </div>


          {/* =================================================
              GUEST SERVICES
          ================================================= */}

          <div>

            <h1>
              Guest Services
            </h1>

            <p>
              Services intended to make the booking and
              stay experience simple and convenient.
            </p>

            <ul>
              <li>Online room booking</li>
              <li>Room availability checking</li>
              <li>Booking status tracking</li>
              <li>Student and faculty access</li>
              <li>Admin booking management</li>
              <li>Booking confirmation notifications</li>
            </ul>

          </div>

        </div>

      </div>

    </div>
  );
}