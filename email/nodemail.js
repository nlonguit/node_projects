/**
 * Created by nlong on 4/1/2016.
 */
var nodemailer = require('nodemailer');
var config = require('../config/config');


module.exports.sendEmail = function (mailOptions) {
    var transporter = nodemailer.createTransport(config.mailService);
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        };
    });
}
