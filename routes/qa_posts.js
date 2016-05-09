var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');
var quoteFixer = require('./db_tools');

var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';


/* /qa-post/get
 * Method: PUT
 *
 * Returns all qa_posts.
 * Returns 406 if error, otherwise 204 or 202.
 */
router.put('/get', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT * FROM posts WHERE type=\'0\';',
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

/* /qa-post/get/post
 * Method: PUT
 *
 * Returns a single Q&A post.
 * Returns 406 if error, otherwise returns 204 or 202.
 *
 * params: title
 */
router.put('/get/post', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT * FROM posts WHERE title = \'' + req.body.title + '\' AND type=\'0\';',
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

/* /qa-post/post
 * Method: POST
 *
 * Submits a single Q&A POST. Requires username and password.
 * Returns 406 if error, 404 or 403 if unable to access, otherwise 206.
 *
 * params: username AND pass AND title and text
 *	optional: timestamp
 */
router.post('/post', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
     client.query('SELECT pass, salt FROM users WHERE username = \'' + req.body.username +'\';',
      function(err, result) {
				done();
        if(err) {
          console.error(err);
          res.sendStatus(406).end();
        }else if(!result || result.rows.length === 0) {
          done();
          res.sendStatus(404).end();
        }else {
          var hashpass = 'sha1$' + result.rows[0].salt + '$1$' + result.rows[0].pass;

          if(passHash.verify(req.body.pass, hashpass)) {
						if(req.body.timestamp) {
							var sqlQuery = 'INSERT INTO posts (username, timestamp, title, text, type) VALUES ' +
													'(\'' + req.body.username + '\', \'' + req.body.timestamp + '\', \'' + req.body.title + '\', ' +
													'\'' + req.body.text + '\', \'0\');'
						} else {
							var sqlQuery = 'INSERT INTO posts (username, title, text, type) VALUES ' +
													'(\'' + req.body.username + '\', \'' + req.body.title + '\', ' +
													'\'' + req.body.text + '\', \'0\');'
						}
						client.query(sqlQuery,
						function(err, result) {
							if(err) {
								console.error(err);
								res.sendStatus(406).end();
							} else {
								if(req.body.tags) {
									req.body.tags.forEach(function (tag) {
										if(tag != "")
										{
											client.query(' INSERT INTO tags (title, type, tag) VALUES (\'' + req.body.title + '\', \'0\', \'' + tag + '\');',
											function(err, result) {
												if(err) {
													done();
													res.sendStatus(406).end();
												}
											});
										}
								});
							}

								done();
								res.sendStatus(206).end();
							}
						});
					}else {
            res.sendStatus(406).end();
          }
				}
			});
 	});
});

/* /qa-post/delete
 * Method: DELETE
 *
 * Deletes a single Q&A post. Requires username and password.
 * Returns 406 if error, 404 or 403 if unable to access, otherwise 202.
 *
 * params: username AND pass AND title
 */
router.put('/delete', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
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
						client.query('DELETE FROM posts WHERE title = \'' + req.body.title + '\' AND type=\'0\';',
						function(err, result) {
							done();
							if(err) {
								console.error(err);
								res.sendStatus(406).end();
							} else {
								res.sendStatus(202).end();
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

/* /qa-post/edit
 * Method: PUT
 *
 * Edits a single Q&A post. Requires username and password.
 * Returns 406 if error, 404 or 403 if unable to access, otherwise 206.
 *
 * params: username AND pass AND title AND text
 */
router.put('/edit', function(req, res) {
	// Nothing new to change
	req.body = quoteFixer(req.body);

	pg.connect(connectionString, function(err, client, done) {
		req.body = quoteFixer(req.body);
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
					// Check what to UPDATE in user's row
					client.query('UPDATE posts SET text= \'' + req.body.text + '\' WHERE title=\'' + req.body.title + '\' AND type=\'0\';',
						function(err, result) {
							done();
							if(err) {
								console.error(err);
								res.sendStatus(406).end();
							} else {
								res.sendStatus(206).end();
							}
						});
					}else {
						done();
            res.sendStatus(406).end();
          }
				}
		});
	});
});

module.exports = router;
