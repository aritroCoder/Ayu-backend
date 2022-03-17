// mongoDB database model for users
const mongoose = require('mongoose');
const { Schema }= mongoose;

//unique attribute- phone number, email
const AppointmentSchema = new Schema({
    //appointment will be processed using patient's and doctor's phone number as they will be the primary key
    ph_no_patient:{
        type: Number,
        required: true
    },
    ph_no_doctor:{
        type: Number,
        required: true
    },
    date:{ 
        type: Date,
        required: true
    },
    time:{ 
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);