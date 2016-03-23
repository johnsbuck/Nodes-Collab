var express = require('express');
var router = express.Router();

/* Returns the post of the given post id and a 200 status code.
 * If no post exists, return a 204 status code.
 */
app.get('/', function(req, res) {
	client.query('SELECT * FROM POST WHERE id=' + req.body.id + ';');
	return query;
});

/* Posts a given post onto the database.
 */
app.post('/', function(req, res) {
	client.query('INSERT INTO POST VALUES (' + req.body + ');');
});

/* Deletes a given post onto the database.
 */
app.delete('/', function(req, res) {
	client.query('DELETE FROM POST WHERE id=' + req.body.id +';');
});

module.exports = router;
