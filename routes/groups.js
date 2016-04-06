var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');
var quoteFixer = require('./db_tools');

var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

/* Returns the post of the given groupname, the group permissions and a 200 status code.
 * If no post exists, return a 204 status code.
 */
router.put('/get/info', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT * FROM group, user_group_perms WHERE groupname=\'' + req.body.groupname + '\';',
		function(err, result) {
			done();
			if(err) {
				res.sendStatus(400).end();
			} else if (!result || result.rows.length == 0) {
				res.sendStatus(406).end();
			} else {
				if (result.rows[0].privacy === 2) {
					//store results
					var groupInfo = result.rows;

					//Authorization
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
								client.query(sqlQuery,
									function(err, result) {
										if(err) {
											console.error(err);
											res.sendStatus(406).end();
										} else {
											res.status(206).send(groupInfo).end();
										}
									});
								}else {
			            res.sendStatus(403).end();
			          }
							}
						});
				}else {
					res.status(200).send(result.rows).end();
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
	pg.connect(connectionString, function(err, client,done) {
		client.query('INSERT INTO groups (groupname, privacy) VALUES ' +
			'(\'' + req.body.groupname + '\', \'' + req.body.privacy + '\'); ' +
			'INSERT INTO user_group_perms (username, groupname, perms) VALUES ' +
			'(\'' + req.body.username + '\', \'' + req.body.groupname + ', 0);',
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
		client.query('SELECT pass, salt FROM user_group_perms INNER JOIN users ON ' +
			'ugp.username = \'' + req.body.username +'\' AND ugp.perms = 0 AND ' +
			'ugp.groupname=\'' + req.body.groupname + '\';',
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
		client.query('SELECT pass, salt FROM user_group_perms INNER JOIN users ON ' +
			'ugp.username = \'' + req.body.username +'\' AND ugp.perms = 0 AND ' +
			'ugp.groupname=\'' + req.body.groupname + '\';',
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
					client.query('INSERT INTO user_group_perms (username, groupname, perms) VALUES (\'' +
 						req.body.newuser + '\', \'' + req.body.groupname + '\', \'' + req.body.perms + ');',
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
					res.sendStatus(403).end();
				}
			}
		});
	});
});

/* Deletes a user from group onto the database.
 */
router.delete('/delete/user', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT pass, salt FROM user_group_perms INNER JOIN users ON ' +
			'ugp.username = \'' + req.body.username +'\' AND (ugp.perms = 0 OR ugp.username = \'' + req.body.deluser +
			'\') AND ugp.groupname=\'' + req.body.groupname + '\';',
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
					client.query('DELETE FROM user_group_perms WHERE username=\'' + req.body.deluser +
 					 		'\' AND WHERE groupname=\'' + req.body.groupname + '; ' +
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
          res.sendStatus(403).end();
        }
			}
		});
	});
});

module.exports = router;
