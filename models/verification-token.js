/**
 * Created by nlong on 4/2/2016.
 */
var mongoose = require('mongoose');
var moment = require('moment');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;

var VerificationTokenSchema = new Schema({
        token: {type: String, default: ''},
        expiryDate: {type: Date, default: ''},
        registeredUser: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        type: { type: String, enum: ['ACT', 'RST']}
});

VerificationTokenSchema.pre('save', function(next) {
    this.expiryDate = moment().add(60*24, 'minutes');
    this.token = uuid.v4();

    next();
});

VerificationTokenSchema.methods = {
    isValid: function(){
        if ( moment(this.expiryDate).diff(moment()) > 0 )
            return true;
        else
            return false;
    }
}
module.exports = mongoose.model('VerificationToken', VerificationTokenSchema);

