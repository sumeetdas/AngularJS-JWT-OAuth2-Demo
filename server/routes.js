/**
 * ROUTES
 */
var user = require('./security/user')

app.get('/views/:filename', user.isAuthorized, function (request, response) {
	response.render(request.param('filename') + '.jade');
})

app.get('/views/:path/:filename', user.isAuthorized, function (request, response) {
	response.render(request.param('path') + '/' + request.param('filename') + '.jade');
})

app.get('/', function(request, response) {
	response.render(__dirname + '/public/index')
})

app.get('/auth/local', passport.authenticate('local'), function local (request, response) {
	response.redirect('/account')	
})

app.get('/auth/facebook', passport.authenticate('facebook'))

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
function (request, response) {
 	response.redirect('/account')
})

app.get('/auth/twitter', passport.authenticate('twitter'))

app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/' }),
function (request, response) {
 	response.redirect('/account')
})

app.get('/auth/google', passport.authenticate('google'))

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
function (request, response) {
 	response.redirect('/account')
})

app.get('/auth/github', passport.authenticate('github'))

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
function (request, response) {
 	response.redirect('/account')
})

app.get('/auth/amazon', passport.authenticate('amazon'))

app.get('/auth/amazon/callback', passport.authenticate('amazon', { failureRedirect: '/' }),
function (request, response) {
 	response.redirect('/account')
})

app.get('/auth/yahoo', passport.authenticate('yahoo'))

app.get('/auth/yahoo/callback', passport.authenticate('yahoo', { failureRedirect: '/' }),
function (request, response) {
 	response.redirect('/account')
})

app.get('/auth/vimeo', passport.authenticate('vimeo'))

app.get('/auth/vimeo/callback', passport.authenticate('vimeo', { failureRedirect: '/' }),
function (request, response) {
 	response.redirect('/account')
})

app.get('/auth/instagram', passport.authenticate('instagram'))

app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/' }),
function (request, response) {
 	response.redirect('/account')
})

/**
 * USERS
 */
app.get('/account', user.isAuthenticated, user.account)
app.get('/logout', user.logout)