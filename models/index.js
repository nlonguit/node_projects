var Sequelize = require('sequelize');
var config    = require('config');

var dbConfig = config.get('Customer.dbConfig');
// initialize database connection
var sequelize = new Sequelize(
  dbConfig.dbname,
  dbConfig.dbusername,
  dbConfig.dbpassword,
  dbConfig.dboptions
);
console.log('index: ' + sequelize);
// load models
var models = [
  'User',
  'Post'
];
models.forEach(function(model) {
  module.exports[model] = sequelize.import(__dirname + '/' + model);
});

// describe relationships
(function(m) {
  m.Post.belongsTo(m.User);
  m.User.hasMany(m.Post);
})(module.exports);

// export connection
module.exports.sequelize = sequelize;