import React, { useState } from 'react';
import { Gallery } from 'react-grid-gallery';

import './imagegallery.css';

// =====================================================
// CAMPUS IMAGES
// =====================================================

import Campus1 from '../images/campus/campus-1.jpg';
import Campus2 from '../images/campus/campus-2.jpg';
import Campus3 from '../images/campus/campus-3.jpg';
import Campus4 from '../images/campus/campus-4.jpg';
import Campus5 from '../images/campus/campus-5.jpg';
import Campus6 from '../images/campus/campus-6.jpg';


// =====================================================
// GALLERY DATA
// =====================================================

const images = [
  {
    src: Campus1,
    thumbnail: Campus1,
    caption: 'IIT Gandhinagar Campus'
  },
  {
    src: Campus2,
    thumbnail: Campus2,
    caption: 'IIT Gandhinagar Campus'
  },
  {
    src: Campus3,
    thumbnail: Campus3,
    caption: 'IIT Gandhinagar Campus'
  },
  {
    src: Campus4,
    thumbnail: Campus4,
    caption: 'IIT Gandhinagar Campus'
  },
  {
    src: Campus5,
    thumbnail: Campus5,
    caption: 'IIT Gandhinagar Campus'
  },
  {
    src: Campus6,
    thumbnail: Campus6,
    caption: 'IIT Gandhinagar Campus'
  }
];


export default function ImageGallery() {

  const [selectedIndex, setSelectedIndex] =
    useState(null);


  // =====================================================
  // OPEN IMAGE
  // =====================================================

  const handleClick = (index) => {

    setSelectedIndex(index);

  };


  // =====================================================
  // CLOSE IMAGE
  // =====================================================

  const handleClose = () => {

    setSelectedIndex(null);

  };


  // =====================================================
  // PREVIOUS IMAGE
  // =====================================================

  const handlePrevious = (event) => {

    event.stopPropagation();

    setSelectedIndex(
      previousIndex =>
        previousIndex === 0
          ? images.length - 1
          : previousIndex - 1
    );

  };


  // =====================================================
  // NEXT IMAGE
  // =====================================================

  const handleNext = (event) => {

    event.stopPropagation();

    setSelectedIndex(
      previousIndex =>
        previousIndex === images.length - 1
          ? 0
          : previousIndex + 1
    );

  };


  return (

    <div className="gallery">

      {/* =================================================
          HEADING
      ================================================= */}

      <p
        className="abouttop"
        style={{
          textAlign: 'center',
          fontSize: '17px'
        }}
      >
        Campus Gallery
      </p>


      <h2
        className="aboutushead"
        style={{
          textAlign: 'center'
        }}
      >
        Explore IIT Gandhinagar
      </h2>


      {/* =================================================
          GALLERY
      ================================================= */}

      <div className="gallery-container">

        <Gallery
          images={images}
          enableImageSelection={false}
          onClick={handleClick}
          rowHeight={250}
        />

      </div>


      {/* =================================================
          IMAGE MODAL
      ================================================= */}

      {selectedIndex !== null && (

        <div
          onClick={handleClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,

            backgroundColor:
              'rgba(0, 0, 0, 0.9)',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            zIndex: 9999,

            padding: '30px',

            boxSizing: 'border-box'
          }}
        >

          {/* =================================================
              PREVIOUS BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={handlePrevious}
            aria-label="Previous image"
            style={{
              position: 'absolute',

              left: '20px',

              top: '50%',

              transform:
                'translateY(-50%)',

              width: '48px',

              height: '48px',

              border: 'none',

              borderRadius: '50%',

              backgroundColor:
                'rgba(255,255,255,0.9)',

              color: '#000',

              fontSize: '32px',

              lineHeight: '1',

              cursor: 'pointer',

              zIndex: 10001
            }}
          >
            &#8249;
          </button>


          {/* =================================================
              MAIN IMAGE
          ================================================= */}

          <img
            src={
              images[selectedIndex].src
            }

            alt={
              images[selectedIndex].caption
            }

            onClick={(event) =>
              event.stopPropagation()
            }

            style={{
              maxWidth: '90vw',

              maxHeight: '82vh',

              objectFit: 'contain',

              borderRadius: '8px',

              boxShadow:
                '0 10px 40px rgba(0,0,0,0.4)'
            }}
          />


          {/* =================================================
              NEXT BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next image"
            style={{
              position: 'absolute',

              right: '20px',

              top: '50%',

              transform:
                'translateY(-50%)',

              width: '48px',

              height: '48px',

              border: 'none',

              borderRadius: '50%',

              backgroundColor:
                'rgba(255,255,255,0.9)',

              color: '#000',

              fontSize: '32px',

              lineHeight: '1',

              cursor: 'pointer',

              zIndex: 10001
            }}
          >
            &#8250;
          </button>


          {/* =================================================
              CLOSE BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close gallery"
            style={{
              position: 'absolute',

              top: '20px',

              right: '25px',

              width: '45px',

              height: '45px',

              border: 'none',

              borderRadius: '50%',

              backgroundColor:
                'rgba(255,255,255,0.9)',

              color: '#000',

              fontSize: '26px',

              cursor: 'pointer',

              zIndex: 10001
            }}
          >
            &times;
          </button>


          {/* =================================================
              CAPTION
          ================================================= */}

          <div
            style={{
              position: 'absolute',

              bottom: '20px',

              left: '0',

              right: '0',

              textAlign: 'center',

              color: '#fff',

              fontSize: '16px',

              padding: '0 20px'
            }}
          >
            {images[selectedIndex].caption}
          </div>

        </div>

      )}

    </div>

  );

}