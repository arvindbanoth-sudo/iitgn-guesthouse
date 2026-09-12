import React, { useEffect, useState } from 'react';
import './query.css';

export default function Query() {

  const [rows, setRows] = useState(6);

  useEffect(() => {

    const handleResize = () => {

      if (window.innerWidth < 586) {
        setRows(4);
      } else {
        setRows(6);
      }

    };

    handleResize();

    window.addEventListener(
      'resize',
      handleResize
    );

    return () => {
      window.removeEventListener(
        'resize',
        handleResize
      );
    };

  }, []);


  return (

    <div className="homecomp4">

      <div className="query-form-container">

        {/* =================================================
            CONTACT FORM
        ================================================= */}

        <div className="query-form">

          <h2
            className="aboutushead"
            style={{
              color: 'rgb(0,0,0)'
            }}
          >
            Get in{' '}

            <span
              style={{
                color: 'rgb(255,0,0)'
              }}
            >
              Touch!
            </span>

          </h2>


          <form
            action="https://formspree.io/f/xyyqgpeq"
            method="POST"
            className="query-input-container"
          >

            <div className="query-input">

              <input
                type="text"
                name="first-name"
                id="first-name"
                autoComplete="off"
                placeholder="Enter your Name"
                required
              />

            </div>


            <div className="query-input">

              <input
                type="email"
                name="e-mail"
                id="e-mail"
                autoComplete="off"
                placeholder="Enter your Email"
                required
              />

            </div>


            <div className="query-input">

              <textarea
                rows={rows}
                placeholder="Enter your message"
                name="message"
                id="message"
                autoComplete="off"
                required
              />

            </div>


            <div className="query-btn">

              <input
                type="submit"
                value="Submit"
              />

            </div>

          </form>

        </div>


        {/* =================================================
            IIT GANDHINAGAR MAP
        ================================================= */}

        <div className="map-container">

          <div className="mapouter">

            <div className="gmap_canvas">

              <iframe
                title="IIT Gandhinagar Location"
                width="100%"
                height="100%"
                id="gmap_canvas"
                src="https://maps.google.com/maps?q=Indian%20Institute%20of%20Technology%20Gandhinagar&t=&z=13&ie=UTF8&iwloc=&output=embed"
                style={{
                  border: 0
                }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}