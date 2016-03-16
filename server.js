var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');

// Defaults
var port = 8000;
var host = '127.0.0.1';

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Required to use files in public
app.use('/', express.static(__dirname + '/public'))

app.get('/', function(req, res) {
	var path = __dirname + 'public' + req.path;

	console.log(path);

	try {
		fs.accessSync(path, fs.F_OK);
		res.status(200).sendFile(path);
		logInfo('GET', 200, path);
	} catch(e) {
		res.sendStatus(404);
		logInfo('GET', 404, path);
	}
});

// Routes the pages (should use auth token to stop from sending main.html)
app.get('/*.html', function(req, res) {
	var path = __dirname + '/public/' + req.path;

	console.log(path);

	try {
		fs.accessSync(path, fs.F_OK);
		if (req.path == '/Signin.html' || req.path == '/NewUser.html') {
			res.status(200).sendFile(path);
			logInfo('GET', 200, path);
		} else {
			res.sendStatus(403);
			logInfo('GET', 403, path);
		}
	} catch(e) {
		res.sendStatus(404);
		logInfo('GET', 404, path);
	}
});

/* Get user information from database
 */
app.get('/login', function(req, res) {
	console.log(req.body);
	logInfo('GET', '200', '/login');
});

/* Register user into database.
 * Return 400 if user already exists.
 * Return 201 when created.
 */
app.post('/register', function(req, res) {
	console.log(req.body);
	logInfo('POST', '200', '/register');
});

/* Return true if the user does exist.
 * False otherwise.
 */
app.get('/exists/user', function(req, res) {
});

function logInfo(method, status, path) {
	console.log(method + ' method with ' + status + ' status. Path: ' + path);
}

// Starts server
var server = app.listen(port, function () {
  console.log("Example app listening at http://%s:%s", host, port)
});
