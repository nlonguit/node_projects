var User = require('../models/user');
var config = require('../config/config');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var email = require('../email/email');
var nodemail = require('../email/nodemail');
var VerificationToken = require('../models/verification-token');
var util = require('../util/url-util');

exports.setup = function(req,res){
    var user = new User({
        name:"Narendra",
        email:"narendrasoni2@gmail.com",
        username: "narendrasoni1989"
    });
    user.save(function(err){
        if(err){
			console.log('Error: ' + err);
            return res.status(500).send({message: "Error occured while saving"});
		}
        else
            res.status(200).send({message: "saved successfully"});
    });
};

/**
 * List of users
 */
exports.query = function(req, res) {
  User.find().sort('-createdAt').exec(function(err, users) {
    if (err) 
		return res.status(500).json({message: "Error occured while querying"});
    res.status(200).json(users);
  });
};

/**
 * Find user by id and store it in the request
 */
exports.user = function(req, res, next, id) {
  User.findById(id, function(err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load user ' + id));
    req.user = user;
    next();
  });
};

/**
 * Show a user
 */
exports.show = function(req, res) {
  res.json(req.user);
};

/**
 * Create a user
 */
exports.create = function(req, res) {
  var user = new User(req.body); 
  user.save(function(err) {
    if (err){
		return res.status(500).json({
			success: false, 
			message: 'Error when saving.' 
		});
	} 
    res.json(user);
  });
};

/**
 * Update a user
 */
exports.update = function(req, res) {
  User.update({ _id: req.user._id }, req.body, { }, function(err, updatedUser) {
    if (err) return res.status(500).json({
			success: false, 
			message: 'Error when updating.' 
		});
    res.json(updatedUser);
  });
};

/**
 * Remove a user
 */
exports.remove = function(req, res) {
    var user = req.user;
    user.remove(function (err) {
        if (err) return res.status(500).json({
            success: false,
            message: 'Error when deleting.'
        });
        res.json({message: 'Successfully deleted'});
    });
}

exports.register = function(req, res) {
    User.findOne({
            email: req.body.email
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                var newUser = new User(req.body);
                newUser.save(function (err) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: 'Error when savingddd.'
                        });
                    }
                    var token = jwt.sign(newUser, config.key, {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    res.status(201).json({success: true, message: 'Registration is successful!.'});
                    var regMail = email(req, 'Registration Confirmation', token);
                    nodemail.sendEmail(regMail);
                });
            } else if (user) {
                res.status(406).json({success: false, message: 'User already exist!.'});
            }
        }
    );
}

exports.confirmRegistration = function(req, res) {
    var token = util.getParam(req, 'token');

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.key, function(err, decoded) {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                User.update({_id: decoded._doc._id}, {isActive: true}, function(err, user) {
                    if (err) {
                        return res.status(498).json({
                            success: false,
                            message: 'User not updated.'
                        });
                    }
                    res.redirect('/#/sign-in');
                });
            }
        });

    } else {
        // if there is no token
        return res.status(403).json({ success: false, message: 'Failed to authenticate token.' })
    }
}

exports.forgotPassword = function(req, res) {
    var token = jwt.sign(req.body.email, config.key, {
        expiresIn: 86400 // expires in 24 hours
    });
    res.status(201).json({success: true, message: 'Token saving is created successfully!.'});
    var resetMail = email(req, 'Password Reset', token);
    nodemail.sendEmail(resetMail);
}

exports.resetPassword = function(req, res) {
    var token = util.getParam(req, 'token');

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.key, function(err, decoded) {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other middlewares
                res.redirect('/#/password-reset?token=' + token);
            }
        });

    } else {
        // if there is no token
        return res.status(403).json({ success: false, message: 'Not Authorized.' })
    }
}

exports.changePassword = function(req, res) {
    var token = req.body.token;
    // verifies secret and checks exp
    jwt.verify(token, config.key, function(err, decoded) {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Failed to authenticate token.'
            });
        } else {
            User.findOneAndUpdate(
                {
                    email: decoded,
                    isActive: true
                },
                {
                    password: req.body.password

                },
                {
                    new: true
                },
                function (err, user) {
                    if (err) {
                        return res.status(498).json({
                            success: false,
                            message: 'User not found.'
                        });
                    }
                    res.status(200).json({
                        success: true,
                        message: 'Your password is changed!.'
                    });
                    var pwdChangedMail = email(req, 'Your password has been changed', user);
                    nodemail.sendEmail(pwdChangedMail);
                });
        }
    })
}