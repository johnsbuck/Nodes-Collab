var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');

// Defaults
var port = 8000;
var host = '127.0.0.1';

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Default (should be updated for user files)
app.use('/', function(req, res) {
	var path = __dirname + '/public' + req.path;

	console.log(path);

	try {
		fs.accessSync(path, fs.F_OK);

		if (req.path == '/Signin.html' || req.path == '/NewUser.html') {
			res.status(200).sendFile(path);
			logInfo('USE', 200, path);
		} else if (req.path.indexOf('.html') > -1) {
			res.sendStatus(403);
			logInfo('USE', 403, path);
		} else {
			res.status(200).sendFile(path);
			logInfo('USE', 200, path);
		}
	} catch(e) {
		res.sendStatus(404);
		logInfo('USE', 404, path);
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
 * False otherwise. (Used for registering new users.)
 */
app.get('/exists/user', function(req, res) {
});

/* Return true if the email is in use.
 * False otherwise. (Used for registering new users.)
 */
app.get('/exists/email', function(req, res) {
});

/* Returns a user with a 200 status code.
 * If no user exists, returns a 204 status code.
 */
app.get('/get/user', function(req, res) {
});

/* Deletes a user from the database.
 */
app.get('/delete/user', function(req, res) {
});

/* Returns the post of the given post id and a 200 status code.
 * If no post exists, return a 204 status code.
 */
app.get('/get/post', function(req, res) {
});

/* Posts a given post onto the database.
 */
app.post('/post/post', function(req, res) {
});

/* Deletes a given post onto the database.
 */
app.post('/delete/post', function(req, res) {
});

/* Gets a specified comment.
 */
app.post('/get/comment', function(req, res) {
});

/* Posts a comment connected to given post id.
 */
app.post('/post/comment', function(req, res) {
});

/* Deletes a comment connected to given post id.
 */
app.delete('/delete/comment', function(req, res) {
});

/* Gets a specified group.
 */
app.get('/get/group', function(req, res) {
});

/* Posts a new group onto the database.
 */
app.post('/post/group', function(req, res) {
});

/* Deletes a group from the database.
 */
app.delete('/delete/group', function(req, res) {
});

/* Add new member to group.
 */
app.post('/group/add/member', function(req, res){
});

/* Removes user from group
 */
app.delete('/group/remove/member', function(req, res) {
});

function logInfo(method, status, path) {
	console.log(method + ' method with ' + status + ' status. Path: ' + path);
}

// Starts server
var server = app.listen(port, function () {
  console.log("Example app listening at http://%s:%s", host, port)
});
