var mongoose=require('../config/db');
var Schema=mongoose.Schema;

var movieSchema = new Schema({
  title: String,
  releaseYear: String,
  director: String,
  genre: String
});

module.exports = mongoose.model('Movie', movieSchema);