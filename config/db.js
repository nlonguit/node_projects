// Bring Mongoose into the app 
var mongoose = require( 'mongoose' ); 
var config = require('./config');

mongoose.set('debug', true);

var connect = function(){
   var options = {
      server: {
         socketOptions:{
            keepAlive : 1
         }
      }
   };
   mongoose.connect(config.db,options);
};
connect();

mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + config.db);
}); 

mongoose.connection.on('error',function (err) {
	console.log('Mongoose default connection error: ' + err);
});
mongoose.connection.on('disconnected',function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 

module.exports = mongoose;
