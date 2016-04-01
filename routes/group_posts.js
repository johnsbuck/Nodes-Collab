var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

/* /get/group
 * Method: PUT (Should be GET)
 *
 * Returns a set of posts of the given post's group and a 200 status code.
 * If no post exists, return a 204 status code.
 * If not authorized, return 403 status code.
 */
router.put('/get/group', function(req, res) {
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT permissions FROM user_group_perm WHERE groupname=\'' +
			req.body.groupname + '\' AND username =\'' + req.body.username + '\';',
		function(err, result) {
			if(err) {
				done();
				console.log(err);
				res.sendStatus(406);
			} else if(!result || result.rows.length === 0) {
				done();
				res.sendStatus(403);
			} else {
				client.query('SELECT pass, salt FROM users WHERE username = \'' + req.body.username +'\';',
				 function(err, result) {
					 if(err) {
						 console.error(err);
						 res.sendStatus(406);
					 }else if(!result || result.rows.length === 0) {
						 done();
						 res.sendStatus(404);
					 }else {
						 var hashpass = 'sha1$' + result.rows[0].salt + '$1$' + result.rows[0].pass;

						 if(passHash.verify(req.body.pass, hashpass)) {
							client.query('SELECT username, text, timestamp FROM group_posts WHERE groupname = \'' + req.body.id + '\';',
							function(err, result) {
								done();
								if(err) {
									console.log(err);
									res.sendStatus(406);
								} else if (!result || result.rows.length === 0) {
									res.sendStatus(204);
								} else {
									res.status(201).send(result.rows);
								}
							});
						} else {
							res.sendStatus(406);
						}
					}
				});
			}
		});
	});
});

/* Posts a given post onto the database.
 */
router.put('/post', function(req, res) {
	client.query('INSERT INTO group_posts (groupname, username, text, timestamp) VALUES (\'' +
		req.body.groupname + '\', \'' + req.body.username + '\', \'' + req.body.text + '\', \'' + req.body.timestamp + '\');',
	function(err, result) {
		done();
		if(err) {
			console.log(err);
			res.sendStatus(406);
		} else if(!result || result.rows.length == 0) {
			res.sendStatus(204);
		} else {
			res.sendStatus(202);
		}
	});
});

/* Deletes a given post onto the database.
 */
router.delete('/delete', function(req, res) {
	client.query('DELETE FROM group_posts WHERE groupname=\'' + group.body.groupname + '\'AND id=\'' + group.body.id + '\';');
});

router.put('/edit', function(req, res) {
	text = req.body.text.replace('\'', '\'\'');
	client.query('UPDATE POST SET text = \'' + req.body.text + '\'');
})

module.exports = router;
