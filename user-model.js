const mongoose = require("mongoose");
Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const saltRounds = 10;

let UserSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  displayName: { type: String, required: true }
});

UserSchema.pre("save", function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(saltRounds, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // set the hashed password back on our user document
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(plainTextPassword, cb) {
  bcrypt.compare(plainTextPassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    console.log(isMatch);
    return cb(null, isMatch);
  });
};

var reasons = (UserSchema.statics.failedLogin = {
  NOT_FOUND: "username incorrect, please try again",
  PASSWORD_INCORRECT: "password incorrect, please try again"
});

UserSchema.statics.getAuthenticated = function(username, password, cb) {
  this.findOne({ username: username }, function(err, user) {
    if (err) return cb(err);

    // make sure the user exists
    if (!user) {
      return cb(err, null, reasons.NOT_FOUND);
    }
    // test for a matching password
    user.comparePassword(password, function(err, isMatch) {
      if (err) return cb(err, null, reasons.PASSWORD_INCORRECT);

      // check if the password was a match
      if (isMatch) {
        return cb(null, user, reasons);
      }
      if (!isMatch) {
        console.log("incorrect password");
        return cb(err, null, reasons.PASSWORD_INCORRECT);
      }
    });
  });
};

module.exports = mongoose.model("User", UserSchema);
