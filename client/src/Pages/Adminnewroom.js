import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './admintable.css';

import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Roomd = () => {

  const navigate = useNavigate();

  const [cookies] = useCookies([
    'admin_access_token'
  ]);

  const API_URL = process.env.REACT_APP_API_URL;


  const [selectoption, setSelectoption] = useState('');
  const [inputvalue, setInputvalue] = useState('');

  const [needadmin, setNeedadmin] = useState('');
  const [newpass, setNewpass] = useState('');


  // =====================================================
  // ADMIN AUTHENTICATION
  // =====================================================

  useEffect(() => {

    if (!cookies.admin_access_token) {

      navigate('/admin-login', {
        replace: true
      });

    }

  }, [
    cookies.admin_access_token,
    navigate
  ]);


  // =====================================================
  // ROOM NUMBER
  // =====================================================

  const handleRoomNumber = (e) => {
    setSelectoption(e.target.value);
  };


  // =====================================================
  // ROOM TYPE
  // =====================================================

  const handleRoomType = (e) => {
    setInputvalue(e.target.value);
  };


  // =====================================================
  // ADD ROOM
  // =====================================================

  const submitform = async (e) => {

    e.preventDefault();


    if (
      selectoption.trim() === '' ||
      inputvalue === ''
    ) {

      alert(
        'Please fill all the room details!'
      );

      return;
    }


    try {

      const response = await axios.post(

        `${API_URL}/rooms/enter`,

        {
          roomnumber:
            selectoption.trim(),

          options:
            inputvalue
        },

        {
          headers: {
            'x-token':
              cookies.admin_access_token
          }
        }

      );


      alert(
        response.data.message ||
        'Room added successfully!'
      );


      setSelectoption('');
      setInputvalue('');


    } catch (error) {

      console.error(
        'Add room error:',
        error
      );


      alert(
        error.response?.data?.message ||
        'Unable to add room.'
      );

    }

  };


  // =====================================================
  // ADMIN USERNAME
  // =====================================================

  const handleAdminUsername = (e) => {
    setNeedadmin(e.target.value);
  };


  // =====================================================
  // ADMIN PASSWORD
  // =====================================================

  const handleAdminPassword = (e) => {
    setNewpass(e.target.value);
  };


  // =====================================================
  // ADD ADMIN
  // =====================================================

  const submitaform = async (e) => {

    e.preventDefault();


    if (
      needadmin.trim() === '' ||
      newpass === ''
    ) {

      alert(
        'Please fill all the admin details!'
      );

      return;
    }


    if (newpass.length < 6) {

      alert(
        'Admin password must contain at least 6 characters.'
      );

      return;
    }


    try {

      const response = await axios.post(

        `${API_URL}/users/newadmin`,

        {
          username:
            needadmin.trim(),

          password:
            newpass
        },

        {
          headers: {
            'x-token':
              cookies.admin_access_token
          }
        }

      );


      alert(
        response.data.message ||
        'Admin created successfully!'
      );


      setNeedadmin('');
      setNewpass('');


    } catch (error) {

      console.error(
        'Add admin error:',
        error
      );


      alert(
        error.response?.data?.message ||
        'Unable to create admin.'
      );

    }

  };


  return (

    <div className="mainss">


      {/* =================================================
          ADD ROOM
      ================================================= */}

      <div>

        <div className="extra">

          <form
            onSubmit={submitform}
            className="susform"
          >

            <div className="newroomadmin">
              ADD A ROOM
            </div>


            <div className="newroom">

              <label
                className="forming"
                htmlFor="roomnumber"
              >
                Room Number:
              </label>

              <input
                className="r"
                type="text"
                value={selectoption}
                onChange={handleRoomNumber}
                id="roomnumber"
                placeholder="Ex: 202"
                required
              />

            </div>


            <label className="forming">
              Room Type:
            </label>


            <div className="radiobtns">


              <div>

                <input
                  className="sing"
                  type="radio"
                  value="Single"
                  checked={
                    inputvalue === 'Single'
                  }
                  onChange={handleRoomType}
                  id="single"
                />

                <label
                  className="single"
                  htmlFor="single"
                >
                  Single
                </label>

              </div>


              <div>

                <input
                  className="doub"
                  type="radio"
                  value="Double"
                  checked={
                    inputvalue === 'Double'
                  }
                  onChange={handleRoomType}
                  id="double"
                />

                <label
                  className="double"
                  htmlFor="double"
                >
                  Double
                </label>

              </div>


              <div>

                <input
                  className="delu"
                  type="radio"
                  value="Deluxe"
                  checked={
                    inputvalue === 'Deluxe'
                  }
                  onChange={handleRoomType}
                  id="deluxe"
                />

                <label
                  className="deluxe"
                  htmlFor="deluxe"
                >
                  Deluxe
                </label>

              </div>

            </div>


            <div className="rrrbut">

              <button
                className="rrr"
                type="submit"
              >
                Add Room
              </button>

            </div>

          </form>

        </div>

      </div>


      {/* =================================================
          ADD ADMIN
      ================================================= */}

      <div>

        <div className="extra extras">

          <form
            onSubmit={submitaform}
            className="susform"
          >

            <div className="newroomadmin">
              ADD AN ADMIN
            </div>


            <div className="newroom">

              <label
                className="forming"
                htmlFor="adminname"
              >
                Admin Username:
              </label>

              <input
                className="r"
                type="text"
                value={needadmin}
                onChange={handleAdminUsername}
                id="adminname"
                placeholder="John"
                required
              />

            </div>


            <div className="newroom">

              <label
                className="forming"
                htmlFor="adminpass"
              >
                Password:
              </label>

              <input
                className="r"
                type="password"
                value={newpass}
                onChange={handleAdminPassword}
                id="adminpass"
                placeholder="Enter password"
                required
              />

            </div>


            <div className="rrrbut">

              <button
                className="rrr sub"
                type="submit"
              >
                Add Admin
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>

  );
};

export default Roomd;