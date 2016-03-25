var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

/* Returns the post of the given post id and a 200 status code.
 * If no post exists, return a 204 status code.
 */
app.get('/', function(req, res) {
	client.query('SELECT * FROM TAGS WHERE id=' + req.body.id + ';');
	return query;
});

/* Posts a given post onto the database.
 */
app.post('/', function(req, res) {
	client.query('INSERT INTO TAGS VALUES (' + req.body + ');');
});

/* Deletes a given post onto the database.
 */
app.delete('/', function(req, res) {
	client.query('DELETE FROM TAGS WHERE id=' + req.body.id +';');
});

module.exports = router;
