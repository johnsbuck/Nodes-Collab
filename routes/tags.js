var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');
var quoteFixer = require('./db_tools');

var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

/* /tag/get
 * Method: PUT (Should be GET)
 *
 * Returns all tags connected to a single post.
 * Returns 406 if error, otherwise 202 or 204.
 *
 * params: title AND type
 */
router.put('/get', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT * FROM tags WHERE title=\'' + req.body.title + '\' AND type=\'' + req.body.type +'\';',
		function(err, result) {
			done();
			if(err) {
				console.error(err);
				res.sendStatus(406).end();
			}else if(!result || result.rows.length === 0) {
				res.sendStatus(204).end();
			}else {
				res.status(202).send(result.rows).end();
			}
		});
	});
});

/* /tag/get/tag
 * Method: PUT (Should be GET)
 *
 * Returns one tag connected to a post.
 * Returns 406 if error, otherwise 204 or 202.
 *
 * params: title AND type AND tag
 */
router.put('/get/tag', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT * FROM tags WHERE post_id=\'' + req.body.title + '\' AND type=\'' + req.body.type + '\' AND tag=\'' + req.body.tag + '\';',
		function(err, result) {
			done();
			if(err) {
				console.error(err);
				res.sendStatus(406).end();
			}else if(!result || result.rows.length === 0) {
				res.sendStatus(204).end();
			}else {
				res.status(202).send(result.rows[0]).end();
			}
		});
	});
});

/* /tag/post
 * Method: POST
 *
 * Adds a single tag connected to a post. Requires the poster's username and password to proceed.
 * Returns 406 if error, 404 or 403 if unable to access, otherwise 202.
 *
 * params: username AND pass AND title AND type AND tag
 */
router.put('/create', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT pass, salt FROM users WHERE username = \'' + req.body.username +'\';',
		 function(err, result) {
			 if(err) {
				 done();
				 console.error(err);
				 res.sendStatus(406).end();
			 }else if(!result || result.rows.length === 0) {
				 done();
				 res.sendStatus(404).end();
			 }else {
				 var hashpass = 'sha1$' + result.rows[0].salt + '$1$' + result.rows[0].pass;

				 if(passHash.verify(req.body.pass, hashpass)) {
					client.query('INSERT INTO tags (title, type, tag) VALUES (\'' + req.body.title + '\', \'' + req.body.type + '\', \'' + req.body.tag + '\');',
					function(err, result) {
						done();
						if(err) {
							console.error(err);
							res.sendStatus(406).end();
						}else {
							res.sendStatus(202).end();
						}
					});
				} else {
					res.sendStatus(403).end();
				}
			}
		});
	});
});

/* /tag/delete
 * Method: DELETE
 *
 * Deletes all tags connected to a post. Requires the poster's username and password to proceed.
 * Returns 406 if error, 404 or 403 if unable to access, otherwise 201.
 *
 * params: username AND pass AND title AND type
 */
router.delete('/delete', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT pass, salt FROM users WHERE username = \'' + req.body.username +'\';',
		 function(err, result) {
			 if(err) {
				 done();
				 console.error(err);
				 res.sendStatus(406).end();
			 }else if(!result || result.rows.length === 0) {
				 done();
				 res.sendStatus(404).end();
			 }else {
				 var hashpass = 'sha1$' + result.rows[0].salt + '$1$' + result.rows[0].pass;

				 if(passHash.verify(req.body.pass, hashpass)) {
					client.query('DELETE FROM tags WHERE title=\'' + req.body.title + '\' AND type =\'' + req.body.type + '\';',
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
					res.sendStatus(403).end();
				}
			}
		});
	});
});

/* /tag/delete/tag
 * Method: DELETE
 *
 * Deletes a single tag connected to a post. Requires the poster's username and password to proceed.
 * Returns 406 if error, 404 or 403 if unable to access, otherwise 201.
 *
 * params: username AND pass AND title AND type AND tag
 */
router.delete('/delete/tag', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT pass, salt FROM users WHERE username = \'' + req.body.username +'\';',
		 function(err, result) {
			 if(err) {
				 done();
				 console.error(err);
				 res.sendStatus(406).end();
			 }else if(!result || result.rows.length === 0) {
				 done();
				 res.sendStatus(404).end();
			 }else {
				 var hashpass = 'sha1$' + result.rows[0].salt + '$1$' + result.rows[0].pass;

				 if(passHash.verify(req.body.pass, hashpass)) {
					client.query('DELETE FROM tags WHERE title=\'' + req.body.title + '\' AND type=\'' + req.body.type + '\' AND tag=\'' + req.body.tag + '\';',
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
					res.sendStatus(403).end();
				}
			}
		});
	});
});

/* /tag/edit/tag
 * Method: PUT
 *
 * Edits a given tag
 * Returns 406 if error, 404 or 403 if unable to access, otherwise 201.
 *
 * params: username AND pass AND tag AND title AND type AND new[tag]
 */
router.put('/edit/tag', function(req, res) {
	// Nothing new to change
  if(!req.body.new) {
    res.sendStatus(406).end();
  }

	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done){
		client.query('SELECT pass, salt FROM users WHERE username = \'' + req.body.username +'\';',
		 function(err, result) {
			 if(err) {
				 done();
				 console.error(err);
				 res.sendStatus(406).end();
			 }else if(!result || result.rows.length === 0) {
				 done();
				 res.sendStatus(404).end();
			 }else {
				 var hashpass = 'sha1$' + result.rows[0].salt + '$1$' + result.rows[0].pass;

				 if(passHash.verify(req.body.pass, hashpass)) {
					client.query('UPDATE FROM tags SET tag=\''+ req.body.new.tag + '\' WHERE title=\'' + req.body.title + '\' AND type=\'' + req.body.type + '\' AND tag=\'' + req.body.tag + '\';',
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
					 res.sendStatus(403).end();
				 }
			 }
		 });
	});
});

module.exports = router;
