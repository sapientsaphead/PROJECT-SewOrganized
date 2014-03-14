// Mongoose User Model
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({ 
	facebookID: Number,
	username: String,
	email: String,
	firstname: String,
	lastname: String,
	gender: String, 
	created: String,
	city: String,
	state: String
});

// if (!User.schema.options.toObject) User.schema.options.toObject = {}

// User.schema.options.toObject.transform = function (doc, ret, options) {
// 	ret._id = ret._id.toString();
// }

var UserModel = module.exports = mongoose.model('user', UserSchema);