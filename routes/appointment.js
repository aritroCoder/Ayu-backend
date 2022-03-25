const express = require('express');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Appointment = require('../models/Appointments');
const fetchuser = require('../middleware/fetchuser');

const { SECRET_KEY } = require('../config');
var regex = new RegExp('^(10|11|12|[1-9]):[0-5][0-9]$'); //for time validation.

//route 1: book an appointment using POST '/api/appointment/schedule'. login required
router.post('/schedule', fetchuser, [
    body('ph_doc', 'Enter a valid phone number of the doctor').isLength(10),
    body('date', 'Enter a valid date of the appointment').isDate(),
    body('time', 'Enter a valid time of the appointment').matches(regex),
], async (req, res) => {
    var doctor = await Doctor.findOne({ ph_number: req.body.ph_doc });
    if (!doctor) {
        return res.status(400).json({ error: "Phone number not available with any doctor" });
    }
    var existing_appointments = await Appointment.find({ ph_no_doctor: req.body.ph_doc }); //get all existing_appointments of the same doctor
    for (var i = 0; i < existing_appointments.length; i++) {
        if (existing_appointments[i].date.toISOString().localeCompare(req.body.date.concat("T").concat(req.body.time).concat(":00.000Z")) === 0) {
            return res.status(400).json({ error: "An existing appointment is already there. Please try another date/time" });
        }
    }
    let newAppointment = await Appointment.create({
        ph_no_patient: req.user.ph_number,
        ph_no_doctor: req.body.ph_doc,
        date: req.body.date.concat("T").concat(req.body.time).concat("Z"),
        time: req.body.time
    })
    return res.json(newAppointment);
})

//route 2: Get a list of all YOUR appointments using GET '/api/appointment/list'. login required 
router.get('/list', fetchuser, async (req, res) => {
    let phone = req.user.ph_number;
    let appointments = await Appointment.find({ ph_no_doctor: phone });
    if (appointments.length === 0) {
        appointments = await Appointment.find({ ph_no_patient: phone });
        if (appointments.length === 0) {
            return res.status(200).json({ error: "No appointments found" });
        }
    }
    return res.json(appointments);
})

//route 3: Delete an apppointment (both from user and doctor's side) using DELETE '/api/appointment/cancelAppointment/:id'. Login required
router.delete('/cancelAppointment/:id', fetchuser, async (req, res) => {
    let appointment_data = await Appointment.findById(req.params.id);
    if (!appointment_data) return res.status(404).json({ error: 'Appointment not found' });
    if (appointment_data.ph_no_patient.localeCompare(req.user.ph_number)===0) {
        appointment_data = await Appointment.findByIdAndDelete(req.params.id);
    }
    else if (appointment_data.ph_no_doctor.localeCompare( req.user.ph_number)===0) {
        appointment_data = await Appointment.findByIdAndDelete(req.params.id);
    }
    else {
        return res.status(500).json({ error: "Unauthorized access" });
    }
    return res.json({"Success": "Your appointment has been cancelled", appointment_data });
})

module.exports = router;



