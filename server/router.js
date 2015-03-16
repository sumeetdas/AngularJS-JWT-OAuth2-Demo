/**
 * ROUTES
 */
var router 	 	= require('express').Router(),
	jwt 		= require('jsonwebtoken'),
	passport 	= require('./passport'),
	user 	 	= require('./security/user'),
	tokenConfig = require('../config/token') 
	

router.get('/views/:filename', user.isAuthorized, function (request, response) {
	response.render(request.params.filename + '.jade');
})

router.get('/views/:path/:filename', user.isAuthorized, function (request, response) {
	response.render(request.params.path + '/' + request.params.filename + '.jade');
})

router.get('/', function(request, response) {
	response.render(__dirname + '/../public/index')
})

function CallBackFunctionGenerator (provider) {
	return function(req, res, next) {

		passport.authenticate(provider, function(err, user) {

			if (err) { return next(err) }

	    	if (!user) {
	      		return res.status(401).send('Could not find any user with that username')
	    	}

	    	var name = user[provider].name || user[provider].username

	    	console.log(provider, name)

	    	var jwtTokenBody = {
	    		id 		  : user._id,
	    		provider  : provider,
	    		name      : name
	    	}
	    	
		    //user has authenticated correctly thus we create a JWT token
	    	var token = jwt.sign(jwtTokenBody, tokenConfig.secret, { expiresInMinutes: 60*5 })
	    	return res.send(token).end()
	    	
	  	})(req, res, next)
	}
}

router.post('/auth/local', CallBackFunctionGenerator('local'))

router.get('/auth/facebook', passport.authenticate('facebook'))

router.get('/auth/facebook/callback', CallBackFunctionGenerator('facebook'))

router.get('/auth/google', passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }))

router.get('/auth/google/callback', CallBackFunctionGenerator('google'))

router.get('/auth/github', passport.authenticate('github'))

router.get('/auth/github/callback', CallBackFunctionGenerator('github'))

router.get('/auth/vimeo', passport.authenticate('vimeo'))

router.get('/auth/vimeo/callback', CallBackFunctionGenerator('vimeo'))

router.get('/auth/instagram', passport.authenticate('instagram'))

router.get('/auth/instagram/callback', CallBackFunctionGenerator('instagram'))

router.get('/auth/linkedin', passport.authenticate('linkedin', {state: 'SOME STATE'}))

router.get('/auth/linkedin/callback', CallBackFunctionGenerator('linkedin'))

router.get('/auth/foursquare', passport.authenticate('foursquare'))

router.get('/auth/foursquare/callback', CallBackFunctionGenerator('foursquare'))

router.get('/auth/reddit', function redditLogin (request, response, next) {

	passport.authenticate('reddit', {
		state: 'fooWeeeT14wWfvxzaws@',
		duration: 'permanent'
	})(request, response, next)	
})

router.get('/auth/reddit/callback', CallBackFunctionGenerator('reddit'))
/**
 * USERS
 */
// router.get('/account', user.isAuthenticated, user.account)
router.get('/logout', user.logout)
router.post('/signup', user.signup)

module.exports = router