const express = require('express');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Appointment = require('../models/Appointments');
const fetchuser = require('../middleware/fetchuser');

//Route 1: Get all list of Doctors using GET /api/doctor/fetchalldoctors
router.get('/fetchalldoctors', fetchuser, async (req, res) => {
    var listOfDoctor = await Doctor.find();
    if(listOfDoctor.length === 0){
        listOfDoctor = {"error": "No doctors found."};
    }
    return res.json(listOfDoctor);
})

//Route 2: Find a doctor by name using GET /api/doctor/find/:name 
router.get('/find/:name', fetchuser, async (req, res) => {
    var listOfDoctor = await Doctor.find({name: req.params.name});
    if(listOfDoctor.length === 0){
        listOfDoctor = {"error": "No doctors found."};
    }
    return res.json(listOfDoctor);
})

//Route 3: Find a doctor by specialization using GET /api/doctor/findBySpec/:specialization
router.get('/findBySpec/:specialization', fetchuser, async (req, res) => {
    var listOfDoctor = await Doctor.find({field_of_specialization: req.params.specialization});
    if(listOfDoctor.length === 0){
        listOfDoctor = {"error": "No doctors found."};
    }
    return res.json(listOfDoctor);
})

module.exports = router;