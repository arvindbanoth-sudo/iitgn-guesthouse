import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { Route,Routes, useNavigate } from 'react-router-dom'
import Allrooms from './Allrooms'
import Checkavaibility from '../components/Checkavaibility'
import Formsumission from './Formsumission'
import Features from '../components/Features'
import Footer from '../components/Footer'
import { useCookies } from 'react-cookie'
import Homemain from '../components/Homemain'
import Query from '../components/Query'
import ImageGallery from '../components/ImageGallery'
import Contactus from '../components/Contactus'

export default function Book() {
        const navigate = useNavigate();
        const [accomodation,setaccomodation]=useState(-1);
        const [cookies] = useCookies(['access_token']);
        useEffect(()=>{if(!cookies.access_token){navigate('/')}})
       const [comp1height,setcomp1height]=useState(0);
       useEffect(()=>{
          window.scrollTo({top:comp1height,behavior:'smooth'});
       },[comp1height])
      //  const homeref=useRef(null)
      //  console.log(homeref)
      useEffect(() => {
        const element = document.getElementById('homeref');
        const ele = document.getElementById('header');
        console.log(element.offsetHeight);
        window.scrollTo({ top: (element.offsetHeight-ele.offsetHeight), behavior: 'smooth' });
      }, [window.location.pathname]);
      // element.scrollIntoView({behavior: "smooth", block: "end"});
  return (
    <>
        <Header/>
        <Homemain />
        <Routes>
            <Route path='/' element={<Checkavaibility />} />
            <Route path='/rooms' element={<Allrooms setaccomodation={setaccomodation} />}/>
            <Route path='/bookingpage' element={<Formsumission accomodation={accomodation}/>} />
        </Routes>
        <Features />
        <ImageGallery />
        <Query />
        <Contactus />
        <Footer />
    </>

  )
}
