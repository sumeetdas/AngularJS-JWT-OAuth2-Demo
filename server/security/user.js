function isAuthenticated (request, response, next) {
	if (request.isAuthenticated()) { 
		return next() // move on to the next middleware stack method 
	}
	else {
		response.redirect('/')	
	}
}

function isAuthorized (request, response, next) {
	/** 
	 * Right now its just checking whether or not the user is authenticated.
	 * If yes, then the user is authorized too.
	 */
	if (request.isAuthenticated) {
		return next()
	}
	else {
		response.status(401)
		response.end()
	}
}

function login () {
	
}

function logout (request, response){
	request.logout()
	response.redirect('/')
}

function account (request, response) {
	response.redirect('/#/account')	
}

module.exports = {
	login: login,
	logout: logout,
	isAuthenticated: isAuthenticated,
	isAuthorized: isAuthorized,
	account: account	
}