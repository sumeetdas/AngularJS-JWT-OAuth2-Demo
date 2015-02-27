var passport 	= require('passport'),
	User 		= require('./data/models/user'),
    config      = require(__dirname + '/config/passport'),
    strategy    = {
        facebook  : require('passport-facebook'),
        twitter   : require('passport-twitter'),
        google    : require('passport-google'),
        github    : require('passport-github'),
        amazon    : require('passport-amazon'),
        vimeo     : require('passport-vimeo'),
        instagram : require('passport-instagram'),
        yahoo     : require('passport-yahoo')
    }

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function (user, done) {
	done(null, user.id)
})

// deserializeUser is passed a function that will return the user the
// belongs to an id.
passport.deserializeUser(function (userId, done) {
	User.findOne({_id: userId}, function (err, user) {
   		done(err, user)
 	})
})

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use('local', new LocalStrategy(
 // This is the callback function it will be passed the email and
 // password that have been submited.
 function (username, password, done) {
 	// We need to look up the user by email address
   	User.findOne({'local.username': username}, function (err, user) {
    	if (err) {
       		return done(err, false, { message: 'An Error occured' })
     	}
     	// no user then an account was not found for that email address
     	if (!user) {
       		return done(err, false, { message: 'Username or password is not correct' })
     	}
     	// If we have a user lets compare the provided password with the
     	// user's passwordHash
     	User.comparePasswordAndHash(password, user.passwordHash, function (err, valid) {
	       	if (err) {
	        	return done(err)
	       	}
	       	// if the passoword is invalid return that 'Invalid Password' to the user
	       	if (!valid) {
	        	return done(null, false, { message: 'Username or password is not correct' })
	       	}
	       	return done(err, user)
    	})
	})
}))

function StrategyGenerator (strategyName) {
    function findOrCreateUser (accessToken, refreshToken, profile, done) {
        // find the user in the database based on their [strategyName] id
        User.findOne({strategyName + '.id': profile.id}, function execute (err, user) {
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
                // if there is no user found with that [strategyName] id, create them
                var newUser = new User()

                // set all of the [strategyName] information in our user model
                newUser[strategyName].id    = profile.id // set the users [strategyName] id
                newUser[strategyName].token = token // we will save the token that [strategyName] provides to the user
                newUser[strategyName].name  = profile.name.givenName + ' ' + profile.name.familyName // look at the passport user profile to see how names are returned
                newUser[strategyName].email = profile.emails[0].value // [strategyName] can return multiple emails so we'll take the first

                // save our user to the database
                newUser.save(function(err) {
                    if (err) {
                        throw err
                    }

                    // if successful, return the new user
                    return done(null, newUser)
                })
            }
        })    
    }
    return new strategy[strategyName + 'Strategy'](config['' + strategyName], findOrCreateUser)
}

passport.use('facebook', StrategyGenerator('facebook'))

passport.use('twitter', StrategyGenerator('twitter'))

passport.use('google', StrategyGenerator('google'))

passport.use('github', StrategyGenerator('github'))

passport.use('amazon', StrategyGenerator('amazon'))

passport.use('yahoo', StrategyGenerator('yahoo'))

passport.use('vimeo', StrategyGenerator('vimeo'))

passport.use('instagram', StrategyGenerator('instagram'))