import React, { useEffect, useState } from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography
} from '@mui/material';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';

import Modal from '@mui/material/Modal';
import Divider from '@mui/material/Divider';
import Slide from '@mui/material/Slide';

import dayjs from 'dayjs';

import {
  LocalizationProvider
} from '@mui/x-date-pickers/LocalizationProvider';

import {
  AdapterDayjs
} from '@mui/x-date-pickers/AdapterDayjs';

import {
  DatePicker
} from '@mui/x-date-pickers/DatePicker';

import axios from 'axios';

import {
  useNavigate
} from 'react-router-dom';

import {
  useCookies
} from 'react-cookie';

import './facultyform.css';


export default function Facultyform() {

  const navigate = useNavigate();

  const [cookies] =
    useCookies(['faculty_access_token']);

  const API_URL =
    process.env.REACT_APP_API_URL;


  // =====================================================
  // STEPPER
  // =====================================================

  const steps = [
    'Fill the details',
    'Add your preferences',
    'Final'
  ];

  const [activeStep, setActiveStep] =
    useState(0);


  // =====================================================
  // MODAL
  // =====================================================

  const [show, setShow] =
    useState(false);

  const toggleModal = () => {
    setShow(previous => !previous);
  };


  // =====================================================
  // DATES
  // =====================================================

  const [
    selectedStartDate,
    setselectedStartDate
  ] = useState(null);

  const [
    selectedEndDate,
    setselectedEndDate
  ] = useState(null);


  // =====================================================
  // AVAILABLE ROOMS
  // =====================================================

  const [
    doubleRooms,
    setdoubleRooms
  ] = useState([]);

  const [
    singleRooms,
    setsingleRooms
  ] = useState([]);

  const [
    deluxeRooms,
    setdeluxeRooms
  ] = useState([]);


  // =====================================================
  // SELECTED ROOMS
  // =====================================================

  const [
    selectedRooms,
    setSelectedRooms
  ] = useState([]);


  // =====================================================
  // BOOKING DETAILS
  // =====================================================

  const [
    detail,
    setdetail
  ] = useState({

    fname1: '',
    lname1: '',
    email: '',
    phone: '',
    address: '',
    person: '',
    roomstype: [],
    roomnumber: [],
    meal: '',
    purpose: '',
    request: ''

  });


  // =====================================================
  // AUTHENTICATION
  // =====================================================

  useEffect(() => {

    if (!cookies.faculty_access_token) {

      navigate('/faculty-login', {
        replace: true
      });

    }

  }, [
    cookies.faculty_access_token,
    navigate
  ]);


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return '';
    }

    return dayjs(date).format(
      'DD-MM-YYYY'
    );

  };


  // =====================================================
  // FETCH AVAILABLE ROOMS
  // =====================================================

  useEffect(() => {

    const fetchAvailableRooms = async () => {

      if (
        !selectedStartDate ||
        !selectedEndDate ||
        !cookies.faculty_access_token
      ) {

        setdoubleRooms([]);
        setsingleRooms([]);
        setdeluxeRooms([]);

        return;

      }


      const fromdate =
        formatDate(
          selectedStartDate
        );

      const enddate =
        formatDate(
          selectedEndDate
        );


      if (!fromdate || !enddate) {
        return;
      }


      if (
        dayjs(selectedEndDate).isSame(
          selectedStartDate,
          'day'
        ) ||
        dayjs(selectedEndDate).isBefore(
          selectedStartDate,
          'day'
        )
      ) {

        alert(
          'End date must be after start date.'
        );

        setdoubleRooms([]);
        setsingleRooms([]);
        setdeluxeRooms([]);

        return;

      }


      try {

        const headers = {
          'x-token':
            cookies.faculty_access_token
        };


        const [
          doubleResponse,
          singleResponse,
          deluxeResponse
        ] = await Promise.all([

          axios.get(
            `${API_URL}/rooms/available`,
            {
              params: {
                fromdate,
                enddate,
                type: 'Double'
              },
              headers
            }
          ),

          axios.get(
            `${API_URL}/rooms/available`,
            {
              params: {
                fromdate,
                enddate,
                type: 'Single'
              },
              headers
            }
          ),

          axios.get(
            `${API_URL}/rooms/available`,
            {
              params: {
                fromdate,
                enddate,
                type: 'Deluxe'
              },
              headers
            }
          )

        ]);


        setdoubleRooms(
          doubleResponse.data?.Rooms || []
        );

        setsingleRooms(
          singleResponse.data?.Rooms || []
        );

        setdeluxeRooms(
          deluxeResponse.data?.Rooms || []
        );


        // Remove any previously selected rooms
        // that are no longer available.
        const availableIds = new Set([

          ...(doubleResponse.data?.Rooms || [])
            .map(room => room._id),

          ...(singleResponse.data?.Rooms || [])
            .map(room => room._id),

          ...(deluxeResponse.data?.Rooms || [])
            .map(room => room._id)

        ]);


        setSelectedRooms(
          previous =>
            previous.filter(
              roomId =>
                availableIds.has(roomId)
            )
        );


      } catch (error) {

        console.error(
          'Error fetching available faculty rooms:',
          error
        );


        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {

          navigate('/faculty-login', {
            replace: true
          });

          return;

        }


        alert(
          error.response?.data?.message ||
          'Unable to fetch available rooms.'
        );

      }

    };


    fetchAvailableRooms();

  }, [
    API_URL,
    cookies.faculty_access_token,
    navigate,
    selectedStartDate,
    selectedEndDate
  ]);


  // =====================================================
  // NEXT
  // =====================================================

  const handleNext = () => {

    if (activeStep === 0) {

      if (
        !selectedStartDate ||
        !selectedEndDate
      ) {

        alert(
          'Please enter the check-in and check-out dates.'
        );

        return;

      }


      if (
        dayjs(selectedEndDate).isSame(
          selectedStartDate,
          'day'
        ) ||
        dayjs(selectedEndDate).isBefore(
          selectedStartDate,
          'day'
        )
      ) {

        alert(
          'Check-out date must be after check-in date.'
        );

        return;

      }

    }


    if (activeStep === 2) {

      if (
        selectedRooms.length === 0
      ) {

        alert(
          'Please select at least one room.'
        );

        return;

      }


      if (
        !detail.person ||
        !detail.meal
      ) {

        alert(
          'Please select number of persons and meal plan.'
        );

        return;

      }

    }


    setActiveStep(
      previous =>
        previous + 1
    );

  };


  // =====================================================
  // BACK
  // =====================================================

  const handleBack = () => {

    setActiveStep(
      previous =>
        previous - 1
    );

  };


  // =====================================================
  // RESET
  // =====================================================

  const handleReset = (route) => {

    navigate(route);

  };


  // =====================================================
  // ROOM CHECKBOX
  // =====================================================

  const handleCheckboxChange = (
    roomId,
    roomType
  ) => {

    setSelectedRooms(
      previous => {

        const alreadySelected =
          previous.includes(roomId);


        if (alreadySelected) {

          return previous.filter(
            id =>
              id !== roomId
          );

        }


        return [
          ...previous,
          roomId
        ];

      }
    );


    setdetail(
      previous => {

        const alreadySelected =
          previous.roomnumber.includes(
            roomId
          );


        if (alreadySelected) {

          return {

            ...previous,

            roomnumber:
              previous.roomnumber.filter(
                id =>
                  id !== roomId
              ),

            roomstype:
              previous.roomstype.filter(
                (_, index) =>
                  previous.roomnumber[index] !== roomId
              )

          };

        }


        return {

          ...previous,

          roomnumber: [
            ...previous.roomnumber,
            roomId
          ],

          roomstype: [
            ...previous.roomstype,
            roomType
          ]

        };

      }
    );

  };


  // =====================================================
  // SUBMISSION
  // =====================================================

  const handleFormSubmission = async () => {

    if (
      selectedRooms.length === 0
    ) {

      alert(
        'Please select at least one room.'
      );

      return;

    }


    if (
      !detail.person ||
      !detail.meal
    ) {

      alert(
        'Please select number of persons and meal plan.'
      );

      return;

    }


    if (
      !detail.fname1.trim() ||
      !detail.lname1.trim() ||
      !detail.email.trim() ||
      !detail.phone.trim() ||
      !detail.address.trim() ||
      !detail.purpose.trim()
    ) {

      alert(
        'Please fill all the guest details.'
      );

      return;

    }


    if (
      !selectedStartDate ||
      !selectedEndDate
    ) {

      alert(
        'Please select check-in and check-out dates.'
      );

      return;

    }


    try {

      const startformattedDate =
        formatDate(
          selectedStartDate
        );

      const endformattedDate =
        formatDate(
          selectedEndDate
        );


      const payload = {

        Firstname:
          detail.fname1,

        Lastname:
          detail.lname1,

        Email:
          detail.email,

        Phonenumber:
          detail.phone,

        Address:
          detail.address,

        Rooms:
          selectedRooms,

        Roomstype:
          detail.roomstype,

        Adults:
          detail.person,

        Meals:
          detail.meal,

        Purpose:
          detail.purpose,

        Specialrequest:
          detail.request,

        Fromdate:
          startformattedDate,

        Enddate:
          endformattedDate

      };


      console.log(
        'Faculty booking payload:',
        payload
      );


      setShow(true);


      return;

    } catch (error) {

      console.error(
        'Error preparing booking:',
        error
      );

      alert(
        'Unable to prepare booking.'
      );

    }

  };


  // =====================================================
  // CONFIRM BOOKING
  // =====================================================

  const confirmBooking = async () => {

    try {

      const startformattedDate =
        formatDate(
          selectedStartDate
        );

      const endformattedDate =
        formatDate(
          selectedEndDate
        );


      const payload = {

        Firstname:
          detail.fname1,

        Lastname:
          detail.lname1,

        Email:
          detail.email,

        Phonenumber:
          detail.phone,

        Address:
          detail.address,

        Rooms:
          selectedRooms,

        Roomstype:
          detail.roomstype,

        Adults:
          detail.person,

        Meals:
          detail.meal,

        Purpose:
          detail.purpose,

        Specialrequest:
          detail.request,

        Fromdate:
          startformattedDate,

        Enddate:
          endformattedDate

      };


      const response =
        await axios.post(

          `${API_URL}/bookings/book`,

          payload,

          {
            headers: {
              'x-token':
                cookies.faculty_access_token,

              'Content-Type':
                'application/json'
            }
          }

        );


      console.log(
        'Faculty booking response:',
        response.data
      );


      setShow(false);

      alert(
        'Booking completed successfully!'
      );


      // Reset form
      setdetail({

        fname1: '',
        lname1: '',
        email: '',
        phone: '',
        address: '',
        person: '',
        roomstype: [],
        roomnumber: [],
        meal: '',
        purpose: '',
        request: ''

      });


      setSelectedRooms([]);

      setselectedStartDate(null);

      setselectedEndDate(null);

      setdoubleRooms([]);

      setsingleRooms([]);

      setdeluxeRooms([]);

      setActiveStep(0);


      navigate(
        '/facultybookings'
      );


    } catch (error) {

      console.error(
        'Faculty booking error:',
        error
      );


      setShow(false);


      if (
        error.response?.status === 409
      ) {

        alert(
          error.response.data?.message ||
          'One or more rooms are already booked for these dates.'
        );

        return;

      }


      alert(
        error.response?.data?.message ||
        'Unable to create booking.'
      );

    }

  };


  // =====================================================
  // FORM CONTENT
  // =====================================================

  const renderStepContent = (
    stepIndex
  ) => {

    switch (stepIndex) {


      // =================================================
      // STEP 1
      // =================================================

      case 0:

        return (

          <Grid
            container
            sx={{
              display: 'flex !important',
              flexDirection: 'column',
              gap: '30px',
              padding: '30px 20px 0',
              width: '100%'
            }}
          >

            <Typography>
              Pick the check-in and check-out dates
            </Typography>


            <Grid
              item
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '80px'
              }}
              className="page1"
            >

              <LocalizationProvider
                dateAdapter={AdapterDayjs}
              >

                <DatePicker
                  label="Start Date"
                  value={selectedStartDate}
                  onChange={date =>
                    setselectedStartDate(date)
                  }
                  minDate={dayjs()}
                />

              </LocalizationProvider>


              <LocalizationProvider
                dateAdapter={AdapterDayjs}
              >

                <DatePicker
                  label="End Date"
                  value={selectedEndDate}
                  onChange={date =>
                    setselectedEndDate(date)
                  }
                  minDate={
                    selectedStartDate ||
                    dayjs()
                  }
                />

              </LocalizationProvider>

            </Grid>

          </Grid>

        );


      // =================================================
      // STEP 2
      // =================================================

      case 1:

        return (

          <Grid
            container
            sx={{
              display: 'flex !important',
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: '60px',
              padding: '30px 20px 10px'
            }}
            className="page2"
          >

            <Grid item>

              <Typography
                style={{
                  fontSize: '17px',
                  marginBottom: '5px'
                }}
              >
                Guest First Name
              </Typography>

              <TextField
                type="text"
                variant="outlined"
                value={detail.fname1}
                onChange={event =>
                  setdetail(previous => ({
                    ...previous,
                    fname1:
                      event.target.value
                  }))
                }
                placeholder="First name"
                sx={{
                  width: '320px'
                }}
                className="textfeild"
              />

            </Grid>


            <Grid item>

              <Typography
                style={{
                  fontSize: '17px',
                  marginBottom: '5px'
                }}
              >
                Guest Last Name
              </Typography>

              <TextField
                type="text"
                variant="outlined"
                value={detail.lname1}
                onChange={event =>
                  setdetail(previous => ({
                    ...previous,
                    lname1:
                      event.target.value
                  }))
                }
                placeholder="Last name"
                sx={{
                  width: '320px'
                }}
                className="textfeild"
              />

            </Grid>


            <Grid item>

              <Typography
                style={{
                  fontSize: '17px',
                  marginBottom: '5px'
                }}
              >
                Guest Email
              </Typography>

              <TextField
                type="email"
                value={detail.email}
                onChange={event =>
                  setdetail(previous => ({
                    ...previous,
                    email:
                      event.target.value
                  }))
                }
                variant="outlined"
                placeholder="Email"
                sx={{
                  width: '320px'
                }}
                className="textfeild"
              />

            </Grid>


            <Grid item>

              <Typography
                style={{
                  fontSize: '17px',
                  marginBottom: '5px'
                }}
              >
                Guest Phone Number
              </Typography>

              <TextField
                type="text"
                variant="outlined"
                placeholder="Phone number"
                value={detail.phone}
                onChange={event =>
                  setdetail(previous => ({
                    ...previous,
                    phone:
                      event.target.value
                  }))
                }
                sx={{
                  width: '320px'
                }}
                className="textfeild"
              />

            </Grid>


            <Grid item>

              <Typography
                style={{
                  fontSize: '17px',
                  marginBottom: '5px'
                }}
              >
                Guest Current Address
              </Typography>

              <TextField
                type="text"
                variant="outlined"
                value={detail.address}
                onChange={event =>
                  setdetail(previous => ({
                    ...previous,
                    address:
                      event.target.value
                  }))
                }
                placeholder="Address"
                sx={{
                  width: '320px'
                }}
                className="textfeild"
              />

            </Grid>


            <Grid item>

              <Typography
                style={{
                  fontSize: '17px',
                  marginBottom: '5px'
                }}
              >
                Purpose of Visit
              </Typography>

              <TextField
                type="text"
                variant="outlined"
                value={detail.purpose}
                onChange={event =>
                  setdetail(previous => ({
                    ...previous,
                    purpose:
                      event.target.value
                  }))
                }
                placeholder="Purpose"
                sx={{
                  width: '320px'
                }}
                className="textfeild"
              />

            </Grid>

          </Grid>

        );


      // =================================================
      // STEP 3
      // =================================================

      case 2:

        return (

          <Grid
            container
            sx={{
              display: 'flex !important',
              flexDirection: 'column',
              gap: '35px',
              padding: '30px 20px 0'
            }}
          >

            {/* NUMBER OF PERSONS */}

            <Grid
              item
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%'
              }}
            >

              <FormControl
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '10px',
                  alignItems: 'center'
                }}
                size="small"
              >

                <Typography>
                  Choose number of persons:
                </Typography>

                <Select
                  sx={{
                    padding: '0 7px'
                  }}
                  value={detail.person}
                  onChange={event =>
                    setdetail(previous => ({
                      ...previous,
                      person:
                        event.target.value
                    }))
                  }
                  displayEmpty
                >

                  <MenuItem value="">
                    Select
                  </MenuItem>

                  {[1,2,3,4,5,6,7,8].map(
                    number => (

                      <MenuItem
                        value={number}
                        key={number}
                      >
                        {number}{' '}
                        {number === 1
                          ? 'Person'
                          : 'Persons'}
                      </MenuItem>

                    )
                  )}

                </Select>

              </FormControl>

            </Grid>


            {/* ROOM SELECTION */}

            <Grid
              item
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
              }}
            >

              <Typography>
                Select the rooms from below
              </Typography>


              <Grid
                container
                sx={{
                  display: 'flex',
                  gap: '10px',
                  flexDirection: 'column',
                  marginTop: '5px'
                }}
              >

                {/* DOUBLE */}

                <Grid item>

                  <Accordion>

                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreIcon />
                      }
                      aria-controls="double-content"
                      id="double-header"
                    >

                      <Typography>
                        Double Rooms
                      </Typography>

                    </AccordionSummary>


                    <AccordionDetails>

                      <FormGroup>

                        <Typography
                          sx={{
                            marginBottom: '10px'
                          }}
                        >
                          Comfortable accommodation
                          for guests travelling together.
                        </Typography>


                        {doubleRooms.length === 0 ? (

                          <Typography
                            color="text.secondary"
                          >
                            No Double rooms available
                            for these dates.
                          </Typography>

                        ) : (

                          doubleRooms.map(
                            room => (

                              <FormControlLabel

                                key={
                                  room._id
                                }

                                control={

                                  <Checkbox
                                    checked={
                                      selectedRooms.includes(
                                        room._id
                                      )
                                    }
                                    onChange={() =>
                                      handleCheckboxChange(
                                        room._id,
                                        'Double'
                                      )
                                    }
                                  />

                                }

                                label={
                                  room.roomnumber
                                }

                              />

                            )
                          )

                        )}

                      </FormGroup>

                    </AccordionDetails>

                  </Accordion>

                </Grid>


                {/* SINGLE */}

                <Grid item>

                  <Accordion>

                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreIcon />
                      }
                      aria-controls="single-content"
                      id="single-header"
                    >

                      <Typography>
                        Single Rooms
                      </Typography>

                    </AccordionSummary>


                    <AccordionDetails>

                      <FormGroup>

                        <Typography
                          sx={{
                            marginBottom: '10px'
                          }}
                        >
                          Comfortable private
                          accommodation for individual
                          guests.
                        </Typography>


                        {singleRooms.length === 0 ? (

                          <Typography
                            color="text.secondary"
                          >
                            No Single rooms available
                            for these dates.
                          </Typography>

                        ) : (

                          singleRooms.map(
                            room => (

                              <FormControlLabel

                                key={
                                  room._id
                                }

                                control={

                                  <Checkbox
                                    checked={
                                      selectedRooms.includes(
                                        room._id
                                      )
                                    }
                                    onChange={() =>
                                      handleCheckboxChange(
                                        room._id,
                                        'Single'
                                      )
                                    }
                                  />

                                }

                                label={
                                  room.roomnumber
                                }

                              />

                            )
                          )

                        )}

                      </FormGroup>

                    </AccordionDetails>

                  </Accordion>

                </Grid>


                {/* DELUXE */}

                <Grid item>

                  <Accordion>

                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreIcon />
                      }
                      aria-controls="deluxe-content"
                      id="deluxe-header"
                    >

                      <Typography>
                        Deluxe Rooms
                      </Typography>

                    </AccordionSummary>


                    <AccordionDetails>

                      <FormGroup>

                        <Typography
                          sx={{
                            marginBottom: '10px'
                          }}
                        >
                          Spacious accommodation for
                          guests looking for additional
                          comfort.
                        </Typography>


                        {deluxeRooms.length === 0 ? (

                          <Typography
                            color="text.secondary"
                          >
                            No Deluxe rooms available
                            for these dates.
                          </Typography>

                        ) : (

                          deluxeRooms.map(
                            room => (

                              <FormControlLabel

                                key={
                                  room._id
                                }

                                control={

                                  <Checkbox
                                    checked={
                                      selectedRooms.includes(
                                        room._id
                                      )
                                    }
                                    onChange={() =>
                                      handleCheckboxChange(
                                        room._id,
                                        'Deluxe'
                                      )
                                    }
                                  />

                                }

                                label={
                                  room.roomnumber
                                }

                              />

                            )
                          )

                        )}

                      </FormGroup>

                    </AccordionDetails>

                  </Accordion>

                </Grid>

              </Grid>

            </Grid>


            {/* MEAL PLAN */}

            <Grid item>

              <FormControl>

                <FormLabel>
                  Choose the Meal Plan
                </FormLabel>


                <RadioGroup

                  value={detail.meal}

                  onChange={event =>
                    setdetail(previous => ({
                      ...previous,
                      meal:
                        event.target.value
                    }))
                  }

                >

                  <FormControlLabel
                    value="Room Only"
                    control={
                      <Radio />
                    }
                    label="Room Only"
                  />

                  <FormControlLabel
                    value="Breakfast"
                    control={
                      <Radio />
                    }
                    label="Breakfast"
                  />

                  <FormControlLabel
                    value="Brunch"
                    control={
                      <Radio />
                    }
                    label="Brunch (Breakfast and Lunch)"
                  />

                  <FormControlLabel
                    value="Three square meals"
                    control={
                      <Radio />
                    }
                    label="Three square meals"
                  />

                </RadioGroup>

              </FormControl>

            </Grid>


            {/* SPECIAL REQUEST */}

            <Grid item>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Special Request"
                value={detail.request}
                onChange={event =>
                  setdetail(previous => ({
                    ...previous,
                    request:
                      event.target.value
                  }))
                }
                placeholder="Any special request"
              />

            </Grid>

          </Grid>

        );


      default:

        return null;

    }

  };


  return (

    <Box
      sx={{
        width: '100%',
        padding: '70px 90px 0'
      }}
      className="mainbox"
    >

      {/* =================================================
          CONFIRMATION MODAL
      ================================================= */}

      <Modal
        open={show}
        onClose={toggleModal}
        sx={{
          display: 'grid',
          placeItems: 'center'
        }}
      >

        <Slide
          direction="down"
          in={show}
          timeout={500}
        >

          <Box
            position="relative"
            maxWidth="500px"
            display="flex"
            flexDirection="column"
            borderRadius="xl"
            shadow="xl"
            style={{
              margin: '0 10px'
            }}
            sx={{
              backgroundColor: 'white'
            }}
          >

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={2}
            >

              <Typography variant="h5">
                Confirm your Booking
              </Typography>

              <CloseIcon
                fontSize="medium"
                sx={{
                  cursor: 'pointer'
                }}
                onClick={toggleModal}
              />

            </Box>


            <Divider />


            <Box p={2}>

              <Typography
                variant="body2"
                sx={{
                  color: '#333'
                }}
              >

                You can't make changes in the
                booking after confirmation.

                <br />

                Are you sure you want to confirm
                this booking?

              </Typography>

            </Box>


            <Divider />


            <Box
              display="flex"
              justifyContent="space-between"
              p={1.5}
            >

              <Button
                variant="outlined"
                onClick={toggleModal}
              >
                Close
              </Button>


              <Button
                variant="contained"
                color="primary"
                onClick={
                  confirmBooking
                }
              >
                Book Now
              </Button>

            </Box>

          </Box>

        </Slide>

      </Modal>


      {/* =================================================
          STEPPER
      ================================================= */}

      <Stepper
        activeStep={activeStep}
      >

        {steps.map(
          label => (

            <Step
              key={label}
            >

              <StepLabel>
                {label}
              </StepLabel>

            </Step>

          )
        )}

      </Stepper>


      {/* =================================================
          CONTENT
      ================================================= */}

      {activeStep === steps.length ? (

        <React.Fragment>

          <Typography
            sx={{
              mt: 2,
              mb: 1,
              padding:
                '30px 20px 10px'
            }}
          >
            Booking completed successfully.
          </Typography>


          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              pt: 2
            }}
          >

            <Box
              sx={{
                flex: '1 1 auto'
              }}
            />


            <Button
              onClick={() =>
                handleReset(
                  '/facultybookings'
                )
              }
            >
              Go to Bookings Page
            </Button>

          </Box>

        </React.Fragment>

      ) : (

        <React.Fragment>

          {renderStepContent(
            activeStep
          )}


          {/* =================================================
              NAVIGATION BUTTONS
          ================================================= */}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              pt: 2
            }}
          >

            <Button
              color="inherit"
              disabled={
                activeStep === 0
              }
              onClick={
                handleBack
              }
              sx={{
                mr: 1
              }}
            >
              Back
            </Button>


            <Box
              sx={{
                flex: '1 1 auto'
              }}
            />


            <Button
              onClick={() => {

                if (
                  activeStep ===
                  steps.length - 1
                ) {

                  handleFormSubmission();

                } else {

                  handleNext();

                }

              }}
            >

              {
                activeStep ===
                steps.length - 1
                  ? 'Book'
                  : 'Next'
              }

            </Button>

          </Box>

        </React.Fragment>

      )}

    </Box>

  );

}