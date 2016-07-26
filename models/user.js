var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {type: String, required: true, index: { unique: true} },
  password: {type: String, required: true}
});

UserSchema.methods.comparePassword = function(candidatePassword, callback) {
  // no error, boolean indicating whether the passwords matched
  // this.password is the password in the DB
  // candidatePassword is what we received on the request
  callback(null, this.password == candidatePassword);
};

module.exports = mongoose.model('User', UserSchema);
