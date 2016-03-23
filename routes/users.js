var express = require('express');
var router = express.Router();
var pg = require('pg');

var conString = '';

/* GET user */
router.get('/', function(req, res, next) {
  let query = client.query('SELECT first_name,last_name,user_name,email FROM USER WHERE username=' + req.body.username + ';');
	return query;
});

router.get('/exists', function(req, res, next) {
  let query = client.query('SELECT username FROM USER WHERE username=' + req.body.username + ';');
	if (query === null) {
		return false;
	}
	return true;
});

router.get('/exists/email', function(req, res, next) {
  let query = client.query('SELECT username FROM USER WHERE username=' + req.body.email + ';');
	if (query === null) {
		return false;
	}
	return true;
});

router.delete('/', function(req, res, next) {
  client.query('DELETE FROM USER WHERE username=' + req.body.username + ' AND pass=' + req.body.pass + ';');
});

module.exports = router;
