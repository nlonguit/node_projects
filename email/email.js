/**
 * Created by nlong on 4/2/2016.
 */
var ulti  = require('../util/url-util');


module.exports = function(req, subject, data){
    var appURL = ulti.buildUrl(req);

    if(subject == 'Registration Confirmation') {
        var text = 'Please access the link below to activate your account. Activation will be expired after 24 hours.';
        var confirmationUrl = appURL + '/registrationConfirm?token=' + data;
        var message = text + ' \r\n' + confirmationUrl;
        return {
            to : req.body.email,
            subject : subject,
            text : message
        }
    }
    else if (subject == 'Password Reset') {
        var text = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process. If you did not request this, please ignore this email and your password will remain unchanged.\n\n';
        var resetPasswordUrl = appURL + '/reset?token=' + data;
        var message = text + resetPasswordUrl;
        return {
            to : req.body.email,
            subject : subject,
            text : message
        }
    }
    else if (subject == 'Your password has been changed') {
        var text = 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + data.email + ' has just been changed.\n';
        return {
            to : data.email,
            subject : subject,
            text : text
        }
    }
}