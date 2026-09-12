import React, {
  useEffect,
  useState,
  useRef
} from 'react';

import './homemain.css';

import {
  FaLongArrowAltRight
} from 'react-icons/fa';

import Campus2 from '../images/campus/campus-2.jpg';
import Campus4 from '../images/campus/campus-4.jpg';
import Campus5 from '../images/campus/campus-5.jpg';
import Campus6 from '../images/campus/campus-6.jpg';


function FacultyHomeMain({
  setClickBook
}) {

  const homeref =
    useRef(null);


  const imageUrls = [
    Campus2,
    Campus4,
    Campus5,
    Campus6
  ];


  const [
    currentImageIndex,
    setCurrentImageIndex
  ] = useState(0);


  // =====================================================
  // HERO SLIDER
  // =====================================================

  useEffect(() => {

    const interval =
      setInterval(() => {

        setCurrentImageIndex(
          previousIndex =>
            previousIndex ===
            imageUrls.length - 1
              ? 0
              : previousIndex + 1
        );

      }, 4000);


    return () => {
      clearInterval(interval);
    };

  }, []);


  // =====================================================
  // SCROLL DOWN
  // =====================================================

  const movedown = () => {

    const homeSection =
      document.getElementById(
        'homeref'
      );

    const header =
      document.getElementById(
        'header'
      );


    if (!homeSection) {
      return;
    }


    const headerHeight =
      header?.offsetHeight || 0;


    window.scrollTo({

      top:
        homeSection.offsetHeight -
        headerHeight,

      behavior: 'smooth'

    });

  };


  // =====================================================
  // BOOK NOW
  // =====================================================

  const handleClick = () => {

    window.scrollTo({

      top:
        window.innerHeight - 80,

      left: 0,

      behavior: 'smooth'

    });


    setClickBook(true);

  };


  return (

    <div
      className="main_img"
      id="homeref"
      ref={homeref}
      style={{
        backgroundImage:
          `url(${imageUrls[currentImageIndex]})`
      }}
    >

      <div className="overlay">

        <h1>
          Experience Comfortable Stays at
          IIT Gandhinagar
        </h1>


        <h2>
          Have a Wonderful Stay!
        </h2>


        <button
          className="overlay_btn"
          onClick={handleClick}
        >

          Book Now

          <span>

            <FaLongArrowAltRight
              className="arrow"
            />

          </span>

        </button>


        <div
          className="scroll-top"
          onClick={movedown}
        >

          <div className="scroll"></div>

        </div>

      </div>

    </div>

  );

}


export default FacultyHomeMain;