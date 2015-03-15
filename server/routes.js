/**
 * ROUTES
 */
var user 	= require('./security/user'),
	router  = require('express').Router()

router.get('/views/:filename', user.isAuthorized, function (request, response) {
	response.render(request.param('filename') + '.jade');
})

router.get('/views/:path/:filename', user.isAuthorized, function (request, response) {
	response.render(request.param('path') + '/' + request.param('filename') + '.jade');
})

router.get('/', function(request, response) {
	response.render(__dirname + '/public/index')
})

router.get('/auth/local', passport.authenticate('local'), function local (request, response) {
	response.redirect('/account')	
})

router.get('/auth/facebook', passport.authenticate('facebook'))

router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
function (request, response) {
 	response.redirect('/account')
})

router.get('/auth/twitter', passport.authenticate('twitter'))

router.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/' }),
function (request, response) {
 	response.redirect('/account')
})

router.get('/auth/google', passport.authenticate('google'))

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
function (request, response) {
 	response.redirect('/account')
})

router.get('/auth/github', passport.authenticate('github'))

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
function (request, response) {
 	response.redirect('/account')
})

router.get('/auth/amazon', passport.authenticate('amazon'))

router.get('/auth/amazon/callback', passport.authenticate('amazon', { failureRedirect: '/' }),
function (request, response) {
 	response.redirect('/account')
})

router.get('/auth/yahoo', passport.authenticate('yahoo'))

router.get('/auth/yahoo/callback', passport.authenticate('yahoo', { failureRedirect: '/' }),
function (request, response) {
 	response.redirect('/account')
})

router.get('/auth/vimeo', passport.authenticate('vimeo'))

router.get('/auth/vimeo/callback', passport.authenticate('vimeo', { failureRedirect: '/' }),
function (request, response) {
 	response.redirect('/account')
})

router.get('/auth/instagram', passport.authenticate('instagram'))

router.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/' }),
function (request, response) {
 	response.redirect('/account')
})

/**
 * USERS
 */
router.get('/account', user.isAuthenticated, user.account)
router.get('/logout', user.logout)

module.exports = router