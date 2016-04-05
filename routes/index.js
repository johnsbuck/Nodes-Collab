var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');
var path = require('path');

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
         res.sendStatus(406);
       }else if(!result || result.rows.length === 0) {

         res.sendStatus(406);
       }else {
         var hashpass = 'sha1$' + result.rows[0].salt + '$1$' + result.rows[0].pass;
         if(passHash.verify(req.body.pass, hashpass)) {
           res.status(202).sendFile(path.join(__dirname, '../public','main.html'));
         } else {
           res.status(401).sendFile(path.join(__dirname, '../public', 'Signin.html'));
         }
       }
     });
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
