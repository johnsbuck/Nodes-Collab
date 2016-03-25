var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');
var path = require('path');

var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

router.get('/login', function(req, res, next) {
  pg.connect(connectionString, function(err, client, done) {
    client.query('SELECT pass, salt FROM users WHERE username = \'' + req.body.username +
                  '\' OR email = \'' + req.body.email + '\';',
     function(err, result) {
       if(err) {
         console.error(err);
         res.sendStatus(406);
       }else if(!result || result.rows.length === 0) {
         done();
         res.status(404).sendFile(path.join(__dirname, '../public', 'Signin.html'));
       }else {
         var hashpass = 'sha1$' + result.rows[0].salt + '$1$' + result.rows[0].pass;
         done();

         if(passHash.verify(req.body.pass, hashpass)) {
           res.status(202).sendFile(path.join(__dirname, '../public','main.html'));
         } else {
           res.status(401).sendFile(path.join(__dirname, '../public', 'Signin.html'));
         }
       }
     });
  });
});

module.exports = router;
