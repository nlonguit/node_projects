var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BearSchema   = new Schema({
    name: String
});

var Bear = module.exports = mongoose.model('Bear', BearSchema);