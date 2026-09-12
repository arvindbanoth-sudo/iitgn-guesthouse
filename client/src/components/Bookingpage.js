import React from 'react'
import { useNavigate } from 'react-router-dom';
import './bookingpage.css'

export default function Bookingpage({details,setdetails}) {
    const navigate = useNavigate();

  const Change_handler=(event)=>{
       setdetails({...details,[event.target.name]:event.target.value})
  }
  return (
      <div >
         <div className='details_name'>Enter your details</div>
            <div className='form_submit_details'>
                <div className='formgrp'>
                    <label for='fn' style={{color:"#1e1e1e"}}>First name<span style={{color:'red'}}>*</span></label>
                    <input id='fn' type="text" name='Firstname' value={details.Firstname} onChange={Change_handler} required/>
                </div>

                <div className='formgrp'>
                    <label for='ln' style={{color:"#1e1e1e"}}>Last name<span style={{color:'red'}}>*</span></label>
                    <input id='ln' type="text" name='Lastname' value={details.Lastname} onChange={Change_handler} required/>
                </div>

                <div className='formgrp'>
                    <label for='em' style={{color:"#1e1e1e"}}>Email<span style={{color:'red'}}>*</span></label>
                    <input id='em' type="text" name='Email'  value={details.Email} onChange={Change_handler} required/>
                </div>

                <div className='formgrp'>
                    <label for='pn' style={{color:"#1e1e1e"}}>Phone number<span style={{color:'red'}}>*</span></label>
                    <input id='pn' type="text" name='Phonenumber' value={details.Phonenumber} onChange={Change_handler}  required/>
                </div>

                <div className='formgrp'>
                    <label for='pr' style={{color:"#1e1e1e"}}>Purpose<span style={{color:'red'}}>*</span></label>
                    <input id='pr' type="text" name='Purpose'  value={details.Purpose} onChange={Change_handler} required/>
                </div>

                <div className='formgrp'>
                    <label for='ad' style={{color:"#1e1e1e"}}>Address<span style={{color:'red'}}>*</span></label>
                    <input id='ad' type="text" name='Address' value={details.Address} onChange={Change_handler} required/>
                </div>

                <div className='formgrp another'>
                    <label for='tr' style={{color:"#1e1e1e"}}>Special request</label>
                    <textarea id="tr" name='Specialrequest' value={details.Specialrequest} onChange={Change_handler} ></textarea>
                </div>
            </div>
            <div className='summary'>
              
            </div>
      </div>
  )
}
