import React, { useState,useEffect,useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './avibility.css'
import 'antd/dist/reset.css';
import { DatePicker, Space } from 'antd';
const { RangePicker } = DatePicker;
export default function Checkavaibility() {
    const [inp,setinp]=useState(false);
    const [checkin,setcheckin]=useState('');
    const [checkout,setcheckout]=useState('');
    const [err,seterr]=useState(false);
    const [inerr,setinerr]=useState(false);
    const [outerr,setouterr]=useState(false);
    const navigate = useNavigate();
    const onChange = (dates)=>{
      setcheckin(dates[0].format('DD-MM-YYYY'));
      setcheckout(dates[1].format('DD-MM-YYYY'));

}
    // const onChangein = (Da) => {
    //   console.log(dateString)
    //     // setcheckin(dateString);
    // };
    const onChangein = (date, dateString) => {
      setcheckin(dateString)
    };
    const onChangeout = (date,dateString) => {
      setcheckout(dateString);
    };
    const submithandler=(e)=>{
          e.preventDefault();
          if (checkin!=="" && checkout!==""){
            sessionStorage.setItem('checkin', checkin);
            sessionStorage.setItem('checkout', checkout);
              window.scrollTo(0,0);
              navigate('/booknow/rooms')
          }
          else{
            const currentnnerWidth = window.innerWidth;
            if (currentnnerWidth>=648){
              seterr(true)
            }
            else{
              if(checkin==="" && checkout!=="" ){
                setinerr(true)
                seterr(false)
                setouterr(false)
              }
              else if (checkout==="" && checkin!=="" ){
                setouterr(true)
                seterr(false)
                setinerr(false)
              }
              else{
                seterr(true)
                setinerr(false)
                setouterr(false)
              }
            }
            
          }
          
    }
    const rangePickerStyles = {
      height:'50px',
      width: '100%',
      // borderRadius: '5px',
      borderColor:'transparent',
    };
    const calendarStyles = {
      backgroundColor: "transparent",
      color: '#333',
    };
    useLayoutEffect(() => {
      const handleResize = () => {
        const currentInnerWidth = window.innerWidth;
        // console.log(currentInnerWidth);
        if (currentInnerWidth >= 648) {
          setinp(true);
        } else {
          setinp(false);
        }
      };
    
      handleResize();
      window.addEventListener('resize', handleResize);
    
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
    
  return (
    <div className='container_book'>
        <div>
            <p className='avaibility'>Check Avaibility!</p>
        </div>
        <form onSubmit={submithandler} className="form_available">
          <div className='ant'>
            {inp? (<RangePicker format="DD-MM-YYYY" style={rangePickerStyles} calendarStyle={calendarStyles} onChange={onChange} />):
                  (<div>
                        <DatePicker format="DD-MM-YYYY" onChange={onChangein} placeholder='Check-in' />
                        <DatePicker  format="DD-MM-YYYY" onChange={onChangeout} placeholder='Check-out' />
                    </div>) }
          </div>
          <input type="submit" value="Search" className="date_submit_button" />
        </form>
        <div style={{color:'red',display: err? 'block':'none'}}>Please enter a Check-in date and a Check-out date</div>
        <div style={{color:'red',display: inerr? 'block':'none'}}>Please enter a Check-in date</div>
        <div style={{color:'red',display: outerr? 'block':'none'}}>Please enter a Check-out date</div>
    </div>
  )
}
