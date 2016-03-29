// app.js

// BASE SETUP
// =============================================================================


// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('./config/db');
var authentication = require('./middlewares/authentication');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

//test@.com.sm
//12345
router.post('/authenticate', authentication.authenticate);
router.use(authentication.verifyToken);

//middlewares are defined here
//var movies = require('./middlewares/movies');
require('./middlewares/routes')(router);

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use(router);


module.exports = app;