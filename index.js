var express 	= require('express'),
	bodyParser 	= require('body-parser'),
	expressJwt 	= require('express-jwt'),
	jwt 		= require('jsonwebtoken'),
	mongoose 	= require('mongoose'),
	uriUtil 	= require('mongodb-uri'),
	dbConfig 	= require('./config/mongo'),
	router      = require('./server/router'),
	passport 	= require('./server/passport')

var environmentMode = process.env.NODE_ENV || 'development'
 
var app = express()

app.set('view engine', 'jade')
app.set('views', __dirname + '/public/views')
app.set('port', (process.env.PORT || 5000))

// to parse application/json
app.use(bodyParser.json())

// required for passport
app.use(passport.initialize())

app.use('/', router)

app.use(express.static(__dirname + '/public'))
app.use('/lib', express.static(__dirname + '/bower_components'))
app.use('/scripts', express.static(__dirname + '/public/scripts'))
app.use('/styles', express.static(__dirname + '/public/styles'))
app.use('/images', express.static(__dirname + '/public/images'))

dbConfig = dbConfig[environmentMode]

/* 
 * Mongoose by default sets the auto_reconnect option to true.
 * We recommend setting socket options at both the server and replica set level.
 * We recommend a 30 second connection timeout because it allows for 
 * plenty of time in most operating environments.
 */
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } }
 
/*
 * Mongoose uses a different connection string format than MongoDB's standard.
 * Use the mongodb-uri library to help you convert from the standard format to
 * Mongoose's format.
 */

var mongodbUri = 'mongodb://' + dbConfig['username'] + ':' + dbConfig['password'] + '@'
				 + dbConfig['host'] + ':' + dbConfig['port'] + '/' + dbConfig['databaseName']

var mongooseUri = uriUtil.formatMongoose(mongodbUri)
 
mongoose.connect(mongooseUri, options)
var conn = mongoose.connection             
 
conn.on('error', console.error.bind(console, 'connection error:'))

conn.once('open', function() {
	app.listen(app.get('port'), function() {
  		console.log("Node app is running at localhost:" + app.get('port'))
	})
})