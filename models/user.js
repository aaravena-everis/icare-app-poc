var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: { type : String, required: true },
	lastName: { type : String, required: true },
	password : { type : String, required: true},
	email: { type : String, required: true},
    events: [{
        type : Schema.ObjectId, ref: 'event', required: true
    }],

    telephone: { type: String },
    facebook: {type : String },
    twitter: {type : String },
    linkedin: {type : String },
    occupation: { type : String },
    company: { type: String },
    job: { type: String },
    imageurl: { type: String },
    image: { type: String },
    share: { type: Boolean, default : true },
	
	pushNotification: { type : Boolean, default : true, required : true },
	mobile_xid: { type : String},
	mobile_so: { type : String},
	
	createdDate : { type: Date, default: Date.now },
	modifiedData : { type: Date, default: Date.now },
	isEnabled : { type : Boolean, default : true, required : true }

});
module.exports = mongoose.model('user', userSchema);