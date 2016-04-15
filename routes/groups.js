var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');
var quoteFixer = require('./db_tools');

var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

/* /get
 * METHOD: PUT (Should be GET)
 *
 * Used to retrieve the members inside of a given group. Requires authorization.
 */
router.put('/get/members', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
		//client.query('SELECT username, email, perms FROM groups INNER JOIN user_group_perms AS ugp ON ugp.groupname=\'' + req.body.groupname + '\';',
		client.query('SELECT privacy ' +
									'FROM groups ' +
									'WHERE groupname =\'' + req.body.groupname + '\';',
		function(err, result) {
			if(err) {
				res.sendStatus(400).end();
			} else if (!result || result.rows.length == 0) {
				res.sendStatus(406).end();
			} else {
				if (result.rows[0].privacy === 1) {
					//Authorization
					client.query('SELECT pass, salt FROM users INNER JOIN user_group_perms AS ugp ON users.username = \'' + req.body.username +
						'\' AND ugp.username = \'' + req.body.username + '\' AND ugp.groupname = \'' + req.body.groupname + '\';',
					 function(err, result) {
						 if(err) {
							 done();
							 console.error(err);
							 res.sendStatus(406).end();
						 }else if(!result || result.rows.length === 0) {
							 done();
							 res.sendStatus(406).end();
						 }else {
							 var hashpass = 'sha1$' + result.rows[0].salt + '$1$' + result.rows[0].pass;

							 if(passHash.verify(req.body.pass, hashpass)) {
								client.query('SELECT username, email, perms FROM users JOIN user_group_perms USING (username) WHERE groupname=\'' + req.body.groupname + '\';',
									function(err, result) {
										console.log(result.rows);
										done();
										if(err) {
											console.error(err);
											res.sendStatus(406).end();
										} else if(!result || result.rows.length === 0) {
											res.sendStatus(403).end();
										} else {
											res.status(206).send(result.rows).end();
										}
									});
								}else {
									done();
			            res.sendStatus(403).end();
			          }
							}
						});
				}else {
					client.query('SELECT username, email, perms FROM users JOIN user_group_perms USING (username) WHERE groupname=\'' + req.body.groupname + '\';',
						function(err, result) {
							done();
							if(err) {
								console.error(err);
								res.sendStatus(406).end();
							} else {
								res.status(206).send(result.rows).end();
							}
					});
				}
			}
		});
	});
});


/* /get/user
 * METHOD: PUT (Should be GET)
 *
 * Used to retrieve the groups that a particular user is a part of. Requires authorization.
 */
router.put('/get/groups', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
		//Authorization
		client.query('SELECT pass, salt FROM users WHERE username = \'' + req.body.username + '\';',
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
					// client.query('SELECT groupname, privacy, perms FROM groups INNER JOIN user_group_perms AS ugp ON ugp.username=\'' + req.body.username + '\' AND (groups.privacy =\'0\'' + +
 					//' OR (ugp.username =\'' + req.body.username + '\' AND ugp.perms =\'1\'));',
					client.query('SELECT groupname, privacy, perms ' +
					'FROM groups ' +
					'JOIN user_group_perms USING (groupname) ' +
					'WHERE username=\'' + req.body.username + '\' AND (privacy =\'0\'' +
					' OR perms <=\'1\');',
					function(err, result) {
						console.log(result);
						if(err) {
							console.log(err);
							console.log("Breaks here");
							res.sendStatus(400).end();
						} else if (!result) {
							res.sendStatus(406).end();
						} else if (result.rows.length === 0) {
							res.sendStatus(204);
						} else {
							done();
							res.status(200).send(result.rows).end();
						}
					});
				} else {
					res.sendStatus(403).end();
				}
			}
		});
	});
});

/* /create
 * METHOD: PUT
 *
 * Creates a new group.
 */
router.put('/create', function(req, res) {
	req.body = quoteFixer(req.body);
	console.log(req.body);
	pg.connect(connectionString, function(err, client,done) {
		client.query('INSERT INTO groups (groupname, privacy) VALUES ' +
			'(\'' + req.body.groupname + '\', \'' + req.body.privacy + '\'); ' +
			'INSERT INTO user_group_perms (username, groupname, perms) VALUES ' +
			'(\'' + req.body.username + '\', \'' + req.body.groupname + '\', 0);',
		function(err, result) {
			if(err) {
				console.error(err);
				res.sendStatus(406).end();
			} else {
				res.sendStatus(202).end();
			}
		});
	});
});

/* /delete
 * METHOD: PUT
 *
 * Deletes a new group.
 */
