var User = require('../models/user');
var config = require('../config/config');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

exports.authenticate = function(req, res) {
	console.log('username ' + JSON.stringify(req.body));
	// find the user
  User.findOne({
    email: req.body.email
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if ( !user.authenticate(req.body.password) ) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, config.key, {
          expiresIn: 86400 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   

    }

  });
}

exports.verifyToken = function(req, res, next) {
	
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.key, function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other middlewares
        req.decoded = decoded;    
        next();
      }
    });

  } else {
    // if there is no token
    // return login page
    return res.sendFile('./public/views/pages/login.html'); // load our public/index.html file
  }
}