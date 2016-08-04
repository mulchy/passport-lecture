var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var passport = require('passport'); // npm install
var session = require('express-session'); // npm install
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('./models/user');
var login = require('./routes/login');
var register = require('./routes/register');


// don't let the tests access the real db
var mongoURI;
if (process.env.NODE_ENV == 'test') {
    mongoURI = 'mongodb://localhost:27017/prime_example_passport_test';
} else {
    mongoURI = 'mongodb://localhost:27017/prime_example_passport';
}


var MongoDB = mongoose.connect(mongoURI).connection;

MongoDB.on('error', function(err) {
  console.log('Mongo error', err);
});

MongoDB.once('open', function(){
  console.log('Mongo connection opened');
});

var app = express();

app.use(session({
  secret: 'kitty',
  key: 'user',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000, secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, function(username, password, done) {
  User.findOne({ username: username }, function(err, user){
    if (err) {
      throw err;
    }

    if (!user) {
      // didn't find a user with the same username
      return done(null, false);
    }

    // at this point we have found a user
    // still need to check their password
    user.comparePassword(password, function(err, isMatch){
      if (isMatch) {
        // successfully auth the user
        return done(null, user);
      } else {
        done(null, false);
      }
    });
  });
}));

// converts user to user id
passport.serializeUser(function(user, done){
  done(null, user.id);
});

// converts user id to user
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    if (err) {
      return done(err);
    }

    done(null, user);
  });
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'public/views/login.html'));
});

app.use('/login', login);
app.use('/register', register);

app.use('/api', function(req, res, next){
  if (req.isAuthenticated()) {
    next();
  } else {
    res.sendStatus(403);
  }
});

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
  console.log('Server listening on ' + server.address().port);
});

module.exports = server;
