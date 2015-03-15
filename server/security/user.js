var jwt 		= require('jsonwebtoken'),
	tokenConfig = require('../../config/token'),
	User 		= require('../data/models/user')

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
		response.status(401).end()
	}
}

function signup (request, response) {
	console.log(request.body)
	var username 		= request.body.username,
		password 		= request.body.password,
		confirmPassword	= request.body.confirmPassword,
		BCRYPT_ROUNDS   = 50,
		salt

	if (password !== confirmPassword) {
		response.status(401).send('Passwords do not match!')
	}

	function createUser (err, hash) {
		if (err) {
			throw err
		}
		else {
			this.newUser.local.passwordHash = hash
			// save our user to the database
            this.newUser.save(function (err, user) {
                if (err) {
                	response.status(401).send('User could not be saved!')
                }
                else {
                	var jwtTokenBody = {
                		id 		 : user._id,
                		provider : 'local',
                		name 	 : username
                	}
                	//user has been created thus we create a JWT token
		    		var token = jwt.sign(jwtTokenBody, tokenConfig.secret, { expiresInMinutes: 60*5 })
		    		return response.send(token).end()	
                }
            })
		}
	}

	User.findOne({'local.username': username}, function (err, user) {
		if (err) {
			return response.status(401).send('Internal Server Error')
		}
 		if (user) {
			return response.status(403).send('This username has been taken.')
		} else {
			this.newUser = new User 
			this.newUser.local.username = username
			this.newUser.generateHash(password, BCRYPT_ROUNDS, createUser.bind(this))
		}
	})
}

function logout (request, response){
	request.logout()
	response.status(201).end()
}

module.exports = {
	signup: signup,
	logout: logout,
	isAuthenticated: isAuthenticated,
	isAuthorized: isAuthorized
}