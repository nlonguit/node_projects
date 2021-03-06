var path = require("path");
var extend = require("util")._extend;

var development = require("./env/development");
var test = require("./env/test");

var defaults = {
   root: path.normalize(__dirname + '/..'),
   key: 'kingofdragon',
   mailService: {
       service: 'Gmail',
       auth: {
           user: 'marioruiz1132015@gmail.com', // Your email id
           pass: '12345678@X' // Your password
       }
   }
};

console.log('root ' + defaults.root);
module.exports = {	
   development: extend(development,defaults),
   test: extend(test,defaults)
}[process.env.NODE_ENV || "development"]