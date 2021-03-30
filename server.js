const express = require('express')
const app = express()
const cors = require('cors')
const mongodb = require('mongodb')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Connect to the database
let uri = 'mongodb+srv://user2:' + process.env.PW + '@cluster0.cakja.mongodb.net/fccExerciseTracker?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true , useUnifiedTopology: true });

// Create Schema for the exercise sessions
let exerciseSessionSchema = new mongoose.Schema({
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: String
});

// Create Schema for the users
let userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  log: [exerciseSessionSchema]
});

// Create Models for the exercise sessions and users
let Session = mongoose.model('Session', exerciseSessionSchema);
let User = mongoose.model('User', userSchema);

// Create first end point
app.post('/api/exercise/new-user', bodyParser.urlencoded({ extended: false}), (req, res) => {
  
  
  res.json({});
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
