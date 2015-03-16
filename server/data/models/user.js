var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs'),
	  Schema   = mongoose.Schema

var userSchema = new Schema(
{
  local: {
    username     : String,
    passwordHash : String
  },
  facebook: {
    token        : String,
    email        : String,
    name         : String
  },
  reddit: {
    token        : String,
    email        : String,
    name         : String
  },
  google: {
    token        : String,
    email        : String,
    name         : String
  },
  github: {
    token        : String,
    email        : String,
    name         : String
  },
  instagram: {
    token        : String,
    email        : String,
    name         : String
  },
  vimeo: {
    token        : String,
    email        : String,
    name         : String
  },
  linkedin: {
    token        : String,
    email        : String,
    name         : String
  },
  foursquare: {
    token        : String,
    email        : String,
    name         : String
  }
})

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(passwordRaw, rounds, done) {
  
  var salt = bcrypt.genSaltSync(rounds)

  // encrypt the password using bcrypt
  bcrypt.hash(passwordRaw, salt, null, done)
}

// checking if password is valid
userSchema.methods.comparePasswordAndHash = function(password, passwordHash, done) {
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

var User = mongoose.model('User', userSchema)

module.exports = User