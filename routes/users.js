var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

<<<<<<< HEAD
/* GET user */
=======
/* /get
 * Method: PUT (Should be GET)
 *
 * Gets the description of a single user that either matches their email or
 * their username.
 */
>>>>>>> 09f5f989f808aefc6bd8ddff2764b18a741db429
router.put('/get', function(req, res, next) {
  pg.connect(connectionString, function(err, client, done) {
    var where_clause = null;
    console.log(req.body);
    if (req.body.username) {
      where_clause = 'username = \'' + req.body.username + '\'';
    }else if (req.body.email) {
      where_clause = 'email = \'' + req.body.email + '\'';
    }

    console.log(where_clause);

    client.query('SELECT first_name, last_name, username, email, gender ' +
      'FROM users WHERE ' + where_clause + ';',
      function(err, result) {
        done();
        console.log(result);

        if(err) {
          console.error(err);
          res.sendStatus(406);
        }else if(!result || result.rows.length === 0) {
          res.sendStatus(204);
        }else {
          res.status(202).send(result.rows[0]);
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
  pg.connect(connectionString, function(err, client, done) {
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
            client.query('DELETE FROM users WHERE username = \'' + req.body.username +
            '\' AND pass = \'' + result.rows[0].pass + '\';',
            function(err, result) {
              done();

              if(err) {
                console.error(err);
                res.sendStatus(406);
              } else {
                res.sendStatus(202);
              }
            });
          }else {
            res.sendStatus(406);
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
  pg.connect(connectionString, function(err, client, done) {
    console.log(req.body);
    var hashlist = passHash.generate(req.body.pass).split('$');
    pass = hashlist[3];
    salt = hashlist[1];
    console.log(hashlist);
    client.query('INSERT INTO users (username, pass, salt, email, first_name, last_name, gender) VALUES (\'' + req.body.username + '\', \'' +
      pass + '\', \'' + salt + '\', \'' +
      req.body.email + '\', \'' + req.body.first_name + '\', \'' +
<<<<<<< HEAD
      req.body.last_name + '\', \'' + req.body.dob + '\');',
=======
      req.body.last_name + '\', \'' + req.body.gender + '\');',
>>>>>>> 09f5f989f808aefc6bd8ddff2764b18a741db429
      function(err, result) {
        done();

        if(err) {
          console.error(err);
          res.status(406).send('406 Not Acceptable - Username already taken');
        }else {
          res.sendStatus(201);
        }
      });
  });
});

/* /edit/pass
 * Method: PUT
 *
 * Edits the password for a user. Requires their password to continue.
 */
router.put('/edit/pass', function(req, res, next) {
  pg.connect(connectionString, function(err, client, done) {
    client.query('SELECT pass, salt FROM users WHERE username = \'' + req.body.username +'\';',
     function(err, result) {
       if(err) {
         done();

         console.error(err);
         res.sendStatus(406);
       }else if(!result || result.rows.length === 0) {
         done();
         res.sendStatus(404);
       }else {
         var hashpass = 'sha1$' + result.rows[0].salt + '$1$' + result.rows[0].pass;
         console.log(passHash.verify(req.body.pass, hashpass));
         if(passHash.verify(req.body.pass, hashpass)) {
           var hashlist = passHash.generate(req.body.newpass).split('$');
           client.query('UPDATE users SET pass = \'' + hashlist[3] +
            '\', salt = \'' + hashlist[1] + '\' WHERE username = \'' +
            req.body.username + '\';',
            function(err, result) {
              done();

              if(err) {
                console.err(err);
                res.sendStatus(406);
              }else {
                res.sendStatus(202);
              }
            });
        }else {
          res.sendStatus(406);
        }
      }
    });
  });
});

module.exports = router;
