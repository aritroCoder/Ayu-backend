// mongoDB database model for users
const mongoose = require('mongoose');
const { Schema }= mongoose;

//unique attribute- phone number, email
const DocSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    ph_number:{
        type: Number,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    gender:{
        type: String,
        required: true,
    },
    age:{
        type: Number,
        required: true,
    },
    years_of_exp:{
        type: Number,
        required: true,
    },
    field_of_specialization:{
        type: String,
        required: true,
    },
    reg_no:{
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Doctor', DocSchema);