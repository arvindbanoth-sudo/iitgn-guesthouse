import React, { useRef } from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
// import {slideImages} from './SliderData'
function ImageSlider() {
  const slideRef = useRef(null);

  const properties = {
    duration: 1800,
    autoplay: true,
    transitionDuration: 500,
    arrows: false,
    infinite: true,
    easing: "ease",
  };

  const slideImages = [
    "https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    "https://images.unsplash.com/photo-1506710507565-203b9f24669b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1536&q=80",
    "https://images.unsplash.com/photo-1536987333706-fc9adfb10d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    "https://images.unsplash.com/photo-1444525873963-75d329ef9e1b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80"
  ];

  return (
    <div >
      <div style={{ width: "100%", height: "100%" }}>
        <Slide ref={slideRef} {...properties}>
          {slideImages.map((each, index) => (
            <img
              style={{ objectFit: "contain", height: "100%" }}
              src={each}
              key={index}
              alt="sample"
            />
          ))}
        </Slide>
      </div>
    </div>
  );
}

export default ImageSlider;
