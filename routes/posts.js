var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

/* Returns the post of the given post id and a 200 status code.
 * If no post exists, return a 204 status code.
 */
app.get('/get', function(req, res) {
	client.query('SELECT * FROM POST WHERE id = \'' + req.body.id + '\';');
});

/* Posts a given post onto the database.
 */
app.put('/post', function(req, res) {
	client.query('INSERT INTO POST VALUES (\'' + req.body + '\');');
});

/* Deletes a given post onto the database.
 */
app.delete('/delete', function(req, res) {
	client.query('DELETE FROM POST WHERE id = \'' + req.body.id + '\';');
});

app.put('/edit', function(req, res) {
	text = req.body.text.replace('\'', '\'\'');
	client.query('UPDATE POST SET text = \'' req.body.text + '\'');
})

module.exports = router;
