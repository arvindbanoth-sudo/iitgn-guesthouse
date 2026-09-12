import React, { useState } from 'react';
import { Gallery } from 'react-grid-gallery';
import Lightbox from 'react-image-lightbox';

import 'react-image-lightbox/style.css';
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

  const [index, setIndex] =
    useState(-1);


  const currentImage =
    index >= 0
      ? images[index]
      : null;


  const nextIndex =
    index >= 0
      ? (index + 1) % images.length
      : 0;


  const prevIndex =
    index >= 0
      ? (index + images.length - 1) %
        images.length
      : 0;


  // =====================================================
  // OPEN IMAGE
  // =====================================================

  const handleClick = (imageIndex) => {

    setIndex(imageIndex);

  };


  // =====================================================
  // CLOSE
  // =====================================================

  const handleClose = () => {

    setIndex(-1);

  };


  // =====================================================
  // PREVIOUS
  // =====================================================

  const handleMovePrev = () => {

    setIndex(
      (index + images.length - 1) %
      images.length
    );

  };


  // =====================================================
  // NEXT
  // =====================================================

  const handleMoveNext = () => {

    setIndex(
      (index + 1) %
      images.length
    );

  };


  return (

    <div className="gallery">

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


      <div className="gallery-container">

        <Gallery
          images={images}
          enableImageSelection={false}
          onClick={handleClick}
          rowHeight={250}
        />

      </div>


      {currentImage && (

        <Lightbox

          mainSrc={
            currentImage.src
          }

          imageTitle={
            currentImage.caption
          }

          nextSrc={
            images[nextIndex].src
          }

          prevSrc={
            images[prevIndex].src
          }

          onCloseRequest={
            handleClose
          }

          onMovePrevRequest={
            handleMovePrev
          }

          onMoveNextRequest={
            handleMoveNext
          }

        />

      )}

    </div>

  );

}