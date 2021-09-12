const express = require('express');
const mongoose = require('mongoose')
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const port = process.env.PORT || 3000;

//Passport Config
require('./config/passport')(passport);
//DB Config
const db = require('./config/key').MongoURI;
//Connect to Mongo

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

//Static Files 
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
//Templating Engine
app.set('views','./views');
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({ extended:true }));

// Express Session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
//Connect flash
app.use(flash());

//Global Variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
// Routes
app.use('/users', require('./routes/users.js'));
app.use('/', require('./routes/index.js'))
app.listen(port, () => console.log(`Listening on Port ${port}`));