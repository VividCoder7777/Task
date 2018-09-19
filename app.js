var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cookieSession = require('cookie-session');
const passport = require('passport');

let cors = require('cors');
require('dotenv').config();


var app = express();

app.use(cors());

let taskRouter = require('./components/tasks/taskRouter');
let authRouter = require('./components/authentication/auth_router');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cookieSession({
  name: 'session',
  maxAge: 24*60*60*1000,
  keys: [process.env.session_key] 
}));

// 
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'client/build')));
app.use('/api', taskRouter);
app.use('/auth', authRouter);


app.get('*', (req, res, next) => {
  console.log('REFRESH!?');
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});


// central error handler 
// // error handler
app.use(async(err, req, res, next) =>{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
