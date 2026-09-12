import React from 'react';
import './footer.css';

import Logo from '../images/branding/logo.jpg';


export default function Footer() {

  return (

    <div className="footert">

      <div className="footer_about">

        <img
          className="logof"
          src={Logo}
          alt="IIT Gandhinagar Logo"
        />

        <h1 className="footn">
          IIT GANDHINAGAR
        </h1>

      </div>


      <div className="footer">

        {/* =================================================
            CONTACT
        ================================================= */}

        <div className="footlinks">

          <p className="heading_footer">
            Get in Touch with us
          </p>

          <ul>

            <li className="lilist">
              <a href="tel:+912912801195">
                +91 291 2801195
              </a>
            </li>

            <li className="lilist">
              <a
                href="mailto:guesthouse@iitgn.ac.in"
              >
                guesthouse@iitgn.ac.in
              </a>
            </li>

            <li className="lilist">

              <a
                href="https://www.google.com/maps/search/?api=1&query=Indian+Institute+of+Technology+Gandhinagar"
                target="_blank"
                rel="noreferrer"
              >

                Indian Institute of Technology
                Gandhinagar
                <br />
                Palaj, Gandhinagar
                <br />
                Gujarat, India

              </a>

            </li>

          </ul>

        </div>


        {/* =================================================
            QUICK LINKS
        ================================================= */}

        <div className="footlinks">

          <p className="heading_footer">
            Quick Links
          </p>

          <ul className="ulist">

            <li className="lilist">

              <a href="/home">
                Home
              </a>

            </li>


            <li className="lilist">

              <a href="/home">
                Contact Us
              </a>

            </li>


            <li className="lilist">

              <a href="/Bookings">
                Bookings
              </a>

            </li>


            <li className="lilist">

              <a
                href="https://iitgn.ac.in/"
                target="_blank"
                rel="noreferrer"
              >
                Official Website
              </a>

            </li>

          </ul>

        </div>


        {/* =================================================
            SOCIAL LINKS
        ================================================= */}

        <div className="footlinks">

          <p className="heading_footer">
            Social Links
          </p>

          <ul>

            <li className="lilist">

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>

            </li>


            <li className="lilist">

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>

            </li>


            <li className="lilist">

              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noreferrer"
              >
                Twitter
              </a>

            </li>


            <li className="lilist">

              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noreferrer"
              >
                YouTube
              </a>

            </li>

          </ul>

        </div>

      </div>

    </div>

  );

}