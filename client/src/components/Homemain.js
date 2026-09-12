import React, {
  useEffect,
  useState,
  useRef
} from 'react';

import './homemain.css';

import {
  FaLongArrowAltRight
} from 'react-icons/fa';

import {
  useNavigate
} from 'react-router-dom';

import Campus1 from '../images/campus/campus-1.jpg';
import Campus2 from '../images/campus/campus-2.jpg';
import Campus3 from '../images/campus/campus-3.jpg';
import Campus4 from '../images/campus/campus-4.jpg';


function Homemain() {

  const navigate = useNavigate();

  const homeref =
    useRef(null);


  const imageUrls = [
    Campus1,
    Campus2,
    Campus3,
    Campus4
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
          onClick={() =>
            navigate('/booknow')
          }
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


export default Homemain;