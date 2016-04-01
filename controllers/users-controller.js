var User = require('../models/user');
var config = require('../config/config');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

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
            res.status(500).send({message: "Error occured while saving"});
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
		res.status(500).send({message: "Error occured while querying"});
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
		return res.status(500).send({
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
    if (err) return res.status(500).send({
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
        if (err) return res.status(500).send({
            success: false,
            message: 'Error when deleting.'
        });
        res.json({message: 'Successfully deleted'});
    });
}

exports.register = function(req, res) {
    console.log('register req: ' + req.body);
    User.findOne({
            email: req.body.email
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                var newUser = new User(req.body);
                newUser.save(function (err) {
                    if (err) {
                        res.status(500).send({
                            success: false,
                            message: 'Error when saving.'
                        });
                    }
                    res.status(201).send({success: true, message: 'Registration is successful!.'});
                });
            } else if (user) {
                res.status(406).send({success: false, message: 'User already exist!.'});
            }
        }
    );
}
