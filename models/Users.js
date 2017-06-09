
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
  username: {type: String, lowercase: true, unique: true},
  hash: String,
  salt: String,
  userType: String,
  bio: String,
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

  return this.hash === hash;
};

UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');

  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.generateJWT = function() {

  // set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
	userType: this.userType,
    exp: parseInt(exp.getTime() / 1000),
  }, 'SECRET');
};

UserSchema.methods.addCourse = function (course) {
	this.courses.push(course._id);
	this.save();
};

//profile provides user without any of the sensitive stuff
UserSchema.methods.toProfile = function() {
	return {
		username: this.username,
		bio: this.bio
		//image
		//other stuff
	}
};

mongoose.model('User', UserSchema);
