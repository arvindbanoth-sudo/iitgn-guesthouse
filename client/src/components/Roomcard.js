import React from 'react';
import './roomcard.css';
import { useNavigate } from 'react-router-dom';

export default function Roomcard({
  selectroom,
  setaccomodation
}) {

  const navigate = useNavigate();

  const checkinDate = new Date(
    selectroom.fromdate
      .split('-')
      .reverse()
      .join('-')
  );

  const checkoutDate = new Date(
    selectroom.enddate
      .split('-')
      .reverse()
      .join('-')
  );

  const timeDiff =
    checkoutDate - checkinDate;

  const numberOfDays =
    Math.max(
      0,
      Math.ceil(
        timeDiff /
        (1000 * 60 * 60 * 24)
      )
    );


  const choose_accomodation = (event) => {

    event.preventDefault();

    setaccomodation(
      selectroom.unique
    );

    window.scrollTo(0, 0);

    navigate(
      '/booknow/bookingpage'
    );

  };


  return (

    <div>

      <div
        className="main_card_container"
      >

        <div className="card_container_img_desc">

          <div className="card_container_desc">

            <p className="roomname">
              {selectroom.roomtype}
            </p>

            <p className="roomdesc">
              {selectroom.roomdescription}
            </p>

          </div>


          <img
            src={selectroom.roomimgsrc}
            alt={selectroom.roomtype}
            className="card_container_img"
          />

        </div>


        <div className="room_dates">

          From {selectroom.fromdate}
          {' '}to{' '}
          {selectroom.enddate}

          {' '}(
          {numberOfDays + 1}{' '}

          {numberOfDays === 0
            ? 'day'
            : 'days'}

          )

        </div>


        <div className="card_select">

          <button
            onClick={
              choose_accomodation
            }
          >
            SELECT THIS ACCOMMODATION
          </button>

        </div>


        <div className="card_rooms">

          There are only{' '}

          {selectroom.roomsleft}{' '}

          {selectroom.roomtype}

          {selectroom.roomsleft === 1
            ? ''
            : 's'}{' '}

          left!

        </div>

      </div>

    </div>

  );

}