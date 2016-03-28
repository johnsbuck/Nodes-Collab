var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

/* /get
 * Method: PUT (Should be GET)
 *
 * Returns all qa_posts.
 */
app.put('/get', function(req, res) {
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT * FROM posts WHERE type=0;',
		function(err, result) {
			if(err) {
				console.error(err);
				res.sendStatus(406);
			}else if(!result || result.rows.length === 0) {
				res.sendStatus(204);
			}else {
				res.status(202).send(result.rows);
			}
		});
	});
});

/* /get/post
 * Method: PUT (Should be GET)
 *
 * Returns a single Q&A post.
 */
app.put('/get/post', function(req, res) {
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT * FROM posts WHERE id = \'' + req.body.id + '\' AND type=\'0\';',
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

/* /post
 * Method: POST
 *
 * Submits a single Q&A POST. Requires username and password.
 */
app.post('/post', function(req, res) {
	pg.connect(connectionString, function(err, client, done) {
		client.query('INSERT INTO posts (username, timestamp, title, text, type) VALUES ' +
								'(\'' + req.body.username + '\', \'' + req.body.timestamp +'\', \'' + req.body.title + '\' ' +
								'\'' + req.body.text + '\', \'0\');',
								function(err, result) {
									if(err) {
										console.error(err);
										res.sendStatus(406);
									} else {
										res.sendStatus(206);
									}
								});
							});
});

/* /delete
 * Method: DELETE
 *
 * Deletes a single Q&A post. Requires username and password.
 */
app.delete('/delete', function(req, res) {
	pg.connect(connectionString, function(err, client, done) {
		client.query('DELETE FROM posts WHERE id = \'' + req.body.id + '\' and type=\'0\';',
								function(err, result) {
									if(err) {
										console.error(err);
										res.sendStatus(406);
									} else {
										res.sendStatus(202);
									}
								});
							});
});

/* /edit
 * Method: PUT
 *
 * Edits a single Q&A post. Requires username and password.
 */
app.put('/edit', function(req, res) {
	var sqlQuery = 'UPDATE posts SET ';
	if(req.body.text) {
		sqlQuery += 'test = \'' + req.body.text.replace('\'', '\'\'') + '\'';
	}
	if(req.body.title) {
		sqlQuery += ', title = \'' + req.body.title.replace('\'', '\'\'') + '\'';
	}

	sqlQuery += ';';

	pg.connect(connectionString, function(err, client, done) {
		client.query(sqlQuery,
								function(err, result) {
									if(err) {
										console.error(err);
										res.sendStatus(406);
									} else {
										res.sendStatus(206);
									}
								});
							});
});

module.exports = router;
