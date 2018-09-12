var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var authorSchema = new Schema({
    name : { type : String, required: true },
    image : { type : String }
});

module.exports = mongoose.model('ejemplo', authorSchema);
