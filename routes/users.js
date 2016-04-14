var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');
var quoteFixer = require('./db_tools');

var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

/* /get
 * Method: PUT (Should be GET)
 *
 * Gets the description of a single user that either matches their email or
 * their username.
 */
router.put('/get', function(req, res, next) {
  req.body = quoteFixer(req.body);
  pg.connect(connectionString, function(err, client, done) {
    var where_clause = null;
    console.log(req.body);
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

/* /delete
 * Method: DELETE
 *
 * Deletes a single user. Requires their username and password to proceed.
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
                res.sendStatus(202).end();
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


/* /create
 * Method: PUT
 *
 * Creates a new user. Requires their basic information that should match with
 * the 'NewUser.html' form.
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

/* /edit/pass
 * Method: PUT
 *
 * Edits the password for a user. Requires their password to continue.
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

router.put('/create/connection', function(req, res, next) {
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
         done();
         res.sendStatus(404).end();
       }else {
         var hashpass = 'sha1$' + result.rows[0].salt + '$1$' + result.rows[0].pass;
         console.log(passHash.verify(req.body.pass, hashpass));
         if(passHash.verify(req.body.pass, hashpass)) {
          client.query('INSERT INTO connections (first_user, second_user) VALUES (\'' +
            req.body.username + '\', \'' + req.body.connect_user + ');',
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
