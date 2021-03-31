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

// Create first endpoint including a body parser middleware function
app.post('/api/exercise/new-user', bodyParser.urlencoded({ extended: false}), (req, res) => {
  // Create a new user and asign it to the variable newUser, take parameters from the request body
  let newUser = new User({username: req.body.username});
  // Save the new user
  newUser.save((err, savedUser) => {
    if (!err) {
      let responseObject = {};
      // Fill in the response object with the user fields
      responseObject['username'] = savedUser.username;
      responseObject['_id'] = savedUser.id;
      // Return a response object as JSON 
      res.json(responseObject);
    }
  });
});

// Create another endpoint for the request of users
app.get('/api/exercise/users', (req, res) => {
  // User.find() to gather all users data. Second argument takes a callback function
  User.find({}, (err, arrayOfUsers) => {
    if (!err) {
      res.json(arrayOfUsers);
    }
  })
});

app.post('/api/exercise/add', bodyParser.urlencoded({extended: false}), (req, res) => {
  
  let newSession = new Session({
    description: req.body.description,
    duration: parseInt(req.body.duration),
    date: req.body.date
  })
  
  if (newSession === '') {
    
  }
  
  res.json({});
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
