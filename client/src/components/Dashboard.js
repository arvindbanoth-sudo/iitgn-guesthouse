import React, { useEffect, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import './dashboard.css';
import { MdMenu} from "react-icons/md";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const navigate = useNavigate();
  const [shownav,setshownav] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['admin_access_token']);
  const adminlogout = async(e)=>{
    e.preventDefault();
    removeCookie('admin_access_token');
    navigate('/')
  }
  return (
    <div>
       <div className='sidenav_bar_all_res'><MdMenu className="resmenu" onClick={()=>{setshownav(!shownav)}} /></div>
       <div className={!shownav?'dashboard hider':'dashboard'}>
          <Link to="/dashboard/admins" onClick={()=>{setshownav(!shownav)}}>All Bookings</Link>
          <Link to="/dashboard/admins/details" onClick={()=>{setshownav(!shownav)}}>Get Details</Link>
          <Link to="/dashboard/admins/newbooking" onClick={()=>{setshownav(!shownav)}}>New Booking</Link>
          
          <Link to="/dashboard/admins/rooms" onClick={()=>{setshownav(!shownav)}}>New Room/Admin</Link>
          <Link onClick={adminlogout} >Log Out</Link>
    </div>
    </div>
    
  );
};

export default Dashboard;
