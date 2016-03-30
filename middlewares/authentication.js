var User = require('../models/user');
var config = require('../config/config');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

exports.authenticate = function(req, res) {
	console.log('username ' + (req.body));
	// find the user
  User.findOne({
    email: req.body.email
  }, function(err, user) {
      console.log('go to find user');
      if (err) throw err;

      if (!user) {
          res.status(403).send({success: false, message: 'Authentication failed. User not found.'});
      } else if (user) {
          console.log('find user: ' + user);
          // check if password matches
          if (!user.authenticate(req.body.password)) {
              res.status(403).send({success: false, message: 'Authentication failed. Wrong password.'});
          } else {
              // if user is found and password is right
              // create a token
              var token = jwt.sign(user, config.key, {
                  expiresIn: 86400 // expires in 24 hours
              });
              user.hashed_password = undefined;
              // return the information including token as JSON
              res.json({
                  success: true,
                  message: 'Enjoy your token!',
                  token: token,
                  principle: user
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
        return res.status(403).send({ success: false, message: 'Failed to authenticate token.' });
      } else {
            // if everything is good, save to request for use in other middlewares
            req.decoded = decoded;
            next();
      }
    });

  } else {
        // if there is no token
        // return login page
        console.log('go to blank page first');
        return res.sendFile('blank.html', {root: './public/views/partials'}); // load our public/index.html file
  }
}