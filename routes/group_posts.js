var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');
var quoteFixer = require('./db_tools');

var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

/* /get
 * Method: PUT (Should be GET)
 *
 * Returns a set of posts of the given post's group and a 200 status code.
 * If no post exists, return a 204 status code.
 * If not authorized, return 403 status code.
 */
router.put('/get', function(req, res) {
	console.log(req.body);
	req.body = quoteFixer(req.body);
	// Connect to postgreSQL
	pg.connect(connectionString, function(err, client, done) {
		// Query group to get privacy
		client.query('SELECT * FROM groups WHERE groupname=\'' +
			req.body.groupname + '\';', function(err, result) {
			  console.log(result);
				// If error, send client error
				if(err) {
					done();
					console.log(err);
					res.sendStatus(406).end();
				// If empty, send Not Found
				}else if(!result || result.rows.length === 0) {
					done();
					console.log("Well then");
					res.sendStatus(404).end();
				// If not private, send rows
			}else if(result.rows[0].privacy !== 1){
					// Get group posts
					client.query('SELECT username, text, timestamp FROM group_posts WHERE groupname = \'' + req.body.groupname + '\';',
					function(err, result) {
						done();
						// If error, send client err
						if(err) {
							console.log(err);
							res.sendStatus(406).end();
						// If empty, send no content
						} else if (!result || result.rows.length === 0) {
							res.sendStatus(204).end();
						// Send accepted with rows
						} else {
							res.status(201).send(result.rows).end();
						}
					});
				// If private, check permission and user authentication
				}else {
					// Get perms
					client.query('SELECT perms FROM user_group_perms WHERE groupname=\'' +
						req.body.groupname + '\' AND username =\'' + req.body.username + '\';',
					function(err, result) {
						// If error, send client error
						if(err) {
							done();
							console.log(err);
							res.sendStatus(406).end();
						// If user isn't found, send Forbidden.
						} else if(!result || result.rows.length === 0) {
							done();
							res.sendStatus(403).end();
						// Authenticate otherwise
						} else {
							client.query('SELECT pass, salt FROM users WHERE username = \'' + req.body.username +'\';',
							 function(err, result) {
								 if(err) {
									 done();
									 console.error(err);
									 res.sendStatus(406).end();
								 }else if(!result || result.rows.length === 0) {
									 done();
									 console.log("THIS IS IT");
									 res.sendStatus(404).end();
								 }else {
									 var hashpass = 'sha1$' + result.rows[0].salt + '$1$' + result.rows[0].pass;

									 // If authorized
									 if(passHash.verify(req.body.pass, hashpass)) {
										// Get group posts
										client.query('SELECT username, text, timestamp FROM group_posts WHERE groupname = \'' + req.body.groupname + '\';',
										function(err, result) {
											done();
											// If error, send client err
											if(err) {
												console.log(err);
												res.sendStatus(406).end();
											// If empty, send no content
											} else if (!result || result.rows.length === 0) {
												res.sendStatus(204).end();
											// Send accepted with rows
											} else {
												res.status(201).send(result.rows).end();
											}
										});
									} else {
										done();
										res.sendStatus(403).end();
									}
								}
							});
						}
					});
				}
			});
	});
});

/* Posts a given post onto the database.
 */
router.put('/post', function(req, res) {
	req.body = quoteFixer(req.body);
	console.log(req.body);
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT perms FROM user_group_perms WHERE groupname=\'' +
			req.body.groupname + '\' AND username =\'' + req.body.username + '\';',
		function(err, result) {
			// If error, send client error
			if(err) {
				done();
				console.log(err);
				res.sendStatus(406).end();
			// If user isn't found, send Forbidden.
			} else if(!result || result.rows.length === 0) {
				done();
				res.sendStatus(403).end();
			// Authenticate otherwise
			} else {
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

						 // If authorized
						 if(passHash.verify(req.body.pass, hashpass)) {
							client.query('INSERT INTO group_posts (groupname, username, text, timestamp) VALUES (\'' +
							 	req.body.groupname + '\', \'' + req.body.username + '\', \'' + req.body.text + '\', \'' + req.body.timestamp + '\');',
							function(err, result) {
					 			done();
								// If error, send client error
					 			if(err) {
					 				console.log(err);
					 				res.sendStatus(406).end();
								// Else, return Created
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
			}
		});
	});
});

/* Deletes a given post onto the database.
 */
router.delete('/delete', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT perms FROM user_group_perms WHERE groupname=\'' +
			req.body.groupname + '\' AND username =\'' + req.body.username + '\';',
		function(err, result) {
			// If error, send client error
			if(err) {
				done();
				console.log(err);
				res.sendStatus(406).end();
			// If user isn't found, send Forbidden.
			} else if(!result || result.rows.length === 0) {
				done();
				res.sendStatus(403).end();
			// Authenticate otherwise
			} else {
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

						 // If authorized
						 if(passHash.verify(req.body.pass, hashpass)) {
							client.query('DELETE FROM group_posts WHERE groupname=\'' +
								group.body.groupname + '\'AND id=\'' + group.body.id + '\';',
							function(err, result) {
								done();

								if(err) {
									console.error(err);
									res.sendStatus(406).end();
								// If finished, send Accepted
								} else {
									res.sendStatus(201).end();
								}
							});
						 }else {
							 done();
							 res.sendStatus(403).end();
						 }
					}
				});
			}
		});
	});
});

router.put('/edit', function(req, res) {
	// Nothing new to change
  if(!req.body.new) {
    res.sendStatus(406).end();
  }

	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT * FROM group_posts WHERE id=\'' + req.body.id +
			'\' AND WHERE groupname=\'' + req.body.groupname + '\';',
		function(err, result) {
			if(err) {
				done();
				console.err(err);
				res.sendStatus(406).end();
			}else if(!result || result.rows.length == 0) {
				done();
				console.err(err);
				res.sendStatus(404).end();
			}else if(result.rows.username !== req.body.username) {
				done();
				console.err(err);
				res.sendStatus(403).end();
			}else {
				client.query('SELECT pass, salt FROM users WHERE username = \'' + result.rows[0].username +'\';',
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

						 // If authorized
						 if(passHash.verify(req.body.pass, hashpass)) {
							 // Check what to UPDATE in user's row
		           var sqlQuery = 'UPDATE group_posts SET';
		           var columns = {'text': true, 'id': true, 'groupname': true};
		           for(key in req.body.new) {
		             if(key in columns) {
		               sqlQuery += ' ' + key + '=\'' + req.body.new[key] + '\',';
		             } else {
		               console.err('INVALID COLUMN GIVEN');
		               res.sendStatus(406).end();
		             }
		           }

		           // Replace last ',' with end query.
		           sqlQuery = sqlQuery.slice(0, -1) + ' WHERE username=\'' + req.body.username + '\';';

							 client.query(sqlQuery,
							 function(err, result) {
								 done();
								 if(err) {
									 console.err(err);
									 res.sendStatus(406).end();
								 } else {
									 res.sendStatus(201).end();
								 }
							 });
						 }else {
							 done();
							 res.sendStatus(403).end();
						 }
					 }
				 });
			 }
		 });
	});
});

module.exports = router;
