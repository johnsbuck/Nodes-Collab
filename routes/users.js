var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

/* GET user */
router.get('/get', function(req, res, next) {
  pg.connect(connectionString, function(err, client, done) {
    client.query('SELECT first_name, last_name, username, email ' +
      'FROM users WHERE username = \'' + req.body.username + '\';',
      function(err, result) {
        done();

        if(err) {
          console.error(err);
          res.sendStatus(406);
        }else if(!result || result.rows.length === 0) {
          res.sendStatus(404);
        }else {
          res.status(202).send(result.rows[0]);
        }
      });
  })
});

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

router.put('/create', function(req, res, next) {
  pg.connect(connectionString, function(err, client, done) {
    var hashlist = passHash.generate(req.body.pass).split('$');
    pass = hashlist[3];
    salt = hashlist[1];
    client.query('INSERT INTO users VALUES (\'' + req.body.username + '\', \'' +
      pass + '\', \'' + salt + '\', \'' +
      req.body.email + '\', \'' + req.body.first_name + '\', \'' +
      req.body.last_name + '\');',
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
