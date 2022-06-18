var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const layouts = require("express-ejs-layouts");
const axios = require('axios');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(layouts)
app.use('/', indexRouter);
app.use('/users', usersRouter);

  //Search for tv/movies by keyword

  app.get('/lookup',
  (req, res, next) => {
    res.render('lookup')
  })
  app.post('/lookup',
  async (req,res,next) => {
    const {keyword} = req.body;
    const response = await axios.get('https://api.themoviedb.org/3/search/movie?api_key=4cfc53a5c270af87890abe962dcef020&query=' + keyword)
    console.dir(response.data.length)
    res.locals.results = response.data.results
    res.locals.key = keyword
    res.locals.number = response.data.total_results
    res.render('lookupResult')
    //res.json(response.data.slice(100,105));
  })

  app.get('/detail/:idnumber',
  async (req,res,next) => {
    const idnumber = req.params.idnumber;
    const response = await axios.get('https://api.themoviedb.org/3/movie/' + idnumber + '?api_key=4cfc53a5c270af87890abe962dcef020')
    console.dir(response.data.length)
    res.locals.info = response.data
    res.locals.genres = response.data.genres
    res.render('detail')
    //res.json(response.data.slice(100,105));
  })


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
