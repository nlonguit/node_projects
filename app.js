// app.js

// BASE SETUP
// =============================================================================


// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('./config/db');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public/libs', express.static(__dirname + '/public/libs'));
app.use('/public/js', express.static(__dirname + '/public/js'));
app.use('/public/css', express.static(__dirname + '/public/css'));
app.use('/public/views/pages', express.static(__dirname + '/public/views/pages'));
app.use('/public/views/partials', express.static(__dirname + '/public/views/partials'));


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

require('./middlewares/routes')(router); //middlewares are defined here
//test@.com.sm
//12345

// mount the router on the app
app.use(router);


module.exports = app;
