var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');
var path = require('path');
var quoteFixer = require('./db_tools');

var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

router.put('/login', function(req, res, next) {
  req.body = quoteFixer(req.body);
  pg.connect(connectionString, function(err, client, done) {
    client.query('SELECT pass, salt FROM users WHERE email = \'' + req.body.email + '\';',
     function(err, result) {
       console.log(result);
       done();
       if(err) {
         console.error(err);
         res.sendStatus(406).end();
       }else if(!result || result.rows.length === 0) {
         res.sendStatus(406).end();
       }else {
         var hashpass = 'sha1$' + result.rows[0].salt + '$1$' + result.rows[0].pass;
         if(passHash.verify(req.body.pass, hashpass)) {
           res.sendStatus(202).end();
         } else {
           res.sendStatus(401).end();
         }
       }
     });
  });
});

module.exports = router;
