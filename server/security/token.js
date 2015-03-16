var jwt 	= require('jsonwebtoken'),
	token 	= require('../../config/token')

function createToken(user) {
	return jwt.sign(user, token.secret, { expiresInMinutes: 60*5 });
}

module.exports = createToken
