var bcrypt = require("bcrypt-nodejs");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var validatePresenceOf = function (value) {
    return value && value.length;
};

function toLower (email) {
    return email.toLowerCase();
}

var UserSchema = new Schema({
    first_name: { type: String, default: ''},
    last_name: { type: String, default: ''},
    email: { type: String, validate: [validatePresenceOf, 'an email is required'], index: { unique: true }, set: toLower },
    username: { type: String, default: '' },
    password: { type: String, validate: [validatePresenceOf, 'a password is required']},
    last_change_password: { type: Date, default: ''},
    profile_pic: {type: String, default: 'human-icon.png'},
    createdAt: Date,
    updatedAt: Date,
    salt: { type: String, default: '' },
    authToken: { type: String, default: '' },
    role: { type: String, enum: ['ADMIN', 'USER'], default: 'USER'},
    isActive: { type: Boolean, default: false }
});

/*UserSchema.virtual('password').set(function(password) {
 this._password = password;
 this.salt = this.makeSalt();
 this.hashed_password = this.encryptPassword(password);
 }).get(function() { return this._password });*/

UserSchema.virtual('id')
    .get(function() {
        return this._id.toHexString();
    });

UserSchema.virtual('name').get(function() {
    return this.first_name + ' ' + this.last_name;
});

/* Pre save hook */
UserSchema.pre('save', function(next) {
    if (!validatePresenceOf(this.password)) {
        next(new Error('Invalid password'));
    }else{
        console.log('password: ' + this.password);
        if (this.isNew) {
            this.createdAt = Date.now();
            this.password = this.generateHash(this.password);
        }
        next();
    }
});

UserSchema.pre('update', function(next) {
    this.update({},{ $set: { updatedAt: new Date()} });
    if (this._update.$set.password) {
        this.update({},
            { $set:
                { password: bcrypt.hashSync(this.getUpdate().$set.password)},
                  last_change_password: Date.now()
            });
    }

    next();
});

/* methods */
UserSchema.methods = {
    //generating a hash
    generateHash: function(password) {
        //this.salt = bcrypt.genSaltSync(8);
        return bcrypt.hashSync(password);
    },
    // checking if password is valid

     validatePassword: function(password) {
        return bcrypt.compareSync(password, this.password);
     }
};

module.exports = mongoose.model('User', UserSchema);