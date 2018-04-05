var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var versionSchema = new Schema({
	nombre: { type : String, required: true},
	desc: { type : String },
	version: { type : String, required: true},
	forzar: { type : Boolean, required: true},
	activar: { type: Boolean }
});

module.exports = mongoose.model('version', versionSchema);