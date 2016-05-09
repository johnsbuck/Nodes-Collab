var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');
var quoteFixer = require('./db_tools');

var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

/* /user/get
 * Method: PUT
 *
 * Gets the description of a single user that either matches their email or
 * their username.
 * Returns 406 if error, otherwise 202 or 204.
 *
 * param: username OR email
 */
router.put('/get', function(req, res, next) {
  req.body = quoteFixer(req.body);
  pg.connect(connectionString, function(err, client, done) {
    var where_clause = null;
    if (req.body.username) {
      where_clause = 'username = \'' + req.body.username + '\'';
    }else if (req.body.email) {
      where_clause = 'email = \'' + req.body.email + '\'';
    }

    client.query('SELECT currentgroup, bio, facebook, linkedin, first_name, last_name, username, email, gender ' +
      'FROM users WHERE ' + where_clause + ';',
      function(err, result) {
        done();
        console.log(result);

        if(err) {
          console.error(err);
          res.sendStatus(406).end();
        }else if(!result || result.rows.length === 0) {
          res.sendStatus(204).end();
        }else {
          res.status(202).send(result.rows[0]).end();
        }
      });
  })
});

/* /user/delete
 * Method: DELETE
 *
 * Deletes a single user. Requires their username and password to proceed.
 * Returns 406 if error, 404 or 403 if unable to access, otherwise 201.
 * param: username : string
 *        pass : string
 */
router.delete('/delete', function(req, res, next) {
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
            client.query('DELETE FROM users WHERE username = \'' + req.body.username +
            '\' AND pass = \'' + result.rows[0].pass + '\';',
            function(err, result) {
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
            res.sendStatus(406).end();
          }
        }
      });
  });
});


/* /user/create
 * Method: PUT
 *
 * Creates a new user. Requires their basic information that should match with
 * the 'NewUser.html' form.
 * Returns 406 if error, otherwise 201.
 *
 * params: username, email, first_name, last_name, gender, pass
 */
router.put('/create', function(req, res, next) {
  req.body = quoteFixer(req.body);
  console.log(req.body);
  pg.connect(connectionString, function(err, client, done) {
    var hashlist = passHash.generate(req.body.pass).split('$');
    pass = hashlist[3];
    salt = hashlist[1];
    console.log(hashlist);
    client.query('INSERT INTO users (username, pass, salt, email, first_name, last_name, gender) VALUES (\'' + req.body.username + '\', \'' +
      pass + '\', \'' + salt + '\', \'' +
      req.body.email + '\', \'' + req.body.first_name + '\', \'' +
      req.body.last_name + '\', \'' + req.body.gender + '\');',
      function(err, result) {
        done();
        if(err) {
          console.error(err);
          res.status(406).send('406 Not Acceptable - Username already taken').end();
        }else {
          done();
          res.sendStatus(201).end();
        }
      });
  });
});

/* /user/edit/pass
 * Method: PUT
 *
 * Edits the password for a user. Requires their password to continue.
 * Returns 406 if error, 404 or 403 if unable to access, otherwise 201.
 *
 * params: username OR pass OR email OR first_name OR last_name OR gender OR
 *          currentgroup OR bio OR facebook OR linkedin
 */
router.put('/edit', function(req, res, next) {
  // Nothing new to change
  if(!req.body.new) {
    res.sendStatus(406).end();
  }

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
         console.log(passHash.verify(req.body.pass, hashpass));
         if(passHash.verify(req.body.pass, hashpass)) {
           console.log(req.body.new);
           // Check what to UPDATE in user's row
           var sqlQuery = 'UPDATE users SET';
           var columns = {'username': true, 'pass': true, 'email': true, 'first_name': true, 'last_name': true,
            'gender': true, 'currentgroup': true, 'bio': true, 'facebook': true, 'linkedin': true};
           for(key in req.body.new) {
             if(key in columns) {
               sqlQuery += ' ' + key + '=\'' + req.body.new[key] + '\',';
             } else {
               console.error('INVALID COLUMN GIVEN');
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

/* /user/create/connection
 * Method: PUT
 *
 * Creates a new connection row for the passed username.
 * Returns 406 if error, 404 or 403 if unable to access, otherwise 202.
 *
 * params: current user username, pass, newuser
 */
router.put('/create/connection', function(req, res, next) {
  console.log("Entered create connection!");
  if(req.body.username === req.body.newuser) {
    res.sendStatus(406).end();
  }
  req.body = quoteFixer(req.body);
  pg.connect(connectionString, function(err, client, done) {
    client.query('SELECT pass, salt FROM users WHERE username = \'' + req.body.username +'\';',
     function(err, result) {
       if(err) {
         done();
         console.error(err);
         res.sendStatus(406).end();
       }else if(!result || result.rows.length === 0) {
         //console.log(result);
         done();
         res.sendStatus(404).end();
       }else {
         var hashpass = 'sha1$' + result.rows[0].salt + '$1$' + result.rows[0].pass;
         console.log(passHash.verify(req.body.pass, hashpass));
         if(passHash.verify(req.body.pass, hashpass)) {
          client.query('INSERT INTO connections (first_user, second_user) VALUES (\'' +
            req.body.username + '\', \'' + req.body.newuser + '\');',
          function(err, result) {
            done();
            if(err) {
              console.error(err);
              res.sendStatus(406).end();
            } else {
              //Query accepted and is returning stuff.
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

/* /user/get/connections
 * Method: PUT
 *
 * Get all the connections for a user.
 * Note that this does not require authentication.
 * param: username to get connections for.
 * Returns 406 if error, otherwise 202.
 */
router.put('/get/connections', function(req, res, next) {
  req.body = quoteFixer(req.body);
  pg.connect(connectionString, function(err, client, done) {
      client.query('SELECT * FROM connections WHERE first_user = \''+ req.body.username +'\';',
          function(err, result) {
            done();
            if(err) {
              console.error(err);
              res.sendStatus(406).end();
            } else {
              res.status(202).send(result.rows).end();
            }
        });
    });
});

/* /user/delete/connection
 * Method: DELETE
 *
 * Delete a specified username from a user's connection list.
 * Requires authentication.
 *
 * Returns 406 if error, 404 or 403 if unable to access, otherwise 201.
 * param: username
 *        user's passowrd
 *        connection's username to remove
*/
router.delete('/delete/connection', function(req, res, next) {
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
         console.log(passHash.verify(req.body.pass, hashpass));
         if(passHash.verify(req.body.pass, hashpass)) {
          client.query('DELETE FROM connections WHERE first_user = \'' + req.body.username + '\'' +
            'AND second_user = \'' + req.body.connect_user + '\';',
          function(err, result) {
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
          res.sendStatus(403).end();
        }
      }
    });
  });
});

/* /user/get/posts
 * Method: PUT (Should be GET)
 *
 * Returns all posts by a specific user. Does not require authentication.
 * Returns 406 if error, otherwise 202 or 204.
 * param: username to get posts for.
 */
router.put('/get/posts', function(req, res) {
	req.body = quoteFixer(req.body);
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT * FROM posts WHERE username = \'' + req.body.username + '\';',
		function(err, result) {
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

module.exports = router;
