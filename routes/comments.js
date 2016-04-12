var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');
var quoteFixer = require('./db_tools');

var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

/* Returns the comment of the given post id and a 200 status code.
 * If no post exists, return a 204 status code.
 */
router.put('/get', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
		console.log(req.body);
		client.query('SELECT * FROM comments WHERE title=\'' + req.body.title + '\' AND type=\'' + req.body.type + '\';',
		function(err, result) {
			done();
			if(err) {
				console.error(err);
				res.sendStatus(406).end();
			}else if(!result || result.rows.length == 0) {
				res.sendStatus(204).end();
			}else {
				res.status(200).send(result.rows).end();
			}
		});
	});
});

/* Posts a given comment connected to a post onto the database.
 */
router.post('/post', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
		client.query('INSERT INTO comments (username, title, text, type) VALUES (\'' +
			req.body.username + '\', \'' + req.body.title +
			'\', \'' + req.body.text + '\', \'' + req.body.type + '\');',
		function(err, result) {
			done();
			if(err) {
				console.error(err);
				res.sendStatus(406).end();
			}else {
				res.sendStatus(202).end();
			}
		});
	});
});

/* Deletes a given post onto the database.
 */
router.delete('/delete', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(req, res) {
		client.query('SELECT pass, salt FROM users WHERE username = \'' + req.body.username +'\';',
		 function(err, result) {
			 if(err) {
				 console.error(err);
				 res.sendStatus(406).end();
			 }else if(!result || result.rows.length === 0) {
				 done();
				 res.sendStatus(404).end();
			 }else {
				 var hashpass = 'sha1$' + result.rows[0].salt + '$1$' + result.rows[0].pass;

				 if(passHash.verify(req.body.pass, hashpass)) {
					 client.query('DELETE FROM comments WHERE id=\'' + req.body.id +'\' AND post_id=\'' + req.body.post_id +
					 	'\' AND username=\'' + req.body.username + '\';',
					 function(err, result) {
						done();
						if(err) {
							console.error(err);
				 			res.sendStatus(406).end();
						}else {
			 				res.sendStatus(201).end();
			 			}
			 		});
				 }else {
					 done();
					 res.sendStatus(403).end();
				 }
			 }
		 });
	});
});

module.exports = router;
