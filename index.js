var express 	= require('express'),
	bodyParser 	= require('body-parser'),
	expressJwt 	= require('express-jwt'),
	jwt 		= require('jsonwebtoken'),
	Promise 	= require('bluebird'),
	dbConfig 	= require(__dirname + '/config/mongo'),
	mongoose 	= require('mongoose')

var dbUri = 'mongodb://'+ dbConfig['username'] + ':' + dbConfig['password'] + 
			'@' + dbConfig['host'] + ':' + dbConfig['port'] + '/' + dbConfig['databaseName']

mongoose.connect(dbUri)

var app = express()

app.set('view engine', 'jade')
app.set('views', __dirname + '/public/views')
app.set('port', (process.env.PORT || 5000))

// to parse application/json
app.use(bodyParser.json())

// We are going to protect /api routes with JWT
app.use('/api', expressJwt({secret: "secret"}))

app.use(app.router)

app.use(express.static(__dirname + '/public'))
app.use('/lib', express.static(__dirname + '/bower_components'))
app.use('/scripts', express.static(__dirname + '/public/scripts'))
app.use('/styles', express.static(__dirname + '/public/styles'))

app.listen(app.get('port'), function() {
  	console.log("Node app is running at localhost:" + app.get('port'))
})