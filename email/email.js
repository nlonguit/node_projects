/**
 * Created by nlong on 4/2/2016.
 */
var ulti  = require('../util/url-util');


module.exports = function(req, subject, token){
    var appURL = ulti.buildUrl(req);

    if(subject == 'Registration Confirmation') {
        var text = 'Please access the link below to activate your account. Activation will be expired after 24 hours.';
        var confirmationUrl = appURL + '/registrationConfirm?token=' + token;
        var message = text + " \r\n" + confirmationUrl;
        return {
            to : req.body.email,
            subject : subject,
            text : message
        }
    }
}