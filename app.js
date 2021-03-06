var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const layouts = require("express-ejs-layouts");
const axios = require('axios');
const auth = require('./routes/auth');
const session = require("express-session"); 
const MongoDBStore = require('connect-mongodb-session')(session);
require("dotenv").config()
// *********************************************************** //
//  Loading JSON datasets
// *********************************************************** //

// *********************************************************** //
//  Loading models
// *********************************************************** //


// *********************************************************** //
//  Connecting to the database
// *********************************************************** //

const mongoose = require( 'mongoose' );
const mongodb_URI = process.env.REACT_APP_MONGODB
const api_Key = process.env.REACT_APP_API_KEY

mongoose.connect( mongodb_URI, { useNewUrlParser: true, useUnifiedTopology: true } );
// fix deprecation warnings
//mongoose.set('useFindAndModify', false); 
//mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log("we are connected!!!")});

// middleware to test is the user is logged in, and if not, send them to the login page
const isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  }
  else res.redirect('/login')
}
/*
  Load MongoDB models 
*/
const collection = require('./models/Collection');
const allDish = require('./models/allDish');




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const addNewDish = require('./routes/addNewDish');
const shopping = require('./routes/shopping');
const CD = require('./routes/CloudData');

var app = express();

var store = new MongoDBStore({
  uri: mongodb_URI,
  collection: 'mySessions'
});

// Catch errors
store.on('error', function(error) {
  console.log(error);
});

app.use(require('express-session')({
  secret: 'This is a secret 7f89a789789as789f73j2krklfdslu89fdsjklfds',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: true
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(layouts)
app.use(auth)
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(addNewDish);
app.use(shopping);
app.use(CD);

// *********************************************************** //
//  API Lookup
// *********************************************************** //

app.get('/lookup',
  (req, res, next) => {
    res.render('lookup')
  })
  app.post('/lookup',
  async (req,res,next) => {
    var {keyword,exclude} = req.body;
    const ingre = exclude.split(',')
    const response = await axios.get("https://api.spoonacular.com/recipes/complexSearch?query=" + keyword + "&excludeIngredients=" + ingre + "&number=100&" + api_Key)
    console.dir(response.data.length)
    res.locals.results = response.data.results
    res.locals.number = response.data.number
    res.render('lookupResult')

  })

  app.get('/detail/:id',
  async (req,res,next) => {
    const id = req.params.id;
    const response = await axios.get("https://api.spoonacular.com/recipes/" + id + "/information?" + api_Key)
    console.dir(response.data.length)
    res.locals.info = response.data
    res.locals.summary = response.data.summary
    if(response.data.analyzedInstructions.length === 0){
      res.locals.instruction = new Array([])
    }
    else{
      res.locals.instruction = response.data.analyzedInstructions[0].steps
    }
    res.locals.ingredients = response.data.extendedIngredients
    res.render('detail')

  })


// *********************************************************** //
//  Collection management
// *********************************************************** //

  app.get('/addDish/:dishId',
   isLoggedIn,
   async (req,res,next) => {
    try {
      const dishId = req.params.dishId;
      const response = await axios.get("https://api.spoonacular.com/recipes/" + dishId + "/information?" + api_Key + "&includeNutrition=false")
      console.dir(response.data.length)
      const data = response.data
      const coll = 
        new collection(
          {
            userId:res.locals.user._id,
            dishId:dishId,
            title: data.title,
            sourceName: data.sourceName,
            ingredients: data.extendedIngredients,
            time: data.readyInMinutes,
          })
          await coll.save();
        const dish = 
          new allDish(
            {
              dishId:dishId,
              title: data.title,
              sourceName: data.sourceName,
              ingredients: data.extendedIngredients,
              time: data.readyInMinutes,
            })
          await dish.save();
    }catch(e) {
      next(e)
    }
   }
)

app.get('/mylikes',
  isLoggedIn,
  async (req,res,next) => {
    try{
      const collections = 
         await collection.find({userId:res.locals.user._id})
      res.locals.dishes = collections;
      //res.json(dishes);
      res.render('showCollection')
    }catch(e){
      next(e);
    }
  }
)


app.get('/deletelikes/:itemId',
    isLoggedIn,
    async (req,res,next) => {
      try {
        const itemId = req.params.itemId;
        await collection.deleteOne({dishId:itemId});
        res.redirect('/mylikes');
      } catch(e){
        next(e);
      }
    }
)


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
