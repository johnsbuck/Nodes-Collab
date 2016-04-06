var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');
var quoteFixer = require('./db_tools');

var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

/* /get
 * Method: PUT (Should be GET)
 *
 * Returns all tags connected to a single post.
 */
router.put('/get', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT * FROM tags WHERE post_id=\'' + req.body.id + '\';',
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

/* /get/tag
 * Method: PUT (Should be GET)
 *
 * Returns one tag connected to a post.
 */
router.put('/get/tag', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT * FROM tags WHERE post_id=\'' + req.body.id + '\' AND tag=\'' + req.body.tag + '\';',
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

/* /post
 * Method: POST
 *
 * Adds a single tag connected to a post. Requires the poster's username and password to proceed.
 */
router.put('/create', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
		client.query('INSERT INTO tags VALUES (\'' + req.body.id + '\', \'' + req.body.tag + '\');',
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

/* /delete
 * Method: DELETE
 *
 * Deletes all tags connected to a post. Requires the poster's username and password to proceed.
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
					client.query('DELETE FROM tags WHERE post_id=\'' + req.body.id + '\';',
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

/* /delete/tag
 * Method: DELETE
 *
 * Deletes a single tag connected to a post. Requires the poster's username and password to proceed.
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
					client.query('DELETE FROM tags WHERE post_id=\'' + req.body.id + '\' AND tag=\'' + req.body.tag + '\';',
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
					client.query('UPDATE FROM tags SET tag=\''+ req.body.new.tag + '\' WHERE post_id=\'' + req.body.id + '\' AND tag=\'' + req.body.tag + '\';',
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
					 res.sendStatus(403);
				 }
			 }
		 });
	});
});

module.exports = router;
