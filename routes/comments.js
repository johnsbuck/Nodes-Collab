var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');
var quoteFixer = require('./db_tools');

// SQL Connection
var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

/* /comments/get
 * METHOD: PUT
 *
 * Returns the comment of the given post id and a 200 status code.
 * If no post exists, return a 204 status code.
 * If error, returns 406.
 *
 * params: title AND type
 */
router.put('/get', function(req, res) {
	// Prevents SQL Injection
	req.body = quoteFixer(req.body);

	// Connects to database
	pg.connect(connectionString, function(err, client, done) {
		// Searches for comments based on title and type
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

/* /comments/post
 * METHOD: POST
 *
 * Posts comment onto given Q&A or Freelance post
 * Returns 406 if error, 404 or 403 if unable to access, and 202 otherwise.
 *
 * params: username AND pass AND title AND text AND type
 * 	optional: timestamp
 */
router.post('/post', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
		// Check username & password
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
					 // Posts Comment
						client.query('INSERT INTO comments (username, title, text, type, timestamp) VALUES (\'' +
							req.body.username + '\', \'' + req.body.title +
							'\', \'' + req.body.text + '\', \'' + req.body.type + '\', \'' + req.body.timestamp + '\');',
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
					done();
					res.sendStatus(403).end();
				}
			}
		});
	});
});

/* /comments/delete
 * METHOD: PUT
 *
 * Deletes a given post onto the database.
 * Returns 406 if error, 404 or 403 if unable to access, and 202 otherwise.
 *
 * params: username AND pass AND id
 */
 router.put('/delete', function(req, res) {
 	req.body = quoteFixer(req.body);
 	pg.connect(connectionString, function(err, client, done) {
			// Check username & password
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
						 // Delete comment
 						client.query('DELETE FROM comments WHERE id = \'' + req.body.id + '\';',
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

module.exports = router;
