var passport 	= require('passport'),
	User 		= require('./data/models/user'),
    config      = require('../config/passport'),
    strategy    = {
        local       : require('passport-local').Strategy,
        facebook    : require('passport-facebook').Strategy,
        google      : require('passport-google-oauth').OAuth2Strategy,
        github      : require('passport-github').Strategy,
        vimeo       : require('passport-vimeo-oauth2').Strategy,
        instagram   : require('passport-instagram').Strategy,
        linkedin    : require('passport-linkedin-oauth2').Strategy,
        foursquare  : require('passport-foursquare').Strategy,
        reddit      : require('passport-reddit').Strategy
    }

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use('local', new strategy.local(
 // This is the callback function it will be passed the email and
 // password that have been submited.
 function (username, password, done) {
 	// We need to look up the user by email address
   	User.findOne({'local.username': username}, function (err, user) {
    	if (err) {
            return done(err, false, { message: 'Internal Server Error' })
     	}
     	// no user then an account was not found for that email address
     	if (!user) {
       		return done(err, false, { message: 'Username or password is not correct' })
     	}
        // If we have a user let's compare the provided password with the
     	// user's passwordHash
     	user.comparePasswordAndHash(password, user.local.passwordHash, function (err, isMatching) {
	       	if (err) {
	        	return done(err)
	       	}
	       	// if the password is invalid return that 'Invalid Password' to the user
	       	if (!isMatching) {
	        	return done(null, false, { message: 'Username or password is not correct' })
	       	}
	       	return done(err, user)
    	})
	})
}))

function StrategyGenerator (provider) {
    function findOrCreateUser (accessToken, refreshToken, profile, done) {
        // find the user in the database based on their [provider] id
        var strategyId = provider + '.id'
        var query = {}
        query[provider + '.id'] = profile.id
        
        // asynchronous verification, for effect...
        process.nextTick(function execute () {
            User.findOne(query, function execute (err, user) {
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err) {
                    return done(err)
                }
                // if the user is found, then log them in
                if (user) {
                    return done(null, user) // user found, return that user
                } 
                else {
                    if (!!profile.name && typeof profile.name === 'object') {
                        profile.name = profile.name.givenName || 'John Doe'
                    }
                    // if there is no user found with that [provider] id, create them
                    var newUser = new User
                    // set all of the [provider] information in our user model
                    newUser[provider].id    = profile.id // set the users [provider] id
                    newUser[provider].token = accessToken // we will save the token that [provider] provides to the user
                    newUser[provider].name  = profile.displayName || profile.username 
                                              || profile.name || profile.name.givenName || 'John Doe'
                                              
                    if (profile.emails && profile.emails[0]) {
                        newUser[provider].email = profile.emails[0].value // [provider] can return multiple emails so we'll take the first    
                    }
                    // save our user to the database
                    newUser.save(function(err) {
                        if (err) {
                            return done(err)
                        }

                        // if successful, return the new user
                        return done(null, newUser)
                    })
                }
            }) 
        })    
    }

    return new strategy[provider](config['' + provider], findOrCreateUser)
}

passport.use(StrategyGenerator('facebook'))

passport.use(StrategyGenerator('google'))

passport.use(StrategyGenerator('github'))

passport.use(StrategyGenerator('linkedin'))

passport.use(StrategyGenerator('reddit'))

passport.use(StrategyGenerator('vimeo'))

passport.use(StrategyGenerator('instagram'))

passport.use(StrategyGenerator('foursquare'))

module.exports = passport