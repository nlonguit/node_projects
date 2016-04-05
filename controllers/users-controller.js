var User = require('../models/user');
var config = require('../config/config');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var email = require('../email/email');
var nodemail = require('../email/nodemail');
var VerificationToken = require('../models/verification-token');
var util = require('../util/url-util');
var moment = require('moment');
var crypto = require('crypto');

exports.setup = function(req,res){
    var user = new User({
        name:"Narendra",
        email:"narendrasoni2@gmail.com",
        username: "narendrasoni1989"
    });

    console.log("------ create---- is called.... ");
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
    console.log('req body: ' + JSON.stringify(req.body));
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
                    var vrfToken = new VerificationToken({registeredUser: newUser.id, type: 'ACT'});
                    vrfToken.save(function (err) {
                        if(err) {
                            return res.status(500).json({
                                success: false,
                                message: 'Error when saving token.'
                            });
                        }
                        res.status(201).json({success: true, message: 'Registration is successful!.'});
                        var regMail = email(req, 'Registration Confirmation', vrfToken.token);
                        nodemail.sendEmail(regMail);
                    })
                });
            } else if (user) {
                res.status(406).json({success: false, message: 'User already exist!.'});
            }
        }
    );
}

exports.confirmRegistration = function(req, res) {
    var tokenString = util.getParam(req, 'token');
    console.log('token string: ' + tokenString);
    VerificationToken.findOneAndUpdate({token: tokenString, type: 'ACT'}, {token: undefined}, {new: true}, function(err, verificationToken) {
        if (err) {
            return res.status(498).json({
                success: false,
                message: 'Token not found.'
            });
        }
        console.log('verification: ' + verificationToken);
        if( !verificationToken.isValid() ) {
            return res.status(417).json({
                success: false,
                message: 'Token is not valid.'
            });
        } else {
            User.findOneAndUpdate({_id: verificationToken.registeredUser}, {isActive: true},{new: true}, function(err, user) {
                if (err) {
                    return res.status(498).json({
                        success: false,
                        message: 'User not found.'
                    });
                }
                res.redirect('/#/sign-in');
            });
        }

    })
}

exports.forgotPassword = function(req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) throw err;
        if (!user) {
            return res.status(498).json({
                success: false,
                message: 'No account with that email address exists.'
            });
        } else {
            console.log('go to send emailvv');
            var vrfToken = new VerificationToken({registeredUser: user.id, type: 'RST'});
            vrfToken.save(function (err, token) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Error when saving token.'
                    });
                }
                console.log('go to send email');
                res.status(201).json({success: true, message: 'Token saving is successful!.'});
                var resetMail = email(req, 'Password Reset', vrfToken.token);
                nodemail.sendEmail(resetMail);
            });

        }
    });
}

exports.resetPassword = function(req, res) {
    console.log('req url: ' + req.url);
    var tokenString = util.getParam(req, 'token');
    console.log('token string: ' + tokenString);
    VerificationToken.findOne({token: tokenString, type: 'RST'}, function(err, verificationToken) {
        console.log('reset token: ' + JSON.stringify(verificationToken));
        if (err) {
            return res.status(498).json({
                success: false,
                message: 'Token not found.'
            });
        }
        if( !verificationToken.isValid() ) {
            return res.status(417).json({
                success: false,
                message: 'Token is not valid.'
            });
        } else {
            res.redirect('/#/password-reset?token=' + verificationToken.token);
        }
    });
}

exports.changePassword = function(req, res) {
    console.log('reset token: ' + JSON.stringify(req.body.token));
    VerificationToken.findOneAndUpdate(
        {
            token: req.body.token,
            type: 'RST'
        },
        {
            token : undefined
        },
        {
            new: true
        },
        function(err, verificationToken) {
            console.log('reset token: ' + JSON.stringify(verificationToken));
            if (err) {
                return res.status(498).json({
                    success: false,
                    message: 'Token not found.'
                });
            }
            User.findOneAndUpdate(
                {
                    _id: verificationToken.registeredUser,
                    isActive: true
                },
                {password: req.body.password},
                {new: true},
                function(err, user) {
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
    );
}