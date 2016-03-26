var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');
var path = require('path');

var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

router.put('/login', function(req, res, next) {
  console.log(req.body);
  pg.connect(connectionString, function(err, client, done) {
    client.query('SELECT pass, salt FROM users WHERE email = \'' + req.body.email + '\';',
     function(err, result) {
       console.log(result);
       if(err) {
         console.error(err);
         res.sendStatus(406);
       }else if(!result || result.rows.length === 0) {
         done();
         console.log(result);
         res.status(404).sendFile(path.join(__dirname, '../public', 'Signin.html'));
       }else {
         var hashpass = 'sha1$' + result.rows[0].salt + '$1$' + result.rows[0].pass;
         done();

         if(passHash.verify(req.body.pass, hashpass)) {
           console.log("test");
           res.status(202).sendFile(path.join(__dirname, '../public','main.html'));
         } else {
           res.status(401).sendFile(path.join(__dirname, '../public', 'Signin.html'));
         }
       }
     });
  });
});

module.exports = router;
