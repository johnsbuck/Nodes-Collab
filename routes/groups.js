var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');

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
			if (result.rows[0].privacy === 2) {
				res.sendStats(403);
			} else if(err)
			{
				res.sendStatus(400);
			} else if (!result || result.rows.length == 0) {
				res.sendStatus(406);
			} else {
				res.status(200).send(result.rows);
			}
		});
	});
});

/* Add user to group onto the database.
 */
router.post('/add/user', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
		client.query('INSERT INTO user_group_perm (username, groupname, permissions) VALUES (\'' +
			req.body.username + '\', \'' + req.body.groupname + '\', \'' + req.body.permissions + ');',
		function(err, request) {
			done();
			if(err)
			{
				console.log(err);
				res.sendStatus(406);
			}else {
				res.sendStatus(202);
			}
		});
	});
});

/* Deletes a user from group onto the database.
 */
router.delete('/delete/user', function(req, res) {
	req.body = quoteFixer(req.body);
	client.query('DELETE FROM user_group_perm WHERE username=\'' + req.body.username +
	 '\' AND WHERE groupname=\'' + req.body.groupname + ';',
 function(err, request) {

 });
});

/* quoteFixer
 * Adds a second, single quote to a message to avoid PostgeSQL injection.
 */
function quoteFixer(msg) {
	if(typeof msg === 'string') {
		return msg.replace('\'', '\'\'');
	}else if(typeof msg === 'object') {
		for(var key in msg) {
			msg[key] = quoteFixer(msg);
		}
		return msg;
	} else {
		return msg;
	}
}

module.exports = router;
