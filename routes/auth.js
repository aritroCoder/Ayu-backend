const express = require('express');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// var fetchuser = require('../middleware/fetchuser');

const { SECRET_KEY } = require('../config');

// ROUTE 1: Create a User profile using: POST "/api/auth/usersignup". No login required
router.post('/usersignup', [
  body('name', 'Enter a valid name of more than 3 letters').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
  body('ph_number', 'Phone number must be valid').isLength(10),
], async (req, res) => {
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Check whether the user with this email exists already
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry a user with this email already exists" });
    }
    user = await User.findOne({ ph_number: req.body.ph_number });
    if (user) {
      return res.status(400).json({ error: "Sorry a user with this phone number already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    user = await User.create({
      name: req.body.name,
      password: secPass,
      ph_number: req.body.ph_number,
      email: req.body.email,
      gender: req.body.gender,
      age: req.body.age,
    });
    const authtoken = jwt.sign({
      id: user.id,
      ph_number: user.ph_number,
      email: user.email
    }, SECRET_KEY, {});


    // res.json(user)
    res.json({ user, authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
//TODO: fix the discrepancy caused when anyone makes a doctor and user profile with same email/phone no.

// ROUTE 2: Create a Doctor profile using: POST "/api/auth/docsignup". No login required
router.post('/docsignup', [
  body('name', 'Enter a valid name of more than 3 letters').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
  body('ph_number', 'Phone number must be valid').isLength(10),
  body('field_of_specialization', 'Write a valid specialization field(general for non specialised doctors)').isLength({ min: 1 }),
  body('reg_no', 'Write a valid governament issued registration number').isLength({ min: 3 })
], async (req, res) => {
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Check whether the user with this email exists already
    let user = await Doctor.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry a Doctor with this email already exists" });
    }
    user = await Doctor.findOne({ ph_number: req.body.ph_number });
    if (user) {
      return res.status(400).json({ error: "Sorry a doctor with this phone number already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    user = await Doctor.create({
      name: req.body.name,
      password: secPass,
      ph_number: req.body.ph_number,
      email: req.body.email,
      gender: req.body.gender,
      age: req.body.age,
      years_of_exp: req.body.years_of_exp,
      field_of_specialization: req.body.field_of_specialization,
      reg_no: req.body.reg_no,
    });
    var authtoken = jwt.sign({
      id: user.id,
      ph_number: user.ph_number,
      email: user.email
    }, SECRET_KEY, {});


    // res.json(user)
    res.json({ user, authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})


// ROUTE 3: Login to a User profile using: POST "/api/auth/login". No login required, and works for both users and doctors.
router.post('/login', [
    body('email', 'Enter a valid email').isLength({ min: 3 }),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })
  ], async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      // Check whether the user is present
      let user = await User.findOne({ email: email });
      if(!user){
        user = await Doctor.findOne({ email: email });
      }
      if(!user){
          return res.status(400).json({error: "User not found"});
      }
      const match = await bcrypt.compare(password, user.password);
      if(!match){
          return res.status(500).json({error: "Wrong Login Credentials"});
      }
      var authtoken = jwt.sign({
        id: user.id,
        ph_number: user.ph_number,
        email: user.email
      }, SECRET_KEY, {});
      res.json({ user, authtoken })
  
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })

module.exports = router;