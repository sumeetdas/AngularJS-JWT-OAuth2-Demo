var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt'),
	  Schema   = mongoose.Schema

var UserSchema = new Schema(
{
  local: {
    username     : String,
    password     : String,
  },
  facebook: {
    id           : String,
    token        : String,
    email        : String,
    name         : String
  },
  twitter: {
    id           : String,
    token        : String,
    displayName  : String,
    username     : String
  },
  google: {
    id           : String,
    token        : String,
    email        : String,
    name         : String
  },
  github: {
    id           : String,
    token        : String,
    email        : String,
    name         : String
  },
  amazon: {
    id           : String,
    token        : String,
    email        : String,
    name         : String
  },
  yahoo: {
    id           : String,
    token        : String,
    email        : String,
    name         : String
  },
  vimeo: {
    id           : String,
    token        : String,
    email        : String,
    name         : String
  }
})

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(passwordRaw, done) {
  // To speed up tests, we do a NODE_ENV check.
  // If we are in the test evironment we set the BCRYPT_COST = 1
  if (process.env.NODE_ENV === 'test') {
    BCRYPT_COST = 1
  }
  // encrypt the password using bcrypt; pass the callback function
  // `done` to bcrypt.hash()
  bcrypt.hash(passwordRaw, BCRYPT_COST, done)
}

// checking if password is valid
userSchema.methods.validPassword = function(password, passwordHash, done) {
    return bcrypt.compare(password, passwordHash, done)
}

userSchema.methods.hasRole = function (role) {
  for (var i = 0; i < this.roles.length; i++) {
    if (this.roles[i] === role) {
      // if the role that we are checking matches the 'role' we are
      // looking for return true
      return true
    }
  }
  // if the role does not match return false
  return false
}

var User = mongoose.model('User', UserSchema)

module.exports = User