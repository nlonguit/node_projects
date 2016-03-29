var bcrypt = require("bcrypt-nodejs");
var crypto = require('crypto');
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var validatePresenceOf = function (value) {
   return value && value.length;
};

var UserSchema = new Schema({
	name: { type: String, default: '' },
	email: { type: String, validate: [validatePresenceOf, 'an email is required'], index: { unique: true } },
	username: { type: String, default: '' },
	hashed_password: { type: String, default: '' },
	profile_pic: {type: String, default: 'human-icon.png'},
	createdAt: Date, 
	updatedAt: Date,
	salt: { type: String, default: '' },
   authToken: { type: String, default: '' }
});

UserSchema.virtual('password').set(function(password) {
   this._password = password;
   this.salt = this.makeSalt();
   this.hashed_password = this.encryptPassword(password);
    }).get(function() { return this._password });

UserSchema.virtual('id')
	.get(function() {
	  return this._id.toHexString();
	});
	

/* Pre save hook */ 
UserSchema.pre('save', function(next) {  
   if (!validatePresenceOf(this.password)) {
      next(new Error('Invalid password'));
   }else{
		if (this.isNew) {
			this.createdAt = Date.now();
		}
		this.updatedAt = Date.now();
		next();
   }
});

/* methods */
UserSchema.methods = {
  //generating a hash
  generateHash: function(password) {
	  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },
  // checking if password is valid
  /*
  validPassword: function(password) {
	  return bcrypt.compareSync(password, this.local.password);
  },
  */
  
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function (password) {
    if ( !password )  {
		return '';
	};	
    var encrypred;
    try {		
      encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex');	  
      return encrypred;
    } catch (err) {
      return '';
    }
  },

  /**
   * Validation is not required if using OAuth
   */
/*
  skipValidation: function() {
    return ~oAuthTypes.indexOf(this.provider);
  }*/
};

module.exports = mongoose.model('User', UserSchema);