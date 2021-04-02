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
mongoose.connect(uri, { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false });

// Create Schema for the exercise sessions
let exerciseSessionSchema = new mongoose.Schema({
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: String
});

// Create Schema for the users
let userSchema = new mongoose.Schema({
  username: {type: String, unique: true, required: true},
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
    if (err) {
      res.json({'error': 'username already taken'});
    } else {
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
    if (!arrayOfUsers) {
      res.send("No users found")
    } else {
      res.json(arrayOfUsers);
    }
  })
});

// Create endpoint to take session data
app.post('/api/exercise/add', bodyParser.urlencoded({extended: false}), (req, res) => {
  // Take data from the exercise session fields and assign it to a newSession variable
  let newSession = new Session({
    description: req.body.description,
    duration: parseInt(req.body.duration),
    date: req.body.date
  })
  // If date field is empty assign the current date
  if (newSession.date === '') {
    newSession.date = new Date().toISOString().substring(0, 10); //Convert date to string and take only the first 10 characters 'YYYY-MM-DD'
  }
  // Find the user to be updated with the newSession data. The function takes four arguments: 
  // 1. The lookup criteria (use id field)
  // 2. The change to be made (use $push to add a new 'log' field that includes the newSession data)
  // 3. In order to update the document 'new' has to be set to true
  // 4. Callback function with error and updated data
  User.findByIdAndUpdate(req.body.userId, {$push : {log: newSession}}, {new: true}, (err, updatedUser) => {
    let responseObject = {};
    responseObject['_id'] = updatedUser.id;
    responseObject['username'] = updatedUser.username;
    responseObject['date'] = new Date(newSession.date).toDateString(); // Take date from newSession and convert it to a string
    responseObject['duration'] = newSession.duration;
    responseObject['description'] = newSession.description;
    
    res.json(responseObject);
  })
});



/*
app.get('/api/exercise/log', (req, res) => {
  const { userId, from, to, limit } = req.query;
  
  User.findById({userId}, {date: {$gte: new Date(from), $lte: new Date(to)}}.limit(+limit).exec (err, data) => {
    if (!data) {
      res.send("Unknown userId")
    } else {
      const username = data.username;
      const session = data.log;
      
      res.json(session);
    
        })
      })
    })
*/    

app.get('/api/exercise/log', (req, res) => {
  const { userId, from, to, limit } = req.query;
  
  User.findById(userId, (err, data) => {
    if (!data) {
      res.json({'error': 'Unknown userId'});
    } else if (from) {
      const fromDate = new Date(from);
      log = log.filter(exercise => new Date(exercise.date) > fromDate)
    }
  })
})


/*
// Create endpoint to get the user's log
app.get('/api/exercise/log', (req, res) => {
  // Find user by id using a query
  User.findById(req.query.userId, (err, data) => {
    if (!data) {
      res.send("Unknown userId");
    } else {
      res.json({
        data
      })
    }  
  })
});
*/



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
