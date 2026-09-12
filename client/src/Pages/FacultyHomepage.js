import React, { useEffect, useState } from 'react'
import Contactus from '../components/Contactus'
import Features from '../components/Features'
import Footer from '../components/Footer'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Query from '../components/Query'
import ImageGallery from '../components/ImageGallery'
import { Link as ScrollLink, Element } from 'react-scroll';
import FacultyHomeMain from '../components/FacultyHomeMain'
import Facultyheader from '../components/Facultyheader';
import Facultyform from '../components/Facultyform';
import Facultybookings from '../components/Facultybookings';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import FacultyHeaderHome from '../components/FacultyHeaderHome'

export default function FacultyHomepage() {

  const navigate = useNavigate();
  const [ClickBook, setClickBook] = useState(false)
//   const [cookies] = useCookies(['access_token']);
//   useEffect(()=>{if(!cookies.access_token){navigate('/')}})

  return (
    <div >
      <FacultyHeaderHome />
      <FacultyHomeMain setClickBook={setClickBook}  />
      {
        ClickBook ? 
            <Box >
                <Routes>
                <Route path="/" element={<Facultyform />} />
                <Route path="/bookings" element={<Facultybookings/>} />
                </Routes>
            </Box>
            :
            ''
      }
      <Element name="about">
        <Features />
      </Element>
      <Element name="gallery">
         <ImageGallery />
      </Element>
      <Element name="contact">
         <Query />
      </Element>
      <Contactus />
{/*       
      

      <Element name="availability">
        <AvailabilitySection />
      </Element>

      */}
      <Footer />
    </div>
  )
}