router.put('/delete', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client,done) {
		client.query('SELECT pass, salt FROM user_group_perms AS ugp INNER JOIN users ON ' +
			'users.username = \'' + req.body.username +'\' AND ugp.perms = 0 AND ' +
			'ugp.groupname=\'' + req.body.groupname + '\' AND ugp.username = \'' + req.body.username + '\';',
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
					client.query('DELETE FROM groups WHERE groupname=\'' + req.body.groupname + '\'	;',
					function(err, result) {
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

/* Add user to group onto the database.
 */
router.put('/add/user', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT * FROM user_group_perms AS ugp INNER JOIN users ON ' +
			'users.username = \'' + req.body.username +'\' AND ugp.username = \'' + req.body.username + '\' AND ugp.perms = 0 AND ' +
			'ugp.groupname=\'' + req.body.groupname + '\';',
		 function(err, result) {
			 if(err) {
				 done();
				 console.error(err);
				 res.sendStatus(406).end();
			}else if(!result || result.rows.length === 0) {
				 done();
				 res.sendStatus(403).end();
			}else {
				console.log(result.rows);
				var hashpass = 'sha1$' + result.rows[0].salt + '$1$' + result.rows[0].pass;
				console.log("Get's here");
				console.log(passHash.verify(req.body.pass, hashpass));
				if(passHash.verify(req.body.pass, hashpass)) {
					console.log("Damn");
					client.query('INSERT INTO user_group_perms (username, groupname, perms) VALUES (\'' +
 						req.body.newuser + '\', \'' + req.body.groupname + '\', \'' + req.body.perms + '\');',
 					function(err, request) {
 						done();
 						if(err)
 						{
 							console.log(err);
 							res.sendStatus(406).end();
 						}else {
 							res.sendStatus(202).end();
 						}
 					});
				}else {
					console.log("Doesn't pass");
					done();
					res.sendStatus(403).end();
				}
			}
		});
	});
});

/* Deletes a user from group onto the database.
 */
router.put('/delete/user', function(req, res) {
	req.body = quoteFixer(req.body);
	console.log(req.body);
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT pass, salt FROM user_group_perms AS ugp INNER JOIN users ON ' +
			'ugp.username = \'' + req.body.username +'\' AND (ugp.perms = 0 OR ugp.username = \'' + req.body.deluser +
			'\') AND ugp.groupname=\'' + req.body.groupname + '\' AND users.username = \'' + req.body.username +'\' ;',
		 function(err, result) {
			 if(err) {
				 done();
				 console.error(err);
				 res.sendStatus(406).end();
			 }else if(!result || result.rows.length === 0) {
				 done();
				 res.sendStatus(403).end();
			 }else {
				 var hashpass = 'sha1$' + result.rows[0].salt + '$1$' + result.rows[0].pass;
				if(passHash.verify(req.body.pass, hashpass)) {
					client.query('DELETE FROM user_group_perms WHERE username=\'' + req.body.deluser +
 					 		'\' AND groupname=\'' + req.body.groupname + '\'; ' +
							'DELETE FROM groups WHERE NOT EXISTS(SELECT groupname FROM user_group_perms);',
 				 	function(err, request) {
						done();
						if(err) {
							console.error(err);
							res.sendStatus(406).end();
						} else {
							res.sendStatus(201).end();
						}
 				 	});
				}else {
					done();
					console.log(result);
          res.sendStatus(403).end();
        }
			}
		});
	});
});

/* /edit
 * METHOD: PUT
 *
 * Allows an admin member to edit the properties of the group.
 */
router.put('/edit', function(req, res) {
	// Nothing new to change
  if(!req.body.new) {
    res.sendStatus(406).end();
  }

	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT pass, salt FROM user_group_perms INNER JOIN users ON ' +
			'users.username = \'' + req.body.username +'\' AND ugp.username = \'' + req.body.username +
			'\' AND ugp.perms = 0 AND ' +
			'ugp.groupname=\'' + req.body.groupname + '\';',
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
					// Check what to UPDATE in group's row
					var sqlQuery = 'UPDATE groups SET';
					var columns = {'groupname': true, 'privacy': true};
					for(key in req.body.new) {
						if(key in columns) {
							sqlQuery += ' ' + key + '=\'' + req.body.new[key] + '\',';
						} else {
							console.err('INVALID COLUMN GIVEN');
							res.sendStatus(406).end();
						}
					}

					// Replace last ',' with end query.
					sqlQuery = sqlQuery.slice(0, -1) + ' WHERE username=\'' + req.body.groupname + '\';';

					client.query(sqlQuery, function(err, result) {
						done();
						if(err) {
							console.err(error);
							res.sendStatus(403).end();
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
	});
});

module.exports = router;
