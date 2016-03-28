var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

/* /get
 * Method: PUT (Should be GET)
 *
 * Returns all tags connected to a single post.
 */
app.put('/get', function(req, res) {
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT * FROM tags WHERE post_id=\'' + req.body.id + '\';',
		function(err, result) {
			if(err) {
				console.error(err);
				res.sendStatus(406);
			}else if(!result || result.rows.length === 0) {
				res.sendStatus(204);
			}else {
				res.status(202).send(result.rows[0]);
			}
		});
	});
});

/* /get/tag
 * Method: PUT (Should be GET)
 *
 * Returns one tag connected to a post.
 */
app.put('/get/tag', function(req, res) {
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT * FROM tags WHERE post_id=\'' + req.body.id + '\' AND tag=\'' + req.body.tag + '\';',
		function(err, result) {
			if(err) {Adds
				console.error(err);
				res.sendStatus(406);
			}else if(!result || result.rows.length === 0) {
				res.sendStatus(204);
			}else {
				res.status(202).send(result.rows[0]);
			}
		});
	});
});

/* /post
 * Method: POST
 *
 * Adds a single tag connected to a post. Requires the poster's username and password to proceed.
 */
app.post('/post', function(req, res) {
	pg.connect(connectionString, function(err, client, done) {
		client.query('INSERT INTO tags VALUES (\'' + req.body.id + '\', \'' + req.body.tag + '\');',
		function(err, result) {
			if(err) {
				console.error(err);
				res.sendStatus(406);
			}else {
				res.sendStatus(202);
			}
		});
	});
});

/* /delete
 * Method: DELETE
 *
 * Deletes all tags connected to a post. Requires the poster's username and password to proceed.
 */
app.delete('/delete', function(req, res) {
	pg.connect(connectionString, function(err, client, done) {
		client.query('DELETE FROM tags WHERE post_id=\'' + req.body.id + '\';',
		function(err, result) {
			if(err) {
				console.error(err);
				res.sendStatus(406);
			}else {
				res.sendStatus(202);
			}
		});
	});
});

/* /delete/tag
 * Method: DELETE
 *
 * Deletes a single tag connected to a post. Requires the poster's username and password to proceed.
 */
app.delete('/delete/tag', function(req, res) {
	pg.connect(connectionString, function(err, client, done) {
		client.query('DELETE FROM tags WHERE post_id=\'' + req.body.id + '\' AND tag=\'' + req.body.tag + '\';',
		function(err, result) {
			if(err) {
				console.error(err);
				res.sendStatus(406);
			}else {
				res.sendStatus(202);
			}
		});
	});
});

module.exports = router;
