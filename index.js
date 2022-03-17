const express = require('express');
const app = express();
const mongoose = require('mongoose');
var bodyParser = require('body-parser')
require('dotenv').config();  //dotenv required for accessing .env file

const { MONGODB } = require('./config.js');
const port = process.env.PORT;

//endpoints
app.get('/', (req, res) => {
  res.send('Hello World!')
})

//Available Routes
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/appointment', require('./routes/appointment'))

//start server
const connectToMongo = async () => {
  await mongoose.connect(MONGODB, { useNewUrlParser: true }, () => {
    console.log("Connected to mongo successfully");
  });
}
app.listen(port, () => {
  connectToMongo();
  console.log(`Backend listening at http://localhost:${port}`);
})